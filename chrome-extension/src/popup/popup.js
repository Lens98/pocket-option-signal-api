import { initializeDashboard } from "./js/dashboard.js";
import {
    verifySession,
    getPaymentStatus
} from "./js/auth.js";
import { showLoginScreen } from "./login.js";
import { initializeAccount } from "./js/account.js";


// ==========================================
// START DASHBOARD
// ==========================================
function startDashboard(user) {
    console.log("Authentication successful. Starting dashboard.");
    console.log("Starting regular user platform:", user.email);

    const dashboard = document.querySelector(".dashboard-layout");

    if (!dashboard) {
        console.error("❌ Dashboard element not found.");
        return;
    }

    dashboard.removeAttribute("hidden");
    dashboard.classList.remove("hidden");
    dashboard.style.removeProperty("display");
    dashboard.style.setProperty("display", "grid", "important");

    console.log(
        "✅ Dashboard UI is now visible:",
        getComputedStyle(dashboard).display
    );

    initializeAccount(user);
    initializeDashboard();

    setTimeout(() => {
        dashboard.style.setProperty("display", "grid", "important");

        console.log(
            "FINAL DASHBOARD DISPLAY:",
            getComputedStyle(dashboard).display
        );
    }, 100);
}

async function checkSubscription(user) {
    console.log("========== CHECKING SUBSCRIPTION ==========");

    try {
        const data = await getPaymentStatus();

        console.log("PAYMENT STATUS RESPONSE:", JSON.stringify(data));
        console.log("Subscription:", data?.subscription);
        console.log("Plan:", data?.subscription?.plan);
        console.log("Status:", data?.subscription?.status);

        if (
            data?.subscription?.status === "active" &&
            data?.subscription?.plan?.toLowerCase() === "lifetime"
        ) {
            console.log("LIFETIME SUBSCRIPTION — STARTING DASHBOARD");
            startDashboard(user);
            return;
        }

        console.log("NO ACTIVE LIFETIME SUBSCRIPTION");

        alert("An active Lifetime subscription is required to use SignalForge AI.");

    } catch (error) {
        console.error("SUBSCRIPTION CHECK FAILED:", error);

        alert("Unable to verify your subscription. Please try again.");
    }
}
// ==========================================
// START APPLICATION
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Checking authentication...");

    const user = await verifySession();

    if (user) {
        console.log("Authenticated user:", user.email);

        await checkSubscription(user);
        return;
    }

    console.log("User is not authenticated.");

    showLoginScreen(async () => {
        const authenticatedUser = await verifySession();

        if (!authenticatedUser) {
            console.error(
                "Login succeeded but session verification failed."
            );
            return;
        }

        await checkSubscription(authenticatedUser);
    });
});