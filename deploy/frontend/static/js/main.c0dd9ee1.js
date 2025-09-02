(()=>{"use strict";var e={3202:(e,t,r)=>{r.d(t,{JH:()=>b,NL:()=>f,jn:()=>x});var o=r(65043),a=r(5464),i=r(9425),n=r(70579);const s=a.i7`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${i.kk.plasma.violet}40;
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 20px 10px ${i.kk.plasma.violet}10;
  }
`,l=a.i7`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`,d=a.i7`
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`,c=a.i7`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,p=a.i7`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`,m=a.Ay.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  
  border-radius: 0.75rem;
  cursor: pointer;
  overflow: hidden;
  
  transition: all ${i.Lj.duration.normal} ${i.Lj.easing.quantum};
  transform: translateZ(0); /* Hardware acceleration */
  
  /* Apply variant styles */
  ${e=>(e=>{const t={primary:a.AH`
      background: ${(0,i.p8)("45deg",i.kk.gradients.aurora.start,i.kk.gradients.aurora.middle,i.kk.gradients.aurora.end)};
      background-size: 200% 200%;
      color: ${i.kk.quantum.deep};
      border: 1px solid transparent;
      
      &:hover:not(:disabled) {
        animation: ${a.AH`${l}`} 2s ease infinite;
        box-shadow: ${(0,i.UT)(i.kk.plasma.violet,"medium")};
      }
    `,secondary:a.AH`
      background: ${(0,i.p8)("45deg",i.kk.gradients.neutron.start,i.kk.gradients.neutron.middle,i.kk.gradients.neutron.end)};
      background-size: 200% 200%;
      color: ${i.kk.neural.electric};
      border: 1px solid ${i.kk.plasma.cyan}40;
      
      &:hover:not(:disabled) {
        animation: ${a.AH`${l}`} 2s ease infinite;
        border-color: ${i.kk.plasma.cyan};
      }
    `,accent:a.AH`
      background: ${(0,i.p8)("45deg",i.kk.gradients.supernova.start,i.kk.gradients.supernova.middle,i.kk.gradients.supernova.end)};
      background-size: 200% 200%;
      color: ${i.kk.quantum.deep};
      border: 1px solid transparent;
      
      &:hover:not(:disabled) {
        animation: ${a.AH`${l}`} 1.5s ease infinite;
        box-shadow: ${(0,i.UT)(i.kk.plasma.crimson,"large")};
      }
    `,ghost:a.AH`
      background: transparent;
      color: ${i.kk.neural.electric};
      border: 2px solid ${i.kk.plasma.cyan}60;
      backdrop-filter: blur(0px);
      
      &:hover:not(:disabled) {
        background: ${i.kk.plasma.cyan}10;
        border-color: ${i.kk.plasma.cyan};
        box-shadow: 
          inset 0 0 20px ${i.kk.plasma.cyan}20,
          0 0 20px ${i.kk.plasma.cyan}40;
      }
    `,glass:a.AH`
      background: ${i.kk.glass.background};
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      color: ${i.kk.neural.electric};
      border: 1px solid ${i.kk.glass.border};
      
      &:hover:not(:disabled) {
        background: ${i.kk.glass.hover};
        border-color: ${i.kk.plasma.violet}40;
        box-shadow: 0 8px 32px ${i.kk.plasma.violet}20;
      }
    `};return t[e]||t.primary})(e.variant)}
  
  /* Apply size styles */
  ${e=>(e=>{const t={xs:a.AH`
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      min-height: 28px;
    `,sm:a.AH`
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      min-height: 36px;
    `,md:a.AH`
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      min-height: 44px;
    `,lg:a.AH`
      padding: 1rem 2rem;
      font-size: 1.125rem;
      min-height: 52px;
    `,xl:a.AH`
      padding: 1.25rem 2.5rem;
      font-size: 1.25rem;
      min-height: 60px;
    `};return t[e]||t.md})(e.size)}
  
  /* Glow effect */
  ${e=>e.glowEffect&&a.AH`
    &:hover:not(:disabled) {
      animation: ${a.AH`${s}`} 2s ease-in-out infinite;
    }
  `}
  
  /* Pulse effect */
  ${e=>e.pulseEffect&&a.AH`
    animation: ${a.AH`${s}`} 3s ease-in-out infinite;
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
      animation: none;
    }
  }
  
  /* Loading state */
  ${e=>e.isLoading&&a.AH`
    cursor: wait;
    
    &:hover {
      transform: none;
    }
  `}
  
  /* Focus styles */
  &:focus-visible {
    outline: none;
    box-shadow: 
      0 0 0 3px ${i.kk.plasma.violet}40,
      inset 0 0 20px ${i.kk.plasma.violet}20;
  }
  
  /* Active state */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`,h=a.Ay.div`
  position: absolute;
  border-radius: 50%;
  background: ${e=>e.color};
  width: 4px;
  height: 4px;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  animation: ${a.AH`${d}`} 0.6s ease-out;
  pointer-events: none;
`,u=a.Ay.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${a.AH`${c}`} 1s linear infinite;
`,g=a.Ay.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    ${i.kk.plasma.cyan}15,
    transparent
  );
  background-size: 200% 100%;
  animation: ${a.AH`${p}`} 3s ease-in-out infinite;
  pointer-events: none;
  opacity: 0;
  transition: opacity ${i.Lj.duration.normal} ease;
`,y=e=>{let{variant:t="primary",size:r="md",loading:a=!1,glowEffect:s=!1,pulseEffect:l=!1,holographicEffect:d=!1,leftIcon:c,rightIcon:p,children:y,onClick:x,disabled:f,...b}=e;const[v,$]=o.useState([]),[k,w]=o.useState(!1);return(0,n.jsxs)(m,{variant:t,size:r,isLoading:a,glowEffect:s,pulseEffect:l,onClick:e=>{if(f||a)return;const r=e.currentTarget.getBoundingClientRect(),o=e.clientX-r.left,n=e.clientY-r.top,s=Date.now(),l={primary:i.kk.plasma.cyan+"60",secondary:i.kk.neural.electric+"60",accent:i.kk.plasma.violet+"60",ghost:i.kk.plasma.cyan+"60",glass:i.kk.plasma.violet+"60"}[t];$(e=>[...e,{x:o,y:n,id:s,color:l}]),setTimeout(()=>{$(e=>e.filter(e=>e.id!==s))},600),x&&x(e)},onMouseEnter:()=>w(!0),onMouseLeave:()=>w(!1),disabled:f||a,...b,children:[a?(0,n.jsx)(u,{}):c&&(0,n.jsx)("span",{children:c}),(0,n.jsx)("span",{children:y}),!a&&p&&(0,n.jsx)("span",{children:p}),d&&(0,n.jsx)(g,{style:{opacity:k?1:0}}),v.map(e=>(0,n.jsx)(h,{x:e.x,y:e.y,color:e.color},e.id))]})},x=e=>(0,n.jsx)(y,{...e,variant:"primary"}),f=e=>(0,n.jsx)(y,{...e,variant:"accent",glowEffect:!0}),b=e=>(0,n.jsx)(y,{...e,variant:"glass",holographicEffect:!0})},4372:(e,t,r)=>{var o=r(65043),a=r(84391),i=r(35475),n=r(73216),s=r(5464),l=r(9425),d=r(34594);const c={...d.A,colors:{...d.A.colors,...l.Up.colors,primary:{...d.A.colors.primary,main:l.kk.plasma.violet},background:{...d.A.colors.background,primary:l.kk.quantum.deep,secondary:l.kk.quantum.void},text:{...d.A.colors.text,primary:l.kk.neural.bright,secondary:l.kk.neural.light},border:{...d.A.colors.border,light:l.kk.glass.border,medium:l.kk.glass.border}},quantum:l.Up.colors.quantum,neural:l.Up.colors.neural,plasma:l.Up.colors.plasma,glass:l.Up.colors.glass,gradients:l.Up.colors.gradients,typography:{...d.A.typography,...l.Up.typography},spacing:d.A.spacing,layout:d.A.layout,shadows:d.A.shadows,breakpoints:d.A.breakpoints,containers:d.A.containers,animations:d.A.animations,components:{...d.A.components,button:{...d.A.components.button,borderRadius:"12px"},card:{...d.A.components.card,borderRadius:"16px",background:l.Up.colors.glass.background,border:`1px solid ${l.Up.colors.glass.border}`}}},p=s.DU`
  /* Import Quantum Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* Axiom Loom CSS Custom Properties */
  :root {
    /* Quantum Colors */
    --quantum-deep: ${l.kk.quantum.deep};
    --quantum-void: ${l.kk.quantum.void};
    --quantum-dark: ${l.kk.quantum.dark};
    --quantum-medium: ${l.kk.quantum.medium};
    --quantum-light: ${l.kk.quantum.light};
    --quantum-bright: ${l.kk.quantum.bright};
    --quantum-glow: ${l.kk.quantum.glow};

    /* Neural Blues */
    --neural-deep: ${l.kk.neural.deep};
    --neural-dark: ${l.kk.neural.dark};
    --neural-medium: ${l.kk.neural.medium};
    --neural-light: ${l.kk.neural.light};
    --neural-bright: ${l.kk.neural.bright};
    --neural-glow: ${l.kk.neural.glow};
    --neural-electric: ${l.kk.neural.electric};

    /* Plasma Accents */
    --plasma-violet: ${l.kk.plasma.violet};
    --plasma-cyan: ${l.kk.plasma.cyan};
    --plasma-magenta: ${l.kk.plasma.magenta};
    --plasma-gold: ${l.kk.plasma.gold};
    --plasma-emerald: ${l.kk.plasma.emerald};
    --plasma-crimson: ${l.kk.plasma.crimson};

    /* Glass Morphism */
    --glass-background: ${l.kk.glass.background};
    --glass-border: ${l.kk.glass.border};
    --glass-hover: ${l.kk.glass.hover};
    --glass-active: ${l.kk.glass.active};

    /* Typography */
    --font-primary: ${l.Up.typography.fonts.primary};
    --font-mono: ${l.Up.typography.fonts.mono};
    --font-display: ${l.Up.typography.fonts.display};

    /* Spacing */
    --spacing-px: ${l.Up.spacing.px};
    --spacing-1: ${l.Up.spacing[1]};
    --spacing-2: ${l.Up.spacing[2]};
    --spacing-3: ${l.Up.spacing[3]};
    --spacing-4: ${l.Up.spacing[4]};
    --spacing-5: ${l.Up.spacing[5]};
    --spacing-6: ${l.Up.spacing[6]};
    --spacing-8: ${l.Up.spacing[8]};
    --spacing-10: ${l.Up.spacing[10]};
    --spacing-12: ${l.Up.spacing[12]};
    --spacing-16: ${l.Up.spacing[16]};
    --spacing-20: ${l.Up.spacing[20]};
    --spacing-24: ${l.Up.spacing[24]};
    --spacing-32: ${l.Up.spacing[32]};
  }

  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-primary);
    font-size: ${e=>e.theme.typography.fontSize.base};
    line-height: ${e=>e.theme.typography.lineHeight.normal};
    
    /* Dark Theme as Primary */
    color: var(--neural-electric);
    background: linear-gradient(
      135deg,
      var(--quantum-deep) 0%,
      var(--quantum-void) 25%,
      var(--neural-deep) 50%,
      var(--quantum-dark) 75%,
      var(--quantum-void) 100%
    );
    background-attachment: fixed;
    background-size: 400% 400%;
    animation: gradientShift 20s ease infinite;
    
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Quantum Animation Keyframes */
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes neuralPulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  @keyframes quantumGlow {
    0%, 100% {
      box-shadow: 0 0 20px var(--plasma-violet);
    }
    33% {
      box-shadow: 0 0 30px var(--plasma-cyan);
    }
    66% {
      box-shadow: 0 0 25px var(--plasma-emerald);
    }
  }

  @keyframes holographicShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes particleFloat {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-10px) translateX(5px); }
    50% { transform: translateY(-5px) translateX(-5px); }
    75% { transform: translateY(-15px) translateX(10px); }
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-4);
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    color: var(--neural-electric);
    
    /* Quantum text glow effect */
    text-shadow: 0 0 10px var(--plasma-cyan);
    
    /* Gradient text for headings */
    background: linear-gradient(
      45deg,
      var(--plasma-violet),
      var(--plasma-cyan),
      var(--plasma-emerald)
    );
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 8s ease-in-out infinite;
  }

  h1 {
    font-size: ${e=>e.theme.typography.fontSize["5xl"]};
    ${e=>e.theme.breakpoints.down.md} {
      font-size: ${e=>e.theme.typography.fontSize["4xl"]};
    }
  }

  h2 {
    font-size: ${e=>e.theme.typography.fontSize["4xl"]};
    ${e=>e.theme.breakpoints.down.md} {
      font-size: ${e=>e.theme.typography.fontSize["3xl"]};
    }
  }

  h3 {
    font-size: ${e=>e.theme.typography.fontSize["3xl"]};
    ${e=>e.theme.breakpoints.down.md} {
      font-size: ${e=>e.theme.typography.fontSize["2xl"]};
    }
  }

  h4 {
    font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  }

  h5 {
    font-size: ${e=>e.theme.typography.fontSize.xl};
  }

  h6 {
    font-size: ${e=>e.theme.typography.fontSize.lg};
  }

  p {
    margin-bottom: var(--spacing-4);
    line-height: 1.6;
    color: var(--neural-light);
  }

  /* Links */
  a {
    color: var(--plasma-cyan);
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;
    
    /* Quantum link glow */
    text-shadow: 0 0 5px var(--plasma-cyan);
    
    &::before {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        var(--plasma-violet),
        var(--plasma-cyan)
      );
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--plasma-violet);
      text-shadow: 0 0 10px var(--plasma-violet);
      
      &::before {
        width: 100%;
      }
    }

    &:focus {
      outline: none;
      box-shadow: 
        0 0 0 2px var(--plasma-cyan),
        0 0 20px var(--plasma-cyan);
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${e=>e.theme.spacing[4]};
    padding-left: ${e=>e.theme.spacing[6]};
  }

  li {
    margin-bottom: ${e=>e.theme.spacing[2]};
  }

  /* Code */
  code {
    font-family: ${e=>e.theme.typography.fontFamily.mono};
    font-size: ${e=>e.theme.typography.fontSize.sm};
    background-color: ${e=>e.theme.colors.background.secondary};
    padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
    border-radius: ${e=>e.theme.borderRadius.sm};
  }

  pre {
    font-family: ${e=>e.theme.typography.fontFamily.mono};
    font-size: ${e=>e.theme.typography.fontSize.sm};
    background-color: ${e=>e.theme.colors.background.secondary};
    padding: ${e=>e.theme.spacing[4]};
    border-radius: ${e=>e.theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${e=>e.theme.spacing[4]};
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${e=>e.theme.spacing[4]};
  }

  th, td {
    padding: ${e=>e.theme.spacing[3]};
    text-align: left;
    border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  }

  th {
    font-weight: ${e=>e.theme.typography.fontWeight.semibold};
    background-color: ${e=>e.theme.colors.background.secondary};
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Quantum Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--glass-background);
    backdrop-filter: blur(0px);
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      45deg,
      var(--plasma-violet),
      var(--plasma-cyan)
    );
    border-radius: 6px;
    border: 2px solid var(--quantum-void);
    box-shadow: 0 0 10px var(--plasma-violet);
    
    &:hover {
      background: linear-gradient(
        45deg,
        var(--plasma-cyan),
        var(--plasma-emerald)
      );
      box-shadow: 0 0 20px var(--plasma-cyan);
    }
  }

  /* Quantum Selection */
  ::selection {
    background: linear-gradient(
      45deg,
      var(--plasma-violet),
      var(--plasma-cyan)
    );
    color: var(--quantum-deep);
    text-shadow: none;
  }

  /* Quantum Focus Visible */
  :focus-visible {
    outline: none;
    box-shadow: 
      0 0 0 2px var(--plasma-cyan),
      0 0 20px var(--plasma-cyan);
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Loading State */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid ${e=>e.theme.colors.border.light};
    border-top-color: ${e=>e.theme.colors.primary.yellow};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;var m=r(51403),h=r(58280),u=r(34537),g=r(9461),y=r(50516),x=r(39292),f=r(40614),b=r(85367),v=r(41680),$=r(72105),k=r(38298),w=r(29350),A=r(75088),S=r(72362);const j=new class{constructor(){this.searchIndex=new Map,this.repositoryMetadata=new Map}async buildSearchIndex(e){this.searchIndex.clear(),this.repositoryMetadata.clear();for(const t of e)this.repositoryMetadata.set(t.name,t),await this.indexRepository(t)}async search(e){try{const t=await fetch((0,S.e9)("/api/search"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error("Search API error");return await t.json()}catch(t){return this.localSearch(e)}}async localSearch(e){const t=Date.now(),{query:r,scope:o="all",filters:a={},limit:i=20,offset:n=0,sortBy:s="relevance"}=e,l=this.tokenize(r.toLowerCase()),d=[],c=this.initializeFacets();for(const[u,g]of this.searchIndex){if("all"!==o&&!this.matchesScope(g,o))continue;if(!this.matchesFilters(g,a))continue;const e=this.calculateScore(l,g);if(e>0){const t=this.createSearchResult(u,g,l,e);d.push(t),this.updateFacets(c,g)}}const p=this.sortResults(d,s,e.sortOrder),m=p.slice(n,n+i),h=this.generateSuggestions(r,d);return{query:r,results:m,totalCount:p.length,facets:this.finalizeFacets(c),suggestions:h,executionTime:Date.now()-t}}async searchInRepository(e,t){const r={query:t,filters:{repositories:[e]}};return(await this.search(r)).results}async getSuggestions(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5;try{const t=await fetch((0,S.e9)(`/api/search/suggestions?q=${encodeURIComponent(e)}`));if(!t.ok)throw new Error("Suggestions API error");return await t.json()}catch(r){const o=this.tokenize(e.toLowerCase()),a=new Set;for(const[e,i]of this.searchIndex)for(const r of i.tokens)if(r.startsWith(o[0])&&r!==o[0]&&(a.add(r),a.size>=t))return Array.from(a);return Array.from(a)}}getPopularTerms(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;const t=new Map;for(const[r,o]of this.searchIndex)for(const e of o.tokens)t.set(e,(t.get(e)||0)+1);return Array.from(t.entries()).sort((e,t)=>t[1]-e[1]).slice(0,e).map(e=>{let[t]=e;return t})}async indexRepository(e){const t=`repo:${e.name}`;this.searchIndex.set(t,{type:"repository",repository:e.name,title:e.name,content:`${e.name} ${e.description} ${e.topics.join(" ")}`,tokens:this.tokenize(`${e.name} ${e.description} ${e.topics.join(" ")}`),metadata:{language:e.language,topics:e.topics,hasApiDocs:e.hasApiDocs,lastUpdated:e.lastUpdated}})}tokenize(e){return e.toLowerCase().replace(/[^a-z0-9\s-_]/g," ").split(/\s+/).filter(e=>e.length>2)}calculateScore(e,t){var r;let o=0;const a=new Set(t.tokens);for(const i of e){a.has(i)&&(o+=10);for(const e of a)e.startsWith(i)&&(o+=5),this.levenshteinDistance(i,e)<=2&&(o+=2)}if("repository"===t.type&&(o*=1.5),"api"===t.type&&(o*=1.3),null!==(r=t.metadata)&&void 0!==r&&r.lastUpdated){(Date.now()-new Date(t.metadata.lastUpdated).getTime())/864e5<30&&(o*=1.2)}return o}levenshteinDistance(e,t){const r=[];for(let o=0;o<=t.length;o++)r[o]=[o];for(let o=0;o<=e.length;o++)r[0][o]=o;for(let o=1;o<=t.length;o++)for(let a=1;a<=e.length;a++)t.charAt(o-1)===e.charAt(a-1)?r[o][a]=r[o-1][a-1]:r[o][a]=Math.min(r[o-1][a-1]+1,r[o][a-1]+1,r[o-1][a]+1);return r[t.length][e.length]}matchesScope(e,t){var r,o;switch(t){case"repositories":return"repository"===e.type;case"documentation":return"file"===e.type&&null!==(r=null===(o=e.path)||void 0===o?void 0:o.endsWith(".md"))&&void 0!==r&&r;case"apis":return"api"===e.type;default:return!0}}matchesFilters(e,t){var r,o,a,i,n,s,l;if(null!==(r=t.repositories)&&void 0!==r&&r.length&&!t.repositories.includes(e.repository))return!1;if(null!==(o=t.languages)&&void 0!==o&&o.length&&null!==(a=e.metadata)&&void 0!==a&&a.language&&!t.languages.includes(e.metadata.language))return!1;if(null!==(i=t.apiTypes)&&void 0!==i&&i.length&&"api"===e.type&&null!==(n=e.metadata)&&void 0!==n&&n.apiType&&!t.apiTypes.includes(e.metadata.apiType))return!1;if(void 0!==t.hasApiDocs&&(null===(s=e.metadata)||void 0===s?void 0:s.hasApiDocs)!==t.hasApiDocs)return!1;if(null!==(l=t.topics)&&void 0!==l&&l.length){var d;const r=(null===(d=e.metadata)||void 0===d?void 0:d.topics)||[];if(!t.topics.some(e=>r.includes(e)))return!1}return!0}createSearchResult(e,t,r,o){var a;const i=this.generateHighlights(t,r);return{id:e,type:t.type,title:t.title,description:null===(a=t.metadata)||void 0===a?void 0:a.description,repository:t.repository,path:t.path,score:o,highlights:i,metadata:t.metadata}}generateHighlights(e,t){const r=[],o=e.content.toLowerCase();for(const a of t){const t=o.indexOf(a);if(-1!==t){const i=Math.max(0,t-30),n=Math.min(o.length,t+a.length+30),s="..."+e.content.slice(i,n)+"...";r.push({field:"content",snippet:s,matchedTokens:[a]})}}return r}sortResults(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"desc";const o=[...e];switch(t){case"relevance":o.sort((e,t)=>t.score-e.score);break;case"name":o.sort((e,t)=>e.title.localeCompare(t.title));break;case"updated":o.sort((e,t)=>{var r,o;const a=new Date((null===(r=e.metadata)||void 0===r?void 0:r.lastUpdated)||0).getTime();return new Date((null===(o=t.metadata)||void 0===o?void 0:o.lastUpdated)||0).getTime()-a});break;case"type":o.sort((e,t)=>e.type.localeCompare(t.type))}return"asc"===r&&"relevance"!==t&&o.reverse(),o}initializeFacets(){return{repositories:[],languages:[],apiTypes:[],fileTypes:[],topics:[]}}updateFacets(e,t){var r,o,a;if(this.updateFacetValue(e.repositories,t.repository),null!==(r=t.metadata)&&void 0!==r&&r.language&&this.updateFacetValue(e.languages,t.metadata.language),"api"===t.type&&null!==(o=t.metadata)&&void 0!==o&&o.apiType&&this.updateFacetValue(e.apiTypes,t.metadata.apiType),null!==(a=t.metadata)&&void 0!==a&&a.topics)for(const i of t.metadata.topics)this.updateFacetValue(e.topics,i)}updateFacetValue(e,t){const r=e.find(e=>e.value===t);r?r.count++:e.push({value:t,count:1})}finalizeFacets(e){return{repositories:e.repositories.sort((e,t)=>t.count-e.count),languages:e.languages.sort((e,t)=>t.count-e.count),apiTypes:e.apiTypes.sort((e,t)=>t.count-e.count),fileTypes:e.fileTypes.sort((e,t)=>t.count-e.count),topics:e.topics.sort((e,t)=>t.count-e.count)}}generateSuggestions(e,t){const r=new Set,o=e.toLowerCase();for(const a of t.slice(0,10)){const e=this.tokenize(a.title);for(const t of e)t.includes(o)&&t!==o&&r.add(t)}return Array.from(r).slice(0,5)}};var z=r(70579);const E=e=>{let{onResultSelect:t,initialQuery:r="",className:a=""}=e;const[i,n]=(0,o.useState)(r),[s,l]=(0,o.useState)("all"),[d,c]=(0,o.useState)({}),[p,m]=(0,o.useState)(!1),[h,u]=(0,o.useState)(null),[g,y]=(0,o.useState)(!1),[S,E]=(0,o.useState)([]),[C,T]=(0,o.useState)(!1),[R,F]=(0,o.useState)(-1),P=(0,o.useRef)(null),_=function(e,t){const[r,a]=(0,o.useState)(e);return(0,o.useEffect)(()=>{const r=setTimeout(()=>{a(e)},t);return()=>{clearTimeout(r)}},[e,t]),r}(i,300);(0,o.useEffect)(()=>{_||Object.keys(d).length>0?H():u(null)},[_,s,d]),(0,o.useEffect)(()=>{i.length>=2&&i!==_?I():(E([]),T(!1))},[i]);const H=async()=>{y(!0);try{const e={query:_,scope:s,filters:d,limit:20},t=await j.search(e);u(t)}catch(e){}finally{y(!1)}},I=async()=>{try{const e=await j.getSuggestions(i);E(e),T(e.length>0)}catch(e){}},N=e=>{var t;n(e),T(!1),F(-1),null===(t=P.current)||void 0===t||t.focus()},O=(e,t)=>{c(r=>{const o={...r};if(Array.isArray(o[e])){const r=o[e],a=r.indexOf(t);a>-1?(r.splice(a,1),0===r.length&&delete o[e]):r.push(t)}else o[e]===t?delete o[e]:o[e]=t;return o})},L=e=>{switch(e){case"repository":return(0,z.jsx)(b.A,{className:"w-4 h-4"});case"file":default:return(0,z.jsx)(v.A,{className:"w-4 h-4"});case"api":return(0,z.jsx)($.A,{className:"w-4 h-4"})}},D=(e,t)=>{let r=e;return t.forEach(e=>{const t=new RegExp(`(${e})`,"gi");r=r.replace(t,'<mark class="bg-yellow-200">$1</mark>')}),r};return(0,z.jsxs)("div",{className:`advanced-search ${a}`,children:[(0,z.jsxs)("div",{className:"relative",children:[(0,z.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,z.jsxs)("div",{className:"relative flex-1",children:[(0,z.jsx)(x.A,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"}),(0,z.jsx)("input",{ref:P,type:"text",value:i,onChange:e=>n(e.target.value),onKeyDown:e=>{if(C)switch(e.key){case"ArrowDown":e.preventDefault(),F(e=>e<S.length-1?e+1:e);break;case"ArrowUp":e.preventDefault(),F(e=>e>-1?e-1:-1);break;case"Enter":e.preventDefault(),R>=0&&N(S[R]);break;case"Escape":T(!1),F(-1)}},onFocus:()=>T(S.length>0),onBlur:()=>setTimeout(()=>T(!1),200),placeholder:"Search repositories, documentation, APIs...",className:"w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}),i&&(0,z.jsx)("button",{onClick:()=>n(""),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",children:(0,z.jsx)(f.A,{className:"w-4 h-4"})}),C&&(0,z.jsx)("div",{className:"absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10",children:S.map((e,t)=>(0,z.jsx)("button",{onClick:()=>N(e),className:"w-full px-4 py-2 text-left hover:bg-gray-50 "+(t===R?"bg-gray-100":""),children:e},e))})]}),(0,z.jsxs)("button",{onClick:()=>m(!p),className:"flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 "+(p?"bg-gray-50":""),children:[(0,z.jsx)(k.A,{className:"w-4 h-4"}),"Filters",Object.keys(d).length>0&&(0,z.jsx)("span",{className:"bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full",children:Object.keys(d).length})]})]}),(0,z.jsx)("div",{className:"flex gap-2 mb-4",children:["all","repositories","documentation","apis"].map(e=>(0,z.jsx)("button",{onClick:()=>l(e),className:"px-4 py-1 rounded-full text-sm capitalize "+(s===e?"bg-blue-500 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"),children:e},e))})]}),p&&(0,z.jsxs)("div",{className:"mb-4 p-4 bg-gray-50 rounded-lg",children:[(0,z.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,z.jsx)("h3",{className:"font-medium",children:"Filters"}),(0,z.jsx)("button",{onClick:()=>{c({})},className:"text-sm text-blue-500 hover:text-blue-600",children:"Clear all"})]}),(null===h||void 0===h?void 0:h.facets)&&(0,z.jsxs)("div",{className:"space-y-3",children:[h.facets.languages.length>0&&(0,z.jsxs)("div",{children:[(0,z.jsx)("h4",{className:"text-sm font-medium mb-2",children:"Language"}),(0,z.jsx)("div",{className:"flex flex-wrap gap-2",children:h.facets.languages.map(e=>{var t;let{value:r,count:o}=e;return(0,z.jsxs)("button",{onClick:()=>O("languages",r),className:"px-3 py-1 text-sm rounded-full "+(null!==(t=d.languages)&&void 0!==t&&t.includes(r)?"bg-blue-500 text-white":"bg-white border hover:bg-gray-50"),children:[r," (",o,")"]},r)})})]}),h.facets.apiTypes.length>0&&(0,z.jsxs)("div",{children:[(0,z.jsx)("h4",{className:"text-sm font-medium mb-2",children:"API Type"}),(0,z.jsx)("div",{className:"flex flex-wrap gap-2",children:h.facets.apiTypes.map(e=>{var t;let{value:r,count:o}=e;return(0,z.jsxs)("button",{onClick:()=>O("apiTypes",r),className:"px-3 py-1 text-sm rounded-full "+(null!==(t=d.apiTypes)&&void 0!==t&&t.includes(r)?"bg-blue-500 text-white":"bg-white border hover:bg-gray-50"),children:[r.toUpperCase()," (",o,")"]},r)})})]}),h.facets.topics.length>0&&(0,z.jsxs)("div",{children:[(0,z.jsx)("h4",{className:"text-sm font-medium mb-2",children:"Topics"}),(0,z.jsx)("div",{className:"flex flex-wrap gap-2",children:h.facets.topics.slice(0,10).map(e=>{var t;let{value:r,count:o}=e;return(0,z.jsxs)("button",{onClick:()=>O("topics",r),className:"px-3 py-1 text-sm rounded-full "+(null!==(t=d.topics)&&void 0!==t&&t.includes(r)?"bg-blue-500 text-white":"bg-white border hover:bg-gray-50"),children:[(0,z.jsx)(w.A,{className:"w-3 h-3 inline mr-1"}),r," (",o,")"]},r)})})]})]})]}),g&&(0,z.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Searching..."}),!g&&h&&(0,z.jsxs)("div",{children:[(0,z.jsx)("div",{className:"flex items-center justify-between mb-4",children:(0,z.jsxs)("p",{className:"text-sm text-gray-600",children:["Found ",h.totalCount," results",h.executionTime&&(0,z.jsxs)("span",{className:"text-gray-400",children:[" in ",h.executionTime,"ms"]})]})}),(0,z.jsx)("div",{className:"space-y-3",children:h.results.map(e=>{var r;return(0,z.jsx)("div",{onClick:()=>null===t||void 0===t?void 0:t(e),className:"p-4 bg-white border rounded-lg hover:shadow-md cursor-pointer transition-shadow",children:(0,z.jsxs)("div",{className:"flex items-start gap-3",children:[(0,z.jsx)("div",{className:"text-gray-400 mt-1",children:L(e.type)}),(0,z.jsxs)("div",{className:"flex-1",children:[(0,z.jsxs)("h3",{className:"font-medium text-lg flex items-center gap-2",children:[e.title,(0,z.jsx)("span",{className:"text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded",children:e.type})]}),e.description&&(0,z.jsx)("p",{className:"text-gray-600 text-sm mt-1",children:e.description}),(0,z.jsxs)("div",{className:"flex items-center gap-4 mt-2 text-xs text-gray-500",children:[(0,z.jsx)("span",{children:e.repository}),e.path&&(0,z.jsx)("span",{children:e.path}),(null===(r=e.metadata)||void 0===r?void 0:r.lastUpdated)&&(0,z.jsxs)("span",{className:"flex items-center gap-1",children:[(0,z.jsx)(A.A,{className:"w-3 h-3"}),new Date(e.metadata.lastUpdated).toLocaleDateString()]})]}),e.highlights.length>0&&(0,z.jsx)("div",{className:"mt-2",children:e.highlights.map((e,t)=>(0,z.jsx)("div",{className:"text-sm text-gray-600",dangerouslySetInnerHTML:{__html:D(e.snippet,e.matchedTokens)}},t))})]})]})},e.id)})}),0===h.results.length&&(0,z.jsxs)("div",{className:"text-center py-8 text-gray-500",children:[(0,z.jsxs)("p",{children:['No results found for "',i,'"']}),h.suggestions&&h.suggestions.length>0&&(0,z.jsxs)("div",{className:"mt-4",children:[(0,z.jsx)("p",{className:"text-sm",children:"Did you mean:"}),(0,z.jsx)("div",{className:"flex justify-center gap-2 mt-2",children:h.suggestions.map(e=>(0,z.jsx)("button",{onClick:()=>n(e),className:"text-blue-500 hover:text-blue-600",children:e},e))})]})]})]})]})},C=s.i7`
  from { opacity: 0; }
  to { opacity: 1; }
`,T=s.i7`
  from { opacity: 1; }
  to { opacity: 0; }
`,R=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(0px);
  z-index: 1000;
  display: ${e=>e.isOpen?"flex":"none"};
  align-items: flex-start;
  justify-content: center;
  padding: ${e=>e.theme.spacing[16]} ${e=>e.theme.spacing[4]};
  animation: ${e=>e.isOpen?s.AH`${C}`:s.AH`${T}`} 0.3s ease-in-out;
`,F=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border-radius: ${e=>e.theme.borderRadius.lg};
  box-shadow: ${e=>e.theme.shadows.xl};
  width: 100%;
  max-width: 896px;
  max-height: 80vh;
  overflow: hidden;
  transform: ${e=>e.isOpen?"translateY(0) scale(1)":"translateY(-20px) scale(0.95)"};
  transition: transform 0.3s ease-in-out;
  border: 2px solid ${e=>e.theme.colors.primary.yellow};
`,P=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-bottom: 2px solid ${e=>e.theme.colors.primary.yellow};
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
`,_=s.Ay.h2`
  margin: 0;
  font-size: ${e=>e.theme.typography.fontSize.xl};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.primary.white};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
`,H=s.Ay.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.primary.white};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 230, 0, 0.2);
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid ${e=>e.theme.colors.primary.yellow};
    outline-offset: 2px;
  }
`,I=s.Ay.div`
  padding: ${e=>e.theme.spacing[6]};
  max-height: calc(80vh - 140px);
  overflow-y: auto;
`,N=s.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[6]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  background: ${e=>e.theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
`,O=s.Ay.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[4]};
`,L=s.Ay.kbd`
  background: ${e=>e.theme.colors.background.tertiary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.sm};
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  color: ${e=>e.theme.colors.text.primary};
`,D=e=>{let{isOpen:t,onClose:r}=e;const a=(0,o.useRef)(null),i=(0,n.Zp)();(0,o.useEffect)(()=>{const e=e=>{"Escape"===e.key&&t&&r()};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[t,r]),(0,o.useEffect)(()=>(document.body.style.overflow=t?"hidden":"",()=>{document.body.style.overflow=""}),[t]);return t?(0,z.jsx)(R,{isOpen:t,onClick:e=>{e.target===e.currentTarget&&r()},children:(0,z.jsxs)(F,{isOpen:t,ref:a,onClick:e=>e.stopPropagation(),children:[(0,z.jsxs)(P,{children:[(0,z.jsxs)(_,{children:[(0,z.jsx)(x.A,{size:24}),"Search Axiom Loom Catalog"]}),(0,z.jsx)(H,{onClick:r,"aria-label":"Close search modal",children:(0,z.jsx)(f.A,{size:20})})]}),(0,z.jsx)(I,{children:(0,z.jsx)(E,{onResultSelect:e=>{switch(r(),e.type){case"repository":default:i(`/repository/${e.repository}`);break;case"file":i(`/repository/${e.repository}?file=${e.path}`);break;case"api":i(`/api-hub/${e.repository}`)}},className:"w-full"})}),(0,z.jsxs)(N,{children:[(0,z.jsxs)(O,{children:[(0,z.jsxs)("span",{children:[(0,z.jsx)(L,{children:"\u2191\u2193"})," Navigate"]}),(0,z.jsxs)("span",{children:[(0,z.jsx)(L,{children:"Enter"})," Select"]}),(0,z.jsxs)("span",{children:[(0,z.jsx)(L,{children:"Esc"})," Close"]})]}),(0,z.jsxs)("div",{children:["Press ",(0,z.jsx)(L,{children:"Cmd+K"})," to open search"]})]})]})}):null},U=s.i7`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
`,B=s.i7`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`,M=s.i7`
  0%, 100% {
    filter: drop-shadow(0 0 4px ${l.kk.plasma.violet});
  }
  33% {
    filter: drop-shadow(0 0 8px ${l.kk.plasma.cyan});
  }
  66% {
    filter: drop-shadow(0 0 6px ${l.kk.plasma.emerald});
  }
`,W=s.i7`
  0% {
    stroke-dashoffset: 100;
    opacity: 0.2;
  }
  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -100;
    opacity: 0.2;
  }
`,q=s.Ay.div.withConfig({shouldForwardProp:e=>!["size","animated"].includes(e)})`
  display: inline-flex;
  align-items: center;
  gap: ${e=>{switch(e.size){case"small":return"0.5rem";case"large":return"1.5rem";default:return"1rem"}}};
  
  svg {
    width: ${e=>{switch(e.size){case"small":return"32px";case"large":return"64px";default:return"48px"}}};
    height: ${e=>{switch(e.size){case"small":return"32px";case"large":return"64px";default:return"48px"}}};
    
    ${e=>e.animated&&s.AH`
      animation: ${U} 3s ease-in-out infinite;
    `}
  }
`,K=s.Ay.span.withConfig({shouldForwardProp:e=>!["size","gradient"].includes(e)})`
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 700;
  font-size: ${e=>{switch(e.size){case"small":return"1.25rem";case"large":return"2rem";default:return"1.5rem"}}};
  
  ${e=>e.gradient?s.AH`
    background: ${(0,l.p8)("45deg",l.kk.gradients.aurora.start,l.kk.gradients.aurora.middle,l.kk.gradients.aurora.end)};
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${B} 4s ease-in-out infinite;
  `:s.AH`
    color: ${l.kk.neural.electric};
  `}
`,Y=s.Ay.circle`
  animation: ${s.AH`${M}`} 2s ease-in-out infinite;
  animation-delay: ${e=>e.delay}s;
  transition: all 0.3s ease;
`,G=s.Ay.path`
  stroke: ${l.kk.plasma.cyan};
  stroke-width: 2;
  stroke-dasharray: 20, 10;
  stroke-dashoffset: 0;
  fill: none;
  opacity: 0.6;
  
  animation: ${s.AH`${W}`} 3s linear infinite;
  animation-delay: ${e=>e.delay}s;
`,V=e=>{let{size:t="medium",showText:r=!0,animated:a=!0,gradient:i=!0,className:n}=e;const[s,d]=(0,o.useState)(!1);(0,o.useEffect)(()=>{const e=setTimeout(()=>d(!0),100);return()=>clearTimeout(e)},[]);const c=(0,z.jsxs)("svg",{viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{opacity:s?1:0,transition:"opacity 0.5s ease"},children:[(0,z.jsxs)("defs",{children:[(0,z.jsxs)("radialGradient",{id:"neuralGradient",cx:"50%",cy:"50%",r:"50%",children:[(0,z.jsx)("stop",{offset:"0%",stopColor:l.kk.plasma.violet,stopOpacity:"0.8"}),(0,z.jsx)("stop",{offset:"50%",stopColor:l.kk.plasma.cyan,stopOpacity:"0.4"}),(0,z.jsx)("stop",{offset:"100%",stopColor:l.kk.neural.electric,stopOpacity:"0.1"})]}),(0,z.jsxs)("linearGradient",{id:"nodeGradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[(0,z.jsx)("stop",{offset:"0%",stopColor:l.kk.plasma.violet}),(0,z.jsx)("stop",{offset:"50%",stopColor:l.kk.plasma.cyan}),(0,z.jsx)("stop",{offset:"100%",stopColor:l.kk.plasma.emerald})]})]}),(0,z.jsx)("circle",{cx:"24",cy:"24",r:"22",fill:"url(#neuralGradient)",stroke:l.kk.glass.border.replace("rgba(255, 255, 255, 0.1)",l.kk.plasma.cyan),strokeWidth:"1",opacity:"0.3"}),a&&(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(G,{d:"M8 16 L24 24 L40 16",delay:0}),(0,z.jsx)(G,{d:"M8 32 L24 24 L40 32",delay:.5}),(0,z.jsx)(G,{d:"M16 8 L24 24 L32 8",delay:1}),(0,z.jsx)(G,{d:"M16 40 L24 24 L32 40",delay:1.5})]}),(0,z.jsx)(Y,{cx:"24",cy:"24",r:"4",fill:"url(#nodeGradient)",delay:0}),(0,z.jsx)(Y,{cx:"8",cy:"16",r:"2",fill:l.kk.plasma.violet,delay:.2}),(0,z.jsx)(Y,{cx:"40",cy:"16",r:"2",fill:l.kk.plasma.cyan,delay:.4}),(0,z.jsx)(Y,{cx:"8",cy:"32",r:"2",fill:l.kk.plasma.emerald,delay:.6}),(0,z.jsx)(Y,{cx:"40",cy:"32",r:"2",fill:l.kk.plasma.gold,delay:.8}),(0,z.jsx)(Y,{cx:"16",cy:"8",r:"1.5",fill:l.kk.plasma.magenta,delay:1}),(0,z.jsx)(Y,{cx:"32",cy:"8",r:"1.5",fill:l.kk.plasma.crimson,delay:1.2}),(0,z.jsx)(Y,{cx:"16",cy:"40",r:"1.5",fill:l.kk.plasma.violet,delay:1.4}),(0,z.jsx)(Y,{cx:"32",cy:"40",r:"1.5",fill:l.kk.plasma.cyan,delay:1.6}),(0,z.jsx)("path",{d:"M20 32 L24 20 L28 32 M21.5 28 L26.5 28",stroke:l.kk.quantum.deep,strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})]});return(0,z.jsxs)(q,{size:t,animated:a,className:n,children:[c,r&&(0,z.jsx)(K,{size:t,gradient:i,children:"Axiom Loom"})]})};var J=r(3202);const X=s.i7`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,Q=s.i7`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
`,Z=s.Ay.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(
    180deg, 
    rgba(10, 10, 27, 0.95) 0%,
    rgba(20, 20, 41, 0.85) 100%
  );
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 4px 30px rgba(139, 92, 246, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.5);
  animation: ${s.AH`${X}`} 0.5s ease-out;
`,ee=s.Ay.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  height: 80px;
`,te=(0,s.Ay)(i.N_)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`,re=s.Ay.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`,oe=(0,s.Ay)(i.N_)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: ${e=>e.isActive?l.kk.plasma.cyan:l.kk.neural.light};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 12px;
  background: ${e=>e.isActive?`linear-gradient(135deg, ${l.kk.plasma.violet}20, ${l.kk.plasma.cyan}20)`:"transparent"};
  border: 1px solid ${e=>e.isActive?`${l.kk.plasma.cyan}40`:"transparent"};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      ${l.kk.plasma.violet}20,
      ${l.kk.plasma.cyan}20
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    color: ${l.kk.plasma.cyan};
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(10deg) scale(1.1);
  }
`,ae=(0,s.Ay)(J.JH)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1),
    rgba(6, 182, 212, 0.1)
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  
  &:hover {
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.2),
      rgba(6, 182, 212, 0.2)
    );
    border-color: ${l.kk.plasma.cyan};
    box-shadow: 
      0 0 20px rgba(139, 92, 246, 0.4),
      0 0 40px rgba(6, 182, 212, 0.2);
  }
`,ie=s.Ay.kbd`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2),
    rgba(6, 182, 212, 0.1)
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  color: ${l.kk.neural.bright};
`,ne=s.Ay.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: ${l.kk.plasma.emerald};
  border-radius: 50%;
  box-shadow: 0 0 10px ${l.kk.plasma.emerald};
  animation: ${s.AH`${Q}`} 2s infinite;
`,se=()=>{const[e,t]=(0,o.useState)(!1),r=(0,n.zy)();(0,o.useEffect)(()=>{const e=e=>{(e.metaKey||e.ctrlKey)&&"k"===e.key&&(e.preventDefault(),t(!0))};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[]);const a=e=>"/"===e&&"/"===r.pathname||!("/"===e||!r.pathname.startsWith(e));return(0,z.jsxs)(Z,{children:[(0,z.jsxs)(ee,{children:[(0,z.jsx)(te,{to:"/",children:(0,z.jsx)(V,{size:"medium",showText:!0,gradient:!0})}),(0,z.jsxs)(re,{children:[(0,z.jsxs)(oe,{to:"/",isActive:a("/"),children:[(0,z.jsx)(m.A,{size:18}),"Home"]}),(0,z.jsxs)(oe,{to:"/repositories",isActive:a("/repositories"),children:[(0,z.jsx)(h.A,{size:18}),"Repositories"]}),(0,z.jsxs)(oe,{to:"/apis",isActive:a("/apis"),children:[(0,z.jsx)(u.A,{size:18}),"APIs"]}),(0,z.jsxs)(oe,{to:"/docs",isActive:a("/docs"),children:[(0,z.jsx)(g.A,{size:18}),"Docs"]}),(0,z.jsxs)(oe,{to:"/sync",isActive:a("/sync"),children:[(0,z.jsx)(y.A,{size:18}),"Sync","/sync"===r.pathname&&(0,z.jsx)(ne,{})]}),(0,z.jsxs)(ae,{onClick:()=>t(!0),size:"sm",children:[(0,z.jsx)(x.A,{size:16}),"Search",(0,z.jsx)(ie,{children:"\u2318K"})]})]})]}),(0,z.jsx)(D,{isOpen:e,onClose:()=>t(!1)})]})};var le=r(79204);const de=e=>{var t;let{onSyncComplete:r,className:a=""}=e;const[i,n]=(0,o.useState)({isInProgress:!1,totalRepositories:0,completedRepositories:0,errors:[]}),[s,l]=(0,o.useState)(le.t.getLastSyncInfo()),[d,c]=(0,o.useState)(!1);(0,o.useEffect)(()=>{let e=null;return i.isInProgress&&(e=setInterval(()=>{le.t.getSyncStatus().then(e=>n(e))},1e3)),()=>{e&&clearInterval(e)}},[i.isInProgress]);return(0,z.jsx)("div",{className:`bg-white border border-gray-200 rounded-lg shadow-sm ${a}`,children:(0,z.jsxs)("div",{className:"p-4",children:[(0,z.jsxs)("div",{className:"flex items-center justify-between",children:[(0,z.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,z.jsx)("div",{className:"w-3 h-3 rounded-full "+(i.isInProgress?"bg-blue-500 animate-pulse":i.errors.length>0?"bg-yellow-500":"bg-green-500")}),(0,z.jsx)("h3",{className:"text-sm font-medium text-gray-900",children:i.isInProgress?"Syncing Repositories":"Repository Sync"})]}),(0,z.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,z.jsxs)("span",{className:"text-xs text-gray-500",children:["Last sync: ",(e=>{if(!e)return"Never";const t=(new Date).getTime()-new Date(e).getTime(),r=Math.floor(t/6e4),o=Math.floor(r/60),a=Math.floor(o/24);return a>0?`${a} day${a>1?"s":""} ago`:o>0?`${o} hour${o>1?"s":""} ago`:r>0?`${r} minute${r>1?"s":""} ago`:"Just now"})(s.timestamp||i.lastSyncTime)]}),(0,z.jsx)("button",{onClick:()=>c(!d),className:"p-1 rounded hover:bg-gray-100 transition-colors","aria-label":d?"Collapse":"Expand",children:(0,z.jsx)("svg",{className:"w-4 h-4 text-gray-500 transform transition-transform "+(d?"rotate-180":""),fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,z.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})})]})]}),i.isInProgress&&(0,z.jsxs)("div",{className:"mt-3",children:[(0,z.jsxs)("div",{className:"flex items-center justify-between text-xs text-gray-600 mb-1",children:[(0,z.jsxs)("span",{children:["Syncing: ",i.currentRepository||"Initializing..."]}),(0,z.jsxs)("span",{children:[i.completedRepositories," of ",i.totalRepositories]})]}),(0,z.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,z.jsx)("div",{className:"bg-blue-500 h-2 rounded-full transition-all duration-300",style:{width:`${i.isInProgress&&0!==i.totalRepositories?Math.round(i.completedRepositories/i.totalRepositories*100):0}%`}})})]}),d&&(0,z.jsxs)("div",{className:"mt-4 space-y-3",children:[!i.isInProgress&&(0,z.jsx)("button",{onClick:async()=>{n({...i,isInProgress:!0});try{const e=await le.t.syncOnStartup();le.t.saveLastSyncInfo(e),l({timestamp:e.timestamp,result:e}),r&&r(e)}catch(e){}finally{le.t.getSyncStatus().then(e=>n(e))}},className:"w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium",children:"Sync All Repositories"}),(null===(t=s.result)||void 0===t?void 0:t.syncedRepositories)&&s.result.syncedRepositories.length>0&&(0,z.jsxs)("div",{children:[(0,z.jsxs)("h4",{className:"text-xs font-medium text-gray-700 mb-2",children:["Synced Repositories (",s.result.syncedRepositories.length,")"]}),(0,z.jsx)("div",{className:"max-h-32 overflow-y-auto",children:(0,z.jsx)("ul",{className:"text-xs text-gray-600 space-y-1",children:s.result.syncedRepositories.map((e,t)=>(0,z.jsxs)("li",{className:"flex items-center space-x-2",children:[(0,z.jsx)("svg",{className:"w-3 h-3 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:(0,z.jsx)("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})}),(0,z.jsx)("span",{children:e})]},t))})})]}),i.errors.length>0&&(0,z.jsxs)("div",{children:[(0,z.jsxs)("h4",{className:"text-xs font-medium text-red-700 mb-2",children:["Sync Errors (",i.errors.length,")"]}),(0,z.jsx)("div",{className:"max-h-32 overflow-y-auto",children:(0,z.jsx)("ul",{className:"text-xs text-red-600 space-y-1",children:i.errors.map((e,t)=>(0,z.jsxs)("li",{className:"flex items-start space-x-2",children:[(0,z.jsx)("svg",{className:"w-3 h-3 text-red-500 mt-0.5 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20",children:(0,z.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),(0,z.jsx)("span",{className:"break-all",children:e})]},t))})})]})]})]})})};var ce=r(67375),pe=r(66382);const me=()=>{const[e,t]=(0,o.useState)(!1),r=(0,o.useCallback)(()=>{t(!0)},[]),a=(0,o.useCallback)(()=>{t(!1)},[]),i=(0,o.useCallback)(()=>{t(e=>!e)},[]);return(0,o.useEffect)(()=>{const e=e=>{(e.metaKey||e.ctrlKey)&&"k"===e.key&&(e.preventDefault(),e.stopPropagation(),i())};return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}},[i]),{isSearchOpen:e,openSearch:r,closeSearch:a,toggleSearch:i}};var he=r(50122);const ue=s.i7`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,ge=s.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`,ye=s.Ay.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${s.AH`${ue}`} 1s linear infinite;
`,xe=s.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`,fe=s.Ay.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  max-width: 500px;
  
  h2 {
    color: #dc3545;
    margin: 0 0 16px 0;
  }
  
  p {
    color: #6c757d;
    margin: 0 0 24px 0;
    font-size: 16px;
  }
`,be=s.Ay.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #0066cc;
  color: white;
  
  &:hover {
    background: #0052a3;
  }
`,ve=e=>{let{children:t,requiredRole:r,requiredPermission:o}=e;const{isAuthenticated:a,isLoading:i,user:s,hasRole:l,hasPermission:d}=(0,pe.A)(),c=(0,n.zy)();if(!("true"==={NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001",REACT_APP_API_PORT:"3001",REACT_APP_BYPASS_AUTH:"true"}.REACT_APP_SKIP_AUTH||!1)){if(i)return(0,z.jsx)(ge,{children:(0,z.jsx)(ye,{})});if(!a)return(0,z.jsx)(n.C5,{to:"/login",state:{from:c},replace:!0})}return r&&!l(r)?(0,z.jsx)(xe,{children:(0,z.jsxs)(fe,{children:[(0,z.jsx)("h2",{children:"Access Denied"}),(0,z.jsxs)("p",{children:["You don't have the required role to access this page. This page requires ",r," access."]}),(0,z.jsx)(be,{onClick:()=>window.history.back(),children:"Go Back"})]})}):o&&!d(o)?(0,z.jsx)(xe,{children:(0,z.jsxs)(fe,{children:[(0,z.jsx)("h2",{children:"Insufficient Permissions"}),(0,z.jsx)("p",{children:"You don't have the required permissions to access this resource. Please contact your administrator if you believe this is an error."}),(0,z.jsx)(be,{onClick:()=>window.history.back(),children:"Go Back"})]})}):(0,z.jsx)(z.Fragment,{children:t})},$e=s.i7`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`,ke=(s.i7`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`,s.i7`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`),we=s.i7`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`,Ae=s.i7`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`,Se=s.Ay.div`
  animation: ${e=>{if(!e.isTransitioning)return"none";switch(e.transitionType){case"slide":return s.AH`${"backward"===e.direction?we:ke}`;case"scale":return s.AH`${Ae}`;default:return s.AH`${$e}`}}} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut} forwards;
  
  opacity: ${e=>e.isTransitioning?0:1};
  will-change: transform, opacity;
`,je=e=>{let{children:t,transitionType:r="fade",duration:a=250}=e;const i=(0,n.zy)(),[s,l]=(0,o.useState)(!0),[d,c]=(0,o.useState)(i.pathname),[p,m]=(0,o.useState)("forward");return(0,o.useEffect)(()=>{const e=i.pathname.split("/").filter(Boolean).length,t=d.split("/").filter(Boolean).length;m(e>=t?"forward":"backward"),l(!0);const r=setTimeout(()=>{l(!1),c(i.pathname)},a);return()=>clearTimeout(r)},[i.pathname,a,d]),(0,z.jsx)(Se,{isTransitioning:s,transitionType:r,direction:p,children:t})};var ze=r(8707),Ee=r(19340),Ce=r(64830),Te=r(81199),Re=r(94574),Fe=r(21617),Pe=r(13689);const _e=s.i7`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,He=s.i7`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${e=>e.theme.colors.primary.yellow}40;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px ${e=>e.theme.colors.primary.yellow}00;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${e=>e.theme.colors.primary.yellow}00;
  }
`,Ie=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.isFullscreen?Fe.w.colors.primary.black:"transparent"};
  z-index: ${e=>e.theme.zIndex.modal};
  pointer-events: ${e=>e.isActive?"all":"none"};
  opacity: ${e=>e.isActive?1:0};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,Ne=s.Ay.div`
  position: fixed;
  bottom: ${e=>e.theme.spacing[6]};
  left: 50%;
  transform: translateX(-50%) ${e=>e.isVisible?"translateY(0)":"translateY(120%)"};
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[4]};
  box-shadow: ${e=>e.theme.shadows.xl};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  z-index: ${e=>e.theme.zIndex.modal+1};
  animation: ${s.AH`${_e}`} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  backdrop-filter: blur(0px);
`,Oe=s.Ay.div`
  width: 200px;
  height: 6px;
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.full};
  overflow: hidden;
  margin: 0 ${e=>e.theme.spacing[3]};
`,Le=s.Ay.div`
  width: ${e=>e.progress}%;
  height: 100%;
  background: linear-gradient(90deg, ${e=>e.theme.colors.primary.yellow}, ${e=>e.theme.colors.accent.blue});
  border-radius: ${e=>e.theme.borderRadius.full};
  transition: width ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};
`,De=s.Ay.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
  min-width: 120px;
`,Ue=s.Ay.div`
  position: fixed;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  border-radius: ${e=>e.theme.borderRadius.lg};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  max-width: 300px;
  box-shadow: ${e=>e.theme.shadows.lg};
  z-index: ${e=>e.theme.zIndex.tooltip};
  opacity: ${e=>e.isVisible?1:0};
  transform: ${e=>e.isVisible?"scale(1)":"scale(0.8)"};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${e=>e.theme.colors.primary.yellow};
  }
`,Be=s.Ay.div`
  position: fixed;
  left: ${e=>e.x-e.size/2}px;
  top: ${e=>e.y-e.size/2}px;
  width: ${e=>e.size}px;
  height: ${e=>e.size}px;
  border: 3px solid ${e=>e.theme.colors.primary.yellow};
  border-radius: ${e=>e.theme.borderRadius.full};
  pointer-events: none;
  z-index: ${e=>e.theme.zIndex.modal};
  opacity: ${e=>e.isVisible?1:0};
  animation: ${s.AH`${He}`} 2s infinite;
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,Me=[{id:"home",route:"/",title:"Welcome to Axiom Loom Catalog",description:"Your central hub for repositories, APIs, and documentation",duration:3e3},{id:"stats",route:"/",title:"Innovation Dashboard",description:"Real-time statistics showing our development ecosystem",element:'[data-testid="statistics-dashboard"]',duration:4e3},{id:"repositories",route:"/",title:"Repository Overview",description:"Browse through our collection of repositories with enhanced cards",element:'[data-testid="repository-card"]:first-child',duration:3e3},{id:"repository-detail",route:"/repository/sample-repo",title:"Repository Details",description:"Explore comprehensive repository information and APIs",duration:4e3},{id:"api-explorer",route:"/api-explorer/sample-repo",title:"API Explorer",description:"Interactive API testing and documentation",duration:4e3},{id:"documentation",route:"/docs/sample-repo",title:"Documentation Viewer",description:"Rich markdown documentation with interactive navigation",duration:3e3}],We=e=>{let{isActive:t,onToggle:r}=e;const a=(0,n.Zp)(),i=(0,n.zy)(),[s,l]=(0,o.useState)(0),[d,c]=(0,o.useState)(!1),[p,m]=(0,o.useState)(0),[h,u]=(0,o.useState)({x:0,y:0}),[g,y]=(0,o.useState)({x:0,y:0,size:100}),[x,b]=(0,o.useState)(!1),v=Me[s],$=(0,o.useCallback)(e=>{const t=document.querySelector(e);if(t){const e=t.getBoundingClientRect(),r=e.left+e.width/2,o=e.top+e.height/2;y({x:r,y:o,size:Math.max(e.width,e.height)+40}),u({x:r-150,y:e.top-80}),t.scrollIntoView({behavior:"smooth",block:"center"})}},[]),k=(0,o.useCallback)(e=>{if(e>=0&&e<Me.length){const t=Me[e];l(e),m(0),t.route!==i.pathname&&a(t.route),setTimeout(()=>{t.element&&$(t.element),t.action&&t.action()},500)}},[a,i.pathname,$]),w=(0,o.useCallback)(()=>{s<Me.length-1?k(s+1):(c(!1),k(0))},[s,k]),A=(0,o.useCallback)(()=>{s>0&&k(s-1)},[s,k]),S=()=>{c(!d)},j=()=>{c(!1),r(),a("/")},E=()=>{var e,t,r,o;(b(!x),x)?null===(e=(t=document).exitFullscreen)||void 0===e||e.call(t):null===(r=(o=document.documentElement).requestFullscreen)||void 0===r||r.call(o)};return(0,o.useEffect)(()=>{if(!t||!d)return;const e=setInterval(()=>{m(e=>{const t=e+100/(v.duration/100);return t>=100?(w(),0):t})},100);return()=>clearInterval(e)},[t,d,v.duration,w]),(0,o.useEffect)(()=>{t&&k(0)},[t,k]),(0,o.useEffect)(()=>{if(!t)return;const e=e=>{switch(e.code){case"Space":e.preventDefault(),S();break;case"ArrowRight":e.preventDefault(),w();break;case"ArrowLeft":e.preventDefault(),A();break;case"Escape":j();break;case"KeyF":(e.ctrlKey||e.metaKey)&&(e.preventDefault(),E())}};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[t,w,A]),t?(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(Ie,{isActive:t,isFullscreen:x}),(0,z.jsx)(Be,{x:g.x,y:g.y,size:g.size,isVisible:t&&!!v.element}),(0,z.jsxs)(Ue,{x:h.x,y:h.y,isVisible:t,children:[(0,z.jsx)("div",{style:{fontWeight:Fe.w.typography.fontWeight.bold,marginBottom:Fe.w.spacing[2]},children:v.title}),(0,z.jsx)("div",{children:v.description})]}),(0,z.jsxs)(Ne,{isVisible:t,children:[(0,z.jsx)(Pe.$n,{size:"sm",onClick:A,disabled:0===s,children:(0,z.jsx)(ze.A,{size:16})}),(0,z.jsx)(Pe.$n,{size:"sm",onClick:S,children:d?(0,z.jsx)(Ee.A,{size:16}):(0,z.jsx)(Ce.A,{size:16})}),(0,z.jsx)(Pe.$n,{size:"sm",onClick:w,disabled:s===Me.length-1,children:(0,z.jsx)(Te.A,{size:16})}),(0,z.jsx)(Oe,{children:(0,z.jsx)(Le,{progress:p})}),(0,z.jsxs)(De,{children:["Step ",s+1," of ",Me.length]}),(0,z.jsx)(Pe.$n,{size:"sm",variant:"outline",onClick:E,children:(0,z.jsx)(Re.A,{size:16})}),(0,z.jsx)(Pe.$n,{size:"sm",variant:"outline",onClick:j,children:(0,z.jsx)(f.A,{size:16})})]})]}):null};var qe=r(20073),Ke=r(7365),Ye=r(6187),Ge=r(94473);const Ve=s.i7`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,Je=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.theme.colors.background.overlay};
  z-index: ${e=>e.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${e=>e.isVisible?1:0};
  visibility: ${e=>e.isVisible?"visible":"hidden"};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  backdrop-filter: blur(0px);
`,Xe=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[8]};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${e=>e.theme.shadows.xl};
  transform: ${e=>e.isVisible?"scale(1)":"scale(0.9)"};
  animation: ${e=>e.isVisible?s.AH`${Ve}`:"none"} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,Qe=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${e=>e.theme.spacing[6]};
  padding-bottom: ${e=>e.theme.spacing[4]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,Ze=s.Ay.h2`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  margin: 0;
  font-size: ${e=>e.theme.typography.fontSize.xl};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.text.primary};
`,et=s.Ay.button`
  background: none;
  border: none;
  padding: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.primary};
  }
`,tt=s.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,rt=s.Ay.h3`
  font-size: ${e=>e.theme.typography.fontSize.lg};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
`,ot=s.Ay.div`
  display: grid;
  gap: ${e=>e.theme.spacing[3]};
`,at=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.md};
  transition: background ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.tertiary};
  }
`,it=s.Ay.span`
  color: ${e=>e.theme.colors.text.primary};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
`,nt=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[1]};
`,st=s.Ay.kbd`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.medium};
  border-radius: ${e=>e.theme.borderRadius.sm};
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[2]};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.primary};
  box-shadow: inset 0 -2px 0 ${e=>e.theme.colors.border.medium};
  min-width: 24px;
  text-align: center;
`,lt=s.Ay.div`
  position: fixed;
  bottom: ${e=>e.theme.spacing[4]};
  right: ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.full};
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  box-shadow: ${e=>e.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.theme.colors.text.secondary};
  z-index: ${e=>e.theme.zIndex.fixed};
  opacity: ${e=>e.isActive?1:.7};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    box-shadow: ${e=>e.theme.shadows.lg};
    opacity: 1;
  }
`,dt=e=>{let{onDemoToggle:t}=e;const[r,a]=(0,o.useState)(!1),[i,s]=(0,o.useState)(new Set),l=(0,n.Zp)(),{openSearch:d}=me(),c=[{keys:["g","h"],description:"Go to Home",action:()=>l("/"),section:"Navigation"},{keys:["g","s"],description:"Go to Sync Settings",action:()=>l("/sync"),section:"Navigation"},{keys:["g","p"],description:"Go to Profile",action:()=>l("/profile"),section:"Navigation"},{keys:["Cmd","k"],description:"Open Global Search",action:()=>d(),section:"Search"},{keys:["/"],description:"Focus Search",action:()=>d(),section:"Search"},{keys:["d"],description:"Toggle Demo Mode",action:()=>null===t||void 0===t?void 0:t(),section:"Demo"},{keys:["?"],description:"Show Keyboard Shortcuts",action:()=>a(!0),section:"Help"},{keys:["n"],description:"Add New Repository",action:()=>{const e=document.querySelector('[data-action="add-repository"]');null===e||void 0===e||e.click()},section:"Actions"}],p=(0,o.useCallback)(e=>{const t=e.key.toLowerCase(),r=e.metaKey||e.ctrlKey||e.altKey||e.shiftKey;if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)){if((e.metaKey||e.ctrlKey)&&"k"===t)return e.preventDefault(),void d();if("escape"!==t){if(!r){s(e=>new Set([...e,t]));const r=c.find(e=>1===e.keys.length&&e.keys[0].toLowerCase()===t);if(r)return e.preventDefault(),r.action(),void s(new Set);setTimeout(()=>{const r=Array.from(i);r.push(t);const o=r.join(" "),a=c.find(e=>e.keys.join(" ").toLowerCase()===o);a&&(e.preventDefault(),a.action()),s(new Set)},100)}}else a(!1)}},[i,c,d,t]),h=(0,o.useCallback)(()=>{setTimeout(()=>s(new Set),1e3)},[]);(0,o.useEffect)(()=>(document.addEventListener("keydown",p),document.addEventListener("keyup",h),()=>{document.removeEventListener("keydown",p),document.removeEventListener("keyup",h)}),[p,h]);const u=c.reduce((e,t)=>(e[t.section]||(e[t.section]=[]),e[t.section].push(t),e),{}),y=e=>({Navigation:(0,z.jsx)(m.A,{size:16}),Search:(0,z.jsx)(x.A,{size:16}),Demo:(0,z.jsx)(qe.A,{size:16}),Help:(0,z.jsx)(g.A,{size:16}),Actions:(0,z.jsx)(Ke.A,{size:16})}[e]||(0,z.jsx)(Ye.A,{size:16}));return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsxs)(lt,{isActive:i.size>0,children:[(0,z.jsx)(Ge.A,{size:16}),i.size>0?Array.from(i).join(" "):"Press ? for shortcuts"]}),(0,z.jsx)(Je,{isVisible:r,onClick:e=>e.target===e.currentTarget&&a(!1),children:(0,z.jsxs)(Xe,{isVisible:r,children:[(0,z.jsxs)(Qe,{children:[(0,z.jsxs)(Ze,{children:[(0,z.jsx)(Ge.A,{size:24}),"Keyboard Shortcuts"]}),(0,z.jsx)(et,{onClick:()=>a(!1),children:(0,z.jsx)(f.A,{size:20})})]}),Object.entries(u).map(e=>{let[t,r]=e;return(0,z.jsxs)(tt,{children:[(0,z.jsxs)(rt,{children:[y(t),t]}),(0,z.jsx)(ot,{children:r.map((e,t)=>(0,z.jsxs)(at,{children:[(0,z.jsx)(it,{children:e.description}),(0,z.jsx)(nt,{children:e.keys.map((e,t)=>(0,z.jsx)(st,{children:"Cmd"===e?"\u2318":"Ctrl"===e?"Ctrl":e.toUpperCase()},t))})]},t))})]},t)}),(0,z.jsxs)("div",{style:{marginTop:Fe.w.spacing[6],padding:Fe.w.spacing[4],background:Fe.w.colors.background.secondary,borderRadius:Fe.w.borderRadius.md,fontSize:Fe.w.typography.fontSize.sm,color:Fe.w.colors.text.secondary},children:[(0,z.jsx)("strong",{children:"Pro Tips:"}),(0,z.jsxs)("ul",{style:{margin:`${e=>e.theme.spacing[2]} 0`,paddingLeft:Fe.w.spacing[4]},children:[(0,z.jsx)("li",{children:"Use sequence shortcuts like \"g h\" (press 'g' then 'h' quickly)"}),(0,z.jsx)("li",{children:"Shortcuts are disabled when typing in input fields"}),(0,z.jsx)("li",{children:"Press Escape to close any modal or overlay"})]})]})]})})]})};var ct=r(70764),pt=r(73002),mt=r(85692);const ht=s.i7`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,ut=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.theme.colors.background.overlay};
  z-index: ${e=>e.theme.zIndex.modal};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  opacity: ${e=>e.isOpen?1:0};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  backdrop-filter: blur(0px);
`,gt=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  box-shadow: ${e=>e.theme.shadows.xl};
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  overflow: hidden;
  transform: ${e=>e.isOpen?"scale(1)":"scale(0.9)"};
  animation: ${e=>e.isOpen?s.AH`${ht}`:"none"} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,yt=s.Ay.div`
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  background: linear-gradient(135deg, ${e=>e.theme.colors.background.primary} 0%, ${e=>e.theme.colors.background.secondary} 100%);
`,xt=s.Ay.div`
  position: relative;
  display: flex;
  align-items: center;
`,ft=s.Ay.input`
  width: 100%;
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[12]};
  border: none;
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.lg};
  font-size: ${e=>e.theme.typography.fontSize.lg};
  color: ${e=>e.theme.colors.text.primary};
  outline: none;
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:focus {
    background: ${e=>e.theme.colors.background.primary};
    box-shadow: 0 0 0 2px ${e=>e.theme.colors.primary.yellow};
  }

  &::placeholder {
    color: ${e=>e.theme.colors.text.secondary};
  }
`,bt=s.Ay.div`
  position: absolute;
  left: ${e=>e.theme.spacing[4]};
  color: ${e=>e.theme.colors.text.secondary};
  pointer-events: none;
`,vt=s.Ay.button`
  position: absolute;
  right: ${e=>e.theme.spacing[4]};
  background: none;
  border: none;
  color: ${e=>e.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.primary};
  }
`,$t=s.Ay.div`
  max-height: 50vh;
  overflow-y: auto;
`,kt=s.Ay.div`
  padding: ${e=>e.theme.spacing[2]} 0;
`,wt=s.Ay.div`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[6]};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${e=>e.theme.colors.background.secondary};
`,At=s.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  cursor: pointer;
  background: ${e=>e.isHighlighted?Fe.w.colors.background.secondary:"transparent"};
  border-left: 3px solid ${e=>e.isHighlighted?Fe.w.colors.primary.yellow:"transparent"};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.secondary};
    border-left-color: ${e=>e.theme.colors.primary.yellow};
  }
`,St=s.Ay.div`
  width: 32px;
  height: 32px;
  border-radius: ${e=>e.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e=>{const t={repository:`${e=>e.theme.colors.primary.yellow}20`,api:`${e=>e.theme.colors.accent.blue}20`,document:`${e=>e.theme.colors.semantic.info}20`,recent:`${e=>e.theme.colors.text.secondary}20`};return t[e.type]||t.repository}};

  svg {
    color: ${e=>{const t={repository:Fe.w.colors.primary.yellow,api:Fe.w.colors.accent.blue,document:Fe.w.colors.semantic.info,recent:Fe.w.colors.text.secondary};return t[e.type]||t.repository}};
  }
`,jt=s.Ay.div`
  flex: 1;
  min-width: 0;
`,zt=s.Ay.div`
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,Et=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,Ct=s.Ay.div`
  color: ${e=>e.theme.colors.text.secondary};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[1]};
`,Tt=s.Ay.div`
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  background: ${e=>e.theme.colors.background.secondary};
`,Rt=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  flex-wrap: wrap;
`,Ft=s.Ay.button`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,Pt=s.Ay.div`
  padding: ${e=>e.theme.spacing[8]} ${e=>e.theme.spacing[6]};
  text-align: center;
  color: ${e=>e.theme.colors.text.secondary};
`,_t=e=>{let{isOpen:t,onClose:r}=e;const[a,i]=(0,o.useState)(""),[s,l]=(0,o.useState)([]),[d,c]=(0,o.useState)(0),[p,m]=(0,o.useState)([]),[h,u]=(0,o.useState)(!1),g=(0,o.useRef)(null),y=(0,n.Zp)(),b=[{id:"1",type:"repository",title:"AI Transformation Hub",description:"Central repository for AI transformation tools and APIs",url:"/repository/ai-transformation-hub"},{id:"2",type:"api",title:"User Authentication API",description:"RESTful API for user authentication and authorization",url:"/api-explorer/auth-service"},{id:"3",type:"document",title:"API Integration Guide",description:"Complete guide for integrating with Axiom Loom APIs",url:"/docs/integration-guide"}];(0,o.useEffect)(()=>{if(!a.trim())return void l([]);u(!0);const e=setTimeout(()=>{const e=b.filter(e=>e.title.toLowerCase().includes(a.toLowerCase())||e.description.toLowerCase().includes(a.toLowerCase()));l(e),u(!1),c(0)},300);return()=>clearTimeout(e)},[a]),(0,o.useEffect)(()=>{const e=localStorage.getItem("recentSearches");e&&m(JSON.parse(e))},[]),(0,o.useEffect)(()=>{t&&g.current&&g.current.focus()},[t]);const v=e=>{const t=[a,...p.filter(e=>e!==a)].slice(0,5);m(t),localStorage.setItem("recentSearches",JSON.stringify(t)),y(e.url),r()},$=[{label:"Browse All Repositories",action:()=>y("/")},{label:"API Explorer",action:()=>y("/api-explorer/all")},{label:"Documentation",action:()=>y("/docs")},{label:"Add Repository",action:()=>y("/sync")}];return t?(0,z.jsx)(ut,{isOpen:t,onClick:e=>e.target===e.currentTarget&&r(),children:(0,z.jsxs)(gt,{isOpen:t,children:[(0,z.jsx)(yt,{children:(0,z.jsxs)(xt,{children:[(0,z.jsx)(bt,{children:(0,z.jsx)(x.A,{size:20})}),(0,z.jsx)(ft,{ref:g,type:"text",placeholder:"Search repositories, APIs, documentation...",value:a,onChange:e=>i(e.target.value),onKeyDown:e=>{"Escape"===e.key?r():"ArrowDown"===e.key?(e.preventDefault(),c(e=>Math.min(e+1,s.length-1))):"ArrowUp"===e.key?(e.preventDefault(),c(e=>Math.max(e-1,0))):"Enter"===e.key&&(e.preventDefault(),s[d]&&v(s[d]))}}),(0,z.jsx)(vt,{onClick:r,children:(0,z.jsx)(f.A,{size:20})})]})}),(0,z.jsxs)($t,{children:[a.trim()&&(0,z.jsx)(z.Fragment,{children:s.length>0?(0,z.jsxs)(kt,{children:[(0,z.jsx)(wt,{children:"Search Results"}),s.map((e,t)=>{return(0,z.jsxs)(At,{isHighlighted:t===d,onClick:()=>v(e),children:[(0,z.jsx)(St,{type:e.type,children:(r=e.type,{repository:(0,z.jsx)(ct.A,{size:16}),api:(0,z.jsx)(qe.A,{size:16}),document:(0,z.jsx)(pt.A,{size:16}),recent:(0,z.jsx)(A.A,{size:16})}[r]||(0,z.jsx)(ct.A,{size:16}))}),(0,z.jsxs)(jt,{children:[(0,z.jsx)(zt,{children:e.title}),(0,z.jsx)(Et,{children:e.description})]}),(0,z.jsx)(Ct,{children:(0,z.jsx)(mt.A,{size:14})})]},e.id);var r})]}):h?null:(0,z.jsxs)(Pt,{children:['No results found for "',a,'"',(0,z.jsx)("br",{}),(0,z.jsx)("small",{children:"Try different keywords or browse our quick actions below"})]})}),!a.trim()&&p.length>0&&(0,z.jsxs)(kt,{children:[(0,z.jsx)(wt,{children:"Recent Searches"}),p.map((e,t)=>(0,z.jsxs)(At,{isHighlighted:!1,onClick:()=>i(e),children:[(0,z.jsx)(St,{type:"recent",children:(0,z.jsx)(A.A,{size:16})}),(0,z.jsx)(jt,{children:(0,z.jsx)(zt,{children:e})})]},t))]})]}),(0,z.jsxs)(Tt,{children:[(0,z.jsx)(wt,{style:{padding:`0 0 ${e=>e.theme.spacing[3]} 0`,background:"transparent"},children:"Quick Actions"}),(0,z.jsx)(Rt,{children:$.map((e,t)=>(0,z.jsx)(Ft,{onClick:()=>{e.action(),r()},children:e.label},t))})]})]})}):null};var Ht=r(51861),It=r(75969);const Nt=s.i7`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`,Ot=s.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.background)||void 0===r?void 0:r.primary)||"#0A0A1B"}};
  padding: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[8])||"2rem"}};
`,Lt=s.Ay.div`
  background: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.background)||void 0===r?void 0:r.primary)||"#0A0A1B"}};
  border: 1px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.border)||void 0===r?void 0:r.light)||"rgba(139, 92, 246, 0.2)"}};
  border-radius: ${e=>{var t;return(null===(t=e.theme.borderRadius)||void 0===t?void 0:t.xl)||"1rem"}};
  padding: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[12])||"3rem"}};
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: ${e=>{var t;return(null===(t=e.theme.shadows)||void 0===t?void 0:t.xl)||"0 20px 25px -5px rgba(0, 0, 0, 0.1)"}};
  animation: ${s.AH`${Nt}`} 0.5s ease-in-out;
`,Dt=s.Ay.div`
  width: 100px;
  height: 100px;
  margin: 0 auto ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[6])||"1.5rem"}};
  background: linear-gradient(135deg, 
    ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.semantic)||void 0===r?void 0:r.error)||"#ef4444"}}20 0%, 
    ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.semantic)||void 0===r?void 0:r.error)||"#ef4444"}}10 100%
  );
  border-radius: ${e=>{var t;return(null===(t=e.theme.borderRadius)||void 0===t?void 0:t["2xl"])||"1.5rem"}};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.semantic)||void 0===r?void 0:r.error)||"#ef4444"}}30;

  svg {
    color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.semantic)||void 0===r?void 0:r.error)||"#ef4444"}};
  }
`,Ut=s.Ay.h1`
  font-family: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontFamily)||void 0===r?void 0:r.primary)||"Inter, sans-serif"}};
  font-size: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontSize)||void 0===r?void 0:r["4xl"])||"2.25rem"}};
  font-weight: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontWeight)||void 0===r?void 0:r.bold)||"700"}};
  color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.text)||void 0===r?void 0:r.primary)||"#ffffff"}};
  margin-bottom: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[4])||"1rem"}};
  
  span {
    background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`,Bt=s.Ay.p`
  font-family: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontFamily)||void 0===r?void 0:r.primary)||"Inter, sans-serif"}};
  font-size: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontSize)||void 0===r?void 0:r.lg)||"1.125rem"}};
  color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.text)||void 0===r?void 0:r.secondary)||"#94A3B8"}};
  margin-bottom: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[8])||"2rem"}};
  line-height: 1.6;
`,Mt=(s.Ay.div`
  background: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.background)||void 0===r?void 0:r.secondary)||"#141429"}};
  border: 1px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.border)||void 0===r?void 0:r.light)||"rgba(139, 92, 246, 0.2)"}};
  border-radius: ${e=>{var t;return(null===(t=e.theme.borderRadius)||void 0===t?void 0:t.lg)||"0.75rem"}};
  padding: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[6])||"1.5rem"}};
  margin: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[8])||"2rem"}} 0;
  text-align: left;
`,s.Ay.pre`
  font-family: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontFamily)||void 0===r?void 0:r.mono)||"JetBrains Mono, monospace"}};
  font-size: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontSize)||void 0===r?void 0:r.sm)||"0.875rem"}};
  color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.text)||void 0===r?void 0:r.tertiary)||"#64748B"}};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.background)||void 0===r?void 0:r.tertiary)||"#1E293B"}};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.border)||void 0===r?void 0:r.medium)||"rgba(139, 92, 246, 0.4)"}};
    border-radius: 4px;
  }
`,s.Ay.div`
  display: flex;
  gap: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[4])||"1rem"}};
  justify-content: center;
  flex-wrap: wrap;
`),Wt=(0,s.Ay)(It.$)`
  display: inline-flex;
  align-items: center;
  gap: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[2])||"0.5rem"}};
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
  }
`,qt=s.Ay.div`
  margin-top: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[8])||"2rem"}};
  padding-top: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[8])||"2rem"}};
  border-top: 1px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.border)||void 0===r?void 0:r.light)||"rgba(139, 92, 246, 0.2)"}};
`,Kt=s.Ay.h3`
  font-family: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontFamily)||void 0===r?void 0:r.primary)||"Inter, sans-serif"}};
  font-size: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontSize)||void 0===r?void 0:r.lg)||"1.125rem"}};
  font-weight: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontWeight)||void 0===r?void 0:r.semibold)||"600"}};
  color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.text)||void 0===r?void 0:r.secondary)||"#94A3B8"}};
  margin-bottom: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[4])||"1rem"}};
`,Yt=s.Ay.ul`
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 0;
`,Gt=s.Ay.li`
  font-family: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontFamily)||void 0===r?void 0:r.primary)||"Inter, sans-serif"}};
  font-size: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontSize)||void 0===r?void 0:r.base)||"1rem"}};
  color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.text)||void 0===r?void 0:r.tertiary)||"#64748B"}};
  margin-bottom: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[2])||"0.5rem"}};
  padding-left: ${e=>{var t;return(null===(t=e.theme.spacing)||void 0===t?void 0:t[6])||"1.5rem"}};
  position: relative;
  
  &:before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.main)||"#8B5CF6"}};
  }
`;class Vt extends o.Component{constructor(e){super(e),this.handleReset=()=>{this.setState({hasError:!1,error:null,errorInfo:null})},this.handleReload=()=>{window.location.reload()},this.handleGoHome=()=>{window.location.href="/"},this.handleReportBug=()=>{var e,t,r;const o=encodeURIComponent("Bug Report: Application Error"),a=encodeURIComponent(`\nError: ${(null===(e=this.state.error)||void 0===e?void 0:e.toString())||"Unknown error"}\n\nStack Trace:\n${(null===(t=this.state.error)||void 0===t?void 0:t.stack)||"No stack trace available"}\n\nComponent Stack:\n${(null===(r=this.state.errorInfo)||void 0===r?void 0:r.componentStack)||"No component stack available"}\n\nUser Agent: ${navigator.userAgent}\nURL: ${window.location.href}\nTime: ${(new Date).toISOString()}\n    `);window.open(`mailto:support@axiomloom.ai?subject=${o}&body=${a}`)},this.state={hasError:!1,error:null,errorInfo:null,errorCount:0}}static getDerivedStateFromError(e){return{hasError:!0}}componentDidCatch(e,t){this.setState(r=>({error:e,errorInfo:t,errorCount:r.errorCount+1}))}render(){return this.state.hasError?(0,z.jsx)(Ot,{children:(0,z.jsxs)(Lt,{children:[(0,z.jsx)(Dt,{children:(0,z.jsx)(Ht.A,{size:48})}),(0,z.jsx)(Ut,{children:(0,z.jsx)("span",{children:"Quantum Disruption Detected"})}),(0,z.jsx)(Bt,{children:"The neural network encountered an unexpected quantum state. Our AI agents are analyzing the anomaly."}),!1,(0,z.jsxs)(Mt,{children:[(0,z.jsxs)(Wt,{variant:"primary",onClick:this.handleReset,children:[(0,z.jsx)(y.A,{}),"Try Again"]}),(0,z.jsxs)(Wt,{variant:"secondary",onClick:this.handleReload,children:[(0,z.jsx)(y.A,{}),"Reload Page"]}),(0,z.jsxs)(Wt,{variant:"secondary",onClick:this.handleGoHome,children:[(0,z.jsx)(m.A,{}),"Go Home"]}),!1]}),(0,z.jsxs)(qt,{children:[(0,z.jsx)(Kt,{children:"What can you do?"}),(0,z.jsxs)(Yt,{children:[(0,z.jsx)(Gt,{children:"Try refreshing the page"}),(0,z.jsx)(Gt,{children:"Clear your browser cache and cookies"}),(0,z.jsx)(Gt,{children:"Check your internet connection"}),(0,z.jsx)(Gt,{children:"Try again in a few moments"}),this.state.errorCount>2&&(0,z.jsx)(Gt,{children:"Contact support if the issue persists"})]})]})]})}):this.props.children}}const Jt=Vt,Xt=s.Ay.div.withConfig({shouldForwardProp:e=>!["zIndex","opacity","interactive"].includes(e)})`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${e=>e.zIndex};
  opacity: ${e=>e.opacity};
  pointer-events: ${e=>e.interactive?"auto":"none"};
  transition: opacity 0.5s ease;
`,Qt=s.Ay.canvas`
  width: 100%;
  height: 100%;
  display: block;
`,Zt=e=>{let{nodeCount:t=50,maxConnections:r=5,connectionDistance:a=150,animationSpeed:i=1,interactive:n=!0,zIndex:s=-10,opacity:d=.6,colorScheme:c="quantum"}=e;const p=(0,o.useRef)(null),m=(0,o.useRef)(null),h=(0,o.useRef)(),u=(0,o.useRef)([]),g=(0,o.useRef)({x:0,y:0,isActive:!1}),[y,x]=(0,o.useState)(!1),f={quantum:{nodes:[l.kk.quantum.glow,l.kk.quantum.bright,l.kk.quantum.light],connections:l.kk.plasma.violet,mouseGlow:l.kk.plasma.cyan},neural:{nodes:[l.kk.neural.electric,l.kk.neural.glow,l.kk.neural.bright],connections:l.kk.neural.light,mouseGlow:l.kk.neural.electric},plasma:{nodes:[l.kk.plasma.violet,l.kk.plasma.cyan,l.kk.plasma.emerald],connections:l.kk.plasma.magenta,mouseGlow:l.kk.plasma.gold}}[c],b=(0,o.useCallback)((e,o)=>{const n=[];for(let r=0;r<t;r++)n.push({x:Math.random()*e,y:Math.random()*o,vx:2*(Math.random()-.5)*i,vy:2*(Math.random()-.5)*i,size:4*Math.random()+2,color:f.nodes[Math.floor(Math.random()*f.nodes.length)],connections:[],energy:Math.random(),pulse:Math.random()*Math.PI*2});n.forEach((e,t)=>{const o=[],i=[];n.forEach((r,o)=>{if(t!==o){const t=e.x-r.x,a=e.y-r.y,n=Math.sqrt(t*t+a*a);i.push({index:o,distance:n})}}),i.sort((e,t)=>e.distance-t.distance);const s=Math.min(r,i.length);for(let r=0;r<s;r++)i[r].distance<=a&&o.push(i[r].index);e.connections=o}),u.current=n},[t,r,a,i,f]),v=(0,o.useCallback)((e,t,o)=>{const i=u.current,s=g.current;i.forEach((l,d)=>{if(l.x+=l.vx*o*.016,l.y+=l.vy*o*.016,(l.x<0||l.x>e)&&(l.vx*=-1,l.x=Math.max(0,Math.min(e,l.x))),(l.y<0||l.y>t)&&(l.vy*=-1,l.y=Math.max(0,Math.min(t,l.y))),n&&s.isActive){const e=s.x-l.x,t=s.y-l.y,r=Math.sqrt(e*e+t*t);if(r<100){const o=(100-r)/100;l.vx+=e/r*o*.5,l.vy+=t/r*o*.5,l.energy=Math.min(1,l.energy+.1*o)}}if(l.pulse+=.002*o,l.pulse>2*Math.PI&&(l.pulse=0),l.energy=Math.max(0,l.energy-5e-4*o),d%10===0){const e=[];i.forEach((t,o)=>{if(d!==o){const i=l.x-t.x,n=l.y-t.y;Math.sqrt(i*i+n*n)<=a&&e.length<r&&e.push(o)}}),l.connections=e}})},[n,a,r]),$=(0,o.useCallback)((e,t,r)=>{e.fillStyle=`${l.kk.quantum.deep}05`,e.fillRect(0,0,t,r);const o=u.current,i=g.current;if(o.forEach(t=>{t.connections.forEach(r=>{const i=o[r];if(i){const r=i.x-t.x,o=i.y-t.y,n=Math.sqrt(r*r+o*o),s=Math.max(0,1-n/a)*(.3+.35*(t.energy+i.energy));if(s>.05){const r=e.createLinearGradient(t.x,t.y,i.x,i.y);r.addColorStop(0,`${t.color}${Math.floor(255*s).toString(16).padStart(2,"0")}`),r.addColorStop(1,`${i.color}${Math.floor(255*s).toString(16).padStart(2,"0")}`),e.strokeStyle=r,e.lineWidth=1+2*t.energy,e.beginPath(),e.moveTo(t.x,t.y),e.lineTo(i.x,i.y),e.stroke()}}})}),o.forEach(t=>{const r=.5+.3*Math.sin(t.pulse)+.5*t.energy,o=t.size*(1+.5*t.energy),a=e.createRadialGradient(t.x,t.y,0,t.x,t.y,3*o);a.addColorStop(0,`${t.color}${Math.floor(100*r).toString(16).padStart(2,"0")}`),a.addColorStop(1,`${t.color}00`),e.fillStyle=a,e.beginPath(),e.arc(t.x,t.y,3*o,0,2*Math.PI),e.fill(),e.fillStyle=t.color,e.beginPath(),e.arc(t.x,t.y,o,0,2*Math.PI),e.fill(),t.energy>.3&&(e.strokeStyle=`${t.color}${Math.floor(255*t.energy).toString(16).padStart(2,"0")}`,e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,o*(2+.5*Math.sin(t.pulse)),0,2*Math.PI),e.stroke())}),n&&i.isActive){const t=e.createRadialGradient(i.x,i.y,0,i.x,i.y,120);t.addColorStop(0,`${f.mouseGlow}30`),t.addColorStop(1,`${f.mouseGlow}00`),e.fillStyle=t,e.beginPath(),e.arc(i.x,i.y,120,0,2*Math.PI),e.fill()}},[n,a,f]),k=(0,o.useCallback)(()=>{const e=p.current,t=null===e||void 0===e?void 0:e.getContext("2d");if(!e||!t)return;const r=e.width,o=e.height;performance.now();v(r,o,16.67),$(t,r,o),h.current=requestAnimationFrame(k)},[v,$]),w=(0,o.useCallback)(e=>{var t,r;if(!n||!m.current)return;const o=m.current.getBoundingClientRect();g.current.x=(e.clientX-o.left)*((null===(t=p.current)||void 0===t?void 0:t.width)||1)/o.width,g.current.y=(e.clientY-o.top)*((null===(r=p.current)||void 0===r?void 0:r.height)||1)/o.height},[n]),A=(0,o.useCallback)(()=>{n&&(g.current.isActive=!0)},[n]),S=(0,o.useCallback)(()=>{n&&(g.current.isActive=!1)},[n]),j=(0,o.useCallback)(()=>{const e=p.current;if(!e)return;const t=e.getBoundingClientRect(),r=window.devicePixelRatio||1;e.width=t.width*r,e.height=t.height*r;const o=e.getContext("2d");o&&(o.scale(r,r),e.style.width=t.width+"px",e.style.height=t.height+"px"),b(e.width/r,e.height/r)},[b]);return(0,o.useEffect)(()=>{if(!p.current)return;j(),x(!0),h.current=requestAnimationFrame(k);const e=m.current;return e&&n&&(e.addEventListener("mousemove",w),e.addEventListener("mouseenter",A),e.addEventListener("mouseleave",S)),window.addEventListener("resize",j),()=>{h.current&&cancelAnimationFrame(h.current),e&&n&&(e.removeEventListener("mousemove",w),e.removeEventListener("mouseenter",A),e.removeEventListener("mouseleave",S)),window.removeEventListener("resize",j)}},[k,j,w,A,S,n]),(0,z.jsx)(Xt,{ref:m,zIndex:s,opacity:y?d:0,interactive:n,children:(0,z.jsx)(Qt,{ref:p})})},er=s.i7`
  to { transform: rotate(360deg); }
`;"undefined"!==typeof window&&window.addEventListener("error",e=>{if(e.message.includes("button"));});const tr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(382)]).then(r.bind(r,3382))),rr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(180)]).then(r.bind(r,77180))),or=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(591)]).then(r.bind(r,89591))),ar=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(224)]).then(r.bind(r,73224))),ir=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(481)]).then(r.bind(r,85481))),nr=(0,o.lazy)(()=>r.e(321).then(r.bind(r,41321))),sr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(95)]).then(r.bind(r,2095))),lr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(8)]).then(r.bind(r,55008))),dr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(743)]).then(r.bind(r,13743))),cr=(0,o.lazy)(()=>r.e(186).then(r.bind(r,77805))),pr=(0,o.lazy)(()=>r.e(864).then(r.bind(r,31864))),mr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(58)]).then(r.bind(r,89058))),hr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(63)]).then(r.bind(r,95063))),ur=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(484)]).then(r.bind(r,38484))),gr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(749)]).then(r.bind(r,7749))),yr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(372)]).then(r.bind(r,65372))),xr=(0,o.lazy)(()=>r.e(451).then(r.bind(r,18451))),fr=(0,o.lazy)(()=>r.e(282).then(r.bind(r,2282))),br=(0,o.lazy)(()=>r.e(436).then(r.bind(r,51436))),vr=s.Ay.div`
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #0A0A1B 0%,
    #141429 50%,
    #1A1A3E 100%
  );
  position: relative;
  overflow-x: hidden;
`,$r=s.Ay.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
`,kr=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #00C9FF;
  font-size: 1.2rem;
  
  &::before {
    content: '';
    width: 80px;
    height: 80px;
    border: 4px solid rgba(139, 92, 246, 0.1);
    border-top-color: #8B5CF6;
    border-radius: 50%;
    animation: ${s.AH`${er}`} 1s linear infinite;
    margin-right: 1rem;
  }
`,wr=()=>(0,z.jsx)(kr,{children:"Loading Quantum Interface..."});function Ar(){const[e,t]=(0,o.useState)(!1),[r,a]=(0,o.useState)(!1),{updateSyncResult:l}=(0,ce.g)(),{isSearchOpen:d,closeSearch:m}=me();return(0,o.useEffect)(()=>{t(!1),"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(e=>{}).catch(e=>{})},[]),(0,z.jsx)(Jt,{children:(0,z.jsxs)(s.NP,{theme:c,children:[(0,z.jsx)(p,{}),(0,z.jsxs)(vr,{children:[(0,z.jsx)(Zt,{nodeCount:60,maxConnections:6,connectionDistance:200,animationSpeed:1,interactive:!0,opacity:.4,colorScheme:"quantum"}),(0,z.jsx)($r,{children:(0,z.jsx)(i.Kd,{children:(0,z.jsxs)(pe.O,{children:[(0,z.jsx)(se,{}),e&&(0,z.jsx)("div",{style:{position:"fixed",top:"100px",right:"16px",width:"384px",zIndex:1e3},children:(0,z.jsx)(de,{})}),r&&(0,z.jsx)(We,{isActive:r,onToggle:()=>a(!r)}),(0,z.jsx)(dt,{}),d&&(0,z.jsx)(_t,{isOpen:d,onClose:m}),(0,z.jsx)(o.Suspense,{fallback:(0,z.jsx)(wr,{}),children:(0,z.jsxs)(n.BV,{children:[(0,z.jsx)(n.qh,{path:"/",element:(0,z.jsx)(je,{children:(0,z.jsx)(tr,{})})}),(0,z.jsx)(n.qh,{path:"/login",element:(0,z.jsx)(yr,{})}),(0,z.jsx)(n.qh,{path:"/auth/callback",element:(0,z.jsx)(xr,{})}),(0,z.jsx)(n.qh,{path:"/repositories",element:(0,z.jsx)(je,{children:(0,z.jsx)(tr,{})})}),(0,z.jsx)(n.qh,{path:"/repository/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(rr,{})})}),(0,z.jsx)(n.qh,{path:"/repository/:repoName/view",element:(0,z.jsx)(je,{children:(0,z.jsx)(or,{})})}),(0,z.jsx)(n.qh,{path:"/docs",element:(0,z.jsx)(je,{children:(0,z.jsx)(cr,{})})}),(0,z.jsx)(n.qh,{path:"/docs/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(ar,{})})}),(0,z.jsx)(n.qh,{path:"/docs/:repoName/*",element:(0,z.jsx)(je,{children:(0,z.jsx)(ar,{})})}),(0,z.jsx)(n.qh,{path:"/apis",element:(0,z.jsx)(je,{children:(0,z.jsx)(lr,{})})}),(0,z.jsx)(n.qh,{path:"/api-explorer",element:(0,z.jsx)(je,{children:(0,z.jsx)(mr,{})})}),(0,z.jsx)(n.qh,{path:"/api-explorer/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(sr,{})})}),(0,z.jsx)(n.qh,{path:"/api/:repoName/swagger",element:(0,z.jsx)(je,{children:(0,z.jsx)(dr,{})})}),(0,z.jsx)(n.qh,{path:"/graphql/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(nr,{})})}),(0,z.jsx)(n.qh,{path:"/graphql-playground/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(hr,{})})}),(0,z.jsx)(n.qh,{path:"/postman/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(ir,{})})}),(0,z.jsx)(n.qh,{path:"/postman-runner/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(gr,{})})}),(0,z.jsx)(n.qh,{path:"/grpc/:repoName",element:(0,z.jsx)(je,{children:(0,z.jsx)(ur,{})})}),(0,z.jsx)(n.qh,{path:"/sync",element:(0,z.jsx)(ve,{requiredRole:he.gG.ADMIN,children:(0,z.jsx)(je,{children:(0,z.jsx)(pr,{})})})}),(0,z.jsx)(n.qh,{path:"/profile",element:(0,z.jsx)(ve,{requiredRole:he.gG.DEVELOPER,children:(0,z.jsx)(je,{children:(0,z.jsx)(fr,{})})})}),(0,z.jsx)(n.qh,{path:"/api-keys",element:(0,z.jsx)(ve,{requiredRole:he.gG.ADMIN,children:(0,z.jsx)(je,{children:(0,z.jsx)(br,{})})})}),(0,z.jsx)(n.qh,{path:"*",element:(0,z.jsx)(je,{children:(0,z.jsx)(tr,{})})})]})})]})})})]})]})})}const Sr=function(){return(0,z.jsx)(ce.n,{children:(0,z.jsx)(Ar,{})})},jr=document.getElementById("root");if(!jr)throw new Error("Failed to find the root element");a.createRoot(jr).render((0,z.jsx)(o.StrictMode,{children:(0,z.jsx)(Sr,{})}))},9425:(e,t,r)=>{r.d(t,{Lj:()=>a,UT:()=>l,Up:()=>n,kk:()=>o,oW:()=>i,p8:()=>s});const o={text:{primary:"#ffffff",secondary:"#e5e7eb",tertiary:"#9ca3af",muted:"#6b7280",link:"#58a6ff",linkHover:"#79c0ff"},quantum:{deep:"#0A0A1B",void:"#141429",dark:"#1E1E3F",medium:"#2D2D5A",light:"#3A3A7A",bright:"#4747B8",glow:"#5C5CE6"},neural:{deep:"#0B1426",dark:"#1A2844",medium:"#334155",light:"#60a5fa",bright:"#3b82f6",glow:"#58a6ff",electric:"#0ea5e9"},plasma:{violet:"#a78bfa",cyan:"#fbbf24",magenta:"#f472b6",gold:"#fde047",emerald:"#86efac",crimson:"#fca5a5"},glass:{background:"rgba(20, 20, 41, 0.1)",border:"rgba(255, 255, 255, 0.1)",hover:"rgba(255, 255, 255, 0.05)",active:"rgba(255, 255, 255, 0.15)"},gradients:{aurora:{start:"#8b5cf6",middle:"#06b6d4",end:"#10b981"},neutron:{start:"#0B1426",middle:"#2D2D5A",end:"#5C5CE6"},supernova:{start:"#FF073A",middle:"#FF00FF",end:"#FFD700"},holographic:{start:"rgba(76, 29, 149, 0.9)",middle:"rgba(6, 86, 102, 0.8)",end:"rgba(6, 78, 59, 0.7)"}}},a={easing:{quantum:"cubic-bezier(0.4, 0, 0.2, 1)",neural:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",plasma:"cubic-bezier(0.68, -0.55, 0.265, 1.55)"},duration:{instant:"100ms",fast:"200ms",normal:"300ms",slow:"500ms",epic:"1000ms"},glow:{small:"0 0 10px",medium:"0 0 20px",large:"0 0 40px",epic:"0 0 80px"},blur:{sm:"blur(0px)",md:"blur(0px)",lg:"blur(0px)",xl:"blur(0px)"}},i={background:{primary:"rgba(15, 23, 42, 0.95)",secondary:"rgba(30, 41, 59, 0.98)",tertiary:"rgba(51, 65, 85, 0.95)"},backdrop:{light:"blur(0px)",medium:"blur(0px)",heavy:"blur(0px)"},border:{subtle:"1px solid rgba(255, 255, 255, 0.1)",medium:"1px solid rgba(255, 255, 255, 0.2)",bright:"1px solid rgba(255, 255, 255, 0.3)"},shadow:{soft:"0 8px 32px rgba(0, 0, 0, 0.3)",medium:"0 16px 64px rgba(0, 0, 0, 0.4)",dramatic:"0 24px 96px rgba(0, 0, 0, 0.5)"}},n={colors:o,animations:a,glass:i,typography:{fonts:{primary:'"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',mono:'"JetBrains Mono", "Fira Code", Monaco, monospace',display:'"Space Grotesk", "Inter", sans-serif'},sizes:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem","6xl":"3.75rem"},weights:{light:300,normal:400,medium:500,semibold:600,bold:700,black:900}},spacing:{px:"1px",0:"0",1:"0.25rem",2:"0.5rem",3:"0.75rem",4:"1rem",5:"1.25rem",6:"1.5rem",8:"2rem",10:"2.5rem",12:"3rem",16:"4rem",20:"5rem",24:"6rem",32:"8rem"},borderRadius:{none:"0",sm:"0.25rem",md:"0.5rem",lg:"0.75rem",xl:"1rem","2xl":"1.5rem","3xl":"2rem",full:"9999px"},zIndex:{background:-10,default:0,dropdown:1e3,sticky:1020,fixed:1030,modalBackdrop:1040,modal:1050,popover:1060,tooltip:1070,max:2147483647}},s=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"to right";for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return`linear-gradient(${e}, ${r.join(", ")})`},l=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"medium";return`${a.glow[t]} ${e}`}},13689:(e,t,r)=>{r.d(t,{Ex:()=>O,$n:()=>o.$,Zp:()=>n,Wu:()=>c,BT:()=>d,aR:()=>s,ZB:()=>l,mc:()=>m,so:()=>g,Hh:()=>I,xA:()=>u,H1:()=>f,H2:()=>b,H3:()=>v,pd:()=>L,hj:()=>k,wn:()=>h,EY:()=>$});var o=r(75969),a=r(5464);const i={default:a.AH`
    background-color: ${e=>e.theme.colors.background.primary};
    border: 1px solid ${e=>e.theme.colors.border.light};
  `,outlined:a.AH`
    background-color: transparent;
    border: 2px solid ${e=>e.theme.colors.border.medium};
  `,filled:a.AH`
    background-color: ${e=>e.theme.colors.background.secondary};
    border: 1px solid transparent;
  `},n=a.Ay.div.withConfig({shouldForwardProp:e=>!["elevated","hoverable","clickable","variant"].includes(e)})`
  padding: ${e=>e.theme.spacing[6]};
  border-radius: ${e=>e.theme.borderRadius.lg};
  transition: ${e=>e.theme.animations.transition.all};
  position: relative;
  
  ${e=>{let{variant:t="default"}=e;return i[t]}}
  
  ${e=>{let{elevated:t}=e;return t&&a.AH`
    box-shadow: ${e=>e.theme.shadows.card};
  `}}
  
  ${e=>{let{hoverable:t}=e;return t&&a.AH`
    &:hover {
      box-shadow: ${e=>e.theme.shadows.cardHover};
      transform: translateY(-2px);
    }
  `}}
  
  ${e=>{let{clickable:t}=e;return t&&a.AH`
    cursor: pointer;
    user-select: none;
    
    &:active {
      transform: scale(0.99);
    }
  `}}
`,s=a.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${e=>e.theme.spacing[4]};
  padding-bottom: ${e=>e.theme.spacing[4]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,l=a.Ay.h3`
  font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0;
`,d=a.Ay.p`
  font-size: ${e=>e.theme.typography.fontSize.base};
  color: ${e=>e.theme.colors.text.secondary};
  margin-bottom: ${e=>e.theme.spacing[4]};
  line-height: ${e=>e.theme.typography.lineHeight.relaxed};
`,c=a.Ay.div`
  color: ${e=>e.theme.colors.text.primary};
`;a.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${e=>e.theme.spacing[4]};
  padding-top: ${e=>e.theme.spacing[4]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  gap: ${e=>e.theme.spacing[3]};
`,a.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${e=>e.theme.layout.gridGap.medium};
  
  ${e=>{let{columns:t}=e;return t&&a.AH`
    grid-template-columns: repeat(${t}, 1fr);
    
    ${e=>e.theme.breakpoints.down.lg} {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  `}}
`;var p=r(34594);const m=a.Ay.div.withConfig({shouldForwardProp:e=>!["maxWidth","fluid","centered","padding"].includes(e)})`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  
  ${e=>{let{maxWidth:t="xl"}=e;return a.AH`
    max-width: ${e=>e.theme.containers[t]};
  `}}
  
  ${e=>{let{fluid:t}=e;return t&&a.AH`
    max-width: 100%;
  `}}
  
  ${e=>{let{centered:t=!0}=e;return t&&a.AH`
    margin-left: auto;
    margin-right: auto;
  `}}
  
  ${e=>{let{padding:t="desktop"}=e;return a.AH`
    padding-left: ${e=>e.theme.layout.containerPadding[t]};
    padding-right: ${e=>e.theme.layout.containerPadding[t]};
    
    ${e=>e.theme.breakpoints.down.md} {
      padding-left: ${e=>e.theme.layout.containerPadding.mobile};
      padding-right: ${e=>e.theme.layout.containerPadding.mobile};
    }
    
    @media (min-width: 768px) and (max-width: 1023px) {
      padding-left: ${e=>e.theme.layout.containerPadding.tablet};
      padding-right: ${e=>e.theme.layout.containerPadding.tablet};
    }
  `}}
`,h=a.Ay.section.withConfig({shouldForwardProp:e=>"spacing"!==e})`
  padding-top: ${e=>{let{spacing:t="medium"}=e;return p.A.layout.sectionSpacing[t]}};
  padding-bottom: ${e=>{let{spacing:t="medium"}=e;return p.A.layout.sectionSpacing[t]}};
  
  ${e=>e.theme.breakpoints.down.md} {
    padding-top: ${e=>{let{spacing:t="medium"}=e;return"large"===t?p.A.layout.sectionSpacing.medium:p.A.layout.sectionSpacing.small}};
    padding-bottom: ${e=>{let{spacing:t="medium"}=e;return"large"===t?p.A.layout.sectionSpacing.medium:p.A.layout.sectionSpacing.small}};
  }
`,u=a.Ay.div`
  display: grid;
  gap: ${e=>{let{gap:t="medium"}=e;return p.A.layout.gridGap[t]}};
  
  ${e=>{let{columns:t=12}=e;return a.AH`
    grid-template-columns: repeat(${t}, 1fr);
    
    ${e=>e.theme.breakpoints.down.lg} {
      grid-template-columns: repeat(${Math.min(t,8)}, 1fr);
    }
    
    ${e=>e.theme.breakpoints.down.md} {
      grid-template-columns: repeat(${Math.min(t,4)}, 1fr);
    }
    
    ${e=>e.theme.breakpoints.down.sm} {
      grid-template-columns: 1fr;
    }
  `}}
`,g=a.Ay.div.withConfig({shouldForwardProp:e=>!["direction","align","justify","wrap","gap"].includes(e)})`
  display: flex;
  
  ${e=>{let{direction:t="row"}=e;return a.AH`
    flex-direction: ${t};
  `}}
  
  ${e=>{let{align:t="stretch"}=e;return a.AH`
    align-items: ${"start"===t?"flex-start":"end"===t?"flex-end":t};
  `}}
  
  ${e=>{let{justify:t="start"}=e;return a.AH`
    justify-content: ${"start"===t?"flex-start":"end"===t?"flex-end":"between"===t?"space-between":"around"===t?"space-around":"evenly"===t?"space-evenly":t};
  `}}
  
  ${e=>{let{wrap:t}=e;return t&&a.AH`
    flex-wrap: wrap;
  `}}
  
  ${e=>{let{gap:t}=e;return t&&a.AH`
    gap: ${e=>e.theme.spacing[t]};
  `}}
`;var y=r(21617);const x=a.AH`
  color: ${e=>{let{color:t="primary"}=e;return y.w.colors.text[t]}};
  text-align: ${e=>{let{align:t="left"}=e;return t}};
  margin: 0;
`,f=a.Ay.h1`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.h1.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h1.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h1.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.h1.letterSpacing};
  margin-bottom: ${e=>e.theme.spacing[6]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize["4xl"]};
  }
`,b=a.Ay.h2`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.h2.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h2.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h2.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.h2.letterSpacing};
  margin-bottom: ${e=>e.theme.spacing[5]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize["3xl"]};
  }
`,v=a.Ay.h3`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.h3.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h3.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h3.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.h3.letterSpacing};
  margin-bottom: ${e=>e.theme.spacing[4]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  }
`,$=(a.Ay.h4`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.h4.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h4.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h4.lineHeight};
  margin-bottom: ${e=>e.theme.spacing[3]};
`,a.Ay.h5`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.h5.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h5.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h5.lineHeight};
  margin-bottom: ${e=>e.theme.spacing[3]};
`,a.Ay.h6`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.h6.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h6.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h6.lineHeight};
  margin-bottom: ${e=>e.theme.spacing[3]};
`,a.Ay.p`
  ${x}
  font-size: ${e=>{let{size:t="base"}=e;return"small"===t?y.w.typography.textStyles.bodySmall.fontSize:"large"===t?y.w.typography.textStyles.bodyLarge.fontSize:y.w.typography.textStyles.body.fontSize}};
  font-weight: ${e=>{let{weight:t="normal"}=e;return y.w.typography.fontWeight[t]}};
  line-height: ${e=>{let{size:t="base"}=e;return"small"===t?y.w.typography.textStyles.bodySmall.lineHeight:"large"===t?y.w.typography.textStyles.bodyLarge.lineHeight:y.w.typography.textStyles.body.lineHeight}};
  margin-bottom: ${e=>e.theme.spacing[4]};
`),k=(a.Ay.span`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.caption.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.caption.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.caption.lineHeight};
`,a.Ay.span`
  ${x}
  font-size: ${e=>e.theme.typography.textStyles.overline.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.overline.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.overline.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.overline.letterSpacing};
  text-transform: uppercase;
`,a.Ay.p`
  ${x}
  font-size: ${e=>e.theme.typography.fontSize.xl};
  line-height: ${e=>e.theme.typography.lineHeight.relaxed};
  font-weight: ${e=>e.theme.typography.fontWeight.light};
  margin-bottom: ${e=>e.theme.spacing[6]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize.lg};
  }
`);a.Ay.mark`
  background-color: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
  border-radius: ${e=>e.theme.borderRadius.sm};
`,a.Ay.code`
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  background-color: ${e=>e.theme.colors.background.secondary};
  color: ${e=>e.theme.colors.text.primary};
  padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
  border-radius: ${e=>e.theme.borderRadius.sm};
`,a.Ay.blockquote`
  margin: ${e=>e.theme.spacing[6]} 0;
  padding-left: ${e=>e.theme.spacing[6]};
  border-left: 4px solid ${e=>e.theme.colors.primary.yellow};
  font-style: italic;
  color: ${e=>e.theme.colors.text.secondary};
  
  p {
    margin-bottom: ${e=>e.theme.spacing[3]};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;r(65043);var w=r(70579);const A=a.i7`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,S=a.i7`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`,j=a.i7`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
`,z=a.Ay.div`
  display: inline-block;
  border-radius: 50%;
  animation: ${a.AH`${A}`} 0.8s linear infinite;
  
  ${e=>t=>{let{size:r="md",color:o=e.theme.colors.primary.yellow}=t;const i={sm:{width:"16px",height:"16px",border:"2px"},md:{width:"24px",height:"24px",border:"3px"},lg:{width:"32px",height:"32px",border:"4px"}};return a.AH`
      width: ${i[r].width};
      height: ${i[r].height};
      border: ${i[r].border} solid ${e=>e.theme.colors.border.light};
      border-top-color: ${o};
    `}}
`,E=a.Ay.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing[1]};
`,C=a.Ay.div`
  width: 8px;
  height: 8px;
  background-color: ${e=>e.theme.colors.primary.yellow};
  border-radius: 50%;
  animation: ${a.AH`${S}`} 1.4s ease-in-out infinite;
  animation-delay: ${e=>{let{delay:t}=e;return t}}s;
`,T=()=>(0,w.jsxs)(E,{children:[(0,w.jsx)(C,{delay:0}),(0,w.jsx)(C,{delay:.2}),(0,w.jsx)(C,{delay:.4})]}),R=a.Ay.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing[.5]};
  align-items: flex-end;
  height: 24px;
`,F=a.Ay.div`
  width: 4px;
  height: 100%;
  background-color: ${e=>e.theme.colors.primary.yellow};
  animation: ${a.AH`${j}`} 1.2s ease-in-out infinite;
  animation-delay: ${e=>{let{delay:t}=e;return t}}s;
`,P=()=>(0,w.jsxs)(R,{children:[(0,w.jsx)(F,{delay:0}),(0,w.jsx)(F,{delay:.1}),(0,w.jsx)(F,{delay:.2}),(0,w.jsx)(F,{delay:.3}),(0,w.jsx)(F,{delay:.4})]}),_=a.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${e=>{let{$blur:t}=e;return t?y.w.colors.background.overlay:y.w.colors.background.primary}};
  z-index: ${e=>e.theme.zIndex.modal};
  
  ${e=>{let{$blur:t}=e;return t&&a.AH`
    backdrop-filter: blur(0px);
  `}}
`,H=a.Ay.p`
  margin-top: ${e=>e.theme.spacing[4]};
  font-size: ${e=>e.theme.typography.fontSize.lg};
  color: ${e=>e.theme.colors.text.secondary};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
`,I=e=>{let{text:t="Loading...",blur:r=!1,variant:o="spinner"}=e;return(0,w.jsxs)(_,{$blur:r,children:["spinner"===o&&(0,w.jsx)(z,{size:"lg"}),"dots"===o&&(0,w.jsx)(T,{}),"bars"===o&&(0,w.jsx)(P,{}),t&&(0,w.jsx)(H,{children:t})]})},N=a.i7`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`,O=(a.Ay.div`
  width: ${e=>{let{width:t="100%"}=e;return t}};
  height: ${e=>{let{height:t="20px"}=e;return t}};
  border-radius: ${e=>{let{radius:t="md"}=e;return y.w.borderRadius[t]}};
  background: linear-gradient(
    90deg,
    ${e=>e.theme.colors.background.secondary} 25%,
    ${e=>e.theme.colors.border.light} 50%,
    ${e=>e.theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  animation: ${a.AH`${N}`} 1.5s ease-in-out infinite;
`,a.Ay.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
`,a.Ay.div`
  width: 100%;
  height: ${e=>{let{height:t="8px"}=e;return t}};
  background-color: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${e=>{let{progress:t}=e;return`${t}%`}};
    background-color: ${e=>e.theme.colors.primary.yellow};
    transition: width 0.3s ease;
    border-radius: ${e=>e.theme.borderRadius.full};
  }
`,a.Ay.span`
  display: inline-flex;
  align-items: center;
  padding: ${e=>{switch(e.size){case"sm":return`${y.w.spacing[1]} ${y.w.spacing[2]}`;case"lg":return`${y.w.spacing[2]} ${y.w.spacing[4]}`;default:return`${y.w.spacing[1]} ${y.w.spacing[3]}`}}};
  font-size: ${e=>{switch(e.size){case"sm":return y.w.typography.fontSize.xs;case"lg":return y.w.typography.fontSize.base;default:return y.w.typography.fontSize.sm}}};
  font-weight: ${y.w.typography.fontWeight.medium};
  border-radius: ${y.w.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background-color: ${e=>{switch(e.variant){case"primary":return y.w.colors.primary.yellow;case"secondary":return y.w.colors.secondary.darkGray;case"success":return y.w.colors.semantic.success;case"warning":return y.w.colors.semantic.warning;case"danger":return y.w.colors.semantic.error;case"info":return y.w.colors.semantic.info;default:return y.w.colors.background.tertiary}}};
  
  color: ${e=>{switch(e.variant){case"primary":return y.w.colors.primary.black;case"secondary":case"success":case"warning":case"danger":case"info":return y.w.colors.primary.white;default:return y.w.colors.text.primary}}};
`),L=a.Ay.input`
  width: 100%;
  padding: ${e=>{switch(e.size){case"sm":return`${e.theme.spacing[2]} ${e.theme.spacing[3]}`;case"lg":return`${e.theme.spacing[4]} ${e.theme.spacing[5]}`;default:return`${e.theme.spacing[3]} ${e.theme.spacing[4]}`}}};
  font-size: ${e=>{switch(e.size){case"sm":return e.theme.typography.fontSize.sm;case"lg":return e.theme.typography.fontSize.lg;default:return e.theme.typography.fontSize.base}}};
  line-height: ${e=>e.theme.typography.lineHeight.normal};
  color: ${e=>e.theme.colors.text.primary};
  background-color: ${e=>"filled"===e.variant?y.w.colors.background.secondary:y.w.colors.primary.white};
  border: 2px solid ${e=>e.error?y.w.colors.semantic.error:"outlined"===e.variant?y.w.colors.border.medium:"transparent"};
  border-radius: ${e=>e.theme.borderRadius.md};
  outline: none;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${e=>e.theme.colors.text.secondary};
  }
  
  &:hover {
    border-color: ${e=>e.error?y.w.colors.semantic.error:y.w.colors.border.dark};
  }
  
  &:focus {
    border-color: ${e=>e.error?y.w.colors.semantic.error:y.w.colors.primary.yellow};
    box-shadow: 0 0 0 3px ${e=>e.error?"rgba(196, 35, 43, 0.12)":"rgba(255, 230, 0, 0.12)"};
  }
  
  &:disabled {
    background-color: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`;a.Ay.textarea`
  width: 100%;
  padding: ${e=>{switch(e.size){case"sm":return`${e.theme.spacing[2]} ${e.theme.spacing[3]}`;case"lg":return`${e.theme.spacing[4]} ${e.theme.spacing[5]}`;default:return`${e.theme.spacing[3]} ${e.theme.spacing[4]}`}}};
  font-size: ${e=>{switch(e.size){case"sm":return e.theme.typography.fontSize.sm;case"lg":return e.theme.typography.fontSize.lg;default:return e.theme.typography.fontSize.base}}};
  line-height: ${e=>e.theme.typography.lineHeight.relaxed};
  color: ${e=>e.theme.colors.text.primary};
  background-color: ${e=>"filled"===e.variant?y.w.colors.background.secondary:y.w.colors.primary.white};
  border: 2px solid ${e=>e.error?y.w.colors.semantic.error:"outlined"===e.variant?y.w.colors.border.medium:"transparent"};
  border-radius: ${e=>e.theme.borderRadius.md};
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${e=>e.theme.colors.text.secondary};
  }
  
  &:hover {
    border-color: ${e=>e.error?y.w.colors.semantic.error:y.w.colors.border.dark};
  }
  
  &:focus {
    border-color: ${e=>e.error?y.w.colors.semantic.error:y.w.colors.primary.yellow};
    box-shadow: 0 0 0 3px ${e=>e.error?"rgba(196, 35, 43, 0.12)":"rgba(255, 230, 0, 0.12)"};
  }
  
  &:disabled {
    background-color: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`},21617:(e,t,r)=>{r.d(t,{w:()=>o});const o={colors:{primary:{yellow:"#FFD700",black:"#000000",white:"#FFFFFF",main:"#FFD700"},secondary:{lightGray:"#F5F5F5",mediumGray:"#9E9E9E",darkGray:"#616161"},gray:{50:"#FAFAFA",100:"#F5F5F5",200:"#E0E0E6",300:"#C0C0C6",400:"#9E9E9E",500:"#747480",600:"#616161",700:"#424242",800:"#2E2E38",900:"#212121"},accent:{blue:"#0B6BA7",green:"#00A350",red:"#C4232B",orange:"#FF7900",purple:"#6B46C1"},semantic:{success:"#00A350",warning:"#FF7900",error:"#C4232B",info:"#0B6BA7"},background:{primary:"#FFFFFF",secondary:"#F5F5F5",tertiary:"#FAFAFA",dark:"#1A1A1A",overlay:"rgba(0, 0, 0, 0.5)"},text:{primary:"#212121",secondary:"#616161",tertiary:"#9E9E9E",inverse:"#FFFFFF",link:"#1976D2"},border:{light:"#E0E0E0",medium:"#BDBDBD",dark:"#616161"},status:{success:"#4CAF50",warning:"#FF9800",error:"#F44336",info:"#2196F3"},info:{light:"#E3F2FD",main:"#2196F3"}},typography:{fontFamily:{primary:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',mono:'Monaco, Consolas, "Courier New", monospace'},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem"},fontWeight:{light:300,normal:400,medium:500,semibold:600,bold:700,black:900},lineHeight:{tight:1.25,normal:1.5,relaxed:1.75},textStyles:{h1:{fontSize:"3rem",fontWeight:700,lineHeight:1.2,letterSpacing:"-0.02em"},h2:{fontSize:"2.25rem",fontWeight:700,lineHeight:1.25,letterSpacing:"-0.01em"},h3:{fontSize:"1.875rem",fontWeight:600,lineHeight:1.3,letterSpacing:"-0.01em"},h4:{fontSize:"1.5rem",fontWeight:600,lineHeight:1.35},h5:{fontSize:"1.25rem",fontWeight:600,lineHeight:1.4},h6:{fontSize:"1.125rem",fontWeight:600,lineHeight:1.4},bodyLarge:{fontSize:"1.125rem",fontWeight:400,lineHeight:1.75},body:{fontSize:"1rem",fontWeight:400,lineHeight:1.5},bodySmall:{fontSize:"0.875rem",fontWeight:400,lineHeight:1.5},button:{fontSize:"1rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.02em"},caption:{fontSize:"0.75rem",fontWeight:400,lineHeight:1.4},overline:{fontSize:"0.75rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.08em",textTransform:"uppercase"}}},spacing:{.5:"0.125rem",1:"0.25rem",2:"0.5rem",3:"0.75rem",4:"1rem",5:"1.25rem",6:"1.5rem",8:"2rem",10:"2.5rem",12:"3rem",16:"4rem",20:"5rem"},breakpoints:{values:{xs:0,sm:640,md:768,lg:1024,xl:1280,"2xl":1536},up:{sm:"@media (min-width: 640px)",md:"@media (min-width: 768px)",lg:"@media (min-width: 1024px)",xl:"@media (min-width: 1280px)","2xl":"@media (min-width: 1536px)"},down:{xs:"@media (max-width: 639px)",sm:"@media (max-width: 767px)",md:"@media (max-width: 1023px)",lg:"@media (max-width: 1279px)",xl:"@media (max-width: 1535px)"}},borderRadius:{none:"0",sm:"0.125rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem",full:"9999px"},shadows:{sm:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",md:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",lg:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",xl:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",focus:"0 0 0 3px rgba(255, 215, 0, 0.5)"},animations:{duration:{fast:"150ms",normal:"300ms",slow:"500ms"},easing:{linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.4, 0, 0.2, 1)",easeOut:"cubic-bezier(0, 0, 0.2, 1)"},transition:{colors:"color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out",transform:"transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",all:"all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}},zIndex:{dropdown:1e3,sticky:1020,fixed:1030,modalBackdrop:1040,modal:1050,popover:1060,tooltip:1070},components:{button:{height:{sm:"32px",md:"40px",lg:"48px"},padding:{sm:"0 12px",md:"0 16px",lg:"0 24px"},borderRadius:"8px"}},primaryDark:"#E6D100",backgroundHover:"#F5F5F5"}},34594:(e,t,r)=>{r.d(t,{A:()=>s});const o={gray:{50:"#FAFAFA",100:"#F5F5F5",200:"#E0E0E6",300:"#C0C0C6",400:"#9E9E9E",500:"#747480",600:"#616161",700:"#424242",800:"#2E2E38",900:"#212121"},primaryDark:"#E6D100",backgroundHover:"#F5F5F5",info:{light:"#E3F2FD",main:"#0B6BA7"},primary:{yellow:"#FFE600",black:"#2E2E38",white:"#FFFFFF",main:"#FFE600"},secondary:{darkGray:"#747480",mediumGray:"#C0C0C6",lightGray:"#F5F5F5",gray:"#C0C0C6"},accent:{blue:"#0B6BA7",green:"#00A350",red:"#C4232B",orange:"#FF7900",purple:"#6B46C1"},semantic:{success:"#00A350",warning:"#FF7900",error:"#C4232B",info:"#0B6BA7"},status:{success:"#00A350",warning:"#FF7900",error:"#C4232B",info:"#0B6BA7"},background:{primary:"#FFFFFF",secondary:"#F5F5F5",tertiary:"#FAFAFA",dark:"#2E2E38",overlay:"rgba(46, 46, 56, 0.8)"},text:{primary:"#2E2E38",secondary:"#747480",tertiary:"#C0C0C6",inverse:"#FFFFFF",link:"#0B6BA7"},border:{light:"#E0E0E6",medium:"#C0C0C6",dark:"#747480"},shadow:{light:"rgba(46, 46, 56, 0.08)",medium:"rgba(46, 46, 56, 0.12)",dark:"rgba(46, 46, 56, 0.24)"}},a={fontFamily:{primary:'"EYInterstate", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',secondary:'"Georgia", "Times New Roman", Times, serif',mono:'"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem","6xl":"3.75rem"},fontWeight:{light:300,normal:400,medium:500,semibold:600,bold:700,black:900},lineHeight:{tight:1.2,normal:1.5,relaxed:1.75,loose:2},letterSpacing:{tighter:"-0.02em",tight:"-0.01em",normal:"0",wide:"0.02em",wider:"0.04em",widest:"0.08em"},textStyles:{h1:{fontSize:"3rem",fontWeight:700,lineHeight:1.2,letterSpacing:"-0.02em"},h2:{fontSize:"2.25rem",fontWeight:700,lineHeight:1.25,letterSpacing:"-0.01em"},h3:{fontSize:"1.875rem",fontWeight:600,lineHeight:1.3,letterSpacing:"-0.01em"},h4:{fontSize:"1.5rem",fontWeight:600,lineHeight:1.35},h5:{fontSize:"1.25rem",fontWeight:600,lineHeight:1.4},h6:{fontSize:"1.125rem",fontWeight:600,lineHeight:1.4},bodyLarge:{fontSize:"1.125rem",fontWeight:400,lineHeight:1.75},body:{fontSize:"1rem",fontWeight:400,lineHeight:1.5},bodySmall:{fontSize:"0.875rem",fontWeight:400,lineHeight:1.5},button:{fontSize:"1rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.02em"},caption:{fontSize:"0.75rem",fontWeight:400,lineHeight:1.4},overline:{fontSize:"0.75rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.08em",textTransform:"uppercase"}}},i={px:"1px",0:"0",.5:"0.125rem",1:"0.25rem",1.5:"0.375rem",2:"0.5rem",2.5:"0.625rem",3:"0.75rem",3.5:"0.875rem",4:"1rem",5:"1.25rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",14:"3.5rem",16:"4rem",20:"5rem",24:"6rem",28:"7rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem"},n={values:{xs:0,sm:640,md:768,lg:1024,xl:1280,"2xl":1536},up:{xs:"@media (min-width: 0px)",sm:"@media (min-width: 640px)",md:"@media (min-width: 768px)",lg:"@media (min-width: 1024px)",xl:"@media (min-width: 1280px)","2xl":"@media (min-width: 1536px)"},down:{xs:"@media (max-width: 639px)",sm:"@media (max-width: 767px)",md:"@media (max-width: 1023px)",lg:"@media (max-width: 1279px)",xl:"@media (max-width: 1535px)","2xl":"@media (max-width: 9999px)"}},s={colors:o,typography:a,spacing:i,layout:{containerPadding:{mobile:i[4],tablet:i[6],desktop:i[8]},sectionSpacing:{small:i[8],medium:i[16],large:i[24]},componentSpacing:{xs:i[2],sm:i[3],md:i[4],lg:i[6],xl:i[8]},gridGap:{small:i[4],medium:i[6],large:i[8]}},shadows:{none:"none",sm:"0 1px 3px 0 rgba(46, 46, 56, 0.1), 0 1px 2px 0 rgba(46, 46, 56, 0.06)",md:"0 4px 6px -1px rgba(46, 46, 56, 0.1), 0 2px 4px -1px rgba(46, 46, 56, 0.06)",lg:"0 10px 15px -3px rgba(46, 46, 56, 0.1), 0 4px 6px -2px rgba(46, 46, 56, 0.05)",xl:"0 20px 25px -5px rgba(46, 46, 56, 0.1), 0 10px 10px -5px rgba(46, 46, 56, 0.04)","2xl":"0 25px 50px -12px rgba(46, 46, 56, 0.25)",card:"0 2px 8px rgba(46, 46, 56, 0.08)",cardHover:"0 8px 16px rgba(46, 46, 56, 0.12)",dropdown:"0 10px 20px rgba(46, 46, 56, 0.15)",modal:"0 20px 40px rgba(46, 46, 56, 0.2)",inner:"inset 0 2px 4px 0 rgba(46, 46, 56, 0.06)",focus:"0 0 0 3px rgba(255, 230, 0, 0.5)",focusError:"0 0 0 3px rgba(196, 35, 43, 0.5)",focusSuccess:"0 0 0 3px rgba(0, 163, 80, 0.5)"},breakpoints:n,containers:{sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px",full:"100%"},animations:{duration:{fast:"150ms",normal:"250ms",slow:"350ms",slower:"500ms"},easing:{linear:"linear",easeIn:"cubic-bezier(0.4, 0, 1, 1)",easeOut:"cubic-bezier(0, 0, 0.2, 1)",easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",bounce:"cubic-bezier(0.68, -0.55, 0.265, 1.55)",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.4, 0, 0.2, 1)"},transition:{all:"all 250ms cubic-bezier(0.4, 0, 0.2, 1)",colors:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1), fill 250ms cubic-bezier(0.4, 0, 0.2, 1), stroke 250ms cubic-bezier(0.4, 0, 0.2, 1)",opacity:"opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)",shadow:"box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)",transform:"transform 250ms cubic-bezier(0.4, 0, 0.2, 1)"},keyframes:{fadeIn:{from:{opacity:0},to:{opacity:1}},fadeOut:{from:{opacity:1},to:{opacity:0}},slideIn:{from:{transform:"translateY(100%)"},to:{transform:"translateY(0)"}},slideOut:{from:{transform:"translateY(0)"},to:{transform:"translateY(100%)"}},scaleIn:{from:{transform:"scale(0.95)",opacity:0},to:{transform:"scale(1)",opacity:1}},spin:{from:{transform:"rotate(0deg)"},to:{transform:"rotate(360deg)"}},pulse:{"0%, 100%":{opacity:1},"50%":{opacity:.5}},bounce:{"0%, 100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-25%)"}}},animate:{fadeIn:"fadeIn 250ms cubic-bezier(0, 0, 0.2, 1)",fadeOut:"fadeOut 250ms cubic-bezier(0.4, 0, 1, 1)",slideIn:"slideIn 250ms cubic-bezier(0, 0, 0.2, 1)",slideOut:"slideOut 250ms cubic-bezier(0.4, 0, 1, 1)",scaleIn:"scaleIn 250ms cubic-bezier(0, 0, 0.2, 1)",spin:"spin 1s linear infinite",pulse:"pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",bounce:"bounce 1s cubic-bezier(0.4, 0, 0.2, 1) infinite"}},components:{button:{height:{sm:"32px",md:"40px",lg:"48px"},padding:{sm:`${i[2]} ${i[3]}`,md:`${i[2.5]} ${i[4]}`,lg:`${i[3]} ${i[5]}`},borderRadius:"4px"},card:{borderRadius:"8px",padding:i[6],background:o.background.primary,border:`1px solid ${o.border.light}`},input:{height:"40px",padding:`${i[2]} ${i[3]}`,borderRadius:"4px",border:`1px solid ${o.border.medium}`,focusBorder:o.primary.yellow},modal:{overlay:o.background.overlay,borderRadius:"12px",padding:i[8],maxWidth:"600px"}},zIndex:{dropdown:1e3,sticky:1020,fixed:1030,modalBackdrop:1040,modal:1050,popover:1060,tooltip:1070},borderRadius:{none:"0",sm:"2px",md:"4px",lg:"8px",xl:"12px","2xl":"16px","3xl":"24px",full:"9999px"}}},50122:(e,t,r)=>{r.d(t,{gG:()=>a});var o=r(72362);let a=function(e){return e.ADMIN="admin",e.DEVELOPER="developer",e.VIEWER="viewer",e}({});const i={clientId:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001",REACT_APP_API_PORT:"3001",REACT_APP_BYPASS_AUTH:"true"}.REACT_APP_EY_SSO_CLIENT_ID||"",authorizationURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001",REACT_APP_API_PORT:"3001",REACT_APP_BYPASS_AUTH:"true"}.REACT_APP_EY_SSO_AUTH_URL||"https://login.ey.com/oauth2/authorize",tokenURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001",REACT_APP_API_PORT:"3001",REACT_APP_BYPASS_AUTH:"true"}.REACT_APP_EY_SSO_TOKEN_URL||"https://login.ey.com/oauth2/token",userInfoURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001",REACT_APP_API_PORT:"3001",REACT_APP_BYPASS_AUTH:"true"}.REACT_APP_EY_SSO_USERINFO_URL||"https://login.ey.com/oauth2/userinfo",callbackURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001",REACT_APP_API_PORT:"3001",REACT_APP_BYPASS_AUTH:"true"}.REACT_APP_EY_SSO_CALLBACK_URL||"http://localhost:3000/auth/callback",scope:["openid","profile","email"]};new class{constructor(){this.TOKEN_KEY="eyns_auth_token",this.REFRESH_TOKEN_KEY="eyns_refresh_token",this.USER_KEY="eyns_user"}storeTokens(e){localStorage.setItem(this.TOKEN_KEY,e.accessToken),localStorage.setItem(this.REFRESH_TOKEN_KEY,e.refreshToken);const t=new Date;t.setSeconds(t.getSeconds()+e.expiresIn),localStorage.setItem("eyns_token_expires",t.toISOString())}getAccessToken(){return localStorage.getItem(this.TOKEN_KEY)}getRefreshToken(){return localStorage.getItem(this.REFRESH_TOKEN_KEY)}isTokenExpired(){const e=localStorage.getItem("eyns_token_expires");return!e||new Date>new Date(e)}clearAuth(){localStorage.removeItem(this.TOKEN_KEY),localStorage.removeItem(this.REFRESH_TOKEN_KEY),localStorage.removeItem(this.USER_KEY),localStorage.removeItem("eyns_token_expires")}storeUser(e){localStorage.setItem(this.USER_KEY,JSON.stringify(e))}getUser(){const e=localStorage.getItem(this.USER_KEY);if(!e)return null;try{return JSON.parse(e)}catch{return null}}parseToken(e){try{const t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),r=decodeURIComponent(atob(t).split("").map(e=>"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(r)}catch(t){return null}}getAuthorizationUrl(e){const t=new URLSearchParams({client_id:i.clientId,redirect_uri:i.callbackURL,response_type:"code",scope:i.scope.join(" "),state:e});return`${i.authorizationURL}?${t.toString()}`}async exchangeCodeForTokens(e){const t=await fetch((0,o.e9)("/api/auth/callback"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e})});if(!t.ok)throw new Error("Failed to exchange code for tokens");return await t.json()}async refreshAccessToken(){const e=this.getRefreshToken();if(!e)throw new Error("No refresh token available");const t=await fetch((0,o.e9)("/api/auth/refresh"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:e})});if(!t.ok)throw new Error("Failed to refresh access token");const r=await t.json();return this.storeTokens(r),r}async login(e,t){const r=await fetch((0,o.e9)("/api/auth/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})});if(!r.ok)throw new Error("Login failed");const a=await r.json();return this.storeTokens(a.tokens),this.storeUser(a.user),a}async logout(){const e=this.getAccessToken();if(e)try{await fetch((0,o.e9)("/api/auth/logout"),{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch(t){}this.clearAuth()}async getCurrentUser(){const e=this.getAccessToken();if(!e||this.isTokenExpired())return null;try{const t=await fetch((0,o.e9)("/api/auth/me"),{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return null;const r=await t.json();return this.storeUser(r),r}catch(t){return null}}async generateApiKey(e,t){const r=this.getAccessToken();if(!r)throw new Error("Not authenticated");const a=await fetch((0,o.e9)("/api/auth/api-keys"),{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:JSON.stringify({name:e,permissions:t})});if(!a.ok)throw new Error("Failed to generate API key");return a.json()}async listApiKeys(){const e=this.getAccessToken();if(!e)throw new Error("Not authenticated");const t=await fetch((0,o.e9)("/api/auth/api-keys"),{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw new Error("Failed to list API keys");return t.json()}async revokeApiKey(e){const t=this.getAccessToken();if(!t)throw new Error("Not authenticated");if(!(await fetch((0,o.e9)(`/api/auth/api-keys/${e}`),{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).ok)throw new Error("Failed to revoke API key")}hasPermission(e){const t=this.getUser();if(!t)return!1;const r={[a.ADMIN]:["*"],[a.DEVELOPER]:["read:apis","read:documentation","create:api_keys","manage:own_api_keys","test:apis","download:collections"],[a.VIEWER]:["read:apis","read:documentation"]}[t.role]||[];return r.includes("*")||r.includes(e)}async verifyAccessToken(e){try{return(await fetch((0,o.e9)("/api/auth/verify"),{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}})).ok}catch(t){return!1}}generateTokens(e){return{accessToken:btoa(JSON.stringify({userId:e.id,email:e.email,role:e.role,iat:Date.now(),exp:Date.now()+36e5})),refreshToken:btoa(JSON.stringify({userId:e.id,type:"refresh",iat:Date.now(),exp:Date.now()+6048e5})),expiresIn:3600}}getAuthHeader(){const e=this.getAccessToken();return e?{Authorization:`Bearer ${e}`}:{}}async demoLogin(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a.DEVELOPER;const t={[a.ADMIN]:{email:"admin@ey.com",password:"admin123"},[a.DEVELOPER]:{email:"developer@ey.com",password:"dev123"},[a.VIEWER]:{email:"viewer@ey.com",password:"view123"}}[e];return this.login(t.email,t.password)}}},66382:(e,t,r)=>{r.d(t,{A:()=>d,O:()=>l});var o=r(65043),a=r(50122),i=r(70579);const n=(0,o.createContext)(void 0),s={id:"bypass-user",email:"demo@localhost",name:"Demo User",role:a.gG.DEVELOPER,createdAt:new Date,updatedAt:new Date},l=e=>{let{children:t}=e;const[r]=(0,o.useState)(s),[a]=(0,o.useState)(!0),[l]=(0,o.useState)(!1),d={user:r,isAuthenticated:a,isLoading:l,login:async()=>{},loginWithSSO:()=>{},logout:()=>{window.location.href="/"},hasRole:e=>!0,hasPermission:e=>!0};return(0,i.jsx)(n.Provider,{value:d,children:t})},d=()=>{const e=(0,o.useContext)(n);if(void 0===e)throw new Error("useAuth must be used within an AuthProvider");return e}},67375:(e,t,r)=>{r.d(t,{g:()=>n,n:()=>s});var o=r(65043),a=r(70579);const i=(0,o.createContext)(void 0),n=()=>{const e=(0,o.useContext)(i);if(!e)throw new Error("useSyncContext must be used within a SyncProvider");return e},s=e=>{let{children:t}=e;const[r,n]=(0,o.useState)(null),[s,l]=(0,o.useState)(0);return(0,a.jsx)(i.Provider,{value:{lastSyncResult:r,syncVersion:s,updateSyncResult:e=>{n(e),l(e=>e+1)}},children:t})}},72362:(e,t,r)=>{r.d(t,{e9:()=>o});const o=e=>`${"http://0.0.0.0:3001"}${e}`},75969:(e,t,r)=>{r.d(t,{$:()=>n});var o=r(5464);const a={primary:o.AH`
    background-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.yellow)||"#FFD700"}};
    color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    border: 2px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.yellow)||"#FFD700"}};
    
    &:hover:not(:disabled) {
      background-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
      color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.yellow)||"#FFD700"}};
      border-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    }
  `,secondary:o.AH`
    background-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.white)||"#FFFFFF"}};
    border: 2px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    
    &:hover:not(:disabled) {
      background-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.secondary)||void 0===r?void 0:r.darkGray)||"#333333"}};
      border-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.secondary)||void 0===r?void 0:r.darkGray)||"#333333"}};
    }
  `,outline:o.AH`
    background-color: transparent;
    color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    border: 2px solid ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    
    &:hover:not(:disabled) {
      background-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
      color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.white)||"#FFFFFF"}};
    }
  `,ghost:o.AH`
    background-color: transparent;
    color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.primary)||void 0===r?void 0:r.black)||"#000000"}};
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${e=>{var t,r;return(null===(t=e.theme.colors)||void 0===t||null===(r=t.background)||void 0===r?void 0:r.secondary)||"#F0F0F0"}};
    }
  `},i={sm:o.AH`
    height: 32px;
    padding: 0 12px;
    font-size: 0.875rem;
  `,md:o.AH`
    height: 40px;
    padding: 0 16px;
    font-size: 1rem;
  `,lg:o.AH`
    height: 48px;
    padding: 0 24px;
    font-size: 1.125rem;
  `},n=o.Ay.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontFamily)||void 0===r?void 0:r.primary)||"Inter, system-ui, sans-serif"}};
  font-weight: ${e=>{var t,r;return(null===(t=e.theme.typography)||void 0===t||null===(r=t.fontWeight)||void 0===r?void 0:r.semibold)||"600"}};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${e=>{let{variant:t="primary"}=e;return a[t]}}
  ${e=>{let{size:t="md"}=e;return i[t]}}
  ${e=>{let{fullWidth:t}=e;return t&&o.AH`width: 100%;`}}
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Ripple effect on click */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.5s, opacity 0.5s;
  }
  
  &:active:not(:disabled)::after {
    transform: scale(4);
    opacity: 1;
    transition: 0s;
  }
`;(0,o.Ay)(n)`
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  
  ${e=>{let{size:t="md"}=e;return"sm"===t&&o.AH`
    width: 32px;
    height: 32px;
    padding: 0.375rem;
  `}}
  
  ${e=>{let{size:t="md"}=e;return"lg"===t&&o.AH`
    width: 48px;
    height: 48px;
    padding: 0.75rem;
  `}}
`},79204:(e,t,r)=>{r.d(t,{t:()=>a});var o=r(72362);const a=new class{constructor(){this.syncStatus={isInProgress:!1,totalRepositories:0,completedRepositories:0,errors:[]}}async startSync(e){try{const t=await fetch((0,o.e9)("/api/repository/sync"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({limit:e})});if(!t.ok)throw new Error("Sync failed");return await t.json()}catch(t){throw new Error(`Sync error: ${t instanceof Error?t.message:"Unknown error"}`)}}async syncOnStartup(){try{const e=await fetch((0,o.e9)("/api/repository/sync"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});if(!e.ok){const t=await e.text();throw new Error(`Startup sync failed: ${t}`)}return await e.json()}catch(e){return{success:!1,syncedRepositories:[],failedRepositories:[],totalTime:0,timestamp:new Date}}}async getSyncStatus(){try{const e=await fetch((0,o.e9)("/api/repository/sync/status"));if(!e.ok)return this.syncStatus;const t=await e.json();return this.syncStatus=t,t}catch(e){return this.syncStatus}}async cloneRepository(e){try{if(!(await fetch((0,o.e9)(`/api/repository/clone/${e}`),{method:"POST"})).ok)throw new Error("Clone failed")}catch(t){throw new Error(`Clone error: ${t instanceof Error?t.message:"Unknown error"}`)}}async updateRepositoryMetadata(e){try{if(!(await fetch((0,o.e9)(`/api/repository/metadata/${e}`),{method:"PUT"})).ok)throw new Error("Metadata update failed")}catch(t){throw new Error(`Metadata update error: ${t instanceof Error?t.message:"Unknown error"}`)}}getLastSyncInfo(){try{const e=localStorage.getItem("lastSyncInfo");if(e){const t=JSON.parse(e);return{timestamp:t.timestamp?new Date(t.timestamp):void 0,result:t.result}}}catch(e){}return{}}saveLastSyncInfo(e){try{localStorage.setItem("lastSyncInfo",JSON.stringify({timestamp:new Date,result:e}))}catch(t){}}}}},t={};function r(o){var a=t[o];if(void 0!==a)return a.exports;var i=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(i.exports,i,i.exports,r),i.loaded=!0,i.exports}r.m=e,(()=>{var e=[];r.O=(t,o,a,i)=>{if(!o){var n=1/0;for(c=0;c<e.length;c++){o=e[c][0],a=e[c][1],i=e[c][2];for(var s=!0,l=0;l<o.length;l++)(!1&i||n>=i)&&Object.keys(r.O).every(e=>r.O[e](o[l]))?o.splice(l--,1):(s=!1,i<n&&(n=i));if(s){e.splice(c--,1);var d=a();void 0!==d&&(t=d)}}return t}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[o,a,i]}})(),r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(o,a){if(1&a&&(o=this(o)),8&a)return o;if("object"===typeof o&&o){if(4&a&&o.__esModule)return o;if(16&a&&"function"===typeof o.then)return o}var i=Object.create(null);r.r(i);var n={};e=e||[null,t({}),t([]),t(t)];for(var s=2&a&&o;("object"==typeof s||"function"==typeof s)&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach(e=>n[e]=()=>o[e]);return n.default=()=>o,r.d(i,n),i}})(),r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce((t,o)=>(r.f[o](e,t),t),[])),r.u=e=>"static/js/"+e+"."+{8:"1f480892",58:"3c4d0a00",63:"b2a06eaa",95:"84d81158",180:"65d7e2bd",186:"56c31e6a",224:"a3409961",282:"f51e3b00",321:"a2ba7606",372:"86cda217",382:"eefbbdae",436:"48e2baab",451:"c82d5db1",481:"7bfa7773",484:"c74de643",591:"49934bd2",743:"78ea01df",749:"412a1ecd",864:"6bf3343e"}[e]+".chunk.js",r.miniCssF=e=>"static/css/"+e+".4484b679.chunk.css",r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={},t="axiom-loom-catalog:";r.l=(o,a,i,n)=>{if(e[o])e[o].push(a);else{var s,l;if(void 0!==i)for(var d=document.getElementsByTagName("script"),c=0;c<d.length;c++){var p=d[c];if(p.getAttribute("src")==o||p.getAttribute("data-webpack")==t+i){s=p;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,r.nc&&s.setAttribute("nonce",r.nc),s.setAttribute("data-webpack",t+i),s.src=o),e[o]=[a];var m=(t,r)=>{s.onerror=s.onload=null,clearTimeout(h);var a=e[o];if(delete e[o],s.parentNode&&s.parentNode.removeChild(s),a&&a.forEach(e=>e(r)),t)return t(r)},h=setTimeout(m.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=m.bind(null,s.onerror),s.onload=m.bind(null,s.onload),l&&document.head.appendChild(s)}}})(),r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),r.p="/",(()=>{if("undefined"!==typeof document){var e=e=>new Promise((t,o)=>{var a=r.miniCssF(e),i=r.p+a;if(((e,t)=>{for(var r=document.getElementsByTagName("link"),o=0;o<r.length;o++){var a=(n=r[o]).getAttribute("data-href")||n.getAttribute("href");if("stylesheet"===n.rel&&(a===e||a===t))return n}var i=document.getElementsByTagName("style");for(o=0;o<i.length;o++){var n;if((a=(n=i[o]).getAttribute("data-href"))===e||a===t)return n}})(a,i))return t();((e,t,o,a,i)=>{var n=document.createElement("link");n.rel="stylesheet",n.type="text/css",r.nc&&(n.nonce=r.nc),n.onerror=n.onload=r=>{if(n.onerror=n.onload=null,"load"===r.type)a();else{var o=r&&r.type,s=r&&r.target&&r.target.href||t,l=new Error("Loading CSS chunk "+e+" failed.\n("+o+": "+s+")");l.name="ChunkLoadError",l.code="CSS_CHUNK_LOAD_FAILED",l.type=o,l.request=s,n.parentNode&&n.parentNode.removeChild(n),i(l)}},n.href=t,o?o.parentNode.insertBefore(n,o.nextSibling):document.head.appendChild(n)})(e,i,null,t,o)}),t={792:0};r.f.miniCss=(r,o)=>{t[r]?o.push(t[r]):0!==t[r]&&{224:1}[r]&&o.push(t[r]=e(r).then(()=>{t[r]=0},e=>{throw delete t[r],e}))}}})(),(()=>{var e={792:0};r.f.j=(t,o)=>{var a=r.o(e,t)?e[t]:void 0;if(0!==a)if(a)o.push(a[2]);else{var i=new Promise((r,o)=>a=e[t]=[r,o]);o.push(a[2]=i);var n=r.p+r.u(t),s=new Error;r.l(n,o=>{if(r.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var i=o&&("load"===o.type?"missing":o.type),n=o&&o.target&&o.target.src;s.message="Loading chunk "+t+" failed.\n("+i+": "+n+")",s.name="ChunkLoadError",s.type=i,s.request=n,a[1](s)}},"chunk-"+t,t)}},r.O.j=t=>0===e[t];var t=(t,o)=>{var a,i,n=o[0],s=o[1],l=o[2],d=0;if(n.some(t=>0!==e[t])){for(a in s)r.o(s,a)&&(r.m[a]=s[a]);if(l)var c=l(r)}for(t&&t(o);d<n.length;d++)i=n[d],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(c)},o=self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})(),r.nc=void 0;var o=r.O(void 0,[644,96],()=>r(4372));o=r.O(o)})();
//# sourceMappingURL=main.c0dd9ee1.js.map