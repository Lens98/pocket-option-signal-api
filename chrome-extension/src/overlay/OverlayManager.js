// ========================================
// Pocket Option AI PRO
// Overlay Manager
// RC2
// ========================================

import { createDashboard } from "./windowManager";

class OverlayManager {

    constructor() {

        this.started = false;

        this.observer = null;

    }

    start() {

        if (this.started) {

            return;

        }

        this.started = true;

        console.log("🚀 Overlay Manager Started");

        this.waitForPage();

    }

    waitForPage() {

        const ready = () => {

            if (!document.body) {

                return false;

            }

            const canvas =
                document.querySelector("canvas");

            return !!canvas;

        };

        if (ready()) {

            this.attachDashboard();

            return;

        }

        this.observer = new MutationObserver(() => {

            if (!ready()) {

                return;

            }

            this.observer.disconnect();

            this.attachDashboard();

        });

        this.observer.observe(

            document.documentElement,

            {

                childList: true,

                subtree: true

            }

        );

    }

    
attachDashboard() {

    const ensureDashboard = () => {

        if (
            document.getElementById(
                "pocket-ai-dashboard"
            )
        ) {
            return;
        }

        console.log("🟢 Recreating Dashboard...");

        createDashboard();

    };

    // Create immediately
    ensureDashboard();

    // Watch for Pocket Option replacing the DOM
    const watcher = new MutationObserver(() => {

        ensureDashboard();

    });

    watcher.observe(
        document.documentElement,
        {
            childList: true,
            subtree: true
        }
    );

}
}
  export default new OverlayManager();