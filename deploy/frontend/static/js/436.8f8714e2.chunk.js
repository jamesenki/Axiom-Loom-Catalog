"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[436],{51436:(e,r,a)=>{a.r(r),a.d(r,{default:()=>v});var n=a(65043),i=a(5464),t=a(66382),o=a(50122),s=a(70579);const d=i.Ay.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
`,c=i.Ay.div`
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
`,l=i.Ay.div`
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`,p=i.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 20px;
    color: #2e3440;
  }
`,x=i.Ay.button`
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
`,h=i.Ay.form`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`,u=i.Ay.input`
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
`,y=i.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,g=i.Ay.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 16px;
`,m=i.Ay.div`
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
`,f=i.Ay.div`
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
`,b=i.Ay.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 12px 16px;
  color: #c00;
  margin-bottom: 16px;
`,j=i.Ay.div`
  text-align: center;
  padding: 48px;
  color: #6c757d;
  
  p {
    margin: 0 0 16px 0;
  }
`,k=i.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
`,A=i.Ay.label`
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
`,v=()=>{const{user:e,hasRole:r}=(0,t.A)(),[a,i]=(0,n.useState)([]),[v,w]=(0,n.useState)(""),[I,P]=(0,n.useState)([]),[S,C]=(0,n.useState)(null),[z,K]=(0,n.useState)(!1),[_,D]=(0,n.useState)(null);(0,n.useEffect)(()=>{E()},[]);const E=async()=>{try{const e=await fetch("/api/auth/api-keys",{headers:{Authorization:`Bearer ${localStorage.getItem("ey_auth_token")}`}});if(e.ok){const r=await e.json();i(r.apiKeys)}}catch(e){}};return e&&(r(o.gG.DEVELOPER)||r(o.gG.ADMIN))?(0,s.jsxs)(d,{children:[(0,s.jsxs)(c,{children:[(0,s.jsx)("h2",{children:"API Key Management"}),(0,s.jsx)("p",{children:"Create and manage API keys for programmatic access to the EY AI Experience Center"})]}),(0,s.jsxs)(l,{children:[(0,s.jsx)(p,{children:(0,s.jsx)("h3",{children:"Create New API Key"})}),S&&(0,s.jsxs)(f,{children:[(0,s.jsx)("strong",{children:"API Key Created Successfully!"}),(0,s.jsxs)("div",{className:"key",style:{margin:"12px 0"},children:[S,(0,s.jsx)(x,{type:"button",variant:"secondary",onClick:()=>{return e=S,void navigator.clipboard.writeText(e);var e},style:{marginLeft:"12px",padding:"4px 8px"},children:"Copy"})]}),(0,s.jsx)("span",{className:"warning",children:"\u26a0\ufe0f Save this API key securely. You won't be able to see it again!"})]}),_&&(0,s.jsx)(b,{children:_}),(0,s.jsxs)(h,{onSubmit:async e=>{e.preventDefault(),D(null),K(!0);try{const e=await fetch("/api/auth/api-keys",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("ey_auth_token")}`},body:JSON.stringify({name:v,permissions:I})});if(e.ok){const r=await e.json();C(r.apiKey),w(""),P([]),i([...a,{id:Date.now().toString(),name:r.name,createdAt:new Date(r.createdAt),permissions:I}])}else{const r=await e.json();D(r.error||"Failed to create API key")}}catch(r){D("An error occurred while creating the API key")}finally{K(!1)}},children:[(0,s.jsx)(u,{type:"text",placeholder:"API Key Name (e.g., Production App)",value:v,onChange:e=>w(e.target.value),required:!0}),(0,s.jsx)(x,{type:"submit",disabled:z,children:z?"Creating...":"Create Key"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{style:{fontSize:"14px",color:"#6c757d",marginBottom:"8px"},children:"Select permissions for this API key:"}),(0,s.jsx)(k,{children:["read:apis","read:documentation","test:apis","download:collections"].map(e=>(0,s.jsxs)(A,{children:[(0,s.jsx)("input",{type:"checkbox",checked:I.includes(e),onChange:r=>{r.target.checked?P([...I,e]):P(I.filter(r=>r!==e))}}),(0,s.jsx)("span",{children:e.replace(":",": ").replace(/\b\w/g,e=>e.toUpperCase())})]},e))})]})]}),(0,s.jsxs)(l,{children:[(0,s.jsx)(p,{children:(0,s.jsx)("h3",{children:"Your API Keys"})}),0===a.length?(0,s.jsxs)(j,{children:[(0,s.jsx)("p",{children:"You haven't created any API keys yet."}),(0,s.jsx)("p",{children:"Create your first API key to get started with the API."})]}):(0,s.jsx)(y,{children:a.map(e=>(0,s.jsxs)(g,{children:[(0,s.jsxs)(m,{children:[(0,s.jsx)("div",{className:"name",children:e.name}),(0,s.jsxs)("div",{className:"details",children:["Created: ",new Date(e.createdAt).toLocaleDateString()," \u2022",e.lastUsed?` Last used: ${new Date(e.lastUsed).toLocaleDateString()}`:" Never used"]}),e.permissions.length>0&&(0,s.jsxs)("div",{className:"details",children:["Permissions: ",e.permissions.join(", ")]})]}),(0,s.jsx)(x,{variant:"danger",onClick:()=>(async e=>{if(window.confirm("Are you sure you want to delete this API key? This action cannot be undone."))try{(await fetch(`/api/auth/api-keys/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("ey_auth_token")}`}})).ok&&i(a.filter(r=>r.id!==e))}catch(r){}})(e.id),children:"Delete"})]},e.id))})]}),(0,s.jsxs)(l,{children:[(0,s.jsx)(p,{children:(0,s.jsx)("h3",{children:"Using API Keys"})}),(0,s.jsxs)("div",{style:{fontSize:"14px",color:"#6c757d"},children:[(0,s.jsx)("p",{children:"Include your API key in requests using one of these methods:"}),(0,s.jsxs)("ul",{children:[(0,s.jsxs)("li",{children:["Header: ",(0,s.jsx)("code",{children:"X-API-Key: your-api-key"})]}),(0,s.jsxs)("li",{children:["Query parameter: ",(0,s.jsx)("code",{children:"?apiKey=your-api-key"})]})]}),(0,s.jsx)("p",{children:"Example curl command:"}),(0,s.jsx)("pre",{style:{background:"#f8f9fa",padding:"12px",borderRadius:"6px",overflow:"auto"},children:'curl -H "X-API-Key: your-api-key" \\\n     https://ai-experience.ey.com/api/repositories'})]})]})]}):(0,s.jsx)(d,{children:(0,s.jsx)(b,{children:"You don't have permission to manage API keys. This feature is available for developers and administrators only."})})}}}]);
//# sourceMappingURL=436.8f8714e2.chunk.js.map