var f=Object.defineProperty;var v=(u,t,e)=>t in u?f(u,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[t]=e;var o=(u,t,e)=>(v(u,typeof t!="symbol"?t+"":t,e),e);import{Q as y,o as i,T as d}from"./connector-16147cef.js";import{b0 as M,aP as l,b1 as g,aT as m,b5 as h,aJ as k,b2 as c}from"./BalBtn-cca6788c.js";const b=[{name:"Deposit",inputs:[{name:"provider",type:"address",indexed:!0},{name:"value",type:"uint256",indexed:!1}],anonymous:!1,type:"event"},{name:"Withdraw",inputs:[{name:"provider",type:"address",indexed:!0},{name:"value",type:"uint256",indexed:!1}],anonymous:!1,type:"event"},{name:"UpdateLiquidityLimit",inputs:[{name:"user",type:"address",indexed:!0},{name:"original_balance",type:"uint256",indexed:!1},{name:"original_supply",type:"uint256",indexed:!1},{name:"working_balance",type:"uint256",indexed:!1},{name:"working_supply",type:"uint256",indexed:!1}],anonymous:!1,type:"event"},{name:"Transfer",inputs:[{name:"_from",type:"address",indexed:!0},{name:"_to",type:"address",indexed:!0},{name:"_value",type:"uint256",indexed:!1}],anonymous:!1,type:"event"},{name:"Approval",inputs:[{name:"_owner",type:"address",indexed:!0},{name:"_spender",type:"address",indexed:!0},{name:"_value",type:"uint256",indexed:!1}],anonymous:!1,type:"event"},{stateMutability:"nonpayable",type:"constructor",inputs:[{name:"minter",type:"address"},{name:"veBoostProxy",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"deposit",inputs:[{name:"_value",type:"uint256"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"deposit",inputs:[{name:"_value",type:"uint256"},{name:"_addr",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"deposit",inputs:[{name:"_value",type:"uint256"},{name:"_addr",type:"address"},{name:"_claim_rewards",type:"bool"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"withdraw",inputs:[{name:"_value",type:"uint256"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"withdraw",inputs:[{name:"_value",type:"uint256"},{name:"_claim_rewards",type:"bool"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"claim_rewards",inputs:[],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"claim_rewards",inputs:[{name:"_addr",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"claim_rewards",inputs:[{name:"_addr",type:"address"},{name:"_receiver",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"transferFrom",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"transfer",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"approve",inputs:[{name:"_spender",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"permit",inputs:[{name:"_owner",type:"address"},{name:"_spender",type:"address"},{name:"_value",type:"uint256"},{name:"_deadline",type:"uint256"},{name:"_v",type:"uint8"},{name:"_r",type:"bytes32"},{name:"_s",type:"bytes32"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"increaseAllowance",inputs:[{name:"_spender",type:"address"},{name:"_added_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"decreaseAllowance",inputs:[{name:"_spender",type:"address"},{name:"_subtracted_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"user_checkpoint",inputs:[{name:"addr",type:"address"}],outputs:[{name:"",type:"bool"}]},{stateMutability:"nonpayable",type:"function",name:"set_rewards_receiver",inputs:[{name:"_receiver",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"kick",inputs:[{name:"addr",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"deposit_reward_token",inputs:[{name:"_reward_token",type:"address"},{name:"_amount",type:"uint256"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"add_reward",inputs:[{name:"_reward_token",type:"address"},{name:"_distributor",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"set_reward_distributor",inputs:[{name:"_reward_token",type:"address"},{name:"_distributor",type:"address"}],outputs:[]},{stateMutability:"nonpayable",type:"function",name:"set_killed",inputs:[{name:"_is_killed",type:"bool"}],outputs:[]},{stateMutability:"view",type:"function",name:"claimed_reward",inputs:[{name:"_addr",type:"address"},{name:"_token",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"claimable_reward",inputs:[{name:"_user",type:"address"},{name:"_reward_token",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"claimable_reward_write",inputs:[{name:"_addr",type:"address"},{name:"_token",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"claimable_tokens",inputs:[{name:"addr",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"integrate_checkpoint",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"future_epoch_time",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"inflation_rate",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"decimals",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"version",inputs:[],outputs:[{name:"",type:"string"}]},{stateMutability:"view",type:"function",name:"allowance",inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"nonpayable",type:"function",name:"initialize",inputs:[{name:"_lp_token",type:"address"}],outputs:[]},{stateMutability:"view",type:"function",name:"balanceOf",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"totalSupply",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"name",inputs:[],outputs:[{name:"",type:"string"}]},{stateMutability:"view",type:"function",name:"symbol",inputs:[],outputs:[{name:"",type:"string"}]},{stateMutability:"view",type:"function",name:"DOMAIN_SEPARATOR",inputs:[],outputs:[{name:"",type:"bytes32"}]},{stateMutability:"view",type:"function",name:"nonces",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"factory",inputs:[],outputs:[{name:"",type:"address"}]},{stateMutability:"view",type:"function",name:"lp_token",inputs:[],outputs:[{name:"",type:"address"}]},{stateMutability:"view",type:"function",name:"is_killed",inputs:[],outputs:[{name:"",type:"bool"}]},{stateMutability:"view",type:"function",name:"reward_count",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"reward_data",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"tuple",components:[{name:"token",type:"address"},{name:"distributor",type:"address"},{name:"period_finish",type:"uint256"},{name:"rate",type:"uint256"},{name:"last_update",type:"uint256"},{name:"integral",type:"uint256"}]}]},{stateMutability:"view",type:"function",name:"rewards_receiver",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"address"}]},{stateMutability:"view",type:"function",name:"reward_integral_for",inputs:[{name:"arg0",type:"address"},{name:"arg1",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"working_balances",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"working_supply",inputs:[],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"integrate_inv_supply_of",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"integrate_checkpoint_of",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"integrate_fraction",inputs:[{name:"arg0",type:"address"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"period",inputs:[],outputs:[{name:"",type:"int128"}]},{stateMutability:"view",type:"function",name:"reward_tokens",inputs:[{name:"arg0",type:"uint256"}],outputs:[{name:"",type:"address"}]},{stateMutability:"view",type:"function",name:"period_timestamp",inputs:[{name:"arg0",type:"uint256"}],outputs:[{name:"",type:"uint256"}]},{stateMutability:"view",type:"function",name:"integrate_inv_supply",inputs:[{name:"arg0",type:"uint256"}],outputs:[{name:"",type:"uint256"}]}],_=8;class w{constructor(t,e=l.jsonProvider,n=b,s=y,a=g){o(this,"instance");this.address=t,this.provider=e,this.abi=n,this.config=s,this.walletService=a;const p=M();this.instance=new p(this.address,this.abi,this.provider)}async stake(t){return await this.walletService.txBuilder.contract.sendTransaction({contractAddress:this.address,abi:this.abi,action:"deposit(uint256)",params:[t]})}async unstake(t){return await this.walletService.txBuilder.contract.sendTransaction({contractAddress:this.address,abi:this.abi,action:"withdraw(uint256)",params:[t]})}async balance(t){return this.instance.balanceOf(i(t))}async totalSupply(){const t=await this.instance.totalSupply();return m(t,18)}async claimRewards(){return await this.walletService.txBuilder.contract.sendTransaction({contractAddress:this.address,abi:this.abi,action:"claim_rewards()"})}async checkpointUser(t){const{userAddress:e,signer:n}=t;return await new h(n).contract.sendTransaction({contractAddress:this.address,abi:this.abi,action:"user_checkpoint",params:[e]})}async workingSupplies(t){const e=this.getMulticaller();for(const a of t)e.call(a,this.address,"working_supply");const n=await e.execute();return d.mapValues(n,a=>m(a,18))}async rewardData(t){return this.instance.reward_data(i(t))}async getRewardTokens(){const t=this.getMulticaller();for(let n=0;n<_;n++)t.call(this.address,this.address,"reward_tokens",[n]);return await t.execute()}static async getRewardTokensForGauges(t){const e=w.getMulticaller();t.forEach(s=>{for(let a=0;a<_;a++)e.call(`${i(s)}.[${a}]`,i(s),"reward_tokens",[a])});const n=await e.execute();return d.mapValues(n,s=>s.filter(a=>a!==k))}static async getRewardTokenDataForGauges(t){const e=this.getMulticaller();for(const s of Object.keys(t)){const a=i(s);for(const p of t[s]){const r=i(p);e.call(`${a}.${r}`,a,"reward_data",[r])}}return await e.execute()}getMulticaller(){const t=c();return new t(this.config.network.key,this.provider,this.abi)}static getMulticaller(t){const e=c();return new e(y.network.key,t||l.jsonProvider,b)}}export{w as L};
//# sourceMappingURL=liquidity-gauge-c56bdf84.js.map
