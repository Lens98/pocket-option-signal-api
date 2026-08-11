(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://pocket-option-signal-api-production.up.railway.app`;async function t(){let t=await fetch(`${e}/signal`);if(!t.ok)throw Error(`Unable to load signal`);return await t.json()}async function n(t){let n=encodeURIComponent(t);console.log(`Loading candles for:`,t);let r=await fetch(`${e}/candles/${n}`);if(console.log(`Status:`,r.status),!r.ok)throw Error(`Unable to load candles`);let i=await r.json();return console.log(`Candles returned:`,i.length),i}function r(e){let t=Number(e??0),n=document.getElementById(`confidence`),r=document.getElementById(`gauge`);if(!n){console.error(`Missing element: confidenceText`);return}if(!r)return;n.innerHTML=`${t}%`;let i=377-t/100*377;r.style.strokeDashoffset=i,t>=80?r.style.stroke=`#22C55E`:t>=60?r.style.stroke=`#FACC15`:r.style.stroke=`#EF4444`}async function i(){try{let e=await(await fetch(`https://pocket-option-signal-api-production.up.railway.app/trade/statistics`)).json(),t=document.getElementById(`winRate`),n=document.getElementById(`wins`),r=document.getElementById(`losses`),i=document.getElementById(`profit`),a=document.getElementById(`accuracy`);t&&(t.innerHTML=`${e.win_rate}%`),n&&(n.innerHTML=e.wins),r&&(r.innerHTML=e.losses),i&&(i.innerHTML=`$${e.profit??0}`),a&&(a.innerHTML=e.win_rate>=80?`High`:e.win_rate>=60?`Medium`:`Low`)}catch(e){console.error(`Statistics Error:`,e)}}async function a(){console.log(`🔥 loadTradeHistory() called`);try{let e=await fetch(`https://pocket-option-signal-api-production.up.railway.app/trade/all`);console.log(`Response Status:`,e.status);let t=await e.json();console.log(`Trades received:`,t),console.log(`Trade count:`,t.length);let n=document.getElementById(`historyCount`);n&&(n.textContent=`${t.length} Trades`);let r=document.getElementById(`historyBody`);if(!r){console.error(`Missing element: historyBody`);return}r.innerHTML=``,t.sort((e,t)=>new Date(t.entry_time)-new Date(e.entry_time)),t.slice(0,50).forEach(e=>{let t=document.createElement(`tr`),n=e.entry_time?new Date(e.entry_time).toLocaleTimeString():`--`,i=e.result??`--`,a=i===`--`?`pending`:i.toLowerCase(),o=e.action??`WAIT`;t.innerHTML=`
                <td>${n}</td>
                <td>${e.asset}</td>
                <td class="action-${o.toLowerCase()}">${o}</td>
                <td class="result-${a}">${i}</td>
                <td>${e.profit??`--`}</td>
                <td>${e.confidence??`--`}%</td>
            `,r.appendChild(t)}),console.log(`Rows inserted:`,r.children.length)}catch(e){console.error(`History Error:`,e)}}var o=null,s=null,c=[];function l(){if(o=document.getElementById(`miniChart`),!o)return;let e=window.devicePixelRatio||1;o.width=o.clientWidth*e,o.height=o.clientHeight*e,s=o.getContext(`2d`),s.scale(e,e)}function u(e){c=Array.isArray(e)?e:[],d()}function d(){if(console.log(`Drawing`,c.length,`candles`),!(!s||!o)){if(s.clearRect(0,0,o.clientWidth,o.clientHeight),f(),p(),c.length===0){s.fillStyle=`#94A3B8`,s.font=`15px Segoe UI`,s.fillText(`Waiting for market data...`,20,35);return}m()}}function f(){let e=s.createLinearGradient(0,0,0,o.clientHeight);e.addColorStop(0,`#101827`),e.addColorStop(1,`#0B1220`),s.fillStyle=e,s.fillRect(0,0,o.clientWidth,o.clientHeight)}function p(){let e=o.clientWidth,t=o.clientHeight;s.strokeStyle=`#1E293B`,s.lineWidth=1;for(let n=0;n<=5;n++){let r=t/5*n;s.beginPath(),s.moveTo(0,r),s.lineTo(e,r),s.stroke()}for(let n=0;n<=8;n++){let r=e/8*n;s.beginPath(),s.moveTo(r,0),s.lineTo(r,t),s.stroke()}}function m(){let e=c.slice(-50),t=e.map(e=>e.high),n=e.map(e=>e.low),r=Math.max(...t),i=Math.min(...n),a=(r-i)*.08,l=r+a-(i-a),u=o.width/e.length;e.forEach((t,n)=>{let r=n*u+u/2,a=o.height-(t.open-i)/l*o.height,c=o.height-(t.close-i)/l*o.height,d=o.height-(t.high-i)/l*o.height,f=o.height-(t.low-i)/l*o.height,p=t.close>=t.open;s.strokeStyle=p?`#22C55E`:`#EF4444`,s.fillStyle=p?`#22C55E`:`#EF4444`,s.beginPath(),s.moveTo(r,d),s.lineTo(r,f),s.stroke();let m=Math.min(a,c),h=Math.max(Math.abs(c-a),2);s.fillRect(r-u*.25,m,u*.5,h),n===e.length-1&&(s.shadowColor=s.fillStyle,s.shadowBlur=12,s.fillRect(r-u*.25,m,u*.5,h),s.shadowBlur=0)})}var h=null;function g(){h&&=(clearInterval(h),null)}function _(e){g();let t=document.getElementById(`countdown`),n=document.getElementById(`countdownLabel`),r=document.getElementById(`action`),i=document.getElementById(`entryMessage`);function a(){let a=e();if(a===`WAITING`){t.innerHTML=`--:--`,n.innerHTML=`🟡 WAITING FOR SETUP`,r.innerHTML=`WAIT`,i.innerHTML=`Waiting for a valid trade setup.`;return}if(a===`ANALYZING`){t.innerHTML=`--:--`,n.innerHTML=`🔍 ANALYZING`,r.innerHTML=`WAIT`,i.innerHTML=`Analyzing the current market setup.`;return}if(a===`CONFIRMING`){t.innerHTML=`--:--`,n.innerHTML=`🟡 CONFIRMING`,r.innerHTML=`WAIT`,i.innerHTML=`Waiting for stronger confirmation.`;return}if(a===`READY`){t.innerHTML=`--:--`,n.innerHTML=`🟢 PREPARING ENTRY`,r.innerHTML=`READY`,i.innerHTML=`Setup detected. Waiting for confirmation.`;return}if(a===`WAITING_FOR_CANDLE_CLOSE`){t.innerHTML=`--:--`,n.innerHTML=`⏳ WAITING FOR CANDLE CLOSE`,r.innerHTML=`WAIT`,i.innerHTML=`Analyzing the current candle. Final signal will be confirmed when it closes.`;return}if(a===`ENTRY`){t.innerHTML=`NOW`,n.innerHTML=`🚀 ENTER NOW`,r.innerHTML=`🚀 ENTER NOW`,i.innerHTML=`Final signal confirmed. Enter immediately on the new candle.`;return}if(a===`ACTIVE`){t.innerHTML=`--:--`,n.innerHTML=`🟢 TRADE ACTIVE`,r.innerHTML=`ACTIVE`,i.innerHTML=`Trade is currently running.`;return}if(a===`RESULT`){t.innerHTML=`--:--`,n.innerHTML=`🏁 TRADE COMPLETE`,r.innerHTML=`RESULT`,i.innerHTML=`Trade completed. Waiting for the next setup.`;return}t.innerHTML=`--:--`,n.innerHTML=`⚪ WAITING`,r.innerHTML=`WAIT`,i.innerHTML=`Waiting for the next valid setup.`}a(),h=setInterval(a,1e3)}function v(e){let t=document.getElementById(`instruction`),n=document.getElementById(`reason1`),r=document.getElementById(`reason2`),i=document.getElementById(`reason3`),a=document.getElementById(`instructionStatus`);t&&(t.textContent=e.action===`CALL`?`🟢 BUY CALL AT NEXT CANDLE`:e.action===`PUT`?`🔴 BUY PUT AT NEXT CANDLE`:`🟡 WAIT FOR THE NEXT CANDLE`),n&&(n.textContent=e.reasons?.[0]||``),r&&(r.textContent=e.reasons?.[1]||``),i&&(i.textContent=e.reasons?.[2]||``),a&&(a.textContent=e.market_state||`Monitoring market...`)}function y(e){b(`emaStatus`,e.trend===`BULLISH`?`✓ Bullish`:`✓ Bearish`),b(`emaStrength`,e.grade??`--`),b(`rsiStatus`,e.rsi_status??`--`),b(`rsiStrength`,e.rsi_strength??`--`),b(`macdStatus`,e.macd_status??`--`),b(`macdStrength`,e.macd_strength??`--`),b(`volumeStatus`,e.volume_status??`--`),b(`volumeStrength`,e.volume_strength??`--`),b(`structureStatus`,e.structure_status??`--`),b(`structureStrength`,e.structure_strength??`--`),b(`volatilityStatus`,e.volatility_status??`--`),b(`volatilityStrength`,e.volatility_strength??`--`),b(`supportStatus`,e.support_status??`--`),b(`supportStrength`,e.support_strength??`--`),b(`liquidityStatus`,e.liquidity_status??`--`),b(`liquidityStrength`,e.liquidity_strength??`--`)}function b(e,t){let n=document.getElementById(e);n&&(n.textContent=t)}function x(e){S(`asset`,e.asset),S(`trend`,e.trend),S(`risk`,e.risk),S(`expiration`,e.expiration),S(`probability`,`${Number(e.probability??0).toFixed(1)}%`),S(`grade`,e.grade),S(`session`,e.session),S(`regime`,e.regime),S(`chartAsset`,e.asset),S(`chartPrice`,Number(e.entry_price??0).toFixed(5));let t=document.getElementById(`chartChange`);t&&(t.textContent=`${e.trend} • ${e.session}`,t.className=`market-change`,e.trend===`BULLISH`?t.classList.add(`bullish`):e.trend===`BEARISH`?t.classList.add(`bearish`):t.classList.add(`neutral`))}function S(e,t){let n=document.getElementById(e);if(!n)return;n.textContent=t??`---`,n.classList.remove(`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`);let r=[`BULLISH`,`BEARISH`,`SIDEWAYS`,`LOW`,`MEDIUM`,`HIGH`],i=String(t??``).toUpperCase();r.includes(i)&&n.classList.add(i)}function C(e){w(e),T(e),E(e),D(e)}function w(e){let t=document.getElementById(`action`);if(!t)return;let n=(e.action||`WAIT`).toUpperCase();switch(t.textContent=n,t.className=`signal-action`,n){case`CALL`:t.classList.add(`call`);break;case`PUT`:t.classList.add(`put`);break;default:t.classList.add(`wait`);break}}function T(e){let t=document.getElementById(`confidence`);t&&(t.textContent=`${Math.round(e.confidence??0)}%`)}function E(e){let t=document.getElementById(`trend`),n=document.getElementById(`risk`),r=document.getElementById(`expiration`);t&&(t.textContent=e.trend??`--`),n&&(n.textContent=e.risk??`--`),r&&(r.textContent=e.expiration??`--`)}function D(e){let t=document.getElementById(`signalStatus`);t&&(e.reason&&e.reason.trim()!==``?t.textContent=e.reason:t.textContent=e.market_state||`Waiting...`)}function O(e){let t=document.getElementById(`status`),n=document.getElementById(`statusText`),r=document.getElementById(`updated`),i=document.getElementById(`engineStatus`);!t||!n||(e?(t.innerHTML=`🟢 Online`,t.className=`status online`,n.textContent=`🟢 Connected`,n.className=`online`,r&&(r.textContent=new Date().toLocaleTimeString()),i&&(i.textContent=`Running`)):(t.innerHTML=`🔴 Offline`,t.className=`status offline`,n.textContent=`🔴 Disconnected`,n.className=`offline`))}async function k(){console.log(`Dashboard initialized`);try{l(),console.log(`Chart initialized`),await A(),console.log(`First refresh complete`),_(()=>window.marketState),console.log(`Countdown started`),setInterval(A,1e3)}catch(e){console.error(`Dashboard Error:`,e)}}async function A(){let e;try{e=await t(),O(!0)}catch(e){O(!1),console.error(`API Connection Error:`,e);return}try{if(window.marketState=e.market_state??`WAITING`,C(e),v(e),y(e),x(e),console.log(`Requesting candles for:`,e.asset),!e.asset){console.warn(`No asset available for candles`);return}let t=await n(e.asset);console.log(`Candles from backend:`,t),console.log(`Number of candles:`,t.length),t.length>0&&console.log(`First candle:`,t[0]),u(t),r(e.confidence||0),window.tradeRefreshTimer||(window.tradeRefreshTimer=Date.now()),Date.now()-window.tradeRefreshTimer>5e3&&(await i(),await a(),window.tradeRefreshTimer=Date.now())}catch(e){console.error(`Dashboard Error:`,e)}}var j=`https://pocket-option-signal-api-production.up.railway.app`,M=`pocketOptionAuthToken`,N=`pocketOptionUser`;async function P(){return(await chrome.storage.local.get(M))[M]||null}async function F(e,t){let n=await fetch(`${j}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to login.`);return await chrome.storage.local.set({[M]:r.token,[N]:r.user}),r}async function I(e,t){let n=await fetch(`${j}/auth/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:e,password:t})}),r=await n.json();if(!n.ok)throw Error(r.detail||`Unable to create account.`);return r}async function L(){let e=await P();if(!e)return null;try{let t=await fetch(`${j}/auth/me`,{method:`GET`,headers:{Authorization:`Bearer ${e}`}});if(!t.ok)return await R(),null;let n=await t.json();return await chrome.storage.local.set({[N]:n.user}),n.user}catch(e){return console.error(`Session verification failed:`,e),null}}async function R(){let e=await P();if(e)try{await fetch(`${j}/auth/logout`,{method:`POST`,headers:{Authorization:`Bearer ${e}`}})}catch(e){console.warn(`Logout request failed:`,e)}await chrome.storage.local.remove([M,N])}function z(e){if(document.getElementById(`authScreen`))return;let t=document.createElement(`div`);t.id=`authScreen`,t.innerHTML=`

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
    `,document.body.prepend(t);let n=document.getElementById(`loginView`),r=document.getElementById(`registerView`);document.getElementById(`showRegister`).addEventListener(`click`,()=>{n.classList.add(`hidden`),r.classList.remove(`hidden`)}),document.getElementById(`showLogin`).addEventListener(`click`,()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`)}),document.getElementById(`loginForm`).addEventListener(`submit`,async n=>{n.preventDefault();let r=document.getElementById(`loginEmail`).value.trim(),i=document.getElementById(`loginPassword`).value,a=document.getElementById(`loginButton`),o=document.getElementById(`loginMessage`);a.disabled=!0,a.textContent=`SIGNING IN...`,o.textContent=``,o.className=`auth-message`;try{await F(r,i),o.textContent=`Login successful.`,o.classList.add(`success`),t.remove(),e()}catch(e){o.textContent=e.message,o.classList.add(`error`),a.disabled=!1,a.textContent=`LOGIN`}}),document.getElementById(`registerForm`).addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`registerEmail`).value.trim(),i=document.getElementById(`registerPassword`).value,a=document.getElementById(`registerConfirm`).value,o=document.getElementById(`registerButton`),s=document.getElementById(`registerMessage`);if(i!==a){s.textContent=`Passwords do not match.`,s.className=`auth-message error`;return}o.disabled=!0,o.textContent=`CREATING ACCOUNT...`,s.textContent=``,s.className=`auth-message`;try{await I(t,i),s.textContent=`Account created. You can now log in.`,s.classList.add(`success`),document.getElementById(`registerForm`).reset(),setTimeout(()=>{r.classList.add(`hidden`),n.classList.remove(`hidden`),document.getElementById(`loginEmail`).value=t},1e3)}catch(e){s.textContent=e.message,s.classList.add(`error`)}finally{o.disabled=!1,o.textContent=`CREATE ACCOUNT`}})}function B(e){let t=document.getElementById(`accountEmail`),n=document.getElementById(`logoutButton`);if(!t||!n){console.warn(`Account UI elements not found.`);return}t.textContent=e?.email||`Unknown User`,n.addEventListener(`click`,async()=>{n.disabled=!0,n.textContent=`LOGGING OUT...`;try{await R()}catch(e){console.error(`Logout error:`,e)}window.location.reload()})}function V(e){console.log(`Authentication successful. Starting dashboard.`),B(e),k()}document.addEventListener(`DOMContentLoaded`,async()=>{console.log(`Checking authentication...`);let e=await L();if(e){console.log(`Authenticated user:`,e.email),V(e);return}console.log(`User is not authenticated.`),z(async()=>{let e=await L();if(!e){console.error(`Login succeeded but session verification failed.`);return}V(e)})});