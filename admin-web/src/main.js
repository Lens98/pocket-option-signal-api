const API =
    "https://pocket-option-signal-api-production.up.railway.app";

const app = document.getElementById("app");


// ==========================================
// LOGIN
// ==========================================

function showLogin() {
    app.innerHTML = `
        <div class="login-page">
            <div class="login-card">
                <div class="login-logo">🤖</div>

                <h1>Pocket Option AI PRO</h1>

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
                        autocomplete="username"
                        required
                    />

                    <label for="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        autocomplete="current-password"
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
        .addEventListener(
            "submit",
            login
        );
}


// ==========================================
// LOGIN
// ==========================================

async function login(event) {
    event.preventDefault();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const button =
        document.getElementById(
            "loginButton"
        );

    const error =
        document.getElementById(
            "loginError"
        );

    error.textContent = "";

    button.disabled = true;
    button.textContent =
        "LOGGING IN...";

    try {

        const response =
            await fetch(
                `${API}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Login failed."
            );
        }

        const token =
            data.token;

        const user =
            data.user;

        if (!token || !user) {
            throw new Error(
                "Invalid login response."
            );
        }


        // ==================================
        // VERIFY ADMIN
        // ==================================

        const adminResponse =
            await fetch(
                `${API}/auth/admin/test`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
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


        // ==================================
        // SAVE SESSION
        // ==================================

        localStorage.setItem(
            "adminToken",
            token
        );

        localStorage.setItem(
            "adminUser",
            JSON.stringify(user)
        );


        // ==================================
        // SHOW DASHBOARD
        // ==================================

        showDashboard(user);

        await loadStats();

    } catch (err) {

        console.error(
            "Admin login failed:",
            err
        );

        error.textContent =
            err.message ||
            "Unable to sign in.";

        button.disabled = false;

        button.textContent =
            "LOGIN";
    }
}


// ==========================================
// DASHBOARD
// ==========================================

function showDashboard(user) {

    app.innerHTML = `

        <div class="admin-shell">


            <!-- ================================= -->
            <!-- SIDEBAR -->
            <!-- ================================= -->

            <aside class="sidebar">

                <div class="brand">

                    <div class="brand-mark">
                        ◈
                    </div>

                    <div class="brand-copy">

                        <div class="brand-name">
                            Pocket Option AI
                        </div>

                        <span class="pro-badge">
                            PRO
                        </span>

                    </div>

                </div>


                <div class="nav-section-title">
                    MAIN
                </div>


                <nav class="sidebar-nav">

                    <button
                        class="nav-item active"
                        data-page="dashboard"
                    >
                        <span>▦</span>
                        Dashboard
                    </button>


                    <button
                        class="nav-item"
                        data-page="users"
                    >
                        <span>♙</span>
                        Users
                    </button>


                    <button
                        class="nav-item"
                        data-page="trades"
                    >
                        <span>▤</span>
                        Trades
                    </button>


                    <button
                        class="nav-item"
                        data-page="performance"
                    >
                        <span>⌁</span>
                        Performance
                    </button>


                    <button
                        class="nav-item"
                        data-page="assets"
                    >
                        <span>◉</span>
                        Assets
                    </button>


                    <button
                        class="nav-item"
                        data-page="signals"
                    >
                        <span>✦</span>
                        Signals
                    </button>


                    <button
                        class="nav-item"
                        data-page="subscriptions"
                    >
                        <span>▣</span>
                        Subscriptions
                    </button>


                    <button
                        class="nav-item"
                        data-page="coupons"
                    >
                        <span>◇</span>
                        Coupons
                    </button>


                    <button
                        class="nav-item"
                        data-page="payments"
                    >
                        <span>$</span>
                        Payments
                    </button>


                    <button
                        class="nav-item"
                        data-page="reports"
                    >
                        <span>▥</span>
                        Reports
                    </button>

                </nav>


                <div class="nav-section-title system-title">
                    SYSTEM
                </div>


                <nav class="sidebar-nav">

                    <button
                        class="nav-item"
                        data-page="settings"
                    >
                        <span>⚙</span>
                        Settings
                    </button>


                    <button
                        class="nav-item"
                        data-page="admins"
                    >
                        <span>♟</span>
                        Admins
                    </button>


                    <button
                        class="nav-item"
                        data-page="logs"
                    >
                        <span>≡</span>
                        Logs
                    </button>


                    <button
                        class="nav-item"
                        data-page="api-keys"
                    >
                        <span>⌘</span>
                        API Keys
                    </button>


                    <button
                        class="nav-item"
                        data-page="maintenance"
                    >
                        <span>◌</span>
                        Maintenance
                    </button>

                </nav>


                <button
                    id="logoutButton"
                    class="logout-nav"
                >
                    <span>↪</span>
                    Logout
                </button>

            </aside>


            <!-- ================================= -->
            <!-- MAIN AREA -->
            <!-- ================================= -->

            <section class="main-area">


                <!-- TOP BAR -->

                <header class="topbar">

                    <div class="topbar-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            id="globalSearch"
                            type="search"
                            placeholder="Search..."
                        />

                    </div>


                    <div class="topbar-right">

                        <button
                            class="icon-button"
                            title="Notifications"
                        >

                            ♧

                            <span class="notification-dot">
                                3
                            </span>

                        </button>


                        <div class="admin-profile">

                            <div class="avatar">
                                AD
                            </div>


                            <div class="profile-copy">

                                <strong>
                                    ${escapeHtml(
                                        user.email
                                    )}
                                </strong>

                                <span>
                                    Super Administrator
                                </span>

                            </div>


                            <span class="profile-chevron">
                                ⌄
                            </span>

                        </div>

                    </div>

                </header>


                <!-- ================================= -->
                <!-- CONTENT -->
                <!-- ================================= -->

                <main class="content">


                    <!-- PAGE HEADING -->

                    <div class="page-heading">

                        <div>

                            <h1>
                                Dashboard
                            </h1>

                            <p>
                                Overview of platform
                                statistics and performance
                            </p>

                        </div>


                        <button
                            class="date-filter"
                        >

                            <span>
                                ▣
                            </span>

                            <span>
                                Last 7 Days
                            </span>

                            <span>
                                ⌄
                            </span>

                        </button>

                    </div>


                    <!-- ================================= -->
                    <!-- KPI CARDS -->
                    <!-- ================================= -->

                    <section class="kpi-grid">


                        <div class="kpi-card">

                            <div class="kpi-icon purple">
                                ♙
                            </div>

                            <div class="kpi-label">
                                TOTAL USERS
                            </div>

                            <div
                                id="totalUsers"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">
                                <span class="muted">
                                    Platform accounts
                                </span>
                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon blue">
                                ▥
                            </div>

                            <div class="kpi-label">
                                TOTAL TRADES
                            </div>

                            <div
                                id="totalTrades"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">
                                <span class="muted">
                                    Recorded trades
                                </span>
                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon green">
                                ↗
                            </div>

                            <div class="kpi-label">
                                WIN RATE
                            </div>

                            <div
                                id="winRate"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">

                                <span class="positive">
                                    Live database value
                                </span>

                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon gold">
                                $
                            </div>

                            <div class="kpi-label">
                                TOTAL PROFIT
                            </div>

                            <div class="kpi-value unavailable">
                                —
                            </div>

                            <div class="kpi-note">

                                <span class="muted">
                                    Analytics endpoint pending
                                </span>

                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon red">
                                ↘
                            </div>

                            <div class="kpi-label">
                                TOTAL LOSS
                            </div>

                            <div class="kpi-value unavailable">
                                —
                            </div>

                            <div class="kpi-note">

                                <span class="muted">
                                    Analytics endpoint pending
                                </span>

                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon violet">
                                ▣
                            </div>

                            <div class="kpi-label">
                                NET PROFIT
                            </div>

                            <div class="kpi-value unavailable">
                                —
                            </div>

                            <div class="kpi-note">

                                <span class="muted">
                                    Analytics endpoint pending
                                </span>

                            </div>

                        </div>

                    </section>


                    <!-- ================================= -->
                    <!-- DASHBOARD GRID -->
                    <!-- ================================= -->

                    <section class="dashboard-grid">


                        <!-- PERFORMANCE -->

                        <div class="panel performance-panel">

                            <div class="panel-header">

                                <div>

                                    <h2>
                                        Performance Overview
                                    </h2>

                                    <p>
                                        Win/loss distribution
                                        from recorded trades
                                    </p>

                                </div>


                                <button class="panel-select">
                                    Last 7 Days ⌄
                                </button>

                            </div>


                            <div class="legend">

                                <span>
                                    <i class="legend-dot wins"></i>
                                    Wins
                                </span>

                                <span>
                                    <i class="legend-dot losses"></i>
                                    Losses
                                </span>

                                <span>
                                    <i class="legend-dot rate"></i>
                                    Win Rate (%)
                                </span>

                            </div>


                            <div class="chart-area">

                                <div class="y-axis">

                                    <span>
                                        100%
                                    </span>

                                    <span>
                                        75%
                                    </span>

                                    <span>
                                        50%
                                    </span>

                                    <span>
                                        25%
                                    </span>

                                    <span>
                                        0%
                                    </span>

                                </div>


                                <div class="chart-stage">

                                    <div class="grid-lines">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>


                                    <div class="bar-row">

                                        ${Array.from(
                                            { length: 7 },
                                            () => `
                                                <div class="bar-group">

                                                    <div
                                                        class="bar win-bar"
                                                    ></div>

                                                    <div
                                                        class="bar loss-bar"
                                                    ></div>

                                                </div>
                                            `
                                        ).join("")}

                                    </div>


                                    <div class="rate-line">

                                        ${Array.from(
                                            { length: 7 },
                                            () => `
                                                <span></span>
                                            `
                                        ).join("")}

                                    </div>


                                    <div class="x-axis">

                                        <span>
                                            Day 1
                                        </span>

                                        <span>
                                            Day 2
                                        </span>

                                        <span>
                                            Day 3
                                        </span>

                                        <span>
                                            Day 4
                                        </span>

                                        <span>
                                            Day 5
                                        </span>

                                        <span>
                                            Day 6
                                        </span>

                                        <span>
                                            Day 7
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div
                                id="chartNotice"
                                class="chart-notice"
                            >
                                Historical daily analytics
                                will populate when the
                                analytics endpoint is added.
                            </div>

                        </div>


                        <!-- ASSETS -->

                        <div class="panel asset-panel">

                            <div class="panel-header">

                                <div>

                                    <h2>
                                        Trades by Asset
                                    </h2>

                                    <p>
                                        Asset distribution
                                    </p>

                                </div>


                                <button class="view-button">
                                    View all
                                </button>

                            </div>


                            <div class="asset-empty">


                                <div
                                    id="assetDonut"
                                    class="asset-donut"
                                >

                                    <div>

                                        <strong
                                            id="assetTotal"
                                        >
                                            —
                                        </strong>

                                        <span>
                                            Trades
                                        </span>

                                    </div>

                                </div>


                                <div class="asset-legend">


                                    <div>

                                        <span class="asset-name">
                                            Asset breakdown
                                        </span>

                                        <strong>
                                            Pending
                                        </strong>

                                    </div>


                                    <div>

                                        <span class="asset-name">
                                            Total trades
                                        </span>

                                        <strong
                                            id="assetTrades"
                                        >
                                            —
                                        </strong>

                                    </div>


                                    <div>

                                        <span class="asset-name">
                                            API status
                                        </span>

                                        <strong class="positive">
                                            Connected
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            <div class="chart-notice">

                                Asset-level statistics will use
                                real database values in the next
                                API layer.

                            </div>

                        </div>


                        <!-- RECENT TRADES -->

                        <div class="panel recent-panel">

                            <div class="panel-header">

                                <div>

                                    <h2>
                                        Recent Trades
                                    </h2>

                                    <p>
                                        Latest recorded trading
                                        activity
                                    </p>

                                </div>


                                <button class="view-button">
                                    View all
                                </button>

                            </div>


                            <div class="table-wrap">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                ASSET
                                            </th>

                                            <th>
                                                TYPE
                                            </th>

                                            <th>
                                                RESULT
                                            </th>

                                            <th>
                                                CONFIDENCE
                                            </th>

                                            <th>
                                                TIME
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        <tr>

                                            <td colspan="6">

                                                <div
                                                    class="table-empty"
                                                >
                                                    Trade detail endpoint
                                                    will populate this table.
                                                </div>

                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        <!-- USER GROWTH -->

                        <div class="panel growth-panel">

                            <div class="panel-header">

                                <div>

                                    <h2>
                                        User Growth
                                    </h2>

                                    <p>
                                        Registered users
                                    </p>

                                </div>


                                <button class="view-button">
                                    View all
                                </button>

                            </div>


                            <div class="growth-chart">

                                <div class="growth-y">

                                    <span>5</span>
                                    <span>4</span>
                                    <span>3</span>
                                    <span>2</span>
                                    <span>1</span>
                                    <span>0</span>

                                </div>


                                <svg
                                    viewBox="0 0 500 210"
                                    preserveAspectRatio="none"
                                >

                                    <defs>

                                        <linearGradient
                                            id="growthFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >

                                            <stop
                                                offset="0%"
                                                stop-opacity=".30"
                                            />

                                            <stop
                                                offset="100%"
                                                stop-opacity="0"
                                            />

                                        </linearGradient>

                                    </defs>


                                    <path
                                        class="growth-area"
                                        d="
                                            M0,190
                                            L0,130
                                            L80,125
                                            L160,105
                                            L240,115
                                            L320,85
                                            L400,95
                                            L500,65
                                            L500,190
                                            Z
                                        "
                                    />


                                    <polyline
                                        class="growth-line"
                                        points="
                                            0,130
                                            80,125
                                            160,105
                                            240,115
                                            320,85
                                            400,95
                                            500,65
                                        "
                                    />


                                    <circle
                                        cx="0"
                                        cy="130"
                                        r="4"
                                    />

                                    <circle
                                        cx="80"
                                        cy="125"
                                        r="4"
                                    />

                                    <circle
                                        cx="160"
                                        cy="105"
                                        r="4"
                                    />

                                    <circle
                                        cx="240"
                                        cy="115"
                                        r="4"
                                    />

                                    <circle
                                        cx="320"
                                        cy="85"
                                        r="4"
                                    />

                                    <circle
                                        cx="400"
                                        cy="95"
                                        r="4"
                                    />

                                    <circle
                                        cx="500"
                                        cy="65"
                                        r="4"
                                    />

                                </svg>

                            </div>


                            <div class="chart-notice">

                                Growth history will become
                                data-driven after the user
                                analytics endpoint is added.

                            </div>

                        </div>

                    </section>


                    <!-- ================================= -->
                    <!-- SUMMARY -->
                    <!-- ================================= -->

                    <section class="summary-strip">


                        <div class="summary-item">

                            <div class="summary-icon blue">
                                ♙
                            </div>

                            <div>

                                <span>
                                    TOTAL USERS
                                </span>

                                <strong
                                    id="summaryUsers"
                                >
                                    —
                                </strong>

                            </div>

                        </div>


                        <div class="summary-item">

                            <div class="summary-icon green">
                                ✓
                            </div>

                            <div>

                                <span>
                                    TOTAL TRADES
                                </span>

                                <strong
                                    id="summaryTrades"
                                >
                                    —
                                </strong>

                            </div>

                        </div>


                        <div class="summary-item">

                            <div class="summary-icon gold">
                                🏆
                            </div>

                            <div>

                                <span>
                                    WIN RATE
                                </span>

                                <strong
                                    id="summaryWinRate"
                                >
                                    —
                                </strong>

                            </div>

                        </div>


                        <div class="summary-item">

                            <div class="summary-icon violet">
                                ✦
                            </div>

                            <div>

                                <span>
                                    PLATFORM
                                </span>

                                <strong>
                                    ONLINE
                                </strong>

                            </div>

                        </div>

                    </section>

                </main>

            </section>

        </div>
    `;


    // ======================================
    // LOGOUT
    // ======================================

    document
        .getElementById("logoutButton")
        .addEventListener(
            "click",
            logout
        );


    // ======================================
    // SIDEBAR
    // ======================================

    document
    .querySelectorAll(".nav-item")
    .forEach((item) => {

        item.addEventListener(
            "click",
            async () => {

                const page =
                    item.dataset.page;


                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach((nav) =>
                        nav.classList.remove(
                            "active"
                        )
                    );


                item.classList.add(
                    "active"
                );


                // ==========================
                // DASHBOARD
                // ==========================

                if (
                    page === "dashboard"
                ) {

                    showDashboard(
                        JSON.parse(
                            localStorage.getItem(
                                "adminUser"
                            )
                        )
                    );

                    await loadStats();

                    return;
                }


                // ==========================
                // USERS
                // ==========================

                if (
                    page === "users"
                ) {

                    await showUsersPage();

                    return;
                }


                // ==========================
                // OTHER PAGES
                // ==========================

                showComingSoon(
                    item.textContent.trim()
                );

            }
        );

    });
}


// ==========================================
// LOAD REAL STATS
// ==========================================

async function loadStats() {

    const token =
        localStorage.getItem(
            "adminToken"
        );

    if (!token) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/admin/stats`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
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


        const users =
            Number(
                data.users ?? 0
            );

        const trades =
            Number(
                data.trades ?? 0
            );

        const winRate =
            Number(
                data.win_rate ?? 0
            );


        setText(
            "totalUsers",
            formatNumber(users)
        );


        setText(
            "totalTrades",
            formatNumber(trades)
        );


        setText(
            "winRate",
            `${winRate.toFixed(1)}%`
        );


        setText(
            "summaryUsers",
            formatNumber(users)
        );


        setText(
            "summaryTrades",
            formatNumber(trades)
        );


        setText(
            "summaryWinRate",
            `${winRate.toFixed(1)}%`
        );


        setText(
            "assetTotal",
            formatNumber(trades)
        );


        setText(
            "assetTrades",
            formatNumber(trades)
        );


        updateOverviewChart(
            trades,
            winRate
        );


    } catch (error) {

        console.error(
            "Failed to load admin statistics:",
            error
        );

    }
}


// ==========================================
// OVERVIEW CHART
// ==========================================

function updateOverviewChart(
    totalTrades,
    winRate
) {

    const wins =
        Math.round(
            totalTrades *
            (winRate / 100)
        );


    const losses =
        Math.max(
            totalTrades - wins,
            0
        );


    const bars =
        document.querySelectorAll(
            ".bar"
        );


    const winPercent =
        totalTrades > 0
            ? (wins / totalTrades) * 100
            : 0;


    const lossPercent =
        totalTrades > 0
            ? (losses / totalTrades) * 100
            : 0;


    bars.forEach(
        (bar, index) => {

            const wave =
                0.82 +
                (
                    Math.sin(
                        index * 1.7
                    ) * 0.09
                );


            if (
                bar.classList.contains(
                    "win-bar"
                )
            ) {

                bar.style.height =
                    `${Math.max(
                        8,
                        winPercent * wave
                    )}%`;

            } else {

                bar.style.height =
                    `${Math.max(
                        6,
                        lossPercent * wave
                    )}%`;

            }

        }
    );


    const notice =
        document.getElementById(
            "chartNotice"
        );


    if (notice) {

        notice.textContent =
            `${formatNumber(wins)} estimated wins · ` +
            `${formatNumber(losses)} estimated losses · ` +
            `${winRate.toFixed(1)}% overall win rate. ` +
            `Historical daily breakdown will use exact trade dates.`;

    }
}
// ==========================================
// USERS PAGE
// ==========================================

async function showUsersPage() {

    app.innerHTML = `

        <div class="admin-shell">

            <!-- ================================= -->
            <!-- SIDEBAR -->
            <!-- ================================= -->

            <aside class="sidebar">

                <div class="brand">

                    <div class="brand-mark">
                        ◈
                    </div>

                    <div class="brand-copy">

                        <div class="brand-name">
                            Pocket Option AI
                        </div>

                        <span class="pro-badge">
                            PRO
                        </span>

                    </div>

                </div>


                <div class="nav-section-title">
                    MAIN
                </div>


                <nav class="sidebar-nav">

                    <button
                        class="nav-item"
                        data-page="dashboard"
                    >
                        <span>▦</span>
                        Dashboard
                    </button>


                    <button
                        class="nav-item active"
                        data-page="users"
                    >
                        <span>♙</span>
                        Users
                    </button>


                    <button
                        class="nav-item"
                        data-page="trades"
                    >
                        <span>▤</span>
                        Trades
                    </button>


                    <button
                        class="nav-item"
                        data-page="performance"
                    >
                        <span>⌁</span>
                        Performance
                    </button>


                    <button
                        class="nav-item"
                        data-page="assets"
                    >
                        <span>◉</span>
                        Assets
                    </button>


                    <button
                        class="nav-item"
                        data-page="signals"
                    >
                        <span>✦</span>
                        Signals
                    </button>


                    <button
                        class="nav-item"
                        data-page="subscriptions"
                    >
                        <span>▣</span>
                        Subscriptions
                    </button>


                    <button
                        class="nav-item"
                        data-page="coupons"
                    >
                        <span>◇</span>
                        Coupons
                    </button>


                    <button
                        class="nav-item"
                        data-page="payments"
                    >
                        <span>$</span>
                        Payments
                    </button>


                    <button
                        class="nav-item"
                        data-page="reports"
                    >
                        <span>▥</span>
                        Reports
                    </button>

                </nav>


                <div class="nav-section-title system-title">
                    SYSTEM
                </div>


                <nav class="sidebar-nav">

                    <button
                        class="nav-item"
                        data-page="settings"
                    >
                        <span>⚙</span>
                        Settings
                    </button>


                    <button
                        class="nav-item"
                        data-page="admins"
                    >
                        <span>♟</span>
                        Admins
                    </button>


                    <button
                        class="nav-item"
                        data-page="logs"
                    >
                        <span>≡</span>
                        Logs
                    </button>


                    <button
                        class="nav-item"
                        data-page="api-keys"
                    >
                        <span>⌘</span>
                        API Keys
                    </button>


                    <button
                        class="nav-item"
                        data-page="maintenance"
                    >
                        <span>◌</span>
                        Maintenance
                    </button>

                </nav>


                <button
                    id="logoutButton"
                    class="logout-nav"
                >
                    <span>↪</span>
                    Logout
                </button>

            </aside>


            <!-- ================================= -->
            <!-- MAIN -->
            <!-- ================================= -->

            <section class="main-area">


                <!-- TOPBAR -->

                <header class="topbar">

                    <div class="topbar-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            id="userSearch"
                            type="search"
                            placeholder="Search users..."
                        />

                    </div>


                    <div class="topbar-right">

                        <button
                            class="icon-button"
                        >
                            ♧

                            <span class="notification-dot">
                                3
                            </span>
                        </button>


                        <div class="admin-profile">

                            <div class="avatar">
                                AD
                            </div>

                            <div class="profile-copy">

                                <strong
                                    id="usersAdminEmail"
                                >
                                    Admin
                                </strong>

                                <span>
                                    Super Administrator
                                </span>

                            </div>

                            <span class="profile-chevron">
                                ⌄
                            </span>

                        </div>

                    </div>

                </header>


                <!-- ================================= -->
                <!-- CONTENT -->
                <!-- ================================= -->

                <main class="content">


                    <!-- PAGE HEADER -->

                    <div class="page-heading">

                        <div>

                            <h1>
                                Users
                            </h1>

                            <p>
                                Manage registered
                                platform users
                            </p>

                        </div>


                        <div class="users-header-actions">

                            <button
                                id="refreshUsers"
                                class="date-filter"
                            >
                                ↻
                                Refresh
                            </button>

                        </div>

                    </div>


                    <!-- ================================= -->
                    <!-- USER STATISTICS -->
                    <!-- ================================= -->

                    <section class="kpi-grid">


                        <div class="kpi-card">

                            <div class="kpi-icon purple">
                                ♙
                            </div>

                            <div class="kpi-label">
                                TOTAL USERS
                            </div>

                            <div
                                id="usersTotal"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">
                                Registered accounts
                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon green">
                                ✓
                            </div>

                            <div class="kpi-label">
                                ACTIVE USERS
                            </div>

                            <div
                                id="usersActive"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">
                                Currently registered
                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon gold">
                                ♛
                            </div>

                            <div class="kpi-label">
                                ADMINS
                            </div>

                            <div
                                id="usersAdmins"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">
                                Administrator accounts
                            </div>

                        </div>


                        <div class="kpi-card">

                            <div class="kpi-icon blue">
                                +
                            </div>

                            <div class="kpi-label">
                                USER ACCOUNTS
                            </div>

                            <div
                                id="regularUsers"
                                class="kpi-value"
                            >
                                —
                            </div>

                            <div class="kpi-note">
                                Standard accounts
                            </div>

                        </div>

                    </section>


                    <!-- ================================= -->
                    <!-- USERS TABLE -->
                    <!-- ================================= -->

                    <section class="panel users-panel">


                        <div class="panel-header">

                            <div>

                                <h2>
                                    All Users
                                </h2>

                                <p>
                                    Registered accounts
                                    on the platform
                                </p>

                            </div>


                            <div class="users-table-controls">

                                <span
                                    id="usersResultCount"
                                >
                                    —
                                </span>

                            </div>

                        </div>


                        <div class="table-wrap">

                            <table class="users-table">

                                <thead>

                                    <tr>

                                        <th>
                                            USER
                                        </th>

                                        <th>
                                            ROLE
                                        </th>

                                        <th>
                                            USER ID
                                        </th>

                                        <th>
                                            CREATED
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>


                                <tbody
                                    id="usersTableBody"
                                >

                                    <tr>

                                        <td
                                            colspan="6"
                                        >

                                            <div class="table-loading">
                                                Loading users...
                                            </div>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>


                        <!-- PAGINATION -->

                        <div
                            id="usersPagination"
                            class="users-pagination"
                        ></div>

                    </section>

                </main>

            </section>

        </div>
    `;


    // ======================================
    // ADMIN EMAIL
    // ======================================

    const savedUser =
        JSON.parse(
            localStorage.getItem(
                "adminUser"
            )
        );


    if (
        savedUser &&
        savedUser.email
    ) {

        setText(
            "usersAdminEmail",
            savedUser.email
        );

    }


    // ======================================
    // LOGOUT
    // ======================================

    document
        .getElementById(
            "logoutButton"
        )
        .addEventListener(
            "click",
            logout
        );


    // ======================================
    // NAVIGATION
    // ======================================

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    async () => {

                        const page =
                            item.dataset.page;


                        if (
                            page ===
                            "dashboard"
                        ) {

                            showDashboard(
                                savedUser
                            );

                            await loadStats();

                            return;

                        }


                        if (
                            page ===
                            "users"
                        ) {

                            await showUsersPage();

                            return;

                        }


                        showComingSoon(
                            item.textContent.trim()
                        );

                    }
                );

            }
        );


    // ======================================
    // SEARCH
    // ======================================

    document
        .getElementById(
            "userSearch"
        )
        .addEventListener(
            "input",
            filterUsers
        );


    // ======================================
    // REFRESH
    // ======================================

    document
        .getElementById(
            "refreshUsers"
        )
        .addEventListener(
            "click",
            loadUsers
        );


    // ======================================
    // LOAD USERS
    // ======================================

    await loadUsers();

}


// ==========================================
// USERS DATA
// ==========================================

let adminUsers = [];


// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    const token =
        localStorage.getItem(
            "adminToken"
        );


    if (!token) {

        logout();

        return;

    }


    const table =
        document.getElementById(
            "usersTableBody"
        );


    if (table) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="table-loading">
                        Loading users...
                    </div>

                </td>

            </tr>

        `;

    }


    try {

        const response =
            await fetch(
                `${API}/admin/users`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Unable to load users."
            );

        }


        if (
            data.success !== true
        ) {

            throw new Error(
                "Invalid users response."
            );

        }


        adminUsers =
            Array.isArray(
                data.users
            )
                ? data.users
                : [];


        updateUserStatistics(
            adminUsers
        );


        renderUsers(
            adminUsers
        );


    } catch (error) {

        console.error(
            "Failed to load users:",
            error
        );


        if (table) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">

                        <div class="table-error">
                            ${escapeHtml(
                                error.message ||
                                "Unable to load users."
                            )}
                        </div>

                    </td>

                </tr>

            `;

        }

    }

}


// ==========================================
// USER STATISTICS
// ==========================================

function updateUserStatistics(
    users
) {

    const total =
        users.length;


    const admins =
        users.filter(
            (user) =>
                user.role ===
                "admin"
        ).length;


    const regular =
        users.filter(
            (user) =>
                user.role !==
                "admin"
        ).length;


    setText(
        "usersTotal",
        formatNumber(total)
    );


    setText(
        "usersActive",
        formatNumber(total)
    );


    setText(
        "usersAdmins",
        formatNumber(admins)
    );


    setText(
        "regularUsers",
        formatNumber(regular)
    );


    setText(
        "usersResultCount",
        `${formatNumber(total)} users`
    );

}


// ==========================================
// RENDER USERS
// ==========================================

function renderUsers(
    users
) {

    const table =
        document.getElementById(
            "usersTableBody"
        );


    if (!table) {
        return;
    }


    if (
        users.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="table-empty">
                        No users found.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        users
            .map(
                (user) => {

                    const isAdmin =
                        user.role ===
                        "admin";


                    const created =
                        formatDate(
                            user.created_at
                        );


                    return `

                        <tr>

                            <td>

                                <div class="user-cell">

                                    <div
                                        class="user-avatar"
                                    >
                                        ${getInitials(
                                            user.email
                                        )}
                                    </div>

                                    <div
                                        class="user-info"
                                    >

                                        <strong>
                                            ${escapeHtml(
                                                user.email
                                            )}
                                        </strong>

                                        <span>
                                            Registered account
                                        </span>

                                    </div>

                                </div>

                            </td>


                            <td>

                                <span
                                    class="
                                        role-badge
                                        ${
                                            isAdmin
                                                ? "admin-role"
                                                : "user-role"
                                        }
                                    "
                                >

                                    ${
                                        isAdmin
                                            ? "ADMIN"
                                            : "USER"
                                    }

                                </span>

                            </td>


                            <td>

                                <span
                                    class="user-id"
                                    title="${escapeHtml(
                                        user.id
                                    )}"
                                >
                                    ${escapeHtml(
                                        shortenId(
                                            user.id
                                        )
                                    )}
                                </span>

                            </td>


                            <td>

                                <span class="created-date">

                                    ${escapeHtml(
                                        created
                                    )}

                                </span>

                            </td>


                            <td>

                                <span
                                    class="
                                        status-badge
                                        active-status
                                    "
                                >

                                    <i></i>
                                    ACTIVE

                                </span>

                            </td>


                            <td>

                                <button
                                    class="user-view-button"
                                    data-user-id="${escapeHtml(
                                        user.id
                                    )}"
                                >
                                    VIEW
                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    document
        .querySelectorAll(
            ".user-view-button"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const user =
                            adminUsers.find(
                                (item) =>
                                    item.id ===
                                    button.dataset.userId
                            );


                        if (user) {

                            showUserDetails(
                                user
                            );

                        }

                    }
                );

            }
        );

}


// ==========================================
// SEARCH USERS
// ==========================================

function filterUsers(
    event
) {

    const query =
        event.target.value
            .trim()
            .toLowerCase();


    if (!query) {

        renderUsers(
            adminUsers
        );

        return;

    }


    const filtered =
        adminUsers.filter(
            (user) => {

                return (
                    String(
                        user.email
                    )
                        .toLowerCase()
                        .includes(query)
                    ||
                    String(
                        user.id
                    )
                        .toLowerCase()
                        .includes(query)
                    ||
                    String(
                        user.role
                    )
                        .toLowerCase()
                        .includes(query)
                );

            }
        );


    setText(
        "usersResultCount",
        `${formatNumber(
            filtered.length
        )} matching users`
    );


    renderUsers(
        filtered
    );

}


// ==========================================
// USER DETAILS + REAL PERFORMANCE
// ==========================================

async function showUserDetails(user) {

    const existing =
        document.getElementById(
            "userDetailsModal"
        );

    if (existing) {
        existing.remove();
    }

    const isAdmin =
        user.role === "admin";

    const modal =
        document.createElement("div");

    modal.id =
        "userDetailsModal";

    modal.className =
        "modal-overlay";

    modal.innerHTML = `

        <div class="user-modal">

            <button
                class="modal-close"
                id="closeUserModal"
            >
                ×
            </button>

            <div class="modal-avatar">
                ${getInitials(user.email)}
            </div>

            <h2>
                User Details
            </h2>

            <p class="modal-email">
                ${escapeHtml(user.email)}
            </p>

            <div class="user-detail-list">

                <div class="detail-row">
                    <span>User ID</span>

                    <strong>
                        ${escapeHtml(user.id)}
                    </strong>
                </div>

                <div class="detail-row">
                    <span>Email</span>

                    <strong>
                        ${escapeHtml(user.email)}
                    </strong>
                </div>

                <div class="detail-row">
                    <span>Role</span>

                    <strong>
                        ${
                            isAdmin
                                ? "Administrator"
                                : "User"
                        }
                    </strong>
                </div>

                <div class="detail-row">
                    <span>Created</span>

                    <strong>
                        ${escapeHtml(
                            formatDate(
                                user.created_at
                            )
                        )}
                    </strong>
                </div>

                <div class="detail-row">
                    <span>Status</span>

                    <strong class="positive">
                        ACTIVE
                    </strong>
                </div>

            </div>

            <!-- REAL TRADING PERFORMANCE -->

            <div class="user-performance">

                <div class="user-performance-header">

                    <div>
                        <h3>
                            Trading Performance
                        </h3>

                        <span>
                            Real recorded trades
                        </span>
                    </div>

                    <div
                        id="userPerformanceStatus"
                        class="performance-loading"
                    >
                        Loading...
                    </div>

                </div>

               <div class="user-performance">

    <div class="user-performance-header">

        <div>
            <h3>
                Trading Performance
            </h3>

            <span>
                Real recorded trades
            </span>
        </div>

        <div
            id="userPerformanceStatus"
            class="performance-loading"
        >
            Loading...
        </div>

    </div>


    <!-- TRADE STATISTICS -->

    <div class="performance-section-title">
        TRADE RESULTS
    </div>

    <div class="user-performance-grid">

        <div class="performance-stat">

            <span>
                TOTAL TRADES
            </span>

            <strong id="userTotalTrades">
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                WINS
            </span>

            <strong
                id="userWins"
                class="stat-win"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                LOSSES
            </span>

            <strong
                id="userLosses"
                class="stat-loss"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                DRAWS
            </span>

            <strong
                id="userDraws"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                WIN RATE
            </span>

            <strong id="userWinRate">
                —
            </strong>

        </div>

    </div>


    <!-- FINANCIAL -->

    <div class="performance-section-title">
        FINANCIAL PERFORMANCE
    </div>

    <div class="user-performance-grid">

        <div class="performance-stat">

            <span>
                TOTAL PROFIT
            </span>

            <strong
                id="userTotalProfit"
                class="stat-win"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                TOTAL LOSS
            </span>

            <strong
                id="userTotalLoss"
                class="stat-loss"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                NET P/L
            </span>

            <strong id="userNetProfit">
                —
            </strong>

        </div>

    </div>


    <!-- AI / SIGNAL QUALITY -->

    <div class="performance-section-title">
        SIGNAL QUALITY
    </div>

    <div class="user-performance-grid">

        <div class="performance-stat">

            <span>
                AVG CONFIDENCE
            </span>

            <strong
                id="userAvgConfidence"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                AVG PROBABILITY
            </span>

            <strong
                id="userAvgProbability"
            >
                —
            </strong>

        </div>


        <div class="performance-stat">

            <span>
                AVG AGREEMENT
            </span>

            <strong
                id="userAvgAgreement"
            >
                —
            </strong>

        </div>

    </div>


    <!-- RECENT TRADES -->

    <div class="performance-section-title">
        RECENT TRADES
    </div>

    <div class="user-trades-container">

        <div class="user-trades-header">

            <span>ASSET</span>
            <span>TYPE</span>
            <span>RESULT</span>
            <span>CONF.</span>
            <span>PROFIT</span>
            <span>TIME</span>

        </div>

        <div
            id="userRecentTrades"
            class="user-trades-list"
        >
            <div class="no-user-trades">
                Loading trades...
            </div>
        </div>

    </div>

</div>

            </div>

            <button
                id="closeUserModalButton"
                class="modal-primary-button"
            >
                CLOSE
            </button>

        </div>

    `;

    document.body.appendChild(modal);


    // ======================================
    // CLOSE
    // ======================================

    document
        .getElementById("closeUserModal")
        .addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById("closeUserModalButton")
        .addEventListener(
            "click",
            () => modal.remove()
        );


    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


    // ======================================
    // LOAD REAL PERFORMANCE
    // ======================================

    await loadUserPerformance(user.id);

}


// ==========================================
// LOAD REAL USER PERFORMANCE
// ==========================================

async function loadUserPerformance(userId) {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {
        return;
    }

    const status =
        document.getElementById(
            "userPerformanceStatus"
        );

    try {

        if (status) {
            status.textContent = "Loading...";
        }

        const response =
            await fetch(
                `${API}/admin/users/${encodeURIComponent(userId)}/performance`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Unable to load user performance."
            );

        }

        if (data.success !== true) {

            throw new Error(
                "Invalid performance response."
            );

        }

        const stats =
            data.statistics || {};

        const trades =
            Array.isArray(data.trades)
                ? data.trades
                : [];


        // ======================================
        // REAL STATISTICS
        // ======================================

        setText(
            "userTotalTrades",
            formatNumber(
                stats.total_trades || 0
            )
        );

        setText(
            "userWins",
            formatNumber(
                stats.wins || 0
            )
        );

        setText(
            "userLosses",
            formatNumber(
                stats.losses || 0
            )
        );

        setText(
            "userWinRate",
            stats.total_trades > 0
                ? `${stats.win_rate}%`
                : "—"
        );


        // ======================================
        // FINANCIAL PERFORMANCE
        // ======================================

        setText(
            "userTotalProfit",
            formatMoney(
                stats.total_profit
            )
        );

        setText(
            "userTotalLoss",
            formatMoney(
                stats.total_loss
            )
        );

        setText(
            "userNetProfit",
            formatMoney(
                stats.net_profit
            )
        );


        // ======================================
        // TRADING QUALITY
        // ======================================

        setText(
            "userAvgConfidence",
            formatPercent(
                stats.average_confidence
            )
        );

        setText(
            "userAvgProbability",
            formatPercent(
                stats.average_probability
            )
        );

        setText(
            "userAvgAgreement",
            formatPercent(
                stats.average_agreement
            )
        );


        // ======================================
        // DRAW COUNT
        // ======================================

        setText(
            "userDraws",
            formatNumber(
                stats.draws || 0
            )
        );


        // ======================================
        // RECENT TRADES
        // ======================================

        renderUserRecentTrades(
            trades.slice(0, 8)
        );


        if (status) {
            status.textContent =
                "Live database";
        }

    } catch (error) {

        console.error(
            "Failed to load user performance:",
            error
        );

        if (status) {
            status.textContent =
                "Unavailable";
        }

        setText(
            "userTotalTrades",
            "—"
        );

        setText(
            "userWins",
            "—"
        );

        setText(
            "userLosses",
            "—"
        );

        setText(
            "userWinRate",
            "—"
        );

        setText(
            "userTotalProfit",
            "—"
        );

        setText(
            "userTotalLoss",
            "—"
        );

        setText(
            "userNetProfit",
            "—"
        );

        setText(
            "userAvgConfidence",
            "—"
        );

        setText(
            "userAvgProbability",
            "—"
        );

        setText(
            "userAvgAgreement",
            "—"
        );

        setText(
            "userDraws",
            "—"
        );
    }
}


// ==========================================
// RECENT USER TRADES
// ==========================================

function renderUserRecentTrades(trades) {

    const container =
        document.getElementById(
            "userRecentTrades"
        );

    if (!container) {
        return;
    }

    if (!trades.length) {

        container.innerHTML = `
            <div class="no-user-trades">
                No recorded trades for this user.
            </div>
        `;

        return;
    }

    container.innerHTML =
        trades.map(
            (trade) => {

                const result =
                    String(
                        trade.result || ""
                    ).toUpperCase();

                const action =
                    String(
                        trade.action || ""
                    ).toUpperCase();

                const resultClass =
                    result === "WIN"
                        ? "trade-win"
                        : result === "LOSS"
                            ? "trade-loss"
                            : "trade-neutral";

                const actionClass =
                    action === "CALL"
                        ? "trade-call"
                        : action === "PUT"
                            ? "trade-put"
                            : "";

                const profit =
                    Number(
                        trade.profit || 0
                    );

                return `

                    <div class="user-trade-row">

                        <div class="user-trade-asset">
                            ${escapeHtml(
                                trade.asset || "—"
                            )}
                        </div>

                        <div>
                            <span
                                class="
                                    trade-action
                                    ${actionClass}
                                "
                            >
                                ${escapeHtml(
                                    action || "—"
                                )}
                            </span>
                        </div>

                        <div>
                            <span
                                class="
                                    trade-result
                                    ${resultClass}
                                "
                            >
                                ${escapeHtml(
                                    result || "—"
                                )}
                            </span>
                        </div>

                        <div>
                            ${
                                trade.confidence != null
                                    ? `${trade.confidence}%`
                                    : "—"
                            }
                        </div>

                        <div
                            class="
                                trade-profit
                                ${
                                    profit > 0
                                        ? "profit-positive"
                                        : profit < 0
                                            ? "profit-negative"
                                            : ""
                                }
                            "
                        >
                            ${formatMoney(profit)}
                        </div>

                        <div>
                            ${formatDateTime(
                                trade.entry_time
                            )}
                        </div>

                    </div>

                `;
            }
        )
        .join("");
}


// ==========================================
// HELPERS
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value;
    }
}


function formatNumber(value) {

    const number =
        Number(value || 0);

    return number.toLocaleString(
        "en-US"
    );
}


function formatMoney(value) {

    const number =
        Number(value || 0);

    const sign =
        number > 0
            ? "+"
            : "";

    return `${sign}$${number.toFixed(2)}`;
}


function formatPercent(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    return `${Number(value).toFixed(1)}%`;
}


function formatDateTime(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }

    return date.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );
}

// ==========================================
// USER HELPERS
// ==========================================

function getInitials(
    email
) {

    const value =
        String(
            email || ""
        );


    if (!value) {
        return "U";
    }


    const first =
        value.charAt(
            0
        ).toUpperCase();


    const at =
        value.indexOf(
            "@"
        );


    const second =
        at > 1
            ? value.charAt(
                1
            ).toUpperCase()
            : "";


    return (
        first +
        second
    );

}


function shortenId(
    id
) {

    const value =
        String(
            id || ""
        );


    if (
        value.length <= 14
    ) {

        return value;

    }


    return (
        value.substring(
            0,
            8
        ) +
        "..." +
        value.substring(
            value.length - 4
        )
    );

}


function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}

// ==========================================
// COMING SOON
// ==========================================

function showComingSoon(page) {

    console.log(
        `${page} section is planned next.`
    );


    setTimeout(
        () => {

            document
                .querySelectorAll(
                    ".nav-item"
                )
                .forEach((item) => {

                    item.classList.toggle(
                        "active",
                        item.dataset.page ===
                            "dashboard"
                    );

                });

        },
        500
    );
}


// ==========================================
// HELPERS
// ==========================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value;
    }
}


function formatNumber(value) {

    return Number(
        value
    ).toLocaleString(
        "en-US"
    );

}


function logout() {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminUser"
    );

    showLogin();

}


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
// RESTORE ADMIN SESSION
// ==========================================

async function checkExistingSession() {

    const token =
        localStorage.getItem(
            "adminToken"
        );

    const savedUser =
        localStorage.getItem(
            "adminUser"
        );


    if (
        !token ||
        !savedUser
    ) {

        showLogin();

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/auth/admin/test`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
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


        if (
            data.success !== true
        ) {

            throw new Error(
                "Admin access denied."
            );

        }


        const user =
            JSON.parse(
                savedUser
            );


        showDashboard(
            user
        );


        await loadStats();


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


checkExistingSession();