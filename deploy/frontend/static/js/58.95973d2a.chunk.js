"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[58],{89058:(e,r,t)=>{t.r(r),t.d(r,{default:()=>D});var o=t(65043),s=t(73216),n=t(35475),i=t(5464),a=t(53714),l=t(72313),c=t(7104),d=t(87978),p=t(64830),h=t(39292),m=t(21617),g=t(50577),u=t(84917),y=(t(52242),t(70579));const x=i.Ay.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.primary};
`,b=i.Ay.div`
  width: 320px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`,j=i.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,w=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,$=i.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,f=i.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  background: ${e=>e.theme.colors.background.primary};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,v=i.Ay.button`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[4]};
  background: ${e=>e.active?m.w.colors.primary.yellow:"transparent"};
  color: ${e=>e.active?m.w.colors.primary.black:m.w.colors.text.secondary};
  border: 1px solid ${e=>e.active?m.w.colors.primary.yellow:"transparent"};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.active?m.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,E=i.Ay.div`
  position: relative;
  padding: ${e=>e.theme.spacing[4]};
`,k=(0,i.Ay)(g.pd)`
  padding-left: ${e=>e.theme.spacing[10]};
  background: ${e=>e.theme.colors.background.primary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,A=(0,i.Ay)(h.A)`
  position: absolute;
  left: ${e=>e.theme.spacing[7]};
  top: 50%;
  transform: translateY(-50%);
  color: ${e=>e.theme.colors.text.secondary};
`,S=i.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[4]};
`,C=i.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[2]};
  background: ${e=>e.active?m.w.colors.primary.yellow:m.w.colors.background.primary};
  color: ${e=>e.active?m.w.colors.primary.black:m.w.colors.text.primary};
  border: 1px solid ${e=>e.active?m.w.colors.primary.yellow:m.w.colors.border.light};
  border-left: 4px solid ${e=>{switch(e.dataType){case"OpenAPI":return"#FF6B6B";case"GraphQL":return"#E90C59";case"gRPC":return"#00A67E";case"Postman":return"#FF6500";default:return m.w.colors.primary.yellow}}};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.active?m.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
    transform: translateX(2px);
  }
`,R=(0,i.Ay)(g.Zp)`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,O=i.Ay.select`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  border: none;
  border-radius: ${e=>e.theme.borderRadius.md};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  cursor: pointer;
`,T=(0,i.Ay)(g.pd)`
  flex: 1;
  font-family: ${e=>e.theme.typography.fontFamily.mono};
`,L=i.Ay.div`
  margin-top: ${e=>e.theme.spacing[4]};
`,P=i.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  margin-bottom: ${e=>e.theme.spacing[2]};
`,z=i.Ay.textarea`
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
`,B=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  overflow: hidden;
`,q=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`,H=i.Ay.pre`
  padding: ${e=>e.theme.spacing[4]};
  margin: 0;
  overflow: auto;
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${e=>e.theme.colors.text.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
`,Y=(0,i.Ay)(g.Ex)`
  background: ${e=>e.status?e.status>=200&&e.status<300?"#10B981":e.status>=400?"#EF4444":"#F59E0B":m.w.colors.secondary.mediumGray};
  color: white;
`,F=i.Ay.div`
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
`,I=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  cursor: pointer;
  
  &:hover {
    background: ${e=>e.theme.colors.background.primary};
  }
`,U=i.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  margin-top: auto;
`,D=()=>{const{repoName:e}=(0,s.g)(),[r,t]=(0,n.ok)(),[i,h]=(0,o.useState)([]),[D,N]=(0,o.useState)(null),[_,G]=(0,o.useState)(!0),[J,W]=(0,o.useState)(null),[X,Q]=(0,o.useState)(""),[Z,M]=(0,o.useState)("explorer"),[K,V]=(0,o.useState)("GET"),[ee,re]=(0,o.useState)(""),[te,oe]=(0,o.useState)({"Content-Type":"application/json"}),[se,ne]=(0,o.useState)(""),[ie,ae]=(0,o.useState)(null),[le,ce]=(0,o.useState)(!1),[de,pe]=(0,o.useState)([]),[he,me]=(0,o.useState)(!1),[ge,ue]=(0,o.useState)([{name:"Development",variables:{BASE_URL:"http://localhost:3000"}},{name:"Production",variables:{BASE_URL:"https://api.example.com"}}]),[ye,xe]=(0,o.useState)(ge[0]);(0,o.useEffect)(()=>{be(),we()},[e]),(0,o.useEffect)(()=>{const e=r.get("api");if(e&&i.length>0){const r=i.find(r=>r.path===e);r&&je(r)}},[i,r]);const be=async()=>{try{var r,t,o;const s=await fetch(`/api/detect-apis/${e}`);if(!s.ok)throw new Error("Failed to fetch APIs");const n=await s.json(),i=[];null!==(r=n.apis)&&void 0!==r&&r.rest&&n.apis.rest.forEach(e=>{i.push({name:e.title||e.file.split("/").pop().replace(/\.(yaml|yml|json)$/i,""),path:e.file,type:"OpenAPI",version:e.version,description:e.description})}),null!==(t=n.apis)&&void 0!==t&&t.graphql&&n.apis.graphql.forEach(e=>{i.push({name:e.title||e.file.split("/").pop().replace(/\.(graphql|gql)$/i,""),path:e.file,type:"GraphQL",description:e.description})}),null!==(o=n.apis)&&void 0!==o&&o.grpc&&n.apis.grpc.forEach(e=>{i.push({name:e.title||e.file.split("/").pop().replace(/\.proto$/i,""),path:e.file,type:"gRPC",description:e.description})});const a=await fetch(`/api/repository/${e}/postman-collections`);if(a.ok){(await a.json()).forEach(e=>{i.push({name:e.name,path:e.path,type:"Postman",description:"Postman Collection"})})}h(i)}catch(s){W(s instanceof Error?s.message:"Unknown error")}finally{G(!1)}},je=async r=>{N(r),t({api:r.path});try{const t=await fetch(`/api/repository/${e}/file?path=${encodeURIComponent(r.path)}`);if(!t.ok)throw new Error("Failed to load API content");const i=await t.text();if(r.content=i,"OpenAPI"===r.type)try{const e=JSON.parse(i),r=Object.keys(e.paths||{})[0];if(r){var o,s;const t=Object.keys(e.paths[r])[0];V(t.toUpperCase()),re(`${(null===(o=e.servers)||void 0===o||null===(s=o[0])||void 0===s?void 0:s.url)||"{{BASE_URL}}"}${r}`)}}catch(n){}else"GraphQL"===r.type&&(V("POST"),re("{{BASE_URL}}/graphql"),ne("query {\n  # Your GraphQL query here\n}"))}catch(i){}},we=()=>{const r=localStorage.getItem(`api-history-${e}`);if(r)try{pe(JSON.parse(r))}catch(t){}},$e=e=>{let r=ee;switch(Object.entries(ye.variables).forEach(e=>{let[t,o]=e;r=r.replace(`{{${t}}}`,o)}),e){case"curl":return`curl -X ${K} "${r}" \\\n${Object.entries(te).map(e=>{let[r,t]=e;return`  -H "${r}: ${t}"`}).join(" \\\n")}${se?` \\\n  -d '${se}'`:""}`;case"javascript":return`fetch("${r}", {\n  method: "${K}",\n  headers: ${JSON.stringify(te,null,2)},${se?`\n  body: ${JSON.stringify(se)}`:""}\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;case"python":return`import requests\n\nresponse = requests.${K.toLowerCase()}(\n    "${r}",\n    headers=${JSON.stringify(te,null,2).replace(/"/g,"'")},${se?`\n    json=${se}`:""}\n)\n\nprint(response.json())`;default:return""}},fe=i.filter(e=>e.name.toLowerCase().includes(X.toLowerCase())||e.path.toLowerCase().includes(X.toLowerCase())||e.description&&e.description.toLowerCase().includes(X.toLowerCase()));return _?(0,y.jsx)(g.Hh,{text:"Loading API Explorer..."}):J?(0,y.jsx)(g.mc,{maxWidth:"lg",children:(0,y.jsxs)(g.wn,{children:[(0,y.jsx)(g.H1,{color:"secondary",children:"Error Loading APIs"}),(0,y.jsx)(g.EY,{color:"secondary",children:J}),(0,y.jsx)(g.$n,{as:n.N_,to:"/",children:"Return to Home"})]})}):(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(x,{children:[(0,y.jsxs)(b,{children:[(0,y.jsxs)(E,{children:[(0,y.jsx)(A,{size:20}),(0,y.jsx)(k,{type:"text",placeholder:"Search APIs...",value:X,onChange:e=>Q(e.target.value)})]}),(0,y.jsx)(S,{children:fe.map((e,r)=>(0,y.jsxs)(C,{active:(null===D||void 0===D?void 0:D.path)===e.path,dataType:e.type,onClick:()=>je(e),children:[(0,y.jsxs)(g.so,{align:"center",justify:"between",style:{marginBottom:m.w.spacing[2]},children:[(0,y.jsx)(g.EY,{weight:"semibold",children:e.name}),(0,y.jsx)(g.Ex,{children:e.type})]}),(0,y.jsx)(g.EY,{size:"small",color:"secondary",children:e.path}),e.description&&(0,y.jsx)(g.EY,{size:"small",style:{marginTop:m.w.spacing[1]},children:e.description})]},r))}),(0,y.jsxs)(U,{children:[(0,y.jsx)(g.EY,{weight:"semibold",style:{marginBottom:m.w.spacing[2]},children:"Environment"}),(0,y.jsx)("select",{value:ye.name,onChange:e=>xe(ge.find(r=>r.name===e.target.value)||ge[0]),style:{width:"100%",padding:m.w.spacing[2],background:m.w.colors.background.primary,color:m.w.colors.text.primary,border:`1px solid ${e=>e.theme.colors.border.light}`,borderRadius:m.w.borderRadius.md},children:ge.map(e=>(0,y.jsx)("option",{value:e.name,children:e.name},e.name))})]})]}),(0,y.jsxs)(j,{children:[(0,y.jsx)(w,{children:(0,y.jsxs)(g.so,{align:"center",justify:"between",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)(g.H2,{style:{margin:0},children:D?D.name:"Select an API"}),D&&(0,y.jsxs)(g.EY,{color:"secondary",style:{marginTop:m.w.spacing[1]},children:[D.type," \u2022 ",D.version||"Latest"]})]}),(0,y.jsxs)(g.so,{gap:2,children:[(0,y.jsxs)(g.$n,{variant:"outline",onClick:()=>me(!he),children:[(0,y.jsx)(d.A,{size:20}),"History"]}),(0,y.jsxs)(g.$n,{variant:"outline",onClick:()=>M("snippets"),children:[(0,y.jsx)(a.A,{size:20}),"Code"]})]})]})}),(0,y.jsxs)(f,{children:[(0,y.jsx)(v,{active:"explorer"===Z,onClick:()=>M("explorer"),children:"API Explorer"}),(0,y.jsx)(v,{active:"history"===Z,onClick:()=>M("history"),children:"Request History"}),(0,y.jsx)(v,{active:"snippets"===Z,onClick:()=>M("snippets"),children:"Code Snippets"})]}),(0,y.jsxs)($,{children:["explorer"===Z&&D&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(R,{children:[(0,y.jsx)(g.aR,{children:(0,y.jsx)(g.ZB,{children:"Request"})}),(0,y.jsxs)(g.Wu,{children:[(0,y.jsxs)(g.so,{gap:2,style:{marginBottom:m.w.spacing[4]},children:[(0,y.jsxs)(O,{value:K,onChange:e=>V(e.target.value),children:[(0,y.jsx)("option",{value:"GET",children:"GET"}),(0,y.jsx)("option",{value:"POST",children:"POST"}),(0,y.jsx)("option",{value:"PUT",children:"PUT"}),(0,y.jsx)("option",{value:"PATCH",children:"PATCH"}),(0,y.jsx)("option",{value:"DELETE",children:"DELETE"})]}),(0,y.jsx)(T,{type:"text",value:ee,onChange:e=>re(e.target.value),placeholder:"Enter request URL..."}),(0,y.jsx)(g.$n,{onClick:async()=>{ce(!0);const r=Date.now();try{let t=ee;Object.entries(ye.variables).forEach(e=>{let[r,o]=e;t=t.replace(`{{${r}}}`,o)});"GET"!==K&&"HEAD"!==K&&se&&({method:K,headers:te}.body=se),await new Promise(e=>setTimeout(e,500));const o={status:200,statusText:"OK",headers:{"content-type":"application/json","x-request-id":Math.random().toString(36).substr(2,9)},data:{message:"This is a simulated response",timestamp:(new Date).toISOString(),endpoint:t,method:K}};ae(o);const s=[{id:Date.now().toString(),timestamp:Date.now(),method:K,url:t,headers:te,body:se||void 0,response:o,apiType:(null===D||void 0===D?void 0:D.type)||"Unknown",duration:Date.now()-r},...de].slice(0,50);pe(s),localStorage.setItem(`api-history-${e}`,JSON.stringify(s))}catch(t){ae({status:0,error:t instanceof Error?t.message:"Request failed"})}finally{ce(!1)}},disabled:le||!ee,children:le?"Sending...":(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(p.A,{size:20}),"Send"]})})]}),(0,y.jsxs)(L,{children:[(0,y.jsx)(g.EY,{weight:"semibold",style:{marginBottom:m.w.spacing[2]},children:"Headers"}),Object.entries(te).map((e,r)=>{let[t,o]=e;return(0,y.jsxs)(P,{children:[(0,y.jsx)(g.pd,{type:"text",value:t,placeholder:"Header name",onChange:e=>{const r={...te};delete r[t],r[e.target.value]=o,oe(r)}}),(0,y.jsx)(g.pd,{type:"text",value:o,placeholder:"Header value",onChange:e=>{oe({...te,[t]:e.target.value})}})]},r)}),(0,y.jsx)(g.$n,{size:"sm",variant:"outline",onClick:()=>oe({...te,"":""}),children:"Add Header"})]}),"GET"!==K&&"HEAD"!==K&&(0,y.jsxs)("div",{style:{marginTop:m.w.spacing[4]},children:[(0,y.jsx)(g.EY,{weight:"semibold",style:{marginBottom:m.w.spacing[2]},children:"Body"}),(0,y.jsx)(z,{value:se,onChange:e=>ne(e.target.value),placeholder:"Request body (JSON, XML, etc.)"})]})]})]}),ie&&(0,y.jsxs)(B,{children:[(0,y.jsxs)(q,{children:[(0,y.jsxs)(g.so,{align:"center",gap:3,children:[(0,y.jsx)(g.EY,{weight:"semibold",children:"Response"}),(0,y.jsxs)(Y,{status:ie.status,children:[ie.status," ",ie.statusText]}),ie.duration&&(0,y.jsxs)(g.EY,{size:"small",color:"secondary",children:[ie.duration,"ms"]})]}),(0,y.jsxs)(g.$n,{size:"sm",variant:"outline",onClick:()=>{const e=new Blob([JSON.stringify(ie.data,null,2)],{type:"application/json"}),r=URL.createObjectURL(e),t=document.createElement("a");t.href=r,t.download="response.json",t.click()},children:[(0,y.jsx)(c.A,{size:16}),"Download"]})]}),(0,y.jsx)(H,{children:JSON.stringify(ie.data||ie.error,null,2)})]}),"OpenAPI"===D.type&&D.content&&(0,y.jsx)("div",{style:{marginTop:m.w.spacing[6]},children:(0,y.jsx)(u.A,{spec:D.content,docExpansion:"list",defaultModelsExpandDepth:1,displayRequestDuration:!0,tryItOutEnabled:!0})})]}),"snippets"===Z&&D&&(0,y.jsxs)("div",{children:[(0,y.jsx)(g.H3,{children:"Code Snippets"}),(0,y.jsx)(g.EY,{color:"secondary",style:{marginBottom:m.w.spacing[4]},children:"Copy code snippets for your favorite language"}),["curl","javascript","python"].map(e=>(0,y.jsxs)(g.Zp,{style:{marginBottom:m.w.spacing[4]},children:[(0,y.jsx)(g.aR,{children:(0,y.jsxs)(g.so,{align:"center",justify:"between",children:[(0,y.jsx)(g.ZB,{children:e.charAt(0).toUpperCase()+e.slice(1)}),(0,y.jsxs)(g.$n,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard.writeText($e(e))},children:[(0,y.jsx)(l.A,{size:16}),"Copy"]})]})}),(0,y.jsx)(g.Wu,{children:(0,y.jsx)("pre",{style:{background:m.w.colors.background.secondary,padding:m.w.spacing[3],borderRadius:m.w.borderRadius.md,overflow:"auto",fontSize:m.w.typography.fontSize.sm,fontFamily:m.w.typography.fontFamily.mono},children:$e(e)})})]},e))]})]})]})]}),(0,y.jsx)(F,{isOpen:he,children:(0,y.jsxs)("div",{style:{padding:m.w.spacing[4]},children:[(0,y.jsxs)(g.so,{align:"center",justify:"between",style:{marginBottom:m.w.spacing[4]},children:[(0,y.jsx)(g.H3,{children:"Request History"}),(0,y.jsx)(g.$n,{size:"sm",variant:"ghost",onClick:()=>me(!1),children:"\u2715"})]}),0===de.length?(0,y.jsx)(g.EY,{color:"secondary",children:"No requests yet"}):de.map(e=>{var r,t;return(0,y.jsxs)(I,{onClick:()=>(e=>{V(e.method),re(e.url),oe(e.headers),ne(e.body||""),me(!1)})(e),children:[(0,y.jsxs)(g.so,{align:"center",justify:"between",style:{marginBottom:m.w.spacing[1]},children:[(0,y.jsxs)(g.EY,{weight:"semibold",children:[e.method," ",e.apiType]}),(0,y.jsx)(Y,{status:null===(r=e.response)||void 0===r?void 0:r.status,children:(null===(t=e.response)||void 0===t?void 0:t.status)||"Error"})]}),(0,y.jsx)(g.EY,{size:"small",color:"secondary",children:new URL(e.url).pathname}),(0,y.jsx)(g.EY,{size:"small",color:"secondary",children:new Date(e.timestamp).toLocaleString()})]},e.id)})]})})]})}}}]);
//# sourceMappingURL=58.95973d2a.chunk.js.map