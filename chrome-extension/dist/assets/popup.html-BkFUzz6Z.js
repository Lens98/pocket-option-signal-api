(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://pocket-option-signal-api-production.up.railway.app`;async function t(){return{Authorization:`Bearer ${(await chrome.storage.local.get(`pocketOptionAuthToken`)).pocketOptionAuthToken||``}`}}async function n(){console.log(`🌐 UI → RAILWAY /signal:`,new Date().toISOString());let n=`${e}/signal?ts=${Date.now()}`;console.log(`🌐 REQUEST:`,n);let r=await fetch(n,{method:`GET`,cache:`no-store`,headers:{"Cache-Control":`no-cache`,...await t()}});if(console.log(`🌐 RAILWAY RESPONSE:`,r.status),!r.ok)throw Error(`/signal returned ${r.status}`);let i=await r.json();return console.log(`🌐 SIGNAL RECEIVED:`,i.action,i.confidence,i.timestamp),i}async function r(t){let n=encodeURIComponent(t);console.log(`🌐 Loading candles for:`,t);let r=await fetch(`${e}/candles/${n}?ts=${Date.now()}`,{method:`GET`,cache:`no-store`,headers:{"Cache-Control":`no-cache`}});if(console.log(`🌐 CANDLE RESPONSE:`,r.status),!r.ok)throw Error(`/candles/${t} returned ${r.status}`);let i=await r.json();return console.log(`🌐 CANDLES RECEIVED:`,i.length),i}function i(e){let t=Number(e??0),n=document.getElementById(`confidence`),r=document.getElementById(`gauge`);if(!n){console.error(`Missing element: confidenceText`);return}if(!r)return;n.innerHTML=`${t}%`;let i=377-t/100*377;r.style.strokeDashoffset=i,t>=80?r.style.stroke=`#22C55E`:t>=60?r.style.stroke=`#FACC15`:r.style.stroke=`#EF4444`}async function a(){try{let e=await(await fetch(`https://pocket-option-signal-api-production.up.railway.app/trade/today`)).json(),t=document.getElementById(`winRate`),n=document.getElementById(`wins`),r=document.getElementById(`losses`),i=document.getElementById(`profit`),a=document.getElementById(`accuracy`);t&&(t.innerHTML=`${e.win_rate}%`),n&&(n.innerHTML=e.wins),r&&(r.innerHTML=e.losses),i&&(i.innerHTML=`$${e.profit??0}`),a&&(a.innerHTML=e.win_rate>=80?`High`:e.win_rate>=60?`Medium`:`Low`)}catch(e){console.error(`Statistics Error:`,e)}}async function o(){console.log(`🔥 loadTradeHistory() called`);try{let e=await fetch(`https://pocket-option-signal-api-production.up.railway.app/trade/all`);console.log(`Response Status:`,e.status);let t=await e.json();console.log(`Trades received:`,t),console.log(`Trade count:`,t.length);let n=document.getElementById(`historyCount`);n&&(n.textContent=`${t.length} Trades`);let r=document.getElementById(`historyBody`);if(!r){console.error(`Missing element: historyBody`);return}r.innerHTML=``,t.sort((e,t)=>new Date(t.entry_time)-new Date(e.entry_time)),t.slice(0,50).forEach(e=>{let t=document.createElement(`tr`),n=e.entry_time?new Date(e.entry_time).toLocaleTimeString():`--`,i=e.result??`--`,a=i===`--`?`pending`:i.toLowerCase(),o=e.action??`WAIT`;t.innerHTML=`
                <td>${n}</td>
                <td>${e.asset}</td>
                <td class="action-${o.toLowerCase()}">${o}</td>
                <td class="result-${a}">${i}</td>
                <td>${e.profit??`--`}</td>
                <td>${e.confidence??`--`}%</td>
            `,r.appendChild(t)}),console.log(`Rows inserted:`,r.children.length)}catch(e){console.error(`History Error:`,e)}}var s=null,c=null,l=[];function u(){if(s=document.getElementById(`miniChart`),!s)return;let e=window.devicePixelRatio||1;s.width=s.clientWidth*e,s.height=s.clientHeight*e,c=s.getContext(`2d`),c.scale(e,e)}function d(e){l=Array.isArray(e)?e:[],f()}function f(){if(console.log(`Drawing`,l.length,`candles`),!(!c||!s)){if(c.clearRect(0,0,s.clientWidth,s.clientHeight),p(),m(),l.length===0){c.fillStyle=`#94A3B8`,c.font=`15px Segoe UI`,c.fillText(`Waiting for market data...`,20,35);return}h()}}function p(){let e=c.createLinearGradient(0,0,0,s.clientHeight);e.addColorStop(0,`#101827`),e.addColorStop(1,`#0B1220`),c.fillStyle=e,c.fillRect(0,0,s.clientWidth,s.clientHeight)}function m(){let e=s.clientWidth,t=s.clientHeight;c.strokeStyle=`#1E293B`,c.lineWidth=1;for(let n=0;n<=5;n++){let r=t/5*n;c.beginPath(),c.moveTo(0,r),c.lineTo(e,r),c.stroke()}for(let n=0;n<=8;n++){let r=e/8*n;c.beginPath(),c.moveTo(r,0),c.lineTo(r,t),c.stroke()}}function h(){let e=l.slice(-50),t=e.map(e=>e.high),n=e.map(e=>e.low),r=Math.max(...t),i=Math.min(...n),a=(r-i)*.08,o=r+a-(i-a),u=s.width/e.length;e.forEach((t,n)=>{let r=n*u+u/2,a=s.height-(t.open-i)/o*s.height,l=s.height-(t.close-i)/o*s.height,d=s.height-(t.high-i)/o*s.height,f=s.height-(t.low-i)/o*s.height,p=t.close>=t.open;c.strokeStyle=p?`#22C55E`:`#EF4444`,c.fillStyle=p?`#22C55E`:`#EF4444`,c.beginPath(),c.moveTo(r,d),c.lineTo(r,f),c.stroke();let m=Math.min(a,l),h=Math.max(Math.abs(l-a),2);c.fillRect(r-u*.25,m,u*.5,h),n===e.length-1&&(c.shadowColor=c.fillStyle,c.shadowBlur=12,c.fillRect(r-u*.25,m,u*.5,h),c.shadowBlur=0)})}var g=null,_=60;function v(){g&&=(clearInterval(g),null)}function y(e){if(!e||e.timestamp==null)return null;let t=e.timestamp;if(typeof t==`number`||!isNaN(Number(t))){let e=Number(t);return e>1e10&&(e/=1e3),e*1e3}let n=Date.parse(String(t));return isNaN(n)?null:n}function b(){let e=Date.now(),t=_*1e3,n=Math.ceil(e/t)*t,r=Math.ceil((n-e)/1e3);return r<=0&&(r=_),Math.min(_,r)}function x(e){if(e==null||!Number.isFinite(e))return`--:--`;let t=Math.max(0,Math.floor(e)),n=Math.floor(t/60),r=t%60;return String(n).padStart(2,`0`)+`:`+String(r).padStart(2,`0`)}function S(e,t){v();let n=document.getElementById(`countdown`),r=document.getElementById(`countdownLabel`),i=document.getElementById(`action`),a=document.getElementById(`entryMessage`);if(!n||!r||!i||!a)return;function o(){let o=String(e()||`WAITING`).toUpperCase(),s=y(t())!==null,c=x(s?b():null),l=window.latestSignal||{},u=String(l.bias||l.action||`WAIT`).toUpperCase(),d=Number(l.confidence||0);if(o===`WAITING`){n.textContent=c,r.textContent=`🟡 WAITING FOR SETUP`,i.textContent=`WAIT`,a.textContent=`Waiting for a valid trade setup.`;return}if(o===`ANALYZING`){n.textContent=c,r.textContent=`🔍 ANALYZING CURRENT CANDLE`,(u===`CALL`||u===`PUT`)&&d>0?(i.textContent=u,a.textContent=`${u} detected • Confidence ${Math.round(d)}% • Enter on the next candle.`):(i.textContent=`WAIT`,a.textContent=`AI is analyzing the current candle.`);return}if(o===`CONFIRMING`){n.textContent=c,r.textContent=`🟡 CONFIRMING CURRENT CANDLE`,u===`CALL`||u===`PUT`?i.textContent=u:i.textContent=`WAIT`,a.textContent=`AI is confirming the direction for the next candle. ${s?`Next candle in ${c}.`:``}`;return}if(o===`READY`){n.textContent=c,r.textContent=`🟢 NEXT CANDLE SETUP READY`,u===`CALL`||u===`PUT`?(i.textContent=u,a.textContent=`${u} • Next candle in ${c}.`):(i.textContent=`READY`,a.textContent=`Setup detected. Next candle in ${c}.`);return}if(o===`WAITING_FOR_CANDLE_CLOSE`){n.textContent=c,r.textContent=`⏳ NEXT CANDLE ENTRY`,u===`CALL`||u===`PUT`?(i.textContent=u,a.textContent=`${u} • Enter when the new candle opens in ${c}.`):(i.textContent=`WAIT`,a.textContent=`AI is analyzing the current candle. ${s?`Next candle in ${c}.`:``}`);return}if(o===`ENTRY`){n.textContent=`NOW`,r.textContent=`🚀 ENTER NOW`,i.textContent=l.action||l.bias||`ENTER`,a.textContent=`Final signal confirmed. Enter immediately on the new candle.`;return}if(o===`ACTIVE`){n.textContent=`--:--`,r.textContent=`🟢 TRADE ACTIVE`,i.textContent=`ACTIVE`,a.textContent=`Trade is currently running.`;return}if(o===`RESULT`){n.textContent=`--:--`,r.textContent=`🏁 TRADE COMPLETE`,i.textContent=`RESULT`,a.textContent=`Trade completed. Waiting for the next setup.`;return}n.textContent=c,r.textContent=`⚪ WAITING`,i.textContent=`WAIT`,a.textContent=`Waiting for the next valid setup.`}o(),g=setInterval(o,250)}function C(e){let t=document.getElementById(`instruction`),n=document.getElementById(`reason1`),r=document.getElementById(`reason2`),i=document.getElementById(`reason3`),a=document.getElementById(`instructionStatus`);t&&(t.textContent=e.action===`CALL`?`🟢 BUY CALL AT NEXT CANDLE`:e.action===`PUT`?`🔴 BUY PUT AT NEXT CANDLE`:`🟡 WAIT FOR THE NEXT CANDLE`),n&&(n.textContent=e.reasons?.[0]||``),r&&(r.textContent=e.reasons?.[1]||``),i&&(i.textContent=e.reasons?.[2]||``),a&&(a.textContent=e.market_state||`Monitoring market...`)}function w(e){T(`emaStatus`,e.trend===`BULLISH`?`✓ Bullish`:`✓ Bearish`),T(`emaStrength`,e.grade??`--`),T(`rsiStatus`,e.rsi_status??`--`),T(`rsiStrength`,e.rsi_strength??`--`),T(`macdStatus`,e.macd_status??`--`),T(`macdStrength`,e.macd_strength??`--`),T(`volumeStatus`,e.volume_status??`--`),T(`volumeStrength`,e.volume_strength??`--`),T(`structureStatus`,e.structure_status??`--`),T(`structureStrength`,e.structure_strength??`--`),T(`volatilityStatus`,e.volatility_status??`--`),T(`volatilityStrength`,e.volatility_strength??`--`),T(`supportStatus`,e.support_status??`--`),T(`supportStrength`,e.support_strength??`--`),T(`liquidityStatus`,e.liquidity_status??`--`),T(`liquidityStrength`,e.liquidity_strength??`--`)}function T(e,t){let n=document.getElementById(e);n&&(n.textContent=t)}function E(e={},t={}){let n=e.asset||t.asset||`---`,r=Array.isArray(t.candles)?t.candles:[],i=r.length>0?r[r.length-1]:null,a=e.entry_price??i?.close??0;D(`asset`,n),D(`trend`,e.trend),D(`risk`,e.risk),D(`expiration`,e.expiration),D(`probability`,`${Number(e.probability??0).toFixed(1)}%`),D(`grade`,e.grade),D(`session`,e.session),D(`regime`,e.regime),D(`chartAsset`,n),D(`chartPrice`,Number(a).toFixed(5));let o=document.getElementById(`chartChange`);if(o){let t=e.trend||`---`;o.textContent=`${t} • ${e.session||`---`}`,o.className=`market-change`,t===`BULLISH`?o.classList.add(`bullish`):t===`BEARISH`?o.classList.add(`bearish`):o.classList.add(`neutral`)}}function D(e,t){let n=document.getElementById(e);if(!n)return;n.textContent=t??`---`,n.classList.remove(`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`);let r=[`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`],i=String(t??``).toUpperCase();r.includes(i)&&n.classList.add(i)}function O(e={}){k(e),A(e),j(e),M(e)}function k(e){let t=document.getElementById(`action`);if(!t)return;let n=String(e.next_candle_bias||e.action||`WAIT`).toUpperCase();String(e.bias||``).toUpperCase();let r=String(e.market_state||``).toUpperCase(),i=String(e.trade_status||``).toUpperCase(),a=r===`ACTIVE`||i===`ACTIVE`,o;switch(o=a?`ACTIVE`:n,t.textContent=o,t.className=`signal-action`,o){case`CALL`:t.classList.add(`call`);break;case`PUT`:t.classList.add(`put`);break;case`ACTIVE`:t.classList.add(`wait`);break;default:t.classList.add(`wait`);break}}function A(e){let t=document.getElementById(`confidence`);if(!t)return;let n=Number(e.confidence);Number.isFinite(n)?t.textContent=`${Math.round(n)}%`:t.textContent=`--`}function j(e){let t=document.getElementById(`trend`),n=document.getElementById(`risk`),r=document.getElementById(`expiration`);t&&(t.textContent=e.trend??`--`),n&&(n.textContent=e.risk??`--`),r&&(r.textContent=e.expiration??`--`)}function M(e){let t=document.getElementById(`signalStatus`);if(!t)return;let n=String(e.market_state||``).toUpperCase(),r=String(e.trade_status||``).toUpperCase(),i=String(e.bias||``).toUpperCase();if((n===`ACTIVE`||r===`ACTIVE`)&&(i===`CALL`||i===`PUT`)){t.textContent=`ACTIVE TRADE — ${i}`,t.className=`active`;return}if(e.reason&&String(e.reason).trim()!==``){t.textContent=e.reason;return}t.textContent=e.market_state||`Waiting...`}function N(e){let t=document.getElementById(`status`),n=document.getElementById(`statusText`),r=document.getElementById(`updated`),i=document.getElementById(`engineStatus`);!t||!n||(e?(t.textContent=`🟢 Online`,t.className=`status online`,n.textContent=`🟢 Connected`,n.className=`online`,r&&(r.textContent=new Date().toLocaleTimeString()),i&&(i.textContent=`Running`)):(t.textContent=`🔴 Offline`,t.className=`status offline`,n.textContent=`🔴 Disconnected`,n.className=`offline`,i&&(i.textContent=`Offline`)))}async function P(){return new Promise(e=>{chrome.runtime.sendMessage({type:`GET_STATE`},t=>{if(chrome.runtime.lastError){console.error(`Extension state error:`,chrome.runtime.lastError.message),e({});return}e(t||{})})})}function F(e,t=5e3){return Promise.race([e,new Promise((e,n)=>{setTimeout(()=>{n(Error(`Request timeout after 5 seconds`))},t)})])}async function I(){console.log(`🚀 DASHBOARD INITIALIZING`);try{u(),console.log(`✅ Chart initialized`)}catch(e){console.error(`❌ Chart initialization failed:`,e)}try{await R(),console.log(`✅ First dashboard refresh complete`)}catch(e){console.error(`❌ First dashboard refresh failed:`,e)}try{S(()=>window.marketState,()=>window.latestCandle),console.log(`✅ Countdown started`)}catch(e){console.error(`❌ Countdown failed:`,e)}L(),console.log(`🟢 DASHBOARD AUTO-REFRESH STARTED`)}async function L(){for(console.log(`🟢 DASHBOARD REFRESH LOOP STARTED`);;){try{console.log(`🔄 DASHBOARD LOOP:`,new Date().toISOString()),await R()}catch(e){console.error(`❌ Dashboard loop error:`,e)}await new Promise(e=>setTimeout(e,1e3))}}async function R(){console.log(`🔄 DASHBOARD REFRESH:`,new Date().toISOString());let e,t;try{e=await F(n(),5e3),console.log(`📡 NEW SIGNAL FROM RAILWAY:`,e),window.latestSignal=e,window.marketTimeframe=Number(e?.timeframe)||60,N(!0)}catch(t){N(!1),console.error(`API Connection Error:`,t),e={status:`No signal yet`}}try{t=await F(P(),3e3)}catch(e){console.error(`Unable to get extension market state:`,e),t={}}let s=t.marketAsset||e?.asset||null,c=Array.isArray(t.marketCandles)?t.marketCandles:[];console.log(`======================================`),console.log(`LIVE MARKET STATE`),console.log(`Asset:`,s),console.log(`Candles:`,c.length),console.log(`======================================`),window.marketState=e?.market_state||`WAITING`;try{O(e),C(e),w(e)}catch(e){console.error(`AI UI update error:`,e)}try{E(e,{asset:s,candles:c})}catch(e){console.error(`Market UI update error:`,e)}try{if(c.length===0&&s){console.log(`No local candles yet. Requesting backend candles for:`,s);try{c=await F(r(s),5e3)}catch(e){console.warn(`Backend candle request failed:`,e)}}c.length>0?(window.latestCandle=c[c.length-1],console.log(`Latest candle:`,window.latestCandle),console.log(`Total candles:`,c.length),d(c)):(window.latestCandle=null,console.warn(`No candles available yet.`))}catch(e){console.error(`Candle UI error:`,e)}try{i(Number(e?.confidence??0))}catch(e){console.error(`Confidence UI error:`,e)}if(window.tradeRefreshTimer||(window.tradeRefreshTimer=Date.now()),Date.now()-window.tradeRefreshTimer>5e3){try{await F(a(),5e3),await F(o(),5e3)}catch(e){console.error(`Trade data refresh error:`,e)}window.tradeRefreshTimer=Date.now()}}var z=`https://pocket-option-signal-api-production.up.railway.app`,B=`pocketOptionAuthToken`,V=`pocketOptionUser`;async function H(){return(await chrome.storage.local.get(B))[B]||null}async function U(e,t){let n=await fetch(`${z}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to login.`);return await chrome.storage.local.set({[B]:r.token,[V]:r.user}),r}async function W(e,t){let n=await fetch(`${z}/auth/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to create account.`);return r}async function G(){let e=await H();if(!e)return null;try{let t=await fetch(`${z}/auth/me`,{method:`GET`,headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return await K(),null;let n=await t.json();return await chrome.storage.local.set({[V]:n.user}),n.user}catch(e){return console.error(`Session verification failed:`,e),null}}async function K(){let e=await H();if(e)try{await fetch(`${z}/auth/logout`,{method:`POST`,headers:{Authorization:`Bearer ${e}`}})}catch(e){console.warn(`Logout request failed:`,e)}await chrome.storage.local.remove([B,V])}function q(e){if(document.getElementById(`authScreen`))return;let t=document.createElement(`div`);t.id=`authScreen`,t.innerHTML=`

        <div class="auth-container">

            <div class="auth-logo">
                🤖
            </div>

            <h1 class="auth-title">
                Pocket Option AI PRO
            </h1>

            <p class="auth-subtitle">
                AI Trading Intelligence
            </p>


            <div
                id="loginView"
                class="auth-view"
            >

                <h2>
                    Welcome Back
                </h2>

                <p class="auth-description">
                    Sign in to access your AI dashboard.
                </p>


                <form id="loginForm">

                    <label>
                        Email
                    </label>

                    <input
                        id="loginEmail"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        id="loginPassword"
                        type="password"
                        placeholder="Enter your password"
                        autocomplete="current-password"
                        required
                    />


                    <button
                        type="submit"
                        id="loginButton"
                        class="auth-button"
                    >
                        LOGIN
                    </button>

                </form>


                <div
                    id="loginMessage"
                    class="auth-message"
                ></div>


                <button
                    id="showRegister"
                    class="auth-link"
                    type="button"
                >
                    Create Account
                </button>

            </div>


            <div
                id="registerView"
                class="auth-view hidden"
            >

                <h2>
                    Create Account
                </h2>

                <p class="auth-description">
                    Create your Pocket Option AI PRO account.
                </p>


                <form id="registerForm">

                    <label>
                        Email
                    </label>

                    <input
                        id="registerEmail"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        id="registerPassword"
                        type="password"
                        placeholder="Minimum 8 characters"
                        minlength="8"
                        autocomplete="new-password"
                        required
                    />


                    <label>
                        Confirm Password
                    </label>

                    <input
                        id="registerConfirm"
                        type="password"
                        placeholder="Confirm your password"
                        minlength="8"
                        autocomplete="new-password"
                        required
                    />


                    <button
                        type="submit"
                        id="registerButton"
                        class="auth-button"
                    >
                        CREATE ACCOUNT
                    </button>

                </form>


                <div
                    id="registerMessage"
                    class="auth-message"
                ></div>


                <button
                    id="showLogin"
                    class="auth-link"
                    type="button"
                >
                    Back to Login
                </button>

            </div>

        </div>
    `,document.body.prepend(t);let n=document.getElementById(`loginView`),r=document.getElementById(`registerView`);document.getElementById(`showRegister`).addEventListener(`click`,()=>{n.classList.add(`hidden`),r.classList.remove(`hidden`)}),document.getElementById(`showLogin`).addEventListener(`click`,()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`)}),document.getElementById(`loginForm`).addEventListener(`submit`,async n=>{n.preventDefault();let r=document.getElementById(`loginEmail`).value.trim(),i=document.getElementById(`loginPassword`).value,a=document.getElementById(`loginButton`),o=document.getElementById(`loginMessage`);a.disabled=!0,a.textContent=`SIGNING IN...`,o.textContent=``,o.className=`auth-message`;try{await U(r,i),o.textContent=`Login successful.`,o.classList.add(`success`),t.remove(),e()}catch(e){o.textContent=e.message,o.classList.add(`error`),a.disabled=!1,a.textContent=`LOGIN`}}),document.getElementById(`registerForm`).addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`registerEmail`).value.trim(),i=document.getElementById(`registerPassword`).value,a=document.getElementById(`registerConfirm`).value,o=document.getElementById(`registerButton`),s=document.getElementById(`registerMessage`);if(i!==a){s.textContent=`Passwords do not match.`,s.className=`auth-message error`;return}o.disabled=!0,o.textContent=`CREATING ACCOUNT...`,s.textContent=``,s.className=`auth-message`;try{await W(t,i),s.textContent=`Account created. You can now log in.`,s.classList.add(`success`),document.getElementById(`registerForm`).reset(),setTimeout(()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`),document.getElementById(`loginEmail`).value=t},1e3)}catch(e){s.textContent=e.message,s.classList.add(`error`)}finally{o.disabled=!1,o.textContent=`CREATE ACCOUNT`}})}function J(e){let t=document.getElementById(`accountEmail`),n=document.getElementById(`logoutButton`),r=document.getElementById(`accountStatus`);if(!t||!n){console.warn(`Account UI elements not found.`);return}t.textContent=e?.email||`Unknown User`,r&&(r.textContent=`● ACTIVE`),n.addEventListener(`click`,async()=>{n.disabled=!0,n.textContent=`LOGGING OUT...`;try{await K()}catch(e){console.error(`Logout error:`,e)}window.location.reload()})}function Y(e){console.log(`Authentication successful. Starting dashboard.`),J(e),I()}document.addEventListener(`DOMContentLoaded`,async()=>{console.log(`Checking authentication...`);let e=await G();if(e){console.log(`Authenticated user:`,e.email),Y(e);return}console.log(`User is not authenticated.`),q(async()=>{let e=await G();if(!e){console.error(`Login succeeded but session verification failed.`);return}Y(e)})});