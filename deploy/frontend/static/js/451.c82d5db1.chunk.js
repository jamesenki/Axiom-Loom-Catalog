"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[451],{18451:(e,t,r)=>{r.r(t),r.d(t,{default:()=>u});var i=r(65043),o=r(35475),n=r(73216),a=r(5464),s=r(70579);const d=a.i7`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,l=a.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`,c=a.Ay.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  max-width: 400px;
`,g=a.Ay.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${a.AH`${d}`} 1s linear infinite;
  margin: 0 auto 24px;
`,p=a.Ay.p`
  font-size: 18px;
  color: #2e3440;
  margin: 0;
`,x=a.Ay.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 16px;
  color: #c00;
  margin-top: 16px;
`,u=()=>{const[e]=(0,o.ok)(),t=(0,n.Zp)(),[r,a]=(0,i.useState)(null);return(0,i.useEffect)(()=>{(async()=>{const r=e.get("token"),i=e.get("refreshToken"),o=e.get("message");if(o)return a(o),void setTimeout(()=>t("/login"),3e3);if(r&&i){localStorage.setItem("ey_auth_token",r),localStorage.setItem("ey_refresh_token",i);const e=sessionStorage.getItem("auth_return_url")||"/";sessionStorage.removeItem("auth_return_url"),t(e,{replace:!0})}else a("Invalid callback parameters"),setTimeout(()=>t("/login"),3e3)})()},[e,t]),(0,s.jsx)(l,{children:(0,s.jsx)(c,{children:r?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(p,{children:"Authentication failed"}),(0,s.jsx)(x,{children:r}),(0,s.jsx)("p",{style:{marginTop:"16px",color:"#6c757d"},children:"Redirecting to login..."})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(g,{}),(0,s.jsx)(p,{children:"Completing sign in..."})]})})})}}}]);
//# sourceMappingURL=451.c82d5db1.chunk.js.map