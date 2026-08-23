(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://pocket-option-signal-api-production.up.railway.app`;async function t(){return{Authorization:`Bearer ${(await chrome.storage.local.get(`pocketOptionAuthToken`)).pocketOptionAuthToken||``}`}}async function n(){console.log(`🌐 UI → RAILWAY /signal:`,new Date().toISOString());let n=`${e}/signal?ts=${Date.now()}`;console.log(`🌐 REQUEST:`,n);let r=await fetch(n,{method:`GET`,cache:`no-store`,headers:{"Cache-Control":`no-cache`,...await t()}});if(console.log(`🌐 RAILWAY RESPONSE:`,r.status),!r.ok)throw Error(`/signal returned ${r.status}`);let i=await r.json();return console.log(`🌐 SIGNAL RECEIVED:`,i.action,i.confidence,i.timestamp),i}async function r(){let n=await fetch(`${e}/trade/all`,{headers:await t()});if(!n.ok)throw Error(`Unable to load history`);return await n.json()}async function i(t){let n=encodeURIComponent(t);console.log(`🌐 Loading candles for:`,t);let r=await fetch(`${e}/candles/${n}?ts=${Date.now()}`,{method:`GET`,cache:`no-store`,headers:{"Cache-Control":`no-cache`}});if(console.log(`🌐 CANDLE RESPONSE:`,r.status),!r.ok)throw Error(`/candles/${t} returned ${r.status}`);let i=await r.json();return console.log(`🌐 CANDLES RECEIVED:`,i.length),i}async function a(){let n=await fetch(`${e}/trade/today`,{headers:await t()});if(!n.ok)throw Error(`Unable to load today's statistics: ${n.status}`);return await n.json()}function o(e){let t=Number(e??0),n=document.getElementById(`confidence`),r=document.getElementById(`gauge`);if(!n){console.error(`Missing element: confidenceText`);return}if(!r)return;n.innerHTML=`${t}%`;let i=377-t/100*377;r.style.strokeDashoffset=i,t>=80?r.style.stroke=`#22C55E`:t>=60?r.style.stroke=`#FACC15`:r.style.stroke=`#EF4444`}async function s(){try{let e=await a();console.log(`Today's statistics:`,e);let t=document.getElementById(`winRate`),n=document.getElementById(`wins`),r=document.getElementById(`losses`),i=document.getElementById(`profit`),o=document.getElementById(`accuracy`);if(t&&(t.innerHTML=`${e.win_rate??0}%`),n&&(n.innerHTML=e.wins??0),r&&(r.innerHTML=e.losses??0),i&&(i.innerHTML=`$${e.profit??0}`),o){let t=e.win_rate??0;o.innerHTML=t>=80?`High`:t>=60?`Medium`:`Low`}}catch(e){console.error(`Statistics Error:`,e)}}async function c(){console.log(`📜 loadTradeHistory() called`);try{let e=await r();if(!Array.isArray(e)){console.error(`Invalid trade history response:`,e);return}console.log(`Trades received:`,e),console.log(`Trade count:`,e.length);let t=document.getElementById(`historyCount`);t&&(t.textContent=`${e.length} Trades`);let n=document.getElementById(`historyBody`);if(!n){console.error(`Missing element: historyBody`);return}n.innerHTML=``,e.sort((e,t)=>new Date(t.entry_time)-new Date(e.entry_time)),e.slice(0,50).forEach(e=>{let t=document.createElement(`tr`),r=e.entry_time?new Date(e.entry_time).toLocaleTimeString():`--`,i=e.result??`--`,a=i===`--`?`pending`:i.toLowerCase(),o=e.action??`WAIT`;t.innerHTML=`
                <td>${r}</td>
                <td>${e.asset}</td>
                <td class="action-${o.toLowerCase()}">${o}</td>
                <td class="result-${a}">${i}</td>
                <td>${e.profit??`--`}</td>
                <td>${e.confidence??`--`}%</td>
            `,n.appendChild(t)}),console.log(`Rows inserted:`,n.children.length)}catch(e){console.error(`History Error:`,e)}}var l=null,u=null,d=[];function f(){if(l=document.getElementById(`miniChart`),!l)return;let e=window.devicePixelRatio||1;l.width=l.clientWidth*e,l.height=l.clientHeight*e,u=l.getContext(`2d`),u.scale(e,e)}function p(e){d=Array.isArray(e)?e:[],m()}function m(){if(console.log(`Drawing`,d.length,`candles`),!(!u||!l)){if(u.clearRect(0,0,l.clientWidth,l.clientHeight),h(),g(),d.length===0){u.fillStyle=`#94A3B8`,u.font=`15px Segoe UI`,u.fillText(`Waiting for market data...`,20,35);return}_()}}function h(){let e=u.createLinearGradient(0,0,0,l.clientHeight);e.addColorStop(0,`#101827`),e.addColorStop(1,`#0B1220`),u.fillStyle=e,u.fillRect(0,0,l.clientWidth,l.clientHeight)}function g(){let e=l.clientWidth,t=l.clientHeight;u.strokeStyle=`#1E293B`,u.lineWidth=1;for(let n=0;n<=5;n++){let r=t/5*n;u.beginPath(),u.moveTo(0,r),u.lineTo(e,r),u.stroke()}for(let n=0;n<=8;n++){let r=e/8*n;u.beginPath(),u.moveTo(r,0),u.lineTo(r,t),u.stroke()}}function _(){let e=d.slice(-50),t=e.map(e=>e.high),n=e.map(e=>e.low),r=Math.max(...t),i=Math.min(...n),a=(r-i)*.08,o=r+a-(i-a),s=l.width/e.length;e.forEach((t,n)=>{let r=n*s+s/2,a=l.height-(t.open-i)/o*l.height,c=l.height-(t.close-i)/o*l.height,d=l.height-(t.high-i)/o*l.height,f=l.height-(t.low-i)/o*l.height,p=t.close>=t.open;u.strokeStyle=p?`#22C55E`:`#EF4444`,u.fillStyle=p?`#22C55E`:`#EF4444`,u.beginPath(),u.moveTo(r,d),u.lineTo(r,f),u.stroke();let m=Math.min(a,c),h=Math.max(Math.abs(c-a),2);u.fillRect(r-s*.25,m,s*.5,h),n===e.length-1&&(u.shadowColor=u.fillStyle,u.shadowBlur=12,u.fillRect(r-s*.25,m,s*.5,h),u.shadowBlur=0)})}var v=null,y=60;function b(){v&&=(clearInterval(v),null)}function x(e){if(!e||e.timestamp==null)return null;let t=e.timestamp;if(typeof t==`number`||!isNaN(Number(t))){let e=Number(t);return e>1e10&&(e/=1e3),e*1e3}let n=Date.parse(String(t));return isNaN(n)?null:n}function S(){let e=Date.now(),t=y*1e3,n=Math.ceil(e/t)*t,r=Math.ceil((n-e)/1e3);return r<=0&&(r=y),Math.min(y,r)}function C(e){if(e==null||!Number.isFinite(e))return`--:--`;let t=Math.max(0,Math.floor(e)),n=Math.floor(t/60),r=t%60;return String(n).padStart(2,`0`)+`:`+String(r).padStart(2,`0`)}function w(e,t){b();let n=document.getElementById(`countdown`),r=document.getElementById(`countdownLabel`),i=document.getElementById(`action`),a=document.getElementById(`entryMessage`);if(!n||!r||!i||!a)return;function o(){let o=String(e()||`WAITING`).toUpperCase(),s=x(t())!==null,c=C(s?S():null),l=window.latestSignal||{},u=String(l.bias||l.action||`WAIT`).toUpperCase(),d=Number(l.confidence||0);if(o===`WAITING`){n.textContent=c,r.textContent=`🟡 WAITING FOR SETUP`,i.textContent=`WAIT`,a.textContent=`Waiting for a valid trade setup.`;return}if(o===`ANALYZING`){n.textContent=c,r.textContent=`🔍 ANALYZING CURRENT CANDLE`,(u===`CALL`||u===`PUT`)&&d>0?(i.textContent=u,a.textContent=`${u} detected • Confidence ${Math.round(d)}% • Enter on the next candle.`):(i.textContent=`WAIT`,a.textContent=`AI is analyzing the current candle.`);return}if(o===`CONFIRMING`){n.textContent=c,r.textContent=`🟡 CONFIRMING CURRENT CANDLE`,u===`CALL`||u===`PUT`?i.textContent=u:i.textContent=`WAIT`,a.textContent=`AI is confirming the direction for the next candle. ${s?`Next candle in ${c}.`:``}`;return}if(o===`READY`){n.textContent=c,r.textContent=`🟢 NEXT CANDLE SETUP READY`,u===`CALL`||u===`PUT`?(i.textContent=u,a.textContent=`${u} • Next candle in ${c}.`):(i.textContent=`READY`,a.textContent=`Setup detected. Next candle in ${c}.`);return}if(o===`WAITING_FOR_CANDLE_CLOSE`){n.textContent=c,r.textContent=`⏳ NEXT CANDLE ENTRY`,u===`CALL`||u===`PUT`?(i.textContent=u,a.textContent=`${u} • Enter when the new candle opens in ${c}.`):(i.textContent=`WAIT`,a.textContent=`AI is analyzing the current candle. ${s?`Next candle in ${c}.`:``}`);return}if(o===`ENTRY`){n.textContent=`NOW`,r.textContent=`🚀 ENTER NOW`,i.textContent=l.action||l.bias||`ENTER`,a.textContent=`Final signal confirmed. Enter immediately on the new candle.`;return}if(o===`ACTIVE`){n.textContent=`--:--`,r.textContent=`🟢 TRADE ACTIVE`,i.textContent=`ACTIVE`,a.textContent=`Trade is currently running.`;return}if(o===`RESULT`){n.textContent=`--:--`,r.textContent=`🏁 TRADE COMPLETE`,i.textContent=`RESULT`,a.textContent=`Trade completed. Waiting for the next setup.`;return}n.textContent=c,r.textContent=`⚪ WAITING`,i.textContent=`WAIT`,a.textContent=`Waiting for the next valid setup.`}o(),v=setInterval(o,250)}function T(e){let t=document.getElementById(`instruction`),n=document.getElementById(`reason1`),r=document.getElementById(`reason2`),i=document.getElementById(`reason3`),a=document.getElementById(`instructionStatus`);t&&(t.textContent=e.action===`CALL`?`🟢 BUY CALL AT NEXT CANDLE`:e.action===`PUT`?`🔴 BUY PUT AT NEXT CANDLE`:`🟡 WAIT FOR THE NEXT CANDLE`),n&&(n.textContent=e.reasons?.[0]||``),r&&(r.textContent=e.reasons?.[1]||``),i&&(i.textContent=e.reasons?.[2]||``),a&&(a.textContent=e.market_state||`Monitoring market...`)}function E(e){D(`emaStatus`,e.trend===`BULLISH`?`✓ Bullish`:`✓ Bearish`),D(`emaStrength`,e.grade??`--`),D(`rsiStatus`,e.rsi_status??`--`),D(`rsiStrength`,e.rsi_strength??`--`),D(`macdStatus`,e.macd_status??`--`),D(`macdStrength`,e.macd_strength??`--`),D(`volumeStatus`,e.volume_status??`--`),D(`volumeStrength`,e.volume_strength??`--`),D(`structureStatus`,e.structure_status??`--`),D(`structureStrength`,e.structure_strength??`--`),D(`volatilityStatus`,e.volatility_status??`--`),D(`volatilityStrength`,e.volatility_strength??`--`),D(`supportStatus`,e.support_status??`--`),D(`supportStrength`,e.support_strength??`--`),D(`liquidityStatus`,e.liquidity_status??`--`),D(`liquidityStrength`,e.liquidity_strength??`--`)}function D(e,t){let n=document.getElementById(e);n&&(n.textContent=t)}function O(e={},t={}){let n=e.asset||t.asset||`---`,r=Array.isArray(t.candles)?t.candles:[],i=r.length>0?r[r.length-1]:null,a=e.entry_price??i?.close??0;k(`asset`,n),k(`trend`,e.trend),k(`risk`,e.risk),k(`expiration`,e.expiration),k(`probability`,`${Number(e.probability??0).toFixed(1)}%`),k(`grade`,e.grade),k(`session`,e.session),k(`regime`,e.regime),k(`chartAsset`,n),k(`chartPrice`,Number(a).toFixed(5));let o=document.getElementById(`chartChange`);if(o){let t=e.trend||`---`;o.textContent=`${t} • ${e.session||`---`}`,o.className=`market-change`,t===`BULLISH`?o.classList.add(`bullish`):t===`BEARISH`?o.classList.add(`bearish`):o.classList.add(`neutral`)}}function k(e,t){let n=document.getElementById(e);if(!n)return;n.textContent=t??`---`,n.classList.remove(`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`);let r=[`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`],i=String(t??``).toUpperCase();r.includes(i)&&n.classList.add(i)}function A(e={}){j(e),M(e),N(e),P(e)}function j(e){let t=document.getElementById(`action`);if(!t)return;let n=String(e.next_candle_bias||e.action||`WAIT`).toUpperCase();String(e.bias||``).toUpperCase();let r=String(e.market_state||``).toUpperCase(),i=String(e.trade_status||``).toUpperCase(),a=r===`ACTIVE`||i===`ACTIVE`,o;switch(o=a?`ACTIVE`:n,t.textContent=o,t.className=`signal-action`,o){case`CALL`:t.classList.add(`call`);break;case`PUT`:t.classList.add(`put`);break;case`ACTIVE`:t.classList.add(`wait`);break;default:t.classList.add(`wait`);break}}function M(e){let t=document.getElementById(`confidence`);if(!t)return;let n=Number(e.confidence);Number.isFinite(n)?t.textContent=`${Math.round(n)}%`:t.textContent=`--`}function N(e){let t=document.getElementById(`trend`),n=document.getElementById(`risk`),r=document.getElementById(`expiration`);t&&(t.textContent=e.trend??`--`),n&&(n.textContent=e.risk??`--`),r&&(r.textContent=e.expiration??`--`)}function P(e){let t=document.getElementById(`signalStatus`);if(!t)return;let n=String(e.market_state||``).toUpperCase(),r=String(e.trade_status||``).toUpperCase(),i=String(e.bias||``).toUpperCase();if((n===`ACTIVE`||r===`ACTIVE`)&&(i===`CALL`||i===`PUT`)){t.textContent=`ACTIVE TRADE — ${i}`,t.className=`active`;return}if(e.reason&&String(e.reason).trim()!==``){t.textContent=e.reason;return}t.textContent=e.market_state||`Waiting...`}function F(e){let t=document.getElementById(`status`),n=document.getElementById(`statusText`),r=document.getElementById(`updated`),i=document.getElementById(`engineStatus`);!t||!n||(e?(t.textContent=`🟢 Online`,t.className=`status online`,n.textContent=`🟢 Connected`,n.className=`online`,r&&(r.textContent=new Date().toLocaleTimeString()),i&&(i.textContent=`Running`)):(t.textContent=`🔴 Offline`,t.className=`status offline`,n.textContent=`🔴 Disconnected`,n.className=`offline`,i&&(i.textContent=`Offline`)))}async function I(){return new Promise(e=>{chrome.runtime.sendMessage({type:`GET_STATE`},t=>{if(chrome.runtime.lastError){console.error(`Extension state error:`,chrome.runtime.lastError.message),e({});return}e(t||{})})})}function L(e,t=5e3){return Promise.race([e,new Promise((e,n)=>{setTimeout(()=>{n(Error(`Request timeout after 5 seconds`))},t)})])}async function R(){console.log(`🚀 DASHBOARD INITIALIZING`);try{f(),console.log(`✅ Chart initialized`)}catch(e){console.error(`❌ Chart initialization failed:`,e)}try{await B(),console.log(`✅ First dashboard refresh complete`)}catch(e){console.error(`❌ First dashboard refresh failed:`,e)}try{w(()=>window.marketState,()=>window.latestCandle),console.log(`✅ Countdown started`)}catch(e){console.error(`❌ Countdown failed:`,e)}z(),console.log(`🟢 DASHBOARD AUTO-REFRESH STARTED`)}async function z(){for(console.log(`🟢 DASHBOARD REFRESH LOOP STARTED`);;){try{console.log(`🔄 DASHBOARD LOOP:`,new Date().toISOString()),await B()}catch(e){console.error(`❌ Dashboard loop error:`,e)}await new Promise(e=>setTimeout(e,1e3))}}async function B(){console.log(`🔄 DASHBOARD REFRESH:`,new Date().toISOString());let e,t;try{e=await L(n(),5e3),console.log(`📡 NEW SIGNAL FROM RAILWAY:`,e),window.latestSignal=e,window.marketTimeframe=Number(e?.timeframe)||60,F(!0)}catch(t){F(!1),console.error(`API Connection Error:`,t),e={status:`No signal yet`}}try{t=await L(I(),3e3)}catch(e){console.error(`Unable to get extension market state:`,e),t={}}let r=t.marketAsset||e?.asset||null,a=Array.isArray(t.marketCandles)?t.marketCandles:[];console.log(`======================================`),console.log(`LIVE MARKET STATE`),console.log(`Asset:`,r),console.log(`Candles:`,a.length),console.log(`======================================`),window.marketState=e?.market_state||`WAITING`;try{A(e),T(e),E(e)}catch(e){console.error(`AI UI update error:`,e)}try{O(e,{asset:r,candles:a})}catch(e){console.error(`Market UI update error:`,e)}try{if(a.length===0&&r){console.log(`No local candles yet. Requesting backend candles for:`,r);try{a=await L(i(r),5e3)}catch(e){console.warn(`Backend candle request failed:`,e)}}a.length>0?(window.latestCandle=a[a.length-1],console.log(`Latest candle:`,window.latestCandle),console.log(`Total candles:`,a.length),p(a)):(window.latestCandle=null,console.warn(`No candles available yet.`))}catch(e){console.error(`Candle UI error:`,e)}try{o(Number(e?.confidence??0))}catch(e){console.error(`Confidence UI error:`,e)}if(window.tradeRefreshTimer||(window.tradeRefreshTimer=Date.now()),Date.now()-window.tradeRefreshTimer>5e3){try{await L(s(),5e3),await L(c(),5e3)}catch(e){console.error(`Trade data refresh error:`,e)}window.tradeRefreshTimer=Date.now()}}var V=`https://pocket-option-signal-api-production.up.railway.app`,H=`pocketOptionAuthToken`,U=`pocketOptionUser`;async function W(){return(await chrome.storage.local.get(H))[H]||null}async function G(e,t){let n=await fetch(`${V}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to login.`);return await chrome.storage.local.set({[H]:r.token,[U]:r.user}),r}async function K(e,t){let n=await fetch(`${V}/auth/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to create account.`);return r}async function q(){let e=await W();if(!e)return null;try{let t=await fetch(`${V}/auth/me`,{method:`GET`,headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return await J(),null;let n=await t.json();return await chrome.storage.local.set({[U]:n.user}),n.user}catch(e){return console.error(`Session verification failed:`,e),null}}async function J(){let e=await W();if(e)try{await fetch(`${V}/auth/logout`,{method:`POST`,headers:{Authorization:`Bearer ${e}`}})}catch(e){console.warn(`Logout request failed:`,e)}await chrome.storage.local.remove([H,U])}function Y(e){if(document.getElementById(`authScreen`))return;let t=document.createElement(`div`);t.id=`authScreen`,t.innerHTML=`

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
    `,document.body.prepend(t);let n=document.getElementById(`loginView`),r=document.getElementById(`registerView`);document.getElementById(`showRegister`).addEventListener(`click`,()=>{n.classList.add(`hidden`),r.classList.remove(`hidden`)}),document.getElementById(`showLogin`).addEventListener(`click`,()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`)}),document.getElementById(`loginForm`).addEventListener(`submit`,async n=>{n.preventDefault();let r=document.getElementById(`loginEmail`).value.trim(),i=document.getElementById(`loginPassword`).value,a=document.getElementById(`loginButton`),o=document.getElementById(`loginMessage`);a.disabled=!0,a.textContent=`SIGNING IN...`,o.textContent=``,o.className=`auth-message`;try{await G(r,i),o.textContent=`Login successful.`,o.classList.add(`success`),t.remove(),e()}catch(e){o.textContent=e.message,o.classList.add(`error`),a.disabled=!1,a.textContent=`LOGIN`}}),document.getElementById(`registerForm`).addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`registerEmail`).value.trim(),i=document.getElementById(`registerPassword`).value,a=document.getElementById(`registerConfirm`).value,o=document.getElementById(`registerButton`),s=document.getElementById(`registerMessage`);if(i!==a){s.textContent=`Passwords do not match.`,s.className=`auth-message error`;return}o.disabled=!0,o.textContent=`CREATING ACCOUNT...`,s.textContent=``,s.className=`auth-message`;try{await K(t,i),s.textContent=`Account created. You can now log in.`,s.classList.add(`success`),document.getElementById(`registerForm`).reset(),setTimeout(()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`),document.getElementById(`loginEmail`).value=t},1e3)}catch(e){s.textContent=e.message,s.classList.add(`error`)}finally{o.disabled=!1,o.textContent=`CREATE ACCOUNT`}})}function X(e){let t=document.getElementById(`accountEmail`),n=document.getElementById(`logoutButton`),r=document.getElementById(`accountStatus`);if(!t||!n){console.warn(`Account UI elements not found.`);return}t.textContent=e?.email||`Unknown User`,r&&(r.textContent=`● ACTIVE`),n.addEventListener(`click`,async()=>{n.disabled=!0,n.textContent=`LOGGING OUT...`;try{await J()}catch(e){console.error(`Logout error:`,e)}window.location.reload()})}function Z(e){console.log(`Authentication successful. Starting dashboard.`),X(e),R()}document.addEventListener(`DOMContentLoaded`,async()=>{console.log(`Checking authentication...`);let e=await q();if(e){console.log(`Authenticated user:`,e.email),Z(e);return}console.log(`User is not authenticated.`),Y(async()=>{let e=await q();if(!e){console.error(`Login succeeded but session verification failed.`);return}Z(e)})});