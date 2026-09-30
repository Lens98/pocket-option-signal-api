// ========================================
// Pocket Option AI PRO
// Resize Manager
// RC2 Sprint 2B
// ========================================

import { saveWindowState } from "./storage";

const MIN_WIDTH = 700;
const MIN_HEIGHT = 400;

const MAX_WIDTH = window.innerWidth;
const MAX_HEIGHT = window.innerHeight;

export function enableResize(dashboard) {

    const handles = [

        "n",
        "s",
        "e",
        "w",
        "ne",
        "nw",
        "se",
        "sw"

    ];

    handles.forEach(direction => {

        const handle =
            document.createElement("div");

        handle.className =
            `resize-handle resize-${direction}`;

        dashboard.appendChild(handle);

        handle.addEventListener(
            "mousedown",
            event => {

                startResize(
                    event,
                    dashboard,
                    direction
                );

            }
        );

    });

}

function startResize(
    event,
    dashboard,
    direction
) {

    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;

    const startWidth =
        dashboard.offsetWidth;

    const startHeight =
        dashboard.offsetHeight;

    const startLeft =
        dashboard.offsetLeft;

    const startTop =
        dashboard.offsetTop;

    function resize(moveEvent) {

        let width =
            startWidth;

        let height =
            startHeight;

        let left =
            startLeft;

        let top =
            startTop;

        const dx =
            moveEvent.clientX -
            startX;

        const dy =
            moveEvent.clientY -
            startY;

        if (direction.includes("e")) {

            width =
                startWidth + dx;

        }

        if (direction.includes("s")) {

            height =
                startHeight + dy;

        }

        if (direction.includes("w")) {

            width =
                startWidth - dx;

            left =
                startLeft + dx;

        }

        if (direction.includes("n")) {

            height =
                startHeight - dy;

            top =
                startTop + dy;

        }

        width =
            Math.max(
                MIN_WIDTH,
                Math.min(width, MAX_WIDTH)
            );

        height =
            Math.max(
                MIN_HEIGHT,
                Math.min(height, MAX_HEIGHT)
            );

        dashboard.style.width =
            `${width}px`;

        dashboard.style.height =
            `${height}px`;

        dashboard.style.left =
            `${left}px`;

        dashboard.style.top =
            `${top}px`;

    }

    function stopResize() {

        document.removeEventListener(
            "mousemove",
            resize
        );

        document.removeEventListener(
            "mouseup",
            stopResize
        );

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

    document.addEventListener(
        "mousemove",
        resize
    );

    document.addEventListener(
        "mouseup",
        stopResize
    );

}