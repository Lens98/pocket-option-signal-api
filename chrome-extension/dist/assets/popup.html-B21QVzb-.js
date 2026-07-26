(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[];async function t(){let t=document.getElementById(`status`);try{let r=await(await fetch(`http://127.0.0.1:8000/signal`)).json();if(t.className=`status online`,t.innerHTML=`● Connected`,r.status){document.getElementById(`action`).innerHTML=`WAIT`,document.getElementById(`action`).className=`action wait`,document.getElementById(`confidenceText`).innerHTML=`0%`,document.getElementById(`gauge`).style.strokeDashoffset=377,document.getElementById(`trend`).innerHTML=`---`,document.getElementById(`risk`).innerHTML=`---`,document.getElementById(`asset`).innerHTML=`---`,document.getElementById(`expiration`).innerHTML=`---`,document.getElementById(`updated`).innerHTML=new Date().toLocaleTimeString(),e.unshift({asset:r.asset,action:r.action,confidence:r.confidence}),e.length>10&&e.pop(),n();return}let i=document.getElementById(`action`);i.innerHTML=r.action,i.className=`action`,r.action===`CALL`?i.classList.add(`call`):r.action===`PUT`?i.classList.add(`put`):i.classList.add(`wait`);let a=r.confidence;document.getElementById(`confidenceText`).innerHTML=`${a}%`;let o=377-a/100*377,s=document.getElementById(`gauge`);s.style.strokeDashoffset=o,r.action===`CALL`?s.style.stroke=`#22C55E`:r.action===`PUT`?s.style.stroke=`#EF4444`:s.style.stroke=`#F59E0B`,document.getElementById(`trend`).innerHTML=r.trend,document.getElementById(`risk`).innerHTML=r.risk,document.getElementById(`asset`).innerHTML=r.asset,document.getElementById(`expiration`).innerHTML=r.expiration,document.getElementById(`updated`).innerHTML=new Date().toLocaleTimeString()}catch(e){console.error(e),t.className=`status offline`,t.innerHTML=`● Offline`}}t(),setInterval(t,1e3);function n(){let t=document.getElementById(`history`);t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`div`);n.className=`history-item`;let r=`wait-text`;e.action===`CALL`&&(r=`call-text`),e.action===`PUT`&&(r=`put-text`),n.innerHTML=`

            <span class="${r}">

                ${e.action}

            </span>

            <span>

                ${e.confidence}%

            </span>

            <span>

                ${e.asset}

            </span>

        `,t.appendChild(n)}),e.length===0&&(t.innerHTML=`No signals yet`)}