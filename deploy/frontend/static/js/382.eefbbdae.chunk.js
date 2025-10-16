"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[382],{3382:(e,t,r)=>{r.r(t),r.d(t,{default:()=>q});var o=r(65043),a=r(35475),n=r(5464),i=r(71360),s=r(50516),l=r(20073),d=r(75088),c=r(81990),p=r(9461),u=r(35746),m=r(39292),x=r(34537),h=r(67375),g=r(97950);class f{static async storeToken(e,t,r,o){const a=t?`${e}/${t}`:`${e}/*`,n=`https://github.com/${e}`,i={token:this.encryptToken(r),accountName:o,accountUrl:n,createdAt:(new Date).toISOString()},s=this.getStoredTokens();s[a]=i,this.saveTokens(s)}static getToken(e,t){const r=this.getStoredTokens(),o=`${e}/${t}`;if(r[o])return this.updateLastUsed(o),this.decryptToken(r[o].token);const a=`${e}/*`;return r[a]?(this.updateLastUsed(a),this.decryptToken(r[a].token)):null}static getTokenInfo(e,t){const r=this.getStoredTokens(),o=`${e}/*`,a=r[`${e}/${t}`]||r[o];if(a){const{token:e,...t}=a;return t}return null}static listAccounts(){const e=this.getStoredTokens();return Object.entries(e).map(e=>{let[t,r]=e;const[o,a]=t.split("/");return{key:t,owner:o,repo:"*"===a?null:a,accountName:r.accountName,accountUrl:r.accountUrl,createdAt:r.createdAt,lastUsed:r.lastUsed}})}static removeToken(e,t){const r=t?`${e}/${t}`:`${e}/*`,o=this.getStoredTokens();delete o[r],this.saveTokens(o)}static async validateToken(e){try{const r=await fetch("https://api.github.com/user",{headers:{Authorization:`Bearer ${e}`,Accept:"application/vnd.github.v3+json"}});if(r.ok){var t;const e=await r.json(),o=(null===(t=r.headers.get("X-OAuth-Scopes"))||void 0===t?void 0:t.split(", "))||[];return{valid:!0,username:e.login,scopes:o}}return 401===r.status?{valid:!1,error:"Invalid or expired token"}:{valid:!1,error:`GitHub API error: ${r.status}`}}catch(r){return{valid:!1,error:`Network error: ${r instanceof Error?r.message:"Unknown error"}`}}}static hasToken(e,t){return null!==this.getToken(e,t)}static getStoredTokens(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(e)return JSON.parse(e)}catch(e){}return{}}static saveTokens(e){try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}catch(t){throw new Error("Unable to save authentication tokens")}}static updateLastUsed(e){const t=this.getStoredTokens();t[e]&&(t[e].lastUsed=(new Date).toISOString(),this.saveTokens(t))}static encryptToken(e){const t=this.getEncryptionKey();let r="";for(let o=0;o<e.length;o++)r+=String.fromCharCode(e.charCodeAt(o)^t.charCodeAt(o%t.length));return btoa(r)}static decryptToken(e){const t=this.getEncryptionKey(),r=atob(e);let o="";for(let a=0;a<r.length;a++)o+=String.fromCharCode(r.charCodeAt(a)^t.charCodeAt(a%t.length));return o}static getEncryptionKey(){let e=localStorage.getItem(this.ENCRYPTION_KEY);return e||(e=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(e=>e.toString(16).padStart(2,"0")).join(""),localStorage.setItem(this.ENCRYPTION_KEY,e)),e}static clearAll(){localStorage.removeItem(this.STORAGE_KEY)}}f.STORAGE_KEY="eyns_github_tokens",f.ENCRYPTION_KEY="eyns_encryption_key";const b=f;var k=r(72362),y=r(70579);const v=e=>{let{isOpen:t,onClose:r,onSuccess:a}=e;const[n,i]=(0,o.useState)(""),[s,l]=(0,o.useState)(""),[d,c]=(0,o.useState)(""),[p,u]=(0,o.useState)(!1),[m,x]=(0,o.useState)(!1),[h,f]=(0,o.useState)(!1),[v,w]=(0,o.useState)(!1),[j,$]=(0,o.useState)(!1),[A,S]=(0,o.useState)(null),[T,C]=(0,o.useState)("idle"),[N,z]=(0,o.useState)("idle"),[R,E]=(0,o.useState)(null),[I,O]=(0,o.useState)(!1),[L,H]=(0,o.useState)(null),[U,Y]=(0,o.useState)(""),G=()=>{i(""),l(""),c(""),u(!1),x(!1),S(null),C("idle"),z("idle"),E(null),O(!1),H(null),Y(""),r()},P=async()=>{if(S(null),C("idle"),E(null),!n.trim())return S("Repository name or URL is required"),void C("invalid");const e=(e=>{const t=e.trim();if(t.includes("github.com")||t.startsWith("http"))try{let e=t;e.startsWith("http")||(e="https://"+e),e=e.replace(/\.git$/,"");const r=new URL(e);if("github.com"!==r.hostname)return null;const o=r.pathname.split("/").filter(e=>e.length>0);if(o.length>=2)return{owner:o[0],name:o[1]}}catch(A){return null}else{if(t&&!t.includes("/"))return{owner:"2030011612_EYGS",name:t};if(t.includes("/")){const e=t.split("/");if(2===e.length&&e[0]&&e[1])return{owner:e[0],name:e[1]}}}return null})(n);if(!e)return S("Invalid repository name or GitHub URL format"),void C("invalid");if((t=e.name)?t.length>100?(S("Repository name must be 100 characters or less"),0):/^[a-zA-Z0-9._-]+$/.test(t)?t.startsWith(".")||t.endsWith(".")?(S("Repository name cannot start or end with a dot"),0):"."!==t&&".."!==t||(S("Invalid repository name"),0):(S("Repository name can only contain letters, numbers, dots, hyphens, and underscores"),0):(S("Repository name is required"),0)){var t;f(!0),E(e);try{let t=s;if(!t&&(t=b.getToken(e.owner,e.name)||"",t)){const t=b.getTokenInfo(e.owner,e.name);H(t)}const r=await(async(e,t,r)=>{try{const o=await fetch((0,k.e9)(`/api/verify-repository/${e}/${t}`),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:r||void 0})});return o.ok?{exists:!0}:401===o.status?{exists:!1,needsAuth:!0,error:(await o.json()).error}:404===o.status?{exists:!1,error:(await o.json()).error}:{exists:!1,error:"Unexpected error occurred"}}catch(A){return{exists:!1,error:"Network error occurred"}}})(e.owner,e.name,t);r.exists?(C("valid"),S(null),O(!1),x(!1),r.isPrivate&&!t&&S(null)):r.needsAuth&&!t?(C("invalid"),r.error&&r.error.includes("private repository")?S("This appears to be a private repository. The GitHub CLI may not have access to this account. You can either:\n1. Run: gh auth login --hostname github.com\n2. Or provide a personal access token below"):S(r.error||"This repository requires authentication. Please provide a GitHub personal access token."),O(!0),x(!0),c(`${e.owner} Account`)):(C("invalid"),r.error?S(r.error):S(`Repository "${e.owner}/${e.name}" not found. Please check the repository name and try again.`),(r.needsAuth||r.error&&r.error.includes("private"))&&(x(!0),O(!0)))}catch(A){C("invalid"),S("Failed to verify repository. Please check your internet connection and try again.")}finally{f(!1)}}else C("invalid")};return(0,o.useEffect)(()=>{if(R){const e=b.getTokenInfo(R.owner,R.name);H(e||null)}},[R]),t?g.createPortal((0,y.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px",overflow:"auto"},onClick:e=>{e.target===e.currentTarget&&G()},children:(0,y.jsxs)("div",{style:{backgroundColor:"white",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",width:"100%",maxWidth:"600px",maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"},onClick:e=>e.stopPropagation(),children:[(0,y.jsxs)("div",{style:{padding:"24px 32px",borderBottom:"1px solid #e5e7eb",backgroundColor:"white",position:"sticky",top:0,zIndex:10},children:[(0,y.jsx)("h2",{style:{fontSize:"24px",fontWeight:"600",color:"#111827",margin:0},children:"Add Repository"}),(0,y.jsx)("p",{style:{fontSize:"14px",color:"#6b7280",marginTop:"4px"},children:"Add a repository by name or GitHub URL"})]}),(0,y.jsx)("div",{style:{padding:"24px 32px",overflowY:"auto",flex:1},children:(0,y.jsxs)("div",{className:"space-y-4",children:[(0,y.jsxs)("div",{children:[(0,y.jsx)("label",{htmlFor:"repo-input",style:{display:"block",fontSize:"14px",fontWeight:"500",color:"#374151",marginBottom:"8px"},children:"Repository Name or URL"}),(0,y.jsxs)("div",{className:"relative",children:[(0,y.jsx)("input",{id:"repo-input",type:"text",value:n,onChange:e=>{i(e.target.value),C("idle"),S(null),E(null)},onBlur:P,placeholder:"e.g., my-project or https://github.com/user/repo",style:{width:"100%",padding:"10px 12px",fontSize:"14px",border:"2px solid "+("valid"===T?"#10b981":"invalid"===T?"#ef4444":"#e5e7eb"),borderRadius:"8px",outline:"none",transition:"border-color 0.2s",backgroundColor:h||j?"#f9fafb":"white",cursor:h||j?"not-allowed":"text"},disabled:h||j}),h&&(0,y.jsx)("div",{className:"absolute right-2 top-2",children:(0,y.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"})}),"valid"===T&&(0,y.jsx)("div",{className:"absolute right-2 top-2",children:(0,y.jsx)("svg",{className:"w-5 h-5 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})})})]}),(0,y.jsx)("p",{style:{fontSize:"12px",color:"#9ca3af",marginTop:"4px"},children:"Enter a repository name, owner/repo format, or full GitHub URL"})]}),L&&(0,y.jsxs)("div",{style:{padding:"12px 16px",backgroundColor:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"8px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[(0,y.jsx)("svg",{style:{width:"20px",height:"20px",color:"#2563eb",flexShrink:0,marginTop:"2px"},fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),(0,y.jsxs)("div",{children:[(0,y.jsxs)("p",{style:{fontSize:"14px",color:"#1e40af",margin:0},children:["Using saved token from: ",(0,y.jsx)("span",{style:{fontWeight:"600"},children:L.accountName})]}),(0,y.jsxs)("p",{style:{fontSize:"12px",color:"#1e3a8a",marginTop:"4px"},children:["Last used: ",L.lastUsed?new Date(L.lastUsed).toLocaleString():"Never"]})]})]}),(m||I)&&!L&&(0,y.jsxs)("div",{style:{padding:"20px",backgroundColor:"#f9fafb",borderRadius:"8px",border:"1px solid #e5e7eb"},children:[(0,y.jsx)("h3",{style:{fontSize:"16px",fontWeight:"600",color:"#374151",marginBottom:"16px"},children:"Authentication Required"}),(0,y.jsxs)("div",{children:[(0,y.jsx)("label",{htmlFor:"github-token",className:"block text-sm font-medium text-gray-700 mb-1",children:"GitHub Personal Access Token"}),(0,y.jsxs)("div",{className:"relative",children:[(0,y.jsx)("input",{id:"github-token",type:"password",value:s,onChange:e=>{l(e.target.value),z("idle"),I&&(C("idle"),S(null))},onBlur:()=>{s&&(async()=>{if(!s)return z("invalid"),void S("Please enter a GitHub token");w(!0),S(null);try{const e=await b.validateToken(s);e.valid?(z("valid"),Y(e.username||""),!d&&e.username&&c(`${e.username}'s GitHub Account`),R&&I&&await P()):(z("invalid"),S(e.error||"Invalid token"))}catch(A){z("invalid"),S("Failed to validate token")}finally{w(!1)}})()},placeholder:"ghp_xxxxxxxxxxxxxxxxxxxx",className:`\n                        w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2\n                        ${"valid"===N?"border-green-500 focus:ring-green-500":"invalid"===N?"border-red-500 focus:ring-red-500":"border-gray-300 focus:ring-blue-500"}\n                      `,disabled:j||v}),v&&(0,y.jsx)("div",{className:"absolute right-2 top-2",children:(0,y.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"})}),"valid"===N&&(0,y.jsx)("div",{className:"absolute right-2 top-2",children:(0,y.jsx)("svg",{className:"w-5 h-5 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})})})]}),(0,y.jsxs)("p",{className:"text-xs text-gray-500 mt-1",children:[(0,y.jsx)("a",{href:"https://github.com/settings/tokens/new?scopes=repo",target:"_blank",rel:"noopener noreferrer",className:"text-blue-600 hover:text-blue-800 underline",children:"Generate a new token"})," ","with 'repo' scope"]})]}),(0,y.jsxs)("div",{children:[(0,y.jsx)("label",{htmlFor:"token-account-name",className:"block text-sm font-medium text-gray-700 mb-1",children:"Account Name (for your reference)"}),(0,y.jsx)("input",{id:"token-account-name",type:"text",value:d,onChange:e=>c(e.target.value),placeholder:`e.g., "${(null===R||void 0===R?void 0:R.owner)||"Work"} GitHub Account"`,className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:j}),U&&(0,y.jsxs)("p",{className:"text-xs text-green-600 mt-1",children:["Token validated for user: @",U]})]}),R&&(0,y.jsxs)("div",{className:"flex items-start",children:[(0,y.jsx)("input",{id:"save-token-org",type:"checkbox",checked:p,onChange:e=>u(e.target.checked),className:"mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",disabled:j}),(0,y.jsxs)("label",{htmlFor:"save-token-org",className:"ml-2 text-sm text-gray-700",children:["Save token for all repositories in ",(0,y.jsx)("span",{className:"font-medium",children:R.owner}),(0,y.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"This will allow you to add other repositories from this organization without re-entering the token"})]})]}),I&&s&&"valid"===N&&(0,y.jsx)("button",{type:"button",onClick:P,className:"w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",children:"Verify Repository Access"})]}),!m&&!I&&!L&&(0,y.jsxs)("button",{type:"button",onClick:()=>x(!0),style:{display:"flex",alignItems:"center",fontSize:"14px",color:"#2563eb",border:"none",background:"none",cursor:"pointer",padding:"8px 0",transition:"color 0.2s"},onMouseOver:e=>{e.currentTarget.style.color="#1d4ed8"},onMouseOut:e=>{e.currentTarget.style.color="#2563eb"},children:[(0,y.jsx)("svg",{style:{width:"16px",height:"16px",marginRight:"6px"},fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z",clipRule:"evenodd"})}),"Add authentication for private repository"]}),A&&(0,y.jsxs)("div",{style:{padding:"12px 16px",backgroundColor:"#fef2f2",border:"1px solid #fecaca",borderRadius:"8px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[(0,y.jsx)("svg",{style:{width:"20px",height:"20px",color:"#dc2626",flexShrink:0,marginTop:"2px"},fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),(0,y.jsx)("p",{style:{fontSize:"14px",color:"#dc2626",margin:0,lineHeight:"1.5"},children:A})]}),"valid"===T&&R&&(0,y.jsxs)("div",{style:{padding:"12px 16px",backgroundColor:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"8px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[(0,y.jsx)("svg",{style:{width:"20px",height:"20px",color:"#10b981",flexShrink:0,marginTop:"2px"},fill:"currentColor",viewBox:"0 0 20 20",children:(0,y.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),(0,y.jsxs)("div",{children:[(0,y.jsxs)("p",{style:{fontSize:"14px",color:"#059669",margin:0},children:["Repository found: ",(0,y.jsxs)("span",{style:{fontWeight:"600"},children:[R.owner,"/",R.name]})]}),L&&(0,y.jsxs)("p",{style:{fontSize:"12px",color:"#047857",marginTop:"4px"},children:["Authentication: ",L.accountName]})]})]}),b.listAccounts().length>0&&!m&&(0,y.jsxs)("div",{className:"mt-4 p-3 bg-gray-50 rounded-md",children:[(0,y.jsx)("h3",{className:"text-sm font-medium text-gray-700 mb-2",children:"Saved Accounts"}),(0,y.jsx)("div",{className:"space-y-1",children:b.listAccounts().map(e=>(0,y.jsxs)("div",{className:"flex items-center justify-between text-xs",children:[(0,y.jsxs)("span",{className:"text-gray-600",children:[e.accountName," (",e.owner,"/",e.repo||"*",")"]}),(0,y.jsx)("button",{onClick:()=>b.removeToken(e.owner,e.repo),className:"text-red-600 hover:text-red-800",children:"Remove"})]},e.key))})]})]})}),(0,y.jsxs)("div",{style:{padding:"20px 32px",borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"flex-end",gap:"12px",backgroundColor:"white",position:"sticky",bottom:0},children:[(0,y.jsx)("button",{onClick:G,style:{padding:"10px 20px",fontSize:"14px",fontWeight:"500",color:"#374151",backgroundColor:"white",border:"1px solid #d1d5db",borderRadius:"8px",cursor:j?"not-allowed":"pointer",opacity:j?.5:1,transition:"all 0.2s"},onMouseOver:e=>{j||(e.currentTarget.style.backgroundColor="#f9fafb")},onMouseOut:e=>{e.currentTarget.style.backgroundColor="white"},disabled:j,children:"Cancel"}),(0,y.jsx)("button",{onClick:async()=>{if("valid"===T&&R){$(!0),S(null);try{if(s&&d&&!L){const e=p?null:R.name;await b.storeToken(R.owner,e,s,d)}const e=await fetch((0,k.e9)("/api/repositories/add"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R.name,account:R.owner,token:s||b.getToken(R.owner,R.name)||void 0})});if(!e.ok){const t=await e.json();throw new Error(t.error||"Failed to add repository to configuration")}if(!(await fetch((0,k.e9)(`/api/sync-repository/${R.name}`),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:s||b.getToken(R.owner,R.name)||void 0})})).ok)throw new Error("Failed to sync repository");a&&a(R.name),G()}catch(A){S(A instanceof Error?A.message:"Failed to add repository")}finally{$(!1)}}else await P()},style:{padding:"10px 20px",fontSize:"14px",fontWeight:"500",color:"white",backgroundColor:"valid"!==T||j?"#d1d5db":"#2563eb",border:"none",borderRadius:"8px",cursor:"valid"!==T||j?"not-allowed":"pointer",opacity:"valid"!==T||j?.7:1,transition:"all 0.2s"},onMouseOver:e=>{"valid"!==T||j||(e.currentTarget.style.backgroundColor="#1d4ed8")},onMouseOut:e=>{"valid"!==T||j||(e.currentTarget.style.backgroundColor="#2563eb")},disabled:"valid"!==T||j,children:j?(0,y.jsxs)("span",{className:"flex items-center",children:[(0,y.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"}),"Adding..."]}):"Add Repository"})]})]})}),document.body):null};var w=r(9425);const j=n.i7`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`,$=n.i7`
  0%, 100% {
    transform: translateY(0px) rotateX(0deg);
  }
  50% {
    transform: translateY(-4px) rotateX(2deg);
  }
`,A=n.i7`
  0%, 100% {
    box-shadow: 
      0 0 20px ${w.kk.plasma.violet}40,
      inset 0 0 20px ${w.kk.glass.background};
  }
  33% {
    box-shadow: 
      0 0 30px ${w.kk.plasma.cyan}40,
      inset 0 0 20px ${w.kk.glass.background};
  }
  66% {
    box-shadow: 
      0 0 25px ${w.kk.plasma.emerald}40,
      inset 0 0 20px ${w.kk.glass.background};
  }
`,S=n.i7`
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`,T=n.AH`
  /* Minimal blur for maximum readability */
  background: rgba(10, 10, 20, 0.95); /* Very opaque background */
  backdrop-filter: blur(0px); /* Minimal blur for clarity */
  -webkit-backdrop-filter: blur(0px);
  border: ${w.oW.border.subtle};
  border-radius: 1.5rem;
  position: relative;
  overflow: hidden;
  
  /* Base shadow */
  box-shadow: ${w.oW.shadow.soft};
  
  /* Variant-specific styles */
  ${e=>{switch(e.variant){case"elevated":return n.AH`
          box-shadow: ${w.oW.shadow.medium};
          backdrop-filter: ${w.oW.backdrop.heavy};
          -webkit-backdrop-filter: ${w.oW.backdrop.heavy};
        `;case"floating":return n.AH`
          animation: ${n.AH`${$}`} 6s ease-in-out infinite;
          box-shadow: ${w.oW.shadow.dramatic};
        `;case"interactive":return n.AH`
          cursor: pointer;
          transition: all ${w.Lj.duration.normal} ${w.Lj.easing.quantum};
          
          &:hover {
            background: ${w.oW.background.secondary};
            border: ${w.oW.border.medium};
            transform: translateY(-2px) scale(1.02);
            box-shadow: 
              ${w.oW.shadow.dramatic},
              0 0 40px ${w.kk.plasma.violet}20;
          }
          
          &:active {
            transform: translateY(-1px) scale(1.01);
          }
        `;default:return n.AH``}}}
  
  /* Glow effect */
  ${e=>e.glowEffect&&n.AH`
    animation: ${n.AH`${A}`} 4s ease-in-out infinite;
  `}
  
  /* Shimmer effect */
  ${e=>e.shimmerEffect&&n.AH`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        ${w.kk.plasma.cyan}10,
        transparent
      );
      background-size: 200% 100%;
      animation: ${n.AH`${j}`} 3s ease-in-out infinite;
      pointer-events: none;
    }
  `}
`,C=n.Ay.div.withConfig({shouldForwardProp:e=>!["variant","glowEffect","shimmerEffect","padding"].includes(e)})`
  ${T}
  
  padding: ${e=>{switch(e.padding){case"sm":return"1rem";case"lg":return"2rem";case"xl":return"3rem";default:return"1.5rem"}}};
`,N=(n.Ay.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${w.kk.glass.border};
`,n.Ay.h3`
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${w.kk.neural.electric};
  margin: 0 0 0.5rem 0;
  
  background: linear-gradient(
    45deg,
    ${w.kk.plasma.violet},
    ${w.kk.plasma.cyan}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,n.Ay.p`
  font-size: 0.875rem;
  color: ${w.kk.neural.light};
  margin: 0;
  opacity: 0.8;
`,n.Ay.div`
  color: ${w.kk.neural.bright};
  line-height: 1.6;
`,n.Ay.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${w.kk.glass.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`,n.Ay.div`
  position: absolute;
  border-radius: 50%;
  background: ${w.kk.plasma.cyan}30;
  width: 20px;
  height: 20px;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  animation: ${n.AH`${S}`} 0.6s ease-out;
  pointer-events: none;
`),z=e=>{let{children:t,variant:r="default",padding:a="md",glowEffect:n=!1,shimmerEffect:i=!1,onClick:s,className:l}=e;const[d,c]=o.useState([]);return(0,y.jsxs)(C,{variant:r,padding:a,glowEffect:n,shimmerEffect:i,onClick:e=>{if(s&&s(),"interactive"===r){const t=e.currentTarget.getBoundingClientRect(),r=e.clientX-t.left-10,o=e.clientY-t.top-10,a=Date.now();c(e=>[...e,{x:r,y:o,id:a}]),setTimeout(()=>{c(e=>e.filter(e=>e.id!==a))},600)}},className:l,children:[t,d.map(e=>(0,y.jsx)(N,{x:e.x,y:e.y},e.id))]})};var R=r(3202);const E=n.Ay.div`
  min-height: 100vh;
  padding: 100px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`,I=n.Ay.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      ${w.kk.plasma.violet}20 0%,
      ${w.kk.plasma.cyan}10 30%,
      transparent 70%
    );
    filter: blur(0px);  /* Removed blur completely */
    animation: float 8s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-20px); }
  }
`,O=n.Ay.h1`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(
    135deg,
    ${w.kk.plasma.violet},
    ${w.kk.plasma.cyan},
    ${w.kk.plasma.emerald}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`,L=n.Ay.p`
  font-size: 1.25rem;
  color: ${w.kk.neural.light};
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  font-weight: 300;
  letter-spacing: 0.02em;
`,H=n.Ay.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  position: relative;
  z-index: 1;
`,U=n.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,Y=(0,n.Ay)(e=>(0,y.jsx)(z,{...e,variant:"interactive"}))`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${w.kk.plasma.violet},
      ${w.kk.plasma.cyan},
      ${w.kk.plasma.emerald}
    );
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(139, 92, 246, 0.3),
      0 0 60px rgba(6, 182, 212, 0.1);
    
    &::before {
      transform: scaleX(1);
    }
  }
`,G=n.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,P=n.Ay.h3`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${w.kk.neural.electric},
    ${w.kk.plasma.cyan}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`,W=n.i7`
  0%, 100% { box-shadow: 0 0 5px ${w.kk.plasma.emerald}40; }
  50% { box-shadow: 0 0 15px ${w.kk.plasma.emerald}60; }
`,_=n.Ay.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${e=>"active"===e.status?`linear-gradient(135deg, ${w.kk.plasma.emerald}30, ${w.kk.plasma.cyan}30)`:`linear-gradient(135deg, ${w.kk.neural.glow}30, ${w.kk.neural.light}30)`};
  color: ${e=>"active"===e.status?w.kk.plasma.emerald:w.kk.neural.bright};
  border: 1px solid ${e=>"active"===e.status?`${w.kk.plasma.emerald}50`:`${w.kk.neural.glow}50`};
  animation: ${e=>"active"===e.status?n.AH`${W} 2s ease-in-out infinite`:"none"};
`,B=n.Ay.p`
  color: ${w.kk.neural.light};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`,M=n.Ay.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.05),
    rgba(6, 182, 212, 0.05)
  );
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.1);
`,F=n.Ay.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${w.kk.neural.bright};
  font-size: 0.9rem;
  
  svg {
    color: ${w.kk.plasma.cyan};
  }
`,K=n.Ay.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`,V=(0,n.Ay)(a.N_)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1),
    rgba(6, 182, 212, 0.05)
  );
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  color: ${w.kk.neural.bright};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.2),
      rgba(6, 182, 212, 0.1)
    );
    border-color: ${w.kk.plasma.cyan};
    color: ${w.kk.plasma.cyan};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    
    svg {
      transform: scale(1.1);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`,D=n.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${w.kk.neural.bright};
  font-size: 1.2rem;
  
  &::before {
    content: '';
    width: 60px;
    height: 60px;
    border: 3px solid rgba(139, 92, 246, 0.1);
    border-top-color: ${w.kk.plasma.violet};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`,X=n.Ay.div`
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.1),
    rgba(239, 68, 68, 0.05)
  );
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #ef4444;
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
`,q=()=>{const[e,t]=(0,o.useState)([]),[r,n]=(0,o.useState)(!0),[g,f]=(0,o.useState)(null),[b,w]=(0,o.useState)(!1),{syncVersion:j}=(0,h.g)();(0,o.useEffect)(()=>{(async()=>{try{const e=await fetch((0,k.e9)("/api/repositories"));if(!e.ok)throw new Error("Failed to fetch repositories");const r=await e.json();t(r)}catch(e){f(e instanceof Error?e.message:"Unknown error")}finally{n(!1)}})()},[j]);return r?(0,y.jsx)(D,{children:"Loading repositories..."}):g?(0,y.jsxs)(X,{children:["Error: ",g]}):(0,y.jsxs)(E,{children:[(0,y.jsxs)(I,{children:[(0,y.jsx)(O,{children:"Axiom Loom Catalog"}),(0,y.jsx)(L,{children:"Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!"}),(0,y.jsxs)(H,{children:[(0,y.jsx)(R.jn,{onClick:()=>w(!0),leftIcon:(0,y.jsx)(i.A,{size:20}),glowEffect:!0,children:"Add Repository"}),(0,y.jsx)(a.N_,{to:"/sync",style:{textDecoration:"none"},children:(0,y.jsx)(R.NL,{leftIcon:(0,y.jsx)(s.A,{size:20}),children:"Repository Sync"})})]})]}),(0,y.jsx)(U,{children:e.map(e=>{var t,r,o,a,n;return(0,y.jsxs)(Y,{"data-testid":"repository-card",children:[(0,y.jsxs)(G,{children:[(0,y.jsx)(P,{children:e.displayName}),(0,y.jsx)(_,{status:e.status,children:e.status})]}),(0,y.jsx)(B,{children:e.description}),(0,y.jsxs)(M,{children:[(0,y.jsxs)(F,{children:[(0,y.jsx)(l.A,{size:16}),(0,y.jsxs)("span",{children:["APIs: ",e.metrics.apiCount]})]}),(0,y.jsxs)(F,{children:[(0,y.jsx)(d.A,{size:16}),(0,y.jsxs)("span",{children:["Updated: ",new Date(e.metrics.lastUpdated).toLocaleDateString()]})]})]}),(0,y.jsxs)(K,{children:[(0,y.jsxs)(V,{to:`/repository/${e.name}`,children:[(0,y.jsx)(c.A,{size:16}),"Repository"]}),(0,y.jsxs)(V,{to:`/docs/${e.name}`,children:[(0,y.jsx)(p.A,{size:16}),"Documentation"]}),(null===(t=e.apiTypes)||void 0===t?void 0:t.hasPostman)&&(0,y.jsxs)(V,{to:`/postman/${e.name}`,children:[(0,y.jsx)(u.A,{size:16}),"Postman"]}),(null===(r=e.apiTypes)||void 0===r?void 0:r.hasGraphQL)&&(0,y.jsxs)(V,{to:`/graphql/${e.name}`,children:[(0,y.jsx)(m.A,{size:16}),"GraphQL"]}),((null===(o=e.apiTypes)||void 0===o?void 0:o.hasOpenAPI)||(null===(a=e.apiTypes)||void 0===a?void 0:a.hasGraphQL)||(null===(n=e.apiTypes)||void 0===n?void 0:n.hasGrpc))&&(0,y.jsxs)(V,{to:`/api-explorer/${e.name}`,children:[(0,y.jsx)(x.A,{size:16}),"API Explorer"]})]})]},e.id)})}),(0,y.jsx)(v,{isOpen:b,onClose:()=>w(!1),onSuccess:e=>{(async()=>{try{const e=await fetch((0,k.e9)("/api/repositories"));if(!e.ok)throw new Error("Failed to fetch repositories");const r=await e.json();t(r)}catch(e){}})()}})]})}}}]);
//# sourceMappingURL=382.eefbbdae.chunk.js.map