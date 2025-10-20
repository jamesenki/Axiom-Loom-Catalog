import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './ArticlePage.css';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
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
    fetch(`/api/articles/${category}/${slug}`)
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
          <span className="category-badge">{article.category}</span>
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
            // Custom rendering for code blocks
            code: ({ node, inline, ...props }) => (
              inline ?
                <code className="inline-code" {...props} /> :
                <code className="code-block" {...props} />
            )
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
