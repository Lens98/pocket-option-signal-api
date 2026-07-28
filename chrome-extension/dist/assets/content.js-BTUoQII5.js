(function(){var e=class{constructor(e,t,n){this.asset=e,this.timestamp=t,this.price=n}},t=class{constructor(e=10){this.timeframe=e,this.current=null}update(e){let t=Math.floor(Number(e.timestamp)/this.timeframe)*this.timeframe;if(!this.current)return this.current={asset:e.asset,timeframe:this.timeframe.toString(),timestamp:t.toString(),open:e.price,high:e.price,low:e.price,close:e.price,volume:1},null;if(Number(this.current.timestamp)===t)return this.current.high=Math.max(this.current.high,e.price),this.current.low=Math.min(this.current.low,e.price),this.current.close=e.price,this.current.volume++,null;let n={...this.current};return this.current={asset:e.asset,timeframe:this.timeframe.toString(),timestamp:t.toString(),open:e.price,high:e.price,low:e.price,close:e.price,volume:1},n}},n=class{constructor(){this.builders={}}update(e){this.builders[e.asset]||(console.log(`Creating CandleBuilder for`,e.asset),this.builders[e.asset]=new t(10));let n=this.builders[e.asset].update(e);return n&&(console.log(`========== CLOSED CANDLE ==========`),console.log(n)),n}},r=`http://127.0.0.1:8000`;async function i(e,t,n){let i={asset:e,timeframe:String(t),candles:n.map(e=>({timestamp:String(e.timestamp),open:e.open,high:e.high,low:e.low,close:e.close,volume:e.volume}))};console.log(`======================================`),console.log(`📤 Sending Candle History`),console.log(`Asset:`,e),console.log(`Candles:`,i.candles.length),console.log(`Unique:`,new Set(i.candles.map(e=>e.timestamp)).size),i.candles.length>0&&(console.log(`First:`,i.candles[0].timestamp),console.log(`Last:`,i.candles[i.candles.length-1].timestamp)),console.log(i),console.log(`======================================`);try{let e=await fetch(`${r}/market/update`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(i)});console.log(`HTTP Status:`,e.status);let t=await e.text();return console.log(t),t}catch(e){return console.error(`❌ FastAPI Error`),console.error(e),null}}var a=class{constructor(e=300){this.maxCandles=e,this.history={}}add(e){return this.history[e.asset]||(this.history[e.asset]=[]),this.history[e.asset].push(e),this.history[e.asset].length>this.maxCandles&&this.history[e.asset].shift(),this.history[e.asset]}get(e){return this.history[e]||[]}clear(e){this.history[e]=[]}},o=`pai-window`,s={left:80,top:70,width:1200,height:650,minimized:!1,maximized:!1};function c(){try{let e=localStorage.getItem(o);return e?{...s,...JSON.parse(e)}:s}catch(e){return console.error(`Failed to load window state:`,e),s}}function l(e){try{localStorage.setItem(o,JSON.stringify(e))}catch(e){console.error(`Failed to save window state:`,e)}}var u=700,d=400,f=window.innerWidth,p=window.innerHeight;function m(e){[`n`,`s`,`e`,`w`,`ne`,`nw`,`se`,`sw`].forEach(t=>{let n=document.createElement(`div`);n.className=`resize-handle resize-${t}`,e.appendChild(n),n.addEventListener(`mousedown`,n=>{h(n,e,t)})})}function h(e,t,n){e.preventDefault();let r=e.clientX,i=e.clientY,a=t.offsetWidth,o=t.offsetHeight,s=t.offsetLeft,c=t.offsetTop;function m(e){let l=a,m=o,h=s,g=c,_=e.clientX-r,v=e.clientY-i;n.includes(`e`)&&(l=a+_),n.includes(`s`)&&(m=o+v),n.includes(`w`)&&(l=a-_,h=s+_),n.includes(`n`)&&(m=o-v,g=c+v),l=Math.max(u,Math.min(l,f)),m=Math.max(d,Math.min(m,p)),t.style.width=`${l}px`,t.style.height=`${m}px`,t.style.left=`${h}px`,t.style.top=`${g}px`}function h(){document.removeEventListener(`mousemove`,m),document.removeEventListener(`mouseup`,h),l({left:t.offsetLeft,top:t.offsetTop,width:t.offsetWidth,height:t.offsetHeight,minimized:!1,maximized:!1})}document.addEventListener(`mousemove`,m),document.addEventListener(`mouseup`,h)}console.log(`✅ windowManager.js loaded`);function g(){if(console.log(`🚀 createDashboard() START`),document.getElementById(`pocket-ai-dashboard`))return;let e=document.createElement(`div`);e.id=`pocket-ai-dashboard`,e.innerHTML=`

  <div id="pai-header">

    <div id="pai-title">
        🤖 Pocket Option AI PRO
    </div>

    <div id="pai-status">
        🟢 LIVE
    </div>

    <div id="pai-buttons">
        <button id="pai-minimize">—</button>
        <button id="pai-close">✕</button>
    </div>

</div>

<div id="pai-grid">

    <section id="signal-panel" class="pai-card">
        <h2>Signal</h2>
    </section>

    <section id="trade-panel" class="pai-card">
        <h2>Trade Information</h2>
    </section>

    <section id="status-panel" class="pai-card">
        <h2>System Status</h2>
    </section>

    <section id="analysis-panel" class="pai-card">
        <h2>AI Analysis</h2>
    </section>

    <section id="chart-panel" class="pai-card">
        <h2>Live Chart</h2>
    </section>

    <section id="history-panel" class="pai-card">
        <h2>Signal History</h2>
    </section>

    <section id="stats-panel" class="pai-card">
        <h2>Statistics</h2>
    </section>

</div>

`,document.documentElement.appendChild(e),console.log(`Dashboard parent:`,e.parentElement),console.log(`✅ Dashboard Added`),m(e);let t=c();e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`;let n=e.querySelector(`#pai-header`),r=!1,i=0,a=0;n.addEventListener(`mousedown`,t=>{r=!0,i=t.clientX-e.offsetLeft,a=t.clientY-e.offsetTop,e.style.userSelect=`none`}),document.addEventListener(`mousemove`,t=>{r&&(e.style.left=`${t.clientX-i}px`,e.style.top=`${t.clientY-a}px`)}),document.addEventListener(`mouseup`,()=>{r&&(r=!1,e.style.userSelect=``,l({left:e.offsetLeft,top:e.offsetTop,width:e.offsetWidth,height:e.offsetHeight,minimized:!1,maximized:!1}))}),e.querySelector(`#pai-close`).addEventListener(`click`,()=>{e.remove()}),e.querySelector(`#pai-minimize`).addEventListener(`click`,()=>{let n=e.querySelector(`#pai-grid`);n.style.display===`none`?(n.style.display=`grid`,e.style.height=`${t.height}px`):(n.style.display=`none`,e.style.height=`52px`)}),console.log(`✅ RC2 Dashboard Loaded`)}var _=new class{constructor(){this.started=!1,this.observer=null}start(){this.started||(this.started=!0,console.log(`🚀 Overlay Manager Started`),this.waitForPage())}waitForPage(){let e=()=>document.body?!!document.querySelector(`canvas`):!1;if(e()){this.attachDashboard();return}this.observer=new MutationObserver(()=>{e()&&(this.observer.disconnect(),this.attachDashboard())}),this.observer.observe(document.documentElement,{childList:!0,subtree:!0})}attachDashboard(){let e=()=>{document.getElementById(`pocket-ai-dashboard`)||(console.log(`🟢 Recreating Dashboard...`),g())};e(),new MutationObserver(()=>{e()}).observe(document.documentElement,{childList:!0,subtree:!0})}};console.log(`✅ Content script loaded`);var v=new n,y=new a(300),b=document.createElement(`script`);b.src=chrome.runtime.getURL(`src/injected.js`),b.onload=()=>b.remove(),(document.head||document.documentElement).appendChild(b),window.addEventListener(`message`,async t=>{if(t.source!==window||t.data.type!==`POCKET_OPTION_TICK`)return;let n=new e(t.data.data.asset,t.data.data.timestamp,t.data.data.price),r=v.update(n);if(!r)return;y.add(r);let a=y.get(r.asset);console.log(`======================================`),console.log(`📊 LOCAL HISTORY`),console.log(`Asset:`,r.asset),console.log(`History Size:`,a.length),a.length>0&&(console.log(`First Timestamp:`,a[0].timestamp),console.log(`Last Timestamp:`,a[a.length-1].timestamp),console.log(`Unique Timestamps:`,new Set(a.map(e=>String(e.timestamp))).size)),console.log(`======================================`),await i(r.asset,r.timeframe,a)}),_.start();})()
