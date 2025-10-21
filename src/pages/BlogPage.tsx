import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './BlogPage.css';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryName: string;
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
    const apiUrl = process.env.REACT_APP_API_URL || '';
    fetch(`${apiUrl}/api/article-categories`)
      .then(res => res.json())
      .then(data => setCategories(data.sort((a, b) => a.order - b.order)))
      .catch(err => setError('Failed to load categories'));
  }, []);

  // Fetch articles when category changes
  useEffect(() => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const endpoint = category ? `${apiUrl}/api/articles/${category}` : `${apiUrl}/api/articles`;

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
          <>
            {/* Featured Transformation Stories Section */}
            {!category && articles.filter(a => a.category === 'transformation-stories').length > 0 && (
              <div className="featured-stories-section">
                <h2 className="section-title">
                  <span className="featured-badge">Featured</span>
                  Transformation Stories
                </h2>
                <p className="section-description">
                  Real-world transformation journeys from legacy to modern software organizations
                </p>
                <div className="featured-stories-grid">
                  {articles
                    .filter(a => a.category === 'transformation-stories')
                    .map(article => (
                      <article key={article.slug} className="article-card featured">
                        <div className="featured-indicator">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                          </svg>
                          Featured Story
                        </div>
                        <div className="article-meta">
                          <span className="category-badge transformation">{article.categoryName}</span>
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
                          className="read-more featured"
                        >
                          Read Transformation Story →
                        </Link>
                      </article>
                    ))}
                </div>
              </div>
            )}

            {/* Other Articles Section */}
            {!category && articles.filter(a => a.category !== 'transformation-stories').length > 0 && (
              <div className="other-articles-section">
                <h2 className="section-title">All Articles</h2>
                {articles
                  .filter(a => a.category !== 'transformation-stories')
                  .map(article => (
                    <article key={article.slug} className="article-card">
                      <div className="article-meta">
                        <span className="category-badge">{article.categoryName}</span>
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
                  ))}
              </div>
            )}

            {/* Category View - Show all articles including transformation stories */}
            {category && articles.map(article => (
              <article key={article.slug} className={`article-card ${article.category === 'transformation-stories' ? 'featured' : ''}`}>
                {article.category === 'transformation-stories' && (
                  <div className="featured-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    Featured Story
                  </div>
                )}
                <div className="article-meta">
                  <span className={`category-badge ${article.category === 'transformation-stories' ? 'transformation' : ''}`}>
                    {article.categoryName}
                  </span>
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
                  className={`read-more ${article.category === 'transformation-stories' ? 'featured' : ''}`}
                >
                  {article.category === 'transformation-stories' ? 'Read Transformation Story →' : 'Read Article →'}
                </Link>
              </article>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
