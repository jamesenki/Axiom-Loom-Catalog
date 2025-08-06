"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[593],{86593:(e,r,o)=>{o.r(r),o.d(r,{default:()=>_});var t=o(65043),n=o(73216),i=o(35475),a=o(5464),s=o(65469),l=o(33005),c=o(72105),h=o(7104),d=o(35087),p=o(64830),m=o(21617),y=o(50577),g=o(70579);const u=a.Ay.div`
  display: flex;
  height: 100vh;
  background: ${e=>e.theme.colors.background.primary};
`,x=a.Ay.div`
  width: 320px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  padding: ${e=>e.theme.spacing[6]};
  overflow-y: auto;
`,$=a.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${e=>e.theme.colors.background.primary};
`,f=a.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`,b=a.Ay.div`
  flex: 1;
  display: flex;
`,w=a.Ay.div`
  flex: 1;
  padding: ${e=>e.theme.spacing[4]};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
`,v=a.Ay.div`
  flex: 1;
  padding: ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.secondary};
`,j=(0,a.Ay)(y.$n)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.yellow};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,k=a.Ay.h2`
  font-size: ${e=>e.theme.typography.fontSize.xl};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  margin: 0 0 ${e=>e.theme.spacing[4]} 0;
  color: ${e=>e.theme.colors.text.primary};
`,A=a.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${e=>e.active?m.w.colors.primary.yellow:m.w.colors.background.primary};
  color: ${e=>e.active?m.w.colors.primary.black:m.w.colors.text.primary};
  border: 1px solid ${e=>e.active?m.w.colors.primary.yellow:m.w.colors.border.light};
  overflow: hidden;
  
  &:hover {
    background: ${e=>e.active?m.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
    border-color: ${e=>e.theme.colors.primary.yellow};
    transform: translateX(2px);
  }
`,S=a.Ay.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  margin-bottom: ${e=>e.theme.spacing[2]};
`,Q=a.Ay.h3`
  font-size: ${e=>e.theme.typography.fontSize.base};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,z=a.Ay.p`
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
  margin: 0;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,L=a.Ay.textarea`
  width: 100%;
  height: 400px;
  padding: ${e=>e.theme.spacing[4]};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  background: ${e=>e.theme.colors.background.primary};
  color: ${e=>e.theme.colors.text.primary};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,q=a.Ay.pre`
  width: 100%;
  height: 400px;
  padding: ${e=>e.theme.spacing[4]};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  background: ${e=>e.theme.colors.background.primary};
  color: ${e=>e.theme.colors.text.primary};
  overflow: auto;
  white-space: pre-wrap;
`,C=a.Ay.div`
  max-height: 300px;
  overflow-y: auto;
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  padding: ${e=>e.theme.spacing[4]};
  margin-top: ${e=>e.theme.spacing[4]};
`,G=a.Ay.pre`
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.primary};
  white-space: pre-wrap;
  margin: 0;
`,E=a.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[3]};
  margin: ${e=>e.theme.spacing[4]} 0;
`,R=(0,a.Ay)(y.$n)`
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.black};
    color: ${e=>e.theme.colors.primary.yellow};
  }
`,F=e=>{const r=e.replace(/\.(graphql|gql)$/i,"").replace(/[-_]/g," ").replace(/api/gi,"API").replace(/graphql/gi,"GraphQL").replace(/schema/gi,"Schema").replace(/\b(\w)/g,e=>e.toUpperCase());return r.length>30?r.substring(0,27)+"...":r},_=()=>{const{repoName:e}=(0,n.g)(),[r,o]=(0,t.useState)([]),[a,_]=(0,t.useState)(null),[N,H]=(0,t.useState)(""),[I,W]=(0,t.useState)("# Welcome to GraphQL Playground\n# Write your query here:\n\nquery {\n  # Your GraphQL query\n}"),[U,B]=(0,t.useState)("# Query results will appear here"),[P,T]=(0,t.useState)(!0),[Y,J]=(0,t.useState)(null);(0,t.useEffect)(()=>{O()},[e]);const O=async()=>{try{const r=await fetch(`/api/repository/${e}/graphql-schemas`);if(!r.ok)throw new Error("Failed to fetch GraphQL schemas");const t=await r.json();o(t),t.length>0&&D(t[0])}catch(r){J(r instanceof Error?r.message:"Unknown error")}finally{T(!1)}},D=async r=>{_(r);try{const o=await fetch(`/api/repository/${e}/file?path=${encodeURIComponent(r.path)}`);if(!o.ok)throw new Error("Failed to load schema");const t=await o.text();if(H(t),t.includes("type Query")){const e=t.match(/type Query\s*{([^}]*)}/);if(e){const o=e[1].split("\n").map(e=>e.trim()).filter(e=>e&&!e.startsWith("#")).slice(0,3);if(o.length>0){const e=`# Sample query for ${r.name}\nquery {\n${o.map(e=>{var r;return`  ${null===(r=e.split(":")[0])||void 0===r?void 0:r.trim()}`}).join("\n")}\n}`;W(e)}}}}catch(o){H("Error loading schema content")}};return P?(0,g.jsx)(y.Hh,{text:"Loading GraphQL schemas..."}):Y||0===r.length?(0,g.jsx)(y.mc,{maxWidth:"lg",children:(0,g.jsxs)(y.wn,{children:[(0,g.jsx)(y.H1,{color:"secondary",children:"\ud83c\udfae No GraphQL Schemas Found"}),(0,g.jsx)(y.EY,{color:"secondary",children:Y||"This repository does not have any GraphQL schemas."}),(0,g.jsx)(y.$n,{as:i.N_,to:"/",children:"Return to Home"})]})}):(0,g.jsxs)(u,{children:[(0,g.jsxs)(x,{children:[(0,g.jsxs)(j,{as:i.N_,to:`/repository/${e}`,children:[(0,g.jsx)(s.A,{size:20}),"Back to Repository"]}),(0,g.jsxs)(k,{children:["Schemas (",r.length,")"]}),r.map((e,r)=>(0,g.jsxs)(A,{active:(null===a||void 0===a?void 0:a.path)===e.path,onClick:()=>D(e),children:[(0,g.jsxs)(S,{children:[(0,g.jsx)(l.A,{size:20}),(0,g.jsx)(Q,{title:e.name,children:F(e.name)})]}),(0,g.jsx)(z,{title:e.path,children:e.path})]},r)),a&&N&&(0,g.jsxs)(C,{children:[(0,g.jsx)(y.EY,{weight:"semibold",style:{marginBottom:m.w.spacing[2]},children:"Schema Preview:"}),(0,g.jsxs)(G,{children:[N.substring(0,500),"..."]})]})]}),(0,g.jsxs)($,{children:[(0,g.jsxs)(f,{children:[(0,g.jsxs)("div",{children:[(0,g.jsxs)(y.H2,{style:{margin:0,display:"flex",alignItems:"center",gap:m.w.spacing[2]},children:[(0,g.jsx)(c.A,{size:24}),"GraphQL Playground"]}),a&&(0,g.jsx)(y.EY,{color:"secondary",style:{marginTop:m.w.spacing[1]},title:a.name,children:F(a.name)})]}),(0,g.jsxs)("div",{style:{display:"flex",gap:m.w.spacing[3]},children:[(0,g.jsxs)(y.$n,{variant:"outline",as:"a",href:a?`/api/repository/${e}/file?path=${encodeURIComponent(a.path)}&download=true`:"#",download:!0,children:[(0,g.jsx)(h.A,{size:20}),"Download Schema"]}),(0,g.jsxs)(y.$n,{variant:"outline",onClick:()=>{const e=JSON.stringify(JSON.parse(JSON.stringify(N)),null,2);B(`# Formatted Schema:\n\n${e}`)},children:[(0,g.jsx)(d.A,{size:20}),"View Full Schema"]})]})]}),(0,g.jsxs)(b,{children:[(0,g.jsxs)(w,{children:[(0,g.jsx)(y.H2,{style:{marginBottom:m.w.spacing[4]},children:"Query Editor"}),(0,g.jsx)(L,{value:I,onChange:e=>W(e.target.value),placeholder:"Enter your GraphQL query here..."}),(0,g.jsxs)(E,{children:[(0,g.jsxs)(R,{onClick:()=>{B(`# Query execution simulation\n# In a real implementation, this would connect to your GraphQL endpoint\n\n# Query:\n${I}\n\n# Simulated Response:\n{\n  "data": {\n    "message": "This is a simulated response. In production, this would execute against your GraphQL endpoint.",\n    "schema": "${null===a||void 0===a?void 0:a.name}",\n    "status": "success"\n  }\n}\n\n# Note: To run actual queries, connect this playground to your GraphQL endpoint\n# at runtime by configuring the GraphQL server URL in your environment.`)},children:[(0,g.jsx)(p.A,{size:20}),"Execute Query"]}),(0,g.jsx)(y.$n,{variant:"outline",onClick:()=>W("# Clear query\nquery {\n  \n}"),children:"Clear"}),(0,g.jsx)(y.$n,{variant:"outline",onClick:()=>{const e=I.split("\n").map(e=>`  ${e}`).join("\n");W(`{\n${e}\n}`)},children:"Format"})]})]}),(0,g.jsxs)(v,{children:[(0,g.jsx)(y.H2,{style:{marginBottom:m.w.spacing[4]},children:"Results"}),(0,g.jsx)(q,{children:U})]})]})]})]})}}}]);
//# sourceMappingURL=593.22289580.chunk.js.map