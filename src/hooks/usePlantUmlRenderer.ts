/**
 * PlantUML Renderer Hook
 * 
 * Detects and extracts PlantUML diagrams from markdown content
 * Provides utilities for rendering diagrams within markdown
 */

import { useState, useEffect, useCallback } from 'react';

interface PlantUmlBlock {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  title?: string;
}

interface UsePlantUmlRendererResult {
  blocks: PlantUmlBlock[];
  processedContent: string;
  hasPlantUml: boolean;
  extractPlantUmlBlocks: (content: string) => PlantUmlBlock[];
  replacePlantUmlBlocks: (content: string, blocks: PlantUmlBlock[]) => string;
}

export const usePlantUmlRenderer = (markdownContent: string): UsePlantUmlRendererResult => {
  const [blocks, setBlocks] = useState<PlantUmlBlock[]>([]);
  const [processedContent, setProcessedContent] = useState(markdownContent);

  // Extract PlantUML blocks from markdown
  const extractPlantUmlBlocks = useCallback((content: string): PlantUmlBlock[] => {
    const plantUmlBlocks: PlantUmlBlock[] = [];
    
    // Pattern to match PlantUML code blocks
    // Supports both ```plantuml and ```puml
    const codeBlockPattern = /```(?:plantuml|puml)(?:\s+(.+))?\n([\s\S]*?)```/g;
    
    // Pattern to match inline PlantUML with @startuml/@enduml
    const inlinePattern = /@startuml(?:\s+(.+))?\n([\s\S]*?)@enduml/g;

    // Extract from code blocks
    let match: RegExpExecArray | null;
    while ((match = codeBlockPattern.exec(content)) !== null) {
      const [fullMatch, title, blockContent] = match;
      plantUmlBlocks.push({
        id: `plantuml-${plantUmlBlocks.length}-${Date.now()}`,
        content: `@startuml\n${blockContent.trim()}\n@enduml`,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
        title: title?.trim()
      });
    }

    // Extract inline PlantUML (if not already in a code block)
    while ((match = inlinePattern.exec(content)) !== null) {
      const [fullMatch, title, blockContent] = match;
      
      // Check if this is already within a code block
      const isInCodeBlock = plantUmlBlocks.some(
        block => match!.index >= block.startIndex && match!.index <= block.endIndex
      );
      
      if (!isInCodeBlock) {
        plantUmlBlocks.push({
          id: `plantuml-inline-${plantUmlBlocks.length}-${Date.now()}`,
          content: fullMatch,
          startIndex: match!.index,
          endIndex: match!.index + fullMatch.length,
          title: title?.trim()
        });
      }
    }

    return plantUmlBlocks;
  }, []);

  // Replace PlantUML blocks with placeholders
  const replacePlantUmlBlocks = useCallback((content: string, blocks: PlantUmlBlock[]): string => {
    let processedContent = content;
    
    // Sort blocks by startIndex in reverse order to avoid index shifting
    const sortedBlocks = [...blocks].sort((a, b) => b.startIndex - a.startIndex);
    
    sortedBlocks.forEach(block => {
      const placeholder = `<div data-plantuml-id="${block.id}" data-plantuml-title="${block.title || ''}"></div>`;
      processedContent = 
        processedContent.slice(0, block.startIndex) +
        placeholder +
        processedContent.slice(block.endIndex);
    });
    
    return processedContent;
  }, []);

  useEffect(() => {
    const detectedBlocks = extractPlantUmlBlocks(markdownContent);
    setBlocks(detectedBlocks);
    
    if (detectedBlocks.length > 0) {
      const processed = replacePlantUmlBlocks(markdownContent, detectedBlocks);
      setProcessedContent(processed);
    } else {
      setProcessedContent(markdownContent);
    }
  }, [markdownContent, extractPlantUmlBlocks, replacePlantUmlBlocks]);

  return {
    blocks,
    processedContent,
    hasPlantUml: blocks.length > 0,
    extractPlantUmlBlocks,
    replacePlantUmlBlocks
  };
};

// Utility function to check if content might contain PlantUML
export const mightContainPlantUml = (content: string): boolean => {
  return (
    content.includes('```plantuml') ||
    content.includes('```puml') ||
    content.includes('@startuml') ||
    content.includes('@enduml')
  );
};

// Utility function to validate basic PlantUML syntax
export const validatePlantUmlSyntax = (content: string): { valid: boolean; error?: string } => {
  const trimmed = content.trim();
  
  if (!trimmed.includes('@startuml')) {
    return { valid: false, error: 'Missing @startuml directive' };
  }
  
  if (!trimmed.includes('@enduml')) {
    return { valid: false, error: 'Missing @enduml directive' };
  }
  
  // Check for balanced braces
  const openBraces = (trimmed.match(/{/g) || []).length;
  const closeBraces = (trimmed.match(/}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    return { valid: false, error: 'Unbalanced braces in diagram' };
  }
  
  return { valid: true };
};