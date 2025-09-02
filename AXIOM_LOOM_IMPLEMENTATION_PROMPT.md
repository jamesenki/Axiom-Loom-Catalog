# Implementation Prompt: Axiom Loom Visual Transformation

## MISSION: Transform Axiom Loom Catalog's Visual Design

You are tasked with implementing a cutting-edge, future-forward design system for the Axiom Loom Catalog—a revolutionary developer portal created entirely by AI agents. This design must reflect the unprecedented nature of AI-generated architecture and solutions.

---

## IMMEDIATE IMPLEMENTATION TASKS

### Phase 1: Core Design System Setup

#### 1. Create New Color System
```typescript
// src/styles/axiom-theme.ts
export const axiomTheme = {
  colors: {
    // Primary Palette
    quantum: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6B46C1',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    neural: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      500: '#0EA5E9',
      600: '#0284C7',
      700: '#0369A1',
    },
    plasma: {
      500: '#F97316',
      600: '#EA580C',
      glow: '0 0 30px rgba(249, 115, 22, 0.5)',
    },
    matrix: {
      900: '#0A0A0B',
      800: '#18181B',
      700: '#27272A',
      600: '#3F3F46',
    },
    
    // Gradients
    gradients: {
      aurora: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      neutron: 'linear-gradient(135deg, #0EA5E9 0%, #6B46C1 100%)',
      supernova: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
      holographic: 'linear-gradient(45deg, #A78BFA, #60A5FA, #34D399, #FBBF24, #F87171)',
    },
    
    // Glass morphism
    glass: {
      background: 'rgba(15, 15, 20, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px 0 rgba(139, 92, 246, 0.2)',
    },
  },
  
  effects: {
    glow: {
      sm: '0 0 10px',
      md: '0 0 20px',
      lg: '0 0 30px',
    },
    blur: {
      sm: 'blur(4px)',
      md: 'blur(8px)',
      lg: 'blur(16px)',
    },
  },
}
```

#### 2. Logo Component
```tsx
// src/components/AxiomLogo.tsx
const AxiomLogo = () => (
  <svg viewBox="0 0 200 60" className="axiom-logo">
    {/* Animated neural network pattern */}
    <defs>
      <linearGradient id="axiom-gradient">
        <stop offset="0%" stopColor="#6B46C1">
          <animate attributeName="stop-color" 
            values="#6B46C1;#0EA5E9;#6B46C1" 
            dur="3s" 
            repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#0EA5E9">
          <animate attributeName="stop-color" 
            values="#0EA5E9;#6B46C1;#0EA5E9" 
            dur="3s" 
            repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    
    {/* Loom pattern suggesting weaving */}
    <path d="..." fill="url(#axiom-gradient)" />
    
    {/* Wordmark */}
    <text x="60" y="35" className="logo-text">AXIOM LOOM</text>
  </svg>
)
```

### Phase 2: Component Transformations

#### 1. Glassmorphic Card Component
```tsx
// src/components/styled/GlassCard.tsx
import styled from 'styled-components';

export const GlassCard = styled.div`
  background: rgba(15, 15, 20, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(139, 92, 246, 0.5), 
      transparent
    );
    animation: shimmer 3s infinite;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 10px 40px rgba(139, 92, 246, 0.3),
      0 0 60px rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.3);
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
```

#### 2. Quantum Button
```tsx
// src/components/styled/QuantumButton.tsx
export const QuantumButton = styled.button`
  background: linear-gradient(135deg, #6B46C1 0%, #0EA5E9 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
  }
`;
```

#### 3. Neural Network Background
```tsx
// src/components/NeuralBackground.tsx
const NeuralBackground = () => {
  useEffect(() => {
    // Initialize particles.js or three.js for animated background
    const canvas = document.getElementById('neural-canvas');
    // Create animated neural network visualization
    // Nodes pulsing, connections forming and breaking
    // Responds to mouse movement
  }, []);
  
  return (
    <canvas 
      id="neural-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.3,
      }}
    />
  );
};
```

### Phase 3: Page Enhancements

#### 1. Hero Section
```tsx
// src/components/HeroSection.tsx
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at center, 
    rgba(139, 92, 246, 0.1) 0%, 
    transparent 70%);
  
  .tagline {
    font-size: clamp(2rem, 5vw, 4rem);
    background: linear-gradient(135deg, #6B46C1 0%, #0EA5E9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5)); }
    to { filter: drop-shadow(0 0 30px rgba(14, 165, 233, 0.5)); }
  }
`;
```

#### 2. Repository Grid with Holographic Cards
```tsx
const RepositoryCard = styled(GlassCard)`
  &.premium {
    background: linear-gradient(135deg, 
      rgba(139, 92, 246, 0.1), 
      rgba(14, 165, 233, 0.1));
    
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, 
        #A78BFA, #60A5FA, #34D399, #FBBF24, #F87171);
      border-radius: 16px;
      z-index: -1;
      animation: rotate 3s linear infinite;
    }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
```

### Phase 4: Animations & Interactions

#### 1. Page Transitions
```tsx
// src/components/PageTransition.tsx
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
    },
  },
};
```

#### 2. Loading States
```tsx
const AIThinkingLoader = () => (
  <div className="ai-loader">
    {/* Pulsing neural network nodes */}
    <div className="neural-nodes">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="node"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
    <p>AI Agents Processing...</p>
  </div>
);
```

### Phase 5: Typography & Icons

#### 1. Custom Font Integration
```css
@font-face {
  font-family: 'Axiom Sans';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

.heading-quantum {
  font-family: 'Axiom Sans', system-ui;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
```

#### 2. Custom Icon Set
Create icons that reflect:
- Neural networks
- Data flows
- Quantum states
- AI processing
- Architecture blueprints

### Implementation Checklist

- [ ] Install dependencies: `framer-motion`, `three`, `@react-three/fiber`
- [ ] Create new theme file with Axiom colors
- [ ] Update styled-components theme provider
- [ ] Create logo component with animation
- [ ] Transform all cards to glass morphism
- [ ] Add neural network background
- [ ] Implement quantum buttons
- [ ] Add holographic effects to premium content
- [ ] Create loading animations
- [ ] Add micro-interactions
- [ ] Implement page transitions
- [ ] Update typography scale
- [ ] Add custom icons
- [ ] Create dark/light theme toggle with smooth transition
- [ ] Add particle effects
- [ ] Implement magnetic hover effects
- [ ] Add sound effects (optional)

### Performance Considerations

```typescript
// Use CSS containment for better performance
.card {
  contain: layout style paint;
}

// Use will-change sparingly
.interactive-element {
  will-change: transform;
}

// Implement intersection observer for animations
const useIntersectionAnimation = (ref, animation) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger animation
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
  }, []);
};
```

### Success Metrics

The transformation is complete when:
- [ ] First impression is "wow, this is from the future"
- [ ] Every interaction feels intelligent and responsive
- [ ] Loading states are mesmerizing, not frustrating
- [ ] The design showcases AI capabilities
- [ ] Performance remains smooth on all devices
- [ ] Accessibility is maintained (WCAG 2.1 AA)

---

## Start Implementation Now!

Begin with the color system and work your way through each phase. Make the Axiom Loom Catalog a showcase of what's possible when AI creates and designs software.

**Remember: Be bold. Be innovative. Be unforgettable.**