# PlantUML Integration Examples

This document demonstrates the PlantUML integration in the EYNS AI Experience Center.

## Basic Sequence Diagram

```plantuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
```

## Class Diagram

```plantuml
class User {
  -String id
  -String name
  -String email
  +login()
  +logout()
}

class Repository {
  -String name
  -String description
  -Date lastUpdated
  +sync()
  +getFiles()
}

User "1" -- "*" Repository : owns
```

## C4 Container Diagram

```plantuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "Developer", "Uses the platform to explore repositories")

System_Boundary(eyns, "EYNS AI Experience Center") {
    Container(web_app, "Web Application", "React, TypeScript", "Provides repository browsing and API documentation")
    Container(api_server, "API Server", "Node.js, Express", "Handles repository sync and API detection")
    Container(plantuml, "PlantUML Service", "Java", "Renders UML diagrams")
    ContainerDb(cache, "Cache", "File System", "Stores repository content and rendered diagrams")
}

System_Ext(github, "GitHub", "Source code repositories")

Rel(user, web_app, "Uses", "HTTPS")
Rel(web_app, api_server, "Makes API calls", "JSON/HTTP")
Rel(api_server, plantuml, "Sends diagrams", "HTTP")
Rel(api_server, cache, "Reads/writes", "File I/O")
Rel(api_server, github, "Syncs repositories", "Git/HTTPS")
```

## State Diagram

```plantuml
[*] --> Idle
Idle --> Loading : User requests sync
Loading --> Syncing : Start sync process
Syncing --> Success : Sync complete
Syncing --> Error : Sync failed
Success --> Idle : Display results
Error --> Idle : Show error
Error --> Loading : Retry
```

## Activity Diagram

```plantuml
start
:User opens repository;
:Load repository metadata;
if (Has API documentation?) then (yes)
  :Detect API types;
  :Show API buttons;
  if (User clicks API button?) then (yes)
    :Open API explorer;
  else (no)
    :Show documentation;
  endif
else (no)
  :Show documentation only;
endif
:Render markdown content;
if (Contains PlantUML?) then (yes)
  :Send to PlantUML service;
  :Render diagrams;
  :Embed in document;
else (no)
  :Display plain markdown;
endif
stop
```

## Component Diagram

```plantuml
package "Frontend" {
  [React App]
  [Markdown Viewer]
  [PlantUML Component]
  [API Explorer]
}

package "Backend" {
  [Express Server]
  [Repository Sync]
  [API Detection]
  [PlantUML Renderer]
}

package "External" {
  [GitHub API]
  [PlantUML JAR]
}

[React App] --> [Markdown Viewer]
[React App] --> [API Explorer]
[Markdown Viewer] --> [PlantUML Component]
[PlantUML Component] --> [Express Server]
[Express Server] --> [Repository Sync]
[Express Server] --> [API Detection]
[Express Server] --> [PlantUML Renderer]
[Repository Sync] --> [GitHub API]
[PlantUML Renderer] --> [PlantUML JAR]
```

## Use Case Diagram

```plantuml
left to right direction
actor Developer
actor "Project Manager" as PM

rectangle "EYNS AI Experience Center" {
  usecase "Browse Repositories" as UC1
  usecase "View Documentation" as UC2
  usecase "Explore APIs" as UC3
  usecase "Sync Repository" as UC4
  usecase "Render Diagrams" as UC5
  usecase "Search Content" as UC6
}

Developer --> UC1
Developer --> UC2
Developer --> UC3
Developer --> UC4
Developer --> UC6

PM --> UC1
PM --> UC2

UC2 ..> UC5 : includes
UC3 ..> UC2 : extends
UC4 ..> UC1 : extends
```

## Tips for Using PlantUML

1. **Syntax**: All PlantUML diagrams must start with `@startuml` and end with `@enduml`
2. **Code Blocks**: Use ` ```plantuml ` or ` ```puml ` to mark PlantUML code blocks
3. **Caching**: Diagrams are cached for performance - changes will render automatically
4. **Formats**: Both SVG (default) and PNG formats are supported
5. **C4 Diagrams**: The C4 PlantUML library is supported for architecture diagrams