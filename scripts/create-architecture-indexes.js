const fs = require('fs').promises;
const path = require('path');

const REPO_BASE = path.join(__dirname, '../cloned-repositories');

async function createArchitectureIndex(repoPath, repoName) {
  const archDir = path.join(repoPath, 'docs/architecture');
  const indexPath = path.join(archDir, 'index.md');
  
  try {
    await fs.access(indexPath);
    console.log(`Architecture index already exists for ${repoName}`);
    return;
  } catch {
    // Create the directory and index
    await fs.mkdir(archDir, { recursive: true });
    
    const content = `# Architecture Overview

## ${repoName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

This section provides comprehensive technical architecture documentation for the ${repoName.replace(/-/g, ' ')}.

## Architecture Documents

- [Technical Design](./technical-design.md) - High-level system architecture
- [Security Architecture](./security.md) - Security controls and compliance  
- [Deployment Guide](./deployment.md) - Infrastructure and deployment procedures

## Architecture Principles

1. **API-First Design** - All functionality exposed through well-designed APIs
2. **Cloud-Native Architecture** - Built for cloud with scalability and resilience
3. **Security by Design** - Enterprise-grade security throughout the system
4. **Domain-Driven Design** - Clear separation of business domains and contexts

## Technology Stack

- **API Gateway**: Cloud API Management
- **Compute**: Containers / Serverless
- **Data**: SQL, NoSQL, Object Storage
- **Monitoring**: Application Performance Monitoring
- **Security**: Identity Management, Key Vault

## System Context

The platform integrates with various internal and external systems to provide comprehensive functionality.

### Key Integrations
- Authentication & Authorization services
- Data analytics platforms
- Third-party service providers
- Legacy system adapters

## Next Steps

- Review the [Technical Design](./technical-design.md) for detailed architecture
- Check [Security Architecture](./security.md) for security considerations
- See [Deployment Guide](./deployment.md) for infrastructure setup
`;
    
    await fs.writeFile(indexPath, content);
    console.log(`Created architecture index for ${repoName}`);
  }
}

async function main() {
  const repos = await fs.readdir(REPO_BASE, { withFileTypes: true });
  
  for (const repo of repos) {
    if (repo.isDirectory() && !repo.name.startsWith('.')) {
      const repoPath = path.join(REPO_BASE, repo.name);
      await createArchitectureIndex(repoPath, repo.name);
    }
  }
  
  console.log('\nAll architecture index files created!');
}

main().catch(console.error);