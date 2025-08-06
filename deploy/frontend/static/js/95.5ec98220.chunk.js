"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[95],{2095:(e,r,s)=>{s.r(r),s.d(r,{default:()=>z});var o=s(65043),t=s(73216),i=s(35475),n=s(5464),a=s(35613),l=s(65469),c=s(38326),p=s(33005),d=s(9362),h=s(38298),y=s(55731),m=s(39292),g=s(21617),x=s(50577),u=s(70579);const w=n.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  margin-bottom: ${e=>e.theme.spacing[8]};
`,j=(0,n.Ay)(x.$n)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.yellow};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,f=n.Ay.div`
  position: relative;
  margin-bottom: ${e=>e.theme.spacing[6]};
`,$=(0,n.Ay)(x.pd)`
  padding-left: ${e=>e.theme.spacing[10]};
  background: ${e=>e.theme.colors.background.secondary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,A=(0,n.Ay)(m.A)`
  position: absolute;
  left: ${e=>e.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.colors.text.secondary};
`,b=(0,n.Ay)(x.so)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  gap: ${e=>e.theme.spacing[3]};
  flex-wrap: wrap;
`,v=(0,n.Ay)(x.$n)`
  background: ${e=>e.active?g.w.colors.primary.yellow:g.w.colors.background.secondary};
  color: ${e=>e.active?g.w.colors.primary.black:g.w.colors.text.primary};
  border: 1px solid ${e=>e.active?g.w.colors.primary.yellow:"transparent"};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,k=(0,n.Ay)(x.Zp)`
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${e=>{switch(e.dataType){case"OpenAPI":return"#FF6B6B";case"GraphQL":return"#E90C59";case"gRPC":return"#00A67E";default:return g.w.colors.primary.yellow}}};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadows.lg};
  }
`,C=e=>{let{type:r}=e;switch(r){case"OpenAPI":return(0,u.jsx)(d.A,{size:24,color:"#FF6B6B"});case"GraphQL":return(0,u.jsx)(p.A,{size:24,color:"#E90C59"});case"gRPC":return(0,u.jsx)(y.A,{size:24,color:"#00A67E"});default:return(0,u.jsx)(d.A,{size:24,color:g.w.colors.primary.yellow})}},E=n.Ay.div`
  text-align: center;
  padding: ${e=>e.theme.spacing[16]} 0;
`,z=()=>{const{repoName:e}=(0,t.g)(),[r,s]=(0,o.useState)([]),[n,p]=(0,o.useState)([]),[d,y]=(0,o.useState)(!0),[m,z]=(0,o.useState)(null),[P,I]=(0,o.useState)(""),[R,L]=(0,o.useState)(null),[S,B]=(0,o.useState)([]);(0,o.useEffect)(()=>{F()},[e]),(0,o.useEffect)(()=>{Y()},[r,P,R]);const F=async()=>{try{var r,o,t;const i=await fetch(`/api/detect-apis/${e}`);if(!i.ok)throw new Error("Failed to fetch APIs");const n=await i.json(),a=[];null!==(r=n.apis)&&void 0!==r&&r.rest&&n.apis.rest.forEach(e=>{a.push({name:e.title||e.file.split("/").pop().replace(/\.(yaml|yml)$/i,""),path:e.file,type:"OpenAPI",version:e.version,description:e.description})}),null!==(o=n.apis)&&void 0!==o&&o.graphql&&n.apis.graphql.forEach(e=>{a.push({name:e.title||e.file.split("/").pop().replace(/\.(graphql|gql)$/i,""),path:e.file,type:"GraphQL",description:e.description})}),null!==(t=n.apis)&&void 0!==t&&t.grpc&&n.apis.grpc.forEach(e=>{a.push({name:e.title||e.file.split("/").pop().replace(/\.proto$/i,""),path:e.file,type:"gRPC",description:e.description})}),s(a);const l=[...new Set(a.map(e=>e.type))];B(l)}catch(i){z(i instanceof Error?i.message:"Unknown error")}finally{y(!1)}},Y=()=>{let e=r;P&&(e=e.filter(e=>e.name.toLowerCase().includes(P.toLowerCase())||e.path.toLowerCase().includes(P.toLowerCase())||e.description&&e.description.toLowerCase().includes(P.toLowerCase()))),R&&(e=e.filter(e=>e.type===R)),p(e)},_=e=>{L(R===e?null:e)};return d?(0,u.jsx)(x.Hh,{text:"Discovering APIs..."}):m?(0,u.jsx)(x.mc,{maxWidth:"lg",children:(0,u.jsxs)(x.wn,{children:[(0,u.jsx)(x.H1,{color:"secondary",children:"\u26a0\ufe0f Error Loading APIs"}),(0,u.jsx)(x.EY,{color:"secondary",children:m}),(0,u.jsx)(x.$n,{as:i.N_,to:"/",children:"Return to Home"})]})}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(w,{children:(0,u.jsxs)(x.mc,{maxWidth:"lg",children:[(0,u.jsxs)(j,{as:i.N_,to:`/repository/${e}`,children:[(0,u.jsx)(l.A,{size:20}),"Back to Repository"]}),(0,u.jsxs)(x.H1,{style:{color:g.w.colors.primary.white,marginBottom:g.w.spacing[4]},children:["\ud83d\udee0\ufe0f API Explorer: ",e]}),(0,u.jsxs)(x.hj,{style:{color:"rgba(255, 255, 255, 0.9)"},children:[r.length," API",1!==r.length?"s":""," discovered"]})]})}),(0,u.jsx)(x.mc,{maxWidth:"lg",children:(0,u.jsxs)(x.wn,{spacing:"large",children:[(0,u.jsxs)(f,{children:[(0,u.jsx)(A,{size:20}),(0,u.jsx)($,{type:"text",placeholder:"Search APIs by name, path, or description...",value:P,onChange:e=>I(e.target.value)})]}),(0,u.jsxs)(b,{children:[(0,u.jsxs)(x.EY,{weight:"semibold",style:{marginRight:g.w.spacing[3]},children:[(0,u.jsx)(h.A,{size:16,style:{marginRight:g.w.spacing[1]}}),"Filter by type:"]}),(0,u.jsxs)(v,{size:"sm",active:!R,onClick:()=>_(null),children:["All (",r.length,")"]}),S.map(e=>(0,u.jsxs)(v,{size:"sm",active:R===e,onClick:()=>_(e),children:[e," (",r.filter(r=>r.type===e).length,")"]},e))]}),n.length>0?(0,u.jsx)(x.xA,{columns:3,gap:"large",children:n.map((r,s)=>(0,u.jsxs)(k,{dataType:r.type,onClick:()=>{const s="GraphQL"===r.type?`/graphql/${e}?file=${encodeURIComponent(r.path)}`:"gRPC"===r.type?`/grpc-playground/${e}?file=${encodeURIComponent(r.path)}`:`/api-viewer/${e}?file=${encodeURIComponent(r.path)}`;window.location.href=s},children:[(0,u.jsx)(x.aR,{children:(0,u.jsxs)(x.so,{align:"center",justify:"between",children:[(0,u.jsx)(C,{type:r.type}),(0,u.jsx)(x.Ex,{children:r.type})]})}),(0,u.jsxs)(x.Wu,{children:[(0,u.jsx)(x.ZB,{children:r.name}),(0,u.jsx)(x.EY,{color:"secondary",style:{marginBottom:g.w.spacing[2],fontSize:g.w.typography.fontSize.sm},children:r.path}),r.description&&(0,u.jsx)(x.BT,{children:r.description}),r.version&&(0,u.jsxs)(x.EY,{size:"small",color:"secondary",style:{marginTop:g.w.spacing[2]},children:["Version: ",r.version]}),r.endpoints&&(0,u.jsxs)(x.EY,{size:"small",color:"secondary",children:[r.endpoints," endpoint",1!==r.endpoints?"s":""]})]}),(0,u.jsx)(x.so,{justify:"end",style:{padding:g.w.spacing[3]},children:(0,u.jsx)(c.A,{size:20,color:g.w.colors.primary.yellow})})]},s))}):(0,u.jsxs)(E,{children:[(0,u.jsx)(a.A,{size:48,color:g.w.colors.text.secondary}),(0,u.jsx)(x.H2,{color:"secondary",style:{marginTop:g.w.spacing[4]},children:"No APIs Found"}),(0,u.jsx)(x.EY,{color:"secondary",children:P||R?"Try adjusting your filters or search query.":"This repository does not contain any API specifications."})]})]})})]})}}}]);
//# sourceMappingURL=95.5ec98220.chunk.js.map