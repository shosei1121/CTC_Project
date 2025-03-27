import{i as f,g as u,c as p,f as g,a as y,d as h,u as d}from"./local-storage-BFjGCbUB.js";import{c as v,s as E,u as w}from"./navigation-CvC7EUiU.js";import{c as L}from"./web3-auth-BjYWAgWj.js";async function M(){if(!await v()){window.location.href="/src/pages/auth.html";return}f(),E(),w()}M();async function l(){try{const t=await u();if(!t)return;const e={name:document.getElementById("profileName"),email:document.getElementById("profileEmail"),points:document.getElementById("userPoints"),avatar:document.getElementById("profileAvatar")};e.name&&(e.name.textContent=t.username||"ユーザー名未設定"),e.email&&(e.email.textContent=t.email),e.points&&(e.points.textContent=t.points.toLocaleString()),e.avatar&&(e.avatar.src=t.avatar_url||"https://api.dicebear.com/7.x/avataaars/svg?seed=default");const n=document.getElementById("connectMetamaskBtn");n&&(t.wallet_address?(n.textContent="MetaMask連携済み",n.disabled=!0):n.addEventListener("click",C))}catch(t){console.error("Error loading profile:",t)}}function k(){const t=document.getElementById("profileAvatar"),e=document.getElementById("avatarInput"),n=document.getElementById("editAvatarModal"),a=n.querySelector(".close-btn"),s=document.getElementById("avatarPreview"),o=document.getElementById("saveAvatarBtn");t==null||t.addEventListener("click",()=>{n.style.display="block"}),a==null||a.addEventListener("click",()=>{n.style.display="none",s.src="",e.value=""}),e==null||e.addEventListener("change",i=>{const r=i.target.files[0];if(r){if(r.size>5*1024*1024){alert("画像サイズは5MB以下にしてください。"),e.value="";return}if(!r.type.startsWith("image/")){alert("画像ファイルを選択してください。"),e.value="";return}const c=new FileReader;c.onload=m=>{s.src=m.target.result,o.disabled=!1},c.readAsDataURL(r)}}),o==null||o.addEventListener("click",async()=>{if(e.files[0])try{const r=s.src;await d({avatar_url:r}),t&&(t.src=r),n.style.display="none",e.value="",o.disabled=!0}catch(r){console.error("Error updating avatar:",r),alert("アバターの更新に失敗しました。")}})}async function I(){try{const t=await p(),e=document.getElementById("nftGrid");if(!e)return;t&&t.length>0?e.innerHTML=t.map(n=>`
                <div class="nft-card">
                    <img src="${n.products.image_url}" alt="${n.products.name}" class="nft-image">
                    <div class="nft-info">
                        <h3 class="nft-name">${n.products.name}</h3>
                        <p class="nft-date">購入日: ${new Date(n.purchased_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join(""):e.innerHTML='<p class="no-data">所有しているNFTはありません</p>'}catch(t){console.error("Error loading NFTs:",t);const e=document.getElementById("nftGrid");e&&(e.innerHTML='<p class="error-message">NFTの読み込みに失敗しました</p>')}}async function B(){try{const t=await g(),e=document.getElementById("likedNftGrid");if(!e)return;const n=t.filter(a=>localStorage.getItem(`like_${a.id}`)==="true");n.length>0?e.innerHTML=n.map(a=>`
                <div class="nft-card" onclick="window.location.href='/src/pages/product-detail.html?id=${a.id}'">
                    <img src="${a.image_url}" alt="${a.name}" class="nft-image">
                    <div class="nft-info">
                        <h3 class="nft-name">${a.name}</h3>
                        <p class="nft-location">📍 ${a.location}</p>
                        <p class="nft-price">¥${a.price.toLocaleString()}</p>
                    </div>
                </div>
            `).join(""):e.innerHTML='<p class="no-data">いいねしたNFTはありません</p>'}catch(t){console.error("Error loading liked NFTs:",t);const e=document.getElementById("likedNftGrid");e&&(e.innerHTML='<p class="error-message">いいねしたNFTの読み込みに失敗しました</p>')}}async function $(){try{const t=await y(),e=document.getElementById("followedChannels");if(!e)return;const n=t.filter(a=>localStorage.getItem(`follow_${a.id}`)==="true");n.length>0?e.innerHTML=n.map(a=>`
                <div class="followed-channel-card" onclick="window.location.href='/src/pages/market.html?channel=${a.id}'">
                    <img src="${a.image_url}" alt="${a.name}" class="channel-image">
                    <div class="channel-info">
                        <h3 class="channel-name">${a.name}</h3>
                        <p class="channel-location">📍 ${a.location}</p>
                        <p class="channel-description">${a.description}</p>
                        <div class="channel-stats">
                            <span class="stat-item">❤️ ${a.likes.toLocaleString()}</span>
                            <span class="stat-item">🌾 ${a.farming_style}</span>
                        </div>
                    </div>
                </div>
            `).join(""):e.innerHTML='<p class="no-data">フォロー中の生産者はいません</p>'}catch(t){console.error("Error loading followed channels:",t);const e=document.getElementById("followedChannels");e&&(e.innerHTML='<p class="error-message">フォロー中の生産者の読み込みに失敗しました</p>')}}async function T(){try{const t=await h(),e=document.getElementById("historyList");if(!e)return;t&&t.length>0?e.innerHTML=t.map(n=>`
                <div class="history-item">
                    <div class="history-details">
                        <h3 class="history-title">${n.description}</h3>
                        <p class="history-date">${new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    <div class="history-amount ${n.type==="point"?"points":"money"}">
                        ${n.type==="point"?"🏆":"💰"} ${n.amount.toLocaleString()}
                    </div>
                </div>
            `).join(""):e.innerHTML='<p class="no-data">取引履歴はありません</p>'}catch(t){console.error("Error loading transactions:",t);const e=document.getElementById("historyList");e&&(e.innerHTML='<p class="error-message">取引履歴の読み込みに失敗しました</p>')}}function N(){const t=document.getElementById("editNameBtn"),e=document.getElementById("editProfileModal"),n=document.getElementById("editProfileForm"),a=e.querySelector(".close-btn");t==null||t.addEventListener("click",()=>{const s=document.getElementById("profileName").textContent;document.getElementById("editUsername").value=s,e.style.display="block"}),a==null||a.addEventListener("click",()=>{e.style.display="none"}),n==null||n.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("editUsername").value;try{await d({username:o}),await l(),e.style.display="none"}catch(i){console.error("Error updating profile:",i),alert("プロフィールの更新に失敗しました。")}})}async function C(){try{await L(),await l()}catch(t){console.error("MetaMask connection error:",t),alert("MetaMaskとの連携に失敗しました。")}}document.addEventListener("DOMContentLoaded",async()=>{try{await Promise.all([l(),I(),B(),$(),T()]),N(),k()}catch(t){console.error("Error initializing mypage:",t)}});
//# sourceMappingURL=mypage-C8V2B5mP.js.map
