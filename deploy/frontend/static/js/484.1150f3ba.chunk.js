"use strict";(self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[]).push([[484],{38484:(e,n,r)=>{r.r(n),r.d(n,{default:()=>P});var s=r(65043),t=r(73216),o=r(35475),i=r(5464),a=r(35613),c=r(65469),l=r(92382),d=r(38326),p=r(72313),m=r(7104),h=r(9362),g=r(55731),u=r(64830),x=r(7365),y=r(21617),j=r(50577),f=r(70579);const $=i.Ay.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.primary};
`,b=i.Ay.div`
  width: 350px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  overflow-y: auto;
`,w=i.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,v=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,k=i.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,S=i.Ay.div`
  padding: ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  margin: ${e=>e.theme.spacing[4]};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
    box-shadow: ${e=>e.theme.shadows.md};
  }
`,A=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]};
  margin-left: ${e=>e.theme.spacing[6]};
  margin-right: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[2]};
  background: ${e=>e.selected?y.w.colors.primary.yellow:y.w.colors.background.secondary};
  color: ${e=>e.selected?y.w.colors.primary.black:y.w.colors.text.primary};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.selected?y.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
  }
`,C=(0,i.Ay)(j.Ex)`
  background: ${e=>e.theme.colors.accent.purple};
  color: white;
  margin-left: ${e=>e.theme.spacing[2]};
`,z=i.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,q=i.Ay.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${e=>e.theme.spacing[4]};
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
`,E=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  overflow: hidden;
`,R=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`,N=i.Ay.pre`
  padding: ${e=>e.theme.spacing[4]};
  margin: 0;
  overflow: auto;
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${e=>e.theme.colors.text.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
`,T=i.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,_=i.Ay.div`
  margin-top: ${e=>e.theme.spacing[4]};
`,F=i.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  margin-bottom: ${e=>e.theme.spacing[2]};
`,B=(0,i.Ay)(j.Zp)`
  margin-top: ${e=>e.theme.spacing[6]};
  background: ${e=>e.theme.colors.background.primary};
`,O=i.Ay.pre`
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.primary};
  white-space: pre-wrap;
  margin: 0;
`,P=(i.Ay.div`
  padding: ${e=>e.theme.spacing[2]} 0;
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`,i.Ay.span`
  color: ${e=>e.theme.colors.accent.blue};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
`,()=>{const{repoName:e}=(0,t.g)(),[n]=(0,o.ok)(),r=n.get("proto"),[i,P]=(0,s.useState)(!0),[D,Y]=(0,s.useState)(null),[H,L]=(0,s.useState)([]),[J,U]=(0,s.useState)(null),[I,M]=(0,s.useState)(new Set),[W,V]=(0,s.useState)("localhost:50051"),[Z,G]=(0,s.useState)({authorization:"Bearer token"}),[K,X]=(0,s.useState)("{}"),[Q,ee]=(0,s.useState)(null),[ne,re]=(0,s.useState)(!1),[se,te]=(0,s.useState)(""),[oe,ie]=(0,s.useState)(!1);(0,s.useEffect)(()=>{ae()},[e,r]);const ae=async()=>{try{if(r){const n=await fetch(`/api/repository/${e}/file?path=${encodeURIComponent(r)}`);if(!n.ok)throw new Error("Failed to load proto file");const s=await n.text();te(s);const t=ce(s);L(t),t.length>0&&M(new Set([t[0].name]))}}catch(n){Y(n instanceof Error?n.message:"Unknown error")}finally{P(!1)}},ce=e=>{const n=[],r=e.match(/package\s+([\w.]+);/),s=r?r[1]:void 0,t=/service\s+(\w+)\s*{([^}]*)}/g;let o;for(;null!==(o=t.exec(e));){const e=o[1],r=o[2],t=[],i=/rpc\s+(\w+)\s*\(\s*(stream\s+)?(\w+)\s*\)\s*returns\s*\(\s*(stream\s+)?(\w+)\s*\)/g;let a;for(;null!==(a=i.exec(r));)t.push({name:a[1],requestType:a[3],responseType:a[5],requestStream:!!a[2],responseStream:!!a[4]});n.push({name:e,methods:t,package:s})}return n},le=e=>({GetRequest:{id:"123"},ListRequest:{page:1,pageSize:10},CreateRequest:{name:"Example",description:"Sample data"},UpdateRequest:{id:"123",name:"Updated"},DeleteRequest:{id:"123"}}[e]||{field1:"value1",field2:123,field3:!0});return i?(0,f.jsx)(j.Hh,{text:"Loading gRPC definitions..."}):D||0===H.length?(0,f.jsx)(j.mc,{maxWidth:"lg",children:(0,f.jsxs)(j.wn,{children:[(0,f.jsxs)(j.H1,{color:"secondary",children:[(0,f.jsx)(a.A,{size:32,style:{marginRight:y.w.spacing[2]}}),"No gRPC Services Found"]}),(0,f.jsx)(j.EY,{color:"secondary",children:D||"No proto files found in this repository."}),(0,f.jsx)(j.$n,{as:o.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})}):(0,f.jsxs)($,{children:[(0,f.jsxs)(b,{children:[(0,f.jsxs)("div",{style:{padding:y.w.spacing[4]},children:[(0,f.jsxs)(j.$n,{as:o.N_,to:`/api-explorer/${e}`,variant:"outline",size:"sm",style:{marginBottom:y.w.spacing[4]},children:[(0,f.jsx)(c.A,{size:20}),"Back to Explorer"]}),(0,f.jsxs)(j.H2,{style:{marginBottom:y.w.spacing[4]},children:[(0,f.jsx)(g.A,{size:24,style:{marginRight:y.w.spacing[2]}}),"gRPC Services"]})]}),H.map(e=>(0,f.jsxs)("div",{children:[(0,f.jsx)(S,{onClick:()=>(e=>{const n=new Set(I);n.has(e)?n.delete(e):n.add(e),M(n)})(e.name),children:(0,f.jsxs)(j.so,{align:"center",justify:"between",children:[(0,f.jsxs)("div",{children:[(0,f.jsx)(j.EY,{weight:"semibold",children:e.name}),(0,f.jsxs)(j.EY,{size:"small",color:"secondary",children:[e.methods.length," methods"]})]}),I.has(e.name)?(0,f.jsx)(l.A,{size:20}):(0,f.jsx)(d.A,{size:20})]})}),I.has(e.name)&&(0,f.jsx)("div",{children:e.methods.map(n=>(0,f.jsxs)(A,{selected:(null===J||void 0===J?void 0:J.method.name)===n.name,onClick:()=>((e,n)=>{U({service:e,method:n});const r=le(n.requestType);X(JSON.stringify(r,null,2))})(e,n),children:[(0,f.jsxs)(j.so,{align:"center",justify:"between",children:[(0,f.jsx)(j.EY,{weight:"medium",children:n.name}),(0,f.jsxs)("div",{children:[n.requestStream&&(0,f.jsx)(C,{size:"sm",children:"stream"}),n.responseStream&&(0,f.jsx)(C,{size:"sm",children:"stream"})]})]}),(0,f.jsxs)(j.EY,{size:"small",color:"secondary",children:[n.requestType," \u2192 ",n.responseType]})]},n.name))})]},e.name))]}),(0,f.jsxs)(w,{children:[(0,f.jsx)(v,{children:(0,f.jsxs)(j.so,{align:"center",justify:"between",children:[(0,f.jsxs)("div",{children:[(0,f.jsx)(j.H2,{style:{margin:0},children:J?J.method.name:"Select a method"}),J&&(0,f.jsxs)(j.EY,{color:"secondary",style:{marginTop:y.w.spacing[1]},children:[J.service.name," Service"]})]}),(0,f.jsxs)(j.$n,{variant:"outline",onClick:()=>ie(!oe),children:[(0,f.jsx)(h.A,{size:20}),oe?"Hide":"View"," Proto"]})]})}),(0,f.jsxs)(k,{children:[J?(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(T,{children:[(0,f.jsx)(j.H3,{children:"Connection"}),(0,f.jsxs)(j.so,{gap:3,style:{marginBottom:y.w.spacing[4]},children:[(0,f.jsx)(j.pd,{type:"text",value:W,onChange:e=>V(e.target.value),placeholder:"localhost:50051",style:{flex:1}}),(0,f.jsxs)(j.$n,{variant:"outline",children:[(0,f.jsx)(x.A,{size:20}),"TLS Config"]})]}),(0,f.jsxs)(_,{children:[(0,f.jsx)(j.EY,{weight:"semibold",style:{marginBottom:y.w.spacing[2]},children:"Metadata"}),Object.entries(Z).map((e,n)=>{let[r,s]=e;return(0,f.jsxs)(F,{children:[(0,f.jsx)(j.pd,{type:"text",value:r,placeholder:"Key",onChange:e=>{const n={...Z};delete n[r],n[e.target.value]=s,G(n)}}),(0,f.jsx)(j.pd,{type:"text",value:s,placeholder:"Value",onChange:e=>{G({...Z,[r]:e.target.value})}})]},n)}),(0,f.jsx)(j.$n,{size:"sm",variant:"outline",onClick:()=>G({...Z,"":""}),children:"Add Metadata"})]})]}),(0,f.jsxs)(z,{children:[(0,f.jsxs)(j.so,{align:"center",justify:"between",style:{marginBottom:y.w.spacing[2]},children:[(0,f.jsxs)(j.H3,{children:["Request (",J.method.requestType,")"]}),(0,f.jsxs)(j.so,{gap:2,children:[(0,f.jsx)(j.$n,{size:"sm",variant:"outline",onClick:()=>{const e=JSON.stringify(JSON.parse(K),null,2);X(e)},children:"Format"}),(0,f.jsx)(j.$n,{onClick:async()=>{if(!J)return;re(!0);const e=Date.now();try{const n=JSON.parse(K);await new Promise(e=>setTimeout(e,500));const r={success:!0,data:{message:`Response from ${J.method.name}`,timestamp:(new Date).toISOString(),request:n,metadata:{service:J.service.name,method:J.method.name,endpoint:W}},duration:Date.now()-e};ee(r)}catch(n){ee({error:n instanceof Error?n.message:"Request failed",code:"INTERNAL",details:"Failed to execute gRPC request"})}finally{re(!1)}},disabled:ne,children:ne?"Executing...":(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(u.A,{size:20}),"Execute"]})})]})]}),(0,f.jsx)(q,{value:K,onChange:e=>X(e.target.value),placeholder:"Enter request JSON..."})]}),Q&&(0,f.jsxs)(E,{children:[(0,f.jsxs)(R,{children:[(0,f.jsxs)(j.so,{align:"center",gap:3,children:[(0,f.jsx)(j.EY,{weight:"semibold",children:"Response"}),Q.success?(0,f.jsx)(j.Ex,{variant:"success",children:"Success"}):(0,f.jsx)(j.Ex,{variant:"danger",children:"Error"}),Q.duration&&(0,f.jsxs)(j.EY,{size:"small",color:"secondary",children:[Q.duration,"ms"]})]}),(0,f.jsxs)(j.so,{gap:2,children:[(0,f.jsxs)(j.$n,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard.writeText(JSON.stringify(Q,null,2))},children:[(0,f.jsx)(p.A,{size:16}),"Copy"]}),(0,f.jsxs)(j.$n,{size:"sm",variant:"outline",onClick:()=>{const e=new Blob([JSON.stringify(Q,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),r=document.createElement("a");r.href=n,r.download=`${J.method.name}-response.json`,r.click()},children:[(0,f.jsx)(m.A,{size:16}),"Download"]})]})]}),(0,f.jsx)(N,{children:JSON.stringify(Q.data||Q.error,null,2)})]}),(0,f.jsxs)("div",{style:{marginTop:y.w.spacing[6]},children:[(0,f.jsx)(j.H3,{children:"Code Examples"}),(0,f.jsx)(j.so,{gap:2,style:{marginBottom:y.w.spacing[3]},children:["node","python","go"].map(e=>(0,f.jsxs)(j.$n,{size:"sm",variant:"outline",onClick:()=>{const n=(e=>{if(!J)return"";const{service:n,method:r}=J;switch(e){case"node":return`const grpc = require('@grpc/grpc-js');\nconst protoLoader = require('@grpc/proto-loader');\n\n// Load proto file\nconst packageDefinition = protoLoader.loadSync('path/to/your.proto');\nconst proto = grpc.loadPackageDefinition(packageDefinition);\n\n// Create client\nconst client = new proto.${n.package||"package"}.${n.name}(\n  '${W}',\n  grpc.credentials.createInsecure()\n);\n\n// Make request\nconst request = ${K};\n\nclient.${r.name}(request, (error, response) => {\n  if (error) {\n    console.error('Error:', error);\n  } else {\n    console.log('Response:', response);\n  }\n});`;case"python":return`import grpc\nimport your_pb2\nimport your_pb2_grpc\n\n# Create channel and stub\nchannel = grpc.insecure_channel('${W}')\nstub = your_pb2_grpc.${n.name}Stub(channel)\n\n# Create request\nrequest = your_pb2.${r.requestType}(\n${K.split("\n").map(e=>"    "+e).join("\n")}\n)\n\n# Make request\ntry:\n    response = stub.${r.name}(request)\n    print(f"Response: {response}")\nexcept grpc.RpcError as e:\n    print(f"Error: {e.code()}: {e.details()}")`;case"go":return`package main\n\nimport (\n    "context"\n    "log"\n    "google.golang.org/grpc"\n    pb "path/to/your/proto"\n)\n\nfunc main() {\n    // Create connection\n    conn, err := grpc.Dial("${W}", grpc.WithInsecure())\n    if err != nil {\n        log.Fatalf("Failed to connect: %v", err)\n    }\n    defer conn.Close()\n    \n    // Create client\n    client := pb.New${n.name}Client(conn)\n    \n    // Create request\n    request := &pb.${r.requestType}{\n        // Fill in request fields\n    }\n    \n    // Make request\n    response, err := client.${r.name}(context.Background(), request)\n    if err != nil {\n        log.Fatalf("Request failed: %v", err)\n    }\n    \n    log.Printf("Response: %v", response)\n}`;default:return""}})(e);navigator.clipboard.writeText(n)},children:[(0,f.jsx)(p.A,{size:16}),e.charAt(0).toUpperCase()+e.slice(1)]},e))})]})]}):(0,f.jsxs)("div",{style:{textAlign:"center",padding:y.w.spacing[16]},children:[(0,f.jsx)(g.A,{size:64,color:y.w.colors.text.secondary}),(0,f.jsx)(j.H2,{color:"secondary",style:{marginTop:y.w.spacing[4]},children:"Select a gRPC Method"}),(0,f.jsx)(j.EY,{color:"secondary",children:"Choose a service and method from the sidebar to start testing"})]}),oe&&se&&(0,f.jsxs)(B,{children:[(0,f.jsx)(j.aR,{children:(0,f.jsx)(j.ZB,{children:"Proto Definition"})}),(0,f.jsx)(j.Wu,{children:(0,f.jsx)(O,{children:se})})]})]})]})]})})}}]);
//# sourceMappingURL=484.1150f3ba.chunk.js.map