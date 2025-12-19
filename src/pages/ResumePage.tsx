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
          <p className="resume-title">Technical Architect & Platform Builder</p>
          <div className="contact-info">
            <span>586-275-8066</span>
            <span>jamessimonster@gmail.com</span>
            <span>
              <a href="https://www.linkedin.com/in/jamesesimon/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </span>
            <span>
              <a href="https://github.com/jamesenki" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </span>
          </div>
        </header>

        {/* Technical Profile */}
        <section className="resume-section">
          <h2>Technical Profile</h2>
          <p>
            Hands-on technical architect with 10+ years building enterprise-scale automotive connectivity
            platforms, cloud-native data architectures, and IoT solutions. Expert in designing and
            implementing production systems processing vehicle telemetry across millions of connected
            vehicles.
          </p>
          <p>
            <strong>Core Technologies:</strong> Vehicle-to-Cloud Architecture | Protocol Buffers | gRPC | AWS
            IoT (Core, FleetWise, Greengrass) | Terraform/HCL | Java | C++ | Python | Docker | Microservices
            | MQTT | TLS/SSL
          </p>
        </section>

        {/* Core Competencies */}
        <section className="resume-section">
          <h2>Core Competencies</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Cloud & Infrastructure</h3>
              <ul>
                <li>AWS IoT Core, FleetWise, Greengrass</li>
                <li>Lambda, EC2, S3, Kinesis</li>
                <li>API Gateway, AppSync, DynamoDB</li>
                <li>CloudFormation, CDK</li>
                <li>Azure DevOps & Cloud</li>
                <li>Docker, Amazon ECR, Terraform/HCL</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Development & Integration</h3>
              <ul>
                <li>Protocol Buffers & gRPC</li>
                <li>MQTT & REST APIs</li>
                <li>Microservices & SOA</li>
                <li>IBM Integration Broker V9</li>
                <li>Event-Driven Systems</li>
                <li>CI/CD Pipelines</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Automotive & IoT</h3>
              <ul>
                <li>Connected Vehicle Platforms</li>
                <li>Software-Defined Vehicles (SDV)</li>
                <li>Vehicle Telemetry</li>
                <li>OTA Updates</li>
                <li>Edge-to-Cloud Architecture</li>
                <li>TLS 1.2, Automotive Grade Linux</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Languages & Tools</h3>
              <ul>
                <li>Java, C++, Python</li>
                <li>VB, PHP</li>
                <li>SQL, XML DITA</li>
                <li>GitHub Enterprise, JIRA, Confluence</li>
                <li>Agile/Scrum, DevOps, TDD</li>
                <li>Data Lake Architecture</li>
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
                <h3>Innovation Senior Manager - Advanced Manufacturing & Mobility</h3>
                <p className="company">EY (Ernst & Young)</p>
              </div>
              <span className="date-range">Apr 2024 - Present</span>
            </div>
            <ul className="responsibilities">
              <li>Built full-stack Fleet Management Portal with data platform architecture, consumer-facing APIs, and working demo</li>
              <li>Created IoT & AI Industrial Monitoring demo using Coast platform for fluid monitoring and predictive maintenance</li>
              <li>Co-led EY-Nottingham Spirk Lab transformation into AI Experience Hub; rewrote IoT, Digital Twin, and Analytics demos; implemented first real ML/AI use cases</li>
              <li>Delivered comprehensive architecture packages for Fleet Management and dealer management automation systems</li>
              <li>Led SDV strategy and implementation discussions with automotive OEM clients</li>
              <li>Conducted architecture reviews for Digital Quality Seal, Mtaas, IoT-Sphere, and Road Rules</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Technical Strategy Lead - Connected Vehicle Solutions</h3>
                <p className="company">Amazon Web Services (AWS)</p>
              </div>
              <span className="date-range">Oct 2021 - Apr 2024</span>
            </div>
            <ul className="responsibilities">
              <li>Led development of comprehensive cloud-based mobility solution addressing complex automotive industry needs</li>
              <li>Architected modular platform for vehicle-cloud communication, data management, and application deployment</li>
              <li>Integrated AWS IoT FleetWise for intelligent vehicle data collection and organization</li>
              <li>Designed groundbreaking edge computing solution for connected mobility; commercialized as partner offering</li>
              <li>Built CI/CD pipeline for containerized edge applications using Amazon ECR and AWS IoT Greengrass</li>
              <li>Contributed to Connected Mobility Lens for AWS Well-Architected Framework</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Solutions Architect</h3>
                <p className="company">Stellantis (FCA)</p>
              </div>
              <span className="date-range">Jan 2020 - Oct 2021</span>
            </div>
            <ul className="responsibilities">
              <li>Authored V2C Communications specifications enabling secure, scalable data transmission across entire brand portfolio</li>
              <li>Enhanced vehicle communications using Google Protocol Buffers and MQTT, significantly boosting performance</li>
              <li>Led connected vehicle integration projects including major China market launch initiative</li>
              <li>Led Uconnect features for Connected Vehicle Program; administered GitHub Enterprise</li>
              <li>Conducted Dojo challenges and Kata Fridays immersive training; co-founded first developer community</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Senior Connected Applications Architect</h3>
                <p className="company">JDM Systems Consultants @ FCA</p>
              </div>
              <span className="date-range">Sep 2017 - Jan 2020</span>
            </div>
            <ul className="responsibilities">
              <li>Architected TLS 1.2 solutions for ECU Identity and Authentication enhancing vehicle security</li>
              <li>Led AppDynamics deployment improving DevOps processes; co-led team of 14 as APAC System Integrator (Shanghai)</li>
              <li>Streamlined global interface architecture; standardized API architecture across Uconnect ecosystem</li>
              <li>Delivered functional specs, application/API specs, sequence diagrams, DFMEA, test cases</li>
              <li>Built features: Pacifica plug-in hybrid charging, remote operations, stolen vehicle locator</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>SOA & IBM IIB V9 Analyst</h3>
                <p className="company">JDM Systems Consultants @ Volkswagen Group of Americas</p>
              </div>
              <span className="date-range">May 2014 - Jun 2016</span>
            </div>
            <ul className="responsibilities">
              <li>Implemented ten integration services using IBM Integration Broker V9 for major application replacement project</li>
              <li>Built SOA communication portal integrating Confluence, JIRA, and homegrown tools; created services registry</li>
              <li>Drove automation of builds, deployments, and documentation generation</li>
              <li>Analyzed and documented IBM MobileFirst project for global deployment</li>
            </ul>
          </div>
        </section>

        {/* Earlier Experience */}
        <section className="resume-section">
          <h2>Earlier Technical Experience</h2>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Sales Effectiveness / Proposal Analyst</h3>
                <p className="company">VisionIT</p>
              </div>
              <span className="date-range">Mar 2011 - Sep 2013</span>
            </div>
            <ul className="responsibilities">
              <li>Authored technical sales documents, RFPs, and solution proposals for IT Managed Services achieving 30%+ win rate</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Digital Media Technical/Business/Process Writer</h3>
                <p className="company">Valassis (via Teksystems)</p>
              </div>
              <span className="date-range">Oct 2009 - Dec 2010</span>
            </div>
            <ul className="responsibilities">
              <li>Drove internal/external API documentation; authored white papers including "Coupon Stacking: Facts and Myths" and "Digital Media Security"</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Senior Technical Writer / Info Developer</h3>
                <p className="company">Systems Documentation Inc @ IBM</p>
              </div>
              <span className="date-range">Sep 2006 - Mar 2009</span>
            </div>
            <ul className="responsibilities">
              <li>Developed documentation for IBM WebSphere Telecom products; maintained application testing environments running SLES 10, DB2, WebSphere; coded documentation in XML DITA</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Information Developer/Programmer Analyst</h3>
                <p className="company">CTG @ IBM</p>
              </div>
              <span className="date-range">Mar 2005 - Jun 2006</span>
            </div>
            <ul className="responsibilities">
              <li>Designed SQL queries to mine data sources; developed VB and PHP scripts for data extraction and transformation</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Senior Technical Writer / Analyst</h3>
                <p className="company">Leitch Technology</p>
              </div>
              <span className="date-range">Nov 2000 - Mar 2005</span>
            </div>
            <ul className="responsibilities">
              <li>Authored installation guides, user guides, developer guides, and help systems; created Leitch's first software developer kit</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h3>Technical Writer / Analyst</h3>
                <p className="company">Intel</p>
              </div>
              <span className="date-range">Oct 1998 - Jun 2000</span>
            </div>
            <ul className="responsibilities">
              <li>Technical and marketing writer for System Management Suite for Home Product Group's web appliance</li>
            </ul>
          </div>
        </section>

        {/* Certifications */}
        <section className="resume-section">
          <h2>Certifications & Training</h2>
          <div className="certifications-grid">
            <div className="cert-item">
              <h4>EY Applied AI - Bronze Learning</h4>
              <p>EY Artificial Intelligence (2024)</p>
            </div>
            <div className="cert-item">
              <h4>AI Technical Curriculum</h4>
              <p>NVIDIA Training Completion</p>
            </div>
            <div className="cert-item">
              <h4>Flow Framework Professional</h4>
              <p>Certified Practitioner</p>
            </div>
            <div className="cert-item">
              <h4>Visualization Technical Curriculum</h4>
              <p>NVIDIA Training Completion</p>
            </div>
          </div>
        </section>

        {/* Key Technical Achievements */}
        <section className="resume-section">
          <h2>Key Technical Achievements</h2>

          <div className="publication-item">
            <h4>V2C Protocol Design</h4>
            <p className="publication-source">Stellantis/FCA</p>
            <p className="publication-description">
              Created enterprise communications protocol for entire FCA/Stellantis brand portfolio,
              enabling secure and scalable vehicle-to-cloud data transmission.
            </p>
          </div>

          <div className="publication-item">
            <h4>AWS Connected Mobility Solution</h4>
            <p className="publication-source">Amazon Web Services</p>
            <p className="publication-description">
              Led technical development of comprehensive industry solution addressing complex
              automotive connectivity needs with modular cloud architecture.
            </p>
          </div>

          <div className="publication-item">
            <h4>Edge Computing Architecture</h4>
            <p className="publication-source">AWS Partner Solution</p>
            <p className="publication-description">
              Designed and commercialized edge compute solution for automotive applications,
              now offered as a partner product.
            </p>
          </div>

          <div className="publication-item">
            <h4>China Market Launch</h4>
            <p className="publication-source">Stellantis</p>
            <p className="publication-description">
              Key technical role launching Stellantis connected vehicles in China market,
              integrating local infrastructure requirements.
            </p>
          </div>
        </section>

        {/* GitHub Projects */}
        <section className="resume-section">
          <h2>GitHub Projects</h2>
          <div className="community-item">
            <h4>github.com/jamesenki</h4>
            <p>Protocol Buffers implementations | gRPC Java course work | Terraform/HCL infrastructure-as-code |
            Sales address book protobuf/TDD kata | Various automotive/mobility demos</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="resume-footer">
          <Link to="/" className="back-link">← Back to Catalog</Link>
          <p>Portfolio of architecture diagrams, code samples, and project documentation available upon request</p>
        </footer>
      </div>
    </div>
  );
};

export default ResumePage;
