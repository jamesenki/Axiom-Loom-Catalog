import React from 'react';
import { Link } from 'react-router-dom';
import './ResumePage.css';

const ResumePage: React.FC = () => {
  return (
    <div className="resume-page">
      <div className="resume-container">
        {/* Header */}
        <header className="resume-header">
          <h1>James Simon</h1>
          <p className="resume-title">Innovation Senior Manager - Technology Strategy & Architecture</p>
          <div className="contact-info">
            <span>📞 586-275-8066</span>
            <span>✉️ jamessimonster@gmail.com</span>
            <span>
              <a href="https://www.linkedin.com/in/jamessimon586/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </span>
            <span>
              <a href="https://github.com/jamesenki" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </span>
            <span>
              <a href="https://technical.axiomloom-loom.net/" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </span>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>
            Innovation leader with deep expertise in automotive technology transformation, specializing in
            Software-Defined Vehicles (SDV), connected mobility platforms, and cloud-native architecture.
            With over a decade of experience spanning OEM engineering, cloud solution architecture at AWS,
            and innovation consulting at EY, I bridge the gap between cutting-edge technology and practical
            business value.
          </p>
          <p>
            My approach combines systems thinking with hands-on technical leadership. I architect end-to-end
            solutions—from vehicle edge computing and telematics to cloud platforms and AI-powered analytics—while
            championing engineering excellence through DevOps, agile methodologies, and continuous delivery
            practices.
          </p>
        </section>

        {/* Core Competencies */}
        <section className="resume-section">
          <h2>Core Competencies</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Technical Architecture</h3>
              <ul>
                <li>Software-Defined Vehicles (SDV)</li>
                <li>Cloud-Native Architecture (AWS)</li>
                <li>Edge Computing & Telematics</li>
                <li>Event-Driven Systems (Kafka)</li>
                <li>Microservices & APIs</li>
                <li>Digital Twin Technology</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Automotive & Mobility</h3>
              <ul>
                <li>Connected Vehicle Platforms</li>
                <li>OTA Updates & Remote Diagnostics</li>
                <li>Predictive Maintenance</li>
                <li>Fleet Management Systems</li>
                <li>ADAS & Autonomous Systems</li>
                <li>Vehicle-to-Cloud Communications</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>AI & Data</h3>
              <ul>
                <li>Machine Learning Integration</li>
                <li>Computer Vision</li>
                <li>Large Language Models (LLMs)</li>
                <li>Data Lakes & Analytics</li>
                <li>Real-Time Processing</li>
                <li>IoT Data Pipelines</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Leadership & Process</h3>
              <ul>
                <li>Innovation Strategy</li>
                <li>DevOps & CI/CD</li>
                <li>Agile/Scrum Methodologies</li>
                <li>Technical Team Leadership</li>
                <li>Architecture Governance</li>
                <li>Stakeholder Management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="resume-section">
          <h2>Professional Experience</h2>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Innovation Senior Manager</h3>
                <p className="company">Ernst & Young (EY) - Nottingham Spirk Innovation Lab</p>
              </div>
              <span className="date-range">April 2024 - Present</span>
            </div>
            <ul className="responsibilities">
              <li>Lead transformation of EY-Nottingham Spirk Lab into AI Experience Hub showcasing connected vehicle services, predictive maintenance, and autonomous systems</li>
              <li>Architect and implement working demonstrations of Software-Defined Vehicle (SDV) platforms with real-time telemetry, OTA updates, and remote diagnostics</li>
              <li>Design AI-powered solutions including computer vision for manufacturing quality control, LLM-based knowledge management, and predictive analytics</li>
              <li>Provide technical strategy consulting for automotive OEMs and Tier 1 suppliers on cloud migration, digital twin implementation, and platform modernization</li>
              <li>Develop comprehensive architecture documentation and reference implementations for client engagements</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Technical Strategy Lead - Automotive & Manufacturing</h3>
                <p className="company">Amazon Web Services (AWS)</p>
              </div>
              <span className="date-range">October 2021 - April 2024</span>
            </div>
            <ul className="responsibilities">
              <li>Authored AWS Connected Mobility Lens providing architectural best practices for building connected vehicle platforms on AWS</li>
              <li>Led technical strategy for multi-million dollar opportunities with major automotive OEMs including Ford, GM, and Stellantis</li>
              <li>Designed reference architectures for vehicle data lakes, real-time analytics, and ML-powered predictive maintenance solutions</li>
              <li>Collaborated with AWS service teams to influence product roadmaps based on automotive customer requirements</li>
              <li>Delivered workshops, webinars, and technical presentations at automotive industry conferences</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Senior Solutions Architect - Connected Vehicle Platform</h3>
                <p className="company">Stellantis (formerly FCA)</p>
              </div>
              <span className="date-range">January 2020 - October 2021</span>
            </div>
            <ul className="responsibilities">
              <li>Architected global connected vehicle platform serving 4+ million vehicles across multiple brands (Jeep, Ram, Dodge, Chrysler)</li>
              <li>Designed microservices architecture for vehicle telemetry ingestion processing 500M+ events daily using Kafka and AWS services</li>
              <li>Led implementation of remote diagnostics, OTA updates, and digital key features</li>
              <li>Established DevOps practices including CI/CD pipelines, infrastructure as code, and automated testing frameworks</li>
              <li>Mentored engineering teams on cloud-native development, event-driven architecture, and API design patterns</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Lead Solutions Architect</h3>
                <p className="company">JD Motorsports (NASCAR Team)</p>
              </div>
              <span className="date-range">2018 - 2020</span>
            </div>
            <ul className="responsibilities">
              <li>Built real-time telemetry and analytics platform for NASCAR Xfinity Series race team</li>
              <li>Designed data acquisition systems for vehicle performance monitoring and race strategy optimization</li>
              <li>Implemented cloud-based data lake for historical race data analysis and simulation</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Senior Software Engineer - Volkswagen Group Electronics</h3>
                <p className="company">Volkswagen Group of America</p>
              </div>
              <span className="date-range">2015 - 2018</span>
            </div>
            <ul className="responsibilities">
              <li>Developed embedded software for vehicle control units and infotainment systems</li>
              <li>Designed and implemented telematics communication protocols for connected car features</li>
              <li>Led integration efforts between vehicle systems and cloud-based services</li>
            </ul>
          </div>
        </section>

        {/* Certifications */}
        <section className="resume-section">
          <h2>Certifications & Training</h2>
          <div className="certifications-grid">
            <div className="cert-item">
              <h4>Professional Scrum Master I (PSM I)</h4>
              <p>Scrum.org</p>
            </div>
            <div className="cert-item">
              <h4>DevOps Culture and Mindset</h4>
              <p>University of California, Davis</p>
            </div>
            <div className="cert-item">
              <h4>AI for Everyone</h4>
              <p>DeepLearning.AI</p>
            </div>
            <div className="cert-item">
              <h4>AWS Solutions Architecture</h4>
              <p>Amazon Web Services</p>
            </div>
            <div className="cert-item">
              <h4>Automotive SPICE</h4>
              <p>VDA Automotive Industry Standard</p>
            </div>
            <div className="cert-item">
              <h4>Lean Six Sigma White Belt</h4>
              <p>Process Improvement Certification</p>
            </div>
          </div>
        </section>

        {/* Publications & Thought Leadership */}
        <section className="resume-section">
          <h2>Publications & Thought Leadership</h2>

          <div className="publication-item">
            <h4>AWS Connected Mobility Lens</h4>
            <p className="publication-source">AWS Well-Architected Framework</p>
            <p className="publication-description">
              Co-authored comprehensive architectural guidance for building connected vehicle platforms
              on AWS, covering telemetry ingestion, data lakes, ML pipelines, and security best practices.
            </p>
          </div>

          <div className="publication-item">
            <h4>Building Event-Driven Vehicle Platforms</h4>
            <p className="publication-source">AWS Architecture Blog</p>
            <p className="publication-description">
              Technical article on designing scalable, event-driven architectures for processing
              high-volume vehicle telemetry using Apache Kafka and AWS services.
            </p>
          </div>

          <div className="publication-item">
            <h4>The Future of Software-Defined Vehicles</h4>
            <p className="publication-source">Personal Blog - atascadero.wiki</p>
            <p className="publication-description">
              Series of articles exploring the transformation of automotive architecture toward
              centralized compute, OTA updates, and continuous software delivery.
            </p>
          </div>

          <div className="publication-item">
            <h4>AI-Powered Predictive Maintenance</h4>
            <p className="publication-source">Personal Blog - atascadero.wiki</p>
            <p className="publication-description">
              Deep dive into implementing ML-based predictive maintenance systems using vehicle
              telemetry data, anomaly detection, and failure prediction models.
            </p>
          </div>
        </section>

        {/* Community Involvement */}
        <section className="resume-section">
          <h2>Community Involvement</h2>
          <div className="community-item">
            <h4>Founding Member - Canton Coders</h4>
            <p>Virtual developer community originating in Southeast Michigan, focused on mentoring and
            knowledge sharing in cloud architecture, DevOps practices, and modern software development.</p>
          </div>
          <div className="community-item">
            <h4>Technical Training & Workshops</h4>
            <p>Regular instructor for AWS training sessions, DevOps workshops, and Agile/Scrum coaching
            for engineering teams.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="resume-footer">
          <Link to="/" className="back-link">← Back to Portfolio</Link>
          <p>References available upon request</p>
        </footer>
      </div>
    </div>
  );
};

export default ResumePage;
