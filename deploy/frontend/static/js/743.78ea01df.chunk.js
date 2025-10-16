"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[743],{13743:(e,o,r)=>{r.r(o),r.d(o,{default:()=>k});var t=r(65043),i=r(73216),a=r(35475),n=r(30169),s=(r(52242),r(5464)),c=r(65469),l=r(7104),d=r(70764),p=r(9362),h=r(21617),m=r(72362),g=r(13689),u=r(70579);const b=s.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  margin-bottom: ${e=>e.theme.spacing[8]};
`,y=(0,s.Ay)(g.$n)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.yellow};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,x=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border-radius: ${e=>e.theme.borderRadius.lg};
  box-shadow: ${e=>e.theme.shadows.lg};
  overflow: hidden;
  
  .swagger-ui {
    .topbar {
      display: none;
    }
    
    .info {
      margin-bottom: ${e=>e.theme.spacing[8]};
      
      .title {
        color: ${e=>e.theme.colors.primary.black};
        font-family: ${e=>e.theme.typography.fontFamily.primary};
      }
    }
    
    .scheme-container {
      background: ${e=>e.theme.colors.background.secondary};
      padding: ${e=>e.theme.spacing[4]};
      border-radius: ${e=>e.theme.borderRadius.md};
    }
    
    .btn {
      background: ${e=>e.theme.colors.primary.yellow};
      color: ${e=>e.theme.colors.primary.black};
      border: none;
      font-weight: ${e=>e.theme.typography.fontWeight.semibold};
      
      &:hover {
        background: ${e=>e.theme.colors.primary.black};
        color: ${e=>e.theme.colors.primary.yellow};
      }
    }
    
    .opblock {
      border-radius: ${e=>e.theme.borderRadius.md};
      margin-bottom: ${e=>e.theme.spacing[4]};
      
      &.opblock-get {
        border-color: #61affe;
        
        .opblock-summary-method {
          background: #61affe;
        }
      }
      
      &.opblock-post {
        border-color: #49cc90;
        
        .opblock-summary-method {
          background: #49cc90;
        }
      }
      
      &.opblock-put {
        border-color: #fca130;
        
        .opblock-summary-method {
          background: #fca130;
        }
      }
      
      &.opblock-delete {
        border-color: #f93e3e;
        
        .opblock-summary-method {
          background: #f93e3e;
        }
      }
    }
  }
`,f=(0,s.Ay)(g.Zp)`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,k=()=>{const{repoName:e}=(0,i.g)(),[o]=(0,a.ok)(),r=o.get("file"),[s,k]=(0,t.useState)(null),[$,j]=(0,t.useState)(!0),[w,v]=(0,t.useState)(null),[A,E]=(0,t.useState)(null);(0,t.useEffect)(()=>{r&&I()},[r,e]);const I=async()=>{try{const n=await fetch((0,m.e9)(`/api/repository/${e}/file?path=${encodeURIComponent(r)}`));if(!n.ok)throw new Error("Failed to fetch API specification");const s=await n.text();try{var o,t,i;const e=JSON.parse(s);E({title:(null===(o=e.info)||void 0===o?void 0:o.title)||"API Documentation",version:(null===(t=e.info)||void 0===t?void 0:t.version)||"1.0.0",description:(null===(i=e.info)||void 0===i?void 0:i.description)||"",servers:e.servers||[],paths:Object.keys(e.paths||{}).length})}catch(a){}const c=new Blob([s],{type:"application/json"}),l=URL.createObjectURL(c);k(l)}catch(n){v(n instanceof Error?n.message:"Unknown error")}finally{j(!1)}};return(0,t.useEffect)(()=>()=>{s&&URL.revokeObjectURL(s)},[s]),$?(0,u.jsx)(g.Hh,{text:"Loading API specification..."}):w||!s?(0,u.jsx)(g.mc,{maxWidth:"lg",children:(0,u.jsxs)(g.wn,{children:[(0,u.jsx)(g.H1,{color:"secondary",children:"\u26a0\ufe0f Error Loading API"}),(0,u.jsx)(g.EY,{color:"secondary",children:w||"No API specification provided"}),(0,u.jsx)(g.$n,{as:a.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(b,{children:(0,u.jsxs)(g.mc,{maxWidth:"lg",children:[(0,u.jsxs)(y,{as:a.N_,to:`/api-explorer/${e}`,children:[(0,u.jsx)(c.A,{size:20}),"Back to API Explorer"]}),(0,u.jsxs)(g.H1,{style:{color:h.w.colors.primary.white,marginBottom:h.w.spacing[4]},children:[(0,u.jsx)(p.A,{size:32,style:{marginRight:h.w.spacing[3],verticalAlign:"middle"}}),(null===A||void 0===A?void 0:A.title)||"API Documentation"]}),A&&(0,u.jsxs)(g.so,{gap:3,wrap:!0,children:[(0,u.jsxs)(g.Ex,{variant:"success",size:"lg",children:["Version ",A.version]}),A.paths>0&&(0,u.jsxs)(g.Ex,{size:"lg",children:[A.paths," Endpoints"]}),(0,u.jsx)(g.Ex,{size:"lg",children:"OpenAPI"})]})]})}),(0,u.jsx)(g.mc,{maxWidth:"xl",children:(0,u.jsxs)(g.wn,{spacing:"large",children:[A&&A.description&&(0,u.jsxs)(f,{children:[(0,u.jsx)(g.aR,{children:(0,u.jsx)(g.ZB,{children:"About this API"})}),(0,u.jsx)(g.Wu,{children:(0,u.jsx)(g.EY,{children:A.description})})]}),(0,u.jsxs)(g.so,{justify:"end",gap:3,style:{marginBottom:h.w.spacing[4]},children:[(0,u.jsxs)(g.$n,{as:"a",href:`/api/repository/${e}/file?path=${encodeURIComponent(r)}&download=true`,download:!0,variant:"outline",children:[(0,u.jsx)(l.A,{size:20}),"Download Spec"]}),(0,u.jsxs)(g.$n,{as:"a",href:`https://editor.swagger.io/?url=${encodeURIComponent(window.location.origin+s)}`,target:"_blank",rel:"noopener noreferrer",variant:"outline",children:[(0,u.jsx)(d.A,{size:20}),"Open in Swagger Editor"]})]}),(0,u.jsx)(x,{children:(0,u.jsx)(n.A,{url:s,docExpansion:"list",defaultModelsExpandDepth:1,displayRequestDuration:!0,tryItOutEnabled:!0})})]})})]})}}}]);
//# sourceMappingURL=743.78ea01df.chunk.js.map