import { initializeDashboard } from "./js/dashboard.js";
import {
    verifySession,
    getPaymentStatus
} from "./js/auth.js";
import { showLoginScreen } from "./login.js";
import { showPaymentScreen } from "./payment.js";
import { initializeAccount } from "./js/account.js";


// ==========================================
// START DASHBOARD
// ==========================================
function startDashboard(user) {
    console.log("Authentication successful. Starting dashboard.");
    console.log("Starting regular user platform:", user.email);

    initializeAccount(user);
    initializeDashboard();
}


async function checkSubscription(user) {
    console.log("========== CHECKING SUBSCRIPTION ==========");

    try {
        const data = await getPaymentStatus();

        console.log("PAYMENT STATUS RESPONSE:", JSON.stringify(data));
        console.log("Subscription:", data?.subscription);
        console.log("Status:", data?.subscription?.status);

        if (data?.subscription?.status === "active") {
            console.log("ACTIVE SUBSCRIPTION — STARTING DASHBOARD");
            startDashboard(user);
            return;
        }

        console.log("INACTIVE SUBSCRIPTION — SHOWING PAYMENT SCREEN");

        showPaymentScreen(user, () => {
            checkSubscription(user);
        });

        return;
    } catch (error) {
        console.error("SUBSCRIPTION CHECK FAILED:", error);

        showPaymentScreen(user, () => {
            checkSubscription(user);
        });

        return;
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