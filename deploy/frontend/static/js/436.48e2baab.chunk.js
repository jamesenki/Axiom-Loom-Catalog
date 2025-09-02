"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[436],{51436:(e,a,r)=>{r.r(a),r.d(a,{default:()=>w});var i=r(65043),n=r(5464),t=r(66382),o=r(50122),s=r(72362),d=r(70579);const c=n.Ay.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
`,l=n.Ay.div`
  margin-bottom: 32px;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 28px;
    color: #2e3440;
  }
  
  p {
    margin: 0;
    color: #6c757d;
    font-size: 16px;
  }
`,p=n.Ay.div`
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`,x=n.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 20px;
    color: #2e3440;
  }
`,h=n.Ay.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${e=>{switch(e.variant){case"danger":return"\n          background: #dc3545;\n          color: white;\n          &:hover { background: #c82333; }\n        ";case"secondary":return"\n          background: #f0f0f0;\n          color: #333;\n          &:hover { background: #e0e0e0; }\n        ";default:return"\n          background: #0066cc;\n          color: white;\n          &:hover { background: #0052a3; }\n        "}}}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,u=n.Ay.form`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`,g=n.Ay.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`,y=n.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,m=n.Ay.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 16px;
`,f=n.Ay.div`
  flex: 1;
  
  .name {
    font-weight: 600;
    color: #2e3440;
    margin-bottom: 4px;
  }
  
  .details {
    font-size: 13px;
    color: #6c757d;
  }
  
  .key {
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 13px;
    background: #e7f3ff;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 8px 0;
    word-break: break-all;
  }
`,b=n.Ay.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 16px;
  color: #155724;
  margin-bottom: 20px;
  
  .warning {
    font-weight: 600;
    margin-top: 8px;
    display: block;
  }
`,j=n.Ay.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 12px 16px;
  color: #c00;
  margin-bottom: 16px;
`,k=n.Ay.div`
  text-align: center;
  padding: 48px;
  color: #6c757d;
  
  p {
    margin: 0 0 16px 0;
  }
`,A=n.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
`,v=n.Ay.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
  
  span {
    font-size: 14px;
    color: #2e3440;
  }
`,w=()=>{const e=(0,t.A)(),a=null===e||void 0===e?void 0:e.user,r=(null===e||void 0===e?void 0:e.hasRole)||(()=>!1),[n,w]=(0,i.useState)([]),[I,P]=(0,i.useState)(""),[S,C]=(0,i.useState)([]),[z,K]=(0,i.useState)(null),[D,N]=(0,i.useState)(!1),[_,E]=(0,i.useState)(null);(0,i.useEffect)(()=>{L()},[]);const L=async()=>{try{const e=await fetch((0,s.e9)("/api/auth/api-keys"),{headers:{Authorization:`Bearer ${localStorage.getItem("ey_auth_token")}`}});if(e.ok){const a=await e.json();w(a.apiKeys)}}catch(e){}};return a&&(r(o.gG.DEVELOPER)||r(o.gG.ADMIN))?(0,d.jsxs)(c,{children:[(0,d.jsxs)(l,{children:[(0,d.jsx)("h2",{children:"API Key Management"}),(0,d.jsx)("p",{children:"Create and manage API keys for programmatic access to the Axiom Loom Catalog"})]}),(0,d.jsxs)(p,{children:[(0,d.jsx)(x,{children:(0,d.jsx)("h3",{children:"Create New API Key"})}),z&&(0,d.jsxs)(b,{children:[(0,d.jsx)("strong",{children:"API Key Created Successfully!"}),(0,d.jsxs)("div",{className:"key",style:{margin:"12px 0"},children:[z,(0,d.jsx)(h,{type:"button",variant:"secondary",onClick:()=>{return e=z,void navigator.clipboard.writeText(e);var e},style:{marginLeft:"12px",padding:"4px 8px"},children:"Copy"})]}),(0,d.jsx)("span",{className:"warning",children:"\u26a0\ufe0f Save this API key securely. You won't be able to see it again!"})]}),_&&(0,d.jsx)(j,{children:_}),(0,d.jsxs)(u,{onSubmit:async e=>{e.preventDefault(),E(null),N(!0);try{const e=await fetch((0,s.e9)("/api/auth/api-keys"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("ey_auth_token")}`},body:JSON.stringify({name:I,permissions:S})});if(e.ok){const a=await e.json();K(a.apiKey),P(""),C([]),w([...n,{id:Date.now().toString(),name:a.name,createdAt:new Date(a.createdAt),permissions:S}])}else{const a=await e.json();E(a.error||"Failed to create API key")}}catch(a){E("An error occurred while creating the API key")}finally{N(!1)}},children:[(0,d.jsx)(g,{type:"text",placeholder:"API Key Name (e.g., Production App)",value:I,onChange:e=>P(e.target.value),required:!0}),(0,d.jsx)(h,{type:"submit",disabled:D,children:D?"Creating...":"Create Key"})]}),(0,d.jsxs)("div",{children:[(0,d.jsx)("p",{style:{fontSize:"14px",color:"#6c757d",marginBottom:"8px"},children:"Select permissions for this API key:"}),(0,d.jsx)(A,{children:["read:apis","read:documentation","test:apis","download:collections"].map(e=>(0,d.jsxs)(v,{children:[(0,d.jsx)("input",{type:"checkbox",checked:S.includes(e),onChange:a=>{a.target.checked?C([...S,e]):C(S.filter(a=>a!==e))}}),(0,d.jsx)("span",{children:e.replace(":",": ").replace(/\b\w/g,e=>e.toUpperCase())})]},e))})]})]}),(0,d.jsxs)(p,{children:[(0,d.jsx)(x,{children:(0,d.jsx)("h3",{children:"Your API Keys"})}),0===n.length?(0,d.jsxs)(k,{children:[(0,d.jsx)("p",{children:"You haven't created any API keys yet."}),(0,d.jsx)("p",{children:"Create your first API key to get started with the API."})]}):(0,d.jsx)(y,{children:n.map(e=>(0,d.jsxs)(m,{children:[(0,d.jsxs)(f,{children:[(0,d.jsx)("div",{className:"name",children:e.name}),(0,d.jsxs)("div",{className:"details",children:["Created: ",new Date(e.createdAt).toLocaleDateString()," \u2022",e.lastUsed?` Last used: ${new Date(e.lastUsed).toLocaleDateString()}`:" Never used"]}),e.permissions.length>0&&(0,d.jsxs)("div",{className:"details",children:["Permissions: ",e.permissions.join(", ")]})]}),(0,d.jsx)(h,{variant:"danger",onClick:()=>(async e=>{if(window.confirm("Are you sure you want to delete this API key? This action cannot be undone."))try{(await fetch((0,s.e9)(`/api/auth/api-keys/${e}`),{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("ey_auth_token")}`}})).ok&&w(n.filter(a=>a.id!==e))}catch(a){}})(e.id),children:"Delete"})]},e.id))})]}),(0,d.jsxs)(p,{children:[(0,d.jsx)(x,{children:(0,d.jsx)("h3",{children:"Using API Keys"})}),(0,d.jsxs)("div",{style:{fontSize:"14px",color:"#6c757d"},children:[(0,d.jsx)("p",{children:"Include your API key in requests using one of these methods:"}),(0,d.jsxs)("ul",{children:[(0,d.jsxs)("li",{children:["Header: ",(0,d.jsx)("code",{children:"X-API-Key: your-api-key"})]}),(0,d.jsxs)("li",{children:["Query parameter: ",(0,d.jsx)("code",{children:"?apiKey=your-api-key"})]})]}),(0,d.jsx)("p",{children:"Example curl command:"}),(0,d.jsx)("pre",{style:{background:"#f8f9fa",padding:"12px",borderRadius:"6px",overflow:"auto"},children:'curl -H "X-API-Key: your-api-key" \\\n     https://ai-experience.ey.com/api/repositories'})]})]})]}):(0,d.jsx)(c,{children:(0,d.jsx)(j,{children:"You don't have permission to manage API keys. This feature is available for developers and administrators only."})})}}}]);
//# sourceMappingURL=436.48e2baab.chunk.js.map