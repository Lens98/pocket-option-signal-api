import { logout } from "./auth.js";


// ==========================================
// ACCOUNT
// ==========================================

export function initializeAccount(user) {

    const emailElement =
        document.getElementById(
            "accountEmail"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!emailElement || !logoutButton) {

        console.warn(
            "Account UI elements not found."
        );

        return;
    }


    // ==========================================
    // DISPLAY USER EMAIL
    // ==========================================

    emailElement.textContent =
        user?.email || "Unknown User";


    // ==========================================
    // LOGOUT
    // ==========================================

    logoutButton.addEventListener(
        "click",
        async () => {

            logoutButton.disabled = true;

            logoutButton.textContent =
                "LOGGING OUT...";


            try {

                await logout();

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }


            // Reload popup so the normal
            // authentication check runs again.

            window.location.reload();
        }
    );
}