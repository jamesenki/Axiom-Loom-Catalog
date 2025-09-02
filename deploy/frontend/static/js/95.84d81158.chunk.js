"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[95],{2095:(e,r,o)=>{o.r(r),o.d(r,{default:()=>P});var s=o(65043),t=o(73216),i=o(35475),a=o(5464),n=o(72362),l=o(35613),c=o(65469),p=o(38326),d=o(33005),h=o(9362),y=o(38298),m=o(55731),g=o(39292),x=o(21617),u=o(13689),w=o(70579);const j=a.Ay.div`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  padding: ${e=>e.theme.spacing[12]} 0;
  margin-bottom: ${e=>e.theme.spacing[8]};
`,f=(0,a.Ay)(u.$n)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.yellow};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,$=a.Ay.div`
  position: relative;
  margin-bottom: ${e=>e.theme.spacing[6]};
`,A=(0,a.Ay)(u.pd)`
  padding-left: ${e=>e.theme.spacing[10]};
  background: ${e=>e.theme.colors.background.secondary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,b=(0,a.Ay)(g.A)`
  position: absolute;
  left: ${e=>e.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.colors.text.secondary};
`,v=(0,a.Ay)(u.so)`
  margin-bottom: ${e=>e.theme.spacing[6]};
  gap: ${e=>e.theme.spacing[3]};
  flex-wrap: wrap;
`,k=(0,a.Ay)(u.$n)`
  background: ${e=>e.active?x.w.colors.primary.yellow:x.w.colors.background.secondary};
  color: ${e=>e.active?x.w.colors.primary.black:x.w.colors.text.primary};
  border: 1px solid ${e=>e.active?x.w.colors.primary.yellow:"transparent"};
  
  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }
`,C=(0,a.Ay)(u.Zp)`
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${e=>{switch(e.dataType){case"OpenAPI":return"#FF6B6B";case"GraphQL":return"#E90C59";case"gRPC":return"#00A67E";default:return x.w.colors.primary.yellow}}};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadows.lg};
  }
`,E=e=>{let{type:r}=e;switch(r){case"OpenAPI":return(0,w.jsx)(h.A,{size:24,color:"#FF6B6B"});case"GraphQL":return(0,w.jsx)(d.A,{size:24,color:"#E90C59"});case"gRPC":return(0,w.jsx)(m.A,{size:24,color:"#00A67E"});default:return(0,w.jsx)(h.A,{size:24,color:x.w.colors.primary.yellow})}},z=a.Ay.div`
  text-align: center;
  padding: ${e=>e.theme.spacing[16]} 0;
`,P=()=>{const{repoName:e}=(0,t.g)(),[r,o]=(0,s.useState)([]),[a,d]=(0,s.useState)([]),[h,m]=(0,s.useState)(!0),[g,P]=(0,s.useState)(null),[I,R]=(0,s.useState)(""),[L,S]=(0,s.useState)(null),[B,F]=(0,s.useState)([]);(0,s.useEffect)(()=>{Y()},[e]),(0,s.useEffect)(()=>{T()},[r,I,L]);const Y=async()=>{try{var r,s,t;const i=await fetch((0,n.e9)(`/api/detect-apis/${e}`),{headers:{"x-dev-mode":"true"}});if(!i.ok)throw new Error("Failed to fetch APIs");const a=await i.json(),l=[];null!==(r=a.apis)&&void 0!==r&&r.rest&&a.apis.rest.forEach(e=>{l.push({name:e.title||e.file.split("/").pop().replace(/\.(yaml|yml)$/i,""),path:e.file,type:"OpenAPI",version:e.version,description:e.description})}),null!==(s=a.apis)&&void 0!==s&&s.graphql&&a.apis.graphql.forEach(e=>{l.push({name:e.title||e.file.split("/").pop().replace(/\.(graphql|gql)$/i,""),path:e.file,type:"GraphQL",description:e.description})}),null!==(t=a.apis)&&void 0!==t&&t.grpc&&a.apis.grpc.forEach(e=>{l.push({name:e.title||e.file.split("/").pop().replace(/\.proto$/i,""),path:e.file,type:"gRPC",description:e.description})}),o(l);const c=[...new Set(l.map(e=>e.type))];F(c)}catch(i){P(i instanceof Error?i.message:"Unknown error")}finally{m(!1)}},T=()=>{let e=r;I&&(e=e.filter(e=>e.name.toLowerCase().includes(I.toLowerCase())||e.path.toLowerCase().includes(I.toLowerCase())||e.description&&e.description.toLowerCase().includes(I.toLowerCase()))),L&&(e=e.filter(e=>e.type===L)),d(e)},q=e=>{S(L===e?null:e)};return h?(0,w.jsx)(u.Hh,{text:"Discovering APIs..."}):g?(0,w.jsx)(u.mc,{maxWidth:"lg",children:(0,w.jsxs)(u.wn,{children:[(0,w.jsx)(u.H1,{color:"secondary",children:"\u26a0\ufe0f Error Loading APIs"}),(0,w.jsx)(u.EY,{color:"secondary",children:g}),(0,w.jsx)(u.$n,{as:i.N_,to:"/",children:"Return to Home"})]})}):(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(j,{children:(0,w.jsxs)(u.mc,{maxWidth:"lg",children:[(0,w.jsxs)(f,{as:i.N_,to:`/repository/${e}`,children:[(0,w.jsx)(c.A,{size:20}),"Back to Repository"]}),(0,w.jsxs)(u.H1,{style:{color:x.w.colors.primary.white,marginBottom:x.w.spacing[4]},children:["\ud83d\udee0\ufe0f API Explorer: ",e]}),(0,w.jsxs)(u.hj,{style:{color:"rgba(255, 255, 255, 0.9)"},children:[r.length," API",1!==r.length?"s":""," discovered"]})]})}),(0,w.jsx)(u.mc,{maxWidth:"lg",children:(0,w.jsxs)(u.wn,{spacing:"large",children:[(0,w.jsxs)($,{children:[(0,w.jsx)(b,{size:20}),(0,w.jsx)(A,{type:"text",placeholder:"Search APIs by name, path, or description...",value:I,onChange:e=>R(e.target.value)})]}),(0,w.jsxs)(v,{children:[(0,w.jsxs)(u.EY,{weight:"semibold",style:{marginRight:x.w.spacing[3]},children:[(0,w.jsx)(y.A,{size:16,style:{marginRight:x.w.spacing[1]}}),"Filter by type:"]}),(0,w.jsxs)(k,{size:"sm",active:!L,onClick:()=>q(null),children:["All (",r.length,")"]}),B.map(e=>(0,w.jsxs)(k,{size:"sm",active:L===e,onClick:()=>q(e),children:[e," (",r.filter(r=>r.type===e).length,")"]},e))]}),a.length>0?(0,w.jsx)(u.xA,{columns:3,gap:"large",children:a.map((r,o)=>(0,w.jsxs)(C,{dataType:r.type,onClick:()=>{const o="GraphQL"===r.type?`/graphql/${e}?file=${encodeURIComponent(r.path)}`:"gRPC"===r.type?`/grpc-playground/${e}?file=${encodeURIComponent(r.path)}`:`/api-viewer/${e}?file=${encodeURIComponent(r.path)}`;window.location.href=o},children:[(0,w.jsx)(u.aR,{children:(0,w.jsxs)(u.so,{align:"center",justify:"between",children:[(0,w.jsx)(E,{type:r.type}),(0,w.jsx)(u.Ex,{children:r.type})]})}),(0,w.jsxs)(u.Wu,{children:[(0,w.jsx)(u.ZB,{children:r.name}),(0,w.jsx)(u.EY,{color:"secondary",style:{marginBottom:x.w.spacing[2],fontSize:x.w.typography.fontSize.sm},children:r.path}),r.description&&(0,w.jsx)(u.BT,{children:r.description}),r.version&&(0,w.jsxs)(u.EY,{size:"small",color:"secondary",style:{marginTop:x.w.spacing[2]},children:["Version: ",r.version]}),r.endpoints&&(0,w.jsxs)(u.EY,{size:"small",color:"secondary",children:[r.endpoints," endpoint",1!==r.endpoints?"s":""]})]}),(0,w.jsx)(u.so,{justify:"end",style:{padding:x.w.spacing[3]},children:(0,w.jsx)(p.A,{size:20,color:x.w.colors.primary.yellow})})]},o))}):(0,w.jsxs)(z,{children:[(0,w.jsx)(l.A,{size:48,color:x.w.colors.text.secondary}),(0,w.jsx)(u.H2,{color:"secondary",style:{marginTop:x.w.spacing[4]},children:"No APIs Found"}),(0,w.jsx)(u.EY,{color:"secondary",children:I||L?"Try adjusting your filters or search query.":"This repository does not contain any API specifications."})]})]})})]})}}}]);
//# sourceMappingURL=95.84d81158.chunk.js.map