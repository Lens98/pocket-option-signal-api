// ========================================
// Pocket Option AI PRO
// Window Manager
// RC2
// ========================================
console.log("✅ windowManager.js loaded");
import { enableResize } from "./resize";

import {
    loadWindowState,
    saveWindowState
} from "./storage";

export function createDashboard() {

    console.log("🚀 createDashboard() START");

    if (document.getElementById("pocket-ai-dashboard")) {
        return;
    }

    const dashboard = document.createElement("div");

    dashboard.id = "pocket-ai-dashboard";

    dashboard.innerHTML = `

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

`;

 document.documentElement.appendChild(dashboard);

console.log("Dashboard parent:", dashboard.parentElement);
    console.log("✅ Dashboard Added");

    enableResize(dashboard);

    const state = loadWindowState();

    dashboard.style.left = `${state.left}px`;
    dashboard.style.top = `${state.top}px`;
    dashboard.style.width = `${state.width}px`;
    dashboard.style.height = `${state.height}px`;
        // ========================================
    // Drag Window
    // ========================================

    const header =
        dashboard.querySelector("#pai-header");

    let dragging = false;

    let offsetX = 0;

    let offsetY = 0;

    header.addEventListener(
        "mousedown",
        (event) => {

            dragging = true;

            offsetX =
                event.clientX -
                dashboard.offsetLeft;

            offsetY =
                event.clientY -
                dashboard.offsetTop;

            dashboard.style.userSelect =
                "none";

        }
    );

    document.addEventListener(
        "mousemove",
        (event) => {

            if (!dragging) return;

            dashboard.style.left =
                `${event.clientX - offsetX}px`;

            dashboard.style.top =
                `${event.clientY - offsetY}px`;

        }
    );

    document.addEventListener(
        "mouseup",
        () => {

            if (!dragging) return;

            dragging = false;

            dashboard.style.userSelect = "";

            saveWindowState({

                left:
                    dashboard.offsetLeft,

                top:
                    dashboard.offsetTop,

                width:
                    dashboard.offsetWidth,

                height:
                    dashboard.offsetHeight,

                minimized: false,

                maximized: false

            });

        }
    );

        // ========================================
    // Close Button
    // ========================================

    dashboard
        .querySelector("#pai-close")
        .addEventListener(
            "click",
            () => {

                dashboard.remove();

            }
        );

    // ========================================
    // Minimize Button
    // ========================================

    dashboard
        .querySelector("#pai-minimize")
        .addEventListener(
            "click",
            () => {

                const grid =
                    dashboard.querySelector("#pai-grid");

                if (grid.style.display === "none") {

                    grid.style.display = "grid";

                    dashboard.style.height =
                        `${state.height}px`;

                }
                else {

                    grid.style.display = "none";

                    dashboard.style.height = "52px";

                }

            }
        );

    console.log(
        "✅ RC2 Dashboard Loaded"
    );

}