# NSLabs Repository Breakout Plan

## Executive Summary

The current `nslabsdashboards` repository is a massive monolith containing multiple platform capabilities that should be separated into focused, specialized repositories for better maintainability, discoverability, and open source adoption.

**Current State**: 1 monolithic repository (34 APIs, 7 Postman collections)
**Target State**: 6 focused repositories with clear domain boundaries

## 🗂️ Proposed Repository Structure

### **1. iotsphere-core-platform**
**Category**: Platform | **Tier**: Gold Standard Target

```
📁 Core IoT Platform Foundation
├── 📂 GraphQL API Server (/src/graphql_api/)
├── 📂 MQTT Bridge & Communication (/mqtt/, /ingestor/)
├── 📂 Device Management & Registry (/src/domain/)
├── 📂 Authentication & Security Systems
├── 📂 Core Infrastructure (Docker, MongoDB, etc.)
└── 📂 Platform Documentation
```

**Key Components**:
- GraphQL API server with Strawberry framework
- MQTT broker integration and message handling  
- Device onboarding and authentication flows
- Core platform services and infrastructure
- Unified data access layer

**Target Metrics**: 15+ APIs, 8+ Postman collections, Value Score: 75+

---

### **2. iotsphere-device-simulators**
**Category**: Development Tools | **Tier**: Silver Standard

```
📁 Device Simulation & Testing Suite
├── 📂 Water Heater Simulator (/simulators/water_heater/)
├── 📂 Multi-Device Simulator Engine (/scripts/demo_multi_device_simulation.py)
├── 📂 MQTT Test Publishers (/simulators/mqtt-publisher/)
├── 📂 Device Behavior Engines & Rule Processing
├── 📂 Protocol Adapters & Communication Testing
└── 📂 Simulation Documentation & Guides
```

**Key Components**:
- Device simulation frameworks for testing
- MQTT telemetry generation and validation
- Behavior engines for realistic device modeling
- Integration testing frameworks
- Performance and load testing tools

**Target Metrics**: 5+ APIs, 4+ Postman collections, Value Score: 60+

---

### **3. appliances-co-water-heater-platform** 
**Category**: Industry Platform | **Tier**: Gold Standard Target

```
📁 Water Heater Management Platform
├── 📂 Water Heater APIs (/docs/api/water_heaters/)
├── 📂 GraphQL Schemas (/docs/graphql/WATER_HEATER_*)
├── 📂 Telemetry Management & Analytics
├── 📂 Maintenance Workflows & Predictions
├── 📂 Cost Prediction & Fleet Management
└── 📂 Postman Collections & Documentation
```

**Key Components**:
- Comprehensive water heater device management
- Predictive maintenance algorithms
- Cost prediction and analytics
- Fleet management and optimization
- Real-time monitoring dashboards

**Target Metrics**: 12+ APIs, 6+ Postman collections, Value Score: 78+

---

### **4. industrial-lubricants-platform**
**Category**: Industry Platform | **Tier**: Silver Standard

```
📁 Industrial Lubricants Management
├── 📂 Industrial Lubricant APIs (/docs/api/industrial_lubricant_*)
├── 📂 Implementation & Setup Guides
├── 📂 Testing & Validation Documentation
├── 📂 Postman Collections & Examples
├── 📂 Integration Workflows
└── 📂 Performance Monitoring
```

**Key Components**:
- Industrial lubricant monitoring and management
- Implementation guides and best practices
- Testing frameworks and validation tools
- Integration documentation
- Performance optimization guides

**Target Metrics**: 8+ APIs, 5+ Postman collections, Value Score: 70+

---

### **5. motorbike-oem-platform**
**Category**: Industry Platform | **Tier**: Silver Standard

```
📁 Electric Motorcycle Management Platform
├── 📂 Motorbike OEM APIs (/docs/api/land_ev_*)
├── 📂 Implementation Summaries & Guides
├── 📂 API Documentation & Specifications
├── 📂 Mock Data & Testing Frameworks
├── 📂 Integration Examples
└── 📂 Postman Collections & Workflows
```

**Key Components**:
- Electric motorcycle fleet management
- Battery management and optimization
- Performance analytics and monitoring
- Integration with charging infrastructure
- Fleet tracking and maintenance

**Target Metrics**: 6+ APIs, 4+ Postman collections, Value Score: 68+

---

### **6. iotsphere-ml-ai-platform**
**Category**: AI/ML Platform | **Tier**: Gold Standard Target

```
📁 ML/AI Services & Intelligence Platform
├── 📂 AI Agents & Autonomous Systems (/iotsphere_platform/agents/)
├── 📂 ML Models & Registry (/iotsphere_platform/ml/)
├── 📂 RAG Pipeline & Knowledge Management (/iotsphere_platform/rag/)
├── 📂 Knowledge Base & Documentation (/src/knowledgebase/)
├── 📂 AI Integration Examples & Guides
└── 📂 ML/AI API Documentation
```

**Key Components**:
- AI agent frameworks for diagnostics and recommendations
- ML model registry and deployment pipeline
- RAG (Retrieval-Augmented Generation) system
- Knowledge base management
- AI-powered predictive analytics

**Target Metrics**: 10+ APIs, 6+ Postman collections, Value Score: 80+

## 📋 Migration Plan

### **Phase 1: Repository Creation & Setup** (Week 1)
1. Create 6 new GitHub repositories with proper structure
2. Set up CI/CD pipelines and development workflows
3. Migrate core documentation and README files
4. Establish branching and contribution guidelines

### **Phase 2: Code Migration** (Week 2-3)
1. **iotsphere-core-platform**: Extract GraphQL server, MQTT bridge, authentication
2. **appliances-co-water-heater-platform**: Extract water heater specific code and APIs
3. **iotsphere-ml-ai-platform**: Extract AI agents, ML models, RAG pipeline
4. **industrial-lubricants-platform**: Extract lubricant monitoring code
5. **motorbike-oem-platform**: Extract Land EV/motorcycle related code
6. **iotsphere-device-simulators**: Extract all simulators and testing frameworks

### **Phase 3: API & Documentation Enhancement** (Week 4)
1. Create comprehensive API documentation for each platform
2. Develop Postman collections for all new repositories  
3. Add integration examples and getting started guides
4. Enhance marketing descriptions and value propositions

### **Phase 4: Quality Assurance & Testing** (Week 5)
1. Ensure all repositories build and test successfully
2. Validate API functionality and documentation
3. Test integration between platforms
4. Perform security and performance auditing

## 🎯 Expected Outcomes

### **Quality Improvement**
- **Before**: 1 repository (Industrial category, no pricing tier)
- **After**: 6 repositories (3 Gold Standard, 3 Silver Standard)

### **API & Collection Growth**
- **Before**: 34 APIs, 7 Postman collections
- **After**: 56+ APIs, 33+ Postman collections (60% increase)

### **Value Score Enhancement**
- **Before**: No value score assigned
- **After**: Average value score 72+ across all repositories

### **Open Source Readiness**
- Clear domain boundaries and focused purposes
- Professional documentation and examples
- Comprehensive API coverage
- Easy onboarding and integration paths

## 🚦 Success Metrics

### **Technical Metrics**
- All 6 repositories have working CI/CD pipelines
- 100% API documentation coverage
- Comprehensive Postman collection coverage
- Integration examples for all platforms

### **Quality Metrics**
- 3+ repositories achieve Gold Standard classification
- Average value score > 70 across all repositories
- Professional README and documentation standards
- Complete test coverage for all APIs

### **Adoption Metrics** (Post-Migration)
- GitHub stars and community engagement
- API usage and integration adoption
- Documentation quality scores
- Developer onboarding success rates

## 📁 File Migration Mapping

### **iotsphere-core-platform**
- `/src/graphql_api/` → Core repository
- `/mqtt/`, `/ingestor/` → Core repository
- `/src/domain/` → Core repository
- Core Docker configurations → Core repository

### **appliances-co-water-heater-platform**
- `/docs/api/water_heater*` → Water heater platform
- `/docs/graphql/WATER_HEATER*` → Water heater platform  
- `/simulators/water_heater/` → Water heater platform
- Related Postman collections → Water heater platform

### **iotsphere-ml-ai-platform**
- `/iotsphere_platform/agents/` → ML/AI platform
- `/iotsphere_platform/ml/` → ML/AI platform
- `/iotsphere_platform/rag/` → ML/AI platform
- `/src/knowledgebase/` → ML/AI platform

### **industrial-lubricants-platform**
- `/docs/api/industrial_lubricant*` → Lubricants platform
- `/docs/developer/industrial_lubricant*` → Lubricants platform
- Related implementation guides → Lubricants platform

### **motorbike-oem-platform**
- `/docs/api/land_ev*` → Motorcycle platform
- Related implementation summaries → Motorcycle platform
- Mock data and testing files → Motorcycle platform

### **iotsphere-device-simulators**
- `/simulators/` (except water_heater) → Simulators repository
- `/scripts/*simulation*` → Simulators repository
- Testing and validation scripts → Simulators repository

This breakout plan transforms the monolithic NSLabs repository into a professional, well-organized collection of focused platforms ready for open source success. 🚀