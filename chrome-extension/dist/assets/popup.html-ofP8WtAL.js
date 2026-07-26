(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t={CALL:0,PUT:0,WAIT:0};async function n(){let t=document.getElementById(`status`);try{let n=await(await fetch(`http://127.0.0.1:8000/signal`)).json();if(t.className=`status online`,t.innerHTML=`● Connected`,n.status){document.getElementById(`action`).innerHTML=`WAIT`,document.getElementById(`action`).className=`action wait`,document.getElementById(`confidenceText`).innerHTML=`0%`,document.getElementById(`gauge`).style.strokeDashoffset=377,document.getElementById(`trend`).innerHTML=`---`,document.getElementById(`risk`).innerHTML=`---`,document.getElementById(`asset`).innerHTML=`---`,document.getElementById(`expiration`).innerHTML=`---`,document.getElementById(`updated`).innerHTML=new Date().toLocaleTimeString(),o(),e.unshift({asset:n.asset,action:n.action,confidence:n.confidence}),e.length>10&&e.pop(),r(),a(n.action);return}let s=document.getElementById(`action`);s.innerHTML=n.action,s.className=`action`,n.action===`CALL`?s.classList.add(`call`):n.action===`PUT`?s.classList.add(`put`):s.classList.add(`wait`);let c=n.confidence;document.getElementById(`confidenceText`).innerHTML=`${c}%`;let l=377-c/100*377,u=document.getElementById(`gauge`);u.style.strokeDashoffset=l,n.action===`CALL`?u.style.stroke=`#22C55E`:n.action===`PUT`?u.style.stroke=`#EF4444`:u.style.stroke=`#F59E0B`,document.getElementById(`trend`).innerHTML=n.trend,document.getElementById(`risk`).innerHTML=n.risk,document.getElementById(`asset`).innerHTML=n.asset,document.getElementById(`expiration`).innerHTML=n.expiration,document.getElementById(`updated`).innerHTML=new Date().toLocaleTimeString(),i(n)}catch(e){console.error(e),t.className=`status offline`,t.innerHTML=`● Offline`}}n(),setInterval(n,1e3);function r(){let t=document.getElementById(`history`);t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`div`);n.className=`history-item`;let r=`wait-text`;e.action===`CALL`&&(r=`call-text`),e.action===`PUT`&&(r=`put-text`),n.innerHTML=`

            <span class="${r}">

                ${e.action}

            </span>

            <span>

                ${e.confidence}%

            </span>

            <span>

                ${e.asset}

            </span>

        `,t.appendChild(n)}),e.length===0&&(t.innerHTML=`No signals yet`)}function i(e){let t=document.getElementById(`analysis`);t.innerHTML=``,e.reasons?e.reasons.forEach(n=>{let r=document.createElement(`div`);r.className=`reason`;let i=`⚠`,a=`warning`;e.action===`CALL`&&(i=`✔`,a=`good`),e.action===`PUT`&&(i=`✔`,a=`bad`),r.innerHTML=`
                <span class="${a}">
                    ${i}
                </span>
                ${n}
            `,t.appendChild(r)}):t.innerHTML=`Waiting for analysis...`}function a(e){t[e]!==void 0&&t[e]++,document.getElementById(`callCount`).innerHTML=t.CALL,document.getElementById(`putCount`).innerHTML=t.PUT,document.getElementById(`waitCount`).innerHTML=t.WAIT,document.getElementById(`totalCount`).innerHTML=t.CALL+t.PUT+t.WAIT}function o(){let e=document.getElementById(`miniChart`);if(!e)return;let t=e.getContext(`2d`),n=e.width,r=e.height;t.clearRect(0,0,n,r),t.fillStyle=`#0F172A`,t.fillRect(0,0,n,r),t.strokeStyle=`#1E293B`,t.lineWidth=1;for(let e=1;e<5;e++){let i=r/5*e;t.beginPath(),t.moveTo(0,i),t.lineTo(n,i),t.stroke()}let i=[{open:50,high:70,low:45,close:65},{open:65,high:80,low:60,close:72},{open:72,high:78,low:58,close:61},{open:61,high:68,low:55,close:66},{open:66,high:90,low:62,close:88},{open:88,high:92,low:74,close:78},{open:78,high:95,low:70,close:91},{open:91,high:98,low:84,close:95},{open:95,high:99,low:80,close:82},{open:82,high:86,low:75,close:84},{open:84,high:100,low:82,close:98},{open:98,high:105,low:90,close:93}],a=Math.max(...i.map(e=>e.high)),o=Math.min(...i.map(e=>e.low)),s=e=>r-(e-o)/(a-o)*(r-20)-10;i.forEach((e,n)=>{let r=15+n*26,i=s(e.open),a=s(e.close),o=s(e.high),c=s(e.low),l=e.close>=e.open;t.strokeStyle=l?`#22C55E`:`#EF4444`,t.lineWidth=2,t.beginPath(),t.moveTo(r+14/2,o),t.lineTo(r+14/2,c),t.stroke(),t.fillStyle=l?`#22C55E`:`#EF4444`;let u=Math.min(i,a),d=Math.max(Math.abs(a-i),3);t.fillRect(r,u,14,d)})}