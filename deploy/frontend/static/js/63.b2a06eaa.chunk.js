"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[63],{95063:(e,r,o)=>{o.r(r),o.d(r,{default:()=>x});var s=o(65043),t=o(73216),i=o(35475),n=o(5464),a=o(65469),l=o(13689),d=o(70579);const c=n.Ay.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${e=>e.theme.colors.background.primary};
`,h=n.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,m=n.Ay.div`
  flex: 1;
  padding: ${e=>e.theme.spacing[6]};
  overflow-y: auto;
`,g=n.Ay.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${e=>e.theme.spacing[4]};
  height: 100%;
`,u=(0,n.Ay)(l.Zp)`
  display: flex;
  flex-direction: column;
`,y=n.Ay.textarea`
  flex: 1;
  padding: ${e=>e.theme.spacing[3]};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  background: ${e=>e.theme.colors.background.primary};
  color: ${e=>e.theme.colors.text.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  resize: none;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,p=n.Ay.pre`
  flex: 1;
  padding: ${e=>e.theme.spacing[3]};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  background: ${e=>e.theme.colors.background.primary};
  color: ${e=>e.theme.colors.text.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  overflow: auto;
  margin: 0;
`,x=()=>{const{repoName:e}=(0,t.g)(),[r]=(0,i.ok)(),o=r.get("schema"),[n,x]=(0,s.useState)(!1),[f,b]=(0,s.useState)("# Welcome to GraphQL Playground\n# \n# Enter your GraphQL query here\n# Example:\n\nquery {\n  # Your query fields here\n}"),[j,$]=(0,s.useState)("{}"),[k,w]=(0,s.useState)("");return(0,d.jsxs)(c,{children:[(0,d.jsx)(h,{children:(0,d.jsxs)(l.so,{align:"center",justify:"between",children:[(0,d.jsxs)(l.so,{align:"center",gap:4,children:[(0,d.jsxs)(l.$n,{as:i.N_,to:`/api-explorer/${e}`,variant:"outline",size:"sm",children:[(0,d.jsx)(a.A,{size:20}),"Back to Explorer"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(l.H2,{style:{margin:0},children:"GraphQL Playground"}),(0,d.jsx)(l.EY,{color:"secondary",size:"small",children:e})]})]}),(0,d.jsx)(l.$n,{onClick:async()=>{x(!0);try{await new Promise(e=>setTimeout(e,300));const r={data:{message:"This is a simulated GraphQL response",info:{repository:e,schema:o,timestamp:(new Date).toISOString()}}};w(JSON.stringify(r,null,2))}catch(r){w(JSON.stringify({errors:[{message:r instanceof Error?r.message:"Unknown error"}]},null,2))}finally{x(!1)}},disabled:n,children:n?"Executing...":"Execute Query"})]})}),(0,d.jsx)(m,{children:(0,d.jsxs)(g,{children:[(0,d.jsx)(u,{children:(0,d.jsxs)(l.Wu,{children:[(0,d.jsx)(l.so,{align:"center",justify:"between",style:{marginBottom:"1rem"},children:(0,d.jsx)(l.EY,{weight:"semibold",children:"Query"})}),(0,d.jsx)(y,{value:f,onChange:e=>b(e.target.value),placeholder:"Enter your GraphQL query..."}),(0,d.jsx)(l.so,{align:"center",justify:"between",style:{margin:"1rem 0"},children:(0,d.jsx)(l.EY,{weight:"semibold",children:"Variables"})}),(0,d.jsx)(y,{value:j,onChange:e=>$(e.target.value),placeholder:"{}",style:{minHeight:"150px",maxHeight:"150px"}})]})}),(0,d.jsx)(u,{children:(0,d.jsxs)(l.Wu,{children:[(0,d.jsx)(l.so,{align:"center",justify:"between",style:{marginBottom:"1rem"},children:(0,d.jsx)(l.EY,{weight:"semibold",children:"Result"})}),(0,d.jsx)(p,{children:k||"Execute a query to see results"})]})})]})})]})}}}]);
//# sourceMappingURL=63.b2a06eaa.chunk.js.map