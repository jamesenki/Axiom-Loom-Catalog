import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './BlogPage.css';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: number;
}

interface Category {
  slug: string;
  name: string;
  description: string;
  order: number;
  articleCount: number;
}

const BlogPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/article-categories')
      .then(res => res.json())
      .then(data => setCategories(data.sort((a, b) => a.order - b.order)))
      .catch(err => setError('Failed to load categories'));
  }, []);

  // Fetch articles when category changes
  useEffect(() => {
    setLoading(true);
    const endpoint = category ? `/api/articles/${category}` : '/api/articles';

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load articles');
        setLoading(false);
      });
  }, [category]);

  const selectedCategory = category
    ? categories.find(c => c.slug === category)
    : null;

  return (
    <div className="blog-page">
      {/* Header */}
      <header className="blog-header">
        <div className="blog-header-content">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Thought Leadership</h1>
          <p className="blog-subtitle">
            Insights on engineering excellence, organizational design, and technical practices
          </p>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="category-nav">
        <button
          className={!category ? 'active' : ''}
          onClick={() => navigate('/blog')}
        >
          All Articles ({articles.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.slug}
            className={category === cat.slug ? 'active' : ''}
            onClick={() => navigate(`/blog/category/${cat.slug}`)}
          >
            {cat.name} ({cat.articleCount})
          </button>
        ))}
      </nav>

      {/* Category Description */}
      {selectedCategory && (
        <div className="category-header">
          <h2>{selectedCategory.name}</h2>
          <p>{selectedCategory.description}</p>
        </div>
      )}

      {/* Article List */}
      <div className="article-list">
        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : articles.length === 0 ? (
          <div className="no-articles">No articles found in this category.</div>
        ) : (
          articles.map(article => (
            <article key={article.slug} className="article-card">
              <div className="article-meta">
                <span className="category-badge">{article.category}</span>
                <span className="reading-time">{article.readingTime} min read</span>
              </div>
              <h3>
                <Link to={`/blog/${article.category}/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-footer">
                {article.date && (
                  <span className="article-date">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                )}
                {article.tags.length > 0 && (
                  <div className="article-tags">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to={`/blog/${article.category}/${article.slug}`}
                className="read-more"
              >
                Read Article →
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
