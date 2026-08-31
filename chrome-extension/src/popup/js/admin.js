import { getAuthToken } from "./auth.js";

const API =
    "https://pocket-option-signal-api-production.up.railway.app";


export async function checkAdminAccess() {

    const token =
        await getAuthToken();

    if (!token) {

        console.log("Admin check: no token found.");

        return false;
    }

    try {

        console.log(
            "Checking admin access:",
            `${API}/auth/admin/test`
        );

        const response =
            await fetch(
                `${API}/auth/admin/test`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        console.log(
            "Admin access response:",
            response.status
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Admin access denied:",
                response.status,
                errorText
            );

            return false;
        }

        const data =
            await response.json();

        console.log(
            "Admin access result:",
            data
        );

        return data.success === true;

    } catch (error) {

        console.error(
            "Admin access check failed:",
            error
        );

        return false;
    }
}
// ==========================================
// ADMIN DASHBOARD
// ==========================================

export function initializeAdmin(user) {

    console.log(
        "Initializing admin dashboard:",
        user.email
    );

    const existingAdmin =
        document.getElementById(
            "adminDashboard"
        );

    if (existingAdmin) {
        return;
    }


    // ==========================================
    // CREATE ADMIN SCREEN
    // ==========================================

    const adminScreen =
        document.createElement("div");

    adminScreen.id =
        "adminDashboard";

    adminScreen.innerHTML = `

        <div class="admin-container">

            <div class="admin-header">

                <div class="admin-logo">
                    🤖
                </div>

                <div>

                    <h1>
                        ADMIN DASHBOARD
                    </h1>

                    <p>
                        Pocket Option AI PRO
                    </p>

                </div>

            </div>


            <div class="admin-user">

                <strong>
                    👤 ${user.email}
                </strong>

                <span>
                    ADMINISTRATOR
                </span>

            </div>


            <!-- ================================= -->
            <!-- STATS -->
            <!-- ================================= -->

            <div class="admin-stats">

                <div class="admin-stat-card">

                    <div class="stat-icon">
                        👥
                    </div>

                    <div>

                        <div class="stat-value">
                            --
                        </div>

                        <div class="stat-label">
                            TOTAL USERS
                        </div>

                    </div>

                </div>


                <div class="admin-stat-card">

                    <div class="stat-icon">
                        📊
                    </div>

                    <div>

                        <div class="stat-value">
                            --
                        </div>

                        <div class="stat-label">
                            TOTAL TRADES
                        </div>

                    </div>

                </div>


                <div class="admin-stat-card">

                    <div class="stat-icon">
                        📈
                    </div>

                    <div>

                        <div class="stat-value">
                            --
                        </div>

                        <div class="stat-label">
                            WIN RATE
                        </div>

                    </div>

                </div>

            </div>


            <!-- ================================= -->
            <!-- ADMIN ACTIONS -->
            <!-- ================================= -->

            <div class="admin-actions">

                <button
                    id="adminUsersButton"
                    class="admin-button"
                >
                    👥 USERS
                </button>


                <button
                    id="adminTradesButton"
                    class="admin-button"
                >
                    📊 TRADES
                </button>


                <button
                    id="adminPerformanceButton"
                    class="admin-button"
                >
                    📈 PERFORMANCE
                </button>

            </div>


            <!-- ================================= -->
            <!-- LOGOUT -->
            <!-- ================================= -->

            <button
                id="adminLogoutButton"
                class="admin-logout"
            >
                LOGOUT
            </button>

        </div>

    `;


    document.body.prepend(
        adminScreen
    );


    // ==========================================
    // BUTTON PLACEHOLDERS
    // ==========================================

    document
        .getElementById(
            "adminUsersButton"
        )
        ?.addEventListener(
            "click",
            () => {

                console.log(
                    "Admin users clicked"
                );

            }
        );


    document
        .getElementById(
            "adminTradesButton"
        )
        ?.addEventListener(
            "click",
            () => {

                console.log(
                    "Admin trades clicked"
                );

            }
        );


    document
        .getElementById(
            "adminPerformanceButton"
        )
        ?.addEventListener(
            "click",
            () => {

                console.log(
                    "Admin performance clicked"
                );

            }
        );


    // ==========================================
    // LOGOUT
    // ==========================================

    document
        .getElementById(
            "adminLogoutButton"
        )
        ?.addEventListener(
            "click",
            async () => {

                console.log(
                    "Admin logout"
                );

            }
        );

}