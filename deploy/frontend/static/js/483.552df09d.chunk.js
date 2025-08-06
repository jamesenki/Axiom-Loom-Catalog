"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[483],{36483:(e,t,o)=>{o.r(t),o.d(t,{default:()=>rt});var r=o(65043),i=o(35475),s=o(5464),n=o(71360),a=o(7365),l=o(687),c=o(20073),d=o(72105),m=o(81990),h=o(70764),p=o(22626);var g=o(50577),x=o(67375),y=o(70579);const u=e=>{let{isOpen:t,onClose:o,onSuccess:i}=e;const[s,n]=(0,r.useState)(""),[a,l]=(0,r.useState)(!1),[c,d]=(0,r.useState)(!1),[m,h]=(0,r.useState)(null),[p,g]=(0,r.useState)("idle"),x="20230011612_EYGS",u=()=>{n(""),h(null),g("idle"),o()},b=async()=>{if(h(null),g("idle"),(e=s)?e.length>100?(h("Repository name must be 100 characters or less"),0):/^[a-zA-Z0-9._-]+$/.test(e)?e.startsWith(".")||e.endsWith(".")?(h("Repository name cannot start or end with a dot"),0):"."!==e&&".."!==e||(h("Invalid repository name"),0):(h("Repository name can only contain letters, numbers, dots, hyphens, and underscores"),0):(h("Repository name is required"),0)){var e;l(!0);try{const e=await(async e=>{try{return(await fetch(`/api/verify-repository/${x}/${e}`)).ok}catch(m){return!1}})(s);e?(g("valid"),h(null)):(g("invalid"),h(`Repository "${s}" not found in ${x} account`))}catch(m){g("invalid"),h("Failed to verify repository. Please try again.")}finally{l(!1)}}else g("invalid")};return t?(0,y.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,y.jsxs)("div",{className:"bg-white rounded-lg shadow-xl w-full max-w-md mx-4",children:[(0,y.jsxs)("div",{className:"px-6 py-4 border-b border-gray-200",children:[(0,y.jsx)("h2",{className:"text-xl font-semibold text-gray-900",children:"Add Repository"}),(0,y.jsxs)("p",{className:"text-sm text-gray-600 mt-1",children:["Add a repository from the ",x," account"]})]}),(0,y.jsx)("div",{className:"px-6 py-4",children:(0,y.jsxs)("div",{className:"space-y-4",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("label",{htmlFor:"repo-name",className:"block text-sm font-medium text-gray-700 mb-1",children:"Repository Name"}),(0,y.jsxs)("div",{className:"relative",children:[(0,y.jsx)("input",{id:"repo-name",type:"text",value:s,onChange:e=>{n(e.target.value),g("idle"),h(null)},onBlur:b,placeholder:"e.g., my-awesome-project",className:`\n                    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2\n                    ${"valid"===p?"border-green-500 focus:ring-green-500":"invalid"===p?"border-red-500 focus:ring-red-500":"border-gray-300 focus:ring-blue-500"}\n                  `,disabled:a||c}),a&&(0,y.jsx)("div",{className:"absolute right-2 top-2",children:(0,y.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"})}),"valid"===p&&(0,y.jsx)("div",{className:"absolute right-2 top-2",children:(0,y.jsx)("svg",{className:"w-5 h-5 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})})})]}),(0,y.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Enter the repository name exactly as it appears on GitHub"})]}),m&&(0,y.jsx)("div",{className:"p-3 bg-red-50 border border-red-200 rounded-md",children:(0,y.jsx)("p",{className:"text-sm text-red-700",children:m})}),"valid"===p&&(0,y.jsx)("div",{className:"p-3 bg-green-50 border border-green-200 rounded-md",children:(0,y.jsx)("p",{className:"text-sm text-green-700",children:"\u2713 Repository found and ready to add"})})]})}),(0,y.jsxs)("div",{className:"px-6 py-4 border-t border-gray-200 flex justify-end space-x-3",children:[(0,y.jsx)("button",{onClick:u,className:"px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",disabled:c,children:"Cancel"}),(0,y.jsx)("button",{onClick:async()=>{if("valid"===p){d(!0),h(null);try{if(!(await fetch("/api/repositories/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,account:x})})).ok)throw new Error("Failed to add repository to configuration");if(!(await fetch(`/api/sync-repository/${s}`,{method:"POST"})).ok)throw new Error("Failed to sync repository");i&&i(s),u()}catch(m){h(m instanceof Error?m.message:"Failed to add repository")}finally{d(!1)}}else await b()},className:`\n              px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2\n              ${"valid"!==p||c?"bg-gray-300 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}\n            `,disabled:"valid"!==p||c,children:c?(0,y.jsxs)("span",{className:"flex items-center",children:[(0,y.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"}),"Adding..."]}):"Add Repository"})]})]})}):null};const b="eyns_repository_cache";class f{constructor(){}static getInstance(){return f.instance||(f.instance=new f),f.instance}getRepositories(){try{const e=localStorage.getItem(b);if(!e)return null;const t=JSON.parse(e);return Date.now()-t.timestamp>36e5?(this.clear(),null):t.repositories}catch(e){return null}}setRepositories(e){try{const t={repositories:e,timestamp:Date.now()};localStorage.setItem(b,JSON.stringify(t))}catch(t){}}clear(){try{localStorage.removeItem(b)}catch(e){}}isValid(){const e=this.getRepositories();return null!==e&&e.length>0}}f.instance=void 0;const $=f.getInstance();var w=o(7118),j=o(34537),v=o(15751);const A=s.i7`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`,k=s.i7`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`,z=s.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.background.primary} 0%, ${e=>e.theme.colors.background.secondary} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  margin-bottom: ${e=>e.theme.spacing[16]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${e=>e.theme.colors.primary.yellow}10 0%, transparent 70%);
    animation: ${k} 15s ease-in-out infinite;
  }
`,R=s.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${e=>e.theme.spacing[6]};
  position: relative;
  z-index: 1;
`,S=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[6]};
  text-align: center;
  animation: ${A} 0.6s ease-out forwards;
  animation-delay: ${e=>e.delay||0}s;
  opacity: 0;
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadows.xl};
    border-color: ${e=>e.theme.colors.primary.yellow};

    .icon-wrapper {
      transform: rotate(360deg);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${e=>e.theme.colors.primary.yellow}, ${e=>e.theme.colors.accent.blue});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  }

  &:hover::before {
    transform: scaleX(1);
  }
`,N=s.Ay.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${e=>e.theme.spacing[4]};
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.yellow}20, ${e=>e.theme.colors.accent.blue}20);
  border-radius: ${e=>e.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${e=>e.theme.animations.duration.slow} ${e=>e.theme.animations.easing.easeOut};

  svg {
    color: ${e=>e.theme.colors.primary.yellow};
  }
`,C=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize["4xl"]};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[2]};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
`,I=(0,s.Ay)(g.EY)`
  color: ${e=>e.theme.colors.text.secondary};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`,P=(0,s.Ay)(g.H2)`
  text-align: center;
  margin-bottom: ${e=>e.theme.spacing[8]};
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -${e=>e.theme.spacing[3]};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${e=>e.theme.colors.primary.yellow};
    border-radius: ${e=>e.theme.borderRadius.full};
  }
`,O=s.Ay.div`
  position: absolute;
  top: ${e=>e.theme.spacing[4]};
  right: ${e=>e.theme.spacing[4]};
  width: 12px;
  height: 12px;
  background: ${e=>e.theme.colors.semantic.success};
  border-radius: ${e=>e.theme.borderRadius.full};
  animation: ${k} 2s ease-in-out infinite;
`,E=()=>{const[e,t]=(0,r.useState)({totalRepositories:0,totalAPIs:0,linesOfCode:0,activeDevelopers:0,totalDocuments:0,lastSyncTime:(new Date).toISOString()}),[o,i]=(0,r.useState)(!0);(0,r.useEffect)(()=>{(async()=>{try{const e=await fetch("/api/repositories");if(e.ok){const o=await e.json();let r=0,i=0;o.forEach(e=>{var t,o;r+=(null===(t=e.metrics)||void 0===t?void 0:t.apiCount)||0,i+=(null===(o=e.metrics)||void 0===o?void 0:o.documentCount)||5}),t({totalRepositories:o.length,totalAPIs:r,linesOfCode:15e3*o.length,activeDevelopers:Math.floor(2.5*o.length),totalDocuments:i,lastSyncTime:(new Date).toISOString()})}}catch(e){}finally{i(!1)}})()},[]);const s=[{icon:(0,y.jsx)(l.A,{size:28}),value:e.totalRepositories,label:"Active Repositories",delay:.1},{icon:(0,y.jsx)(c.A,{size:28}),value:e.totalAPIs,label:"Available APIs",delay:.2},{icon:(0,y.jsx)(d.A,{size:28}),value:e.linesOfCode,label:"Lines of Code",delay:.3,format:!0},{icon:(0,y.jsx)(w.A,{size:28}),value:e.activeDevelopers,label:"Active Developers",delay:.4},{icon:(0,y.jsx)(m.A,{size:28}),value:e.totalDocuments,label:"Documentation Pages",delay:.5},{icon:(0,y.jsx)(j.A,{size:28}),value:99.9,label:"Uptime %",delay:.6,decimals:1}];return o?null:(0,y.jsx)(z,{"data-testid":"statistics-dashboard",children:(0,y.jsxs)(g.mc,{maxWidth:"xl",children:[(0,y.jsx)(P,{children:"Innovation at Scale"}),(0,y.jsx)(R,{children:s.map((e,t)=>(0,y.jsxs)(S,{delay:e.delay,children:[(0,y.jsx)(O,{}),(0,y.jsx)(N,{className:"icon-wrapper",children:e.icon}),(0,y.jsx)(C,{children:(0,y.jsx)(v.Ay,{start:0,end:e.value,duration:2.5,separator:",",decimals:e.decimals||0,delay:e.delay,useEasing:!0,useGrouping:!0,formattingFn:e.format?e=>e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:e.toString():void 0})}),(0,y.jsx)(I,{children:e.label})]},t))})]})})};var D=o(55731),T=o(14319),W=o(75088),Y=o(51861),F=o(33005),H=o(42489),L=o(44919),G=o(21617);const M=s.i7`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`,_=s.i7`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`,q=s.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.background.primary} 0%, ${e=>e.theme.colors.background.secondary} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  position: relative;
  overflow: hidden;
`,B=(0,s.Ay)(g.H2)`
  text-align: center;
  margin-bottom: ${e=>e.theme.spacing[8]};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -${e=>e.theme.spacing[3]};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${e=>e.theme.colors.primary.yellow};
    border-radius: ${e=>e.theme.borderRadius.full};
  }
`,U=s.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${e=>e.theme.spacing[6]};
  margin-bottom: ${e=>e.theme.spacing[12]};
`,V=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[6]};
  position: relative;
  overflow: hidden;
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  animation: ${M} 6s ease-in-out infinite;
  animation-delay: ${e=>({openapi:"0s",graphql:"1s",grpc:"2s",postman:"0.5s"}[e.apiType]||"0s")};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${e=>e.theme.shadows.xl};
    border-color: ${e=>e.theme.colors.primary.yellow};

    .api-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .discover-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${e=>({openapi:G.w.colors.primary.yellow,graphql:G.w.colors.accent.blue,grpc:G.w.colors.semantic.success,postman:G.w.colors.semantic.warning}[e.apiType]||G.w.colors.primary.yellow)};
  }
`,X=s.Ay.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${e=>e.theme.spacing[4]};
  background: ${e=>{const t={openapi:`linear-gradient(135deg, ${e=>e.theme.colors.primary.yellow}20, ${e=>e.theme.colors.primary.yellow}40)`,graphql:`linear-gradient(135deg, ${e=>e.theme.colors.accent.blue}20, ${e=>e.theme.colors.accent.blue}40)`,grpc:`linear-gradient(135deg, ${e=>e.theme.colors.semantic.success}20, ${e=>e.theme.colors.semantic.success}40)`,postman:`linear-gradient(135deg, ${e=>e.theme.colors.semantic.warning}20, ${e=>e.theme.colors.semantic.warning}40)`};return t[e.apiType]||`linear-gradient(135deg, ${e=>e.theme.colors.primary.yellow}20, ${e=>e.theme.colors.primary.yellow}40)`}};
  border-radius: ${e=>e.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};

  svg {
    color: ${e=>({openapi:G.w.colors.primary.yellow,graphql:G.w.colors.accent.blue,grpc:G.w.colors.semantic.success,postman:G.w.colors.semantic.warning}[e.apiType]||G.w.colors.primary.yellow)};
  }
`,J=(0,s.Ay)(g.H3)`
  text-align: center;
  margin-bottom: ${e=>e.theme.spacing[3]};
`,Q=(0,s.Ay)(g.EY)`
  text-align: center;
  color: ${e=>e.theme.colors.text.secondary};
  margin-bottom: ${e=>e.theme.spacing[4]};
  line-height: 1.5;
`,Z=s.Ay.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${e=>e.theme.spacing[4]};
  padding: ${e=>e.theme.spacing[3]} 0;
  border-top: 1px solid ${e=>e.theme.colors.border.light};
`,K=s.Ay.div`
  text-align: center;
`,ee=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize.lg};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.text.primary};
`,te=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`,oe=(0,s.Ay)(g.$n)`
  width: 100%;
  opacity: 0;
  transform: translateY(10px);
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,re=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[8]};
  margin-bottom: ${e=>e.theme.spacing[12]};
  position: relative;
  overflow: hidden;
`,ie=s.Ay.div`
  position: absolute;
  left: ${e=>e.x}%;
  top: ${e=>e.y}%;
  width: ${e=>e.size}px;
  height: ${e=>e.size}px;
  background: ${e=>e.color};
  border-radius: ${e=>e.theme.borderRadius.full};
  border: 2px solid ${e=>e.theme.colors.background.primary};
  box-shadow: ${e=>e.theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    transform: scale(1.2);
    box-shadow: ${e=>e.theme.shadows.lg};
  }

  svg {
    color: ${e=>e.theme.colors.primary.white};
  }
`,se=s.Ay.div`
  position: absolute;
  background: linear-gradient(
    to right,
    ${e=>e.theme.colors.primary.yellow}40,
    transparent 50%,
    ${e=>e.theme.colors.primary.yellow}40
  );
  background-size: 200% 100%;
  animation: ${_} 3s linear infinite;
  height: 2px;
  transform-origin: left center;
  
  left: ${e=>e.x1}%;
  top: ${e=>e.y1}%;
  width: ${e=>Math.sqrt(Math.pow(e.x2-e.x1,2)+Math.pow(e.y2-e.y1,2))}%;
  transform: rotate(${e=>180*Math.atan2(e.y2-e.y1,e.x2-e.x1)/Math.PI}deg);
`,ne=s.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${e=>e.theme.spacing[4]};
  margin-top: ${e=>e.theme.spacing[8]};
`,ae=s.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.background.primary} 0%, ${e=>e.theme.colors.background.secondary} 100%);
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.lg};
  padding: ${e=>e.theme.spacing[4]};
  text-align: center;
`,le=()=>{const[e,t]=(0,r.useState)([]),[o,s]=(0,r.useState)(!0);(0,r.useEffect)(()=>{const e=[{type:"openapi",title:"REST APIs",description:"RESTful services with OpenAPI specifications for seamless integration and documentation",count:24,endpoints:156,status:"active",repositories:["user-service","payment-api","notification-service"]},{type:"graphql",title:"GraphQL APIs",description:"Flexible query language APIs enabling efficient data fetching and real-time subscriptions",count:8,endpoints:42,status:"active",repositories:["analytics-gql","content-api"]},{type:"grpc",title:"gRPC Services",description:"High-performance RPC framework for microservices communication and streaming",count:12,endpoints:78,status:"active",repositories:["auth-service","data-processor"]},{type:"postman",title:"Postman Collections",description:"Ready-to-use API collections for testing, documentation, and team collaboration",count:18,endpoints:94,status:"active",repositories:["api-tests","integration-suite"]}];setTimeout(()=>{t(e),s(!1)},1e3)},[]);return o?null:(0,y.jsx)(q,{children:(0,y.jsxs)(g.mc,{maxWidth:"xl",children:[(0,y.jsx)(B,{children:"API Discovery Center"}),(0,y.jsx)(U,{children:e.map(e=>{return(0,y.jsxs)(V,{apiType:e.type,children:[(0,y.jsx)(X,{className:"api-icon",apiType:e.type,children:(o=e.type,{openapi:(0,y.jsx)(c.A,{size:32}),graphql:(0,y.jsx)(d.A,{size:32}),grpc:(0,y.jsx)(a.A,{size:32}),postman:(0,y.jsx)(m.A,{size:32})}[o]||(0,y.jsx)(D.A,{size:32}))}),(0,y.jsx)(J,{children:e.title}),(0,y.jsx)(Q,{children:e.description}),(0,y.jsxs)(Z,{children:[(0,y.jsxs)(K,{children:[(0,y.jsx)(ee,{children:e.count}),(0,y.jsx)(te,{children:"APIs"})]}),(0,y.jsxs)(K,{children:[(0,y.jsx)(ee,{children:e.endpoints}),(0,y.jsx)(te,{children:"Endpoints"})]}),(0,y.jsx)(K,{children:(0,y.jsxs)(g.so,{align:"center",justify:"center",gap:1,children:[(t=e.status,{active:(0,y.jsx)(T.A,{size:16,color:G.w.colors.semantic.success}),maintenance:(0,y.jsx)(W.A,{size:16,color:G.w.colors.semantic.warning}),deprecated:(0,y.jsx)(Y.A,{size:16,color:G.w.colors.semantic.error})}[t]||(0,y.jsx)(T.A,{size:16})),(0,y.jsx)("span",{style:{fontSize:G.w.typography.fontSize.xs,textTransform:"capitalize"},children:e.status})]})})]}),(0,y.jsxs)(oe,{className:"discover-btn",variant:"primary",size:"sm",as:i.N_,to:`/api-explorer/all?type=${e.type}`,children:["Explore ",e.title]})]},e.type);var t,o})}),(0,y.jsxs)(re,{children:[(0,y.jsx)(g.H3,{style:{textAlign:"center",marginBottom:G.w.spacing[6]},children:"API Network Topology"}),(0,y.jsx)(ie,{x:20,y:30,size:60,color:G.w.colors.primary.yellow,children:(0,y.jsx)(D.A,{size:24})}),(0,y.jsx)(ie,{x:80,y:25,size:50,color:G.w.colors.accent.blue,children:(0,y.jsx)(F.A,{size:20})}),(0,y.jsx)(ie,{x:50,y:60,size:55,color:G.w.colors.semantic.success,children:(0,y.jsx)(H.A,{size:22})}),(0,y.jsx)(ie,{x:25,y:75,size:45,color:G.w.colors.semantic.warning,children:(0,y.jsx)(w.A,{size:18})}),(0,y.jsx)(ie,{x:75,y:70,size:50,color:G.w.colors.semantic.info,children:(0,y.jsx)(L.A,{size:20})}),(0,y.jsx)(se,{x1:20,y1:30,x2:80,y2:25}),(0,y.jsx)(se,{x1:20,y1:30,x2:50,y2:60}),(0,y.jsx)(se,{x1:80,y1:25,x2:75,y2:70}),(0,y.jsx)(se,{x1:50,y1:60,x2:25,y2:75}),(0,y.jsx)(se,{x1:50,y1:60,x2:75,y2:70}),(0,y.jsxs)(ne,{children:[(0,y.jsxs)(ae,{children:[(0,y.jsx)(g.H3,{children:"Total Requests"}),(0,y.jsx)("div",{style:{fontSize:"2rem",fontWeight:"bold",color:G.w.colors.primary.yellow},children:"2.4M"}),(0,y.jsx)(g.EY,{color:"secondary",children:"This month"})]}),(0,y.jsxs)(ae,{children:[(0,y.jsx)(g.H3,{children:"Response Time"}),(0,y.jsx)("div",{style:{fontSize:"2rem",fontWeight:"bold",color:G.w.colors.semantic.success},children:"127ms"}),(0,y.jsx)(g.EY,{color:"secondary",children:"Average"})]}),(0,y.jsxs)(ae,{children:[(0,y.jsx)(g.H3,{children:"Success Rate"}),(0,y.jsx)("div",{style:{fontSize:"2rem",fontWeight:"bold",color:G.w.colors.semantic.info},children:"99.7%"}),(0,y.jsx)(g.EY,{color:"secondary",children:"Uptime"})]}),(0,y.jsxs)(ae,{children:[(0,y.jsx)(g.H3,{children:"Active Consumers"}),(0,y.jsx)("div",{style:{fontSize:"2rem",fontWeight:"bold",color:G.w.colors.accent.blue},children:"156"}),(0,y.jsx)(g.EY,{color:"secondary",children:"Applications"})]})]})]})]})})},ce=s.i7`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`,de=s.Ay.div`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"20px"};
  border-radius: ${e=>e.borderRadius||G.w.borderRadius.md};
  margin-bottom: ${e=>e.marginBottom||"0"};
  background: linear-gradient(
    90deg,
    ${e=>e.theme.colors.background.secondary} 0%,
    ${e=>e.theme.colors.background.tertiary} 50%,
    ${e=>e.theme.colors.background.secondary} 100%
  );
  background-size: 1000px 100%;
  animation: ${ce} 1.5s ease-in-out infinite;
`,me=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.lg};
  padding: ${e=>e.theme.spacing[6]};
  animation: ${ce} 1.5s ease-in-out infinite;
`,he=s.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${e=>e.theme.spacing[4]};
`,pe=s.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[4]};
`,ge=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  flex-wrap: wrap;
`,xe=e=>{let{lines:t=1,width:o="100%",lastLineWidth:r="80%"}=e;return(0,y.jsx)(y.Fragment,{children:Array.from({length:t}).map((e,i)=>(0,y.jsx)(de,{width:i===t-1?r:o,height:"16px",marginBottom:G.w.spacing[2]},i))})},ye=e=>{let{width:t="60%"}=e;return(0,y.jsx)(de,{width:t,height:"28px",marginBottom:G.w.spacing[2]})},ue=e=>{let{width:t="100px"}=e;return(0,y.jsx)(de,{width:t,height:"36px",borderRadius:G.w.borderRadius.md})},be=()=>(0,y.jsx)(de,{width:"80px",height:"24px",borderRadius:G.w.borderRadius.full}),fe=()=>(0,y.jsxs)(me,{children:[(0,y.jsxs)(he,{children:[(0,y.jsx)(ye,{width:"70%"}),(0,y.jsx)(be,{})]}),(0,y.jsxs)(pe,{children:[(0,y.jsx)(xe,{lines:3,lastLineWidth:"90%"}),(0,y.jsxs)("div",{style:{display:"flex",gap:G.w.spacing[6],marginTop:G.w.spacing[4]},children:[(0,y.jsx)(de,{width:"80px",height:"16px"}),(0,y.jsx)(de,{width:"100px",height:"16px"}),(0,y.jsx)(de,{width:"120px",height:"16px"})]})]}),(0,y.jsxs)(ge,{children:[(0,y.jsx)(ue,{width:"90px"}),(0,y.jsx)(ue,{width:"80px"}),(0,y.jsx)(ue,{width:"85px"})]})]}),$e=e=>{let{count:t=6,columns:o=3,component:r}=e;return(0,y.jsx)("div",{style:{display:"grid",gridTemplateColumns:`repeat(auto-fill, minmax(${2===o?"450px":"350px"}, 1fr))`,gap:G.w.spacing[6]},children:Array.from({length:t}).map((e,t)=>(0,y.jsx)("div",{children:r},t))})};var we=o(20595);const je=s.i7`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`,ve=s.i7`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
`,Ae=(0,s.Ay)(we.Zp)`
  position: relative;
  overflow: hidden;
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  
  ${e=>e.featured&&s.AH`
    background: linear-gradient(135deg, ${e.theme.colors.background.primary} 0%, ${e.theme.colors.background.secondary} 100%);
    border: 2px solid ${e.theme.colors.primary.yellow};
    
    &::before {
      content: 'Featured';
      position: absolute;
      top: -5px;
      right: 20px;
      background: ${e.theme.colors.primary.yellow};
      color: ${e.theme.colors.primary.black};
      padding: ${e.theme.spacing[1]} ${e.theme.spacing[3]};
      font-size: ${e.theme.typography.fontSize.xs};
      font-weight: ${e.theme.typography.fontWeight.bold};
      text-transform: uppercase;
      border-radius: 0 0 ${e.theme.borderRadius.md} ${e.theme.borderRadius.md};
      box-shadow: ${e.theme.shadows.md};
    }
  `}
  
  ${e=>e.isNew&&s.AH`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, 
        transparent, 
        ${e.theme.colors.primary.yellow}, 
        transparent
      );
      background-size: 200% 100%;
      animation: ${je} 2s linear infinite;
    }
  `}
  
  ${e=>e.hasUpdate&&s.AH`
    animation: ${ve} 2s infinite;
  `}

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: ${e=>e.theme.shadows.xl};
    border-color: ${e=>e.theme.colors.primary.yellow};
    
    .card-icon {
      transform: rotate(360deg);
    }
    
    .action-buttons {
      opacity: 1;
      transform: translateY(0);
    }
    
    .hover-overlay {
      opacity: 1;
    }
  }
`,ke=s.Ay.div`
  width: 48px;
  height: 48px;
  border-radius: ${e=>e.theme.borderRadius.lg};
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.yellow}20, ${e=>e.theme.colors.accent.blue}20);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${e=>e.theme.spacing[3]};
  transition: transform ${e=>e.theme.animations.duration.slow} ${e=>e.theme.animations.easing.easeOut};
  
  svg {
    color: ${e=>e.theme.colors.primary.yellow};
  }
`,ze=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing[3]};
`,Re=s.Ay.span`
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.full};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[1]};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};
  
  ${e=>{switch(e.variant){case"primary":return`\n          background: ${e=>e.theme.colors.primary.yellow}20;\n          color: ${e=>e.theme.colors.primary.yellow};\n          border: 1px solid ${e=>e.theme.colors.primary.yellow}40;\n        `;case"secondary":return`\n          background: ${e=>e.theme.colors.accent.blue}20;\n          color: ${e=>e.theme.colors.accent.blue};\n          border: 1px solid ${e=>e.theme.colors.accent.blue}40;\n        `;case"success":return`\n          background: ${e=>e.theme.colors.semantic.success}20;\n          color: ${e=>e.theme.colors.semantic.success};\n          border: 1px solid ${e=>e.theme.colors.semantic.success}40;\n        `;case"warning":return`\n          background: ${e=>e.theme.colors.semantic.warning}20;\n          color: ${e=>e.theme.colors.semantic.warning};\n          border: 1px solid ${e=>e.theme.colors.semantic.warning}40;\n        `;case"info":return`\n          background: ${e=>e.theme.colors.semantic.info}20;\n          color: ${e=>e.theme.colors.semantic.info};\n          border: 1px solid ${e=>e.theme.colors.semantic.info}40;\n        `;default:return`\n          background: ${e=>e.theme.colors.background.secondary};\n          color: ${e=>e.theme.colors.text.secondary};\n          border: 1px solid ${e=>e.theme.colors.border.light};\n        `}}}
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${e=>e.theme.shadows.sm};
  }
`,Se=s.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${e=>e.theme.spacing[3]};
  padding: ${e=>e.theme.spacing[3]} 0;
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  margin-top: ${e=>e.theme.spacing[3]};
`,Ne=s.Ay.div`
  text-align: center;
`,Ce=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize.xl};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[1]};
`,Ie=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`,Pe=(s.Ay.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    ${e=>e.theme.colors.background.overlay} 100%
  );
  opacity: 0;
  transition: opacity ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  pointer-events: none;
`,s.Ay.div`
  position: absolute;
  bottom: ${e=>e.theme.spacing[4]};
  left: ${e=>e.theme.spacing[4]};
  right: ${e=>e.theme.spacing[4]};
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  opacity: 0;
  transform: translateY(10px);
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,s.Ay.div`
  position: absolute;
  top: ${e=>e.theme.spacing[3]};
  left: ${e=>e.theme.spacing[3]};
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[2]};
  background: ${e=>({"AI/ML":G.w.colors.semantic.info,API:G.w.colors.primary.yellow,Frontend:G.w.colors.accent.blue,Backend:G.w.colors.semantic.success,Database:G.w.colors.semantic.warning,DevOps:G.w.colors.secondary.darkGray}[e.category]||G.w.colors.text.secondary)}20;
  color: ${e=>({"AI/ML":G.w.colors.semantic.info,API:G.w.colors.primary.yellow,Frontend:G.w.colors.accent.blue,Backend:G.w.colors.semantic.success,Database:G.w.colors.semantic.warning,DevOps:G.w.colors.secondary.darkGray}[e.category]||G.w.colors.text.secondary)};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`),Oe=(s.Ay.div`
  width: 100%;
  height: 4px;
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${e=>e.theme.spacing[2]};
  
  &::after {
    content: '';
    display: block;
    width: ${e=>e.progress}%;
    height: 100%;
    background: ${e=>e.color||G.w.colors.primary.yellow};
    border-radius: ${e=>e.theme.borderRadius.full};
    transition: width ${e=>e.theme.animations.duration.slow} ${e=>e.theme.animations.easing.easeOut};
  }
`,s.Ay.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[1]};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.isLive?G.w.colors.semantic.success:G.w.colors.text.secondary};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: ${e=>e.theme.borderRadius.full};
    background: ${e=>e.isLive?G.w.colors.semantic.success:G.w.colors.text.secondary};
    animation: ${e=>e.isLive?ve:"none"} 2s infinite;
  }
`);var Ee=o(94965),De=o(39292),Te=o(81885),We=o(56099),Ye=o(91720),Fe=o(50516),He=o(75969),Le=o(40230);const Ge=s.i7`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`,Me=s.i7`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`,_e=s.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${e=>e.theme.spacing[16]} ${e=>e.theme.spacing[8]};
  text-align: center;
  min-height: 400px;
  position: relative;
`,qe=s.Ay.div`
  width: 120px;
  height: 120px;
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: ${e=>{const t={"no-data":`linear-gradient(135deg, ${e=>e.theme.colors.text.secondary}20 0%, ${e=>e.theme.colors.text.secondary}10 100%)`,"no-results":`linear-gradient(135deg, ${e=>e.theme.colors.semantic.warning}20 0%, ${e=>e.theme.colors.semantic.warning}10 100%)`,error:`linear-gradient(135deg, ${e=>e.theme.colors.semantic.error}20 0%, ${e=>e.theme.colors.semantic.error}10 100%)`,offline:`linear-gradient(135deg, ${e=>e.theme.colors.text.secondary}20 0%, ${e=>e.theme.colors.text.secondary}10 100%)`,success:`linear-gradient(135deg, ${e=>e.theme.colors.semantic.success}20 0%, ${e=>e.theme.colors.semantic.success}10 100%)`};return t[e.variant||"no-data"]||t["no-data"]}};
  border-radius: ${e=>e.theme.borderRadius["2xl"]};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${Ge} 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${e=>e.theme.colors.primary.yellow}10 0%, transparent 50%);
    animation: ${Me} 4s ease-in-out infinite;
  }

  svg {
    color: ${e=>{const t={"no-data":G.w.colors.text.secondary,"no-results":G.w.colors.semantic.warning,error:G.w.colors.semantic.error,offline:G.w.colors.text.secondary,success:G.w.colors.semantic.success};return t[e.variant||"no-data"]||t["no-data"]}};
    position: relative;
    z-index: 1;
  }
`,Be=(0,s.Ay)(Le.H2)`
  margin-bottom: ${e=>e.theme.spacing[4]};
  color: ${e=>e.theme.colors.text.primary};
`,Ue=(0,s.Ay)(Le.EY)`
  margin-bottom: ${e=>e.theme.spacing[8]};
  color: ${e=>e.theme.colors.text.secondary};
  max-width: 500px;
  line-height: 1.6;
`,Ve=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[3]};
  flex-wrap: wrap;
  justify-content: center;
`,Xe=s.Ay.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: ${e=>e.theme.borderRadius.full};
  background: ${e=>e.theme.colors.primary.yellow}10;
  top: ${e=>e.top||"auto"};
  left: ${e=>e.left||"auto"};
  right: ${e=>e.right||"auto"};
  bottom: ${e=>e.bottom||"auto"};
  animation: ${Ge} 8s ease-in-out infinite;
  animation-delay: ${e=>e.delay||"0s"};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${e=>e.theme.colors.primary.yellow}40;
  }
`,Je=e=>{let{variant:t="no-data",title:o,description:r,primaryAction:i,secondaryAction:s,customIcon:a}=e;return(0,y.jsxs)(_e,{children:[(0,y.jsx)(Xe,{top:"10%",left:"10%",delay:"0s",children:(0,y.jsx)(We.A,{size:20})}),(0,y.jsx)(Xe,{top:"20%",right:"15%",delay:"2s",children:(0,y.jsx)(Ye.A,{size:20})}),(0,y.jsx)(Xe,{bottom:"15%",left:"20%",delay:"4s",children:(0,y.jsx)(n.A,{size:20})}),(0,y.jsx)(Xe,{bottom:"25%",right:"10%",delay:"6s",children:(0,y.jsx)(Fe.A,{size:20})}),(0,y.jsx)(qe,{variant:t,children:a||(e=>{const t={"no-data":(0,y.jsx)(Ee.A,{size:48}),"no-results":(0,y.jsx)(De.A,{size:48}),error:(0,y.jsx)(Y.A,{size:48}),offline:(0,y.jsx)(Te.A,{size:48}),success:(0,y.jsx)(We.A,{size:48})};return t[e]||t["no-data"]})(t)}),(0,y.jsx)(Be,{children:o}),(0,y.jsx)(Ue,{children:r}),(i||s)&&(0,y.jsxs)(Ve,{children:[i&&(0,y.jsxs)(He.$,{variant:"primary",onClick:i.onClick,children:[i.icon,i.label]}),s&&(0,y.jsxs)(He.$,{variant:"outline",onClick:s.onClick,children:[s.icon,s.label]})]})]})},Qe=e=>{let{onAddRepository:t}=e;return(0,y.jsx)(Je,{variant:"no-data",title:"No Repositories Found",description:"Get started by adding your first repository to the experience center. You can sync from GitHub, GitLab, or add them manually.",primaryAction:{label:"Add Repository",onClick:t,icon:(0,y.jsx)(n.A,{size:16})}})},Ze=e=>{let{title:t="Something went wrong",description:o="We encountered an unexpected error. Please try again or return to the home page.",onRetry:r,onGoHome:i}=e;return(0,y.jsx)(Je,{variant:"error",title:t,description:o,primaryAction:{label:"Try Again",onClick:r,icon:(0,y.jsx)(Fe.A,{size:16})},secondaryAction:{label:"Go Home",onClick:i,icon:(0,y.jsx)(Ee.A,{size:16})}})},Ke=(0,s.Ay)(g.wn)`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  color: ${e=>e.theme.colors.primary.white};
  text-align: center;
  padding: ${e=>e.theme.spacing[16]} 0;
  margin-bottom: ${e=>e.theme.spacing[12]};
`,et=(0,s.Ay)(g.H1)`
  color: ${e=>e.theme.colors.primary.white};
  margin-bottom: ${e=>e.theme.spacing[6]};
  
  .highlight {
    color: ${e=>e.theme.colors.primary.yellow};
  }
`,tt=(0,s.Ay)(g.hj)`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${e=>e.theme.spacing[8]};
`,ot=(0,s.Ay)(g.so)`
  gap: ${e=>e.theme.spacing[4]};
  justify-content: center;
`,rt=(s.Ay.span.withConfig({shouldForwardProp:e=>"status"!==e})`
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.full};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  background-color: ${e=>e.theme.colors.semantic.success};
  color: ${e=>e.theme.colors.primary.white};
`,()=>{const[e,t]=(0,r.useState)([]),[o,b]=(0,r.useState)(!0),[f,w]=(0,r.useState)(null),[j,v]=(0,r.useState)(!1),{syncVersion:A}=(0,x.g)(),k=(0,s.DP)();(0,r.useEffect)(()=>{(async()=>{try{const e=$.getRepositories();e&&e.length>0&&(t(e),b(!1));const o=await fetch("/api/repositories");if(!o.ok)throw new Error("Failed to fetch repositories");const r=await o.json();$.setRepositories(r),t(r)}catch(o){0!==e.length||$.isValid()||w(o instanceof Error?o.message:"Unknown error")}finally{b(!1)}})()},[A]);return f?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(Ke,{children:(0,y.jsxs)(g.mc,{maxWidth:"lg",children:[(0,y.jsxs)(et,{children:[(0,y.jsx)("span",{className:"highlight",children:"EYNS"})," AI Experience Center"]}),(0,y.jsx)(tt,{children:"Developer Portal - Repositories, APIs, Documentation & More"})]})}),(0,y.jsx)(g.mc,{maxWidth:"lg",children:(0,y.jsx)(Ze,{title:"Error Loading Repositories",description:f,onRetry:()=>window.location.reload(),onGoHome:()=>window.location.href="/"})})]}):(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(Ke,{children:(0,y.jsxs)(g.mc,{maxWidth:"lg",children:[(0,y.jsxs)(et,{children:[(0,y.jsx)("span",{className:"highlight",children:"EYNS"})," AI Experience Center"]}),(0,y.jsx)(tt,{children:"Developer Portal - Repositories, APIs, Documentation & More"}),(0,y.jsxs)(ot,{children:[(0,y.jsxs)(g.$n,{size:"lg",onClick:()=>v(!0),"data-action":"add-repository",children:[(0,y.jsx)(n.A,{size:20}),"Add Repository"]}),(0,y.jsxs)(g.$n,{as:i.N_,to:"/sync",variant:"outline",size:"lg",children:[(0,y.jsx)(a.A,{size:20}),"Repository Sync"]})]})]})}),(0,y.jsx)(E,{}),(0,y.jsx)(le,{}),(0,y.jsx)(g.mc,{maxWidth:"2xl",children:(0,y.jsx)(g.wn,{spacing:"large",children:o?(0,y.jsx)($e,{count:6,columns:3,component:(0,y.jsx)(fe,{})}):0===e.length?(0,y.jsx)(Qe,{onAddRepository:()=>v(!0)}):(0,y.jsx)(g.pV,{children:e.map((e,t)=>{var o,r,s,n;const x=new Date(e.metrics.lastUpdated)>new Date(Date.now()-6048e5),u=t<2,b="active"===e.status;return(0,y.jsxs)(Ae,{isNew:x,featured:u,"data-testid":"repository-card",children:[(0,y.jsx)(Pe,{category:e.category}),(0,y.jsx)(g.aR,{children:(0,y.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:k.spacing[3]},children:[(0,y.jsx)(ke,{className:"card-icon",children:(0,y.jsx)(l.A,{size:24})}),(0,y.jsxs)("div",{children:[(0,y.jsx)(g.ZB,{children:e.displayName}),(0,y.jsx)(Oe,{isLive:b,children:b?"Live":"Offline"})]})]})}),(0,y.jsxs)(g.Wu,{children:[(0,y.jsx)(g.BT,{style:{fontWeight:k.typography.fontWeight.medium,color:k.colors.primary.black,marginBottom:k.spacing[4],lineHeight:1.5},children:e.marketingDescription||e.description||"No description available."}),(0,y.jsxs)(ze,{children:[(null===(o=e.apiTypes)||void 0===o?void 0:o.hasOpenAPI)&&(0,y.jsxs)(Re,{variant:"primary",children:[(0,y.jsx)(c.A,{size:12}),"OpenAPI"]}),(null===(r=e.apiTypes)||void 0===r?void 0:r.hasGraphQL)&&(0,y.jsxs)(Re,{variant:"secondary",children:[(0,y.jsx)(d.A,{size:12}),"GraphQL"]}),(null===(s=e.apiTypes)||void 0===s?void 0:s.hasPostman)&&(0,y.jsxs)(Re,{variant:"info",children:[(0,y.jsx)(m.A,{size:12}),"Postman"]}),(null===(n=e.apiTypes)||void 0===n?void 0:n.hasGrpc)&&(0,y.jsxs)(Re,{variant:"success",children:[(0,y.jsx)(a.A,{size:12}),"gRPC"]})]}),(0,y.jsxs)(Se,{children:[(0,y.jsxs)(Ne,{children:[(0,y.jsx)(Ce,{children:e.metrics.apiCount}),(0,y.jsx)(Ie,{children:"APIs"})]}),(0,y.jsxs)(Ne,{children:[(0,y.jsx)(Ce,{children:e.metrics.postmanCollections||0}),(0,y.jsx)(Ie,{children:"Collections"})]}),(0,y.jsxs)(Ne,{children:[(0,y.jsxs)(Ce,{children:[Math.floor(100*Math.random()),"%"]}),(0,y.jsx)(Ie,{children:"Coverage"})]})]})]}),(0,y.jsx)(g.wL,{children:(0,y.jsxs)(g.so,{gap:2,wrap:!0,className:"action-buttons",children:[(0,y.jsxs)(g.$n,{as:i.N_,to:`/repository/${e.name}`,variant:"primary",size:"sm",children:[(0,y.jsx)(h.A,{size:16}),"Explore"]}),(0,y.jsxs)(g.$n,{as:i.N_,to:`/docs/${e.name}`,variant:"secondary",size:"sm",children:[(0,y.jsx)(p.A,{size:16}),"Docs"]}),e.metrics.apiCount>0&&(0,y.jsxs)(g.$n,{as:i.N_,to:`/api-explorer/${e.name}`,variant:"outline",size:"sm",children:[(0,y.jsx)(c.A,{size:16}),"APIs"]})]})})]},e.id)})})})}),(0,y.jsx)(u,{isOpen:j,onClose:()=>v(!1),onSuccess:e=>{(async()=>{try{const e=await fetch("/api/repositories");if(!e.ok)throw new Error("Failed to fetch repositories");const o=await e.json();t(o)}catch(e){}})()}})]})})}}]);
//# sourceMappingURL=483.552df09d.chunk.js.map