"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[749],{7749:(e,s,n)=>{n.r(s),n.d(s,{default:()=>O});var t=n(65043),r=n(73216),i=n(35475),a=n(5464),o=n(35613),l=n(65469),d=n(14319),c=n(92382),h=n(38326),m=n(75088),p=n(7104),g=n(41680),u=n(19340),x=n(64830),y=n(7365),j=n(57081),f=n(50797),w=n(9875),$=n(21617),b=n(50577),v=n(70579);const E=a.Ay.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.primary};
`,k=a.Ay.div`
  width: 400px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`,z=a.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,A=a.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,C=a.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,S=a.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[4]};
`,Y=a.Ay.div`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  margin-left: ${e=>24*(e.level||0)}px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  background: ${e=>e.selected?"rgba(255, 230, 0, 0.1)":"transparent"};
  border-left: ${e=>e.selected?`3px solid ${e=>e.theme.colors.primary.yellow}`:"3px solid transparent"};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 230, 0, 0.05);
  }
`,R=(0,a.Ay)(b.Ex)`
  background: ${e=>{var s;switch(null===(s=e.method)||void 0===s?void 0:s.toUpperCase()){case"GET":return"#61AFFE";case"POST":return"#49CC90";case"PUT":return"#FCA130";case"DELETE":return"#F93E3E";case"PATCH":return"#50E3C2";default:return $.w.colors.secondary.mediumGray}}};
  color: white;
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
`,B=a.Ay.div`
  margin-top: ${e=>e.theme.spacing[6]};
`,F=a.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.md};
  border-left: 4px solid ${e=>{switch(e.status){case"passed":return"#10B981";case"failed":return"#EF4444";case"running":return $.w.colors.primary.yellow;case"skipped":return $.w.colors.secondary.mediumGray;default:return $.w.colors.border.light}}};
`,T=a.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
`,D=(0,a.Ay)(b.Zp)`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,P=(0,a.Ay)(b.Zp)`
  text-align: center;
  padding: ${e=>e.theme.spacing[4]};
`,q=a.Ay.div`
  width: 100%;
  height: 8px;
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.full};
  overflow: hidden;
  margin: ${e=>e.theme.spacing[4]} 0;
  
  &::after {
    content: '';
    display: block;
    width: ${e=>e.progress}%;
    height: 100%;
    background: ${e=>e.theme.colors.primary.yellow};
    transition: width 0.3s ease;
  }
`,H=a.Ay.pre`
  background: ${e=>e.theme.colors.background.primary};
  padding: ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  overflow: auto;
  max-height: 300px;
  margin-top: ${e=>e.theme.spacing[3]};
`,N=e=>Array.isArray(e.items),O=()=>{const{repoName:e}=(0,r.g)(),[s]=(0,i.ok)(),n=s.get("collection"),[a,O]=(0,t.useState)(!0),[_,I]=(0,t.useState)(null),[U,L]=(0,t.useState)(null),[G,W]=(0,t.useState)(new Set),[Z,J]=(0,t.useState)(new Set),[M,V]=(0,t.useState)(!1),[K,Q]=(0,t.useState)(!1),[X,ee]=(0,t.useState)([]),[se,ne]=(0,t.useState)(null),[te,re]=(0,t.useState)({iterations:1,delay:0,environment:{},stopOnError:!1}),[ie,ae]=(0,t.useState)({total:0,passed:0,failed:0,skipped:0,duration:0});(0,t.useEffect)(()=>{oe()},[e,n]);const oe=async()=>{try{if(n){const s=await fetch(`/api/repository/${e}/file?path=${encodeURIComponent(n)}`);if(!s.ok)throw new Error("Failed to load collection");const t=await s.json();L(t);const r=new Set,i=function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";e.forEach((e,n)=>{const t=`${s}${n}`;N(e)?i(e.items,`${t}-`):r.add(t)})};i(t.items),W(r)}}catch(s){I(s instanceof Error?s.message:"Unknown error")}finally{O(!1)}},le=async e=>{const s=Date.now();try{await new Promise(e=>setTimeout(e,1e3*Math.random()+500));const n=Math.random()>.2;return{requestName:e.name,status:n?"passed":"failed",statusCode:n?200:400,duration:Date.now()-s,response:{data:{message:`Response for ${e.name}`}},assertions:[{name:"Status code is 200",passed:n,message:n?"Passed":"Expected 200 but got 400"},{name:"Response time is less than 1000ms",passed:!0,message:"Passed"}]}}catch(_){return{requestName:e.name,status:"failed",duration:Date.now()-s,error:_ instanceof Error?_.message:"Request failed"}}},de=function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return e.map((e,t)=>{const r=`${s}${t}`;if(N(e)){const s=Z.has(r);return(0,v.jsxs)("div",{children:[(0,v.jsxs)(Y,{level:n,onClick:()=>(e=>{const s=new Set(Z);s.has(e)?s.delete(e):s.add(e),J(s)})(r),children:[s?(0,v.jsx)(c.A,{size:16}):(0,v.jsx)(h.A,{size:16}),(0,v.jsx)(g.A,{size:16}),(0,v.jsx)(b.EY,{weight:"medium",children:e.name}),(0,v.jsxs)(b.EY,{size:"small",color:"secondary",children:["(",e.items.length,")"]})]}),s&&de(e.items,`${r}-`,n+1)]},r)}{const s=G.has(r);return(0,v.jsxs)(Y,{level:n,selected:s,onClick:()=>(e=>{const s=new Set(G);s.has(e)?s.delete(e):s.add(e),W(s)})(r),children:[(0,v.jsx)("input",{type:"checkbox",checked:s,onChange:()=>{},style:{marginRight:$.w.spacing[2]}}),(0,v.jsx)(R,{method:e.method,children:e.method}),(0,v.jsx)(b.EY,{children:e.name})]},r)}})};if(a)return(0,v.jsx)(b.Hh,{text:"Loading Postman collection..."});if(_||!U)return(0,v.jsx)(b.mc,{maxWidth:"lg",children:(0,v.jsxs)(b.wn,{children:[(0,v.jsx)(b.H1,{color:"secondary",children:"Error Loading Collection"}),(0,v.jsx)(b.EY,{color:"secondary",children:_||"Collection not found"}),(0,v.jsx)(b.$n,{as:i.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})});const ce=ie.total>0?(ie.passed+ie.failed+ie.skipped)/ie.total*100:0;return(0,v.jsxs)(E,{children:[(0,v.jsxs)(k,{children:[(0,v.jsxs)("div",{style:{padding:$.w.spacing[4]},children:[(0,v.jsxs)(b.$n,{as:i.N_,to:`/api-explorer/${e}`,variant:"outline",size:"sm",style:{marginBottom:$.w.spacing[4]},children:[(0,v.jsx)(l.A,{size:20}),"Back to Explorer"]}),(0,v.jsx)(b.H2,{style:{marginBottom:$.w.spacing[2]},children:U.info.name}),U.info.description&&(0,v.jsx)(b.EY,{size:"small",color:"secondary",style:{marginBottom:$.w.spacing[4]},children:U.info.description})]}),(0,v.jsx)(S,{children:de(U.items)}),(0,v.jsxs)(T,{children:[(0,v.jsxs)(b.so,{gap:2,style:{marginBottom:$.w.spacing[3]},children:[(0,v.jsxs)(b.$n,{onClick:async()=>{V(!0),Q(!1),ee([]);const e=Date.now(),s=[],n=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";e.forEach((e,r)=>{const i=`${t}${r}`;N(e)?n(e.items,`${i}-`):G.has(i)&&s.push({id:i,request:e})})};U&&n(U.items);const t=s.map(e=>{let{request:s}=e;return{requestName:s.name,status:"pending"}});ee(t);for(let r=0;r<te.iterations;r++)for(let n=0;n<s.length&&(M&&!K);n++){const{request:t}=s[n],i=n+r*s.length;ne(t.name),ee(e=>{const s=[...e];return s[i]={...s[i],status:"running"},s});const a=await le(t);if(ee(e=>{const s=[...e];return s[i]=a,s}),ae(s=>({...s,total:s.total+1,passed:s.passed+("passed"===a.status?1:0),failed:s.failed+("failed"===a.status?1:0),duration:Date.now()-e})),"failed"===a.status&&te.stopOnError)break;te.delay>0&&n<s.length-1&&await new Promise(e=>setTimeout(e,te.delay))}V(!1),ne(null)},disabled:M&&!K,style:{flex:1},children:[(0,v.jsx)(x.A,{size:20}),M&&!K?"Running...":"Run Collection"]}),M&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(b.$n,{variant:"outline",onClick:()=>Q(!K),children:K?(0,v.jsx)(x.A,{size:20}):(0,v.jsx)(u.A,{size:20})}),(0,v.jsx)(b.$n,{variant:"outline",onClick:()=>{V(!1),ne(null)},children:(0,v.jsx)(j.A,{size:20})})]})]}),(0,v.jsxs)(b.EY,{size:"small",color:"secondary",children:[G.size," of ",U.items.length," requests selected"]})]})]}),(0,v.jsxs)(z,{children:[(0,v.jsx)(A,{children:(0,v.jsxs)(b.so,{align:"center",justify:"between",children:[(0,v.jsxs)("div",{children:[(0,v.jsx)(b.H2,{style:{margin:0},children:"Collection Runner"}),se&&(0,v.jsxs)(b.EY,{color:"secondary",style:{marginTop:$.w.spacing[1]},children:["Running: ",se]})]}),(0,v.jsxs)(b.so,{gap:2,children:[(0,v.jsxs)(b.$n,{variant:"outline",onClick:()=>{const e={collection:null===U||void 0===U?void 0:U.info.name,timestamp:(new Date).toISOString(),config:te,stats:ie,results:X},s=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(s),t=document.createElement("a");t.href=n,t.download=`postman-runner-results-${Date.now()}.json`,t.click()},disabled:0===X.length,children:[(0,v.jsx)(p.A,{size:20}),"Export Results"]}),(0,v.jsxs)(b.$n,{variant:"outline",children:[(0,v.jsx)(y.A,{size:20}),"Configure"]})]})]})}),(0,v.jsxs)(C,{children:[(0,v.jsxs)(D,{children:[(0,v.jsx)(b.aR,{children:(0,v.jsx)(b.ZB,{children:"Runner Configuration"})}),(0,v.jsx)(b.Wu,{children:(0,v.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:$.w.spacing[4]},children:[(0,v.jsxs)("div",{children:[(0,v.jsx)(b.EY,{weight:"semibold",size:"small",style:{marginBottom:$.w.spacing[1]},children:"Iterations"}),(0,v.jsx)(b.pd,{type:"number",min:"1",value:te.iterations,onChange:e=>re({...te,iterations:parseInt(e.target.value)||1})})]}),(0,v.jsxs)("div",{children:[(0,v.jsx)(b.EY,{weight:"semibold",size:"small",style:{marginBottom:$.w.spacing[1]},children:"Delay (ms)"}),(0,v.jsx)(b.pd,{type:"number",min:"0",value:te.delay,onChange:e=>re({...te,delay:parseInt(e.target.value)||0})})]}),(0,v.jsxs)("div",{children:[(0,v.jsx)(b.EY,{weight:"semibold",size:"small",style:{marginBottom:$.w.spacing[1]},children:"Data File"}),(0,v.jsxs)(b.$n,{size:"sm",variant:"outline",children:[(0,v.jsx)(f.A,{size:16}),"Choose File"]})]}),(0,v.jsxs)("div",{children:[(0,v.jsx)(b.EY,{weight:"semibold",size:"small",style:{marginBottom:$.w.spacing[1]},children:"Stop on Error"}),(0,v.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:$.w.spacing[2]},children:[(0,v.jsx)("input",{type:"checkbox",checked:te.stopOnError,onChange:e=>re({...te,stopOnError:e.target.checked})}),(0,v.jsx)(b.EY,{size:"small",children:"Enabled"})]})]})]})})]}),(M||X.length>0)&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:$.w.spacing[4],marginBottom:$.w.spacing[6]},children:[(0,v.jsxs)(P,{children:[(0,v.jsx)(b.H3,{style:{margin:0},children:ie.total}),(0,v.jsx)(b.EY,{size:"small",color:"secondary",children:"Total Requests"})]}),(0,v.jsxs)(P,{children:[(0,v.jsx)(b.H3,{style:{margin:0,color:"#10B981"},children:ie.passed}),(0,v.jsx)(b.EY,{size:"small",color:"secondary",children:"Passed"})]}),(0,v.jsxs)(P,{children:[(0,v.jsx)(b.H3,{style:{margin:0,color:"#EF4444"},children:ie.failed}),(0,v.jsx)(b.EY,{size:"small",color:"secondary",children:"Failed"})]}),(0,v.jsxs)(P,{children:[(0,v.jsx)(b.H3,{style:{margin:0},children:ie.duration>0?`${(ie.duration/1e3).toFixed(1)}s`:"0s"}),(0,v.jsx)(b.EY,{size:"small",color:"secondary",children:"Duration"})]})]}),(0,v.jsx)(q,{progress:ce}),(0,v.jsxs)(B,{children:[(0,v.jsx)(b.H3,{children:"Test Results"}),X.map((e,s)=>(0,v.jsxs)(F,{status:e.status,children:[(0,v.jsxs)(b.so,{align:"center",justify:"between",children:[(0,v.jsxs)(b.so,{align:"center",gap:3,children:["pending"===e.status&&(0,v.jsx)(m.A,{size:20,color:$.w.colors.text.secondary}),"running"===e.status&&(0,v.jsx)("div",{className:"spinner"}),"passed"===e.status&&(0,v.jsx)(d.A,{size:20,color:"#10B981"}),"failed"===e.status&&(0,v.jsx)(w.A,{size:20,color:"#EF4444"}),"skipped"===e.status&&(0,v.jsx)(o.A,{size:20,color:$.w.colors.text.secondary}),(0,v.jsxs)("div",{children:[(0,v.jsx)(b.EY,{weight:"semibold",children:e.requestName}),e.statusCode&&(0,v.jsxs)(b.EY,{size:"small",color:"secondary",children:["Status: ",e.statusCode," \u2022 ",e.duration,"ms"]})]})]}),e.assertions&&(0,v.jsx)(b.so,{gap:2,children:(0,v.jsxs)(b.Ex,{variant:e.assertions.every(e=>e.passed)?"success":"danger",children:[e.assertions.filter(e=>e.passed).length,"/",e.assertions.length," Passed"]})})]}),e.error&&(0,v.jsxs)(b.EY,{color:"secondary",size:"small",style:{marginTop:$.w.spacing[2]},children:["Error: ",e.error]}),e.assertions&&e.assertions.some(e=>!e.passed)&&(0,v.jsxs)("div",{style:{marginTop:$.w.spacing[3]},children:[(0,v.jsx)(b.EY,{weight:"semibold",size:"small",children:"Failed Assertions:"}),e.assertions.filter(e=>!e.passed).map((e,s)=>(0,v.jsxs)(b.EY,{size:"small",color:"secondary",children:["\u2022 ",e.name,": ",e.message]},s))]}),e.response&&(0,v.jsxs)("details",{style:{marginTop:$.w.spacing[3]},children:[(0,v.jsx)("summary",{style:{cursor:"pointer"},children:(0,v.jsx)(b.EY,{size:"small",weight:"semibold",children:"View Response"})}),(0,v.jsx)(H,{children:JSON.stringify(e.response,null,2)})]})]},s))]})]})]})]})]})}}}]);
//# sourceMappingURL=749.b11a3267.chunk.js.map