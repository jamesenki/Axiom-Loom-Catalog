/**
 * Token Service for secure GitHub token management
 * Handles storage, retrieval, and validation of repository access tokens
 */

interface TokenInfo {
  token: string;
  accountName: string;
  accountUrl: string;
  createdAt: string;
  lastUsed?: string;
  scopes?: string[];
}

interface StoredTokens {
  [key: string]: TokenInfo; // key format: "owner/repo" or "owner/*" for org-wide tokens
}

class TokenService {
  private static STORAGE_KEY = 'eyns_github_tokens';
  private static ENCRYPTION_KEY = 'eyns_encryption_key';

  /**
   * Store a token for a specific repository or organization
   */
  static async storeToken(
    owner: string, 
    repo: string | null, 
    token: string, 
    accountName: string
  ): Promise<void> {
    const key = repo ? `${owner}/${repo}` : `${owner}/*`;
    const accountUrl = `https://github.com/${owner}`;
    
    const tokenInfo: TokenInfo = {
      token: this.encryptToken(token),
      accountName,
      accountUrl,
      createdAt: new Date().toISOString()
    };

    const tokens = this.getStoredTokens();
    tokens[key] = tokenInfo;
    
    this.saveTokens(tokens);
  }

  /**
   * Retrieve a token for a specific repository
   * Falls back to organization-wide token if available
   */
  static getToken(owner: string, repo: string): string | null {
    const tokens = this.getStoredTokens();
    
    // Try repo-specific token first
    const repoKey = `${owner}/${repo}`;
    if (tokens[repoKey]) {
      this.updateLastUsed(repoKey);
      return this.decryptToken(tokens[repoKey].token);
    }
    
    // Fall back to org-wide token
    const orgKey = `${owner}/*`;
    if (tokens[orgKey]) {
      this.updateLastUsed(orgKey);
      return this.decryptToken(tokens[orgKey].token);
    }
    
    return null;
  }

  /**
   * Get token info without decrypting the token
   */
  static getTokenInfo(owner: string, repo: string): Omit<TokenInfo, 'token'> | null {
    const tokens = this.getStoredTokens();
    const repoKey = `${owner}/${repo}`;
    const orgKey = `${owner}/*`;
    
    const tokenInfo = tokens[repoKey] || tokens[orgKey];
    if (tokenInfo) {
      const { token, ...info } = tokenInfo;
      return info;
    }
    
    return null;
  }

  /**
   * List all stored token accounts
   */
  static listAccounts(): Array<{
    key: string;
    owner: string;
    repo: string | null;
    accountName: string;
    accountUrl: string;
    createdAt: string;
    lastUsed?: string;
  }> {
    const tokens = this.getStoredTokens();
    
    return Object.entries(tokens).map(([key, info]) => {
      const [owner, repo] = key.split('/');
      return {
        key,
        owner,
        repo: repo === '*' ? null : repo,
        accountName: info.accountName,
        accountUrl: info.accountUrl,
        createdAt: info.createdAt,
        lastUsed: info.lastUsed
      };
    });
  }

  /**
   * Remove a token
   */
  static removeToken(owner: string, repo: string | null): void {
    const key = repo ? `${owner}/${repo}` : `${owner}/*`;
    const tokens = this.getStoredTokens();
    
    delete tokens[key];
    this.saveTokens(tokens);
  }

  /**
   * Validate a GitHub token by making an API call
   */
  static async validateToken(token: string): Promise<{
    valid: boolean;
    username?: string;
    scopes?: string[];
    error?: string;
  }> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const scopes = response.headers.get('X-OAuth-Scopes')?.split(', ') || [];
        
        return {
          valid: true,
          username: data.login,
          scopes
        };
      } else if (response.status === 401) {
        return {
          valid: false,
          error: 'Invalid or expired token'
        };
      } else {
        return {
          valid: false,
          error: `GitHub API error: ${response.status}`
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if we have any token for a repository
   */
  static hasToken(owner: string, repo: string): boolean {
    const token = this.getToken(owner, repo);
    return token !== null;
  }

  // Private helper methods

  private static getStoredTokens(): StoredTokens {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to retrieve stored tokens:', error);
    }
    return {};
  }

  private static saveTokens(tokens: StoredTokens): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to save tokens:', error);
      throw new Error('Unable to save authentication tokens');
    }
  }

  private static updateLastUsed(key: string): void {
    const tokens = this.getStoredTokens();
    if (tokens[key]) {
      tokens[key].lastUsed = new Date().toISOString();
      this.saveTokens(tokens);
    }
  }

  /**
   * Simple XOR encryption for basic token obfuscation
   * In production, use proper encryption or secure storage
   */
  private static encryptToken(token: string): string {
    const key = this.getEncryptionKey();
    let encrypted = '';
    
    for (let i = 0; i < token.length; i++) {
      encrypted += String.fromCharCode(
        token.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    
    return btoa(encrypted);
  }

  private static decryptToken(encrypted: string): string {
    const key = this.getEncryptionKey();
    const decoded = atob(encrypted);
    let decrypted = '';
    
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    
    return decrypted;
  }

  private static getEncryptionKey(): string {
    let key = localStorage.getItem(this.ENCRYPTION_KEY);
    
    if (!key) {
      // Generate a random key if not exists
      key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      localStorage.setItem(this.ENCRYPTION_KEY, key);
    }
    
    return key;
  }

  /**
   * Clear all stored tokens (for logout/reset)
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default TokenService;
export type { TokenInfo, StoredTokens };