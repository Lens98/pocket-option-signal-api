import { initializeDashboard } from "./js/dashboard.js";
import {
    checkAdminAccess,
    initializeAdmin
} from "./js/admin.js";
import {
    verifySession
} from "./js/auth.js";

import {
    showLoginScreen
} from "./login.js";

import {
    initializeAccount
} from "./js/account.js";


async function startDashboard(user) {

    console.log(
        "Authentication successful. Starting dashboard."
    );

    initializeAccount(user);

    const isAdmin =
        await checkAdminAccess();

    if (isAdmin) {

        console.log(
            "Admin access granted."
        );

        initializeAdmin(user);

    } else {

        console.log(
            "Regular user access."
        );

    }

    initializeDashboard();

}

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Checking authentication..."
        );


        const user =
            await verifySession();


        if (user) {

            console.log(
                "Authenticated user:",
                user.email
            );


            await startDashboard(user);

            return;
        }


        console.log(
            "User is not authenticated."
        );


        showLoginScreen(
            async () => {

                const authenticatedUser =
                    await verifySession();


                if (!authenticatedUser) {

                    console.error(
                        "Login succeeded but session verification failed."
                    );

                    return;
                }


               await startDashboard(
                     authenticatedUser
                );
            }
        );
    }
);