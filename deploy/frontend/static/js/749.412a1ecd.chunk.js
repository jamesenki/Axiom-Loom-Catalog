"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[749],{7749:(e,s,n)=>{n.r(s),n.d(s,{default:()=>I});var t=n(65043),r=n(73216),i=n(35475),a=n(5464),o=n(72362),l=n(35613),d=n(65469),c=n(14319),h=n(92382),m=n(38326),g=n(75088),p=n(7104),u=n(41680),x=n(19340),y=n(64830),j=n(7365),f=n(57081),w=n(50797),$=n(9875),b=n(21617),v=n(13689),E=n(70579);const k=a.Ay.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.primary};
`,z=a.Ay.div`
  width: 400px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`,A=a.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,C=a.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,S=a.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,Y=a.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[4]};
`,R=a.Ay.div`
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
`,B=(0,a.Ay)(v.Ex)`
  background: ${e=>{var s;switch(null===(s=e.method)||void 0===s?void 0:s.toUpperCase()){case"GET":return"#61AFFE";case"POST":return"#49CC90";case"PUT":return"#FCA130";case"DELETE":return"#F93E3E";case"PATCH":return"#50E3C2";default:return b.w.colors.secondary.mediumGray}}};
  color: white;
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
`,F=a.Ay.div`
  margin-top: ${e=>e.theme.spacing[6]};
`,T=a.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.md};
  border-left: 4px solid ${e=>{switch(e.status){case"passed":return"#10B981";case"failed":return"#EF4444";case"running":return b.w.colors.primary.yellow;case"skipped":return b.w.colors.secondary.mediumGray;default:return b.w.colors.border.light}}};
`,D=a.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
`,P=(0,a.Ay)(v.Zp)`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,q=(0,a.Ay)(v.Zp)`
  text-align: center;
  padding: ${e=>e.theme.spacing[4]};
`,H=a.Ay.div`
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
`,N=a.Ay.pre`
  background: ${e=>e.theme.colors.background.primary};
  padding: ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  overflow: auto;
  max-height: 300px;
  margin-top: ${e=>e.theme.spacing[3]};
`,O=e=>Array.isArray(e.items),I=()=>{const{repoName:e}=(0,r.g)(),[s]=(0,i.ok)(),n=s.get("collection"),[a,I]=(0,t.useState)(!0),[U,_]=(0,t.useState)(null),[L,G]=(0,t.useState)(null),[W,Z]=(0,t.useState)(new Set),[J,M]=(0,t.useState)(new Set),[V,K]=(0,t.useState)(!1),[Q,X]=(0,t.useState)(!1),[ee,se]=(0,t.useState)([]),[ne,te]=(0,t.useState)(null),[re,ie]=(0,t.useState)({iterations:1,delay:0,environment:{},stopOnError:!1}),[ae,oe]=(0,t.useState)({total:0,passed:0,failed:0,skipped:0,duration:0});(0,t.useEffect)(()=>{le()},[e,n]);const le=async()=>{try{if(n){const s=await fetch((0,o.e9)(`/api/repository/${e}/file?path=${encodeURIComponent(n)}`));if(!s.ok)throw new Error("Failed to load collection");const t=await s.json();G(t);const r=new Set,i=function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";e.forEach((e,n)=>{const t=`${s}${n}`;O(e)?i(e.items,`${t}-`):r.add(t)})};i(t.items),Z(r)}}catch(s){_(s instanceof Error?s.message:"Unknown error")}finally{I(!1)}},de=async e=>{const s=Date.now();try{await new Promise(e=>setTimeout(e,1e3*Math.random()+500));const n=Math.random()>.2;return{requestName:e.name,status:n?"passed":"failed",statusCode:n?200:400,duration:Date.now()-s,response:{data:{message:`Response for ${e.name}`}},assertions:[{name:"Status code is 200",passed:n,message:n?"Passed":"Expected 200 but got 400"},{name:"Response time is less than 1000ms",passed:!0,message:"Passed"}]}}catch(U){return{requestName:e.name,status:"failed",duration:Date.now()-s,error:U instanceof Error?U.message:"Request failed"}}},ce=function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return e.map((e,t)=>{const r=`${s}${t}`;if(O(e)){const s=J.has(r);return(0,E.jsxs)("div",{children:[(0,E.jsxs)(R,{level:n,onClick:()=>(e=>{const s=new Set(J);s.has(e)?s.delete(e):s.add(e),M(s)})(r),children:[s?(0,E.jsx)(h.A,{size:16}):(0,E.jsx)(m.A,{size:16}),(0,E.jsx)(u.A,{size:16}),(0,E.jsx)(v.EY,{weight:"medium",children:e.name}),(0,E.jsxs)(v.EY,{size:"small",color:"secondary",children:["(",e.items.length,")"]})]}),s&&ce(e.items,`${r}-`,n+1)]},r)}{const s=W.has(r);return(0,E.jsxs)(R,{level:n,selected:s,onClick:()=>(e=>{const s=new Set(W);s.has(e)?s.delete(e):s.add(e),Z(s)})(r),children:[(0,E.jsx)("input",{type:"checkbox",checked:s,onChange:()=>{},style:{marginRight:b.w.spacing[2]}}),(0,E.jsx)(B,{method:e.method,children:e.method}),(0,E.jsx)(v.EY,{children:e.name})]},r)}})};if(a)return(0,E.jsx)(v.Hh,{text:"Loading Postman collection..."});if(U||!L)return(0,E.jsx)(v.mc,{maxWidth:"lg",children:(0,E.jsxs)(v.wn,{children:[(0,E.jsx)(v.H1,{color:"secondary",children:"Error Loading Collection"}),(0,E.jsx)(v.EY,{color:"secondary",children:U||"Collection not found"}),(0,E.jsx)(v.$n,{as:i.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})});const he=ae.total>0?(ae.passed+ae.failed+ae.skipped)/ae.total*100:0;return(0,E.jsxs)(k,{children:[(0,E.jsxs)(z,{children:[(0,E.jsxs)("div",{style:{padding:b.w.spacing[4]},children:[(0,E.jsxs)(v.$n,{as:i.N_,to:`/api-explorer/${e}`,variant:"outline",size:"sm",style:{marginBottom:b.w.spacing[4]},children:[(0,E.jsx)(d.A,{size:20}),"Back to Explorer"]}),(0,E.jsx)(v.H2,{style:{marginBottom:b.w.spacing[2]},children:L.info.name}),L.info.description&&(0,E.jsx)(v.EY,{size:"small",color:"secondary",style:{marginBottom:b.w.spacing[4]},children:L.info.description})]}),(0,E.jsx)(Y,{children:ce(L.items)}),(0,E.jsxs)(D,{children:[(0,E.jsxs)(v.so,{gap:2,style:{marginBottom:b.w.spacing[3]},children:[(0,E.jsxs)(v.$n,{onClick:async()=>{K(!0),X(!1),se([]);const e=Date.now(),s=[],n=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";e.forEach((e,r)=>{const i=`${t}${r}`;O(e)?n(e.items,`${i}-`):W.has(i)&&s.push({id:i,request:e})})};L&&n(L.items);const t=s.map(e=>{let{request:s}=e;return{requestName:s.name,status:"pending"}});se(t);for(let r=0;r<re.iterations;r++)for(let n=0;n<s.length&&(V&&!Q);n++){const{request:t}=s[n],i=n+r*s.length;te(t.name),se(e=>{const s=[...e];return s[i]={...s[i],status:"running"},s});const a=await de(t);if(se(e=>{const s=[...e];return s[i]=a,s}),oe(s=>({...s,total:s.total+1,passed:s.passed+("passed"===a.status?1:0),failed:s.failed+("failed"===a.status?1:0),duration:Date.now()-e})),"failed"===a.status&&re.stopOnError)break;re.delay>0&&n<s.length-1&&await new Promise(e=>setTimeout(e,re.delay))}K(!1),te(null)},disabled:V&&!Q,style:{flex:1},children:[(0,E.jsx)(y.A,{size:20}),V&&!Q?"Running...":"Run Collection"]}),V&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(v.$n,{variant:"outline",onClick:()=>X(!Q),children:Q?(0,E.jsx)(y.A,{size:20}):(0,E.jsx)(x.A,{size:20})}),(0,E.jsx)(v.$n,{variant:"outline",onClick:()=>{K(!1),te(null)},children:(0,E.jsx)(f.A,{size:20})})]})]}),(0,E.jsxs)(v.EY,{size:"small",color:"secondary",children:[W.size," of ",L.items.length," requests selected"]})]})]}),(0,E.jsxs)(A,{children:[(0,E.jsx)(C,{children:(0,E.jsxs)(v.so,{align:"center",justify:"between",children:[(0,E.jsxs)("div",{children:[(0,E.jsx)(v.H2,{style:{margin:0},children:"Collection Runner"}),ne&&(0,E.jsxs)(v.EY,{color:"secondary",style:{marginTop:b.w.spacing[1]},children:["Running: ",ne]})]}),(0,E.jsxs)(v.so,{gap:2,children:[(0,E.jsxs)(v.$n,{variant:"outline",onClick:()=>{const e={collection:null===L||void 0===L?void 0:L.info.name,timestamp:(new Date).toISOString(),config:re,stats:ae,results:ee},s=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(s),t=document.createElement("a");t.href=n,t.download=`postman-runner-results-${Date.now()}.json`,t.click()},disabled:0===ee.length,children:[(0,E.jsx)(p.A,{size:20}),"Export Results"]}),(0,E.jsxs)(v.$n,{variant:"outline",children:[(0,E.jsx)(j.A,{size:20}),"Configure"]})]})]})}),(0,E.jsxs)(S,{children:[(0,E.jsxs)(P,{children:[(0,E.jsx)(v.aR,{children:(0,E.jsx)(v.ZB,{children:"Runner Configuration"})}),(0,E.jsx)(v.Wu,{children:(0,E.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:b.w.spacing[4]},children:[(0,E.jsxs)("div",{children:[(0,E.jsx)(v.EY,{weight:"semibold",size:"small",style:{marginBottom:b.w.spacing[1]},children:"Iterations"}),(0,E.jsx)(v.pd,{type:"number",min:"1",value:re.iterations,onChange:e=>ie({...re,iterations:parseInt(e.target.value)||1})})]}),(0,E.jsxs)("div",{children:[(0,E.jsx)(v.EY,{weight:"semibold",size:"small",style:{marginBottom:b.w.spacing[1]},children:"Delay (ms)"}),(0,E.jsx)(v.pd,{type:"number",min:"0",value:re.delay,onChange:e=>ie({...re,delay:parseInt(e.target.value)||0})})]}),(0,E.jsxs)("div",{children:[(0,E.jsx)(v.EY,{weight:"semibold",size:"small",style:{marginBottom:b.w.spacing[1]},children:"Data File"}),(0,E.jsxs)(v.$n,{size:"sm",variant:"outline",children:[(0,E.jsx)(w.A,{size:16}),"Choose File"]})]}),(0,E.jsxs)("div",{children:[(0,E.jsx)(v.EY,{weight:"semibold",size:"small",style:{marginBottom:b.w.spacing[1]},children:"Stop on Error"}),(0,E.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:b.w.spacing[2]},children:[(0,E.jsx)("input",{type:"checkbox",checked:re.stopOnError,onChange:e=>ie({...re,stopOnError:e.target.checked})}),(0,E.jsx)(v.EY,{size:"small",children:"Enabled"})]})]})]})})]}),(V||ee.length>0)&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:b.w.spacing[4],marginBottom:b.w.spacing[6]},children:[(0,E.jsxs)(q,{children:[(0,E.jsx)(v.H3,{style:{margin:0},children:ae.total}),(0,E.jsx)(v.EY,{size:"small",color:"secondary",children:"Total Requests"})]}),(0,E.jsxs)(q,{children:[(0,E.jsx)(v.H3,{style:{margin:0,color:"#10B981"},children:ae.passed}),(0,E.jsx)(v.EY,{size:"small",color:"secondary",children:"Passed"})]}),(0,E.jsxs)(q,{children:[(0,E.jsx)(v.H3,{style:{margin:0,color:"#EF4444"},children:ae.failed}),(0,E.jsx)(v.EY,{size:"small",color:"secondary",children:"Failed"})]}),(0,E.jsxs)(q,{children:[(0,E.jsx)(v.H3,{style:{margin:0},children:ae.duration>0?`${(ae.duration/1e3).toFixed(1)}s`:"0s"}),(0,E.jsx)(v.EY,{size:"small",color:"secondary",children:"Duration"})]})]}),(0,E.jsx)(H,{progress:he}),(0,E.jsxs)(F,{children:[(0,E.jsx)(v.H3,{children:"Test Results"}),ee.map((e,s)=>(0,E.jsxs)(T,{status:e.status,children:[(0,E.jsxs)(v.so,{align:"center",justify:"between",children:[(0,E.jsxs)(v.so,{align:"center",gap:3,children:["pending"===e.status&&(0,E.jsx)(g.A,{size:20,color:b.w.colors.text.secondary}),"running"===e.status&&(0,E.jsx)("div",{className:"spinner"}),"passed"===e.status&&(0,E.jsx)(c.A,{size:20,color:"#10B981"}),"failed"===e.status&&(0,E.jsx)($.A,{size:20,color:"#EF4444"}),"skipped"===e.status&&(0,E.jsx)(l.A,{size:20,color:b.w.colors.text.secondary}),(0,E.jsxs)("div",{children:[(0,E.jsx)(v.EY,{weight:"semibold",children:e.requestName}),e.statusCode&&(0,E.jsxs)(v.EY,{size:"small",color:"secondary",children:["Status: ",e.statusCode," \u2022 ",e.duration,"ms"]})]})]}),e.assertions&&(0,E.jsx)(v.so,{gap:2,children:(0,E.jsxs)(v.Ex,{variant:e.assertions.every(e=>e.passed)?"success":"danger",children:[e.assertions.filter(e=>e.passed).length,"/",e.assertions.length," Passed"]})})]}),e.error&&(0,E.jsxs)(v.EY,{color:"secondary",size:"small",style:{marginTop:b.w.spacing[2]},children:["Error: ",e.error]}),e.assertions&&e.assertions.some(e=>!e.passed)&&(0,E.jsxs)("div",{style:{marginTop:b.w.spacing[3]},children:[(0,E.jsx)(v.EY,{weight:"semibold",size:"small",children:"Failed Assertions:"}),e.assertions.filter(e=>!e.passed).map((e,s)=>(0,E.jsxs)(v.EY,{size:"small",color:"secondary",children:["\u2022 ",e.name,": ",e.message]},s))]}),e.response&&(0,E.jsxs)("details",{style:{marginTop:b.w.spacing[3]},children:[(0,E.jsx)("summary",{style:{cursor:"pointer"},children:(0,E.jsx)(v.EY,{size:"small",weight:"semibold",children:"View Response"})}),(0,E.jsx)(N,{children:JSON.stringify(e.response,null,2)})]})]},s))]})]})]})]})]})}}}]);
//# sourceMappingURL=749.412a1ecd.chunk.js.map