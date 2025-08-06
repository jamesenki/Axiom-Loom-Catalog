"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[743],{13743:(e,o,r)=>{r.r(o),r.d(o,{default:()=>f});var i=r(65043),n=r(73216),t=r(35475),s=r(84917),a=(r(52242),r(5464)),c=r(65469),l=r(7104),d=r(70764),p=r(9362),h=r(21617),m=r(50577),g=r(70579);const u=a.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  margin-bottom: ${e=>e.theme.spacing[8]};
`,b=(0,a.Ay)(m.$n)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.yellow};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,y=a.Ay.div`
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
`,x=(0,a.Ay)(m.Zp)`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,f=()=>{const{repoName:e}=(0,n.g)(),[o]=(0,t.ok)(),r=o.get("file"),[a,f]=(0,i.useState)(null),[k,$]=(0,i.useState)(!0),[j,w]=(0,i.useState)(null),[v,A]=(0,i.useState)(null);(0,i.useEffect)(()=>{r&&E()},[r,e]);const E=async()=>{try{const s=await fetch(`/api/repository/${e}/file?path=${encodeURIComponent(r)}`);if(!s.ok)throw new Error("Failed to fetch API specification");const a=await s.text();try{var o,i,n;const e=JSON.parse(a);A({title:(null===(o=e.info)||void 0===o?void 0:o.title)||"API Documentation",version:(null===(i=e.info)||void 0===i?void 0:i.version)||"1.0.0",description:(null===(n=e.info)||void 0===n?void 0:n.description)||"",servers:e.servers||[],paths:Object.keys(e.paths||{}).length})}catch(t){}const c=new Blob([a],{type:"application/json"}),l=URL.createObjectURL(c);f(l)}catch(s){w(s instanceof Error?s.message:"Unknown error")}finally{$(!1)}};return(0,i.useEffect)(()=>()=>{a&&URL.revokeObjectURL(a)},[a]),k?(0,g.jsx)(m.Hh,{text:"Loading API specification..."}):j||!a?(0,g.jsx)(m.mc,{maxWidth:"lg",children:(0,g.jsxs)(m.wn,{children:[(0,g.jsx)(m.H1,{color:"secondary",children:"\u26a0\ufe0f Error Loading API"}),(0,g.jsx)(m.EY,{color:"secondary",children:j||"No API specification provided"}),(0,g.jsx)(m.$n,{as:t.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(u,{children:(0,g.jsxs)(m.mc,{maxWidth:"lg",children:[(0,g.jsxs)(b,{as:t.N_,to:`/api-explorer/${e}`,children:[(0,g.jsx)(c.A,{size:20}),"Back to API Explorer"]}),(0,g.jsxs)(m.H1,{style:{color:h.w.colors.primary.white,marginBottom:h.w.spacing[4]},children:[(0,g.jsx)(p.A,{size:32,style:{marginRight:h.w.spacing[3],verticalAlign:"middle"}}),(null===v||void 0===v?void 0:v.title)||"API Documentation"]}),v&&(0,g.jsxs)(m.so,{gap:3,wrap:!0,children:[(0,g.jsxs)(m.Ex,{variant:"success",size:"lg",children:["Version ",v.version]}),v.paths>0&&(0,g.jsxs)(m.Ex,{size:"lg",children:[v.paths," Endpoints"]}),(0,g.jsx)(m.Ex,{size:"lg",children:"OpenAPI"})]})]})}),(0,g.jsx)(m.mc,{maxWidth:"xl",children:(0,g.jsxs)(m.wn,{spacing:"large",children:[v&&v.description&&(0,g.jsxs)(x,{children:[(0,g.jsx)(m.aR,{children:(0,g.jsx)(m.ZB,{children:"About this API"})}),(0,g.jsx)(m.Wu,{children:(0,g.jsx)(m.EY,{children:v.description})})]}),(0,g.jsxs)(m.so,{justify:"end",gap:3,style:{marginBottom:h.w.spacing[4]},children:[(0,g.jsxs)(m.$n,{as:"a",href:`/api/repository/${e}/file?path=${encodeURIComponent(r)}&download=true`,download:!0,variant:"outline",children:[(0,g.jsx)(l.A,{size:20}),"Download Spec"]}),(0,g.jsxs)(m.$n,{as:"a",href:`https://editor.swagger.io/?url=${encodeURIComponent(window.location.origin+a)}`,target:"_blank",rel:"noopener noreferrer",variant:"outline",children:[(0,g.jsx)(d.A,{size:20}),"Open in Swagger Editor"]})]}),(0,g.jsx)(y,{children:(0,g.jsx)(s.A,{url:a,docExpansion:"list",defaultModelsExpandDepth:1,displayRequestDuration:!0,tryItOutEnabled:!0})})]})})]})}}}]);
//# sourceMappingURL=743.8092420b.chunk.js.map