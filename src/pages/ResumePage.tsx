import React from 'react';
import { Link } from 'react-router-dom';
import './ResumePage.css';

const ResumePage: React.FC = () => {
  return (
    <div className="resume-page">
      <div className="resume-container">
        {/* Header */}
        <header className="resume-header">
          <h1>JAMES SIMON</h1>
          <p className="resume-title">Technical Architect &amp; Platform Builder</p>
          <div className="contact-info">
            <span>586-275-8066</span>
            <span>jamessimonster@gmail.com</span>
            <span>
              <a
                href="https://www.linkedin.com/in/jamesesimon/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </span>
            <span>
              <a
                href="https://github.com/jamesenki"
                target="_blank"
                rel="noopener noreferrer"
              >
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

        {/* Professional Experience */}
        <section className="resume-section">
          <h2>Professional Experience</h2>

          <h3>
            EY (Ernst &amp; Young) | Innovation Senior Manager - Advanced Manufacturing &amp; Mobility | Apr
            2024 - Present
          </h3>
          <h4>Solution Development &amp; Architecture:</h4>
          <ul>
            <li>
              Built full-stack Fleet Management Portal with data platform architecture, consumer-facing APIs,
              and working demo
            </li>
            <li>
              Created IoT &amp; AI Industrial Monitoring demo using Coast platform for fluid monitoring and
              predictive maintenance
            </li>
            <li>
              Co-led EY-Nottingham Spirk Lab transformation into AI Experience Hub; rewrote IoT, Digital Twin,
              and Analytics demos; implemented first real ML/AI use cases
            </li>
            <li>
              Delivered comprehensive architecture packages for Fleet Management and dealer management
              automation systems
            </li>
          </ul>
          <h4>Technical Leadership:</h4>
          <ul>
            <li>Led SDV strategy and implementation discussions with automotive OEM clients</li>
            <li>Provided cloud and embedded engineering advice across multiple automotive manufacturers</li>
            <li>
              Conducted architecture reviews for Digital Quality Seal, Mtaas, IoT-Sphere, and Road Rules
            </li>
            <li>
              Performed top-down artifact review identifying and resolving stability issues; mentored HVAC
              client on architecture, design, and AI integration
            </li>
          </ul>

          <h3>
            Amazon Web Services (AWS) | Technical Strategy Lead - Connected Vehicle Solutions | Oct 2021 - Apr
            2024
          </h3>
          <h4>AWS Connected Mobility Solution - Technical Lead:</h4>
          <ul>
            <li>
              Led development of comprehensive cloud-based mobility solution addressing complex automotive
              industry needs
            </li>
            <li>
              Architected modular platform for vehicle-cloud communication, data management, and application
              deployment
            </li>
            <li>
              Integrated AWS IoT FleetWise for intelligent vehicle data collection and organization
            </li>
            <li>
              <strong>Technologies:</strong> AWS IoT Core, Lambda, S3, Kinesis, API Gateway, AppSync,
              DynamoDB, CloudFormation, CDK
            </li>
          </ul>
          <h4>Edge Compute Architecture Project:</h4>
          <ul>
            <li>
              Designed groundbreaking edge computing solution for connected mobility; commercialized as
              partner offering
            </li>
            <li>
              Built CI/CD pipeline for containerized edge applications using Amazon ECR and AWS IoT Greengrass
            </li>
            <li>
              Created software-defined mobility device framework connecting to multiple vehicle hardware
              components
            </li>
          </ul>
          <p>
            <strong>Additional:</strong> Insurance Tech Partner Solution, Partner Edge Enablement, Public
            Sector projects; contributed to Connected Mobility Lens for AWS Well-Architected Framework
          </p>

          <h3>Stellantis (FCA) | Solutions Architect | Jan 2020 - Oct 2021</h3>
          <h4>Vehicle-to-Cloud Communications - Principal Architect:</h4>
          <ul>
            <li>
              Authored V2C Communications specifications enabling secure, scalable data transmission across
              entire brand portfolio
            </li>
            <li>
              Enhanced vehicle communications using Google Protocol Buffers and MQTT, significantly boosting
              performance
            </li>
            <li>
              Led connected vehicle integration projects including major China market launch initiative
            </li>
          </ul>
          <h4>Product Management &amp; Innovation:</h4>
          <ul>
            <li>Led Uconnect features for Connected Vehicle Program; administered GitHub Enterprise</li>
            <li>
              Conducted Dojo challenges and Kata Fridays immersive training; co-founded first developer
              community
            </li>
          </ul>

          <h3>
            JDM Systems Consultants @ FCA | Senior Connected Applications Architect | Sep 2017 - Jan 2020
          </h3>
          <ul>
            <li>Architected TLS 1.2 solutions for ECU Identity and Authentication enhancing vehicle security</li>
            <li>
              Led AppDynamics deployment improving DevOps processes; co-led team of 14 as APAC System
              Integrator (Shanghai)
            </li>
            <li>
              Streamlined global interface architecture; standardized API architecture across Uconnect
              ecosystem
            </li>
            <li>
              Delivered functional specs, application/API specs, sequence diagrams, DFMEA, test cases
            </li>
            <li>
              Built features: Pacifica plug-in hybrid charging, remote operations, stolen vehicle locator
            </li>
          </ul>

          <h3>
            JDM Systems Consultants @ Volkswagen Group of Americas | SOA &amp; IBM IIB V9 Analyst | May 2014 -
            Jun 2016
          </h3>
          <ul>
            <li>
              Implemented ten integration services using IBM Integration Broker V9 for major application
              replacement project
            </li>
            <li>
              Built SOA communication portal integrating Confluence, JIRA, and homegrown tools; created
              services registry
            </li>
            <li>Drove automation of builds, deployments, and documentation generation</li>
            <li>
              Analyzed and documented IBM MobileFirst project for global deployment
            </li>
          </ul>
        </section>

        {/* Earlier Technical Experience */}
        <section className="resume-section">
          <h2>Earlier Technical Experience</h2>

          <h3>VisionIT | Sales Effectiveness / Proposal Analyst | Mar 2011 - Sep 2013</h3>
          <p>
            Authored technical sales documents, RFPs, and solution proposals for IT Managed Services achieving
            30%+ win rate.
          </p>

          <h3>Valassis (via Teksystems) | Digital Media Technical/Business/Process Writer | Oct 2009 - Dec 2010</h3>
          <p>
            Drove internal/external API documentation; authored white papers including &quot;Coupon Stacking:
            Facts and Myths&quot; and &quot;Digital Media Security&quot;.
          </p>

          <h3>Systems Documentation Inc @ IBM | Senior Technical Writer / Info Developer | Sep 2006 - Mar 2009</h3>
          <p>
            Developed documentation for IBM WebSphere Telecom products; maintained application testing
            environments running SLES 10, DB2, WebSphere; coded documentation in XML DITA.
          </p>

          <h3>CTG @ IBM | Information Developer/Programmer Analyst | Mar 2005 - Jun 2006</h3>
          <p>
            Designed SQL queries to mine data sources; developed VB and PHP scripts for data extraction and
            transformation; created local HTML versions of technical documentation.
          </p>

          <h3>Leitch Technology | Senior Technical Writer / Analyst | Nov 2000 - Mar 2005</h3>
          <p>
            Authored installation guides, user guides, developer guides, and help systems; created Leitch&apos;s
            first software developer kit; worked as engineering team member on NEXIO product line development.
          </p>

          <h3>Intel | Technical Writer / Analyst | Oct 1998 - Jun 2000</h3>
          <p>
            Technical and marketing writer for System Management Suite for Home Product Group&apos;s web
            appliance.
          </p>
        </section>

        {/* Technical Skills */}
        <section className="resume-section">
          <h2>Technical Skills</h2>
          <ul>
            <li>
              <strong>Cloud &amp; Infrastructure:</strong> AWS (IoT Core, IoT FleetWise, IoT Greengrass,
              Lambda, EC2, S3, Kinesis, API Gateway, AppSync, DynamoDB, CloudFormation, CDK) | Azure (DevOps,
              Cloud) | Docker | Amazon ECR | Terraform/HCL
            </li>
            <li>
              <strong>Development &amp; Integration:</strong> Protocol Buffers | gRPC | MQTT | REST |
              Microservices | SOA | IBM Integration Broker V9 | Event-Driven Systems | CI/CD | Java | C++ |
              Python | VB | PHP
            </li>
            <li>
              <strong>Automotive &amp; IoT:</strong> Connected Vehicle Platforms | Software-Defined Vehicles
              (SDV) | Vehicle Telemetry | OTA Updates | Edge-to-Cloud Architecture | TLS 1.2 | Automotive Grade
              Linux (AGL)
            </li>
            <li>
              <strong>Data &amp; Tools:</strong> SQL | Data Lake Architecture | Real-time Processing | XML
              DITA | GitHub Enterprise | JIRA | Confluence | Agile/Scrum | DevOps | TDD
            </li>
            <li>
              <strong>GitHub Projects (github.com/jamesenki):</strong> Protocol Buffers implementations | gRPC
              Java course work | Terraform/HCL infrastructure-as-code | Sales address book protobuf/TDD kata |
              Various automotive/mobility demos
            </li>
          </ul>
        </section>

        {/* Certifications */}
        <section className="resume-section">
          <h2>Certifications</h2>
          <ul>
            <li>EY Artificial Intelligence - Applied AI - Bronze Learning (2024)</li>
            <li>NVIDIA AI Technical Curriculum Training Completion</li>
            <li>Flow Framework&reg; Professional</li>
            <li>NVIDIA Visualization Technical Curriculum Training Completion</li>
          </ul>
        </section>

        {/* Key Technical Achievements */}
        <section className="resume-section">
          <h2>Key Technical Achievements</h2>
          <ul>
            <li>
              <strong>V2C Protocol Design:</strong> Created enterprise communications protocol for entire
              FCA/Stellantis brand portfolio
            </li>
            <li>
              <strong>AWS Connected Mobility Solution:</strong> Led technical development of comprehensive
              industry solution
            </li>
            <li>
              <strong>Edge Computing Architecture:</strong> Designed and commercialized edge compute solution
              for automotive applications
            </li>
            <li>
              <strong>China Market Launch:</strong> Key technical role launching Stellantis connected vehicles
              in China
            </li>
            <li>
              <strong>Developer Community:</strong> Co-founded first developer community at major automotive
              OEM
            </li>
            <li>
              <strong>Integration Services:</strong> Implemented ten major services using IBM IIB V9 for
              enterprise replacement
            </li>
            <li>
              <strong>Protocol Buffers &amp; gRPC Expertise:</strong> Demonstrated through both professional
              implementations and GitHub projects
            </li>
          </ul>
          <p>
            <em>
              Portfolio of architecture diagrams, code samples, and project documentation available upon
              request.
            </em>
          </p>
        </section>

        {/* Back link */}
        <section className="resume-section">
          <Link to="/" className="back-link">
            &larr; Back to Catalog
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ResumePage;
