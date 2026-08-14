(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://pocket-option-signal-api-production.up.railway.app`;async function t(){let t=await fetch(`${e}/signal`);if(!t.ok)throw Error(`Unable to load signal`);return await t.json()}async function n(t){let n=encodeURIComponent(t);console.log(`Loading candles for:`,t);let r=await fetch(`${e}/candles/${n}`);if(console.log(`Status:`,r.status),!r.ok)throw Error(`Unable to load candles`);let i=await r.json();return console.log(`Candles returned:`,i.length),i}function r(e){let t=Number(e??0),n=document.getElementById(`confidence`),r=document.getElementById(`gauge`);if(!n){console.error(`Missing element: confidenceText`);return}if(!r)return;n.innerHTML=`${t}%`;let i=377-t/100*377;r.style.strokeDashoffset=i,t>=80?r.style.stroke=`#22C55E`:t>=60?r.style.stroke=`#FACC15`:r.style.stroke=`#EF4444`}async function i(){try{let e=await(await fetch(`https://pocket-option-signal-api-production.up.railway.app/trade/statistics`)).json(),t=document.getElementById(`winRate`),n=document.getElementById(`wins`),r=document.getElementById(`losses`),i=document.getElementById(`profit`),a=document.getElementById(`accuracy`);t&&(t.innerHTML=`${e.win_rate}%`),n&&(n.innerHTML=e.wins),r&&(r.innerHTML=e.losses),i&&(i.innerHTML=`$${e.profit??0}`),a&&(a.innerHTML=e.win_rate>=80?`High`:e.win_rate>=60?`Medium`:`Low`)}catch(e){console.error(`Statistics Error:`,e)}}async function a(){console.log(`🔥 loadTradeHistory() called`);try{let e=await fetch(`https://pocket-option-signal-api-production.up.railway.app/trade/all`);console.log(`Response Status:`,e.status);let t=await e.json();console.log(`Trades received:`,t),console.log(`Trade count:`,t.length);let n=document.getElementById(`historyCount`);n&&(n.textContent=`${t.length} Trades`);let r=document.getElementById(`historyBody`);if(!r){console.error(`Missing element: historyBody`);return}r.innerHTML=``,t.sort((e,t)=>new Date(t.entry_time)-new Date(e.entry_time)),t.slice(0,50).forEach(e=>{let t=document.createElement(`tr`),n=e.entry_time?new Date(e.entry_time).toLocaleTimeString():`--`,i=e.result??`--`,a=i===`--`?`pending`:i.toLowerCase(),o=e.action??`WAIT`;t.innerHTML=`
                <td>${n}</td>
                <td>${e.asset}</td>
                <td class="action-${o.toLowerCase()}">${o}</td>
                <td class="result-${a}">${i}</td>
                <td>${e.profit??`--`}</td>
                <td>${e.confidence??`--`}%</td>
            `,r.appendChild(t)}),console.log(`Rows inserted:`,r.children.length)}catch(e){console.error(`History Error:`,e)}}var o=null,s=null,c=[];function l(){if(o=document.getElementById(`miniChart`),!o)return;let e=window.devicePixelRatio||1;o.width=o.clientWidth*e,o.height=o.clientHeight*e,s=o.getContext(`2d`),s.scale(e,e)}function u(e){c=Array.isArray(e)?e:[],d()}function d(){if(console.log(`Drawing`,c.length,`candles`),!(!s||!o)){if(s.clearRect(0,0,o.clientWidth,o.clientHeight),f(),p(),c.length===0){s.fillStyle=`#94A3B8`,s.font=`15px Segoe UI`,s.fillText(`Waiting for market data...`,20,35);return}m()}}function f(){let e=s.createLinearGradient(0,0,0,o.clientHeight);e.addColorStop(0,`#101827`),e.addColorStop(1,`#0B1220`),s.fillStyle=e,s.fillRect(0,0,o.clientWidth,o.clientHeight)}function p(){let e=o.clientWidth,t=o.clientHeight;s.strokeStyle=`#1E293B`,s.lineWidth=1;for(let n=0;n<=5;n++){let r=t/5*n;s.beginPath(),s.moveTo(0,r),s.lineTo(e,r),s.stroke()}for(let n=0;n<=8;n++){let r=e/8*n;s.beginPath(),s.moveTo(r,0),s.lineTo(r,t),s.stroke()}}function m(){let e=c.slice(-50),t=e.map(e=>e.high),n=e.map(e=>e.low),r=Math.max(...t),i=Math.min(...n),a=(r-i)*.08,l=r+a-(i-a),u=o.width/e.length;e.forEach((t,n)=>{let r=n*u+u/2,a=o.height-(t.open-i)/l*o.height,c=o.height-(t.close-i)/l*o.height,d=o.height-(t.high-i)/l*o.height,f=o.height-(t.low-i)/l*o.height,p=t.close>=t.open;s.strokeStyle=p?`#22C55E`:`#EF4444`,s.fillStyle=p?`#22C55E`:`#EF4444`,s.beginPath(),s.moveTo(r,d),s.lineTo(r,f),s.stroke();let m=Math.min(a,c),h=Math.max(Math.abs(c-a),2);s.fillRect(r-u*.25,m,u*.5,h),n===e.length-1&&(s.shadowColor=s.fillStyle,s.shadowBlur=12,s.fillRect(r-u*.25,m,u*.5,h),s.shadowBlur=0)})}var h=null;function g(){h&&=(clearInterval(h),null)}function _(e){if(!e||e.timestamp==null)return null;let t=e.timestamp;if(typeof t==`number`||!isNaN(Number(t))){let e=Number(t);return e>1e10&&(e/=1e3),e*1e3}let n=Date.parse(String(t));return isNaN(n)?null:n}function v(e){let t=_(e);if(t===null)return null;let n=Number(window.marketTimeframe)||60;if(n<=0)return null;let r=n-Math.floor((Date.now()-t)/1e3)%n;return r>n&&(r=n),r<=0&&(r=n),r}function y(e){if(e===null)return`--:--`;let t=Math.floor(e/60),n=e%60;return String(t).padStart(2,`0`)+`:`+String(n).padStart(2,`0`)}function b(e,t){g();let n=document.getElementById(`countdown`),r=document.getElementById(`countdownLabel`),i=document.getElementById(`action`),a=document.getElementById(`entryMessage`);function o(){let o=e(),s=y(v(t())),c=window.latestSignal||{},l=String(c.bias||c.action||`WAIT`).toUpperCase(),u=Number(c.confidence||0);if(o===`WAITING`){n.innerHTML=s,r.innerHTML=`🟡 WAITING FOR SETUP`,i.innerHTML=`WAIT`,a.innerHTML=`Waiting for a valid trade setup.`;return}if(o===`ANALYZING`){n.innerHTML=s,r.innerHTML=`🔍 ANALYZING CURRENT CANDLE`,(l===`CALL`||l===`PUT`)&&u>0?(i.innerHTML=l,a.innerHTML=`${l} detected • Confidence ${Math.round(u)}% • Enter on the next candle.`):(i.innerHTML=`WAIT`,a.innerHTML=`AI is analyzing the current candle.`);return}if(o===`CONFIRMING`){n.innerHTML=s,r.innerHTML=`🟡 CONFIRMING CURRENT CANDLE`,l===`CALL`||l===`PUT`?i.innerHTML=l:i.innerHTML=`WAIT`,a.innerHTML=`AI is confirming the direction for the next candle.`;return}if(o===`READY`){n.innerHTML=s,r.innerHTML=`🟢 NEXT CANDLE SETUP READY`,l===`CALL`||l===`PUT`?(i.innerHTML=l,a.innerHTML=`${l} • Enter when the new candle opens.`):(i.innerHTML=`READY`,a.innerHTML=`Setup detected. Waiting for the new candle.`);return}if(o===`WAITING_FOR_CANDLE_CLOSE`){n.innerHTML=s,r.innerHTML=`⏳ ENTER ON NEXT CANDLE`,l===`CALL`||l===`PUT`?(i.innerHTML=l,a.innerHTML=`${l} • Enter in ${s} when the new candle opens.`):(i.innerHTML=`WAIT`,a.innerHTML=`AI is analyzing the current candle.`);return}if(o===`ENTRY`){n.innerHTML=`NOW`,r.innerHTML=`🚀 ENTER NOW`,i.innerHTML=c.action||c.bias||`ENTER`,a.innerHTML=`Final signal confirmed. Enter immediately on the new candle.`;return}if(o===`ACTIVE`){n.innerHTML=`--:--`,r.innerHTML=`🟢 TRADE ACTIVE`,i.innerHTML=`ACTIVE`,a.innerHTML=`Trade is currently running.`;return}if(o===`RESULT`){n.innerHTML=`--:--`,r.innerHTML=`🏁 TRADE COMPLETE`,i.innerHTML=`RESULT`,a.innerHTML=`Trade completed. Waiting for the next setup.`;return}n.innerHTML=s,r.innerHTML=`⚪ WAITING`,i.innerHTML=`WAIT`,a.innerHTML=`Waiting for the next valid setup.`}o(),h=setInterval(o,250)}function x(e){let t=document.getElementById(`instruction`),n=document.getElementById(`reason1`),r=document.getElementById(`reason2`),i=document.getElementById(`reason3`),a=document.getElementById(`instructionStatus`);t&&(t.textContent=e.action===`CALL`?`🟢 BUY CALL AT NEXT CANDLE`:e.action===`PUT`?`🔴 BUY PUT AT NEXT CANDLE`:`🟡 WAIT FOR THE NEXT CANDLE`),n&&(n.textContent=e.reasons?.[0]||``),r&&(r.textContent=e.reasons?.[1]||``),i&&(i.textContent=e.reasons?.[2]||``),a&&(a.textContent=e.market_state||`Monitoring market...`)}function S(e){C(`emaStatus`,e.trend===`BULLISH`?`✓ Bullish`:`✓ Bearish`),C(`emaStrength`,e.grade??`--`),C(`rsiStatus`,e.rsi_status??`--`),C(`rsiStrength`,e.rsi_strength??`--`),C(`macdStatus`,e.macd_status??`--`),C(`macdStrength`,e.macd_strength??`--`),C(`volumeStatus`,e.volume_status??`--`),C(`volumeStrength`,e.volume_strength??`--`),C(`structureStatus`,e.structure_status??`--`),C(`structureStrength`,e.structure_strength??`--`),C(`volatilityStatus`,e.volatility_status??`--`),C(`volatilityStrength`,e.volatility_strength??`--`),C(`supportStatus`,e.support_status??`--`),C(`supportStrength`,e.support_strength??`--`),C(`liquidityStatus`,e.liquidity_status??`--`),C(`liquidityStrength`,e.liquidity_strength??`--`)}function C(e,t){let n=document.getElementById(e);n&&(n.textContent=t)}function w(e={},t={}){let n=e.asset||t.asset||`---`,r=Array.isArray(t.candles)?t.candles:[],i=r.length>0?r[r.length-1]:null,a=e.entry_price??i?.close??0;T(`asset`,n),T(`trend`,e.trend),T(`risk`,e.risk),T(`expiration`,e.expiration),T(`probability`,`${Number(e.probability??0).toFixed(1)}%`),T(`grade`,e.grade),T(`session`,e.session),T(`regime`,e.regime),T(`chartAsset`,n),T(`chartPrice`,Number(a).toFixed(5));let o=document.getElementById(`chartChange`);if(o){let t=e.trend||`---`;o.textContent=`${t} • ${e.session||`---`}`,o.className=`market-change`,t===`BULLISH`?o.classList.add(`bullish`):t===`BEARISH`?o.classList.add(`bearish`):o.classList.add(`neutral`)}}function T(e,t){let n=document.getElementById(e);if(!n)return;n.textContent=t??`---`,n.classList.remove(`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`);let r=[`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`],i=String(t??``).toUpperCase();r.includes(i)&&n.classList.add(i)}function E(e){D(e),O(e),k(e),A(e)}function D(e){let t=document.getElementById(`action`);if(!t)return;let n=String(e.action||`WAIT`).toUpperCase(),r=String(e.bias||``).toUpperCase(),i=String(e.market_state||``).toUpperCase(),a=String(e.trade_status||``).toUpperCase(),o=n;switch((i===`ACTIVE`||a===`ACTIVE`)&&n===`WAIT`&&(r===`CALL`||r===`PUT`)&&(o=r),t.textContent=o,t.className=`signal-action`,o){case`CALL`:t.classList.add(`call`);break;case`PUT`:t.classList.add(`put`);break;default:t.classList.add(`wait`);break}}function O(e){let t=document.getElementById(`confidence`);if(!t)return;let n=Number(e.confidence);Number.isFinite(n)?t.textContent=`${Math.round(n)}%`:t.textContent=`--`}function k(e){let t=document.getElementById(`trend`),n=document.getElementById(`risk`),r=document.getElementById(`expiration`);t&&(t.textContent=e.trend??`--`),n&&(n.textContent=e.risk??`--`),r&&(r.textContent=e.expiration??`--`)}function A(e){let t=document.getElementById(`signalStatus`);if(!t)return;let n=String(e.market_state||``).toUpperCase(),r=String(e.trade_status||``).toUpperCase(),i=String(e.bias||``).toUpperCase();if((n===`ACTIVE`||r===`ACTIVE`)&&(i===`CALL`||i===`PUT`)){t.textContent=`ACTIVE TRADE — ${i}`,t.className=`active`;return}if(e.reason&&String(e.reason).trim()!==``){t.textContent=e.reason;return}t.textContent=e.market_state||`Waiting...`}function j(e){let t=document.getElementById(`status`),n=document.getElementById(`statusText`),r=document.getElementById(`updated`),i=document.getElementById(`engineStatus`);!t||!n||(e?(t.textContent=`🟢 Online`,t.className=`status online`,n.textContent=`🟢 Connected`,n.className=`online`,r&&(r.textContent=new Date().toLocaleTimeString()),i&&(i.textContent=`Running`)):(t.textContent=`🔴 Offline`,t.className=`status offline`,n.textContent=`🔴 Disconnected`,n.className=`offline`,i&&(i.textContent=`Offline`)))}async function M(){return new Promise(e=>{chrome.runtime.sendMessage({type:`GET_STATE`},t=>{if(chrome.runtime.lastError){console.error(`Extension state error:`,chrome.runtime.lastError.message),e({});return}e(t||{})})})}async function N(){console.log(`Dashboard initialized`);try{l(),console.log(`Chart initialized`),await P(),console.log(`First refresh complete`),b(()=>window.marketState,()=>window.latestCandle),console.log(`Countdown started`),setInterval(P,1e3)}catch(e){console.error(`Dashboard Error:`,e)}}async function P(){let e,o;try{e=await t(),window.latestSignal=e,window.marketTimeframe=Number(e?.timeframe)||60,j(!0)}catch(t){j(!1),console.error(`API Connection Error:`,t),e={status:`No signal yet`}}try{o=await M()}catch(e){console.error(`Unable to get extension market state:`,e),o={}}let s=e?.asset||o.marketAsset||null,c=Array.isArray(o.marketCandles)?o.marketCandles:[];console.log(`======================================`),console.log(`LIVE MARKET STATE`),console.log(`Asset:`,s),console.log(`Candles:`,c.length),console.log(`======================================`),window.marketState=e?.market_state||`WAITING`;try{E(e),x(e),S(e)}catch(e){console.error(`AI UI update error:`,e)}try{w(e,{asset:s,candles:c})}catch(e){console.error(`Market UI update error:`,e)}try{if(c.length===0&&s){console.log(`No local candles yet. Requesting backend candles for:`,s);try{c=await n(s)}catch(e){console.warn(`Backend candle request failed:`,e)}}c.length>0?(window.latestCandle=c[c.length-1],console.log(`Latest candle:`,window.latestCandle),console.log(`Total candles:`,c.length),u(c)):(window.latestCandle=null,console.warn(`No candles available yet.`))}catch(e){console.error(`Candle UI error:`,e)}try{r(Number(e?.confidence??0))}catch(e){console.error(`Confidence UI error:`,e)}if(window.tradeRefreshTimer||(window.tradeRefreshTimer=Date.now()),Date.now()-window.tradeRefreshTimer>5e3){try{await i(),await a()}catch(e){console.error(`Trade data refresh error:`,e)}window.tradeRefreshTimer=Date.now()}}var F=`https://pocket-option-signal-api-production.up.railway.app`,I=`pocketOptionAuthToken`,L=`pocketOptionUser`;async function R(){return(await chrome.storage.local.get(I))[I]||null}async function z(e,t){let n=await fetch(`${F}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to login.`);return await chrome.storage.local.set({[I]:r.token,[L]:r.user}),r}async function B(e,t){let n=await fetch(`${F}/auth/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to create account.`);return r}async function V(){let e=await R();if(!e)return null;try{let t=await fetch(`${F}/auth/me`,{method:`GET`,headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return await H(),null;let n=await t.json();return await chrome.storage.local.set({[L]:n.user}),n.user}catch(e){return console.error(`Session verification failed:`,e),null}}async function H(){let e=await R();if(e)try{await fetch(`${F}/auth/logout`,{method:`POST`,headers:{Authorization:`Bearer ${e}`}})}catch(e){console.warn(`Logout request failed:`,e)}await chrome.storage.local.remove([I,L])}function U(e){if(document.getElementById(`authScreen`))return;let t=document.createElement(`div`);t.id=`authScreen`,t.innerHTML=`

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
    `,document.body.prepend(t);let n=document.getElementById(`loginView`),r=document.getElementById(`registerView`);document.getElementById(`showRegister`).addEventListener(`click`,()=>{n.classList.add(`hidden`),r.classList.remove(`hidden`)}),document.getElementById(`showLogin`).addEventListener(`click`,()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`)}),document.getElementById(`loginForm`).addEventListener(`submit`,async n=>{n.preventDefault();let r=document.getElementById(`loginEmail`).value.trim(),i=document.getElementById(`loginPassword`).value,a=document.getElementById(`loginButton`),o=document.getElementById(`loginMessage`);a.disabled=!0,a.textContent=`SIGNING IN...`,o.textContent=``,o.className=`auth-message`;try{await z(r,i),o.textContent=`Login successful.`,o.classList.add(`success`),t.remove(),e()}catch(e){o.textContent=e.message,o.classList.add(`error`),a.disabled=!1,a.textContent=`LOGIN`}}),document.getElementById(`registerForm`).addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`registerEmail`).value.trim(),i=document.getElementById(`registerPassword`).value,a=document.getElementById(`registerConfirm`).value,o=document.getElementById(`registerButton`),s=document.getElementById(`registerMessage`);if(i!==a){s.textContent=`Passwords do not match.`,s.className=`auth-message error`;return}o.disabled=!0,o.textContent=`CREATING ACCOUNT...`,s.textContent=``,s.className=`auth-message`;try{await B(t,i),s.textContent=`Account created. You can now log in.`,s.classList.add(`success`),document.getElementById(`registerForm`).reset(),setTimeout(()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`),document.getElementById(`loginEmail`).value=t},1e3)}catch(e){s.textContent=e.message,s.classList.add(`error`)}finally{o.disabled=!1,o.textContent=`CREATE ACCOUNT`}})}function W(e){let t=document.getElementById(`accountEmail`),n=document.getElementById(`logoutButton`),r=document.getElementById(`accountStatus`);if(!t||!n){console.warn(`Account UI elements not found.`);return}t.textContent=e?.email||`Unknown User`,r&&(r.textContent=`● ACTIVE`),n.addEventListener(`click`,async()=>{n.disabled=!0,n.textContent=`LOGGING OUT...`;try{await H()}catch(e){console.error(`Logout error:`,e)}window.location.reload()})}function G(e){console.log(`Authentication successful. Starting dashboard.`),W(e),N()}document.addEventListener(`DOMContentLoaded`,async()=>{console.log(`Checking authentication...`);let e=await V();if(e){console.log(`Authenticated user:`,e.email),G(e);return}console.log(`User is not authenticated.`),U(async()=>{let e=await V();if(!e){console.error(`Login succeeded but session verification failed.`);return}G(e)})});