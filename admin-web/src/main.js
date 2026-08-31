const API =
    "https://pocket-option-signal-api-production.up.railway.app";

const app = document.getElementById("app");


// ==========================================
// LOGIN SCREEN
// ==========================================

function showLogin() {
    app.innerHTML = `
        <div class="login-page">

            <div class="login-card">

                <div class="login-logo">
                    🤖
                </div>

                <h1>
                    Pocket Option AI PRO
                </h1>

                <p class="login-subtitle">
                    Administrator Portal
                </p>

                <form id="loginForm">

                    <label for="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Admin email"
                        required
                    />

                    <label for="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                    />

                    <button
                        id="loginButton"
                        type="submit"
                    >
                        LOGIN
                    </button>

                    <div
                        id="loginError"
                        class="login-error"
                    ></div>

                </form>

            </div>

        </div>
    `;

    document
        .getElementById("loginForm")
        .addEventListener("submit", login);
}


// ==========================================
// LOGIN
// ==========================================

async function login(event) {
    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const button =
        document.getElementById("loginButton");

    const error =
        document.getElementById("loginError");

    error.textContent = "";

    button.disabled = true;
    button.textContent = "LOGGING IN...";

    try {

        const response = await fetch(
            `${API}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Login failed."
            );
        }

        const token = data.token;
        const user = data.user;

        if (!token || !user) {
            throw new Error(
                "Invalid login response."
            );
        }


        // ==========================================
        // VERIFY ADMIN ACCESS
        // ==========================================

        const adminResponse = await fetch(
            `${API}/auth/admin/test`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const adminData =
            await adminResponse.json();

        if (
            !adminResponse.ok ||
            adminData.success !== true
        ) {
            throw new Error(
                "Admin access required."
            );
        }


        // ==========================================
        // SAVE ADMIN SESSION
        // ==========================================

        localStorage.setItem(
            "adminToken",
            token
        );

        localStorage.setItem(
            "adminUser",
            JSON.stringify(user)
        );


        // Show dashboard
        showDashboard(user);

        // Load real statistics
        loadStats();

    } catch (err) {

        console.error(
            "Admin login failed:",
            err
        );

        error.textContent =
            err.message ||
            "Unable to sign in.";

        button.disabled = false;
        button.textContent = "LOGIN";
    }
}


// ==========================================
// ADMIN DASHBOARD
// ==========================================

function showDashboard(user) {

    app.innerHTML = `
        <div class="admin-page">

            <header class="admin-header">

                <div>

                    <div class="admin-title">
                        🤖 Pocket Option AI PRO
                    </div>

                    <div class="admin-subtitle">
                        Administrator Portal
                    </div>

                </div>


                <div class="admin-account">

                    <strong>
                        ${escapeHtml(user.email)}
                    </strong>

                    <span>
                        ADMIN
                    </span>

                </div>

            </header>


            <main class="admin-content">

                <h2>
                    Admin Dashboard
                </h2>


                <!-- ==================================
                     STATISTICS
                =================================== -->

                <div class="admin-stats">


                    <!-- TOTAL USERS -->

                    <div class="admin-card">

                        <div class="admin-card-icon">
                            👥
                        </div>

                        <div
                            id="totalUsers"
                            class="admin-card-value"
                        >
                            --
                        </div>

                        <div class="admin-card-label">
                            TOTAL USERS
                        </div>

                    </div>


                    <!-- TOTAL TRADES -->

                    <div class="admin-card">

                        <div class="admin-card-icon">
                            📊
                        </div>

                        <div
                            id="totalTrades"
                            class="admin-card-value"
                        >
                            --
                        </div>

                        <div class="admin-card-label">
                            TOTAL TRADES
                        </div>

                    </div>


                    <!-- WIN RATE -->

                    <div class="admin-card">

                        <div class="admin-card-icon">
                            📈
                        </div>

                        <div
                            id="winRate"
                            class="admin-card-value"
                        >
                            --
                        </div>

                        <div class="admin-card-label">
                            WIN RATE
                        </div>

                    </div>

                </div>


                <!-- ==================================
                     ADMIN ACTIONS
                =================================== -->

                <div class="admin-actions">

                    <button class="admin-action">
                        👥 USERS
                    </button>

                    <button class="admin-action">
                        📊 TRADES
                    </button>

                    <button class="admin-action">
                        📈 PERFORMANCE
                    </button>

                </div>


                <!-- ==================================
                     LOGOUT
                =================================== -->

                <button
                    id="logoutButton"
                    class="logout-button"
                >
                    LOGOUT
                </button>

            </main>

        </div>
    `;


    document
        .getElementById("logoutButton")
        .addEventListener(
            "click",
            logout
        );
}


// ==========================================
// LOAD ADMIN STATISTICS
// ==========================================

async function loadStats() {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {
        return;
    }


    try {

        const response = await fetch(
            `${API}/admin/stats`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (
            !response.ok ||
            data.success !== true
        ) {
            throw new Error(
                data.detail ||
                "Unable to load statistics."
            );
        }


        // Total users
        document.getElementById(
            "totalUsers"
        ).textContent =
            data.users;


        // Total trades
        document.getElementById(
            "totalTrades"
        ).textContent =
            data.trades;


        // Win rate
        document.getElementById(
            "winRate"
        ).textContent =
            `${Number(data.win_rate).toFixed(1)}%`;


    } catch (error) {

        console.error(
            "Failed to load admin statistics:",
            error
        );

    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminUser"
    );

    showLogin();
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ==========================================
// CHECK EXISTING SESSION
// ==========================================

async function checkExistingSession() {

    const token =
        localStorage.getItem("adminToken");

    const savedUser =
        localStorage.getItem("adminUser");


    if (!token || !savedUser) {

        showLogin();

        return;
    }


    try {

        const response = await fetch(
            `${API}/auth/admin/test`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Admin session expired."
            );
        }


        const data =
            await response.json();


        if (data.success !== true) {

            throw new Error(
                "Admin access denied."
            );
        }


        const user =
            JSON.parse(savedUser);


        showDashboard(user);

        // Load statistics after restoring session
        loadStats();


    } catch (error) {

        console.log(
            "Admin session invalid:",
            error
        );


        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "adminUser"
        );


        showLogin();
    }
}


// ==========================================
// START APPLICATION
// ==========================================

checkExistingSession();