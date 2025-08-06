"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[451],{18451:(e,r,t)=>{t.r(r),t.d(r,{default:()=>x});var n=t(65043),i=t(35475),s=t(73216),a=t(5464),o=t(70579);const c=a.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`,d=a.Ay.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  max-width: 400px;
`,l=a.Ay.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,g=a.Ay.p`
  font-size: 18px;
  color: #2e3440;
  margin: 0;
`,p=a.Ay.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 16px;
  color: #c00;
  margin-top: 16px;
`,x=()=>{const[e]=(0,i.ok)(),r=(0,s.Zp)(),[t,a]=(0,n.useState)(null);return(0,n.useEffect)(()=>{(async()=>{const t=e.get("token"),n=e.get("refreshToken"),i=e.get("message");if(i)return a(i),void setTimeout(()=>r("/login"),3e3);if(t&&n){localStorage.setItem("ey_auth_token",t),localStorage.setItem("ey_refresh_token",n);const e=sessionStorage.getItem("auth_return_url")||"/";sessionStorage.removeItem("auth_return_url"),r(e,{replace:!0})}else a("Invalid callback parameters"),setTimeout(()=>r("/login"),3e3)})()},[e,r]),(0,o.jsx)(c,{children:(0,o.jsx)(d,{children:t?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(g,{children:"Authentication failed"}),(0,o.jsx)(p,{children:t}),(0,o.jsx)("p",{style:{marginTop:"16px",color:"#6c757d"},children:"Redirecting to login..."})]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(l,{}),(0,o.jsx)(g,{children:"Completing sign in..."})]})})})}}}]);
//# sourceMappingURL=451.37b904d9.chunk.js.map