// ========================================
// Pocket Option AI PRO
// Window Manager
// Version 4.0 Dashboard Loader
// ========================================

console.log("✅ windowManager.js loaded");

import { enableResize } from "./resize";
import { loadWindowState, saveWindowState } from "./storage";


export function createDashboard() {

    console.log("🚀 createDashboard() START");


    // Prevent duplicates
    if (document.getElementById("pocket-ai-dashboard")) {
        console.log("⚠️ Dashboard already exists");
        return;
    }


    // ========================================
    // Create Dashboard Container
    // ========================================

    const dashboard = document.createElement("div");

    dashboard.id = "pocket-ai-dashboard";


    dashboard.innerHTML = `

        <iframe
            id="pai-dashboard-frame"
            src="${chrome.runtime.getURL("popup.html")}"
            frameborder="0">
        </iframe>

    `;


    document.documentElement.appendChild(dashboard);


    console.log("✅ Version 4.0 Dashboard Added");


    // ========================================
    // Apply Resize
    // ========================================

    enableResize(dashboard);



    // ========================================
    // Load Saved Position
    // ========================================

    const state = loadWindowState();


    dashboard.style.left = `${state.left}px`;
    dashboard.style.top = `${state.top}px`;
    dashboard.style.width = `${state.width}px`;
    dashboard.style.height = `${state.height}px`;



    // ========================================
    // Drag Support
    // ========================================

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    dashboard.addEventListener(
        "mousedown",
        (event)=>{

            dragging = true;

            offsetX = event.clientX - dashboard.offsetLeft;

            offsetY = event.clientY - dashboard.offsetTop;

        }
    );



    document.addEventListener(
        "mousemove",
        (event)=>{

            if(!dragging) return;


            dashboard.style.left =
            `${event.clientX - offsetX}px`;


            dashboard.style.top =
            `${event.clientY - offsetY}px`;

        }
    );



    document.addEventListener(
        "mouseup",
        ()=>{

            if(!dragging) return;


            dragging = false;


            saveWindowState({

                left: dashboard.offsetLeft,

                top: dashboard.offsetTop,

                width: dashboard.offsetWidth,

                height: dashboard.offsetHeight,

                minimized:false,

                maximized:false

            });

        }
    );



    console.log("✅ Version 4.0 Window Manager Ready");

}