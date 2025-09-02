"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[282],{2282:(e,n,i)=>{i.r(n),i.d(n,{default:()=>j});i(65043);var r=i(5464),s=i(66382),o=i(50122),l=i(70579);const a=r.Ay.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
`,t=r.Ay.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e1e4e8;
`,d=r.Ay.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: 600;
`,c=r.Ay.div`
  flex: 1;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #2e3440;
  }
  
  p {
    margin: 0;
    color: #6c757d;
    font-size: 16px;
  }
`,p=r.Ay.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  margin-left: 12px;
  
  ${e=>{switch(e.role){case o.gG.ADMIN:return"\n          background: #fee;\n          color: #c00;\n          border: 1px solid #fcc;\n        ";case o.gG.DEVELOPER:return"\n          background: #e7f3ff;\n          color: #004085;\n          border: 1px solid #b8daff;\n        ";default:return"\n          background: #f0f0f0;\n          color: #666;\n          border: 1px solid #ddd;\n        "}}}
`,x=r.Ay.div`
  margin-bottom: 32px;
`,g=r.Ay.h3`
  font-size: 18px;
  color: #2e3440;
  margin: 0 0 16px 0;
`,h=r.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`,m=r.Ay.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  
  label {
    display: block;
    font-size: 13px;
    color: #6c757d;
    margin-bottom: 4px;
    font-weight: 600;
  }
  
  span {
    display: block;
    font-size: 15px;
    color: #2e3440;
  }
`,f=r.Ay.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
`,u=r.Ay.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 14px;
  color: #004085;
  
  &::before {
    content: '✓';
    color: #28a745;
    font-weight: bold;
  }
`,b=r.Ay.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`,j=()=>{const{user:e,logout:n,hasPermission:i}=(0,s.A)();if(!e)return(0,l.jsx)(a,{children:"Loading..."});const r={[o.gG.ADMIN]:["Full system access","User management","API key management","Repository management","Security settings","Analytics access","Audit logs"],[o.gG.DEVELOPER]:["Read APIs & documentation","Create API keys","Manage own API keys","Test APIs","Download collections","Access development tools"],[o.gG.VIEWER]:["Read APIs","Read documentation","View public content"]},j=r[e.role]||r[o.gG.VIEWER];return(0,l.jsxs)(a,{children:[(0,l.jsxs)(t,{children:[(0,l.jsx)(d,{children:(A=e.name,A.split(" ").map(e=>e[0]).join("").toUpperCase().slice(0,2))}),(0,l.jsxs)(c,{children:[(0,l.jsxs)("h2",{children:[e.name,(0,l.jsx)(p,{role:e.role,children:e.role.charAt(0).toUpperCase()+e.role.slice(1)})]}),(0,l.jsx)("p",{children:e.email})]}),(0,l.jsx)(b,{onClick:n,children:"Sign Out"})]}),(0,l.jsxs)(x,{children:[(0,l.jsx)(g,{children:"Account Information"}),(0,l.jsxs)(h,{children:[(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{children:"User ID"}),(0,l.jsx)("span",{children:e.id})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{children:"Organization"}),(0,l.jsx)("span",{children:e.organizationId||"EY"})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{children:"Account Created"}),(0,l.jsx)("span",{children:new Date(e.createdAt).toLocaleDateString()})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{children:"Last Login"}),(0,l.jsx)("span",{children:e.lastLogin?new Date(e.lastLogin).toLocaleString():"N/A"})]})]})]}),(0,l.jsxs)(x,{children:[(0,l.jsx)(g,{children:"Permissions"}),(0,l.jsx)(f,{children:j.map((e,n)=>(0,l.jsx)(u,{children:e},n))})]}),(0,l.jsxs)(x,{children:[(0,l.jsx)(g,{children:"API Rate Limits"}),(0,l.jsxs)(h,{children:[(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{children:"Rate Limit"}),(0,l.jsxs)("span",{children:[e.role===o.gG.ADMIN?"1000":e.role===o.gG.DEVELOPER?"500":"100"," requests per 15 minutes"]})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{children:"API Key Limit"}),(0,l.jsx)("span",{children:e.role===o.gG.ADMIN?"Unlimited":e.role===o.gG.DEVELOPER?"10 keys":"N/A"})]})]})]})]});var A}}}]);
//# sourceMappingURL=282.f51e3b00.chunk.js.map