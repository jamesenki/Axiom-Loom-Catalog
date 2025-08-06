/**
 * Mermaid Renderer Hook
 * 
 * Detects and extracts Mermaid diagrams from markdown content
 * Provides utilities for rendering diagrams within markdown
 */

import { useState, useEffect, useCallback } from 'react';

interface MermaidBlock {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  title?: string;
}

interface UseMermaidRendererResult {
  blocks: MermaidBlock[];
  processedContent: string;
  hasMermaid: boolean;
  extractMermaidBlocks: (content: string) => MermaidBlock[];
  replaceMermaidBlocks: (content: string, blocks: MermaidBlock[]) => string;
}

export const useMermaidRenderer = (markdownContent: string): UseMermaidRendererResult => {
  const [blocks, setBlocks] = useState<MermaidBlock[]>([]);
  const [processedContent, setProcessedContent] = useState(markdownContent);

  // Extract Mermaid blocks from markdown
  const extractMermaidBlocks = useCallback((content: string): MermaidBlock[] => {
    const mermaidBlocks: MermaidBlock[] = [];
    
    // Pattern to match Mermaid code blocks
    const codeBlockPattern = /```mermaid(?:\s+(.+))?\n([\s\S]*?)```/g;
    
    let match: RegExpExecArray | null;
    while ((match = codeBlockPattern.exec(content)) !== null) {
      const [fullMatch, title, blockContent] = match;
      mermaidBlocks.push({
        id: `mermaid-${mermaidBlocks.length}-${Date.now()}`,
        content: blockContent.trim(),
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
        title: title?.trim()
      });
    }

    return mermaidBlocks;
  }, []);

  // Replace Mermaid blocks with placeholders
  const replaceMermaidBlocks = useCallback((content: string, blocks: MermaidBlock[]): string => {
    let processedContent = content;
    
    // Sort blocks by startIndex in reverse order to avoid index shifting
    const sortedBlocks = [...blocks].sort((a, b) => b.startIndex - a.startIndex);
    
    sortedBlocks.forEach(block => {
      // Use a custom marker that won't be escaped by markdown
      const placeholder = `\n\n[MERMAID:${block.id}:${block.title || ''}:START]\n${block.content}\n[MERMAID:${block.id}:END]\n\n`;
      processedContent = 
        processedContent.slice(0, block.startIndex) +
        placeholder +
        processedContent.slice(block.endIndex);
    });
    
    return processedContent;
  }, []);

  useEffect(() => {
    const detectedBlocks = extractMermaidBlocks(markdownContent);
    setBlocks(detectedBlocks);
    
    if (detectedBlocks.length > 0) {
      const processed = replaceMermaidBlocks(markdownContent, detectedBlocks);
      setProcessedContent(processed);
    } else {
      setProcessedContent(markdownContent);
    }
  }, [markdownContent, extractMermaidBlocks, replaceMermaidBlocks]);

  return {
    blocks,
    processedContent,
    hasMermaid: blocks.length > 0,
    extractMermaidBlocks,
    replaceMermaidBlocks
  };
};

// Utility function to check if content might contain Mermaid
export const mightContainMermaid = (content: string): boolean => {
  return content.includes('```mermaid');
};

// Common Mermaid diagram templates
export const mermaidTemplates = {
  flowchart: `graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`,
    
  sequence: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
    
  classDiagram: `classDiagram
    Class01 <|-- AveryLongClass : Cool
    Class03 *-- Class04
    Class05 o-- Class06
    Class07 .. Class08
    Class09 --> C2 : Where am i?
    Class09 --* C3
    Class09 --|> Class07
    Class07 : equals()
    Class07 : Object[] elementData
    Class01 : size()
    Class01 : int chimp
    Class01 : int gorilla
    Class08 <--> C2: Cool label`,
    
  stateDiagram: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
    
  erDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    
  gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
    
  pie: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
    
  gitGraph: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit`
};