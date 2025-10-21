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
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (elementRef.current && chart) {
      const renderDiagram = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          setSvg(`<pre>Error rendering diagram: ${error}</pre>`);
        }
      };
      renderDiagram();
    }
  }, [chart]);

  return (
    <div
      ref={elementRef}
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
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
