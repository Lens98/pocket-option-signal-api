// ========================================
// Pocket Option AI PRO
// Window Storage
// RC2 Sprint 2A
// ========================================

const STORAGE_KEY = "pai-window";

const DEFAULT_STATE = {

    left: 80,

    top: 70,

    width: 1200,

    height: 650,

    minimized: false,

    maximized: false

};

// ========================================
// Load Window State
// ========================================

export function loadWindowState() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {

            return DEFAULT_STATE;

        }

        return {

            ...DEFAULT_STATE,

            ...JSON.parse(saved)

        };

    }

    catch (error) {

        console.error(
            "Failed to load window state:",
            error
        );

        return DEFAULT_STATE;

    }

}

// ========================================
// Save Window State
// ========================================

export function saveWindowState(state) {

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(state)

        );

    }

    catch (error) {

        console.error(

            "Failed to save window state:",

            error

        );

    }

}

// ========================================
// Reset Window State
// ========================================

export function resetWindowState() {

    localStorage.removeItem(
        STORAGE_KEY
    );

}