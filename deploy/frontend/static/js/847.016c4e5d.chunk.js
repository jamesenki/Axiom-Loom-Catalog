"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[847],{61847:(e,r,o)=>{o.r(r),o.d(r,{default:()=>q});var t=o(65043),n=o(73216),s=o(35475),i=o(5464),a=o(23440),l=(o(2795),o(65469)),c=o(87978),d=o(88693),h=o(7365),p=o(21617),m=o(50577),g=o(70579);const y=i.Ay.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${e=>e.theme.colors.background.primary};
`,u=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,x=i.Ay.div`
  flex: 1;
  position: relative;
  
  .graphiql-container {
    height: 100%;
    
    .graphiql-logo {
      display: none;
    }
    
    .graphiql-session-header {
      background: ${e=>e.theme.colors.background.secondary};
      border-bottom: 1px solid ${e=>e.theme.colors.border.light};
    }
    
    .graphiql-editors {
      background: ${e=>e.theme.colors.background.primary};
    }
    
    .graphiql-editor {
      background: ${e=>e.theme.colors.background.primary};
    }
    
    .graphiql-response {
      background: ${e=>e.theme.colors.background.secondary};
    }
    
    .graphiql-toolbar-button {
      background: ${e=>e.theme.colors.primary.yellow};
      color: ${e=>e.theme.colors.primary.black};
      
      &:hover {
        background: ${e=>e.theme.colors.primary.black};
        color: ${e=>e.theme.colors.primary.yellow};
      }
    }
    
    .CodeMirror {
      background: ${e=>e.theme.colors.background.primary};
      color: ${e=>e.theme.colors.text.primary};
      font-family: ${e=>e.theme.typography.fontFamily.mono};
      font-size: ${e=>e.theme.typography.fontSize.sm};
    }
    
    .CodeMirror-gutters {
      background: ${e=>e.theme.colors.background.secondary};
      border-right: 1px solid ${e=>e.theme.colors.border.light};
    }
    
    .CodeMirror-cursor {
      border-left-color: ${e=>e.theme.colors.primary.yellow};
    }
    
    .CodeMirror-selected {
      background: rgba(255, 230, 0, 0.2);
    }
  }
`,b=i.Ay.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: ${e=>e.theme.colors.background.secondary};
  border-left: 1px solid ${e=>e.theme.colors.border.light};
  transform: ${e=>e.isOpen?"translateX(0)":"translateX(100%)"};
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,$=i.Ay.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 350px;
  height: 100vh;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  transform: ${e=>e.isOpen?"translateX(0)":"translateX(-100%)"};
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
`,j=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.colors.background.primary};
  }
`,f=i.Ay.pre`
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: ${e=>e.theme.spacing[1]} 0 0 0;
`,v=i.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,k=i.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,w=i.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  margin-bottom: ${e=>e.theme.spacing[2]};
`,S=((0,i.Ay)(m.$n)`
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.black};
    color: ${e=>e.theme.colors.primary.yellow};
  }
`,(0,i.Ay)(m.Zp)`
  margin-bottom: ${e=>e.theme.spacing[3]};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadows.md};
  }
`),q=()=>{const{repoName:e}=(0,n.g)(),[r]=(0,s.ok)(),o=r.get("schema"),[i,q]=(0,t.useState)(!0),[C,z]=(0,t.useState)(null),[E,O]=(0,t.useState)(!1),[A,N]=(0,t.useState)(!1),[Q,H]=(0,t.useState)({name:"Default",url:"/graphql",headers:{"Content-Type":"application/json"}}),[J,L]=(0,t.useState)(null),[Y,T]=(0,t.useState)(""),[_,B]=(0,t.useState)(""),[P,D]=(0,t.useState)(Q.headers||{}),[G,I]=(0,t.useState)([]),[W,X]=(0,t.useState)([]);(0,t.useEffect)(()=>{M(),U(),F()},[e,o]);const M=async()=>{try{if(o){const r=await fetch(`/api/repository/${e}/file?path=${encodeURIComponent(o)}`);if(!r.ok)throw new Error("Failed to load schema");const t=await r.text();if(t.includes("type Query")){const r=t.match(/type Query\s*{([^}]*)}/);if(r){const o=r[1].split("\n").map(e=>e.trim()).filter(e=>e&&!e.startsWith("#")).slice(0,3);if(o.length>0){const r=`# Welcome to GraphQL Playground\n# \n# GraphQL queries for ${e}\n\nquery SampleQuery {\n${o.map(e=>{var r;return`  ${null===(r=e.split(":")[0])||void 0===r?void 0:r.trim()}`}).join("\n")}\n}`;T(r)}}}L({__schema:{queryType:{name:"Query"},types:[]}})}}catch(r){z(r instanceof Error?r.message:"Unknown error")}finally{q(!1)}},U=()=>{const r=localStorage.getItem(`graphql-history-${e}`);if(r)try{I(JSON.parse(r))}catch(o){}},F=()=>{const r=localStorage.getItem(`graphql-saved-${e}`);if(r)try{X(JSON.parse(r))}catch(o){}},R=e=>{const r={query:Y,variables:_?JSON.parse(_):void 0};let o="";switch(e){case"curl":o=`curl -X POST ${Q.url} \\\n  -H "Content-Type: application/json" \\\n${Object.entries(P).map(e=>{let[r,o]=e;return`  -H "${r}: ${o}" \\`}).join("\n")}\n  -d '${JSON.stringify(r)}'`;break;case"javascript":o=`fetch("${Q.url}", {\n  method: "POST",\n  headers: ${JSON.stringify({...P,"Content-Type":"application/json"},null,2)},\n  body: JSON.stringify(${JSON.stringify(r,null,2)})\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;break;case"python":o=`import requests\n\nquery = """\n${Y}\n"""\n\nvariables = ${_||"{}"}\n\nresponse = requests.post(\n    "${Q.url}",\n    json={"query": query, "variables": variables},\n    headers=${JSON.stringify(P,null,2).replace(/"/g,"'")}\n)\n\nprint(response.json())`}navigator.clipboard.writeText(o)};return i?(0,g.jsx)(m.Hh,{text:"Loading GraphQL Playground..."}):C?(0,g.jsx)(m.mc,{maxWidth:"lg",children:(0,g.jsxs)(m.wn,{children:[(0,g.jsx)(m.H1,{color:"secondary",children:"Error Loading GraphQL Playground"}),(0,g.jsx)(m.EY,{color:"secondary",children:C}),(0,g.jsx)(m.$n,{as:s.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})}):(0,g.jsxs)(y,{children:[(0,g.jsx)(u,{children:(0,g.jsxs)(m.so,{align:"center",justify:"between",children:[(0,g.jsxs)(m.so,{align:"center",gap:4,children:[(0,g.jsxs)(m.$n,{as:s.N_,to:`/api-explorer/${e}`,variant:"outline",size:"sm",children:[(0,g.jsx)(l.A,{size:20}),"Back to Explorer"]}),(0,g.jsxs)("div",{children:[(0,g.jsx)(m.H2,{style:{margin:0},children:"GraphQL Playground"}),(0,g.jsx)(m.EY,{color:"secondary",size:"small",children:e})]})]}),(0,g.jsxs)(m.so,{gap:2,children:[(0,g.jsxs)(m.$n,{variant:"outline",onClick:()=>N(!A),children:[(0,g.jsx)(c.A,{size:20}),"History"]}),(0,g.jsxs)(m.$n,{variant:"outline",onClick:()=>O(!E),children:[(0,g.jsx)(h.A,{size:20}),"Config"]})]})]})}),(0,g.jsx)(x,{children:(0,g.jsx)(a.J,{fetcher:async r=>{const o=Date.now();try{let t=Q.url;t.startsWith("/")&&(t=`${window.location.origin}${t}`),await new Promise(e=>setTimeout(e,300));const n={data:{message:"This is a simulated GraphQL response",info:{repository:e,timestamp:(new Date).toISOString(),query:r.query}}},s=Date.now()-o;return((r,o,t,n)=>{const s=[{id:Date.now().toString(),query:r,variables:o,response:t,duration:n,timestamp:Date.now()},...G].slice(0,50);I(s),localStorage.setItem(`graphql-history-${e}`,JSON.stringify(s))})(r.query,r.variables,n,s),n}catch(C){return{errors:[{message:C instanceof Error?C.message:"Unknown error occurred"}]}}}})}),(0,g.jsx)($,{isOpen:A,children:(0,g.jsxs)("div",{style:{padding:p.w.spacing[4]},children:[(0,g.jsxs)(m.so,{align:"center",justify:"between",style:{marginBottom:p.w.spacing[4]},children:[(0,g.jsx)(m.H2,{children:"Query History"}),(0,g.jsx)(m.$n,{size:"sm",variant:"ghost",onClick:()=>N(!1),children:"\u2715"})]}),0===G.length?(0,g.jsx)(m.EY,{color:"secondary",children:"No queries executed yet"}):G.map(e=>(0,g.jsxs)(j,{onClick:()=>(e=>{T(e.query),B(e.variables||""),N(!1)})(e),children:[(0,g.jsxs)(m.so,{align:"center",justify:"between",children:[(0,g.jsx)(m.EY,{size:"small",color:"secondary",children:new Date(e.timestamp).toLocaleTimeString()}),e.duration&&(0,g.jsxs)(m.Ex,{size:"sm",children:[e.duration,"ms"]})]}),(0,g.jsx)(f,{children:e.query})]},e.id))]})}),(0,g.jsxs)(b,{isOpen:E,children:[(0,g.jsxs)(m.so,{align:"center",justify:"between",style:{marginBottom:p.w.spacing[6]},children:[(0,g.jsx)(m.H2,{children:"Configuration"}),(0,g.jsx)(m.$n,{size:"sm",variant:"ghost",onClick:()=>O(!1),children:"\u2715"})]}),(0,g.jsxs)(v,{children:[(0,g.jsx)(m.EY,{weight:"semibold",style:{marginBottom:p.w.spacing[2]},children:"GraphQL Endpoint"}),(0,g.jsx)(m.pd,{type:"text",value:Q.url,onChange:e=>H({...Q,url:e.target.value}),placeholder:"https://api.example.com/graphql"})]}),(0,g.jsxs)(k,{children:[(0,g.jsx)(m.EY,{weight:"semibold",style:{marginBottom:p.w.spacing[2]},children:"Headers"}),Object.entries(P).map((e,r)=>{let[o,t]=e;return(0,g.jsxs)(w,{children:[(0,g.jsx)(m.pd,{type:"text",value:o,placeholder:"Header name",onChange:e=>{const r={...P};delete r[o],r[e.target.value]=t,D(r)}}),(0,g.jsx)(m.pd,{type:"text",value:t,placeholder:"Header value",onChange:e=>{D({...P,[o]:e.target.value})}})]},r)}),(0,g.jsx)(m.$n,{size:"sm",variant:"outline",onClick:()=>D({...P,"":""}),children:"Add Header"})]}),(0,g.jsxs)("div",{style:{marginBottom:p.w.spacing[6]},children:[(0,g.jsx)(m.EY,{weight:"semibold",style:{marginBottom:p.w.spacing[2]},children:"Export Query"}),(0,g.jsxs)(m.so,{gap:2,children:[(0,g.jsx)(m.$n,{size:"sm",variant:"outline",onClick:()=>R("curl"),children:"cURL"}),(0,g.jsx)(m.$n,{size:"sm",variant:"outline",onClick:()=>R("javascript"),children:"JavaScript"}),(0,g.jsx)(m.$n,{size:"sm",variant:"outline",onClick:()=>R("python"),children:"Python"})]})]}),(0,g.jsxs)("div",{children:[(0,g.jsxs)(m.so,{align:"center",justify:"between",style:{marginBottom:p.w.spacing[3]},children:[(0,g.jsx)(m.EY,{weight:"semibold",children:"Saved Queries"}),(0,g.jsxs)(m.$n,{size:"sm",onClick:()=>{const r=prompt("Query name:");r&&(r=>{const o={id:Date.now().toString(),name:r,query:Y,variables:_||void 0},t=[...W,o];X(t),localStorage.setItem(`graphql-saved-${e}`,JSON.stringify(t))})(r)},children:[(0,g.jsx)(d.A,{size:16}),"Save Current"]})]}),0===W.length?(0,g.jsx)(m.EY,{color:"secondary",size:"small",children:"No saved queries"}):W.map(e=>(0,g.jsx)(S,{onClick:()=>(e=>{T(e.query),B(e.variables||"")})(e),children:(0,g.jsxs)(m.Wu,{children:[(0,g.jsx)(m.EY,{weight:"semibold",children:e.name}),(0,g.jsx)(f,{children:e.query})]})},e.id))]})]})]})}}}]);
//# sourceMappingURL=847.016c4e5d.chunk.js.map