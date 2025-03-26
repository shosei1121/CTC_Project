import{j as r}from"./local-storage-Bd1VrlsT.js";async function c(){if(!window.ethereum)throw new Error("MetaMaskがインストールされていません。");try{const e=(await window.ethereum.request({method:"eth_requestAccounts"}))[0],a=`CTCアプリケーションへようこそ!

この署名により、あなたのウォレットを認証します。

アドレス: ${e}
時間: ${new Date().toISOString()}`,s=await window.ethereum.request({method:"personal_sign",params:[a,e]}),{user:o}=await r({email:`${e.toLowerCase()}@wallet.eth`,password:s.slice(0,20),options:{data:{wallet_address:e.toLowerCase(),auth_type:"metamask"}}});return o}catch(t){throw console.error("MetaMask認証エラー:",t),t}}export{c};
