/**
 * Neural Network Background Component
 * Revolutionary canvas-based animated background with particle effects
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { quantumColors } from '../styles/axiom-theme';

// Styled components
const CanvasContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['zIndex', 'opacity', 'interactive'].includes(prop)
})<{ 
  zIndex: number; 
  opacity: number; 
  interactive: boolean 
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${props => props.zIndex};
  opacity: ${props => props.opacity};
  pointer-events: ${props => props.interactive ? 'auto' : 'none'};
  transition: opacity 0.5s ease;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

// Neural network node interface
interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  connections: number[];
  energy: number;
  pulse: number;
}

// Component interface
interface NeuralBackgroundProps {
  nodeCount?: number;
  maxConnections?: number;
  connectionDistance?: number;
  animationSpeed?: number;
  interactive?: boolean;
  zIndex?: number;
  opacity?: number;
  colorScheme?: 'quantum' | 'neural' | 'plasma';
}

/**
 * Neural Network Background Component
 * 
 * Features:
 * - Canvas-based particle system
 * - Dynamic neural network connections
 * - Interactive mouse effects
 * - Responsive to viewport changes
 * - Performance optimized with RAF
 * - Customizable visual parameters
 * 
 * @param nodeCount - Number of neural nodes
 * @param maxConnections - Max connections per node
 * @param connectionDistance - Max distance for connections
 * @param animationSpeed - Animation speed multiplier
 * @param interactive - Enable mouse interaction
 * @param zIndex - CSS z-index value
 * @param opacity - Background opacity
 * @param colorScheme - Color palette to use
 */
export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({
  nodeCount = 50,
  maxConnections = 5,
  connectionDistance = 150,
  animationSpeed = 1,
  interactive = true,
  zIndex = -10,
  opacity = 0.6,
  colorScheme = 'quantum',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<NeuralNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const [isVisible, setIsVisible] = useState(false);

  // Color schemes
  const colorSchemes = {
    quantum: {
      nodes: [
        quantumColors.quantum.glow,
        quantumColors.quantum.bright,
        quantumColors.quantum.light,
      ],
      connections: quantumColors.plasma.violet,
      mouseGlow: quantumColors.plasma.cyan,
    },
    neural: {
      nodes: [
        quantumColors.neural.electric,
        quantumColors.neural.glow,
        quantumColors.neural.bright,
      ],
      connections: quantumColors.neural.light,
      mouseGlow: quantumColors.neural.electric,
    },
    plasma: {
      nodes: [
        quantumColors.plasma.violet,
        quantumColors.plasma.cyan,
        quantumColors.plasma.emerald,
      ],
      connections: quantumColors.plasma.magenta,
      mouseGlow: quantumColors.plasma.gold,
    },
  };

  const colors = colorSchemes[colorScheme];

  // Initialize nodes
  const initializeNodes = useCallback((width: number, height: number) => {
    const nodes: NeuralNode[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2 * animationSpeed,
        vy: (Math.random() - 0.5) * 2 * animationSpeed,
        size: Math.random() * 4 + 2,
        color: colors.nodes[Math.floor(Math.random() * colors.nodes.length)],
        connections: [],
        energy: Math.random(),
        pulse: Math.random() * Math.PI * 2,
      });
    }
    
    // Calculate initial connections
    nodes.forEach((node, i) => {
      const connections: number[] = [];
      const distances: Array<{ index: number; distance: number }> = [];
      
      // Calculate distances to all other nodes
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          distances.push({ index: j, distance });
        }
      });
      
      // Sort by distance and take closest nodes
      distances.sort((a, b) => a.distance - b.distance);
      const maxConnectionCount = Math.min(maxConnections, distances.length);
      
      for (let j = 0; j < maxConnectionCount; j++) {
        if (distances[j].distance <= connectionDistance) {
          connections.push(distances[j].index);
        }
      }
      
      node.connections = connections;
    });
    
    nodesRef.current = nodes;
  }, [nodeCount, maxConnections, connectionDistance, animationSpeed, colors]);

  // Update node positions and connections
  const updateNodes = useCallback((width: number, height: number, deltaTime: number) => {
    const nodes = nodesRef.current;
    const mouse = mouseRef.current;
    
    nodes.forEach((node, i) => {
      // Update position
      node.x += node.vx * deltaTime * 0.016; // 60fps normalization
      node.y += node.vy * deltaTime * 0.016;
      
      // Bounce off edges
      if (node.x < 0 || node.x > width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(height, node.y));
      }
      
      // Mouse interaction
      if (interactive && mouse.isActive) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          node.vx += (dx / distance) * force * 0.5;
          node.vy += (dy / distance) * force * 0.5;
          node.energy = Math.min(1, node.energy + force * 0.1);
        }
      }
      
      // Update pulse for glow effect
      node.pulse += deltaTime * 0.002;
      if (node.pulse > Math.PI * 2) node.pulse = 0;
      
      // Decay energy
      node.energy = Math.max(0, node.energy - deltaTime * 0.0005);
      
      // Update connections based on current positions
      if (i % 10 === 0) { // Update connections less frequently for performance
        const connections: number[] = [];
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= connectionDistance && connections.length < maxConnections) {
              connections.push(j);
            }
          }
        });
        node.connections = connections;
      }
    });
  }, [interactive, connectionDistance, maxConnections]);

  // Render the neural network
  const render = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas with quantum fade effect
    ctx.fillStyle = `${quantumColors.quantum.deep}05`;
    ctx.fillRect(0, 0, width, height);
    
    const nodes = nodesRef.current;
    const mouse = mouseRef.current;
    
    // Draw connections
    nodes.forEach((node) => {
      node.connections.forEach((connectionIndex) => {
        const connectedNode = nodes[connectionIndex];
        if (connectedNode) {
          const dx = connectedNode.x - node.x;
          const dy = connectedNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connection opacity based on distance and energy
          const opacity = Math.max(0, 1 - distance / connectionDistance) * 
                         (0.3 + (node.energy + connectedNode.energy) * 0.35);
          
          if (opacity > 0.05) {
            // Create gradient for connection
            const gradient = ctx.createLinearGradient(node.x, node.y, connectedNode.x, connectedNode.y);
            gradient.addColorStop(0, `${node.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${connectedNode.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + node.energy * 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
          }
        }
      });
    });
    
    // Draw nodes
    nodes.forEach((node) => {
      const glowIntensity = 0.5 + Math.sin(node.pulse) * 0.3 + node.energy * 0.5;
      const nodeSize = node.size * (1 + node.energy * 0.5);
      
      // Node glow
      const glowGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, nodeSize * 3
      );
      glowGradient.addColorStop(0, `${node.color}${Math.floor(glowIntensity * 100).toString(16).padStart(2, '0')}`);
      glowGradient.addColorStop(1, `${node.color}00`);
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Node core
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Energy pulse
      if (node.energy > 0.3) {
        ctx.strokeStyle = `${node.color}${Math.floor(node.energy * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize * (2 + Math.sin(node.pulse) * 0.5), 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    
    // Mouse glow effect
    if (interactive && mouse.isActive) {
      const glowGradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 120
      );
      glowGradient.addColorStop(0, `${colors.mouseGlow}30`);
      glowGradient.addColorStop(1, `${colors.mouseGlow}00`);
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [interactive, connectionDistance, colors]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const currentTime = performance.now();
    
    updateNodes(width, height, 16.67); // Assume 60fps
    render(ctx, width, height);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [updateNodes, render]);

  // Handle mouse events
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = (event.clientX - rect.left) * (canvasRef.current?.width || 1) / rect.width;
    mouseRef.current.y = (event.clientY - rect.top) * (canvasRef.current?.height || 1) / rect.height;
  }, [interactive]);

  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      mouseRef.current.isActive = true;
    }
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      mouseRef.current.isActive = false;
    }
  }, [interactive]);

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }
    
    initializeNodes(canvas.width / dpr, canvas.height / dpr);
  }, [initializeNodes]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initial setup
    handleResize();
    setIsVisible(true);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Event listeners
    const container = containerRef.current;
    if (container && interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (container && interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, handleResize, handleMouseMove, handleMouseEnter, handleMouseLeave, interactive]);

  return (
    <CanvasContainer
      ref={containerRef}
      zIndex={zIndex}
      opacity={isVisible ? opacity : 0}
      interactive={interactive}
    >
      <StyledCanvas ref={canvasRef} />
    </CanvasContainer>
  );
};

// Pre-configured variants
export const QuantumNeuralBackground: React.FC<Omit<NeuralBackgroundProps, 'colorScheme'>> = (props) => (
  <NeuralBackground {...props} colorScheme="quantum" />
);

export const PlasmaNeuralBackground: React.FC<Omit<NeuralBackgroundProps, 'colorScheme'>> = (props) => (
  <NeuralBackground {...props} colorScheme="plasma" />
);

export const NeuralNeuralBackground: React.FC<Omit<NeuralBackgroundProps, 'colorScheme'>> = (props) => (
  <NeuralBackground {...props} colorScheme="neural" />
);

// Usage examples:
/*
// Basic neural background
<NeuralBackground />

// High-density quantum background
<QuantumNeuralBackground 
  nodeCount={100} 
  maxConnections={8}
  opacity={0.8}
/>

// Interactive plasma background
<PlasmaNeuralBackground 
  interactive={true}
  animationSpeed={1.5}
  zIndex={-5}
/>

// Subtle neural background for content areas
<NeuralNeuralBackground 
  nodeCount={30}
  opacity={0.3}
  interactive={false}
/>
*/

export default NeuralBackground;