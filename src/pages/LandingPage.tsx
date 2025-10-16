import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Dying Poets</h1>
          <p className="hero-subtitle">
            Where innovation meets poetry. Building the future, one line of code at a time.
          </p>
          <div className="hero-tagline">
            Portfolio of AI-Powered Architecture & Engineering Solutions
          </div>
        </div>
      </section>

      {/* Professional Profile Section */}
      <section className="profile-section">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">JS</div>
            </div>
            <div className="profile-title-area">
              <h2 className="profile-name">James Simon</h2>
              <p className="profile-role">Innovation Senior Manager, Advanced Manufacturing & Mobility</p>
              <p className="profile-company">EY | Detroit Metropolitan Area</p>
              <div className="profile-links">
                <a
                  href="https://www.linkedin.com/in/jamesesimon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  <span className="link-icon">in</span>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/jamesenki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  <span className="link-icon">{ '{' }</span>
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="profile-summary">
            <p>
              Technology leader with 10+ years of automotive industry experience, specializing in
              Software-Defined Vehicles (SDV), connected vehicle solutions, and cloud architecture.
              Currently leading advanced manufacturing and mobility projects at EY while providing
              technical leadership for the EY-Nottingham Spirk Lab, transforming it into an AI Experience Hub.
            </p>
          </div>

          <div className="profile-highlights">
            <div className="highlight-item">
              <h3>Key Achievements</h3>
              <ul>
                <li>Co-led transformation of EY-Nottingham Spirk Lab into AI Experience Hub with working demos</li>
                <li>Led cloud-based mobility solutions contributing to multi-million dollar opportunities at AWS</li>
                <li>Authored Vehicle to Cloud Communications specifications for Stellantis/FCA</li>
                <li>Pioneered connected vehicle integration projects including China market launch</li>
              </ul>
            </div>

            <div className="highlight-item">
              <h3>Core Expertise</h3>
              <div className="expertise-tags">
                <span className="tag">Software-Defined Vehicles</span>
                <span className="tag">Cloud Architecture (AWS)</span>
                <span className="tag">Connected Mobility</span>
                <span className="tag">AI & Machine Learning</span>
                <span className="tag">IoT & Digital Twin</span>
                <span className="tag">Systems Integration</span>
                <span className="tag">DevOps & Agile</span>
                <span className="tag">API Design</span>
              </div>
            </div>

            <div className="highlight-item">
              <h3>Certifications</h3>
              <div className="certifications-list">
                <div className="cert-badge">
                  <span className="cert-icon">✓</span>
                  <div className="cert-details">
                    <div className="cert-name">Professional Scrum Master I</div>
                    <div className="cert-org">Scrum.org</div>
                  </div>
                </div>
                <div className="cert-badge">
                  <span className="cert-icon">✓</span>
                  <div className="cert-details">
                    <div className="cert-name">DevOps Culture and Mindset</div>
                    <div className="cert-org">Coursera</div>
                  </div>
                </div>
                <div className="cert-badge">
                  <span className="cert-icon">✓</span>
                  <div className="cert-details">
                    <div className="cert-name">AI Engineering - Bronze</div>
                    <div className="cert-org">EY (2024)</div>
                  </div>
                </div>
                <div className="cert-badge">
                  <span className="cert-icon">✓</span>
                  <div className="cert-details">
                    <div className="cert-name">Digital Transformation White Belt</div>
                    <div className="cert-org">Leadership</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="highlight-item">
              <h3>Publications & Thought Leadership</h3>
              <div className="publications-list">
                <div className="publication-item">
                  <div className="pub-icon">📄</div>
                  <div className="pub-content">
                    <div className="pub-title">Connected Mobility Lens for AWS Well-Architected Framework</div>
                    <div className="pub-meta">AWS | Co-Author & Technical Lead</div>
                    <div className="pub-desc">Provided content, leadership and expertise for AWS's Connected Mobility architectural guidance</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">📄</div>
                  <div className="pub-content">
                    <div className="pub-title">Electric Vehicles & Battery Technology Analysis</div>
                    <div className="pub-meta">EY | Thought Leadership</div>
                    <div className="pub-desc">Developed insights on electric vehicles, battery technologies, and valuation risks in the used car market</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">📄</div>
                  <div className="pub-content">
                    <div className="pub-title">Coupon Stacking: Facts and Myths</div>
                    <div className="pub-meta">Valassis | White Paper</div>
                    <div className="pub-desc">First white paper for digital media thought leadership initiative</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">📄</div>
                  <div className="pub-content">
                    <div className="pub-title">Digital Media Security</div>
                    <div className="pub-meta">Valassis | White Paper Co-Author</div>
                    <div className="pub-desc">Co-authored with Chief Architect on digital media security best practices</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="highlight-item">
              <h3>Professional Training & Development</h3>
              <div className="training-list">
                <div className="training-category">
                  <h4>Recent Specialized Training</h4>
                  <div className="training-items">
                    <div className="training-item">
                      <span className="training-badge">AI/ML</span>
                      <span className="training-name">NVIDIA AI & Deep Learning Platforms</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Cloud</span>
                      <span className="training-name">AWS Security & Compliance Workshops</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">AI</span>
                      <span className="training-name">EY Artificial Intelligence Essentials V2</span>
                    </div>
                  </div>
                </div>
                <div className="training-category">
                  <h4>Leadership & Methodology</h4>
                  <div className="training-items">
                    <div className="training-item">
                      <span className="training-badge">Agile</span>
                      <span className="training-name">Professional Scrum Master Training</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">DevOps</span>
                      <span className="training-name">DevOps Culture and Mindset (Coursera)</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Digital</span>
                      <span className="training-name">Engineering the Digital Transformation</span>
                    </div>
                  </div>
                </div>
                <div className="training-category">
                  <h4>Training Delivery</h4>
                  <div className="training-items">
                    <div className="training-item">
                      <span className="training-badge">Coach</span>
                      <span className="training-name">Dojo Challenges & Kata Fridays at Stellantis</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Mentor</span>
                      <span className="training-name">Code Craftsmanship & Developer Community Leadership</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="highlight-item">
              <h3>Career Journey</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Innovation Senior Manager</div>
                    <div className="timeline-org">EY</div>
                    <div className="timeline-period">April 2024 - Present</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Technical Strategy Lead</div>
                    <div className="timeline-org">Amazon Web Services (AWS)</div>
                    <div className="timeline-period">October 2021 - April 2024</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Solutions Architect</div>
                    <div className="timeline-org">Stellantis (FCA)</div>
                    <div className="timeline-period">January 2020 - October 2021</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Senior Connected Applications Architect</div>
                    <div className="timeline-org">JDM Systems @ FCA Uconnect</div>
                    <div className="timeline-period">September 2017 - January 2020</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Navigation Cards */}
      <section className="main-navigation">
        <div className="nav-cards">
          {/* Axiom Loom Catalog - Active */}
          <Link to="/catalog" className="nav-card active">
            <div className="card-icon">📦</div>
            <h2>Axiom Loom Catalog</h2>
            <p>
              Explore our comprehensive collection of AI-powered architecture packages,
              complete solutions, and engineering blueprints. Built by intelligent agents,
              designed for tomorrow.
            </p>
            <div className="card-status available">Available Now</div>
            <div className="card-action">Explore Catalog →</div>
          </Link>

          {/* Resume - Coming Soon */}
          <div className="nav-card coming-soon">
            <div className="card-icon">👤</div>
            <h2>Professional Resume</h2>
            <p>
              Comprehensive professional experience, technical expertise, and career
              achievements. A story of innovation and continuous learning.
            </p>
            <div className="card-status upcoming">Coming Soon</div>
          </div>

          {/* Blog - Coming Soon */}
          <div className="nav-card coming-soon">
            <div className="card-icon">✍️</div>
            <h2>Thought Leadership</h2>
            <p>
              Insights on AI, cloud architecture, software engineering, and the future of
              technology. Essays, tutorials, and deep dives into modern development.
            </p>
            <div className="card-status upcoming">Coming Soon</div>
          </div>
        </div>
      </section>

      {/* Featured Projects Teaser */}
      <section className="featured-section">
        <h2 className="section-title">Featured Highlights</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <h3>20+ Enterprise Solutions</h3>
            <p>Production-ready architectures for automotive, IoT, and cloud platforms</p>
          </div>
          <div className="highlight-card">
            <h3>Comprehensive APIs</h3>
            <p>OpenAPI, GraphQL, gRPC, and AsyncAPI specifications with full documentation</p>
          </div>
          <div className="highlight-card">
            <h3>AI-Powered Engineering</h3>
            <p>Solutions designed and built by intelligent agents for modern challenges</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-tagline">
            Built with passion. Powered by innovation. Inspired by poetry.
          </p>
          <div className="footer-links">
            <a href="https://github.com/jamesenki" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span className="separator">•</span>
            <Link to="/catalog">Catalog</Link>
            <span className="separator">•</span>
            <span className="muted">Resume (Coming Soon)</span>
            <span className="separator">•</span>
            <span className="muted">Blog (Coming Soon)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
