import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">James Simon</h1>
          <p className="hero-subtitle">
            Technology and Strategy Professional
          </p>
          <div className="hero-tagline">
            AI-Powered Architecture and Engineering Solutions for Automotive, Mobility and Advanced Manufacturing
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
                    <div className="pub-title">Software-Defined Edge Architecture for Connected Vehicles</div>
                    <div className="pub-meta">AWS Blog | Technical Architecture</div>
                    <div className="pub-desc">Detailed architectural patterns for edge computing in connected vehicle solutions</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">📄</div>
                  <div className="pub-content">
                    <div className="pub-title">Feature Enrichment of Connected Mobility Solution on AWS</div>
                    <div className="pub-meta">AWS Blog | Cloud Architecture</div>
                    <div className="pub-desc">Guide to enhancing connected mobility platforms with cloud-native features</div>
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
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Software Development as a Social System</div>
                    <div className="pub-meta">Personal Blog | Conway's Law, DDD, Team Topologies</div>
                    <div className="pub-desc">How organizational structures shape architecture and the principles for intentional design</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Building High-Performing Engineering Organizations</div>
                    <div className="pub-meta">Personal Blog | Leadership & Principles</div>
                    <div className="pub-desc">The four fundamental questions, architectural principles, and tenets that guide elite teams</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Beyond Fake Agile: What True Agility Really Means</div>
                    <div className="pub-meta">Personal Blog | Agile Transformation</div>
                    <div className="pub-desc">Cutting through buzzwords to reveal genuine agility and the 12 non-negotiable principles</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Lean Software Development: Optimizing the Flow of Value</div>
                    <div className="pub-meta">Personal Blog | Lean Principles</div>
                    <div className="pub-desc">Applying lean manufacturing principles to software development for continuous improvement</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">DevOps Beyond the Buzzword</div>
                    <div className="pub-meta">Personal Blog | Culture & Practices</div>
                    <div className="pub-desc">What DevOps really means: culture, automation, measurement, and continuous delivery</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Product Thinking: From Projects to Products</div>
                    <div className="pub-meta">Personal Blog | Product Management</div>
                    <div className="pub-desc">Shifting from project-based delivery to product-centric software development</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Test-First Development: A Practical Guide</div>
                    <div className="pub-meta">Personal Blog | TDD, BDD, ATDD</div>
                    <div className="pub-desc">Using tests as design tools, specifications, and quality gatekeepers</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Policy as Code: Automated Governance That Enables Speed</div>
                    <div className="pub-meta">Personal Blog | Cloud Governance</div>
                    <div className="pub-desc">Implementing automated compliance and governance without sacrificing velocity</div>
                  </div>
                </div>
                <div className="publication-item">
                  <div className="pub-icon">✍️</div>
                  <div className="pub-content">
                    <div className="pub-title">Team Topologies: Organizing for Fast Flow</div>
                    <div className="pub-meta">Personal Blog | Organizational Design</div>
                    <div className="pub-desc">Structuring teams and interactions for optimal software delivery performance</div>
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
                  <h4>Training Delivery & Community Leadership</h4>
                  <div className="training-items">
                    <div className="training-item">
                      <span className="training-badge">AWS</span>
                      <span className="training-name">Delivered 100-300 level AWS technical and executive trainings to enterprise customers</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Cohort</span>
                      <span className="training-name">Led The Factory Co-Op Field Training cohorts for hands-on software engineering</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Digital</span>
                      <span className="training-name">Facilitated Digital Transformation White Belt Training programs</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Coach</span>
                      <span className="training-name">Dojo Challenges & Kata Fridays at Stellantis</span>
                    </div>
                    <div className="training-item">
                      <span className="training-badge">Community</span>
                      <span className="training-name">Founding Member of Canton Coders - Northeast Ohio developer community</span>
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

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-tagline">
            Building tomorrow's solutions with today's technology
          </p>
          <div className="footer-links">
            <a href="https://github.com/jamesenki" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span className="separator">•</span>
            <a href="https://www.linkedin.com/in/jamesesimon/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <span className="separator">•</span>
            <Link to="/catalog">Catalog</Link>
            <span className="separator">•</span>
            <span className="muted">Resume (Coming Soon)</span>
            <span className="separator">•</span>
            <span className="muted">Insights (Coming Soon)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
