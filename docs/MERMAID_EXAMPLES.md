# Mermaid Diagram Examples

This document demonstrates the Mermaid diagram integration in the Axiom Loom Catalog.

## Flowchart

```mermaid
graph TD
    A[User Opens Repository] --> B{Has Documentation?}
    B -->|Yes| C[Display README]
    B -->|No| D[Show Empty State]
    C --> E{Contains Diagrams?}
    E -->|PlantUML| F[Render via Backend]
    E -->|Mermaid| G[Render via Frontend]
    E -->|None| H[Display Plain Markdown]
    F --> I[Display in Document]
    G --> I
    H --> I
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as API Server
    participant G as GitHub

    U->>W: Browse Repository
    W->>A: Request Repository Data
    A->>G: Fetch Latest Content
    G-->>A: Repository Files
    A->>A: Detect APIs
    A-->>W: Repository Info + APIs
    W->>W: Render Documentation
    W-->>U: Display Content
```

## Class Diagram

```mermaid
classDiagram
    class Repository {
        +String name
        +String description
        +Date lastUpdated
        +sync()
        +getFiles()
    }
    
    class APIDetector {
        +detectREST()
        +detectGraphQL()
        +detectgRPC()
    }
    
    class MarkdownViewer {
        +String content
        +render()
        +search()
        +export()
    }
    
    class DiagramRenderer {
        <<interface>>
        +render(content)
    }
    
    class PlantUMLRenderer {
        +render(content)
        -sendToBackend()
    }
    
    class MermaidRenderer {
        +render(content)
        -renderInBrowser()
    }
    
    Repository --> APIDetector : uses
    Repository --> MarkdownViewer : displays in
    MarkdownViewer --> DiagramRenderer : uses
    DiagramRenderer <|-- PlantUMLRenderer : implements
    DiagramRenderer <|-- MermaidRenderer : implements
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : User requests sync
    Loading --> Syncing : Initialize
    Syncing --> Success : All repos synced
    Syncing --> PartialSuccess : Some repos failed
    Syncing --> Error : All repos failed
    Success --> Idle : Display results
    PartialSuccess --> Idle : Display results with warnings
    Error --> Idle : Display error
    Error --> Loading : Retry
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ REPOSITORY : browses
    REPOSITORY ||--|{ DOCUMENTATION : contains
    REPOSITORY ||--o{ API : exposes
    API ||--|{ ENDPOINT : has
    DOCUMENTATION ||--o{ DIAGRAM : includes
    DIAGRAM {
        string type
        string content
        string format
    }
    API {
        string type
        string specification
        string version
    }
```

## Gantt Chart

```mermaid
gantt
    title Axiom Loom Catalog Development
    dateFormat YYYY-MM-DD
    section Phase 1
    Project Setup           :done,    p1, 2025-01-01, 7d
    Repository Analysis     :done,    p2, after p1, 14d
    Basic UI Framework      :done,    p3, after p2, 7d
    
    section Phase 2
    Repository Sync         :done,    p4, after p3, 10d
    Documentation Viewer    :done,    p5, after p4, 7d
    API Documentation Hub   :done,    p6, after p5, 10d
    Basic Testing          :done,    p7, after p6, 5d
    
    section Phase 3
    PlantUML Integration    :done,    p8, after p7, 5d
    Mermaid Integration     :active,  p9, after p8, 3d
    Advanced Search         :         p10, after p9, 7d
    Performance Opt         :         p11, after p10, 5d
    UI Polish              :         p12, after p11, 7d
```

## Pie Chart

```mermaid
pie title Repository Content Types
    "Documentation" : 45
    "Source Code" : 30
    "API Specs" : 15
    "Configuration" : 10
```

## Git Graph

```mermaid
gitGraph
    commit id: "Initial setup"
    commit id: "Add repository sync"
    branch feature/api-hub
    checkout feature/api-hub
    commit id: "Implement API detection"
    commit id: "Add API viewers"
    checkout main
    merge feature/api-hub
    branch feature/diagrams
    checkout feature/diagrams
    commit id: "Add PlantUML support"
    commit id: "Add Mermaid support"
    checkout main
    merge feature/diagrams
    commit id: "Ready for Phase 3"
```

## Mind Map

```mermaid
mindmap
  root((Axiom Loom Catalog))
    Features
      Repository Management
        Auto-sync
        Manual sync
        GitHub integration
      Documentation
        Markdown viewer
        Search functionality
        Export options
      API Documentation
        Swagger UI
        GraphQL Playground
        gRPC UI
        Postman Collections
      Diagrams
        PlantUML
        Mermaid
    Architecture
      Frontend
        React
        TypeScript
        Tailwind CSS
      Backend
        Node.js
        Express
        PlantUML JAR
      Storage
        Local cache
        File system
```

## Timeline

```mermaid
timeline
    title Axiom Loom Project Milestones
    
    Phase 1 : Foundation Complete
           : GitHub setup
           : Repository analysis
           : Basic UI
    
    Phase 2 : Core Features Complete
           : Repository sync
           : Documentation viewer
           : API hub
           : Testing framework
    
    Phase 3 : Enhancements (Current)
           : PlantUML integration ✓
           : Mermaid integration ✓
           : Advanced search
           : Performance optimization
           : UI polish
    
    Phase 4 : Production Ready
           : Deployment pipeline
           : Monitoring
           : Documentation
           : Training
```

## Tips for Using Mermaid

1. **Syntax**: Mermaid diagrams are automatically detected in ` ```mermaid ` code blocks
2. **Types**: Supports flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, pie charts, git graphs, mind maps, and timelines
3. **Rendering**: Diagrams render directly in the browser - no backend required
4. **Themes**: Supports multiple themes (default, dark, forest, neutral)
5. **Export**: Diagrams can be downloaded as SVG files
6. **Performance**: Mermaid diagrams render quickly without server round-trips