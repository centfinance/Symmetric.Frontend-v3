var l=Object.defineProperty;var d=(t,a,e)=>a in t?l(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var i=(t,a,e)=>(d(t,typeof a!="symbol"?a+"":a,e),e);import{ai as u,aj as h}from"./connector-16147cef.js";import"./runtime-core.esm-bundler-558f8953.js";import"./_commonjsHelpers-87174ba5.js";const M=["isRabby","isBraveWallet","isTrustWallet","isLedgerConnect"],p=()=>{var t;return Boolean(((t=window.ethereum)==null?void 0:t.isMetaMask)&&!M.some(a=>{var e;return(e=window.ethereum)==null?void 0:e[a]}))};function c(){var e,s;const t=window.ethereum;let a=t||((e=window.web3)==null?void 0:e.currentProvider);return(s=t==null?void 0:t.providers)!=null&&s.length&&t.providers.forEach(n=>{n.isMetaMask&&(a=n)}),a}function I(){return!!c()}class f extends u{constructor(){super(...arguments);i(this,"id",h.InjectedMetaMask)}async connect(){const e=c();let s=!1;if(e){this.provider=e,this.active.value=!0;let n=null,r=null;try{e.request&&(n=await e.request({method:"eth_requestAccounts"}),r=await e.request({method:"eth_chainId"}))}catch(o){o.code===4001?(s=!0,console.log("Please connect to MetaMask.")):console.error(o)}if(!n&&!s){const o=await e.enable();n=(o==null?void 0:o.result)||o}n&&r&&(this.handleChainChanged(r),this.handleAccountsChanged(n))}else console.error("Tried to connect to MetaMask but it was not detected. Please install MetaMask.");return{provider:e,account:this.account,chainId:this.chainId}}}const g=typeof f;export{f as MetamaskConnector,g as MetamaskConnectorType,c as getInjectedProvider,p as getIsMetaMaskWallet,I as hasInjectedProvider};
//# sourceMappingURL=metamask.connector-0225016b.js.map
