import{_ as U}from"./BalLink-65772d8f.js";import{_ as W}from"./BalStack.vue_vue_type_script_lang-342e535e.js";import{au as z,aS as D,av as V,aq as E,aU as w,b6 as G,aT as H,bn as M}from"./BalBtn-cca6788c.js";import{_ as O}from"./BalTable.vue_vue_type_style_index_0_lang-26788def.js";import{B as P}from"./BalAsset-fcab7531.js";import{at as x,Z as v,T as Q,Q as Z,i as J}from"./connector-16147cef.js";import{u as K}from"./useBreakpoints-ee2a85bc.js";import{v as C}from"./vault.service-8fdea290.js";import{_ as R}from"./TxActionBtn.vue_vue_type_script_setup_true_lang-663c84ee.js";import{d as $,r as b,ap as X,C as Y,b as T,c as ee,l as i,j as s,q as u,v as k,z as f,p as ae,A as y}from"./runtime-core.esm-bundler-558f8953.js";import"./_plugin-vue_export-helper-c27b6911.js";import"./useDarkMode-6a81be08.js";import"./browser-6c45db04.js";import"./_commonjsHelpers-87174ba5.js";import"./metamask.connector-0225016b.js";import"./Avatar.vue_vue_type_script_setup_true_lang-5ab9890e.js";import"./index-18b6daea.js";import"./useTransactions-114fc9d7.js";import"./index-fe1d1633.js";import"./events-5f626723.js";import"./readable-browser-a0df197a.js";import"./immutable-2b056f5a.js";import"./index-1de0572e.js";const te={class:"flex items-center py-4 px-6"},ne={class:"ml-2"},se={class:"flex justify-end py-4 px-6"},oe=$({__name:"InternalBalancesTable",setup(A){const o=b([]),l=b(!0),{t:c}=z(),{upToLargeBreakpoint:d}=K(),{fNum:h}=D(),{priceFor:S,getToken:q,tokens:L}=V(),{account:p}=E();function F(e){const a=o.value.find(_=>_.address===e),n=G((a==null?void 0:a.balance)||"0",a==null?void 0:a.decimals).toString();return()=>C.manageUserBalance({kind:1,asset:e,amount:n,sender:p.value,recipient:p.value})}async function g(){const e=Object.keys(L.value),m=await C.getInternalBalance(p.value,e),a=e.map((n,_)=>{const t=q(n),r=H(m[_],t.decimals),B=S(n),j=v(r).times(B).toString();return v(r).lte(0)||!t.decimals&&!t.name&&!t.symbol?null:{...t,balance:r,price:B,value:j}}).filter(n=>n);o.value=Q.orderBy(a,["value","balance"],["desc","desc"])}function N(e){const m=Z.network.tokens.DisableInternalBalanceWithdrawals;return!!m&&J(m,e)}X(async()=>{p.value?x(g,l):l.value=!1}),Y(p,async e=>{e?x(g,l):(o.value=[],l.value=!1)});const I=b([{name:"Token",id:"token",accessor:"token",Cell:"tokenColumnCell",width:475,noGrow:!0},{name:c("balance"),id:"Balance",align:"right",width:150,accessor:({balance:e})=>`${h(e,w.token)}`},{name:c("value"),id:"value",align:"right",width:150,accessor:({value:e})=>v(e).eq(0)?"-":h(e,w.fiat)},{name:"",id:"withdraw",align:"right",accessor:"withdraw",Cell:"withdrawColumnCell",width:150}]);return(e,m)=>{const a=P,n=O,_=M;return T(),ee(_,{shadow:"lg",square:f(d),noBorder:f(d),noPad:""},{default:i(()=>[s(n,{columns:I.value,data:o.value,skeletonClass:"h-64",square:f(d),isLoading:l.value},{tokenColumnCell:i(({symbol:t,address:r})=>[u("div",te,[s(a,{address:r},null,8,["address"]),u("span",ne,k(t),1)])]),withdrawColumnCell:i(({address:t,value:r})=>[u("div",se,[s(R,{label:e.$t("transactionAction.withdraw"),color:"gradient",size:"sm",actionFn:F(t),action:"withdraw",summary:e.$t("transactionSummary.withdrawFromBalance",[f(h)(r,f(w).fiat)]),confirmingLabel:`${e.$t("withdrawing")}...`,disabled:N(t),onConfirmed:g},null,8,["label","actionFn","summary","confirmingLabel","disabled"])])]),_:1},8,["columns","data","square","isLoading"])]),_:1},8,["square","noBorder"])}}}),re={class:"xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto"},ie={class:"px-4 xl:px-0"},le={class:"px-4 lg:px-0 mt-4 max-w-3xl text-sm text-gray-500"},Fe=$({__name:"balances",setup(A){return(o,l)=>{const c=W,d=U;return T(),ae("div",re,[s(c,{vertical:""},{default:i(()=>[u("div",ie,[s(c,{horizontal:"",justify:"between",align:"center"},{default:i(()=>[u("h3",null,k(o.$t("pages.balances.title")),1)]),_:1})]),s(c,{vertical:"",spacing:"2xl"},{default:i(()=>[s(oe)]),_:1}),u("p",le,[y(k(o.$t("pages.balances.eulerHack"))+" ",1),s(d,{href:"https://redemptions.euler.finance/",external:""},{default:i(()=>[y("https://redemptions.euler.finance/")]),_:1})])]),_:1})])}}});export{Fe as default};
//# sourceMappingURL=balances-7f4a3449.js.map
