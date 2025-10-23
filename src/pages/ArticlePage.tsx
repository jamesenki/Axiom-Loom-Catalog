import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import './ArticlePage.css';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

// Mermaid diagram component
const MermaidDiagram: React.FC<{ chart: string }> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current && chart) {
      const renderDiagram = async () => {
        try {
          // Clear previous content
          if (elementRef.current) {
            elementRef.current.innerHTML = '';

            // Create a temporary div for mermaid to render into
            const tempDiv = document.createElement('div');
            tempDiv.className = 'mermaid';
            tempDiv.textContent = chart;
            elementRef.current.appendChild(tempDiv);

            // Run mermaid on this element
            await mermaid.run({
              nodes: [tempDiv],
            });
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (elementRef.current) {
            elementRef.current.innerHTML = `<pre class="mermaid-error">Error rendering diagram: ${error}</pre>`;
          }
        }
      };
      renderDiagram();
    }
  }, [chart]);

  return (
    <div
      ref={elementRef}
      className="mermaid-diagram"
    />
  );
};

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryName: string;
  tags: string[];
  date: string;
  readingTime: number;
  content: string;
}

const ArticlePage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || '';
    fetch(`${apiUrl}/api/articles/${category}/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Article not found');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [category, slug]);

  if (loading) {
    return <div className="article-page loading">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="article-page error">
        <h1>Article Not Found</h1>
        <p>{error || 'The article you are looking for does not exist.'}</p>
        <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="article-header">
        <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        <div className="article-meta">
          <span className="category-badge">{article.categoryName}</span>
          <span className="reading-time">{article.readingTime} min read</span>
          {article.date && (
            <span className="article-date">
              {new Date(article.date).toLocaleDateString()}
            </span>
          )}
        </div>
        <h1>{article.title}</h1>
        {article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Social Media Sharing */}
      <div className="social-sharing">
        <span className="share-label">Share:</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button twitter"
          aria-label="Share on Twitter"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button linkedin"
          aria-label="Share on LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}
          className="share-button copy"
          aria-label="Copy link"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
      </div>

      <article className="article-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw as any]}
          components={{
            // Custom rendering for links to open external in new tab
            a: ({ node, ...props }) => {
              const isExternal = props.href?.startsWith('http');
              return (
                <a
                  {...props}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                />
              );
            },
            // Custom rendering for code blocks with Mermaid support
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';

              // Render Mermaid diagrams
              if (!inline && language === 'mermaid') {
                return <MermaidDiagram chart={String(children).trim()} />;
              }

              // Regular code blocks
              return inline ?
                <code className="inline-code" {...props}>{children}</code> :
                <code className={`code-block ${className || ''}`} {...props}>{children}</code>;
            }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </article>

      <footer className="article-footer">
        <Link to="/blog" className="back-to-blog-bottom">
          ← Back to All Articles
        </Link>
        <Link to={`/blog/category/${article.category}`} className="view-category">
          View More in {article.category} →
        </Link>
      </footer>
    </div>
  );
};

export default ArticlePage;
