"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[8],{55008:(e,r,s)=>{s.r(r),s.d(r,{default:()=>z});var o=s(65043),t=s(35475),a=s(73216),i=s(5464),l=s(35613),n=s(65469),c=s(33005),d=s(38298),p=s(55731),h=s(39292),m=s(20059),x=s(13689),y=s(70579);const u=i.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  margin-bottom: ${e=>e.theme.spacing[8]};
`,g=(0,i.Ay)(x.$n)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.yellow};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,j=i.Ay.div`
  position: relative;
  margin-bottom: ${e=>e.theme.spacing[6]};
`,$=(0,i.Ay)(x.pd)`
  padding-left: ${e=>e.theme.spacing[10]};
  background: ${e=>e.theme.colors.background.secondary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,v=(0,i.Ay)(h.A)`
  position: absolute;
  left: ${e=>e.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.colors.text.secondary};
`,b=(0,i.Ay)(x.so)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  gap: ${e=>e.theme.spacing[3]};
  flex-wrap: wrap;
`,A=(0,i.Ay)(x.$n)`
  background: ${e=>e.active?e.theme.colors.primary.yellow:e.theme.colors.background.secondary};
  color: ${e=>e.active?e.theme.colors.primary.black:e.theme.colors.text.primary};
  border: 1px solid ${e=>e.active?e.theme.colors.primary.yellow:"transparent"};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,w=(0,i.Ay)(x.Zp)`
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,f=e=>{let{type:r}=e;switch(r){case"OpenAPI":default:return(0,y.jsx)(p.A,{size:20});case"GraphQL":return(0,y.jsx)(c.A,{size:20});case"gRPC":return(0,y.jsx)(m.A,{size:20})}},k=(0,i.Ay)(x.Ex)`
  background: ${e=>{switch(e.type){case"OpenAPI":return e.theme.colors.status.warning;case"GraphQL":return e.theme.colors.status.info;case"gRPC":return e.theme.colors.status.success;default:return e.theme.colors.secondary.darkGray}}};
  color: ${e=>e.theme.colors.text.primary};
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[1]};
`,C=i.Ay.div`
  background: ${e=>e.theme.colors.status.error}20;
  border: 1px solid ${e=>e.theme.colors.status.error};
  padding: ${e=>e.theme.spacing[4]};
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.status.error};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  margin-bottom: ${e=>e.theme.spacing[4]};
`,z=()=>{const[e]=(0,t.ok)(),r=(0,a.Zp)(),s=e.get("type"),[i,h]=(0,o.useState)([]),[z,P]=(0,o.useState)([]),[I,L]=(0,o.useState)(!0),[E,S]=(0,o.useState)(null),[G,R]=(0,o.useState)(""),[T,Y]=(0,o.useState)(null);(0,o.useEffect)(()=>{O(),s&&Y(null)},[s]),(0,o.useEffect)(()=>{Q()},[i,G,T]);const O=async()=>{try{L(!0);const e=s?`/api/api-explorer/all?type=${s}`:"/api/api-explorer/all",r=await fetch(e,{headers:{"x-dev-mode":"true"}});if(!r.ok)throw new Error("Failed to fetch APIs");const o=await r.json();h(o.apis||[])}catch(e){S(e instanceof Error?e.message:"Unknown error")}finally{L(!1)}},Q=()=>{let e=i;G&&(e=e.filter(e=>{var r;return e.name.toLowerCase().includes(G.toLowerCase())||e.repository.toLowerCase().includes(G.toLowerCase())||(null===(r=e.description)||void 0===r?void 0:r.toLowerCase().includes(G.toLowerCase()))})),T&&!s&&(e=e.filter(e=>e.type===T)),P(e)},_=e=>{Y(e),r(e?`/api-explorer/all?type=${e.toLowerCase()}`:"/api-explorer/all")};return I?(0,y.jsx)(x.Hh,{}):(0,y.jsxs)("div",{children:[(0,y.jsx)(u,{children:(0,y.jsxs)(x.mc,{children:[(0,y.jsxs)(g,{as:t.N_,to:"/",size:"sm",children:[(0,y.jsx)(n.A,{size:16}),"Back to Dashboard"]}),(0,y.jsx)(x.H1,{children:"API Explorer"}),(0,y.jsx)(x.hj,{children:"Discover and explore all available APIs across repositories"})]})}),(0,y.jsx)(x.mc,{children:(0,y.jsxs)(x.wn,{children:[E&&(0,y.jsxs)(C,{children:[(0,y.jsx)(l.A,{size:20}),(0,y.jsxs)("span",{children:["Error Loading APIs: ",E]})]}),(0,y.jsxs)(j,{children:[(0,y.jsx)(v,{size:20}),(0,y.jsx)($,{type:"text",placeholder:"Search APIs by name, repository, or description...",value:G,onChange:e=>R(e.target.value)})]}),(0,y.jsxs)(b,{children:[(0,y.jsxs)(A,{size:"sm",active:!T,onClick:()=>_(null),children:[(0,y.jsx)(d.A,{size:16}),"All Types"]}),(0,y.jsxs)(A,{size:"sm",active:"OpenAPI"===T,onClick:()=>_("OpenAPI"),children:[(0,y.jsx)(p.A,{size:16}),"OpenAPI"]}),(0,y.jsxs)(A,{size:"sm",active:"GraphQL"===T,onClick:()=>_("GraphQL"),children:[(0,y.jsx)(c.A,{size:16}),"GraphQL"]}),(0,y.jsxs)(A,{size:"sm",active:"gRPC"===T,onClick:()=>_("gRPC"),children:[(0,y.jsx)(m.A,{size:16}),"gRPC"]})]}),(0,y.jsxs)(x.H2,{children:[z.length," ",T||(null===s||void 0===s?void 0:s.toUpperCase())||"Total"," APIs Found"]}),(0,y.jsx)(x.xA,{columns:1,gap:"medium",children:z.map((e,s)=>(0,y.jsxs)(w,{onClick:()=>(e=>{r(`/api-explorer/${e.repository}#${e.path}`)})(e),children:[(0,y.jsx)(x.aR,{children:(0,y.jsxs)(x.so,{justify:"between",align:"start",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)(x.ZB,{children:e.name}),(0,y.jsx)(x.EY,{size:"small",style:{color:"var(--text-muted)"},children:e.repository})]}),(0,y.jsxs)(k,{type:e.type,children:[(0,y.jsx)(f,{type:e.type}),e.type]})]})}),(0,y.jsxs)(x.Wu,{children:[e.description&&(0,y.jsx)(x.BT,{children:e.description}),(0,y.jsxs)(x.so,{justify:"between",align:"center",style:{marginTop:"1rem"},children:[(0,y.jsx)(x.EY,{size:"small",style:{color:"var(--text-muted)"},children:e.path}),e.version&&(0,y.jsxs)(x.Ex,{variant:"secondary",children:["v",e.version]})]}),e.services&&e.services.length>0&&(0,y.jsx)("div",{style:{marginTop:"0.5rem"},children:(0,y.jsxs)(x.EY,{size:"small",style:{color:"var(--text-muted)"},children:["Services: ",e.services.join(", ")]})})]})]},`${e.repository}-${e.path}-${s}`))}),0===z.length&&!I&&(0,y.jsx)(x.Zp,{children:(0,y.jsx)(x.Wu,{children:(0,y.jsxs)(x.so,{direction:"column",align:"center",justify:"center",style:{padding:"2rem"},children:[(0,y.jsx)(l.A,{size:48,style:{marginBottom:"1rem",opacity:.5}}),(0,y.jsx)(x.H3,{children:"No APIs Found"}),(0,y.jsx)(x.EY,{style:{color:"var(--text-muted)"},children:G||T?"Try adjusting your filters or search terms":"No APIs detected in the repositories"})]})})})]})})]})}}}]);
//# sourceMappingURL=8.1f480892.chunk.js.map