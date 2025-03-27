import{i as v,f as g,a as p,b as u,g as $}from"./local-storage-BFjGCbUB.js";/* empty css               */import{c as y,s as L,u as w}from"./navigation-CvC7EUiU.js";async function E(){if(!await y()){window.location.href="/src/pages/auth.html";return}v(),L(),w()}E();document.addEventListener("DOMContentLoaded",async()=>{let l=null;const n=new URLSearchParams(window.location.search).get("channel");async function f(){l=await $();const t=document.getElementById("currentPoints");l&&t&&(t.textContent=l.points.toLocaleString())}async function c(t){const e=document.getElementById("productGrid");e&&(e.innerHTML=t.map(a=>`
            <div class="product-card ${a.sold?"sold":""}" data-id="${a.id}">
                <div class="favorite-btn" data-product-id="${a.id}">❤️</div>
                <img src="${a.image_url}" alt="${a.name}" class="product-image">
                <div class="product-info">
                    <p class="product-location">📍 ${a.location}</p>
                    <h3 class="product-name">${a.name}</h3>
                    <div class="product-rating">
                        <span class="stars">⭐️ ${a.rating}</span>
                        <span class="sales">販売数: ${a.sales}</span>
                    </div>
                    <p class="product-price">
                        ${a.sold?'<span class="sold-label">SOLD OUT</span>':`¥${a.price.toLocaleString()}`}
                    </p>
                </div>
            </div>
        `).join(""),e.querySelectorAll(".product-card").forEach(a=>{a.addEventListener("click",s=>{if(s.target.classList.contains("favorite-btn")){s.preventDefault();return}const i=a.dataset.id;window.location.href=`/src/pages/product-detail.html?id=${i}`})}))}async function h(){const t=await p(),e=document.querySelector(".channel-list"),a=document.getElementById("marketHome");!e||!a||(n?a.style.display="none":(a.style.display="block",e.innerHTML=t.map(s=>`
                <a href="/src/pages/market.html?channel=${s.id}" class="channel-item">
                    <div class="channel-avatar">
                        <img src="${s.image_url}" alt="${s.name}">
                        ${s.is_live?'<span class="live-badge">LIVE</span>':""}
                    </div>
                    <p class="channel-name">${s.name}</p>
                    <p class="channel-likes">❤️ ${(s.likes/1e3).toFixed(1)}K</p>
                </a>
            `).join("")))}const o=await g();let d=o;if(n){d=o.filter(a=>a.channel_id===n);const e=(await p()).find(a=>a.id===n);if(e){const a=document.querySelector(".market-container"),s=document.createElement("div");s.className="channel-header-large",s.innerHTML=`
                <div class="channel-info-large">
                    <img src="${e.image_url}" alt="${e.name}" class="channel-avatar-large">
                    <div class="channel-details-large">
                        <h2>${e.name}</h2>
                        <p class="channel-location">📍 ${e.location}</p>
                        <p class="channel-description">${e.description}</p>
                        <div class="channel-stats">
                            <div class="stat-item">
                                <span class="stat-label">創業</span>
                                <span class="stat-value">${e.established||"未設定"}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">農法</span>
                                <span class="stat-value">${e.farming_style||"未設定"}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">専門分野</span>
                                <span class="stat-value">${e.specialties?e.specialties.join("、"):"未設定"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,a.insertBefore(s,a.firstChild)}}await Promise.all([f(),h(),c(d)]);const m=document.querySelectorAll(".filter-btn");m.forEach(t=>{t.addEventListener("click",async()=>{m.forEach(i=>i.classList.remove("active")),t.classList.add("active");const e=t.dataset.sort,a=document.querySelector(".region-select").value;let s=await u({sortBy:e,region:a});n&&(s=s.filter(i=>i.channel_id===n)),c(s)})});const r=document.querySelector(".region-select");r==null||r.addEventListener("change",async t=>{const e=t.target.value,a=document.querySelector(".filter-btn.active").dataset.sort;let s=await u({sortBy:a,region:e});n&&(s=s.filter(i=>i.channel_id===n)),c(s)})});
//# sourceMappingURL=market-Be6706im.js.map
