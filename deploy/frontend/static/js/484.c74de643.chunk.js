"use strict";(self.webpackChunkaxiom_loom_catalog=self.webpackChunkaxiom_loom_catalog||[]).push([[484],{38484:(e,n,r)=>{r.r(n),r.d(n,{default:()=>D});var t=r(65043),s=r(73216),o=r(35475),i=r(5464),a=r(72362),c=r(35613),l=r(65469),d=r(92382),p=r(38326),m=r(72313),h=r(7104),g=r(9362),u=r(55731),x=r(64830),y=r(7365),f=r(21617),j=r(13689),$=r(70579);const w=i.Ay.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${e=>e.theme.colors.background.primary};
`,b=i.Ay.div`
  width: 350px;
  background: ${e=>e.theme.colors.background.secondary};
  border-right: 1px solid ${e=>e.theme.colors.border.light};
  overflow-y: auto;
`,v=i.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,k=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,S=i.Ay.div`
  flex: 1;
  overflow-y: auto;
  padding: ${e=>e.theme.spacing[6]};
`,A=i.Ay.div`
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
`,C=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]};
  margin-left: ${e=>e.theme.spacing[6]};
  margin-right: ${e=>e.theme.spacing[4]};
  margin-bottom: ${e=>e.theme.spacing[2]};
  background: ${e=>e.selected?f.w.colors.primary.yellow:f.w.colors.background.secondary};
  color: ${e=>e.selected?f.w.colors.primary.black:f.w.colors.text.primary};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.selected?f.w.colors.primary.yellow:"rgba(255, 230, 0, 0.1)"};
  }
`,z=(0,i.Ay)(j.Ex)`
  background: ${e=>e.theme.colors.accent.purple};
  color: white;
  margin-left: ${e=>e.theme.spacing[2]};
`,q=i.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,E=i.Ay.textarea`
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
`,R=i.Ay.div`
  background: ${e=>e.theme.colors.background.secondary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  overflow: hidden;
`,N=i.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`,F=i.Ay.pre`
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
`,P=i.Ay.div`
  margin-top: ${e=>e.theme.spacing[4]};
`,_=i.Ay.div`
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
`,D=(i.Ay.div`
  padding: ${e=>e.theme.spacing[2]} 0;
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`,i.Ay.span`
  color: ${e=>e.theme.colors.accent.blue};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
`,()=>{const{repoName:e}=(0,s.g)(),[n]=(0,o.ok)(),r=n.get("proto")||n.get("file"),[i,D]=(0,t.useState)(!0),[Y,H]=(0,t.useState)(null),[L,I]=(0,t.useState)([]),[J,U]=(0,t.useState)(null),[M,W]=(0,t.useState)(new Set),[V,Z]=(0,t.useState)([]),[G,K]=(0,t.useState)("localhost:50051"),[X,Q]=(0,t.useState)({authorization:"Bearer token"}),[ee,ne]=(0,t.useState)("{}"),[re,te]=(0,t.useState)(null),[se,oe]=(0,t.useState)(!1),[ie,ae]=(0,t.useState)(""),[ce,le]=(0,t.useState)(!1);(0,t.useEffect)(()=>{r?de():pe()},[e,r]);const de=async()=>{try{if(r){const n=await fetch((0,a.e9)(`/api/repository/${e}/file?path=${encodeURIComponent(r)}`));if(!n.ok){const e=await n.text();throw new Error(`Failed to load proto file: ${n.status} ${e}`)}const t=await n.text();ae(t);const s=me(t);I(s),s.length>0&&W(new Set([s[0].name]))}}catch(n){H(n instanceof Error?n.message:"Unknown error")}finally{D(!1)}},pe=async()=>{try{const n=await fetch((0,a.e9)(`/api/detect-apis/${e}`));if(!n.ok)throw new Error(`Failed to fetch API data: ${n.status}`);const r=await n.json();if(r.apis&&r.apis.grpc&&r.apis.grpc.length>0){Z(r.apis.grpc.map(e=>e.file));const e=r.apis.grpc[0].file;window.history.replaceState(null,"",`${window.location.pathname}?proto=${encodeURIComponent(e)}`),window.location.reload()}else H("No gRPC services found in this repository")}catch(n){H(n instanceof Error?n.message:"Failed to fetch available proto files")}finally{D(!1)}},me=e=>{const n=[],r=e.match(/package\s+([\w.]+);/),t=r?r[1]:void 0,s=/service\s+(\w+)\s*{([^}]*)}/g;let o;for(;null!==(o=s.exec(e));){const e=o[1],r=o[2],s=[],i=/rpc\s+(\w+)\s*\(\s*(stream\s+)?(\w+)\s*\)\s*returns\s*\(\s*(stream\s+)?(\w+)\s*\)/g;let a;for(;null!==(a=i.exec(r));)s.push({name:a[1],requestType:a[3],responseType:a[5],requestStream:!!a[2],responseStream:!!a[4]});n.push({name:e,methods:s,package:t})}return n},he=e=>({GetRequest:{id:"123"},ListRequest:{page:1,pageSize:10},CreateRequest:{name:"Example",description:"Sample data"},UpdateRequest:{id:"123",name:"Updated"},DeleteRequest:{id:"123"}}[e]||{field1:"value1",field2:123,field3:!0});return i?(0,$.jsx)(j.Hh,{text:"Loading gRPC definitions..."}):Y||0===L.length?(0,$.jsx)(j.mc,{maxWidth:"lg",children:(0,$.jsxs)(j.wn,{children:[(0,$.jsxs)(j.H1,{color:"secondary",children:[(0,$.jsx)(c.A,{size:32,style:{marginRight:f.w.spacing[2]}}),"No gRPC Services Found"]}),(0,$.jsx)(j.EY,{color:"secondary",children:Y||"No proto files found in this repository."}),(0,$.jsx)(j.$n,{as:o.N_,to:`/api-explorer/${e}`,children:"Back to API Explorer"})]})}):(0,$.jsxs)(w,{children:[(0,$.jsxs)(b,{children:[(0,$.jsxs)("div",{style:{padding:f.w.spacing[4]},children:[(0,$.jsxs)(j.$n,{as:o.N_,to:`/api-explorer/${e}`,variant:"outline",size:"sm",style:{marginBottom:f.w.spacing[4]},children:[(0,$.jsx)(l.A,{size:20}),"Back to Explorer"]}),(0,$.jsxs)(j.H2,{style:{marginBottom:f.w.spacing[4]},children:[(0,$.jsx)(u.A,{size:24,style:{marginRight:f.w.spacing[2]}}),"gRPC Services"]})]}),L.map(e=>(0,$.jsxs)("div",{children:[(0,$.jsx)(A,{onClick:()=>(e=>{const n=new Set(M);n.has(e)?n.delete(e):n.add(e),W(n)})(e.name),children:(0,$.jsxs)(j.so,{align:"center",justify:"between",children:[(0,$.jsxs)("div",{children:[(0,$.jsx)(j.EY,{weight:"semibold",children:e.name}),(0,$.jsxs)(j.EY,{size:"small",color:"secondary",children:[e.methods.length," methods"]})]}),M.has(e.name)?(0,$.jsx)(d.A,{size:20}):(0,$.jsx)(p.A,{size:20})]})}),M.has(e.name)&&(0,$.jsx)("div",{children:e.methods.map(n=>(0,$.jsxs)(C,{selected:(null===J||void 0===J?void 0:J.method.name)===n.name,onClick:()=>((e,n)=>{U({service:e,method:n});const r=he(n.requestType);ne(JSON.stringify(r,null,2))})(e,n),children:[(0,$.jsxs)(j.so,{align:"center",justify:"between",children:[(0,$.jsx)(j.EY,{weight:"medium",children:n.name}),(0,$.jsxs)("div",{children:[n.requestStream&&(0,$.jsx)(z,{size:"sm",children:"stream"}),n.responseStream&&(0,$.jsx)(z,{size:"sm",children:"stream"})]})]}),(0,$.jsxs)(j.EY,{size:"small",color:"secondary",children:[n.requestType," \u2192 ",n.responseType]})]},n.name))})]},e.name))]}),(0,$.jsxs)(v,{children:[(0,$.jsx)(k,{children:(0,$.jsxs)(j.so,{align:"center",justify:"between",children:[(0,$.jsxs)("div",{children:[(0,$.jsx)(j.H2,{style:{margin:0},children:J?J.method.name:"Select a method"}),J&&(0,$.jsxs)(j.EY,{color:"secondary",style:{marginTop:f.w.spacing[1]},children:[J.service.name," Service"]})]}),(0,$.jsxs)(j.$n,{variant:"outline",onClick:()=>le(!ce),children:[(0,$.jsx)(g.A,{size:20}),ce?"Hide":"View"," Proto"]})]})}),(0,$.jsxs)(S,{children:[J?(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(T,{children:[(0,$.jsx)(j.H3,{children:"Connection"}),(0,$.jsxs)(j.so,{gap:3,style:{marginBottom:f.w.spacing[4]},children:[(0,$.jsx)(j.pd,{type:"text",value:G,onChange:e=>K(e.target.value),placeholder:"localhost:50051",style:{flex:1}}),(0,$.jsxs)(j.$n,{variant:"outline",children:[(0,$.jsx)(y.A,{size:20}),"TLS Config"]})]}),(0,$.jsxs)(P,{children:[(0,$.jsx)(j.EY,{weight:"semibold",style:{marginBottom:f.w.spacing[2]},children:"Metadata"}),Object.entries(X).map((e,n)=>{let[r,t]=e;return(0,$.jsxs)(_,{children:[(0,$.jsx)(j.pd,{type:"text",value:r,placeholder:"Key",onChange:e=>{const n={...X};delete n[r],n[e.target.value]=t,Q(n)}}),(0,$.jsx)(j.pd,{type:"text",value:t,placeholder:"Value",onChange:e=>{Q({...X,[r]:e.target.value})}})]},n)}),(0,$.jsx)(j.$n,{size:"sm",variant:"outline",onClick:()=>Q({...X,"":""}),children:"Add Metadata"})]})]}),(0,$.jsxs)(q,{children:[(0,$.jsxs)(j.so,{align:"center",justify:"between",style:{marginBottom:f.w.spacing[2]},children:[(0,$.jsxs)(j.H3,{children:["Request (",J.method.requestType,")"]}),(0,$.jsxs)(j.so,{gap:2,children:[(0,$.jsx)(j.$n,{size:"sm",variant:"outline",onClick:()=>{const e=JSON.stringify(JSON.parse(ee),null,2);ne(e)},children:"Format"}),(0,$.jsx)(j.$n,{onClick:async()=>{if(!J)return;oe(!0);const e=Date.now();try{const n=JSON.parse(ee);await new Promise(e=>setTimeout(e,500));const r={success:!0,data:{message:`Response from ${J.method.name}`,timestamp:(new Date).toISOString(),request:n,metadata:{service:J.service.name,method:J.method.name,endpoint:G}},duration:Date.now()-e};te(r)}catch(n){te({error:n instanceof Error?n.message:"Request failed",code:"INTERNAL",details:"Failed to execute gRPC request"})}finally{oe(!1)}},disabled:se,children:se?"Executing...":(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(x.A,{size:20}),"Execute"]})})]})]}),(0,$.jsx)(E,{value:ee,onChange:e=>ne(e.target.value),placeholder:"Enter request JSON..."})]}),re&&(0,$.jsxs)(R,{children:[(0,$.jsxs)(N,{children:[(0,$.jsxs)(j.so,{align:"center",gap:3,children:[(0,$.jsx)(j.EY,{weight:"semibold",children:"Response"}),re.success?(0,$.jsx)(j.Ex,{variant:"success",children:"Success"}):(0,$.jsx)(j.Ex,{variant:"danger",children:"Error"}),re.duration&&(0,$.jsxs)(j.EY,{size:"small",color:"secondary",children:[re.duration,"ms"]})]}),(0,$.jsxs)(j.so,{gap:2,children:[(0,$.jsxs)(j.$n,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard.writeText(JSON.stringify(re,null,2))},children:[(0,$.jsx)(m.A,{size:16}),"Copy"]}),(0,$.jsxs)(j.$n,{size:"sm",variant:"outline",onClick:()=>{const e=new Blob([JSON.stringify(re,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),r=document.createElement("a");r.href=n,r.download=`${J.method.name}-response.json`,r.click()},children:[(0,$.jsx)(h.A,{size:16}),"Download"]})]})]}),(0,$.jsx)(F,{children:JSON.stringify(re.data||re.error,null,2)})]}),(0,$.jsxs)("div",{style:{marginTop:f.w.spacing[6]},children:[(0,$.jsx)(j.H3,{children:"Code Examples"}),(0,$.jsx)(j.so,{gap:2,style:{marginBottom:f.w.spacing[3]},children:["node","python","go"].map(e=>(0,$.jsxs)(j.$n,{size:"sm",variant:"outline",onClick:()=>{const n=(e=>{if(!J)return"";const{service:n,method:r}=J;switch(e){case"node":return`const grpc = require('@grpc/grpc-js');\nconst protoLoader = require('@grpc/proto-loader');\n\n// Load proto file\nconst packageDefinition = protoLoader.loadSync('path/to/your.proto');\nconst proto = grpc.loadPackageDefinition(packageDefinition);\n\n// Create client\nconst client = new proto.${n.package||"package"}.${n.name}(\n  '${G}',\n  grpc.credentials.createInsecure()\n);\n\n// Make request\nconst request = ${ee};\n\nclient.${r.name}(request, (error, response) => {\n  if (error) {\n    console.error('Error:', error);\n  } else {\n    console.log('Response:', response);\n  }\n});`;case"python":return`import grpc\nimport your_pb2\nimport your_pb2_grpc\n\n# Create channel and stub\nchannel = grpc.insecure_channel('${G}')\nstub = your_pb2_grpc.${n.name}Stub(channel)\n\n# Create request\nrequest = your_pb2.${r.requestType}(\n${ee.split("\n").map(e=>"    "+e).join("\n")}\n)\n\n# Make request\ntry:\n    response = stub.${r.name}(request)\n    print(f"Response: {response}")\nexcept grpc.RpcError as e:\n    print(f"Error: {e.code()}: {e.details()}")`;case"go":return`package main\n\nimport (\n    "context"\n    "log"\n    "google.golang.org/grpc"\n    pb "path/to/your/proto"\n)\n\nfunc main() {\n    // Create connection\n    conn, err := grpc.Dial("${G}", grpc.WithInsecure())\n    if err != nil {\n        log.Fatalf("Failed to connect: %v", err)\n    }\n    defer conn.Close()\n    \n    // Create client\n    client := pb.New${n.name}Client(conn)\n    \n    // Create request\n    request := &pb.${r.requestType}{\n        // Fill in request fields\n    }\n    \n    // Make request\n    response, err := client.${r.name}(context.Background(), request)\n    if err != nil {\n        log.Fatalf("Request failed: %v", err)\n    }\n    \n    log.Printf("Response: %v", response)\n}`;default:return""}})(e);navigator.clipboard.writeText(n)},children:[(0,$.jsx)(m.A,{size:16}),e.charAt(0).toUpperCase()+e.slice(1)]},e))})]})]}):(0,$.jsxs)("div",{style:{textAlign:"center",padding:f.w.spacing[16]},children:[(0,$.jsx)(u.A,{size:64,color:f.w.colors.text.secondary}),(0,$.jsx)(j.H2,{color:"secondary",style:{marginTop:f.w.spacing[4]},children:"Select a gRPC Method"}),(0,$.jsx)(j.EY,{color:"secondary",children:"Choose a service and method from the sidebar to start testing"})]}),ce&&ie&&(0,$.jsxs)(B,{children:[(0,$.jsx)(j.aR,{children:(0,$.jsx)(j.ZB,{children:"Proto Definition"})}),(0,$.jsx)(j.Wu,{children:(0,$.jsx)(O,{children:ie})})]})]})]})]})})}}]);
//# sourceMappingURL=484.c74de643.chunk.js.map