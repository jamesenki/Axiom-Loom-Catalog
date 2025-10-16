"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[372],{65372:(e,o,i)=>{i.r(o),i.d(o,{LocalLogin:()=>v,default:()=>k});var s=i(65043),t=i(73216),r=i(5464),a=i(35613),l=i(65727),n=i(69698),d=i(14459),c=i(66382),h=i(13689),m=i(70579);const p=r.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${e=>e.theme.colors.background.primary} 0%, ${e=>e.theme.colors.background.secondary} 100%);
`,g=r.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border-radius: ${e=>e.theme.borderRadius["2xl"]};
  box-shadow: ${e=>e.theme.shadows.xl};
  padding: ${e=>e.theme.spacing[12]};
  width: 100%;
  max-width: 400px;
`,u=r.Ay.div`
  text-align: center;
  margin-bottom: ${e=>e.theme.spacing[8]};
  
  h1 {
    color: ${e=>e.theme.colors.primary.black};
    font-size: ${e=>e.theme.typography.fontSize["2xl"]};
    font-weight: 700;
    margin-bottom: ${e=>e.theme.spacing[2]};
  }
  
  p {
    color: ${e=>e.theme.colors.text.secondary};
    font-size: ${e=>e.theme.typography.fontSize.base};
  }
`,x=r.Ay.form`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing[4]};
`,y=r.Ay.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing[2]};
`,$=r.Ay.label`
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${e=>e.theme.colors.text.primary};
`,f=r.Ay.div`
  position: relative;
  
  svg {
    position: absolute;
    left: ${e=>e.theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${e=>e.theme.colors.text.secondary};
    width: 20px;
    height: 20px;
  }
  
  input {
    padding-left: ${e=>e.theme.spacing[10]};
  }
`,b=r.Ay.div`
  background-color: ${e=>e.theme.colors.status.error}10;
  border: 1px solid ${e=>e.theme.colors.status.error}30;
  color: ${e=>e.theme.colors.status.error};
  padding: ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  
  svg {
    flex-shrink: 0;
  }
`,j=r.Ay.div`
  background-color: ${e=>e.theme.colors.info.light};
  border: 1px solid ${e=>e.theme.colors.info.main}30;
  padding: ${e=>e.theme.spacing[4]};
  border-radius: ${e=>e.theme.borderRadius.lg};
  margin-top: ${e=>e.theme.spacing[4]};
  
  h3 {
    font-size: ${e=>e.theme.typography.fontSize.sm};
    font-weight: 600;
    color: ${e=>e.theme.colors.info.main};
    margin-bottom: ${e=>e.theme.spacing[2]};
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      font-size: ${e=>e.theme.typography.fontSize.sm};
      color: ${e=>e.theme.colors.text.secondary};
      padding: ${e=>e.theme.spacing[1]} 0;
      
      code {
        background: ${e=>e.theme.colors.background.secondary};
        padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
        border-radius: ${e=>e.theme.borderRadius.sm};
        font-family: ${e=>e.theme.typography.fontFamily.mono};
      }
    }
  }
`,v=()=>{var e,o;const[i,r]=(0,s.useState)(""),[v,k]=(0,s.useState)(""),[w,A]=(0,s.useState)(""),[z,S]=(0,s.useState)(!1),{login:C}=(0,c.A)(),L=(0,t.Zp)(),R=(null===(e=(0,t.zy)().state)||void 0===e||null===(o=e.from)||void 0===o?void 0:o.pathname)||"/",_=(e,o)=>{r(e),k(o)};return(0,m.jsx)(p,{children:(0,m.jsx)(h.mc,{maxWidth:"sm",children:(0,m.jsxs)(g,{children:[(0,m.jsxs)(u,{children:[(0,m.jsx)("h1",{children:"Axiom Loom Catalog"}),(0,m.jsx)("p",{children:"Local Authentication"})]}),(0,m.jsxs)(x,{onSubmit:async e=>{e.preventDefault(),A(""),S(!0);try{await C(i,v),L(R,{replace:!0})}catch(o){A(o.message||"Login failed. Please check your credentials.")}finally{S(!1)}},children:[w&&(0,m.jsxs)(b,{children:[(0,m.jsx)(a.A,{size:16}),w]}),(0,m.jsxs)(y,{children:[(0,m.jsx)($,{htmlFor:"email",children:"Email"}),(0,m.jsxs)(f,{children:[(0,m.jsx)(d.A,{}),(0,m.jsx)(h.pd,{id:"email",type:"email",value:i,onChange:e=>r(e.target.value),placeholder:"user@localhost",required:!0,disabled:z})]})]}),(0,m.jsxs)(y,{children:[(0,m.jsx)($,{htmlFor:"password",children:"Password"}),(0,m.jsxs)(f,{children:[(0,m.jsx)(l.A,{}),(0,m.jsx)(h.pd,{id:"password",type:"password",value:v,onChange:e=>k(e.target.value),placeholder:"Enter password",required:!0,disabled:z})]})]}),(0,m.jsxs)(h.$n,{type:"submit",disabled:z,fullWidth:!0,children:[(0,m.jsx)(n.A,{size:20}),z?"Signing in...":"Sign In"]})]}),(0,m.jsxs)(j,{children:[(0,m.jsx)("h3",{children:"Test Credentials:"}),(0,m.jsxs)("ul",{children:[(0,m.jsxs)("li",{children:["Admin: ",(0,m.jsx)("code",{onClick:()=>_("admin@localhost","admin"),children:"admin@localhost / admin"})]}),(0,m.jsxs)("li",{children:["Developer: ",(0,m.jsx)("code",{onClick:()=>_("dev@localhost","dev"),children:"dev@localhost / dev"})]}),(0,m.jsxs)("li",{children:["Viewer: ",(0,m.jsx)("code",{onClick:()=>_("user@localhost","user"),children:"user@localhost / user"})]})]})]})]})})})},k=v}}]);
//# sourceMappingURL=372.86cda217.chunk.js.map