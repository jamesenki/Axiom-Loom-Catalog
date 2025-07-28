# 🚀 EYNS AI Experience Center

**Developer Portal for EY Innovation Labs**

A centralized hub for showcasing EY's innovation repositories, APIs, and documentation with marketing focus for lab demonstrations.

## 🎯 Purpose

**Primary Function**: Lab marketing portal showcasing EY innovation ecosystem
- Centralized repository management and exploration
- API documentation hub (Swagger, GraphQL, Postman)
- Documentation viewer with emoji and link support
- Developer experience optimization for innovation teams

## 🏗️ Architecture

### Core Principles
- **Clean Code & Clean Architecture**
- **Trunk-based Development**
- **Continuous Delivery** (deploy anywhere, anytime)
- **Local Content Serving** (optimized for performance)
- **100% Test Coverage** (including end-to-end UX validation)

### Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Markdown Rendering**: ReactMarkdown with emoji support
- **Testing**: Playwright for end-to-end validation
- **Content Fetching**: GitHub CLI + REST API
- **Diagram Rendering**: PlantUML JAR backend integration

## 🔧 Key Features

### Repository Management
- ✅ **Manual Repository Addition**: UI for adding new repositories
- ✅ **Auto-Sync on Load**: Automatic content synchronization
- ✅ **Manual Sync Button**: On-demand content refresh
- ✅ **Local Content Serving**: Optimized for offline/cached access

### Documentation System
- ✅ **Unicode Emoji Support**: Perfect emoji rendering in markdown
- ✅ **Link Integrity**: 263+ documentation links validated and fixed
- ✅ **Markdown Viewer**: Full-featured with syntax highlighting
- ✅ **PlantUML Integration**: UML diagram rendering with C4 support

### API Documentation
- ✅ **Swagger Integration**: Interactive API exploration
- ✅ **GraphQL Support**: Postman collections for GraphQL APIs
- ✅ **Multi-format Support**: Handles various API documentation formats
- ✅ **API Count Display**: Accurate count across all repositories (85+ APIs)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- GitHub CLI (`gh`)
- GitHub Personal Access Token

### Installation
```bash
# Clone repository
git clone https://github.com/20230011612_EYGS/eyns-ai-experience-center.git
cd eyns-ai-experience-center

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your GitHub token

# Start development server
npm start
```

### Environment Variables
```bash
REACT_APP_GITHUB_TOKEN=your_github_token_here
REACT_APP_GITHUB_ORG=20230011612_EYGS
```

## 🧪 Testing

### Test Coverage Requirements
- **100% Unit Test Coverage**
- **100% Integration Test Coverage**
- **100% End-to-End User Experience Validation**

### Running Tests
```bash
# Unit tests
npm test

# End-to-end tests (Playwright)
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### Continuous Delivery
The application follows CD principles and can be deployed anywhere:

```bash
# Build for production
npm run build

# Deploy to any environment
npm run deploy
```

### Network Configuration
- **Lab Access**: Configured for `192.168.1.101:3002`
- **Flexible Deployment**: Can be deployed to any network/environment

## 🔄 Repository Sync

### Sync Mechanism
- **Auto-sync on Load**: Fetches latest content on application startup
- **Manual Sync**: Button-triggered refresh of repository content
- **Local Optimization**: Content served from local cache for performance
- **GitHub CLI Integration**: Uses `gh` for efficient content fetching

### Supported Repositories
- **Future Mobility Platforms**: OEMs, Consumer, Fleet, Regulatory, Tech, Utilities
- **Architecture Templates**: sample-arch-package, copilot-architecture-template
- **Specialized Tools**: smartpath, rentalFleets, orchestrator
- **Dashboards**: nslabsdashboards (GraphQL APIs)

## 🛠️ Development

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Architecture Patterns
- **Clean Architecture**: Domain-driven design
- **Repository Pattern**: Data access abstraction
- **Command Query Separation**: Clear separation of concerns
- **Dependency Injection**: Loose coupling

## 📊 Metrics & Monitoring

### Performance Metrics
- **Load Time**: < 2 seconds initial load
- **Sync Performance**: Repository content refresh < 5 seconds
- **API Response**: < 500ms average response time

### Quality Metrics
- **Test Coverage**: 100% (enforced)
- **TypeScript Coverage**: 100% (no `any` types)
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lighthouse score > 90

## 🔧 Technical Achievements

### Recently Completed
- ✅ **Unicode Emoji Fix**: Proper emoji rendering using `TextDecoder('utf-8')`
- ✅ **Documentation Links**: Fixed 263+ broken links across 10 repositories
- ✅ **TypeScript Compliance**: Clean compilation with no errors
- ✅ **PlantUML Integration**: Backend JAR rendering with C4 support
- ✅ **Version Control**: GitHub repository established with proper CI/CD

### Architecture Decisions
- **Local Content Serving**: Optimized for lab demo performance
- **GitHub CLI Integration**: More reliable than REST API alone
- **React + TypeScript**: Type-safe, maintainable frontend
- **Tailwind CSS**: Utility-first styling for rapid development

## 📚 Documentation

### Project Documentation
- [Architecture Guide](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Testing Strategy](docs/TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

### Conversation Archives
- [Documentation Fixes Session](CONVERSATION_DOCUMENTATION_FIXES_2025-07-28.md)
- [Project Investigation Session](conversation-2025-07-28-project-investigation.md)
- [Work Summary](WORK_SUMMARY_2025-07-24_18-49.md)

## 🤝 Contributing

### Development Workflow
1. **Trunk-based Development**: All changes to main branch
2. **Feature Flags**: For incomplete features
3. **Continuous Integration**: Automated testing and validation
4. **Code Review**: Peer review for all changes

### Coding Standards
- **Clean Code**: Self-documenting, readable code
- **SOLID Principles**: Object-oriented design principles
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It

## 📞 Support

For questions or issues:
- Create GitHub issue
- Contact EY Innovation Labs team
- Review conversation archives for context

---

**Built with ❤️ for EY Innovation Labs**  
*Showcasing the future of mobility and AI-powered architecture*
