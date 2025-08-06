(()=>{"use strict";var e={20595:(e,t,r)=>{r.d(t,{BT:()=>l,Wu:()=>c,ZB:()=>s,Zp:()=>n,aR:()=>a,pV:()=>h,wL:()=>d});var o=r(5464);const i={default:o.AH`
    background-color: ${e=>e.theme.colors.background.primary};
    border: 1px solid ${e=>e.theme.colors.border.light};
  `,outlined:o.AH`
    background-color: transparent;
    border: 2px solid ${e=>e.theme.colors.border.medium};
  `,filled:o.AH`
    background-color: ${e=>e.theme.colors.background.secondary};
    border: 1px solid transparent;
  `},n=o.Ay.div.withConfig({shouldForwardProp:e=>!["elevated","hoverable","clickable","variant"].includes(e)})`
  padding: ${e=>e.theme.spacing[6]};
  border-radius: ${e=>e.theme.borderRadius.lg};
  transition: ${e=>e.theme.animations.transition.all};
  position: relative;
  
  ${e=>{let{variant:t="default"}=e;return i[t]}}
  
  ${e=>{let{elevated:t}=e;return t&&o.AH`
    box-shadow: ${e=>e.theme.shadows.card};
  `}}
  
  ${e=>{let{hoverable:t}=e;return t&&o.AH`
    &:hover {
      box-shadow: ${e=>e.theme.shadows.cardHover};
      transform: translateY(-2px);
    }
  `}}
  
  ${e=>{let{clickable:t}=e;return t&&o.AH`
    cursor: pointer;
    user-select: none;
    
    &:active {
      transform: scale(0.99);
    }
  `}}
`,a=o.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${e=>e.theme.spacing[4]};
  padding-bottom: ${e=>e.theme.spacing[4]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,s=o.Ay.h3`
  font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0;
`,l=o.Ay.p`
  font-size: ${e=>e.theme.typography.fontSize.base};
  color: ${e=>e.theme.colors.text.secondary};
  margin-bottom: ${e=>e.theme.spacing[4]};
  line-height: ${e=>e.theme.typography.lineHeight.relaxed};
`,c=o.Ay.div`
  color: ${e=>e.theme.colors.text.primary};
`,d=o.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${e=>e.theme.spacing[4]};
  padding-top: ${e=>e.theme.spacing[4]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  gap: ${e=>e.theme.spacing[3]};
`,h=o.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${e=>e.theme.layout.gridGap.medium};
  
  ${e=>{let{columns:t}=e;return t&&o.AH`
    grid-template-columns: repeat(${t}, 1fr);
    
    ${e=>e.theme.breakpoints.down.lg} {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  `}}
`},21617:(e,t,r)=>{r.d(t,{w:()=>o});const o={colors:{primary:{yellow:"#FFD700",black:"#000000",white:"#FFFFFF",main:"#FFD700"},secondary:{lightGray:"#F5F5F5",mediumGray:"#9E9E9E",darkGray:"#616161"},gray:{50:"#FAFAFA",100:"#F5F5F5",200:"#E0E0E6",300:"#C0C0C6",400:"#9E9E9E",500:"#747480",600:"#616161",700:"#424242",800:"#2E2E38",900:"#212121"},accent:{blue:"#0B6BA7",green:"#00A350",red:"#C4232B",orange:"#FF7900",purple:"#6B46C1"},semantic:{success:"#00A350",warning:"#FF7900",error:"#C4232B",info:"#0B6BA7"},background:{primary:"#FFFFFF",secondary:"#F5F5F5",tertiary:"#FAFAFA",dark:"#1A1A1A",overlay:"rgba(0, 0, 0, 0.5)"},text:{primary:"#212121",secondary:"#616161",tertiary:"#9E9E9E",inverse:"#FFFFFF",link:"#1976D2"},border:{light:"#E0E0E0",medium:"#BDBDBD",dark:"#616161"},status:{success:"#4CAF50",warning:"#FF9800",error:"#F44336",info:"#2196F3"},info:{light:"#E3F2FD",main:"#2196F3"}},typography:{fontFamily:{primary:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',mono:'Monaco, Consolas, "Courier New", monospace'},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem"},fontWeight:{light:300,normal:400,medium:500,semibold:600,bold:700,black:900},lineHeight:{tight:1.25,normal:1.5,relaxed:1.75},textStyles:{h1:{fontSize:"3rem",fontWeight:700,lineHeight:1.2,letterSpacing:"-0.02em"},h2:{fontSize:"2.25rem",fontWeight:700,lineHeight:1.25,letterSpacing:"-0.01em"},h3:{fontSize:"1.875rem",fontWeight:600,lineHeight:1.3,letterSpacing:"-0.01em"},h4:{fontSize:"1.5rem",fontWeight:600,lineHeight:1.35},h5:{fontSize:"1.25rem",fontWeight:600,lineHeight:1.4},h6:{fontSize:"1.125rem",fontWeight:600,lineHeight:1.4},bodyLarge:{fontSize:"1.125rem",fontWeight:400,lineHeight:1.75},body:{fontSize:"1rem",fontWeight:400,lineHeight:1.5},bodySmall:{fontSize:"0.875rem",fontWeight:400,lineHeight:1.5},button:{fontSize:"1rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.02em"},caption:{fontSize:"0.75rem",fontWeight:400,lineHeight:1.4},overline:{fontSize:"0.75rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.08em",textTransform:"uppercase"}}},spacing:{.5:"0.125rem",1:"0.25rem",2:"0.5rem",3:"0.75rem",4:"1rem",5:"1.25rem",6:"1.5rem",8:"2rem",10:"2.5rem",12:"3rem",16:"4rem",20:"5rem"},breakpoints:{values:{xs:0,sm:640,md:768,lg:1024,xl:1280,"2xl":1536},up:{sm:"@media (min-width: 640px)",md:"@media (min-width: 768px)",lg:"@media (min-width: 1024px)",xl:"@media (min-width: 1280px)","2xl":"@media (min-width: 1536px)"},down:{xs:"@media (max-width: 639px)",sm:"@media (max-width: 767px)",md:"@media (max-width: 1023px)",lg:"@media (max-width: 1279px)",xl:"@media (max-width: 1535px)"}},borderRadius:{none:"0",sm:"0.125rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem",full:"9999px"},shadows:{sm:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",md:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",lg:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",xl:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",focus:"0 0 0 3px rgba(255, 215, 0, 0.5)"},animations:{duration:{fast:"150ms",normal:"300ms",slow:"500ms"},easing:{linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.4, 0, 0.2, 1)",easeOut:"cubic-bezier(0, 0, 0.2, 1)"},transition:{colors:"color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out",transform:"transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",all:"all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}},zIndex:{dropdown:1e3,sticky:1020,fixed:1030,modalBackdrop:1040,modal:1050,popover:1060,tooltip:1070},components:{button:{height:{sm:"32px",md:"40px",lg:"48px"},padding:{sm:"0 12px",md:"0 16px",lg:"0 24px"},borderRadius:"8px"}},primaryDark:"#E6D100",backgroundHover:"#F5F5F5"}},34594:(e,t,r)=>{r.d(t,{A:()=>s});const o={gray:{50:"#FAFAFA",100:"#F5F5F5",200:"#E0E0E6",300:"#C0C0C6",400:"#9E9E9E",500:"#747480",600:"#616161",700:"#424242",800:"#2E2E38",900:"#212121"},primaryDark:"#E6D100",backgroundHover:"#F5F5F5",info:{light:"#E3F2FD",main:"#0B6BA7"},primary:{yellow:"#FFE600",black:"#2E2E38",white:"#FFFFFF",main:"#FFE600"},secondary:{darkGray:"#747480",mediumGray:"#C0C0C6",lightGray:"#F5F5F5",gray:"#C0C0C6"},accent:{blue:"#0B6BA7",green:"#00A350",red:"#C4232B",orange:"#FF7900",purple:"#6B46C1"},semantic:{success:"#00A350",warning:"#FF7900",error:"#C4232B",info:"#0B6BA7"},status:{success:"#00A350",warning:"#FF7900",error:"#C4232B",info:"#0B6BA7"},background:{primary:"#FFFFFF",secondary:"#F5F5F5",tertiary:"#FAFAFA",dark:"#2E2E38",overlay:"rgba(46, 46, 56, 0.8)"},text:{primary:"#2E2E38",secondary:"#747480",tertiary:"#C0C0C6",inverse:"#FFFFFF",link:"#0B6BA7"},border:{light:"#E0E0E6",medium:"#C0C0C6",dark:"#747480"},shadow:{light:"rgba(46, 46, 56, 0.08)",medium:"rgba(46, 46, 56, 0.12)",dark:"rgba(46, 46, 56, 0.24)"}},i={fontFamily:{primary:'"EYInterstate", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',secondary:'"Georgia", "Times New Roman", Times, serif',mono:'"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem","6xl":"3.75rem"},fontWeight:{light:300,normal:400,medium:500,semibold:600,bold:700,black:900},lineHeight:{tight:1.2,normal:1.5,relaxed:1.75,loose:2},letterSpacing:{tighter:"-0.02em",tight:"-0.01em",normal:"0",wide:"0.02em",wider:"0.04em",widest:"0.08em"},textStyles:{h1:{fontSize:"3rem",fontWeight:700,lineHeight:1.2,letterSpacing:"-0.02em"},h2:{fontSize:"2.25rem",fontWeight:700,lineHeight:1.25,letterSpacing:"-0.01em"},h3:{fontSize:"1.875rem",fontWeight:600,lineHeight:1.3,letterSpacing:"-0.01em"},h4:{fontSize:"1.5rem",fontWeight:600,lineHeight:1.35},h5:{fontSize:"1.25rem",fontWeight:600,lineHeight:1.4},h6:{fontSize:"1.125rem",fontWeight:600,lineHeight:1.4},bodyLarge:{fontSize:"1.125rem",fontWeight:400,lineHeight:1.75},body:{fontSize:"1rem",fontWeight:400,lineHeight:1.5},bodySmall:{fontSize:"0.875rem",fontWeight:400,lineHeight:1.5},button:{fontSize:"1rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.02em"},caption:{fontSize:"0.75rem",fontWeight:400,lineHeight:1.4},overline:{fontSize:"0.75rem",fontWeight:600,lineHeight:1.5,letterSpacing:"0.08em",textTransform:"uppercase"}}},n={px:"1px",0:"0",.5:"0.125rem",1:"0.25rem",1.5:"0.375rem",2:"0.5rem",2.5:"0.625rem",3:"0.75rem",3.5:"0.875rem",4:"1rem",5:"1.25rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",14:"3.5rem",16:"4rem",20:"5rem",24:"6rem",28:"7rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem"},a={values:{xs:0,sm:640,md:768,lg:1024,xl:1280,"2xl":1536},up:{xs:"@media (min-width: 0px)",sm:"@media (min-width: 640px)",md:"@media (min-width: 768px)",lg:"@media (min-width: 1024px)",xl:"@media (min-width: 1280px)","2xl":"@media (min-width: 1536px)"},down:{xs:"@media (max-width: 639px)",sm:"@media (max-width: 767px)",md:"@media (max-width: 1023px)",lg:"@media (max-width: 1279px)",xl:"@media (max-width: 1535px)","2xl":"@media (max-width: 9999px)"}},s={colors:o,typography:i,spacing:n,layout:{containerPadding:{mobile:n[4],tablet:n[6],desktop:n[8]},sectionSpacing:{small:n[8],medium:n[16],large:n[24]},componentSpacing:{xs:n[2],sm:n[3],md:n[4],lg:n[6],xl:n[8]},gridGap:{small:n[4],medium:n[6],large:n[8]}},shadows:{none:"none",sm:"0 1px 3px 0 rgba(46, 46, 56, 0.1), 0 1px 2px 0 rgba(46, 46, 56, 0.06)",md:"0 4px 6px -1px rgba(46, 46, 56, 0.1), 0 2px 4px -1px rgba(46, 46, 56, 0.06)",lg:"0 10px 15px -3px rgba(46, 46, 56, 0.1), 0 4px 6px -2px rgba(46, 46, 56, 0.05)",xl:"0 20px 25px -5px rgba(46, 46, 56, 0.1), 0 10px 10px -5px rgba(46, 46, 56, 0.04)","2xl":"0 25px 50px -12px rgba(46, 46, 56, 0.25)",card:"0 2px 8px rgba(46, 46, 56, 0.08)",cardHover:"0 8px 16px rgba(46, 46, 56, 0.12)",dropdown:"0 10px 20px rgba(46, 46, 56, 0.15)",modal:"0 20px 40px rgba(46, 46, 56, 0.2)",inner:"inset 0 2px 4px 0 rgba(46, 46, 56, 0.06)",focus:"0 0 0 3px rgba(255, 230, 0, 0.5)",focusError:"0 0 0 3px rgba(196, 35, 43, 0.5)",focusSuccess:"0 0 0 3px rgba(0, 163, 80, 0.5)"},breakpoints:a,containers:{sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px",full:"100%"},animations:{duration:{fast:"150ms",normal:"250ms",slow:"350ms",slower:"500ms"},easing:{linear:"linear",easeIn:"cubic-bezier(0.4, 0, 1, 1)",easeOut:"cubic-bezier(0, 0, 0.2, 1)",easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",bounce:"cubic-bezier(0.68, -0.55, 0.265, 1.55)",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.4, 0, 0.2, 1)"},transition:{all:"all 250ms cubic-bezier(0.4, 0, 0.2, 1)",colors:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1), fill 250ms cubic-bezier(0.4, 0, 0.2, 1), stroke 250ms cubic-bezier(0.4, 0, 0.2, 1)",opacity:"opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)",shadow:"box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)",transform:"transform 250ms cubic-bezier(0.4, 0, 0.2, 1)"},keyframes:{fadeIn:{from:{opacity:0},to:{opacity:1}},fadeOut:{from:{opacity:1},to:{opacity:0}},slideIn:{from:{transform:"translateY(100%)"},to:{transform:"translateY(0)"}},slideOut:{from:{transform:"translateY(0)"},to:{transform:"translateY(100%)"}},scaleIn:{from:{transform:"scale(0.95)",opacity:0},to:{transform:"scale(1)",opacity:1}},spin:{from:{transform:"rotate(0deg)"},to:{transform:"rotate(360deg)"}},pulse:{"0%, 100%":{opacity:1},"50%":{opacity:.5}},bounce:{"0%, 100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-25%)"}}},animate:{fadeIn:"fadeIn 250ms cubic-bezier(0, 0, 0.2, 1)",fadeOut:"fadeOut 250ms cubic-bezier(0.4, 0, 1, 1)",slideIn:"slideIn 250ms cubic-bezier(0, 0, 0.2, 1)",slideOut:"slideOut 250ms cubic-bezier(0.4, 0, 1, 1)",scaleIn:"scaleIn 250ms cubic-bezier(0, 0, 0.2, 1)",spin:"spin 1s linear infinite",pulse:"pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",bounce:"bounce 1s cubic-bezier(0.4, 0, 0.2, 1) infinite"}},components:{button:{height:{sm:"32px",md:"40px",lg:"48px"},padding:{sm:`${n[2]} ${n[3]}`,md:`${n[2.5]} ${n[4]}`,lg:`${n[3]} ${n[5]}`},borderRadius:"4px"},card:{borderRadius:"8px",padding:n[6],background:o.background.primary,border:`1px solid ${o.border.light}`},input:{height:"40px",padding:`${n[2]} ${n[3]}`,borderRadius:"4px",border:`1px solid ${o.border.medium}`,focusBorder:o.primary.yellow},modal:{overlay:o.background.overlay,borderRadius:"12px",padding:n[8],maxWidth:"600px"}},zIndex:{dropdown:1e3,sticky:1020,fixed:1030,modalBackdrop:1040,modal:1050,popover:1060,tooltip:1070},borderRadius:{none:"0",sm:"2px",md:"4px",lg:"8px",xl:"12px","2xl":"16px","3xl":"24px",full:"9999px"}}},40230:(e,t,r)=>{r.d(t,{EY:()=>c,H1:()=>a,H2:()=>s,H3:()=>l,hj:()=>d});var o=r(5464),i=r(21617);const n=o.AH`
  color: ${e=>{let{color:t="primary"}=e;return i.w.colors.text[t]}};
  text-align: ${e=>{let{align:t="left"}=e;return t}};
  margin: 0;
`,a=o.Ay.h1`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.h1.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h1.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h1.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.h1.letterSpacing};
  margin-bottom: ${e=>e.theme.spacing[6]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize["4xl"]};
  }
`,s=o.Ay.h2`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.h2.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h2.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h2.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.h2.letterSpacing};
  margin-bottom: ${e=>e.theme.spacing[5]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize["3xl"]};
  }
`,l=o.Ay.h3`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.h3.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h3.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h3.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.h3.letterSpacing};
  margin-bottom: ${e=>e.theme.spacing[4]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  }
`,c=(o.Ay.h4`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.h4.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h4.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h4.lineHeight};
  margin-bottom: ${e=>e.theme.spacing[3]};
`,o.Ay.h5`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.h5.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h5.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h5.lineHeight};
  margin-bottom: ${e=>e.theme.spacing[3]};
`,o.Ay.h6`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.h6.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.h6.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.h6.lineHeight};
  margin-bottom: ${e=>e.theme.spacing[3]};
`,o.Ay.p`
  ${n}
  font-size: ${e=>{let{size:t="base"}=e;return"small"===t?i.w.typography.textStyles.bodySmall.fontSize:"large"===t?i.w.typography.textStyles.bodyLarge.fontSize:i.w.typography.textStyles.body.fontSize}};
  font-weight: ${e=>{let{weight:t="normal"}=e;return i.w.typography.fontWeight[t]}};
  line-height: ${e=>{let{size:t="base"}=e;return"small"===t?i.w.typography.textStyles.bodySmall.lineHeight:"large"===t?i.w.typography.textStyles.bodyLarge.lineHeight:i.w.typography.textStyles.body.lineHeight}};
  margin-bottom: ${e=>e.theme.spacing[4]};
`),d=(o.Ay.span`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.caption.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.caption.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.caption.lineHeight};
`,o.Ay.span`
  ${n}
  font-size: ${e=>e.theme.typography.textStyles.overline.fontSize};
  font-weight: ${e=>e.theme.typography.textStyles.overline.fontWeight};
  line-height: ${e=>e.theme.typography.textStyles.overline.lineHeight};
  letter-spacing: ${e=>e.theme.typography.textStyles.overline.letterSpacing};
  text-transform: uppercase;
`,o.Ay.p`
  ${n}
  font-size: ${e=>e.theme.typography.fontSize.xl};
  line-height: ${e=>e.theme.typography.lineHeight.relaxed};
  font-weight: ${e=>e.theme.typography.fontWeight.light};
  margin-bottom: ${e=>e.theme.spacing[6]};
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize.lg};
  }
`);o.Ay.mark`
  background-color: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
  border-radius: ${e=>e.theme.borderRadius.sm};
`,o.Ay.code`
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  background-color: ${e=>e.theme.colors.background.secondary};
  color: ${e=>e.theme.colors.text.primary};
  padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
  border-radius: ${e=>e.theme.borderRadius.sm};
`,o.Ay.blockquote`
  margin: ${e=>e.theme.spacing[6]} 0;
  padding-left: ${e=>e.theme.spacing[6]};
  border-left: 4px solid ${e=>e.theme.colors.primary.yellow};
  font-style: italic;
  color: ${e=>e.theme.colors.text.secondary};
  
  p {
    margin-bottom: ${e=>e.theme.spacing[3]};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`},50122:(e,t,r)=>{r.d(t,{gG:()=>o});let o=function(e){return e.ADMIN="admin",e.DEVELOPER="developer",e.VIEWER="viewer",e}({});const i={clientId:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001"}.REACT_APP_EY_SSO_CLIENT_ID||"",authorizationURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001"}.REACT_APP_EY_SSO_AUTH_URL||"https://login.ey.com/oauth2/authorize",tokenURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001"}.REACT_APP_EY_SSO_TOKEN_URL||"https://login.ey.com/oauth2/token",userInfoURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001"}.REACT_APP_EY_SSO_USERINFO_URL||"https://login.ey.com/oauth2/userinfo",callbackURL:{NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001"}.REACT_APP_EY_SSO_CALLBACK_URL||"http://localhost:3000/auth/callback",scope:["openid","profile","email"]};new class{constructor(){this.TOKEN_KEY="eyns_auth_token",this.REFRESH_TOKEN_KEY="eyns_refresh_token",this.USER_KEY="eyns_user"}storeTokens(e){localStorage.setItem(this.TOKEN_KEY,e.accessToken),localStorage.setItem(this.REFRESH_TOKEN_KEY,e.refreshToken);const t=new Date;t.setSeconds(t.getSeconds()+e.expiresIn),localStorage.setItem("eyns_token_expires",t.toISOString())}getAccessToken(){return localStorage.getItem(this.TOKEN_KEY)}getRefreshToken(){return localStorage.getItem(this.REFRESH_TOKEN_KEY)}isTokenExpired(){const e=localStorage.getItem("eyns_token_expires");return!e||new Date>new Date(e)}clearAuth(){localStorage.removeItem(this.TOKEN_KEY),localStorage.removeItem(this.REFRESH_TOKEN_KEY),localStorage.removeItem(this.USER_KEY),localStorage.removeItem("eyns_token_expires")}storeUser(e){localStorage.setItem(this.USER_KEY,JSON.stringify(e))}getUser(){const e=localStorage.getItem(this.USER_KEY);if(!e)return null;try{return JSON.parse(e)}catch{return null}}parseToken(e){try{const t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),r=decodeURIComponent(atob(t).split("").map(e=>"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(r)}catch(t){return null}}getAuthorizationUrl(e){const t=new URLSearchParams({client_id:i.clientId,redirect_uri:i.callbackURL,response_type:"code",scope:i.scope.join(" "),state:e});return`${i.authorizationURL}?${t.toString()}`}async exchangeCodeForTokens(e){const t=await fetch("/api/auth/callback",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e})});if(!t.ok)throw new Error("Failed to exchange code for tokens");return await t.json()}async refreshAccessToken(){const e=this.getRefreshToken();if(!e)throw new Error("No refresh token available");const t=await fetch("/api/auth/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:e})});if(!t.ok)throw new Error("Failed to refresh access token");const r=await t.json();return this.storeTokens(r),r}async login(e,t){const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})});if(!r.ok)throw new Error("Login failed");const o=await r.json();return this.storeTokens(o.tokens),this.storeUser(o.user),o}async logout(){const e=this.getAccessToken();if(e)try{await fetch("/api/auth/logout",{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch(t){}this.clearAuth()}async getCurrentUser(){const e=this.getAccessToken();if(!e||this.isTokenExpired())return null;try{const t=await fetch("/api/auth/me",{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return null;const r=await t.json();return this.storeUser(r),r}catch(t){return null}}async generateApiKey(e,t){const r=this.getAccessToken();if(!r)throw new Error("Not authenticated");const o=await fetch("/api/auth/api-keys",{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:JSON.stringify({name:e,permissions:t})});if(!o.ok)throw new Error("Failed to generate API key");return o.json()}async listApiKeys(){const e=this.getAccessToken();if(!e)throw new Error("Not authenticated");const t=await fetch("/api/auth/api-keys",{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw new Error("Failed to list API keys");return t.json()}async revokeApiKey(e){const t=this.getAccessToken();if(!t)throw new Error("Not authenticated");if(!(await fetch(`/api/auth/api-keys/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).ok)throw new Error("Failed to revoke API key")}hasPermission(e){const t=this.getUser();if(!t)return!1;const r={[o.ADMIN]:["*"],[o.DEVELOPER]:["read:apis","read:documentation","create:api_keys","manage:own_api_keys","test:apis","download:collections"],[o.VIEWER]:["read:apis","read:documentation"]}[t.role]||[];return r.includes("*")||r.includes(e)}async verifyAccessToken(e){try{return(await fetch("/api/auth/verify",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}})).ok}catch(t){return!1}}generateTokens(e){return{accessToken:btoa(JSON.stringify({userId:e.id,email:e.email,role:e.role,iat:Date.now(),exp:Date.now()+36e5})),refreshToken:btoa(JSON.stringify({userId:e.id,type:"refresh",iat:Date.now(),exp:Date.now()+6048e5})),expiresIn:3600}}getAuthHeader(){const e=this.getAccessToken();return e?{Authorization:`Bearer ${e}`}:{}}async demoLogin(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o.DEVELOPER;const t={[o.ADMIN]:{email:"admin@ey.com",password:"admin123"},[o.DEVELOPER]:{email:"developer@ey.com",password:"dev123"},[o.VIEWER]:{email:"viewer@ey.com",password:"view123"}}[e];return this.login(t.email,t.password)}}},50577:(e,t,r)=>{r.d(t,{Ex:()=>g,$n:()=>o.$,Zp:()=>i.Zp,Wu:()=>i.Wu,BT:()=>i.BT,wL:()=>i.wL,pV:()=>i.pV,aR:()=>i.aR,ZB:()=>i.ZB,mc:()=>s,so:()=>d,Hh:()=>m.Hh,xA:()=>c,H1:()=>h.H1,H2:()=>h.H2,H3:()=>h.H3,pd:()=>u,hj:()=>h.hj,wn:()=>l,EY:()=>h.EY});var o=r(75969),i=r(20595),n=r(5464),a=r(34594);const s=n.Ay.div.withConfig({shouldForwardProp:e=>!["maxWidth","fluid","centered","padding"].includes(e)})`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  
  ${e=>{let{maxWidth:t="xl"}=e;return n.AH`
    max-width: ${e=>e.theme.containers[t]};
  `}}
  
  ${e=>{let{fluid:t}=e;return t&&n.AH`
    max-width: 100%;
  `}}
  
  ${e=>{let{centered:t=!0}=e;return t&&n.AH`
    margin-left: auto;
    margin-right: auto;
  `}}
  
  ${e=>{let{padding:t="desktop"}=e;return n.AH`
    padding-left: ${e=>e.theme.layout.containerPadding[t]};
    padding-right: ${e=>e.theme.layout.containerPadding[t]};
    
    ${e=>e.theme.breakpoints.down.md} {
      padding-left: ${e=>e.theme.layout.containerPadding.mobile};
      padding-right: ${e=>e.theme.layout.containerPadding.mobile};
    }
    
    @media (min-width: 768px) and (max-width: 1023px) {
      padding-left: ${e=>e.theme.layout.containerPadding.tablet};
      padding-right: ${e=>e.theme.layout.containerPadding.tablet};
    }
  `}}
`,l=n.Ay.section.withConfig({shouldForwardProp:e=>"spacing"!==e})`
  padding-top: ${e=>{let{spacing:t="medium"}=e;return a.A.layout.sectionSpacing[t]}};
  padding-bottom: ${e=>{let{spacing:t="medium"}=e;return a.A.layout.sectionSpacing[t]}};
  
  ${e=>e.theme.breakpoints.down.md} {
    padding-top: ${e=>{let{spacing:t="medium"}=e;return"large"===t?a.A.layout.sectionSpacing.medium:a.A.layout.sectionSpacing.small}};
    padding-bottom: ${e=>{let{spacing:t="medium"}=e;return"large"===t?a.A.layout.sectionSpacing.medium:a.A.layout.sectionSpacing.small}};
  }
`,c=n.Ay.div`
  display: grid;
  gap: ${e=>{let{gap:t="medium"}=e;return a.A.layout.gridGap[t]}};
  
  ${e=>{let{columns:t=12}=e;return n.AH`
    grid-template-columns: repeat(${t}, 1fr);
    
    ${e=>e.theme.breakpoints.down.lg} {
      grid-template-columns: repeat(${Math.min(t,8)}, 1fr);
    }
    
    ${e=>e.theme.breakpoints.down.md} {
      grid-template-columns: repeat(${Math.min(t,4)}, 1fr);
    }
    
    ${e=>e.theme.breakpoints.down.sm} {
      grid-template-columns: 1fr;
    }
  `}}
`,d=n.Ay.div.withConfig({shouldForwardProp:e=>!["direction","align","justify","wrap","gap"].includes(e)})`
  display: flex;
  
  ${e=>{let{direction:t="row"}=e;return n.AH`
    flex-direction: ${t};
  `}}
  
  ${e=>{let{align:t="stretch"}=e;return n.AH`
    align-items: ${"start"===t?"flex-start":"end"===t?"flex-end":t};
  `}}
  
  ${e=>{let{justify:t="start"}=e;return n.AH`
    justify-content: ${"start"===t?"flex-start":"end"===t?"flex-end":"between"===t?"space-between":"around"===t?"space-around":"evenly"===t?"space-evenly":t};
  `}}
  
  ${e=>{let{wrap:t}=e;return t&&n.AH`
    flex-wrap: wrap;
  `}}
  
  ${e=>{let{gap:t}=e;return t&&n.AH`
    gap: ${e=>e.theme.spacing[t]};
  `}}
`;var h=r(40230),m=r(78229),p=r(21617);const g=n.Ay.span`
  display: inline-flex;
  align-items: center;
  padding: ${e=>{switch(e.size){case"sm":return`${p.w.spacing[1]} ${p.w.spacing[2]}`;case"lg":return`${p.w.spacing[2]} ${p.w.spacing[4]}`;default:return`${p.w.spacing[1]} ${p.w.spacing[3]}`}}};
  font-size: ${e=>{switch(e.size){case"sm":return p.w.typography.fontSize.xs;case"lg":return p.w.typography.fontSize.base;default:return p.w.typography.fontSize.sm}}};
  font-weight: ${p.w.typography.fontWeight.medium};
  border-radius: ${p.w.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background-color: ${e=>{switch(e.variant){case"primary":return p.w.colors.primary.yellow;case"secondary":return p.w.colors.secondary.darkGray;case"success":return p.w.colors.semantic.success;case"warning":return p.w.colors.semantic.warning;case"danger":return p.w.colors.semantic.error;case"info":return p.w.colors.semantic.info;default:return p.w.colors.background.tertiary}}};
  
  color: ${e=>{switch(e.variant){case"primary":return p.w.colors.primary.black;case"secondary":case"success":case"warning":case"danger":case"info":return p.w.colors.primary.white;default:return p.w.colors.text.primary}}};
`,u=n.Ay.input`
  width: 100%;
  padding: ${e=>{switch(e.size){case"sm":return`${e.theme.spacing[2]} ${e.theme.spacing[3]}`;case"lg":return`${e.theme.spacing[4]} ${e.theme.spacing[5]}`;default:return`${e.theme.spacing[3]} ${e.theme.spacing[4]}`}}};
  font-size: ${e=>{switch(e.size){case"sm":return e.theme.typography.fontSize.sm;case"lg":return e.theme.typography.fontSize.lg;default:return e.theme.typography.fontSize.base}}};
  line-height: ${e=>e.theme.typography.lineHeight.normal};
  color: ${e=>e.theme.colors.text.primary};
  background-color: ${e=>"filled"===e.variant?p.w.colors.background.secondary:p.w.colors.primary.white};
  border: 2px solid ${e=>e.error?p.w.colors.semantic.error:"outlined"===e.variant?p.w.colors.border.medium:"transparent"};
  border-radius: ${e=>e.theme.borderRadius.md};
  outline: none;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${e=>e.theme.colors.text.secondary};
  }
  
  &:hover {
    border-color: ${e=>e.error?p.w.colors.semantic.error:p.w.colors.border.dark};
  }
  
  &:focus {
    border-color: ${e=>e.error?p.w.colors.semantic.error:p.w.colors.primary.yellow};
    box-shadow: 0 0 0 3px ${e=>e.error?"rgba(196, 35, 43, 0.12)":"rgba(255, 230, 0, 0.12)"};
  }
  
  &:disabled {
    background-color: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`;n.Ay.textarea`
  width: 100%;
  padding: ${e=>{switch(e.size){case"sm":return`${e.theme.spacing[2]} ${e.theme.spacing[3]}`;case"lg":return`${e.theme.spacing[4]} ${e.theme.spacing[5]}`;default:return`${e.theme.spacing[3]} ${e.theme.spacing[4]}`}}};
  font-size: ${e=>{switch(e.size){case"sm":return e.theme.typography.fontSize.sm;case"lg":return e.theme.typography.fontSize.lg;default:return e.theme.typography.fontSize.base}}};
  line-height: ${e=>e.theme.typography.lineHeight.relaxed};
  color: ${e=>e.theme.colors.text.primary};
  background-color: ${e=>"filled"===e.variant?p.w.colors.background.secondary:p.w.colors.primary.white};
  border: 2px solid ${e=>e.error?p.w.colors.semantic.error:"outlined"===e.variant?p.w.colors.border.medium:"transparent"};
  border-radius: ${e=>e.theme.borderRadius.md};
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${e=>e.theme.colors.text.secondary};
  }
  
  &:hover {
    border-color: ${e=>e.error?p.w.colors.semantic.error:p.w.colors.border.dark};
  }
  
  &:focus {
    border-color: ${e=>e.error?p.w.colors.semantic.error:p.w.colors.primary.yellow};
    box-shadow: 0 0 0 3px ${e=>e.error?"rgba(196, 35, 43, 0.12)":"rgba(255, 230, 0, 0.12)"};
  }
  
  &:disabled {
    background-color: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`},58846:(e,t,r)=>{var o=r(65043),i=r(84391),n=r(35475),a=r(73216),s=r(5464),l=r(34594);const c=s.DU`
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${e=>e.theme.typography.fontFamily.primary};
    font-size: ${e=>e.theme.typography.fontSize.base};
    line-height: ${e=>e.theme.typography.lineHeight.normal};
    color: ${e=>e.theme.colors.text.primary};
    background-color: ${e=>e.theme.colors.background.primary};
    min-height: 100vh;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${e=>e.theme.spacing[4]};
    font-weight: ${e=>e.theme.typography.fontWeight.bold};
    line-height: ${e=>e.theme.typography.lineHeight.tight};
    color: ${e=>e.theme.colors.text.primary};
  }

  h1 {
    font-size: ${e=>e.theme.typography.fontSize["5xl"]};
    ${e=>e.theme.breakpoints.down.md} {
      font-size: ${e=>e.theme.typography.fontSize["4xl"]};
    }
  }

  h2 {
    font-size: ${e=>e.theme.typography.fontSize["4xl"]};
    ${e=>e.theme.breakpoints.down.md} {
      font-size: ${e=>e.theme.typography.fontSize["3xl"]};
    }
  }

  h3 {
    font-size: ${e=>e.theme.typography.fontSize["3xl"]};
    ${e=>e.theme.breakpoints.down.md} {
      font-size: ${e=>e.theme.typography.fontSize["2xl"]};
    }
  }

  h4 {
    font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  }

  h5 {
    font-size: ${e=>e.theme.typography.fontSize.xl};
  }

  h6 {
    font-size: ${e=>e.theme.typography.fontSize.lg};
  }

  p {
    margin-bottom: ${e=>e.theme.spacing[4]};
    line-height: ${e=>e.theme.typography.lineHeight.relaxed};
  }

  /* Links */
  a {
    color: ${e=>e.theme.colors.text.link};
    text-decoration: none;
    transition: ${e=>e.theme.animations.transition.colors};

    &:hover {
      text-decoration: underline;
    }

    &:focus {
      outline: none;
      box-shadow: ${e=>e.theme.shadows.focus};
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${e=>e.theme.spacing[4]};
    padding-left: ${e=>e.theme.spacing[6]};
  }

  li {
    margin-bottom: ${e=>e.theme.spacing[2]};
  }

  /* Code */
  code {
    font-family: ${e=>e.theme.typography.fontFamily.mono};
    font-size: ${e=>e.theme.typography.fontSize.sm};
    background-color: ${e=>e.theme.colors.background.secondary};
    padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
    border-radius: ${e=>e.theme.borderRadius.sm};
  }

  pre {
    font-family: ${e=>e.theme.typography.fontFamily.mono};
    font-size: ${e=>e.theme.typography.fontSize.sm};
    background-color: ${e=>e.theme.colors.background.secondary};
    padding: ${e=>e.theme.spacing[4]};
    border-radius: ${e=>e.theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${e=>e.theme.spacing[4]};
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${e=>e.theme.spacing[4]};
  }

  th, td {
    padding: ${e=>e.theme.spacing[3]};
    text-align: left;
    border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  }

  th {
    font-weight: ${e=>e.theme.typography.fontWeight.semibold};
    background-color: ${e=>e.theme.colors.background.secondary};
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${e=>e.theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${e=>e.theme.colors.secondary.mediumGray};
    border-radius: ${e=>e.theme.borderRadius.full};
    
    &:hover {
      background: ${e=>e.theme.colors.secondary.darkGray};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
  }

  /* Focus Visible */
  :focus-visible {
    outline: 2px solid ${e=>e.theme.colors.primary.yellow};
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Loading State */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid ${e=>e.theme.colors.border.light};
    border-top-color: ${e=>e.theme.colors.primary.yellow};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;var d=r(51403),h=r(50516),m=r(39292),p=r(14459),g=r(77737),u=r(9493),y=r(50577),x=r(40614),f=r(85367),b=r(41680),$=r(72105),w=r(38298),v=r(29350),k=r(75088);const S=new class{constructor(){this.searchIndex=new Map,this.repositoryMetadata=new Map}async buildSearchIndex(e){this.searchIndex.clear(),this.repositoryMetadata.clear();for(const t of e)this.repositoryMetadata.set(t.name,t),await this.indexRepository(t)}async search(e){try{const t=await fetch("http://localhost:3001/api/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error("Search API error");return await t.json()}catch(t){return this.localSearch(e)}}async localSearch(e){const t=Date.now(),{query:r,scope:o="all",filters:i={},limit:n=20,offset:a=0,sortBy:s="relevance"}=e,l=this.tokenize(r.toLowerCase()),c=[],d=this.initializeFacets();for(const[g,u]of this.searchIndex){if("all"!==o&&!this.matchesScope(u,o))continue;if(!this.matchesFilters(u,i))continue;const e=this.calculateScore(l,u);if(e>0){const t=this.createSearchResult(g,u,l,e);c.push(t),this.updateFacets(d,u)}}const h=this.sortResults(c,s,e.sortOrder),m=h.slice(a,a+n),p=this.generateSuggestions(r,c);return{query:r,results:m,totalCount:h.length,facets:this.finalizeFacets(d),suggestions:p,executionTime:Date.now()-t}}async searchInRepository(e,t){const r={query:t,filters:{repositories:[e]}};return(await this.search(r)).results}async getSuggestions(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5;try{const t=await fetch(`http://localhost:3001/api/search/suggestions?q=${encodeURIComponent(e)}`);if(!t.ok)throw new Error("Suggestions API error");return await t.json()}catch(r){const o=this.tokenize(e.toLowerCase()),i=new Set;for(const[e,n]of this.searchIndex)for(const r of n.tokens)if(r.startsWith(o[0])&&r!==o[0]&&(i.add(r),i.size>=t))return Array.from(i);return Array.from(i)}}getPopularTerms(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;const t=new Map;for(const[r,o]of this.searchIndex)for(const e of o.tokens)t.set(e,(t.get(e)||0)+1);return Array.from(t.entries()).sort((e,t)=>t[1]-e[1]).slice(0,e).map(e=>{let[t]=e;return t})}async indexRepository(e){const t=`repo:${e.name}`;this.searchIndex.set(t,{type:"repository",repository:e.name,title:e.name,content:`${e.name} ${e.description} ${e.topics.join(" ")}`,tokens:this.tokenize(`${e.name} ${e.description} ${e.topics.join(" ")}`),metadata:{language:e.language,topics:e.topics,hasApiDocs:e.hasApiDocs,lastUpdated:e.lastUpdated}})}tokenize(e){return e.toLowerCase().replace(/[^a-z0-9\s-_]/g," ").split(/\s+/).filter(e=>e.length>2)}calculateScore(e,t){var r;let o=0;const i=new Set(t.tokens);for(const n of e){i.has(n)&&(o+=10);for(const e of i)e.startsWith(n)&&(o+=5),this.levenshteinDistance(n,e)<=2&&(o+=2)}if("repository"===t.type&&(o*=1.5),"api"===t.type&&(o*=1.3),null!==(r=t.metadata)&&void 0!==r&&r.lastUpdated){(Date.now()-new Date(t.metadata.lastUpdated).getTime())/864e5<30&&(o*=1.2)}return o}levenshteinDistance(e,t){const r=[];for(let o=0;o<=t.length;o++)r[o]=[o];for(let o=0;o<=e.length;o++)r[0][o]=o;for(let o=1;o<=t.length;o++)for(let i=1;i<=e.length;i++)t.charAt(o-1)===e.charAt(i-1)?r[o][i]=r[o-1][i-1]:r[o][i]=Math.min(r[o-1][i-1]+1,r[o][i-1]+1,r[o-1][i]+1);return r[t.length][e.length]}matchesScope(e,t){var r,o;switch(t){case"repositories":return"repository"===e.type;case"documentation":return"file"===e.type&&null!==(r=null===(o=e.path)||void 0===o?void 0:o.endsWith(".md"))&&void 0!==r&&r;case"apis":return"api"===e.type;default:return!0}}matchesFilters(e,t){var r,o,i,n,a,s,l;if(null!==(r=t.repositories)&&void 0!==r&&r.length&&!t.repositories.includes(e.repository))return!1;if(null!==(o=t.languages)&&void 0!==o&&o.length&&null!==(i=e.metadata)&&void 0!==i&&i.language&&!t.languages.includes(e.metadata.language))return!1;if(null!==(n=t.apiTypes)&&void 0!==n&&n.length&&"api"===e.type&&null!==(a=e.metadata)&&void 0!==a&&a.apiType&&!t.apiTypes.includes(e.metadata.apiType))return!1;if(void 0!==t.hasApiDocs&&(null===(s=e.metadata)||void 0===s?void 0:s.hasApiDocs)!==t.hasApiDocs)return!1;if(null!==(l=t.topics)&&void 0!==l&&l.length){var c;const r=(null===(c=e.metadata)||void 0===c?void 0:c.topics)||[];if(!t.topics.some(e=>r.includes(e)))return!1}return!0}createSearchResult(e,t,r,o){var i;const n=this.generateHighlights(t,r);return{id:e,type:t.type,title:t.title,description:null===(i=t.metadata)||void 0===i?void 0:i.description,repository:t.repository,path:t.path,score:o,highlights:n,metadata:t.metadata}}generateHighlights(e,t){const r=[],o=e.content.toLowerCase();for(const i of t){const t=o.indexOf(i);if(-1!==t){const n=Math.max(0,t-30),a=Math.min(o.length,t+i.length+30),s="..."+e.content.slice(n,a)+"...";r.push({field:"content",snippet:s,matchedTokens:[i]})}}return r}sortResults(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"desc";const o=[...e];switch(t){case"relevance":o.sort((e,t)=>t.score-e.score);break;case"name":o.sort((e,t)=>e.title.localeCompare(t.title));break;case"updated":o.sort((e,t)=>{var r,o;const i=new Date((null===(r=e.metadata)||void 0===r?void 0:r.lastUpdated)||0).getTime();return new Date((null===(o=t.metadata)||void 0===o?void 0:o.lastUpdated)||0).getTime()-i});break;case"type":o.sort((e,t)=>e.type.localeCompare(t.type))}return"asc"===r&&"relevance"!==t&&o.reverse(),o}initializeFacets(){return{repositories:[],languages:[],apiTypes:[],fileTypes:[],topics:[]}}updateFacets(e,t){var r,o,i;if(this.updateFacetValue(e.repositories,t.repository),null!==(r=t.metadata)&&void 0!==r&&r.language&&this.updateFacetValue(e.languages,t.metadata.language),"api"===t.type&&null!==(o=t.metadata)&&void 0!==o&&o.apiType&&this.updateFacetValue(e.apiTypes,t.metadata.apiType),null!==(i=t.metadata)&&void 0!==i&&i.topics)for(const n of t.metadata.topics)this.updateFacetValue(e.topics,n)}updateFacetValue(e,t){const r=e.find(e=>e.value===t);r?r.count++:e.push({value:t,count:1})}finalizeFacets(e){return{repositories:e.repositories.sort((e,t)=>t.count-e.count),languages:e.languages.sort((e,t)=>t.count-e.count),apiTypes:e.apiTypes.sort((e,t)=>t.count-e.count),fileTypes:e.fileTypes.sort((e,t)=>t.count-e.count),topics:e.topics.sort((e,t)=>t.count-e.count)}}generateSuggestions(e,t){const r=new Set,o=e.toLowerCase();for(const i of t.slice(0,10)){const e=this.tokenize(i.title);for(const t of e)t.includes(o)&&t!==o&&r.add(t)}return Array.from(r).slice(0,5)}};var j=r(70579);const A=e=>{let{onResultSelect:t,initialQuery:r="",className:i=""}=e;const[n,a]=(0,o.useState)(r),[s,l]=(0,o.useState)("all"),[c,d]=(0,o.useState)({}),[h,p]=(0,o.useState)(!1),[g,u]=(0,o.useState)(null),[y,A]=(0,o.useState)(!1),[z,E]=(0,o.useState)([]),[R,C]=(0,o.useState)(!1),[T,N]=(0,o.useState)(-1),O=(0,o.useRef)(null),F=function(e,t){const[r,i]=(0,o.useState)(e);return(0,o.useEffect)(()=>{const r=setTimeout(()=>{i(e)},t);return()=>{clearTimeout(r)}},[e,t]),r}(n,300);(0,o.useEffect)(()=>{F||Object.keys(c).length>0?_():u(null)},[F,s,c]),(0,o.useEffect)(()=>{n.length>=2&&n!==F?I():(E([]),C(!1))},[n]);const _=async()=>{A(!0);try{const e={query:F,scope:s,filters:c,limit:20},t=await S.search(e);u(t)}catch(e){}finally{A(!1)}},I=async()=>{try{const e=await S.getSuggestions(n);E(e),C(e.length>0)}catch(e){}},P=e=>{var t;a(e),C(!1),N(-1),null===(t=O.current)||void 0===t||t.focus()},H=(e,t)=>{d(r=>{const o={...r};if(Array.isArray(o[e])){const r=o[e],i=r.indexOf(t);i>-1?(r.splice(i,1),0===r.length&&delete o[e]):r.push(t)}else o[e]===t?delete o[e]:o[e]=t;return o})},D=e=>{switch(e){case"repository":return(0,j.jsx)(f.A,{className:"w-4 h-4"});case"file":default:return(0,j.jsx)(b.A,{className:"w-4 h-4"});case"api":return(0,j.jsx)($.A,{className:"w-4 h-4"})}},L=(e,t)=>{let r=e;return t.forEach(e=>{const t=new RegExp(`(${e})`,"gi");r=r.replace(t,'<mark class="bg-yellow-200">$1</mark>')}),r};return(0,j.jsxs)("div",{className:`advanced-search ${i}`,children:[(0,j.jsxs)("div",{className:"relative",children:[(0,j.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,j.jsxs)("div",{className:"relative flex-1",children:[(0,j.jsx)(m.A,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"}),(0,j.jsx)("input",{ref:O,type:"text",value:n,onChange:e=>a(e.target.value),onKeyDown:e=>{if(R)switch(e.key){case"ArrowDown":e.preventDefault(),N(e=>e<z.length-1?e+1:e);break;case"ArrowUp":e.preventDefault(),N(e=>e>-1?e-1:-1);break;case"Enter":e.preventDefault(),T>=0&&P(z[T]);break;case"Escape":C(!1),N(-1)}},onFocus:()=>C(z.length>0),onBlur:()=>setTimeout(()=>C(!1),200),placeholder:"Search repositories, documentation, APIs...",className:"w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}),n&&(0,j.jsx)("button",{onClick:()=>a(""),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",children:(0,j.jsx)(x.A,{className:"w-4 h-4"})}),R&&(0,j.jsx)("div",{className:"absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10",children:z.map((e,t)=>(0,j.jsx)("button",{onClick:()=>P(e),className:"w-full px-4 py-2 text-left hover:bg-gray-50 "+(t===T?"bg-gray-100":""),children:e},e))})]}),(0,j.jsxs)("button",{onClick:()=>p(!h),className:"flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 "+(h?"bg-gray-50":""),children:[(0,j.jsx)(w.A,{className:"w-4 h-4"}),"Filters",Object.keys(c).length>0&&(0,j.jsx)("span",{className:"bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full",children:Object.keys(c).length})]})]}),(0,j.jsx)("div",{className:"flex gap-2 mb-4",children:["all","repositories","documentation","apis"].map(e=>(0,j.jsx)("button",{onClick:()=>l(e),className:"px-4 py-1 rounded-full text-sm capitalize "+(s===e?"bg-blue-500 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"),children:e},e))})]}),h&&(0,j.jsxs)("div",{className:"mb-4 p-4 bg-gray-50 rounded-lg",children:[(0,j.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,j.jsx)("h3",{className:"font-medium",children:"Filters"}),(0,j.jsx)("button",{onClick:()=>{d({})},className:"text-sm text-blue-500 hover:text-blue-600",children:"Clear all"})]}),(null===g||void 0===g?void 0:g.facets)&&(0,j.jsxs)("div",{className:"space-y-3",children:[g.facets.languages.length>0&&(0,j.jsxs)("div",{children:[(0,j.jsx)("h4",{className:"text-sm font-medium mb-2",children:"Language"}),(0,j.jsx)("div",{className:"flex flex-wrap gap-2",children:g.facets.languages.map(e=>{var t;let{value:r,count:o}=e;return(0,j.jsxs)("button",{onClick:()=>H("languages",r),className:"px-3 py-1 text-sm rounded-full "+(null!==(t=c.languages)&&void 0!==t&&t.includes(r)?"bg-blue-500 text-white":"bg-white border hover:bg-gray-50"),children:[r," (",o,")"]},r)})})]}),g.facets.apiTypes.length>0&&(0,j.jsxs)("div",{children:[(0,j.jsx)("h4",{className:"text-sm font-medium mb-2",children:"API Type"}),(0,j.jsx)("div",{className:"flex flex-wrap gap-2",children:g.facets.apiTypes.map(e=>{var t;let{value:r,count:o}=e;return(0,j.jsxs)("button",{onClick:()=>H("apiTypes",r),className:"px-3 py-1 text-sm rounded-full "+(null!==(t=c.apiTypes)&&void 0!==t&&t.includes(r)?"bg-blue-500 text-white":"bg-white border hover:bg-gray-50"),children:[r.toUpperCase()," (",o,")"]},r)})})]}),g.facets.topics.length>0&&(0,j.jsxs)("div",{children:[(0,j.jsx)("h4",{className:"text-sm font-medium mb-2",children:"Topics"}),(0,j.jsx)("div",{className:"flex flex-wrap gap-2",children:g.facets.topics.slice(0,10).map(e=>{var t;let{value:r,count:o}=e;return(0,j.jsxs)("button",{onClick:()=>H("topics",r),className:"px-3 py-1 text-sm rounded-full "+(null!==(t=c.topics)&&void 0!==t&&t.includes(r)?"bg-blue-500 text-white":"bg-white border hover:bg-gray-50"),children:[(0,j.jsx)(v.A,{className:"w-3 h-3 inline mr-1"}),r," (",o,")"]},r)})})]})]})]}),y&&(0,j.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Searching..."}),!y&&g&&(0,j.jsxs)("div",{children:[(0,j.jsx)("div",{className:"flex items-center justify-between mb-4",children:(0,j.jsxs)("p",{className:"text-sm text-gray-600",children:["Found ",g.totalCount," results",g.executionTime&&(0,j.jsxs)("span",{className:"text-gray-400",children:[" in ",g.executionTime,"ms"]})]})}),(0,j.jsx)("div",{className:"space-y-3",children:g.results.map(e=>{var r;return(0,j.jsx)("div",{onClick:()=>null===t||void 0===t?void 0:t(e),className:"p-4 bg-white border rounded-lg hover:shadow-md cursor-pointer transition-shadow",children:(0,j.jsxs)("div",{className:"flex items-start gap-3",children:[(0,j.jsx)("div",{className:"text-gray-400 mt-1",children:D(e.type)}),(0,j.jsxs)("div",{className:"flex-1",children:[(0,j.jsxs)("h3",{className:"font-medium text-lg flex items-center gap-2",children:[e.title,(0,j.jsx)("span",{className:"text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded",children:e.type})]}),e.description&&(0,j.jsx)("p",{className:"text-gray-600 text-sm mt-1",children:e.description}),(0,j.jsxs)("div",{className:"flex items-center gap-4 mt-2 text-xs text-gray-500",children:[(0,j.jsx)("span",{children:e.repository}),e.path&&(0,j.jsx)("span",{children:e.path}),(null===(r=e.metadata)||void 0===r?void 0:r.lastUpdated)&&(0,j.jsxs)("span",{className:"flex items-center gap-1",children:[(0,j.jsx)(k.A,{className:"w-3 h-3"}),new Date(e.metadata.lastUpdated).toLocaleDateString()]})]}),e.highlights.length>0&&(0,j.jsx)("div",{className:"mt-2",children:e.highlights.map((e,t)=>(0,j.jsx)("div",{className:"text-sm text-gray-600",dangerouslySetInnerHTML:{__html:L(e.snippet,e.matchedTokens)}},t))})]})]})},e.id)})}),0===g.results.length&&(0,j.jsxs)("div",{className:"text-center py-8 text-gray-500",children:[(0,j.jsxs)("p",{children:['No results found for "',n,'"']}),g.suggestions&&g.suggestions.length>0&&(0,j.jsxs)("div",{className:"mt-4",children:[(0,j.jsx)("p",{className:"text-sm",children:"Did you mean:"}),(0,j.jsx)("div",{className:"flex justify-center gap-2 mt-2",children:g.suggestions.map(e=>(0,j.jsx)("button",{onClick:()=>a(e),className:"text-blue-500 hover:text-blue-600",children:e},e))})]})]})]})]})},z=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: ${e=>e.isOpen?"flex":"none"};
  align-items: flex-start;
  justify-content: center;
  padding: ${e=>e.theme.spacing[16]} ${e=>e.theme.spacing[4]};
  animation: ${e=>e.isOpen?"fadeIn":"fadeOut"} 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`,E=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border-radius: ${e=>e.theme.borderRadius.lg};
  box-shadow: ${e=>e.theme.shadows.xl};
  width: 100%;
  max-width: 896px;
  max-height: 80vh;
  overflow: hidden;
  transform: ${e=>e.isOpen?"translateY(0) scale(1)":"translateY(-20px) scale(0.95)"};
  transition: transform 0.3s ease-in-out;
  border: 2px solid ${e=>e.theme.colors.primary.yellow};
`,R=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-bottom: 2px solid ${e=>e.theme.colors.primary.yellow};
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
`,C=s.Ay.h2`
  margin: 0;
  font-size: ${e=>e.theme.typography.fontSize.xl};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.primary.white};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
`,T=s.Ay.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.primary.white};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 230, 0, 0.2);
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid ${e=>e.theme.colors.primary.yellow};
    outline-offset: 2px;
  }
`,N=s.Ay.div`
  padding: ${e=>e.theme.spacing[6]};
  max-height: calc(80vh - 140px);
  overflow-y: auto;
`,O=s.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[6]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  background: ${e=>e.theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
`,F=s.Ay.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[4]};
`,_=s.Ay.kbd`
  background: ${e=>e.theme.colors.background.tertiary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.sm};
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  color: ${e=>e.theme.colors.text.primary};
`,I=e=>{let{isOpen:t,onClose:r}=e;const i=(0,o.useRef)(null),n=(0,a.Zp)();(0,o.useEffect)(()=>{const e=e=>{"Escape"===e.key&&t&&r()};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[t,r]),(0,o.useEffect)(()=>(document.body.style.overflow=t?"hidden":"",()=>{document.body.style.overflow=""}),[t]);return t?(0,j.jsx)(z,{isOpen:t,onClick:e=>{e.target===e.currentTarget&&r()},children:(0,j.jsxs)(E,{isOpen:t,ref:i,onClick:e=>e.stopPropagation(),children:[(0,j.jsxs)(R,{children:[(0,j.jsxs)(C,{children:[(0,j.jsx)(m.A,{size:24}),"Search EYNS AI Experience Center"]}),(0,j.jsx)(T,{onClick:r,"aria-label":"Close search modal",children:(0,j.jsx)(x.A,{size:20})})]}),(0,j.jsx)(N,{children:(0,j.jsx)(A,{onResultSelect:e=>{switch(r(),e.type){case"repository":default:n(`/repository/${e.repository}`);break;case"file":n(`/repository/${e.repository}?file=${e.path}`);break;case"api":n(`/api-hub/${e.repository}`)}},className:"w-full"})}),(0,j.jsxs)(O,{children:[(0,j.jsxs)(F,{children:[(0,j.jsxs)("span",{children:[(0,j.jsx)(_,{children:"\u2191\u2193"})," Navigate"]}),(0,j.jsxs)("span",{children:[(0,j.jsx)(_,{children:"Enter"})," Select"]}),(0,j.jsxs)("span",{children:[(0,j.jsx)(_,{children:"Esc"})," Close"]})]}),(0,j.jsxs)("div",{children:["Press ",(0,j.jsx)(_,{children:"Cmd+K"})," to open search"]})]})]})}):null};var P=r(66382),H=r(50122);const D=s.Ay.header`
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary.black} 0%, ${e=>e.theme.colors.secondary.darkGray} 100%);
  border-bottom: 3px solid ${e=>e.theme.colors.primary.yellow};
  box-shadow: ${e=>e.theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${e=>e.theme.zIndex.sticky};
  
  /* Subtle animation on scroll */
  transition: ${e=>e.theme.animations.transition.shadow};
`,L=s.Ay.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${e=>e.theme.spacing[4]} 0;
  
  ${e=>e.theme.breakpoints.down.md} {
    flex-direction: column;
    gap: ${e=>e.theme.spacing[4]};
    padding: ${e=>e.theme.spacing[3]} 0;
  }
`,W=(0,s.Ay)(n.N_)`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  color: ${e=>e.theme.colors.primary.white};
  text-decoration: none;
  font-size: ${e=>e.theme.typography.fontSize["2xl"]};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  transition: ${e=>e.theme.animations.transition.transform};
  
  &:hover {
    transform: scale(1.02);
  }
  
  ${e=>e.theme.breakpoints.down.md} {
    font-size: ${e=>e.theme.typography.fontSize.xl};
  }
`,U=s.Ay.div`
  width: 40px;
  height: 40px;
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  border-radius: ${e=>e.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  font-size: ${e=>e.theme.typography.fontSize.lg};
  box-shadow: ${e=>e.theme.shadows.sm};
`,B=s.Ay.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[4]};
  
  ${e=>e.theme.breakpoints.down.md} {
    gap: ${e=>e.theme.spacing[2]};
    flex-wrap: wrap;
    justify-content: center;
  }
`,K=(0,s.Ay)(n.N_)`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  color: ${e=>e.theme.colors.primary.white};
  text-decoration: none;
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.md};
  transition: ${e=>e.theme.animations.transition.all};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`,Y=s.Ay.button`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  color: ${e=>e.theme.colors.primary.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  transition: ${e=>e.theme.animations.transition.all};
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${e=>e.theme.colors.primary.yellow};
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${e=>e.theme.colors.primary.yellow};
  }
  
  ${e=>e.theme.breakpoints.down.sm} {
    padding: ${e=>e.theme.spacing[2]};
    
    span {
      display: none;
    }
  }
`,M=s.Ay.kbd`
  font-size: ${e=>e.theme.typography.fontSize.xs};
  padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[1]};
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${e=>e.theme.borderRadius.sm};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  margin-left: ${e=>e.theme.spacing[2]};
  
  ${e=>e.theme.breakpoints.down.sm} {
    display: none;
  }
`,q=s.Ay.div`
  position: relative;
`,V=s.Ay.button`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  color: ${e=>e.theme.colors.primary.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  transition: ${e=>e.theme.animations.transition.all};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${e=>e.theme.colors.primary.yellow};
  }
`,G=s.Ay.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${e=>e.theme.spacing[2]};
  background: ${e=>e.theme.colors.primary.white};
  border-radius: ${e=>e.theme.borderRadius.md};
  box-shadow: ${e=>e.theme.shadows.lg};
  min-width: 200px;
  overflow: hidden;
  transform-origin: top right;
  transition: ${e=>e.theme.animations.transition.all};
  opacity: ${e=>e.isOpen?1:0};
  transform: ${e=>e.isOpen?"scale(1)":"scale(0.95)"};
  pointer-events: ${e=>e.isOpen?"all":"none"};
`,J=s.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  border-bottom: 1px solid ${e=>e.theme.colors.gray[200]};
  
  .name {
    font-weight: ${e=>e.theme.typography.fontWeight.semibold};
    color: ${e=>e.theme.colors.gray[900]};
  }
  
  .email {
    font-size: ${e=>e.theme.typography.fontSize.sm};
    color: ${e=>e.theme.colors.gray[600]};
    margin-top: ${e=>e.theme.spacing[.5]};
  }
`,Z=(0,s.Ay)(n.N_)`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[4]};
  color: ${e=>e.theme.colors.gray[700]};
  text-decoration: none;
  font-size: ${e=>e.theme.typography.fontSize.sm};
  transition: ${e=>e.theme.animations.transition.all};
  
  &:hover {
    background: ${e=>e.theme.colors.gray[50]};
    color: ${e=>e.theme.colors.primary.main};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`,X=s.Ay.button`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[4]};
  color: ${e=>e.theme.colors.gray[700]};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: ${e=>e.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${e=>e.theme.animations.transition.all};
  
  &:hover {
    background: ${e=>e.theme.colors.gray[50]};
    color: ${e=>e.theme.colors.primary.main};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`,Q=s.Ay.span`
  display: inline-block;
  padding: ${e=>e.theme.spacing[.5]} ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  border-radius: ${e=>e.theme.borderRadius.full};
  margin-left: ${e=>e.theme.spacing[2]};
  
  ${e=>{switch(e.role){case H.gG.ADMIN:return`\n          background: ${e=>e.theme.colors.accent.red}20;\n          color: ${e=>e.theme.colors.accent.red};\n        `;case H.gG.DEVELOPER:return`\n          background: ${e=>e.theme.colors.info.light};\n          color: ${e=>e.theme.colors.info.main};\n        `;default:return`\n          background: ${e=>e.theme.colors.gray[200]};\n          color: ${e=>e.theme.colors.gray[700]};\n        `}}}
`,ee=s.Ay.span`
  color: ${e=>e.theme.colors.primary.yellow};
  font-weight: ${e=>e.theme.typography.fontWeight.black};
`,te=()=>{const[e,t]=(0,o.useState)(!1),[r,i]=(0,o.useState)(!1),{user:n,isAuthenticated:s,logout:l,hasRole:c}=(0,P.A)();(0,a.Zp)();(0,o.useEffect)(()=>{const r=r=>{(r.metaKey||r.ctrlKey)&&"k"===r.key&&(r.preventDefault(),t(!0)),"Escape"===r.key&&e&&t(!1)};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[e]),(0,o.useEffect)(()=>{const e=e=>{e.target.closest("[data-user-menu]")||i(!1)};if(r)return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[r]);return(0,j.jsxs)(D,{children:[(0,j.jsx)(y.mc,{maxWidth:"2xl",children:(0,j.jsxs)(L,{children:[(0,j.jsxs)(W,{to:"/",children:[(0,j.jsx)(U,{children:(0,j.jsx)(ee,{children:"EY"})}),(0,j.jsxs)("div",{children:[(0,j.jsx)(ee,{children:"EYNS"})," AI Experience Center"]})]}),(0,j.jsxs)(B,{children:[(0,j.jsxs)(K,{to:"/",children:[(0,j.jsx)(d.A,{size:18}),(0,j.jsx)("span",{children:"Home"})]}),s&&c(H.gG.ADMIN)&&(0,j.jsxs)(K,{to:"/sync",children:[(0,j.jsx)(h.A,{size:18}),(0,j.jsx)("span",{children:"Sync"})]}),(0,j.jsxs)(Y,{onClick:()=>t(!0),children:[(0,j.jsx)(m.A,{size:16}),(0,j.jsx)("span",{children:"Search"}),(0,j.jsx)(M,{children:"\u2318K"})]}),s&&n?(0,j.jsxs)(q,{"data-user-menu":!0,children:[(0,j.jsxs)(V,{onClick:()=>i(!r),children:[(0,j.jsx)(p.A,{size:18}),(0,j.jsx)("span",{children:n.name.split(" ")[0]})]}),(0,j.jsxs)(G,{isOpen:r,children:[(0,j.jsxs)(J,{children:[(0,j.jsxs)("div",{className:"name",children:[n.name,(0,j.jsx)(Q,{role:n.role,children:n.role.charAt(0).toUpperCase()+n.role.slice(1)})]}),(0,j.jsx)("div",{className:"email",children:n.email})]}),(0,j.jsxs)(Z,{to:"/profile",onClick:()=>i(!1),children:[(0,j.jsx)(p.A,{}),"Profile"]}),(c(H.gG.DEVELOPER)||c(H.gG.ADMIN))&&(0,j.jsxs)(Z,{to:"/api-keys",onClick:()=>i(!1),children:[(0,j.jsx)(g.A,{}),"API Keys"]}),(0,j.jsxs)(X,{onClick:()=>{l(),i(!1)},children:[(0,j.jsx)(u.A,{}),"Sign Out"]})]})]}):(0,j.jsxs)(K,{to:"/login",children:[(0,j.jsx)(p.A,{size:18}),(0,j.jsx)("span",{children:"Sign In"})]})]})]})}),(0,j.jsx)(I,{isOpen:e,onClose:()=>t(!1)})]})};var re=r(79204);const oe=e=>{var t;let{onSyncComplete:r,className:i=""}=e;const[n,a]=(0,o.useState)({isInProgress:!1,totalRepositories:0,completedRepositories:0,errors:[]}),[s,l]=(0,o.useState)(re.t.getLastSyncInfo()),[c,d]=(0,o.useState)(!1);(0,o.useEffect)(()=>{let e=null;return n.isInProgress&&(e=setInterval(()=>{re.t.getSyncStatus().then(e=>a(e))},1e3)),()=>{e&&clearInterval(e)}},[n.isInProgress]);return(0,j.jsx)("div",{className:`bg-white border border-gray-200 rounded-lg shadow-sm ${i}`,children:(0,j.jsxs)("div",{className:"p-4",children:[(0,j.jsxs)("div",{className:"flex items-center justify-between",children:[(0,j.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,j.jsx)("div",{className:"w-3 h-3 rounded-full "+(n.isInProgress?"bg-blue-500 animate-pulse":n.errors.length>0?"bg-yellow-500":"bg-green-500")}),(0,j.jsx)("h3",{className:"text-sm font-medium text-gray-900",children:n.isInProgress?"Syncing Repositories":"Repository Sync"})]}),(0,j.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,j.jsxs)("span",{className:"text-xs text-gray-500",children:["Last sync: ",(e=>{if(!e)return"Never";const t=(new Date).getTime()-new Date(e).getTime(),r=Math.floor(t/6e4),o=Math.floor(r/60),i=Math.floor(o/24);return i>0?`${i} day${i>1?"s":""} ago`:o>0?`${o} hour${o>1?"s":""} ago`:r>0?`${r} minute${r>1?"s":""} ago`:"Just now"})(s.timestamp||n.lastSyncTime)]}),(0,j.jsx)("button",{onClick:()=>d(!c),className:"p-1 rounded hover:bg-gray-100 transition-colors","aria-label":c?"Collapse":"Expand",children:(0,j.jsx)("svg",{className:"w-4 h-4 text-gray-500 transform transition-transform "+(c?"rotate-180":""),fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,j.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})})]})]}),n.isInProgress&&(0,j.jsxs)("div",{className:"mt-3",children:[(0,j.jsxs)("div",{className:"flex items-center justify-between text-xs text-gray-600 mb-1",children:[(0,j.jsxs)("span",{children:["Syncing: ",n.currentRepository||"Initializing..."]}),(0,j.jsxs)("span",{children:[n.completedRepositories," of ",n.totalRepositories]})]}),(0,j.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,j.jsx)("div",{className:"bg-blue-500 h-2 rounded-full transition-all duration-300",style:{width:`${n.isInProgress&&0!==n.totalRepositories?Math.round(n.completedRepositories/n.totalRepositories*100):0}%`}})})]}),c&&(0,j.jsxs)("div",{className:"mt-4 space-y-3",children:[!n.isInProgress&&(0,j.jsx)("button",{onClick:async()=>{a({...n,isInProgress:!0});try{const e=await re.t.syncOnStartup();re.t.saveLastSyncInfo(e),l({timestamp:e.timestamp,result:e}),r&&r(e)}catch(e){}finally{re.t.getSyncStatus().then(e=>a(e))}},className:"w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium",children:"Sync All Repositories"}),(null===(t=s.result)||void 0===t?void 0:t.syncedRepositories)&&s.result.syncedRepositories.length>0&&(0,j.jsxs)("div",{children:[(0,j.jsxs)("h4",{className:"text-xs font-medium text-gray-700 mb-2",children:["Synced Repositories (",s.result.syncedRepositories.length,")"]}),(0,j.jsx)("div",{className:"max-h-32 overflow-y-auto",children:(0,j.jsx)("ul",{className:"text-xs text-gray-600 space-y-1",children:s.result.syncedRepositories.map((e,t)=>(0,j.jsxs)("li",{className:"flex items-center space-x-2",children:[(0,j.jsx)("svg",{className:"w-3 h-3 text-green-500",fill:"currentColor",viewBox:"0 0 20 20",children:(0,j.jsx)("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})}),(0,j.jsx)("span",{children:e})]},t))})})]}),n.errors.length>0&&(0,j.jsxs)("div",{children:[(0,j.jsxs)("h4",{className:"text-xs font-medium text-red-700 mb-2",children:["Sync Errors (",n.errors.length,")"]}),(0,j.jsx)("div",{className:"max-h-32 overflow-y-auto",children:(0,j.jsx)("ul",{className:"text-xs text-red-600 space-y-1",children:n.errors.map((e,t)=>(0,j.jsxs)("li",{className:"flex items-start space-x-2",children:[(0,j.jsx)("svg",{className:"w-3 h-3 text-red-500 mt-0.5 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20",children:(0,j.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),(0,j.jsx)("span",{className:"break-all",children:e})]},t))})})]})]})]})})};var ie=r(67375),ne=r(78229);const ae=()=>{const[e,t]=(0,o.useState)(!1),r=(0,o.useCallback)(()=>{t(!0)},[]),i=(0,o.useCallback)(()=>{t(!1)},[]),n=(0,o.useCallback)(()=>{t(e=>!e)},[]);return(0,o.useEffect)(()=>{const e=e=>{(e.metaKey||e.ctrlKey)&&"k"===e.key&&(e.preventDefault(),e.stopPropagation(),n())};return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}},[n]),{isSearchOpen:e,openSearch:r,closeSearch:i,toggleSearch:n}},se=s.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`,le=s.Ay.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,ce=s.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`,de=s.Ay.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  max-width: 500px;
  
  h2 {
    color: #dc3545;
    margin: 0 0 16px 0;
  }
  
  p {
    color: #6c757d;
    margin: 0 0 24px 0;
    font-size: 16px;
  }
`,he=s.Ay.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #0066cc;
  color: white;
  
  &:hover {
    background: #0052a3;
  }
`,me=e=>{let{children:t,requiredRole:r,requiredPermission:o}=e;const{isAuthenticated:i,isLoading:n,user:s,hasRole:l,hasPermission:c}=(0,P.A)(),d=(0,a.zy)();if(!("true"==={NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_API_URL:"http://0.0.0.0:3001"}.REACT_APP_SKIP_AUTH||!1)){if(n)return(0,j.jsx)(se,{children:(0,j.jsx)(le,{})});if(!i)return(0,j.jsx)(a.C5,{to:"/login",state:{from:d},replace:!0})}return r&&!l(r)?(0,j.jsx)(ce,{children:(0,j.jsxs)(de,{children:[(0,j.jsx)("h2",{children:"Access Denied"}),(0,j.jsxs)("p",{children:["You don't have the required role to access this page. This page requires ",r," access."]}),(0,j.jsx)(he,{onClick:()=>window.history.back(),children:"Go Back"})]})}):o&&!c(o)?(0,j.jsx)(ce,{children:(0,j.jsxs)(de,{children:[(0,j.jsx)("h2",{children:"Insufficient Permissions"}),(0,j.jsx)("p",{children:"You don't have the required permissions to access this resource. Please contact your administrator if you believe this is an error."}),(0,j.jsx)(he,{onClick:()=>window.history.back(),children:"Go Back"})]})}):(0,j.jsx)(j.Fragment,{children:t})},pe=s.i7`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`,ge=(s.i7`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`,s.i7`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`),ue=s.i7`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`,ye=s.i7`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`,xe=s.Ay.div`
  animation: ${e=>{if(!e.isTransitioning)return"none";switch(e.transitionType){case"slide":return"backward"===e.direction?ue:ge;case"scale":return ye;default:return pe}}} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut} forwards;
  
  opacity: ${e=>e.isTransitioning?0:1};
  will-change: transform, opacity;
`,fe=e=>{let{children:t,transitionType:r="fade",duration:i=250}=e;const n=(0,a.zy)(),[s,l]=(0,o.useState)(!0),[c,d]=(0,o.useState)(n.pathname),[h,m]=(0,o.useState)("forward");return(0,o.useEffect)(()=>{const e=n.pathname.split("/").filter(Boolean).length,t=c.split("/").filter(Boolean).length;m(e>=t?"forward":"backward"),l(!0);const r=setTimeout(()=>{l(!1),d(n.pathname)},i);return()=>clearTimeout(r)},[n.pathname,i,c]),(0,j.jsx)(xe,{isTransitioning:s,transitionType:r,direction:h,children:t})};var be=r(8707),$e=r(19340),we=r(64830),ve=r(81199),ke=r(94574),Se=r(21617);const je=s.i7`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,Ae=s.i7`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${e=>e.theme.colors.primary.yellow}40;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px ${e=>e.theme.colors.primary.yellow}00;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${e=>e.theme.colors.primary.yellow}00;
  }
`,ze=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.isFullscreen?Se.w.colors.primary.black:"transparent"};
  z-index: ${e=>e.theme.zIndex.modal};
  pointer-events: ${e=>e.isActive?"all":"none"};
  opacity: ${e=>e.isActive?1:0};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,Ee=s.Ay.div`
  position: fixed;
  bottom: ${e=>e.theme.spacing[6]};
  left: 50%;
  transform: translateX(-50%) ${e=>e.isVisible?"translateY(0)":"translateY(120%)"};
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[4]};
  box-shadow: ${e=>e.theme.shadows.xl};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  z-index: ${e=>e.theme.zIndex.modal+1};
  animation: ${je} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  backdrop-filter: blur(10px);
`,Re=s.Ay.div`
  width: 200px;
  height: 6px;
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.full};
  overflow: hidden;
  margin: 0 ${e=>e.theme.spacing[3]};
`,Ce=s.Ay.div`
  width: ${e=>e.progress}%;
  height: 100%;
  background: linear-gradient(90deg, ${e=>e.theme.colors.primary.yellow}, ${e=>e.theme.colors.accent.blue});
  border-radius: ${e=>e.theme.borderRadius.full};
  transition: width ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};
`,Te=s.Ay.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
  min-width: 120px;
`,Ne=s.Ay.div`
  position: fixed;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  background: ${e=>e.theme.colors.primary.yellow};
  color: ${e=>e.theme.colors.primary.black};
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]};
  border-radius: ${e=>e.theme.borderRadius.lg};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  max-width: 300px;
  box-shadow: ${e=>e.theme.shadows.lg};
  z-index: ${e=>e.theme.zIndex.tooltip};
  opacity: ${e=>e.isVisible?1:0};
  transform: ${e=>e.isVisible?"scale(1)":"scale(0.8)"};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${e=>e.theme.colors.primary.yellow};
  }
`,Oe=s.Ay.div`
  position: fixed;
  left: ${e=>e.x-e.size/2}px;
  top: ${e=>e.y-e.size/2}px;
  width: ${e=>e.size}px;
  height: ${e=>e.size}px;
  border: 3px solid ${e=>e.theme.colors.primary.yellow};
  border-radius: ${e=>e.theme.borderRadius.full};
  pointer-events: none;
  z-index: ${e=>e.theme.zIndex.modal};
  opacity: ${e=>e.isVisible?1:0};
  animation: ${Ae} 2s infinite;
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,Fe=[{id:"home",route:"/",title:"Welcome to EY AI Experience Center",description:"Your central hub for repositories, APIs, and documentation",duration:3e3},{id:"stats",route:"/",title:"Innovation Dashboard",description:"Real-time statistics showing our development ecosystem",element:'[data-testid="statistics-dashboard"]',duration:4e3},{id:"repositories",route:"/",title:"Repository Overview",description:"Browse through our collection of repositories with enhanced cards",element:'[data-testid="repository-card"]:first-child',duration:3e3},{id:"repository-detail",route:"/repository/sample-repo",title:"Repository Details",description:"Explore comprehensive repository information and APIs",duration:4e3},{id:"api-explorer",route:"/api-explorer/sample-repo",title:"API Explorer",description:"Interactive API testing and documentation",duration:4e3},{id:"documentation",route:"/docs/sample-repo",title:"Documentation Viewer",description:"Rich markdown documentation with interactive navigation",duration:3e3}],_e=e=>{let{onToggle:t}=e;return(0,j.jsxs)(y.$n,{onClick:t,variant:"primary",size:"sm",style:{position:"fixed",top:Se.w.spacing[4],right:Se.w.spacing[4],zIndex:Se.w.zIndex.fixed,background:`linear-gradient(45deg, ${e=>e.theme.colors.primary.yellow}, ${e=>e.theme.colors.accent.blue})`,border:"none",boxShadow:Se.w.shadows.lg},children:[(0,j.jsx)(we.A,{size:16}),"Demo Mode"]})},Ie=e=>{let{isActive:t,onToggle:r}=e;const i=(0,a.Zp)(),n=(0,a.zy)(),[s,l]=(0,o.useState)(0),[c,d]=(0,o.useState)(!1),[h,m]=(0,o.useState)(0),[p,g]=(0,o.useState)({x:0,y:0}),[u,f]=(0,o.useState)({x:0,y:0,size:100}),[b,$]=(0,o.useState)(!1),w=Fe[s],v=(0,o.useCallback)(e=>{const t=document.querySelector(e);if(t){const e=t.getBoundingClientRect(),r=e.left+e.width/2,o=e.top+e.height/2;f({x:r,y:o,size:Math.max(e.width,e.height)+40}),g({x:r-150,y:e.top-80}),t.scrollIntoView({behavior:"smooth",block:"center"})}},[]),k=(0,o.useCallback)(e=>{if(e>=0&&e<Fe.length){const t=Fe[e];l(e),m(0),t.route!==n.pathname&&i(t.route),setTimeout(()=>{t.element&&v(t.element),t.action&&t.action()},500)}},[i,n.pathname,v]),S=(0,o.useCallback)(()=>{s<Fe.length-1?k(s+1):(d(!1),k(0))},[s,k]),A=(0,o.useCallback)(()=>{s>0&&k(s-1)},[s,k]),z=()=>{d(!c)},E=()=>{d(!1),r(),i("/")},R=()=>{var e,t,r,o;($(!b),b)?null===(e=(t=document).exitFullscreen)||void 0===e||e.call(t):null===(r=(o=document.documentElement).requestFullscreen)||void 0===r||r.call(o)};return(0,o.useEffect)(()=>{if(!t||!c)return;const e=setInterval(()=>{m(e=>{const t=e+100/(w.duration/100);return t>=100?(S(),0):t})},100);return()=>clearInterval(e)},[t,c,w.duration,S]),(0,o.useEffect)(()=>{t&&k(0)},[t,k]),(0,o.useEffect)(()=>{if(!t)return;const e=e=>{switch(e.code){case"Space":e.preventDefault(),z();break;case"ArrowRight":e.preventDefault(),S();break;case"ArrowLeft":e.preventDefault(),A();break;case"Escape":E();break;case"KeyF":(e.ctrlKey||e.metaKey)&&(e.preventDefault(),R())}};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[t,S,A]),t?(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(ze,{isActive:t,isFullscreen:b}),(0,j.jsx)(Oe,{x:u.x,y:u.y,size:u.size,isVisible:t&&!!w.element}),(0,j.jsxs)(Ne,{x:p.x,y:p.y,isVisible:t,children:[(0,j.jsx)("div",{style:{fontWeight:Se.w.typography.fontWeight.bold,marginBottom:Se.w.spacing[2]},children:w.title}),(0,j.jsx)("div",{children:w.description})]}),(0,j.jsxs)(Ee,{isVisible:t,children:[(0,j.jsx)(y.$n,{size:"sm",onClick:A,disabled:0===s,children:(0,j.jsx)(be.A,{size:16})}),(0,j.jsx)(y.$n,{size:"sm",onClick:z,children:c?(0,j.jsx)($e.A,{size:16}):(0,j.jsx)(we.A,{size:16})}),(0,j.jsx)(y.$n,{size:"sm",onClick:S,disabled:s===Fe.length-1,children:(0,j.jsx)(ve.A,{size:16})}),(0,j.jsx)(Re,{children:(0,j.jsx)(Ce,{progress:h})}),(0,j.jsxs)(Te,{children:["Step ",s+1," of ",Fe.length]}),(0,j.jsx)(y.$n,{size:"sm",variant:"outline",onClick:R,children:(0,j.jsx)(ke.A,{size:16})}),(0,j.jsx)(y.$n,{size:"sm",variant:"outline",onClick:E,children:(0,j.jsx)(x.A,{size:16})})]})]}):null};var Pe=r(20073),He=r(9461),De=r(7365),Le=r(6187),We=r(94473);const Ue=s.i7`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,Be=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.theme.colors.background.overlay};
  z-index: ${e=>e.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${e=>e.isVisible?1:0};
  visibility: ${e=>e.isVisible?"visible":"hidden"};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  backdrop-filter: blur(5px);
`,Ke=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[8]};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${e=>e.theme.shadows.xl};
  transform: ${e=>e.isVisible?"scale(1)":"scale(0.9)"};
  animation: ${e=>e.isVisible?Ue:"none"} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,Ye=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${e=>e.theme.spacing[6]};
  padding-bottom: ${e=>e.theme.spacing[4]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
`,Me=s.Ay.h2`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  margin: 0;
  font-size: ${e=>e.theme.typography.fontSize.xl};
  font-weight: ${e=>e.theme.typography.fontWeight.bold};
  color: ${e=>e.theme.colors.text.primary};
`,qe=s.Ay.button`
  background: none;
  border: none;
  padding: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.primary};
  }
`,Ve=s.Ay.div`
  margin-bottom: ${e=>e.theme.spacing[6]};
`,Ge=s.Ay.h3`
  font-size: ${e=>e.theme.typography.fontSize.lg};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
`,Je=s.Ay.div`
  display: grid;
  gap: ${e=>e.theme.spacing[3]};
`,Ze=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.md};
  transition: background ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.tertiary};
  }
`,Xe=s.Ay.span`
  color: ${e=>e.theme.colors.text.primary};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
`,Qe=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[1]};
`,et=s.Ay.kbd`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.medium};
  border-radius: ${e=>e.theme.borderRadius.sm};
  padding: ${e=>e.theme.spacing[1]} ${e=>e.theme.spacing[2]};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.primary};
  box-shadow: inset 0 -2px 0 ${e=>e.theme.colors.border.medium};
  min-width: 24px;
  text-align: center;
`,tt=s.Ay.div`
  position: fixed;
  bottom: ${e=>e.theme.spacing[4]};
  right: ${e=>e.theme.spacing[4]};
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.full};
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  box-shadow: ${e=>e.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.theme.colors.text.secondary};
  z-index: ${e=>e.theme.zIndex.fixed};
  opacity: ${e=>e.isActive?1:.7};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    box-shadow: ${e=>e.theme.shadows.lg};
    opacity: 1;
  }
`,rt=e=>{let{onDemoToggle:t}=e;const[r,i]=(0,o.useState)(!1),[n,s]=(0,o.useState)(new Set),l=(0,a.Zp)(),{openSearch:c}=ae(),h=[{keys:["g","h"],description:"Go to Home",action:()=>l("/"),section:"Navigation"},{keys:["g","s"],description:"Go to Sync Settings",action:()=>l("/sync"),section:"Navigation"},{keys:["g","p"],description:"Go to Profile",action:()=>l("/profile"),section:"Navigation"},{keys:["Cmd","k"],description:"Open Global Search",action:()=>c(),section:"Search"},{keys:["/"],description:"Focus Search",action:()=>c(),section:"Search"},{keys:["d"],description:"Toggle Demo Mode",action:()=>null===t||void 0===t?void 0:t(),section:"Demo"},{keys:["?"],description:"Show Keyboard Shortcuts",action:()=>i(!0),section:"Help"},{keys:["n"],description:"Add New Repository",action:()=>{const e=document.querySelector('[data-action="add-repository"]');null===e||void 0===e||e.click()},section:"Actions"}],p=(0,o.useCallback)(e=>{const t=e.key.toLowerCase(),r=e.metaKey||e.ctrlKey||e.altKey||e.shiftKey;if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)){if((e.metaKey||e.ctrlKey)&&"k"===t)return e.preventDefault(),void c();if("escape"!==t){if(!r){s(e=>new Set([...e,t]));const r=h.find(e=>1===e.keys.length&&e.keys[0].toLowerCase()===t);if(r)return e.preventDefault(),r.action(),void s(new Set);setTimeout(()=>{const r=Array.from(n);r.push(t);const o=r.join(" "),i=h.find(e=>e.keys.join(" ").toLowerCase()===o);i&&(e.preventDefault(),i.action()),s(new Set)},100)}}else i(!1)}},[n,h,c,t]),g=(0,o.useCallback)(()=>{setTimeout(()=>s(new Set),1e3)},[]);(0,o.useEffect)(()=>(document.addEventListener("keydown",p),document.addEventListener("keyup",g),()=>{document.removeEventListener("keydown",p),document.removeEventListener("keyup",g)}),[p,g]);const u=h.reduce((e,t)=>(e[t.section]||(e[t.section]=[]),e[t.section].push(t),e),{}),y=e=>({Navigation:(0,j.jsx)(d.A,{size:16}),Search:(0,j.jsx)(m.A,{size:16}),Demo:(0,j.jsx)(Pe.A,{size:16}),Help:(0,j.jsx)(He.A,{size:16}),Actions:(0,j.jsx)(De.A,{size:16})}[e]||(0,j.jsx)(Le.A,{size:16}));return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)(tt,{isActive:n.size>0,children:[(0,j.jsx)(We.A,{size:16}),n.size>0?Array.from(n).join(" "):"Press ? for shortcuts"]}),(0,j.jsx)(Be,{isVisible:r,onClick:e=>e.target===e.currentTarget&&i(!1),children:(0,j.jsxs)(Ke,{isVisible:r,children:[(0,j.jsxs)(Ye,{children:[(0,j.jsxs)(Me,{children:[(0,j.jsx)(We.A,{size:24}),"Keyboard Shortcuts"]}),(0,j.jsx)(qe,{onClick:()=>i(!1),children:(0,j.jsx)(x.A,{size:20})})]}),Object.entries(u).map(e=>{let[t,r]=e;return(0,j.jsxs)(Ve,{children:[(0,j.jsxs)(Ge,{children:[y(t),t]}),(0,j.jsx)(Je,{children:r.map((e,t)=>(0,j.jsxs)(Ze,{children:[(0,j.jsx)(Xe,{children:e.description}),(0,j.jsx)(Qe,{children:e.keys.map((e,t)=>(0,j.jsx)(et,{children:"Cmd"===e?"\u2318":"Ctrl"===e?"Ctrl":e.toUpperCase()},t))})]},t))})]},t)}),(0,j.jsxs)("div",{style:{marginTop:Se.w.spacing[6],padding:Se.w.spacing[4],background:Se.w.colors.background.secondary,borderRadius:Se.w.borderRadius.md,fontSize:Se.w.typography.fontSize.sm,color:Se.w.colors.text.secondary},children:[(0,j.jsx)("strong",{children:"Pro Tips:"}),(0,j.jsxs)("ul",{style:{margin:`${e=>e.theme.spacing[2]} 0`,paddingLeft:Se.w.spacing[4]},children:[(0,j.jsx)("li",{children:"Use sequence shortcuts like \"g h\" (press 'g' then 'h' quickly)"}),(0,j.jsx)("li",{children:"Shortcuts are disabled when typing in input fields"}),(0,j.jsx)("li",{children:"Press Escape to close any modal or overlay"})]})]})]})})]})};var ot=r(70764),it=r(73002),nt=r(85692);const at=s.i7`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,st=s.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.theme.colors.background.overlay};
  z-index: ${e=>e.theme.zIndex.modal};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  opacity: ${e=>e.isOpen?1:0};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transition: all ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
  backdrop-filter: blur(8px);
`,lt=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  box-shadow: ${e=>e.theme.shadows.xl};
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  overflow: hidden;
  transform: ${e=>e.isOpen?"scale(1)":"scale(0.9)"};
  animation: ${e=>e.isOpen?at:"none"} ${e=>e.theme.animations.duration.normal} ${e=>e.theme.animations.easing.easeOut};
`,ct=s.Ay.div`
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-bottom: 1px solid ${e=>e.theme.colors.border.light};
  background: linear-gradient(135deg, ${e=>e.theme.colors.background.primary} 0%, ${e=>e.theme.colors.background.secondary} 100%);
`,dt=s.Ay.div`
  position: relative;
  display: flex;
  align-items: center;
`,ht=s.Ay.input`
  width: 100%;
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[12]};
  border: none;
  background: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.lg};
  font-size: ${e=>e.theme.typography.fontSize.lg};
  color: ${e=>e.theme.colors.text.primary};
  outline: none;
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:focus {
    background: ${e=>e.theme.colors.background.primary};
    box-shadow: 0 0 0 2px ${e=>e.theme.colors.primary.yellow};
  }

  &::placeholder {
    color: ${e=>e.theme.colors.text.secondary};
  }
`,mt=s.Ay.div`
  position: absolute;
  left: ${e=>e.theme.spacing[4]};
  color: ${e=>e.theme.colors.text.secondary};
  pointer-events: none;
`,pt=s.Ay.button`
  position: absolute;
  right: ${e=>e.theme.spacing[4]};
  background: none;
  border: none;
  color: ${e=>e.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${e=>e.theme.spacing[2]};
  border-radius: ${e=>e.theme.borderRadius.md};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.secondary};
    color: ${e=>e.theme.colors.text.primary};
  }
`,gt=s.Ay.div`
  max-height: 50vh;
  overflow-y: auto;
`,ut=s.Ay.div`
  padding: ${e=>e.theme.spacing[2]} 0;
`,yt=s.Ay.div`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[6]};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  color: ${e=>e.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${e=>e.theme.colors.background.secondary};
`,xt=s.Ay.div`
  padding: ${e=>e.theme.spacing[3]} ${e=>e.theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[3]};
  cursor: pointer;
  background: ${e=>e.isHighlighted?Se.w.colors.background.secondary:"transparent"};
  border-left: 3px solid ${e=>e.isHighlighted?Se.w.colors.primary.yellow:"transparent"};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.background.secondary};
    border-left-color: ${e=>e.theme.colors.primary.yellow};
  }
`,ft=s.Ay.div`
  width: 32px;
  height: 32px;
  border-radius: ${e=>e.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e=>{const t={repository:`${e=>e.theme.colors.primary.yellow}20`,api:`${e=>e.theme.colors.accent.blue}20`,document:`${e=>e.theme.colors.semantic.info}20`,recent:`${e=>e.theme.colors.text.secondary}20`};return t[e.type]||t.repository}};

  svg {
    color: ${e=>{const t={repository:Se.w.colors.primary.yellow,api:Se.w.colors.accent.blue,document:Se.w.colors.semantic.info,recent:Se.w.colors.text.secondary};return t[e.type]||t.repository}};
  }
`,bt=s.Ay.div`
  flex: 1;
  min-width: 0;
`,$t=s.Ay.div`
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,wt=s.Ay.div`
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,vt=s.Ay.div`
  color: ${e=>e.theme.colors.text.secondary};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[1]};
`,kt=s.Ay.div`
  padding: ${e=>e.theme.spacing[4]} ${e=>e.theme.spacing[6]};
  border-top: 1px solid ${e=>e.theme.colors.border.light};
  background: ${e=>e.theme.colors.background.secondary};
`,St=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[2]};
  flex-wrap: wrap;
`,jt=s.Ay.button`
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  color: ${e=>e.theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
  transition: all ${e=>e.theme.animations.duration.fast} ${e=>e.theme.animations.easing.easeOut};

  &:hover {
    background: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
    border-color: ${e=>e.theme.colors.primary.yellow};
  }
`,At=s.Ay.div`
  padding: ${e=>e.theme.spacing[8]} ${e=>e.theme.spacing[6]};
  text-align: center;
  color: ${e=>e.theme.colors.text.secondary};
`,zt=e=>{let{isOpen:t,onClose:r}=e;const[i,n]=(0,o.useState)(""),[s,l]=(0,o.useState)([]),[c,d]=(0,o.useState)(0),[h,p]=(0,o.useState)([]),[g,u]=(0,o.useState)(!1),y=(0,o.useRef)(null),f=(0,a.Zp)(),b=[{id:"1",type:"repository",title:"AI Transformation Hub",description:"Central repository for AI transformation tools and APIs",url:"/repository/ai-transformation-hub"},{id:"2",type:"api",title:"User Authentication API",description:"RESTful API for user authentication and authorization",url:"/api-explorer/auth-service"},{id:"3",type:"document",title:"API Integration Guide",description:"Complete guide for integrating with EY APIs",url:"/docs/integration-guide"}];(0,o.useEffect)(()=>{if(!i.trim())return void l([]);u(!0);const e=setTimeout(()=>{const e=b.filter(e=>e.title.toLowerCase().includes(i.toLowerCase())||e.description.toLowerCase().includes(i.toLowerCase()));l(e),u(!1),d(0)},300);return()=>clearTimeout(e)},[i]),(0,o.useEffect)(()=>{const e=localStorage.getItem("recentSearches");e&&p(JSON.parse(e))},[]),(0,o.useEffect)(()=>{t&&y.current&&y.current.focus()},[t]);const $=e=>{const t=[i,...h.filter(e=>e!==i)].slice(0,5);p(t),localStorage.setItem("recentSearches",JSON.stringify(t)),f(e.url),r()},w=[{label:"Browse All Repositories",action:()=>f("/")},{label:"API Explorer",action:()=>f("/api-explorer/all")},{label:"Documentation",action:()=>f("/docs")},{label:"Add Repository",action:()=>f("/sync")}];return t?(0,j.jsx)(st,{isOpen:t,onClick:e=>e.target===e.currentTarget&&r(),children:(0,j.jsxs)(lt,{isOpen:t,children:[(0,j.jsx)(ct,{children:(0,j.jsxs)(dt,{children:[(0,j.jsx)(mt,{children:(0,j.jsx)(m.A,{size:20})}),(0,j.jsx)(ht,{ref:y,type:"text",placeholder:"Search repositories, APIs, documentation...",value:i,onChange:e=>n(e.target.value),onKeyDown:e=>{"Escape"===e.key?r():"ArrowDown"===e.key?(e.preventDefault(),d(e=>Math.min(e+1,s.length-1))):"ArrowUp"===e.key?(e.preventDefault(),d(e=>Math.max(e-1,0))):"Enter"===e.key&&(e.preventDefault(),s[c]&&$(s[c]))}}),(0,j.jsx)(pt,{onClick:r,children:(0,j.jsx)(x.A,{size:20})})]})}),(0,j.jsxs)(gt,{children:[i.trim()&&(0,j.jsx)(j.Fragment,{children:s.length>0?(0,j.jsxs)(ut,{children:[(0,j.jsx)(yt,{children:"Search Results"}),s.map((e,t)=>{return(0,j.jsxs)(xt,{isHighlighted:t===c,onClick:()=>$(e),children:[(0,j.jsx)(ft,{type:e.type,children:(r=e.type,{repository:(0,j.jsx)(ot.A,{size:16}),api:(0,j.jsx)(Pe.A,{size:16}),document:(0,j.jsx)(it.A,{size:16}),recent:(0,j.jsx)(k.A,{size:16})}[r]||(0,j.jsx)(ot.A,{size:16}))}),(0,j.jsxs)(bt,{children:[(0,j.jsx)($t,{children:e.title}),(0,j.jsx)(wt,{children:e.description})]}),(0,j.jsx)(vt,{children:(0,j.jsx)(nt.A,{size:14})})]},e.id);var r})]}):g?null:(0,j.jsxs)(At,{children:['No results found for "',i,'"',(0,j.jsx)("br",{}),(0,j.jsx)("small",{children:"Try different keywords or browse our quick actions below"})]})}),!i.trim()&&h.length>0&&(0,j.jsxs)(ut,{children:[(0,j.jsx)(yt,{children:"Recent Searches"}),h.map((e,t)=>(0,j.jsxs)(xt,{isHighlighted:!1,onClick:()=>n(e),children:[(0,j.jsx)(ft,{type:"recent",children:(0,j.jsx)(k.A,{size:16})}),(0,j.jsx)(bt,{children:(0,j.jsx)($t,{children:e})})]},t))]})]}),(0,j.jsxs)(kt,{children:[(0,j.jsx)(yt,{style:{padding:`0 0 ${e=>e.theme.spacing[3]} 0`,background:"transparent"},children:"Quick Actions"}),(0,j.jsx)(St,{children:w.map((e,t)=>(0,j.jsx)(jt,{onClick:()=>{e.action(),r()},children:e.label},t))})]})]})}):null};var Et=r(51861),Rt=r(35327),Ct=r(75969);const Tt=s.i7`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`,Nt=s.Ay.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e=>e.theme.colors.background.primary};
  padding: ${e=>e.theme.spacing[8]};
`,Ot=s.Ay.div`
  background: ${e=>e.theme.colors.background.primary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.xl};
  padding: ${e=>e.theme.spacing[12]};
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: ${e=>e.theme.shadows.xl};
  animation: ${Tt} 0.5s ease-in-out;
`,Ft=s.Ay.div`
  width: 100px;
  height: 100px;
  margin: 0 auto ${e=>e.theme.spacing[6]};
  background: linear-gradient(135deg, ${e=>e.theme.colors.semantic.error}20 0%, ${e=>e.theme.colors.semantic.error}10 100%);
  border-radius: ${e=>e.theme.borderRadius["2xl"]};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${e=>e.theme.colors.semantic.error}30;

  svg {
    color: ${e=>e.theme.colors.semantic.error};
  }
`,_t=(0,s.Ay)(y.H1)`
  color: ${e=>e.theme.colors.text.primary};
  margin-bottom: ${e=>e.theme.spacing[4]};
`,It=(0,s.Ay)(y.EY)`
  color: ${e=>e.theme.colors.text.secondary};
  margin-bottom: ${e=>e.theme.spacing[8]};
  font-size: ${e=>e.theme.typography.fontSize.lg};
  line-height: 1.6;
`,Pt=s.Ay.div`
  display: flex;
  gap: ${e=>e.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${e=>e.theme.spacing[8]};
`,Ht=(s.Ay.details`
  text-align: left;
  background: ${e=>e.theme.colors.background.secondary};
  border: 1px solid ${e=>e.theme.colors.border.light};
  border-radius: ${e=>e.theme.borderRadius.md};
  padding: ${e=>e.theme.spacing[4]};
  margin-top: ${e=>e.theme.spacing[6]};

  summary {
    cursor: pointer;
    font-weight: ${e=>e.theme.typography.fontWeight.medium};
    color: ${e=>e.theme.colors.text.primary};
    margin-bottom: ${e=>e.theme.spacing[3]};
    display: flex;
    align-items: center;
    gap: ${e=>e.theme.spacing[2]};

    &:hover {
      color: ${e=>e.theme.colors.primary.yellow};
    }
  }
`,s.Ay.pre`
  background: ${e=>e.theme.colors.primary.black};
  color: ${e=>e.theme.colors.semantic.error};
  padding: ${e=>e.theme.spacing[4]};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: ${e=>e.theme.typography.fontSize.sm};
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
`,s.Ay.div`
  font-family: ${e=>e.theme.typography.fontFamily.mono};
  font-size: ${e=>e.theme.typography.fontSize.xs};
  color: ${e=>e.theme.colors.text.secondary};
  background: ${e=>e.theme.colors.background.secondary};
  padding: ${e=>e.theme.spacing[2]} ${e=>e.theme.spacing[3]};
  border-radius: ${e=>e.theme.borderRadius.md};
  display: inline-block;
  margin-top: ${e=>e.theme.spacing[4]};
`);class Dt extends o.Component{constructor(e){super(e),this.handleReload=()=>{window.location.reload()},this.handleGoHome=()=>{window.location.href="/"},this.handleReportError=()=>{var e;const{error:t,errorInfo:r,errorId:o}=this.state,i={id:o,message:null===t||void 0===t?void 0:t.message,stack:null===t||void 0===t?void 0:t.stack,componentStack:null===r||void 0===r?void 0:r.componentStack,userAgent:navigator.userAgent,url:window.location.href,timestamp:(new Date).toISOString()};null===(e=navigator.clipboard)||void 0===e||e.writeText(JSON.stringify(i,null,2)).then(()=>{alert("Error details copied to clipboard. Please share with the development team.")}).catch(()=>{const e=window.open("","_blank");e&&e.document.write(`\n          <html>\n            <head><title>Error Report</title></head>\n            <body>\n              <h2>Error Report</h2>\n              <pre>${JSON.stringify(i,null,2)}</pre>\n            </body>\n          </html>\n        `)})},this.state={hasError:!1,error:null,errorInfo:null,errorId:""}}static getDerivedStateFromError(e){return{hasError:!0,error:e,errorId:`err-${Date.now()}-${Math.random().toString(36).substr(2,9)}`}}componentDidCatch(e,t){this.setState({error:e,errorInfo:t}),this.props.onError&&this.props.onError(e,t)}render(){var e,t;return this.state.hasError?this.props.fallback?this.props.fallback:(0,j.jsx)(Nt,{children:(0,j.jsx)(y.mc,{maxWidth:"md",children:(0,j.jsxs)(Ot,{children:[(0,j.jsx)(Ft,{children:(0,j.jsx)(Et.A,{size:48})}),(0,j.jsx)(_t,{children:"Oops! Something went wrong"}),(0,j.jsx)(It,{children:"We encountered an unexpected error while loading this page. This issue has been automatically reported to our team."}),(0,j.jsxs)(Pt,{children:[(0,j.jsxs)(Ct.$,{variant:"primary",onClick:this.handleReload,children:[(0,j.jsx)(h.A,{size:16}),"Reload Page"]}),(0,j.jsxs)(Ct.$,{variant:"outline",onClick:this.handleGoHome,children:[(0,j.jsx)(d.A,{size:16}),"Go Home"]}),(0,j.jsxs)(Ct.$,{variant:"ghost",onClick:this.handleReportError,children:[(0,j.jsx)(Rt.A,{size:16}),"Report Issue"]})]}),(0,j.jsxs)(Ht,{children:["Error ID: ",this.state.errorId]}),(0,j.jsxs)("div",{style:{background:"#fee",padding:"20px",margin:"20px 0",border:"2px solid red"},children:[(0,j.jsx)("h3",{children:"ACTUAL ERROR:"}),(0,j.jsx)("p",{style:{color:"red",fontWeight:"bold"},children:(null===(e=this.state.error)||void 0===e?void 0:e.message)||"Unknown error"}),(0,j.jsxs)("details",{children:[(0,j.jsx)("summary",{children:"Stack trace"}),(0,j.jsx)("pre",{style:{fontSize:"12px",overflow:"auto"},children:null===(t=this.state.error)||void 0===t?void 0:t.stack})]})]}),!1]})})}):this.props.children}}const Lt=Dt;"undefined"!==typeof window&&window.addEventListener("error",e=>{if(e.message.includes("button"));});const Wt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(483)]).then(r.bind(r,36483))),Ut=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(180)]).then(r.bind(r,77180))),Bt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(591)]).then(r.bind(r,89591))),Kt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(224)]).then(r.bind(r,73224))),Yt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(481)]).then(r.bind(r,85481))),Mt=(0,o.lazy)(()=>r.e(321).then(r.bind(r,41321))),qt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(593)]).then(r.bind(r,86593))),Vt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(95)]).then(r.bind(r,2095))),Gt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(743)]).then(r.bind(r,13743))),Jt=(0,o.lazy)(()=>r.e(186).then(r.bind(r,77805))),Zt=(0,o.lazy)(()=>r.e(864).then(r.bind(r,31864))),Xt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(58)]).then(r.bind(r,89058))),Qt=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(847)]).then(r.bind(r,61847))),er=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(484)]).then(r.bind(r,38484))),tr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(749)]).then(r.bind(r,7749))),rr=(0,o.lazy)(()=>Promise.all([r.e(96),r.e(372)]).then(r.bind(r,65372))),or=(0,o.lazy)(()=>r.e(451).then(r.bind(r,18451))),ir=(0,o.lazy)(()=>r.e(282).then(r.bind(r,2282))),nr=(0,o.lazy)(()=>r.e(436).then(r.bind(r,51436))),ar=()=>(0,j.jsx)(ne.Hh,{text:"Loading...",variant:"spinner"});function sr(){const[e,t]=(0,o.useState)(!0),[r,i]=(0,o.useState)(!1),{updateSyncResult:d}=(0,ie.g)(),{isSearchOpen:h,closeSearch:m}=ae();return(0,o.useEffect)(()=>{t(!1),"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(e=>{}).catch(e=>{})},[]),(0,j.jsx)(Lt,{children:(0,j.jsxs)(s.NP,{theme:l.A,children:[(0,j.jsx)(c,{}),(0,j.jsx)(n.Kd,{children:(0,j.jsxs)(P.O,{children:[(0,j.jsx)(te,{}),e&&(0,j.jsx)("div",{style:{position:"fixed",top:"64px",right:"16px",width:"384px",zIndex:1e3},children:(0,j.jsx)(oe,{onSyncComplete:e=>{d(e),e.success&&0===e.failedRepositories.length&&setTimeout(()=>t(!1),1e4)}})}),(0,j.jsx)(y.mc,{as:"main",maxWidth:"2xl",padding:"desktop",children:(0,j.jsx)(o.Suspense,{fallback:(0,j.jsx)(ar,{}),children:(0,j.jsx)(fe,{transitionType:"fade",children:(0,j.jsxs)(a.BV,{children:[(0,j.jsx)(a.qh,{path:"/login",element:(0,j.jsx)(rr,{})}),(0,j.jsx)(a.qh,{path:"/auth/callback",element:(0,j.jsx)(or,{})}),(0,j.jsx)(a.qh,{path:"/auth/success",element:(0,j.jsx)(or,{})}),(0,j.jsx)(a.qh,{path:"/auth/error",element:(0,j.jsx)(or,{})}),(0,j.jsx)(a.qh,{path:"/",element:(0,j.jsx)(me,{children:(0,j.jsx)(Wt,{})})}),(0,j.jsx)(a.qh,{path:"/profile",element:(0,j.jsx)(me,{children:(0,j.jsx)(ir,{})})}),(0,j.jsx)(a.qh,{path:"/api-keys",element:(0,j.jsx)(me,{requiredPermission:"create:api_keys",children:(0,j.jsx)(nr,{})})}),(0,j.jsx)(a.qh,{path:"/repository/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Ut,{})})}),(0,j.jsx)(a.qh,{path:"/repository/:repoName/view",element:(0,j.jsx)(me,{children:(0,j.jsx)(Bt,{})})}),(0,j.jsx)(a.qh,{path:"/docs/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Kt,{})})}),(0,j.jsx)(a.qh,{path:"/postman/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Yt,{})})}),(0,j.jsx)(a.qh,{path:"/graphql/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(qt,{})})}),(0,j.jsx)(a.qh,{path:"/grpc-playground/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Mt,{})})}),(0,j.jsx)(a.qh,{path:"/api-explorer/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Vt,{})})}),(0,j.jsx)(a.qh,{path:"/api-viewer/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Gt,{})})}),(0,j.jsx)(a.qh,{path:"/api-hub/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Jt,{})})}),(0,j.jsx)(a.qh,{path:"/sync",element:(0,j.jsx)(me,{requiredRole:H.gG.ADMIN,children:(0,j.jsx)(Zt,{})})}),(0,j.jsx)(a.qh,{path:"/api-explorer-v2/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Xt,{})})}),(0,j.jsx)(a.qh,{path:"/graphql-enhanced/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(Qt,{})})}),(0,j.jsx)(a.qh,{path:"/grpc-explorer/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(er,{})})}),(0,j.jsx)(a.qh,{path:"/postman-runner/:repoName",element:(0,j.jsx)(me,{children:(0,j.jsx)(tr,{})})})]})})})}),(0,j.jsx)(zt,{isOpen:h,onClose:m}),(0,j.jsx)(_e,{onToggle:()=>i(!r)}),(0,j.jsx)(Ie,{isActive:r,onToggle:()=>i(!r)}),(0,j.jsx)(rt,{onDemoToggle:()=>i(!r)})]})})]})})}const lr=function(){return l.A?(0,j.jsx)(ie.n,{children:(0,j.jsx)(sr,{})}):(0,j.jsx)("div",{children:"Error: Theme not loaded"})},cr=document.getElementById("root");if(!cr)throw new Error("Failed to find the root element");i.createRoot(cr).render((0,j.jsx)(o.StrictMode,{children:(0,j.jsx)(lr,{})}))},66382:(e,t,r)=>{r.d(t,{A:()=>c,O:()=>l});var o=r(65043),i=r(50122),n=r(70579);const a=(0,o.createContext)(void 0),s={id:"bypass-user",email:"demo@localhost",name:"Demo User",role:i.gG.DEVELOPER,createdAt:new Date,updatedAt:new Date},l=e=>{let{children:t}=e;const[r]=(0,o.useState)(s),[i]=(0,o.useState)(!0),[l]=(0,o.useState)(!1),c={user:r,isAuthenticated:i,isLoading:l,login:async()=>{},loginWithSSO:()=>{},logout:()=>{window.location.href="/"},hasRole:e=>!0,hasPermission:e=>!0};return(0,n.jsx)(a.Provider,{value:c,children:t})},c=()=>{const e=(0,o.useContext)(a);if(void 0===e)throw new Error("useAuth must be used within an AuthProvider");return e}},67375:(e,t,r)=>{r.d(t,{g:()=>a,n:()=>s});var o=r(65043),i=r(70579);const n=(0,o.createContext)(void 0),a=()=>{const e=(0,o.useContext)(n);if(!e)throw new Error("useSyncContext must be used within a SyncProvider");return e},s=e=>{let{children:t}=e;const[r,a]=(0,o.useState)(null),[s,l]=(0,o.useState)(0);return(0,i.jsx)(n.Provider,{value:{lastSyncResult:r,syncVersion:s,updateSyncResult:e=>{a(e),l(e=>e+1)}},children:t})}},75969:(e,t,r)=>{r.d(t,{$:()=>a});var o=r(5464);const i={primary:o.AH`
    background-color: ${e=>e.theme.colors.primary.yellow};
    color: ${e=>e.theme.colors.primary.black};
    border: 2px solid ${e=>e.theme.colors.primary.yellow};
    
    &:hover:not(:disabled) {
      background-color: ${e=>e.theme.colors.primary.black};
      color: ${e=>e.theme.colors.primary.yellow};
      border-color: ${e=>e.theme.colors.primary.black};
    }
  `,secondary:o.AH`
    background-color: ${e=>e.theme.colors.primary.black};
    color: ${e=>e.theme.colors.primary.white};
    border: 2px solid ${e=>e.theme.colors.primary.black};
    
    &:hover:not(:disabled) {
      background-color: ${e=>e.theme.colors.secondary.darkGray};
      border-color: ${e=>e.theme.colors.secondary.darkGray};
    }
  `,outline:o.AH`
    background-color: transparent;
    color: ${e=>e.theme.colors.primary.black};
    border: 2px solid ${e=>e.theme.colors.primary.black};
    
    &:hover:not(:disabled) {
      background-color: ${e=>e.theme.colors.primary.black};
      color: ${e=>e.theme.colors.primary.white};
    }
  `,ghost:o.AH`
    background-color: transparent;
    color: ${e=>e.theme.colors.primary.black};
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${e=>e.theme.colors.background.secondary};
    }
  `},n={sm:o.AH`
    height: 32px;
    padding: 0 12px;
    font-size: 0.875rem;
  `,md:o.AH`
    height: 40px;
    padding: 0 16px;
    font-size: 1rem;
  `,lg:o.AH`
    height: 48px;
    padding: 0 24px;
    font-size: 1.125rem;
  `},a=o.Ay.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${e=>e.theme.typography.fontFamily.primary};
  font-weight: ${e=>e.theme.typography.fontWeight.semibold};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${e=>{let{variant:t="primary"}=e;return i[t]}}
  ${e=>{let{size:t="md"}=e;return n[t]}}
  ${e=>{let{fullWidth:t}=e;return t&&o.AH`width: 100%;`}}
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Ripple effect on click */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.5s, opacity 0.5s;
  }
  
  &:active:not(:disabled)::after {
    transform: scale(4);
    opacity: 1;
    transition: 0s;
  }
`;(0,o.Ay)(a)`
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  
  ${e=>{let{size:t="md"}=e;return"sm"===t&&o.AH`
    width: 32px;
    height: 32px;
    padding: 0.375rem;
  `}}
  
  ${e=>{let{size:t="md"}=e;return"lg"===t&&o.AH`
    width: 48px;
    height: 48px;
    padding: 0.75rem;
  `}}
`},78229:(e,t,r)=>{r.d(t,{Hh:()=>f});r(65043);var o=r(5464),i=r(21617),n=r(70579);const a=o.i7`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,s=o.i7`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`,l=o.i7`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
`,c=o.Ay.div`
  display: inline-block;
  border-radius: 50%;
  animation: ${a} 0.8s linear infinite;
  
  ${e=>t=>{let{size:r="md",color:i=e.theme.colors.primary.yellow}=t;const n={sm:{width:"16px",height:"16px",border:"2px"},md:{width:"24px",height:"24px",border:"3px"},lg:{width:"32px",height:"32px",border:"4px"}};return o.AH`
      width: ${n[r].width};
      height: ${n[r].height};
      border: ${n[r].border} solid ${e=>e.theme.colors.border.light};
      border-top-color: ${i};
    `}}
`,d=o.Ay.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing[1]};
`,h=o.Ay.div`
  width: 8px;
  height: 8px;
  background-color: ${e=>e.theme.colors.primary.yellow};
  border-radius: 50%;
  animation: ${s} 1.4s ease-in-out infinite;
  animation-delay: ${e=>{let{delay:t}=e;return t}}s;
`,m=()=>(0,n.jsxs)(d,{children:[(0,n.jsx)(h,{delay:0}),(0,n.jsx)(h,{delay:.2}),(0,n.jsx)(h,{delay:.4})]}),p=o.Ay.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing[.5]};
  align-items: flex-end;
  height: 24px;
`,g=o.Ay.div`
  width: 4px;
  height: 100%;
  background-color: ${e=>e.theme.colors.primary.yellow};
  animation: ${l} 1.2s ease-in-out infinite;
  animation-delay: ${e=>{let{delay:t}=e;return t}}s;
`,u=()=>(0,n.jsxs)(p,{children:[(0,n.jsx)(g,{delay:0}),(0,n.jsx)(g,{delay:.1}),(0,n.jsx)(g,{delay:.2}),(0,n.jsx)(g,{delay:.3}),(0,n.jsx)(g,{delay:.4})]}),y=o.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${e=>{let{$blur:t}=e;return t?i.w.colors.background.overlay:i.w.colors.background.primary}};
  z-index: ${e=>e.theme.zIndex.modal};
  
  ${e=>{let{$blur:t}=e;return t&&o.AH`
    backdrop-filter: blur(4px);
  `}}
`,x=o.Ay.p`
  margin-top: ${e=>e.theme.spacing[4]};
  font-size: ${e=>e.theme.typography.fontSize.lg};
  color: ${e=>e.theme.colors.text.secondary};
  font-weight: ${e=>e.theme.typography.fontWeight.medium};
`,f=e=>{let{text:t="Loading...",blur:r=!1,variant:o="spinner"}=e;return(0,n.jsxs)(y,{$blur:r,children:["spinner"===o&&(0,n.jsx)(c,{size:"lg"}),"dots"===o&&(0,n.jsx)(m,{}),"bars"===o&&(0,n.jsx)(u,{}),t&&(0,n.jsx)(x,{children:t})]})},b=o.i7`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;o.Ay.div`
  width: ${e=>{let{width:t="100%"}=e;return t}};
  height: ${e=>{let{height:t="20px"}=e;return t}};
  border-radius: ${e=>{let{radius:t="md"}=e;return i.w.borderRadius[t]}};
  background: linear-gradient(
    90deg,
    ${e=>e.theme.colors.background.secondary} 25%,
    ${e=>e.theme.colors.border.light} 50%,
    ${e=>e.theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  animation: ${b} 1.5s ease-in-out infinite;
`,o.Ay.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing[2]};
`,o.Ay.div`
  width: 100%;
  height: ${e=>{let{height:t="8px"}=e;return t}};
  background-color: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${e=>{let{progress:t}=e;return`${t}%`}};
    background-color: ${e=>e.theme.colors.primary.yellow};
    transition: width 0.3s ease;
    border-radius: ${e=>e.theme.borderRadius.full};
  }
`},79204:(e,t,r)=>{r.d(t,{t:()=>o});const o=new class{constructor(){this.syncStatus={isInProgress:!1,totalRepositories:0,completedRepositories:0,errors:[]}}async startSync(e){try{const t=await fetch("/api/repository/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({limit:e})});if(!t.ok)throw new Error("Sync failed");return await t.json()}catch(t){throw new Error(`Sync error: ${t instanceof Error?t.message:"Unknown error"}`)}}async syncOnStartup(){try{const e=await fetch("/api/repository/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});if(!e.ok){const t=await e.text();throw new Error(`Startup sync failed: ${t}`)}return await e.json()}catch(e){return{success:!1,syncedRepositories:[],failedRepositories:[],totalTime:0,timestamp:new Date}}}async getSyncStatus(){try{const e=await fetch("/api/repository/sync/status");if(!e.ok)return this.syncStatus;const t=await e.json();return this.syncStatus=t,t}catch(e){return this.syncStatus}}async cloneRepository(e){try{if(!(await fetch(`/api/repository/clone/${e}`,{method:"POST"})).ok)throw new Error("Clone failed")}catch(t){throw new Error(`Clone error: ${t instanceof Error?t.message:"Unknown error"}`)}}async updateRepositoryMetadata(e){try{if(!(await fetch(`/api/repository/metadata/${e}`,{method:"PUT"})).ok)throw new Error("Metadata update failed")}catch(t){throw new Error(`Metadata update error: ${t instanceof Error?t.message:"Unknown error"}`)}}getLastSyncInfo(){try{const e=localStorage.getItem("lastSyncInfo");if(e){const t=JSON.parse(e);return{timestamp:t.timestamp?new Date(t.timestamp):void 0,result:t.result}}}catch(e){}return{}}saveLastSyncInfo(e){try{localStorage.setItem("lastSyncInfo",JSON.stringify({timestamp:new Date,result:e}))}catch(t){}}}}},t={};function r(o){var i=t[o];if(void 0!==i)return i.exports;var n=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.loaded=!0,n.exports}r.m=e,r.amdO={},(()=>{var e=[];r.O=(t,o,i,n)=>{if(!o){var a=1/0;for(d=0;d<e.length;d++){o=e[d][0],i=e[d][1],n=e[d][2];for(var s=!0,l=0;l<o.length;l++)(!1&n||a>=n)&&Object.keys(r.O).every(e=>r.O[e](o[l]))?o.splice(l--,1):(s=!1,n<a&&(a=n));if(s){e.splice(d--,1);var c=i();void 0!==c&&(t=c)}}return t}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[o,i,n]}})(),r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(o,i){if(1&i&&(o=this(o)),8&i)return o;if("object"===typeof o&&o){if(4&i&&o.__esModule)return o;if(16&i&&"function"===typeof o.then)return o}var n=Object.create(null);r.r(n);var a={};e=e||[null,t({}),t([]),t(t)];for(var s=2&i&&o;("object"==typeof s||"function"==typeof s)&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach(e=>a[e]=()=>o[e]);return a.default=()=>o,r.d(n,a),n}})(),r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce((t,o)=>(r.f[o](e,t),t),[])),r.u=e=>"static/js/"+e+"."+{58:"95973d2a",95:"5ec98220",180:"a8f75c83",186:"453f0e3d",224:"cad57d44",282:"d69edf94",321:"7461cd2c",372:"fb3348a6",436:"8f8714e2",451:"37b904d9",481:"6b9372cd",483:"552df09d",484:"1150f3ba",533:"e73637ee",591:"5965105e",593:"22289580",614:"24c7f97a",743:"8092420b",749:"b11a3267",847:"016c4e5d",864:"3d6af667",914:"5f7dc0d4"}[e]+".chunk.js",r.miniCssF=e=>"static/css/"+e+".4484b679.chunk.css",r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={},t="eyns-ai-experience-center:";r.l=(o,i,n,a)=>{if(e[o])e[o].push(i);else{var s,l;if(void 0!==n)for(var c=document.getElementsByTagName("script"),d=0;d<c.length;d++){var h=c[d];if(h.getAttribute("src")==o||h.getAttribute("data-webpack")==t+n){s=h;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,r.nc&&s.setAttribute("nonce",r.nc),s.setAttribute("data-webpack",t+n),s.src=o),e[o]=[i];var m=(t,r)=>{s.onerror=s.onload=null,clearTimeout(p);var i=e[o];if(delete e[o],s.parentNode&&s.parentNode.removeChild(s),i&&i.forEach(e=>e(r)),t)return t(r)},p=setTimeout(m.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=m.bind(null,s.onerror),s.onload=m.bind(null,s.onload),l&&document.head.appendChild(s)}}})(),r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),r.p="/",(()=>{if("undefined"!==typeof document){var e=e=>new Promise((t,o)=>{var i=r.miniCssF(e),n=r.p+i;if(((e,t)=>{for(var r=document.getElementsByTagName("link"),o=0;o<r.length;o++){var i=(a=r[o]).getAttribute("data-href")||a.getAttribute("href");if("stylesheet"===a.rel&&(i===e||i===t))return a}var n=document.getElementsByTagName("style");for(o=0;o<n.length;o++){var a;if((i=(a=n[o]).getAttribute("data-href"))===e||i===t)return a}})(i,n))return t();((e,t,o,i,n)=>{var a=document.createElement("link");a.rel="stylesheet",a.type="text/css",r.nc&&(a.nonce=r.nc),a.onerror=a.onload=r=>{if(a.onerror=a.onload=null,"load"===r.type)i();else{var o=r&&r.type,s=r&&r.target&&r.target.href||t,l=new Error("Loading CSS chunk "+e+" failed.\n("+o+": "+s+")");l.name="ChunkLoadError",l.code="CSS_CHUNK_LOAD_FAILED",l.type=o,l.request=s,a.parentNode&&a.parentNode.removeChild(a),n(l)}},a.href=t,o?o.parentNode.insertBefore(a,o.nextSibling):document.head.appendChild(a)})(e,n,null,t,o)}),t={792:0};r.f.miniCss=(r,o)=>{t[r]?o.push(t[r]):0!==t[r]&&{224:1}[r]&&o.push(t[r]=e(r).then(()=>{t[r]=0},e=>{throw delete t[r],e}))}}})(),(()=>{var e={792:0};r.f.j=(t,o)=>{var i=r.o(e,t)?e[t]:void 0;if(0!==i)if(i)o.push(i[2]);else{var n=new Promise((r,o)=>i=e[t]=[r,o]);o.push(i[2]=n);var a=r.p+r.u(t),s=new Error;r.l(a,o=>{if(r.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var n=o&&("load"===o.type?"missing":o.type),a=o&&o.target&&o.target.src;s.message="Loading chunk "+t+" failed.\n("+n+": "+a+")",s.name="ChunkLoadError",s.type=n,s.request=a,i[1](s)}},"chunk-"+t,t)}},r.O.j=t=>0===e[t];var t=(t,o)=>{var i,n,a=o[0],s=o[1],l=o[2],c=0;if(a.some(t=>0!==e[t])){for(i in s)r.o(s,i)&&(r.m[i]=s[i]);if(l)var d=l(r)}for(t&&t(o);c<a.length;c++)n=a[c],r.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return r.O(d)},o=self.webpackChunkeyns_ai_experience_center=self.webpackChunkeyns_ai_experience_center||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})(),r.nc=void 0;var o=r.O(void 0,[644,96],()=>r(58846));o=r.O(o)})();
//# sourceMappingURL=main.443e123d.js.map