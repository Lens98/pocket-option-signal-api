(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function e(){try{let e=await(await fetch(`http://127.0.0.1:8000/signal`)).json(),t=document.getElementById(`signal`);if(e.status){t.innerHTML=e.status;return}t.innerHTML=`
            <b>Asset:</b> ${e.asset}<br><br>

            <b>Action:</b> ${e.action}<br>

            <b>Confidence:</b> ${e.confidence}%<br>

            <b>Risk:</b> ${e.risk}<br>

            <b>Trend:</b> ${e.trend}<br>

            <b>Expiration:</b> ${e.expiration}
        `}catch(e){document.getElementById(`signal`).innerHTML=`Cannot connect to API`,console.error(e)}}e();