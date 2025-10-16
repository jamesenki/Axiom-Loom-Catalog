"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[58],{89058:(e,r,t)=>{t.r(r),t.d(r,{default:()=>N});var o=t(65043),s=t(73216),a=t(35475),n=t(5464),i=t(72362),l=t(53714),c=t(72313),d=t(7104),p=t(87978),h=t(64830),m=t(39292),g=t(21617),u=t(13689),y=t(30169),x=(t(52242),t(70579));const b=n.Ay.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.primary};
`,j=n.Ay.div`
  width: 320px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`,w=n.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,$=n.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,f=n.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,v=n.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  background: ${e=>e.theme.colors.background.primary};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,E=n.Ay.button`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[4]};
  background: ${e=>e.active?g.w.colors.primary.yellow:"transparent"};
  color: ${e=>e.active?g.w.colors.primary.black:g.w.colors.text.secondary};
  border: 1px solid ${e=>e.active?g.w.colors.primary.yellow:"transparent"};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.active?g.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,k=n.Ay.div`
  position: relative;
  padding: ${e=>e.theme.spacing[4]};
`,A=(0,n.Ay)(u.pd)`
  padding-left: ${e=>e.theme.spacing[10]};
  background: ${e=>e.theme.colors.background.primary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,S=(0,n.Ay)(m.A)`
  position: absolute;
  left: ${e=>e.theme.spacing[7]};
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.colors.text.secondary};
`,C=n.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[4]};
`,R=n.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[2]};
  background: ${e=>e.active?g.w.colors.primary.yellow:g.w.colors.background.primary};
  color: ${e=>e.active?g.w.colors.primary.black:g.w.colors.text.primary};
  border: 1px solid ${e=>e.active?g.w.colors.primary.yellow:g.w.colors.border.light};
  border-left: 4px solid ${e=>{switch(e.dataType){case"OpenAPI":return"#FF6B6B";case"GraphQL":return"#E90C59";case"gRPC":return"#00A67E";case"Postman":return"#FF6500";default:return g.w.colors.primary.yellow}}};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.active?g.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
    transform: translateX(2px);
  }
`,O=(0,n.Ay)(u.Zp)`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,T=n.Ay.select`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  border: none;
  border-radius: ${e=>e.theme.borderRadius.md};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  cursor: pointer;
`,L=(0,n.Ay)(u.pd)`
  flex: 1;
  font-family: ${e=>e.theme.typography.fontFamily.mono};
`,P=n.Ay.div`
  margin-top: ${e=>e.theme.spacing[4]};
`,z=n.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  margin-bottom: ${e=>e.theme.spacing[2]};
`,B=n.Ay.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.secondary};
  color: ${e=>e.theme.colors.text.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,q=n.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  overflow: hidden;
`,H=n.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Y=n.Ay.pre`
  padding: ${e=>e.theme.spacing[4]};
  margin: 0;
  overflow: auto;
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${e=>e.theme.colors.text.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
`,F=(0,n.Ay)(u.Ex)`
  background: ${e=>e.status?e.status>=200&&e.status<300?"#10B981":e.status>=400?"#EF4444":"#F59E0B":g.w.colors.secondary.mediumGray};
  color: white;
`,I=n.Ay.div`
  position: fixed;
  right: 0;
  top: 60px;
  width: 400px;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.secondary};
  border-left: 1px solid ${e=>e.theme.colors.border.light};
  transform: ${e=>e.isOpen?"translateX(0)":"translateX(100%)"};
  transition: transform 0.3s ease;
  z-index: 100;
  overflow-y: auto;
`,U=n.Ay.div`
  padding: ${e=>e.theme.spacing[3]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  cursor: pointer;
  
  &:hover {
    background: ${e=>e.theme.colors.background.primary};
  }
`,D=n.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  margin-top: auto;
`,N=()=>{const{repoName:e}=(0,s.g)(),[r,t]=(0,a.ok)(),[n,m]=(0,o.useState)([]),[N,G]=(0,o.useState)(null),[J,_]=(0,o.useState)(!0),[W,X]=(0,o.useState)(null),[Q,Z]=(0,o.useState)(""),[M,K]=(0,o.useState)("explorer"),[V,ee]=(0,o.useState)("GET"),[re,te]=(0,o.useState)(""),[oe,se]=(0,o.useState)({"Content-Type":"application/json"}),[ae,ne]=(0,o.useState)(""),[ie,le]=(0,o.useState)(null),[ce,de]=(0,o.useState)(!1),[pe,he]=(0,o.useState)([]),[me,ge]=(0,o.useState)(!1),[ue,ye]=(0,o.useState)([{name:"Development",variables:{BASE_URL:"http://localhost:3000"}},{name:"Production",variables:{BASE_URL:"https://api.example.com"}}]),[xe,be]=(0,o.useState)(ue[0]);(0,o.useEffect)(()=>{je(),$e()},[e]),(0,o.useEffect)(()=>{const e=r.get("api");if(e&&n.length>0){const r=n.find(r=>r.path===e);r&&we(r)}},[n,r]);const je=async()=>{try{var r,t,o;const s=await fetch((0,i.e9)(`/api/detect-apis/${e}`));if(!s.ok)throw new Error("Failed to fetch APIs");const a=await s.json(),n=[];null!==(r=a.apis)&&void 0!==r&&r.rest&&a.apis.rest.forEach(e=>{n.push({name:e.title||e.file.split("/").pop().replace(/\.(yaml|yml|json)$/i,""),path:e.file,type:"OpenAPI",version:e.version,description:e.description})}),null!==(t=a.apis)&&void 0!==t&&t.graphql&&a.apis.graphql.forEach(e=>{n.push({name:e.title||e.file.split("/").pop().replace(/\.(graphql|gql)$/i,""),path:e.file,type:"GraphQL",description:e.description})}),null!==(o=a.apis)&&void 0!==o&&o.grpc&&a.apis.grpc.forEach(e=>{n.push({name:e.title||e.file.split("/").pop().replace(/\.proto$/i,""),path:e.file,type:"gRPC",description:e.description})});const l=await fetch((0,i.e9)(`/api/repository/${e}/postman-collections`));if(l.ok){(await l.json()).forEach(e=>{n.push({name:e.name,path:e.path,type:"Postman",description:"Postman Collection"})})}m(n)}catch(s){X(s instanceof Error?s.message:"Unknown error")}finally{_(!1)}},we=async r=>{G(r),t({api:r.path});try{const t=await fetch((0,i.e9)(`/api/repository/${e}/file?path=${encodeURIComponent(r.path)}`));if(!t.ok)throw new Error("Failed to load API content");const n=await t.text();if(r.content=n,"OpenAPI"===r.type)try{const e=JSON.parse(n),r=Object.keys(e.paths||{})[0];if(r){var o,s;const t=Object.keys(e.paths[r])[0];ee(t.toUpperCase()),te(`${(null===(o=e.servers)||void 0===o||null===(s=o[0])||void 0===s?void 0:s.url)||"{{BASE_URL}}"}${r}`)}}catch(a){}else"GraphQL"===r.type&&(ee("POST"),te("{{BASE_URL}}/graphql"),ne("query {\n  # Your GraphQL query here\n}"))}catch(n){}},$e=()=>{const r=localStorage.getItem(`api-history-${e}`);if(r)try{he(JSON.parse(r))}catch(t){}},fe=e=>{let r=re;switch(Object.entries(xe.variables).forEach(e=>{let[t,o]=e;r=r.replace(`{{${t}}}`,o)}),e){case"curl":return`curl -X ${V} "${r}" \\\n${Object.entries(oe).map(e=>{let[r,t]=e;return`  -H "${r}: ${t}"`}).join(" \\\n")}${ae?` \\\n  -d '${ae}'`:""}`;case"javascript":return`fetch("${r}", {\n  method: "${V}",\n  headers: ${JSON.stringify(oe,null,2)},${ae?`\n  body: ${JSON.stringify(ae)}`:""}\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;case"python":return`import requests\n\nresponse = requests.${V.toLowerCase()}(\n    "${r}",\n    headers=${JSON.stringify(oe,null,2).replace(/"/g,"'")},${ae?`\n    json=${ae}`:""}\n)\n\nprint(response.json())`;default:return""}},ve=n.filter(e=>e.name.toLowerCase().includes(Q.toLowerCase())||e.path.toLowerCase().includes(Q.toLowerCase())||e.description&&e.description.toLowerCase().includes(Q.toLowerCase()));return J?(0,x.jsx)(u.Hh,{text:"Loading API Explorer..."}):W?(0,x.jsx)(u.mc,{maxWidth:"lg",children:(0,x.jsxs)(u.wn,{children:[(0,x.jsx)(u.H1,{color:"secondary",children:"Error Loading APIs"}),(0,x.jsx)(u.EY,{color:"secondary",children:W}),(0,x.jsx)(u.$n,{as:a.N_,to:"/",children:"Return to Home"})]})}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(b,{children:[(0,x.jsxs)(j,{children:[(0,x.jsxs)(k,{children:[(0,x.jsx)(S,{size:20}),(0,x.jsx)(A,{type:"text",placeholder:"Search APIs...",value:Q,onChange:e=>Z(e.target.value)})]}),(0,x.jsx)(C,{children:ve.map((e,r)=>(0,x.jsxs)(R,{active:(null===N||void 0===N?void 0:N.path)===e.path,dataType:e.type,onClick:()=>we(e),children:[(0,x.jsxs)(u.so,{align:"center",justify:"between",style:{marginBottom:g.w.spacing[2]},children:[(0,x.jsx)(u.EY,{weight:"semibold",children:e.name}),(0,x.jsx)(u.Ex,{children:e.type})]}),(0,x.jsx)(u.EY,{size:"small",color:"secondary",children:e.path}),e.description&&(0,x.jsx)(u.EY,{size:"small",style:{marginTop:g.w.spacing[1]},children:e.description})]},r))}),(0,x.jsxs)(D,{children:[(0,x.jsx)(u.EY,{weight:"semibold",style:{marginBottom:g.w.spacing[2]},children:"Environment"}),(0,x.jsx)("select",{value:xe.name,onChange:e=>be(ue.find(r=>r.name===e.target.value)||ue[0]),style:{width:"100%",padding:g.w.spacing[2],background:g.w.colors.background.primary,color:g.w.colors.text.primary,border:`1px solid ${e=>e.theme.colors.border.light}`,borderRadius:g.w.borderRadius.md},children:ue.map(e=>(0,x.jsx)("option",{value:e.name,children:e.name},e.name))})]})]}),(0,x.jsxs)(w,{children:[(0,x.jsx)($,{children:(0,x.jsxs)(u.so,{align:"center",justify:"between",children:[(0,x.jsxs)("div",{children:[(0,x.jsx)(u.H2,{style:{margin:0},children:N?N.name:"Select an API"}),N&&(0,x.jsxs)(u.EY,{color:"secondary",style:{marginTop:g.w.spacing[1]},children:[N.type," \u2022 ",N.version||"Latest"]})]}),(0,x.jsxs)(u.so,{gap:2,children:[(0,x.jsxs)(u.$n,{variant:"outline",onClick:()=>ge(!me),children:[(0,x.jsx)(p.A,{size:20}),"History"]}),(0,x.jsxs)(u.$n,{variant:"outline",onClick:()=>K("snippets"),children:[(0,x.jsx)(l.A,{size:20}),"Code"]})]})]})}),(0,x.jsxs)(v,{children:[(0,x.jsx)(E,{active:"explorer"===M,onClick:()=>K("explorer"),children:"API Explorer"}),(0,x.jsx)(E,{active:"history"===M,onClick:()=>K("history"),children:"Request History"}),(0,x.jsx)(E,{active:"snippets"===M,onClick:()=>K("snippets"),children:"Code Snippets"})]}),(0,x.jsxs)(f,{children:["explorer"===M&&N&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(O,{children:[(0,x.jsx)(u.aR,{children:(0,x.jsx)(u.ZB,{children:"Request"})}),(0,x.jsxs)(u.Wu,{children:[(0,x.jsxs)(u.so,{gap:2,style:{marginBottom:g.w.spacing[4]},children:[(0,x.jsxs)(T,{value:V,onChange:e=>ee(e.target.value),children:[(0,x.jsx)("option",{value:"GET",children:"GET"}),(0,x.jsx)("option",{value:"POST",children:"POST"}),(0,x.jsx)("option",{value:"PUT",children:"PUT"}),(0,x.jsx)("option",{value:"PATCH",children:"PATCH"}),(0,x.jsx)("option",{value:"DELETE",children:"DELETE"})]}),(0,x.jsx)(L,{type:"text",value:re,onChange:e=>te(e.target.value),placeholder:"Enter request URL..."}),(0,x.jsx)(u.$n,{onClick:async()=>{de(!0);const r=Date.now();try{let t=re;Object.entries(xe.variables).forEach(e=>{let[r,o]=e;t=t.replace(`{{${r}}}`,o)});"GET"!==V&&"HEAD"!==V&&ae&&({method:V,headers:oe}.body=ae),await new Promise(e=>setTimeout(e,500));const o={status:200,statusText:"OK",headers:{"content-type":"application/json","x-request-id":Math.random().toString(36).substr(2,9)},data:{message:"This is a simulated response",timestamp:(new Date).toISOString(),endpoint:t,method:V}};le(o);const s=[{id:Date.now().toString(),timestamp:Date.now(),method:V,url:t,headers:oe,body:ae||void 0,response:o,apiType:(null===N||void 0===N?void 0:N.type)||"Unknown",duration:Date.now()-r},...pe].slice(0,50);he(s),localStorage.setItem(`api-history-${e}`,JSON.stringify(s))}catch(t){le({status:0,error:t instanceof Error?t.message:"Request failed"})}finally{de(!1)}},disabled:ce||!re,children:ce?"Sending...":(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(h.A,{size:20}),"Send"]})})]}),(0,x.jsxs)(P,{children:[(0,x.jsx)(u.EY,{weight:"semibold",style:{marginBottom:g.w.spacing[2]},children:"Headers"}),Object.entries(oe).map((e,r)=>{let[t,o]=e;return(0,x.jsxs)(z,{children:[(0,x.jsx)(u.pd,{type:"text",value:t,placeholder:"Header name",onChange:e=>{const r={...oe};delete r[t],r[e.target.value]=o,se(r)}}),(0,x.jsx)(u.pd,{type:"text",value:o,placeholder:"Header value",onChange:e=>{se({...oe,[t]:e.target.value})}})]},r)}),(0,x.jsx)(u.$n,{size:"sm",variant:"outline",onClick:()=>se({...oe,"":""}),children:"Add Header"})]}),"GET"!==V&&"HEAD"!==V&&(0,x.jsxs)("div",{style:{marginTop:g.w.spacing[4]},children:[(0,x.jsx)(u.EY,{weight:"semibold",style:{marginBottom:g.w.spacing[2]},children:"Body"}),(0,x.jsx)(B,{value:ae,onChange:e=>ne(e.target.value),placeholder:"Request body (JSON, XML, etc.)"})]})]})]}),ie&&(0,x.jsxs)(q,{children:[(0,x.jsxs)(H,{children:[(0,x.jsxs)(u.so,{align:"center",gap:3,children:[(0,x.jsx)(u.EY,{weight:"semibold",children:"Response"}),(0,x.jsxs)(F,{status:ie.status,children:[ie.status," ",ie.statusText]}),ie.duration&&(0,x.jsxs)(u.EY,{size:"small",color:"secondary",children:[ie.duration,"ms"]})]}),(0,x.jsxs)(u.$n,{size:"sm",variant:"outline",onClick:()=>{const e=new Blob([JSON.stringify(ie.data,null,2)],{type:"application/json"}),r=URL.createObjectURL(e),t=document.createElement("a");t.href=r,t.download="response.json",t.click()},children:[(0,x.jsx)(d.A,{size:16}),"Download"]})]}),(0,x.jsx)(Y,{children:JSON.stringify(ie.data||ie.error,null,2)})]}),"OpenAPI"===N.type&&N.content&&(0,x.jsx)("div",{style:{marginTop:g.w.spacing[6]},children:(0,x.jsx)(y.A,{spec:N.content,docExpansion:"list",defaultModelsExpandDepth:1,displayRequestDuration:!0,tryItOutEnabled:!0})})]}),"snippets"===M&&N&&(0,x.jsxs)("div",{children:[(0,x.jsx)(u.H3,{children:"Code Snippets"}),(0,x.jsx)(u.EY,{color:"secondary",style:{marginBottom:g.w.spacing[4]},children:"Copy code snippets for your favorite language"}),["curl","javascript","python"].map(e=>(0,x.jsxs)(u.Zp,{style:{marginBottom:g.w.spacing[4]},children:[(0,x.jsx)(u.aR,{children:(0,x.jsxs)(u.so,{align:"center",justify:"between",children:[(0,x.jsx)(u.ZB,{children:e.charAt(0).toUpperCase()+e.slice(1)}),(0,x.jsxs)(u.$n,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard.writeText(fe(e))},children:[(0,x.jsx)(c.A,{size:16}),"Copy"]})]})}),(0,x.jsx)(u.Wu,{children:(0,x.jsx)("pre",{style:{background:g.w.colors.background.secondary,padding:g.w.spacing[3],borderRadius:g.w.borderRadius.md,overflow:"auto",fontSize:g.w.typography.fontSize.sm,fontFamily:g.w.typography.fontFamily.mono},children:fe(e)})})]},e))]})]})]})]}),(0,x.jsx)(I,{isOpen:me,children:(0,x.jsxs)("div",{style:{padding:g.w.spacing[4]},children:[(0,x.jsxs)(u.so,{align:"center",justify:"between",style:{marginBottom:g.w.spacing[4]},children:[(0,x.jsx)(u.H3,{children:"Request History"}),(0,x.jsx)(u.$n,{size:"sm",variant:"ghost",onClick:()=>ge(!1),children:"\u2715"})]}),0===pe.length?(0,x.jsx)(u.EY,{color:"secondary",children:"No requests yet"}):pe.map(e=>{var r,t;return(0,x.jsxs)(U,{onClick:()=>(e=>{ee(e.method),te(e.url),se(e.headers),ne(e.body||""),ge(!1)})(e),children:[(0,x.jsxs)(u.so,{align:"center",justify:"between",style:{marginBottom:g.w.spacing[1]},children:[(0,x.jsxs)(u.EY,{weight:"semibold",children:[e.method," ",e.apiType]}),(0,x.jsx)(F,{status:null===(r=e.response)||void 0===r?void 0:r.status,children:(null===(t=e.response)||void 0===t?void 0:t.status)||"Error"})]}),(0,x.jsx)(u.EY,{size:"small",color:"secondary",children:new URL(e.url).pathname}),(0,x.jsx)(u.EY,{size:"small",color:"secondary",children:new Date(e.timestamp).toLocaleString()})]},e.id)})]})})]})}}}]);
//# sourceMappingURL=58.3c4d0a00.chunk.js.map