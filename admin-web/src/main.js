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


                if (page === "trades") {

                     await showTradesPage();

                } else if (page === "performance") {

                     await showPerformancePage();

                } else if (page === "assets") {

                    await showAssetsPage();

                } else if (page === "signals") {

                   await showSignalsPage();

                 } else if (page === "subscriptions") {

                      await showSubscriptionsPage();

                } else if (page === "coupons") {

                    await showCouponsPage();
                } else if (page === "payments") {

                    await showPaymentsPage();

                } else {

                showComingSoon(
                   item.textContent.trim()
               );

                }
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

<div class="user-modal-actions">

    <button
        id="closeUserModalButton"
        class="modal-primary-button"
    >
        CLOSE
    </button>

    ${
        !isAdmin
            ? `
                <button
                    id="deleteUserButton"
                    class="modal-danger-button"
                >
                    DELETE USER
                </button>
            `
            : ""
    }

</div>

</div>
`;

    document.body.appendChild(modal);
    document
    .getElementById("deleteUserButton")
    ?.addEventListener("click", async () => {

        const confirmed = confirm(
            `Delete ${user.email}?\n\nThis will permanently delete this user and their account data.`
        );

        if (!confirmed) {
            return;
        }

        try {

            const token =
                localStorage.getItem("adminToken");

            const response =
                await fetch(
                    `${API}/admin/users/${user.id}`,
                    {
                        method: "DELETE",
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
                    "Failed to delete user."
                );
            }

            alert("User deleted successfully.");

            document
                .getElementById("userDetailsModal")
                ?.remove();

            await loadUsers();

        } catch (error) {

            console.error(
                "Delete user failed:",
                error
            );

            alert(
                error.message ||
                "Failed to delete user."
            );
        }
    });


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
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}
function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    showLogin();
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("en-US");
}

function formatMoney(value) {
    const number = Number(value || 0);
    const sign = number > 0 ? "+" : "";
    return `${sign}$${number.toFixed(2)}`;
}

function formatPercent(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }
    return `${Number(value).toFixed(1)}%`;
}

function formatDateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
// ==========================================
// USER HELPERS
// ==========================================

function getInitials(email) {
    const value = String(email || "");
    if (!value) return "U";

    const first = value.charAt(0).toUpperCase();
    const at = value.indexOf("@");

    const second =
        at > 1 ? value.charAt(1).toUpperCase() : "";

    return first + second;
}

function shortenId(id) {
    const value = String(id || "");

    if (value.length <= 14) {
        return value;
    }

    return value.substring(0, 8) +
        "..." +
        value.substring(value.length - 4);
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
// ==========================================
// TRADES PAGE
// ==========================================

let adminTradesCache = [];
let adminTradesPage = 1;
let adminTradesPerPage = 25;

async function showTradesPage() {

    const content =
        document.querySelector(".main-area .content");

    if (!content) {
        console.error("Trades page content container not found.");
        return;
    }

    content.innerHTML = `
        <div class="page-content">

            <div class="page-header">
                <div>
                    <h1>Trades</h1>
                    <p>Real recorded trading activity</p>
                </div>
            </div>

            <!-- STATISTICS -->
            <div class="trades-kpi-grid">

                <div class="trades-kpi">
                    <span>TOTAL TRADES</span>
                    <strong id="tradesTotal">—</strong>
                </div>

                <div class="trades-kpi">
                    <span>WINS</span>
                    <strong id="tradesWins" class="win">—</strong>
                </div>

                <div class="trades-kpi">
                    <span>LOSSES</span>
                    <strong id="tradesLosses" class="loss">—</strong>
                </div>

                <div class="trades-kpi">
                    <span>WIN RATE</span>
                    <strong id="tradesWinRate">—</strong>
                </div>

                <div class="trades-kpi">
                    <span>NET P/L</span>
                    <strong id="tradesProfit" class="gold">—</strong>
                </div>

            </div>

            <!-- TRADES PANEL -->
            <div class="panel trades-panel">

                <!-- FILTERS -->
                <div class="trades-filters">

                    <input
                        id="tradeSearch"
                        type="text"
                        placeholder="Search ID, asset, or user ID..."
                    >

                    <select id="tradeActionFilter">
                        <option value="ALL">All Types</option>
                        <option value="CALL">CALL</option>
                        <option value="PUT">PUT</option>
                    </select>

                    <select id="tradeResultFilter">
                        <option value="ALL">All Results</option>
                        <option value="WIN">WIN</option>
                        <option value="LOSS">LOSS</option>
                        <option value="DRAW">DRAW</option>
                    </select>

                    <select id="tradeStatusFilter">
                        <option value="ALL">All Status</option>
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>

                    <select id="tradeAssetFilter">
                        <option value="ALL">All Assets</option>
                    </select>

                    <button
                        id="clearTradeFilters"
                        class="trades-clear"
                    >
                        CLEAR
                    </button>

                </div>

                <!-- TOOLBAR -->
                <div class="trades-toolbar">

                    <span
                        id="tradesCount"
                        class="trades-count"
                    >
                        Loading trades...
                    </span>

                    <div class="trades-toolbar-right">

                        <label>
                            Show
                            <select id="tradesPerPage">
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </label>

                        <button
                            id="refreshTrades"
                            class="trades-refresh"
                        >
                            REFRESH
                        </button>

                    </div>

                </div>

                <!-- TABLE -->
                <div
                    id="tradesTableContainer"
                    class="trades-table-wrap"
                >
                    <div class="trade-loading">
                        Loading trades...
                    </div>
                </div>

                <!-- PAGINATION -->
                <div
                    id="tradesPagination"
                    class="trades-pagination"
                ></div>

            </div>

        </div>
    `;

    await loadAdminTrades();

    document
        .getElementById("refreshTrades")
        ?.addEventListener(
            "click",
            loadAdminTrades
        );

    document
        .getElementById("tradeSearch")
        ?.addEventListener(
            "input",
            applyTradeFilters
        );

    document
        .getElementById("tradeActionFilter")
        ?.addEventListener(
            "change",
            applyTradeFilters
        );

    document
        .getElementById("tradeResultFilter")
        ?.addEventListener(
            "change",
            applyTradeFilters
        );

    document
        .getElementById("tradeStatusFilter")
        ?.addEventListener(
            "change",
            applyTradeFilters
        );

    document
        .getElementById("tradeAssetFilter")
        ?.addEventListener(
            "change",
            applyTradeFilters
        );

    document
        .getElementById("clearTradeFilters")
        ?.addEventListener(
            "click",
            clearTradeFilters
        );

    document
        .getElementById("tradesPerPage")
        ?.addEventListener(
            "change",
            (event) => {

                adminTradesPerPage =
                    Number(event.target.value);

                adminTradesPage = 1;

                renderFilteredTrades();

            }
        );
}


// ==========================================
// LOAD ADMIN TRADES
// ==========================================

async function loadAdminTrades() {

    const token =
        localStorage.getItem("adminToken");

    const container =
        document.getElementById(
            "tradesTableContainer"
        );

    if (!container) {
        return;
    }

    try {

        container.innerHTML = `
            <div class="trade-loading">
                Loading trades...
            </div>
        `;

        const response =
            await fetch(
                `${API}/admin/trades`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Failed to load trades."
            );
        }

        const data =
            await response.json();

        adminTradesCache =
            data.trades || [];

        adminTradesPage = 1;

        populateTradeAssetFilter();

        updateTradeStatistics();

        renderFilteredTrades();

    } catch (error) {

        console.error(
            "Admin trades failed:",
            error
        );

        container.innerHTML = `
            <div class="trade-error">
                Failed to load trades.
            </div>
        `;
    }
}


// ==========================================
// ASSET FILTER
// ==========================================

function populateTradeAssetFilter() {

    const select =
        document.getElementById(
            "tradeAssetFilter"
        );

    if (!select) {
        return;
    }

    const assets =
        [
            ...new Set(
                adminTradesCache
                    .map(trade =>
                        trade.asset
                    )
                    .filter(Boolean)
            )
        ]
        .sort();

    select.innerHTML = `
        <option value="ALL">
            All Assets
        </option>
    `;

    assets.forEach(asset => {

        const option =
            document.createElement("option");

        option.value = asset;
        option.textContent = asset;

        select.appendChild(option);

    });
}


// ==========================================
// STATISTICS
// ==========================================

function updateTradeStatistics() {

    const trades =
        adminTradesCache;

    const total =
        trades.length;

    const wins =
        trades.filter(
            trade =>
                String(
                    trade.result || ""
                ).toUpperCase() === "WIN"
        ).length;

    const losses =
        trades.filter(
            trade =>
                String(
                    trade.result || ""
                ).toUpperCase() === "LOSS"
        ).length;

    const draws =
        trades.filter(
            trade =>
                String(
                    trade.result || ""
                ).toUpperCase() === "DRAW"
        ).length;

    const completed =
        wins + losses;

    const winRate =
        completed
            ? ((wins / completed) * 100).toFixed(2)
            : "0.00";

    const netProfit =
        trades.reduce(
            (sum, trade) =>
                sum +
                Number(
                    trade.profit || 0
                ),
            0
        );

    setText(
        "tradesTotal",
        formatNumber(total)
    );

    setText(
        "tradesWins",
        formatNumber(wins)
    );

    setText(
        "tradesLosses",
        formatNumber(losses)
    );

    setText(
        "tradesWinRate",
        `${winRate}%`
    );

    setText(
        "tradesProfit",
        formatMoney(netProfit)
    );

    setText(
        "tradesCount",
        `${formatNumber(total)} trades • ${draws} draws`
    );
}


// ==========================================
// FILTER TRADES
// ==========================================

function applyTradeFilters() {

    adminTradesPage = 1;

    renderFilteredTrades();
}


// ==========================================
// CLEAR FILTERS
// ==========================================

function clearTradeFilters() {

    const search =
        document.getElementById(
            "tradeSearch"
        );

    const action =
        document.getElementById(
            "tradeActionFilter"
        );

    const result =
        document.getElementById(
            "tradeResultFilter"
        );

    const status =
        document.getElementById(
            "tradeStatusFilter"
        );

    const asset =
        document.getElementById(
            "tradeAssetFilter"
        );

    if (search) {
        search.value = "";
    }

    if (action) {
        action.value = "ALL";
    }

    if (result) {
        result.value = "ALL";
    }

    if (status) {
        status.value = "ALL";
    }

    if (asset) {
        asset.value = "ALL";
    }

    adminTradesPage = 1;

    renderFilteredTrades();
}


// ==========================================
// FILTER + PAGINATION
// ==========================================

function getFilteredTrades() {

    const search =
        (
            document.getElementById(
                "tradeSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();

    const action =
        document.getElementById(
            "tradeActionFilter"
        )?.value || "ALL";

    const result =
        document.getElementById(
            "tradeResultFilter"
        )?.value || "ALL";

    const status =
        document.getElementById(
            "tradeStatusFilter"
        )?.value || "ALL";

    const asset =
        document.getElementById(
            "tradeAssetFilter"
        )?.value || "ALL";

    return adminTradesCache.filter(
        trade => {

            const tradeId =
                String(
                    trade.id || ""
                ).toLowerCase();

            const tradeAsset =
                String(
                    trade.asset || ""
                ).toLowerCase();

            const userId =
                String(
                    trade.user_id || ""
                ).toLowerCase();

            const tradeAction =
                String(
                    trade.action || ""
                ).toUpperCase();

            const tradeResult =
                String(
                    trade.result || ""
                ).toUpperCase();

            const tradeStatus =
                String(
                    trade.status || ""
                ).toUpperCase();

            if (
                search &&
                !tradeId.includes(search) &&
                !tradeAsset.includes(search) &&
                !userId.includes(search)
            ) {
                return false;
            }

            if (
                action !== "ALL" &&
                tradeAction !== action
            ) {
                return false;
            }

            if (
                result !== "ALL" &&
                tradeResult !== result
            ) {
                return false;
            }

            if (
                status !== "ALL" &&
                tradeStatus !== status
            ) {
                return false;
            }

            if (
                asset !== "ALL" &&
                String(
                    trade.asset || ""
                ) !== asset
            ) {
                return false;
            }

            return true;
        }
    );
}


// ==========================================
// RENDER FILTERED TRADES
// ==========================================

function renderFilteredTrades() {

    const filtered =
        getFilteredTrades();

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                adminTradesPerPage
            )
        );

    if (
        adminTradesPage >
        totalPages
    ) {
        adminTradesPage =
            totalPages;
    }

    const start =
        (
            adminTradesPage - 1
        ) *
        adminTradesPerPage;

    const end =
        start +
        adminTradesPerPage;

    const pageTrades =
        filtered.slice(
            start,
            end
        );

    renderAdminTrades(
        pageTrades,
        filtered.length
    );

    renderTradePagination(
        filtered.length,
        totalPages
    );
}


// ==========================================
// RENDER TRADE TABLE
// ==========================================

function renderAdminTrades(
    trades,
    filteredTotal
) {

    const container =
        document.getElementById(
            "tradesTableContainer"
        );

    if (!container) {
        return;
    }

    if (!trades.length) {

        container.innerHTML = `
            <div class="trade-empty">
                No trades match your filters.
            </div>
        `;

        return;
    }

    const rows =
        trades.map(
            trade => {

                const result =
                    String(
                        trade.result || "—"
                    ).toUpperCase();

                const action =
                    String(
                        trade.action || "—"
                    ).toUpperCase();

                const resultClass =
                    result === "WIN"
                        ? "trade-win"
                        : result === "LOSS"
                            ? "trade-loss"
                            : result === "DRAW"
                                ? "trade-draw"
                                : "trade-neutral";

                const actionClass =
                    action === "CALL"
                        ? "trade-call"
                        : action === "PUT"
                            ? "trade-put"
                            : "trade-neutral";

                const profit =
                    Number(
                        trade.profit || 0
                    );

                const profitClass =
                    profit > 0
                        ? "trade-profit-positive"
                        : profit < 0
                            ? "trade-profit-negative"
                            : "trade-neutral";

                return `
                    <tr>

                        <td class="trade-id">
                            ${escapeHtml(
                                shortenId(
                                    trade.id
                                )
                            )}
                        </td>

                        <td class="trade-asset">
                            ${escapeHtml(
                                trade.asset || "—"
                            )}
                        </td>

                        <td class="${actionClass}">
                            ${escapeHtml(action)}
                        </td>

                        <td class="${resultClass}">
                            ${escapeHtml(result)}
                        </td>

                        <td>
                            ${formatPercent(
                                trade.confidence
                            )}
                        </td>

                        <td>
                            ${formatPercent(
                                trade.probability
                            )}
                        </td>

                        <td>
                            ${formatPercent(
                                trade.agreement_score
                            )}
                        </td>

                        <td>
                            <span class="trade-badge trade-grade">
                                ${escapeHtml(
                                    trade.grade || "—"
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHtml(
                                trade.risk || "—"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                trade.trend || "—"
                            )}
                        </td>

                        <td class="${profitClass}">
                            ${formatMoney(profit)}
                        </td>

                        <td class="trade-status">
                            ${escapeHtml(
                                trade.status || "—"
                            )}
                        </td>

                        <td>
                            ${formatDateTime(
                                trade.entry_time
                            )}
                        </td>

                        <td>
                            ${formatDateTime(
                                trade.exit_time
                            )}
                        </td>

                    </tr>
                `;
            }
        )
        .join("");

    container.innerHTML = `
        <table class="trades-table">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>ASSET</th>
                    <th>TYPE</th>
                    <th>RESULT</th>
                    <th>CONF.</th>
                    <th>PROB.</th>
                    <th>AGREE.</th>
                    <th>GRADE</th>
                    <th>RISK</th>
                    <th>TREND</th>
                    <th>PROFIT</th>
                    <th>STATUS</th>
                    <th>ENTRY</th>
                    <th>EXIT</th>
                </tr>
            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;

    setText(
        "tradesCount",
        `${formatNumber(filteredTotal)} matching trades`
    );
}


// ==========================================
// PAGINATION
// ==========================================

function renderTradePagination(
    total,
    totalPages
) {

    const pagination =
        document.getElementById(
            "tradesPagination"
        );

    if (!pagination) {
        return;
    }

    if (total === 0) {

        pagination.innerHTML = "";

        return;
    }

    pagination.innerHTML = `
        <div class="pagination-info">
            Page ${adminTradesPage}
            of ${totalPages}
        </div>

        <div class="pagination-buttons">

            <button
                class="pagination-button"
                ${adminTradesPage === 1 ? "disabled" : ""}
                onclick="changeTradesPage(${adminTradesPage - 1})"
            >
                ← PREVIOUS
            </button>

            <span class="pagination-current">
                ${adminTradesPage}
            </span>

            <button
                class="pagination-button"
                ${adminTradesPage === totalPages ? "disabled" : ""}
                onclick="changeTradesPage(${adminTradesPage + 1})"
            >
                NEXT →
            </button>

        </div>
    `;
}


// ==========================================
// CHANGE PAGE
// ==========================================

function changeTradesPage(page) {

    const filtered =
        getFilteredTrades();

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                adminTradesPerPage
            )
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    adminTradesPage = page;

    renderFilteredTrades();
}
// ==========================================
// SIGNALS PAGE
// ==========================================

let adminSignalsCache = [];
let adminSignalsPage = 1;
let adminSignalsPerPage = 25;

async function showSignalsPage() {

    const content =
        document.querySelector(".main-area .content");

    if (!content) {
        console.error(
            "Signals page content container not found."
        );
        return;
    }

    content.innerHTML = `
        <div class="page-content">

            <div class="page-header">

                <div>
                    <h1>Signals</h1>

                    <p>
                        Real recorded signal activity and AI quality
                    </p>
                </div>

                <button
                    id="signalsRefresh"
                    class="refresh-button"
                >
                    ↻ Refresh
                </button>

            </div>


            <!-- ========================== -->
            <!-- SIGNAL SUMMARY -->
            <!-- ========================== -->

            <div class="trades-kpi-grid">

                <div class="trades-kpi">
                    <span>TOTAL SIGNALS</span>
                    <strong id="signalsTotal">
                        —
                    </strong>
                </div>

                <div class="trades-kpi">
                    <span>CALL SIGNALS</span>
                    <strong
                        id="signalsCall"
                        class="stat-win"
                    >
                        —
                    </strong>
                </div>

                <div class="trades-kpi">
                    <span>PUT SIGNALS</span>
                    <strong
                        id="signalsPut"
                        class="stat-loss"
                    >
                        —
                    </strong>
                </div>

                <div class="trades-kpi">
                    <span>WAIT SIGNALS</span>
                    <strong id="signalsWait">
                        —
                    </strong>
                </div>

                <div class="trades-kpi">
                    <span>WIN RATE</span>
                    <strong id="signalsWinRate">
                        —
                    </strong>
                </div>

            </div>


            <!-- ========================== -->
            <!-- SIGNAL QUALITY -->
            <!-- ========================== -->

            <div class="panel">

                <div class="panel-header">

                    <div>
                        <h2>
                            Signal Quality
                        </h2>

                        <p>
                            AI signal confidence and confirmation metrics
                        </p>
                    </div>

                </div>


                <div class="user-performance-grid">

                    <div class="performance-stat">

                        <span>
                            AVG CONFIDENCE
                        </span>

                        <strong
                            id="signalsAvgConfidence"
                        >
                            —
                        </strong>

                    </div>


                    <div class="performance-stat">

                        <span>
                            AVG PROBABILITY
                        </span>

                        <strong
                            id="signalsAvgProbability"
                        >
                            —
                        </strong>

                    </div>


                    <div class="performance-stat">

                        <span>
                            AVG AGREEMENT
                        </span>

                        <strong
                            id="signalsAvgAgreement"
                        >
                            —
                        </strong>

                    </div>

                </div>

            </div>


            <!-- ========================== -->
            <!-- SIGNAL FILTERS -->
            <!-- ========================== -->

            <div class="panel">

                <div class="asset-filters">

                    <input
                        type="text"
                        id="signalSearch"
                        placeholder="Search asset..."
                    >


                    <select id="signalTypeFilter">

                        <option value="all">
                            All Signals
                        </option>

                        <option value="CALL">
                            CALL
                        </option>

                        <option value="PUT">
                            PUT
                        </option>

                        <option value="WAIT">
                            WAIT
                        </option>

                    </select>


                    <select id="signalResultFilter">

                        <option value="all">
                            All Results
                        </option>

                        <option value="WIN">
                            WIN
                        </option>

                        <option value="LOSS">
                            LOSS
                        </option>

                        <option value="DRAW">
                            DRAW
                        </option>

                        <option value="OPEN">
                            OPEN
                        </option>

                    </select>


                    <select id="signalGradeFilter">

                        <option value="all">
                            All Grades
                        </option>

                        <option value="A+">
                            A+
                        </option>

                        <option value="A">
                            A
                        </option>

                        <option value="B">
                            B
                        </option>

                        <option value="C">
                            C
                        </option>

                    </select>


                    <select id="signalConfidenceFilter">

                        <option value="0">
                            All Confidence
                        </option>

                        <option value="70">
                            70%+ Confidence
                        </option>

                        <option value="80">
                            80%+ Confidence
                        </option>

                        <option value="90">
                            90%+ Confidence
                        </option>

                        <option value="95">
                            95%+ Confidence
                        </option>

                    </select>


                    <select id="signalSort">

                        <option value="newest">
                            Newest
                        </option>

                        <option value="confidence">
                            Highest Confidence
                        </option>

                        <option value="probability">
                            Highest Probability
                        </option>

                        <option value="agreement">
                            Highest Agreement
                        </option>

                    </select>


                    <button
                        id="clearSignalFilters"
                        class="clear-button"
                    >
                        CLEAR
                    </button>

                </div>


                <div
                    id="signalsFilterCount"
                    class="asset-filter-count"
                >
                    Loading...
                </div>

            </div>


            <!-- ========================== -->
            <!-- SIGNAL TABLE -->
            <!-- ========================== -->

            <div class="panel">

                <div
                    id="signalsTableContainer"
                    class="table-wrap"
                >

                    <div class="trade-loading">
                        Loading signals...
                    </div>

                </div>


                <div
                    id="signalsPagination"
                    class="pagination-container"
                ></div>

            </div>

        </div>
    `;


    document
        .getElementById("signalsRefresh")
        ?.addEventListener(
            "click",
            loadSignalsData
        );


    document
        .getElementById("signalSearch")
        ?.addEventListener(
            "input",
            applySignalFilters
        );


    document
        .getElementById("signalTypeFilter")
        ?.addEventListener(
            "change",
            applySignalFilters
        );


    document
        .getElementById("signalResultFilter")
        ?.addEventListener(
            "change",
            applySignalFilters
        );


    document
        .getElementById("signalGradeFilter")
        ?.addEventListener(
            "change",
            applySignalFilters
        );


    document
        .getElementById("signalConfidenceFilter")
        ?.addEventListener(
            "change",
            applySignalFilters
        );


    document
        .getElementById("signalSort")
        ?.addEventListener(
            "change",
            applySignalFilters
        );


    document
        .getElementById("clearSignalFilters")
        ?.addEventListener(
            "click",
            clearSignalFilters
        );


    await loadSignalsData();
}
// ==========================================
// LOAD SIGNAL DATA
// ==========================================

async function loadSignalsData() {

    const token =
        localStorage.getItem("adminToken");

    const container =
        document.getElementById(
            "signalsTableContainer"
        );

    if (!container) {
        return;
    }

    try {

        container.innerHTML = `
            <div class="trade-loading">
                Loading signals...
            </div>
        `;

        const response =
            await fetch(
                `${API}/admin/trades`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Failed to load signals."
            );
        }

        const data =
            await response.json();

        const trades =
            data.trades || [];

        adminSignalsCache = trades;

        updateSignalSummary(trades);

        applySignalFilters();

    } catch (error) {

        console.error(
            "Signal data failed:",
            error
        );

        container.innerHTML = `
            <div class="trade-error">
                Failed to load signals.
            </div>
        `;
    }
}
// ==========================================
// SIGNAL SUMMARY
// ==========================================

function updateSignalSummary(trades) {

    const total = trades.length;

    const callCount = trades.filter(
        trade =>
            String(trade.action || "").toUpperCase() === "CALL"
    ).length;

    const putCount = trades.filter(
        trade =>
            String(trade.action || "").toUpperCase() === "PUT"
    ).length;

    const waitCount = trades.filter(
        trade =>
            String(trade.action || "").toUpperCase() === "WAIT"
    ).length;

    const wins = trades.filter(
        trade =>
            String(trade.result || "").toUpperCase() === "WIN"
    ).length;

    const losses = trades.filter(
        trade =>
            String(trade.result || "").toUpperCase() === "LOSS"
    ).length;

    const completed = wins + losses;

    const winRate =
        completed > 0
            ? (wins / completed) * 100
            : 0;

    const confidenceValues = trades
        .map(trade => Number(trade.confidence))
        .filter(value => !Number.isNaN(value));

    const probabilityValues = trades
        .map(trade => Number(trade.probability))
        .filter(value => !Number.isNaN(value));

    const agreementValues = trades
        .map(trade => Number(trade.agreement_score))
        .filter(value => !Number.isNaN(value));

    const average = values =>
        values.length
            ? values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length
            : 0;

    setText(
        "signalsTotal",
        formatNumber(total)
    );

    setText(
        "signalsCall",
        formatNumber(callCount)
    );

    setText(
        "signalsPut",
        formatNumber(putCount)
    );

    setText(
        "signalsWait",
        formatNumber(waitCount)
    );

    setText(
        "signalsWinRate",
        formatPercent(winRate)
    );

    setText(
        "signalsAvgConfidence",
        formatPercent(
            average(confidenceValues)
        )
    );

    setText(
        "signalsAvgProbability",
        formatPercent(
            average(probabilityValues)
        )
    );

    setText(
        "signalsAvgAgreement",
        formatPercent(
            average(agreementValues)
        )
    );
}
// ==========================================
// SIGNAL FILTERS
// ==========================================

function applySignalFilters() {

    let signals = [...adminSignalsCache];

    const search =
        (
            document.getElementById(
                "signalSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();

    const type =
        document.getElementById(
            "signalTypeFilter"
        )?.value || "all";

    const result =
        document.getElementById(
            "signalResultFilter"
        )?.value || "all";

    const grade =
        document.getElementById(
            "signalGradeFilter"
        )?.value || "all";

    const confidence =
        Number(
            document.getElementById(
                "signalConfidenceFilter"
            )?.value || 0
        );

    const sortBy =
        document.getElementById(
            "signalSort"
        )?.value || "newest";


    // SEARCH ASSET
    if (search) {

        signals = signals.filter(
            signal =>
                String(
                    signal.asset || ""
                )
                .toLowerCase()
                .includes(search)
        );
    }


    // SIGNAL TYPE
    if (type !== "all") {

        signals = signals.filter(
            signal =>
                String(
                    signal.action || ""
                ).toUpperCase() === type
        );
    }


    // RESULT
    if (result !== "all") {

        signals = signals.filter(
            signal =>
                String(
                    signal.result || ""
                ).toUpperCase() === result
        );
    }


    // GRADE
    if (grade !== "all") {

        signals = signals.filter(
            signal =>
                String(
                    signal.grade || ""
                ).toUpperCase() ===
                grade.toUpperCase()
        );
    }


    // MINIMUM CONFIDENCE
    if (confidence > 0) {

        signals = signals.filter(
            signal =>
                Number(
                    signal.confidence || 0
                ) >= confidence
        );
    }


    // SORT
    if (sortBy === "confidence") {

        signals.sort(
            (a, b) =>
                Number(b.confidence || 0) -
                Number(a.confidence || 0)
        );

    } else if (sortBy === "probability") {

        signals.sort(
            (a, b) =>
                Number(b.probability || 0) -
                Number(a.probability || 0)
        );

    } else if (sortBy === "agreement") {

        signals.sort(
            (a, b) =>
                Number(b.agreement_score || 0) -
                Number(a.agreement_score || 0)
        );

    } else {

        signals.sort(
            (a, b) =>
                new Date(
                    b.entry_time || 0
                ) -
                new Date(
                    a.entry_time || 0
                )
        );
    }


    adminSignalsPage = 1;

    renderSignalsTable(
        signals
    );
}
// ==========================================
// GET FILTERED SIGNALS
// ==========================================

function getFilteredSignals() {

    let signals =
        [...adminSignalsCache];

    const search =
        (
            document.getElementById(
                "signalSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();

    const type =
        document.getElementById(
            "signalTypeFilter"
        )?.value || "all";

    const result =
        document.getElementById(
            "signalResultFilter"
        )?.value || "all";

    const grade =
        document.getElementById(
            "signalGradeFilter"
        )?.value || "all";

    const confidence =
        Number(
            document.getElementById(
                "signalConfidenceFilter"
            )?.value || 0
        );

    const sortBy =
        document.getElementById(
            "signalSort"
        )?.value || "newest";


    if (search) {

        signals =
            signals.filter(
                signal =>
                    String(
                        signal.asset || ""
                    )
                    .toLowerCase()
                    .includes(search)
            );
    }


    if (type !== "all") {

        signals =
            signals.filter(
                signal =>
                    String(
                        signal.action || ""
                    ).toUpperCase() === type
            );
    }


    if (result !== "all") {

        signals =
            signals.filter(
                signal =>
                    String(
                        signal.result || ""
                    ).toUpperCase() === result
            );
    }


    if (grade !== "all") {

        signals =
            signals.filter(
                signal =>
                    String(
                        signal.grade || ""
                    ).toUpperCase() ===
                    grade.toUpperCase()
            );
    }


    if (confidence > 0) {

        signals =
            signals.filter(
                signal =>
                    Number(
                        signal.confidence || 0
                    ) >= confidence
            );
    }


    if (sortBy === "confidence") {

        signals.sort(
            (a, b) =>
                Number(b.confidence || 0) -
                Number(a.confidence || 0)
        );

    } else if (sortBy === "probability") {

        signals.sort(
            (a, b) =>
                Number(b.probability || 0) -
                Number(a.probability || 0)
        );

    } else if (sortBy === "agreement") {

        signals.sort(
            (a, b) =>
                Number(b.agreement_score || 0) -
                Number(a.agreement_score || 0)
        );

    } else {

        signals.sort(
            (a, b) =>
                new Date(
                    b.entry_time || 0
                ) -
                new Date(
                    a.entry_time || 0
                )
        );
    }


    return signals;
}
// ==========================================
// RENDER SIGNAL TABLE
// ==========================================

function renderSignalsTable(signals) {

    const container =
        document.getElementById(
            "signalsTableContainer"
        );

    const count =
        document.getElementById(
            "signalsFilterCount"
        );

    if (!container) {
        return;
    }


    if (count) {

        count.textContent =
            `${signals.length.toLocaleString(
                "en-US"
            )} matching signals`;
    }


    if (signals.length === 0) {

        container.innerHTML = `
            <div class="trade-loading">
                No signals match your filters.
            </div>
        `;

        return;
    }


    const start =
        (
            adminSignalsPage - 1
        ) *
        adminSignalsPerPage;

    const end =
        start +
        adminSignalsPerPage;

    const pageSignals =
        signals.slice(
            start,
            end
        );


    const rows =
        pageSignals
            .map(signal => {

                const action =
                    String(
                        signal.action || "—"
                    ).toUpperCase();

                const result =
                    String(
                        signal.result || "—"
                    ).toUpperCase();

                const confidence =
                    Number(
                        signal.confidence || 0
                    );

                const probability =
                    Number(
                        signal.probability || 0
                    );

                const agreement =
                    Number(
                        signal.agreement_score || 0
                    );

                let actionClass = "";

                if (action === "CALL") {
                    actionClass = "result-win";
                } else if (action === "PUT") {
                    actionClass = "result-loss";
                }


                let resultClass = "";

                if (result === "WIN") {
                    resultClass = "result-win";
                } else if (result === "LOSS") {
                    resultClass = "result-loss";
                }


                return `
                    <tr>

                        <td>
                            ${formatDateTime(
                                signal.entry_time
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    signal.asset ||
                                    "—"
                                )}
                            </strong>
                        </td>

                        <td>
                            <span
                                class="${actionClass}"
                            >
                                ${escapeHtml(
                                    action
                                )}
                            </span>
                        </td>

                        <td>
                            ${confidence.toFixed(1)}%
                        </td>

                        <td>
                            ${probability.toFixed(1)}%
                        </td>

                        <td>
                            ${agreement.toFixed(1)}%
                        </td>

                        <td>
                            ${escapeHtml(
                                signal.grade ||
                                "—"
                            )}
                        </td>

                        <td>
                            <span
                                class="${resultClass}"
                            >
                                ${escapeHtml(
                                    result
                                )}
                            </span>
                        </td>

                    </tr>
                `;
            })
            .join("");


    container.innerHTML = `
        <table class="trades-table">

            <thead>

                <tr>

                    <th>TIME</th>

                    <th>ASSET</th>

                    <th>SIGNAL</th>

                    <th>CONF.</th>

                    <th>PROB.</th>

                    <th>AGREE.</th>

                    <th>GRADE</th>

                    <th>RESULT</th>

                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;


    renderSignalsPagination(
        signals.length
    );
}
// ==========================================
// SIGNAL PAGINATION
// ==========================================

function renderSignalsPagination(total) {

    const container =
        document.getElementById(
            "signalsPagination"
        );

    if (!container) {
        return;
    }

    const totalPages =
        Math.ceil(
            total / adminSignalsPerPage
        );

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    const maxPages =
        Math.min(totalPages, 7);

    let html = `
        <button
            type="button"
            class="pagination-button"
            data-page="prev"
            ${adminSignalsPage === 1 ? "disabled" : ""}
        >
            ‹
        </button>
    `;

    for (
        let page = 1;
        page <= maxPages;
        page++
    ) {

        html += `
            <button
                type="button"
                class="pagination-button ${
                    page === adminSignalsPage
                        ? "active"
                        : ""
                }"
                data-page="${page}"
            >
                ${page}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="pagination-button"
            data-page="next"
            ${
                adminSignalsPage === totalPages
                    ? "disabled"
                    : ""
            }
        >
            ›
        </button>
    `;

    container.innerHTML = html;


    // ==========================================
    // PAGINATION CLICK EVENTS
    // ==========================================

    container
        .querySelectorAll(
            ".pagination-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    const totalPages =
                        Math.ceil(
                            total /
                            adminSignalsPerPage
                        );


                    if (
                        page === "prev"
                    ) {

                        if (
                            adminSignalsPage > 1
                        ) {
                            adminSignalsPage--;
                        }

                    } else if (
                        page === "next"
                    ) {

                        if (
                            adminSignalsPage <
                            totalPages
                        ) {
                            adminSignalsPage++;
                        }

                    } else {

                        adminSignalsPage =
                            Number(page);
                    }


                    renderSignalsTable(
                        getFilteredSignals()
                    );

                }
            );
        });
}
// ==========================================
// CLEAR SIGNAL FILTERS
// ==========================================

function clearSignalFilters() {

    const search =
        document.getElementById(
            "signalSearch"
        );

    const type =
        document.getElementById(
            "signalTypeFilter"
        );

    const result =
        document.getElementById(
            "signalResultFilter"
        );

    const grade =
        document.getElementById(
            "signalGradeFilter"
        );

    const confidence =
        document.getElementById(
            "signalConfidenceFilter"
        );

    const sort =
        document.getElementById(
            "signalSort"
        );


    if (search) {
        search.value = "";
    }

    if (type) {
        type.value = "all";
    }

    if (result) {
        result.value = "all";
    }

    if (grade) {
        grade.value = "all";
    }

    if (confidence) {
        confidence.value = "0";
    }

    if (sort) {
        sort.value = "newest";
    }


    adminSignalsPage = 1;

    applySignalFilters();
}
// ==========================================
// NEW SUBSCRIPTION MODAL
// ==========================================

async function showNewSubscriptionModal() {

    let users = [];

    try {

        const response = await fetch(
            `${API}/admin/users`,
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load users.");
        }

        const data = await response.json();

        users = data.users || [];

    } catch (error) {

        console.error(
            "Failed to load users:",
            error
        );

        alert(
            "Unable to load users."
        );

        return;
    }


    // Remove existing modal if one exists
    document
        .getElementById(
            "subscriptionModal"
        )
        ?.remove();


    const modal =
        document.createElement("div");

    modal.id =
        "subscriptionModal";

    modal.className =
        "subscription-modal-overlay";


    modal.innerHTML = `

        <div class="subscription-modal">

            <div class="subscription-modal-header">

                <div>

                    <h2>
                        New Subscription
                    </h2>

                    <p>
                        Assign subscription access to a user
                    </p>

                </div>

                <button
                    type="button"
                    id="closeSubscriptionModal"
                    class="modal-close"
                >
                    ×
                </button>

            </div>


            <div class="subscription-modal-body">


                <label>
                    USER
                </label>

                <select
                    id="newSubscriptionUser"
                >

                    <option value="">
                        Select user...
                    </option>

                    ${users
                        .filter(
                            user =>
                                user.role !== "admin"
                        )
                        .map(
                            user => `
                                <option
                                    value="${escapeHtml(
                                        user.id
                                    )}"
                                >
                                    ${escapeHtml(
                                        user.email
                                    )}
                                </option>
                            `
                        )
                        .join("")}

                </select>


                <label>
                    PLAN
                </label>

                <select
                    id="newSubscriptionPlan"
                >

                    <option value="monthly">
                        MONTHLY
                    </option>

                    <option value="yearly">
                        YEARLY
                    </option>

                    <option value="lifetime">
                        LIFETIME
                    </option>

                </select>


                <label>
                    STATUS
                </label>

                <select
                    id="newSubscriptionStatus"
                >

                    <option value="active">
                        ACTIVE
                    </option>

                    <option value="inactive">
                        INACTIVE
                    </option>

                </select>


                <label>
                    START DATE
                </label>

                <input
                    type="datetime-local"
                    id="newSubscriptionStartedAt"
                >


                <label>
                    EXPIRATION DATE
                </label>

                <input
                    type="datetime-local"
                    id="newSubscriptionExpiresAt"
                >


            </div>


            <div class="subscription-modal-footer">

                <button
                    type="button"
                    id="cancelSubscriptionModal"
                    class="clear-button"
                >
                    CANCEL
                </button>

                <button
                    type="button"
                    id="saveSubscriptionButton"
                    class="primary-button"
                >
                    CREATE SUBSCRIPTION
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(modal);


    // ==========================================
    // CLOSE
    // ==========================================

    document
        .getElementById(
            "closeSubscriptionModal"
        )
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById(
            "cancelSubscriptionModal"
        )
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    // ==========================================
    // SAVE
    // ==========================================

    document
        .getElementById(
            "saveSubscriptionButton"
        )
        ?.addEventListener(
            "click",
            createSubscription
        );
}
// ==========================================
// CREATE SUBSCRIPTION
// ==========================================

async function createSubscription() {

    const userId =
        document.getElementById(
            "newSubscriptionUser"
        )?.value;

    const plan =
        document.getElementById(
            "newSubscriptionPlan"
        )?.value;

    const status =
        document.getElementById(
            "newSubscriptionStatus"
        )?.value;

    const startedAt =
        document.getElementById(
            "newSubscriptionStartedAt"
        )?.value;

    const expiresAt =
        document.getElementById(
            "newSubscriptionExpiresAt"
        )?.value;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!userId) {

        alert(
            "Please select a user."
        );

        return;
    }


    if (!plan) {

        alert(
            "Please select a plan."
        );

        return;
    }


    if (!status) {

        alert(
            "Please select a status."
        );

        return;
    }


    const button =
        document.getElementById(
            "saveSubscriptionButton"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "CREATING...";
    }


    try {

        const response =
            await fetch(
                `${API}/admin/subscriptions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${localStorage.getItem("adminToken")}`
                    },

                    body: JSON.stringify({

                        user_id: userId,

                        plan: plan,

                        status: status,

                        started_at:
                            startedAt
                                ? new Date(
                                    startedAt
                                ).toISOString()
                                : undefined,

                        expires_at:
                            expiresAt
                                ? new Date(
                                    expiresAt
                                ).toISOString()
                                : null

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to create subscription."
            );
        }


        if (data.success !== true) {

            throw new Error(
                "Subscription creation failed."
            );
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        document
            .getElementById(
                "subscriptionModal"
            )
            ?.remove();


        await loadSubscriptionsData();


        alert(
            "Subscription created successfully."
        );


    } catch (error) {

        console.error(
            "Create subscription failed:",
            error
        );

        alert(
            error.message ||
            "Failed to create subscription."
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "CREATE SUBSCRIPTION";
        }
    }
}
// ==========================================
// SUBSCRIPTIONS PAGE
// ==========================================

let adminSubscriptionsCache = [];

async function showSubscriptionsPage() {

    const content =
        document.querySelector(".main-area .content");

    if (!content) {
        console.error(
            "Subscriptions page content container not found."
        );
        return;
    }

    content.innerHTML = `
        <div class="page-content">

            <div class="page-header">

    <div>
        <h1>Subscriptions</h1>

        <p>
            Manage user subscription access
        </p>
    </div>

    <div class="page-header-actions">

        <button
            id="newSubscriptionButton"
            class="primary-button"
        >
            + New Subscription
        </button>

        <button
            id="subscriptionsRefresh"
            class="refresh-button"
        >
            ↻ Refresh
        </button>

    </div>

</div>


            <!-- ========================== -->
            <!-- SUBSCRIPTION SUMMARY -->
            <!-- ========================== -->

            <div class="trades-kpi-grid">

                <div class="trades-kpi">

                    <span>
                        TOTAL
                    </span>

                    <strong id="subscriptionsTotal">
                        —
                    </strong>

                </div>


                <div class="trades-kpi">

                    <span>
                        ACTIVE
                    </span>

                    <strong
                        id="subscriptionsActive"
                        class="stat-win"
                    >
                        —
                    </strong>

                </div>


                <div class="trades-kpi">

                    <span>
                        INACTIVE
                    </span>

                    <strong
                        id="subscriptionsInactive"
                    >
                        —
                    </strong>

                </div>


                <div class="trades-kpi">

                    <span>
                        EXPIRED
                    </span>

                    <strong
                        id="subscriptionsExpired"
                        class="stat-loss"
                    >
                        —
                    </strong>

                </div>

            </div>


            <!-- ========================== -->
            <!-- FILTERS -->
            <!-- ========================== -->

            <div class="panel">

                <div class="asset-filters">

                    <input
                        type="text"
                        id="subscriptionSearch"
                        placeholder="Search user email..."
                    >


                    <select
                        id="subscriptionStatusFilter"
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            ACTIVE
                        </option>

                        <option value="inactive">
                            INACTIVE
                        </option>

                        <option value="expired">
                            EXPIRED
                        </option>

                        <option value="cancelled">
                            CANCELLED
                        </option>

                    </select>


                    <select
                        id="subscriptionPlanFilter"
                    >

                        <option value="all">
                            All Plans
                        </option>

                        <option value="monthly">
                            MONTHLY
                        </option>

                        <option value="yearly">
                            YEARLY
                        </option>

                        <option value="lifetime">
                            LIFETIME
                        </option>

                    </select>


                    <button
                        id="clearSubscriptionFilters"
                        class="clear-button"
                    >
                        CLEAR
                    </button>

                </div>


                <div
                    id="subscriptionFilterCount"
                    class="asset-filter-count"
                >
                    Loading...
                </div>

            </div>


            <!-- ========================== -->
            <!-- SUBSCRIPTIONS TABLE -->
            <!-- ========================== -->

            <div class="panel">

                <div
                    id="subscriptionsTableContainer"
                    class="table-wrap"
                >

                    <div class="trade-loading">
                        Loading subscriptions...
                    </div>

                </div>

            </div>

        </div>
    `;


    document
        .getElementById(
            "subscriptionsRefresh"
        )
        ?.addEventListener(
            "click",
            loadSubscriptionsData
    );
    document
    .getElementById(
        "newSubscriptionButton"
    )
    ?.addEventListener(
        "click",
        showNewSubscriptionModal
    );


    document
        .getElementById(
            "subscriptionSearch"
        )
        ?.addEventListener(
            "input",
            applySubscriptionFilters
        );


    document
        .getElementById(
            "subscriptionStatusFilter"
        )
        ?.addEventListener(
            "change",
            applySubscriptionFilters
        );


    document
        .getElementById(
            "subscriptionPlanFilter"
        )
        ?.addEventListener(
            "change",
            applySubscriptionFilters
        );


    document
        .getElementById(
            "clearSubscriptionFilters"
        )
        ?.addEventListener(
            "click",
            clearSubscriptionFilters
        );


    await loadSubscriptionsData();
}
// ==========================================
// LOAD SUBSCRIPTIONS
// ==========================================

async function loadSubscriptionsData() {

    const token =
        localStorage.getItem("adminToken");

    const container =
        document.getElementById(
            "subscriptionsTableContainer"
        );

    if (!container) {
        return;
    }

    try {

        container.innerHTML = `
            <div class="trade-loading">
                Loading subscriptions...
            </div>
        `;

        const response =
            await fetch(
                `${API}/admin/subscriptions`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {

            throw new Error(
                `Subscription request failed: ${response.status}`
            );
        }

        const data =
            await response.json();

        if (data.success !== true) {

            throw new Error(
                "Subscription API returned an error."
            );
        }

        adminSubscriptionsCache =
            data.subscriptions || [];

        updateSubscriptionSummary(
            adminSubscriptionsCache
        );

        applySubscriptionFilters();

    } catch (error) {

        console.error(
            "Subscription data failed:",
            error
        );

        container.innerHTML = `
            <div class="trade-error">
                Failed to load subscriptions.
            </div>
        `;
    }
}
// ==========================================
// SUBSCRIPTION SUMMARY
// ==========================================

function updateSubscriptionSummary(
    subscriptions
) {

    const total =
        subscriptions.length;

    const active =
        subscriptions.filter(
            subscription =>
                String(
                    subscription.status || ""
                ).toLowerCase() === "active"
        ).length;

    const inactive =
        subscriptions.filter(
            subscription =>
                String(
                    subscription.status || ""
                ).toLowerCase() === "inactive"
        ).length;

    const expired =
        subscriptions.filter(
            subscription =>
                String(
                    subscription.status || ""
                ).toLowerCase() === "expired"
        ).length;


    setText(
        "subscriptionsTotal",
        formatNumber(total)
    );

    setText(
        "subscriptionsActive",
        formatNumber(active)
    );

    setText(
        "subscriptionsInactive",
        formatNumber(inactive)
    );

    setText(
        "subscriptionsExpired",
        formatNumber(expired)
    );
}
// ==========================================
// RENDER SUBSCRIPTIONS TABLE
// ==========================================

function renderSubscriptionsTable(subscriptions) {

    const container =
        document.getElementById(
            "subscriptionsTableContainer"
        );

    if (!container) {
        return;
    }

    if (!subscriptions.length) {

        container.innerHTML = `
            <div class="trade-empty">
                No subscriptions found.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-wrap">

            <table>

                <thead>

                    <tr>
                        <th>USER</th>
                        <th>PLAN</th>
                        <th>STATUS</th>
                        <th>STARTED</th>
                        <th>EXPIRES</th>
                        <th>ACTION</th>
                    </tr>

                </thead>

                <tbody>

                    ${subscriptions.map(subscription => {

                        const status =
                            String(
                                subscription.status || "inactive"
                            ).toLowerCase();

                        return `
                            <tr>

                                <td>
                                    <strong>
                                        ${escapeHtml(
                                            subscription.email ||
                                            subscription.user_id ||
                                            "Unknown"
                                        )}
                                    </strong>
                                </td>

                                <td>
                                    ${escapeHtml(
                                        subscription.plan || "NONE"
                                    ).toUpperCase()}
                                </td>

                                <td>

                                    <span
                                        class="subscription-status ${status}"
                                    >
                                        ${status.toUpperCase()}
                                    </span>

                                </td>

                                <td>
    ${formatDateTime(
        subscription.started_at
    )}
</td>

<td>
    ${formatDateTime(
        subscription.expires_at
    )}
</td>

                                <td>

                                    <button
                                        type="button"
                                        class="subscription-view-button"
                                        data-subscription-id="${subscription.id}"
                                    >
                                        VIEW
                                    </button>

                                </td>

                            </tr>
                        `;

                    }).join("")}

                </tbody>

            </table>

        </div>
    `;

    container
    .querySelectorAll(".subscription-view-button")
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const id =
                    button.dataset.subscriptionId;

                const subscription =
                    adminSubscriptionsCache.find(
                        item => String(item.id) === String(id)
                    );

                if (!subscription) {
                    alert("Subscription not found.");
                    return;
                }

                showSubscriptionDetailsModal(subscription);
            }
        );
    });
}
// ==========================================
// EDIT SUBSCRIPTION MODAL
// ==========================================

function showSubscriptionDetailsModal(subscription) {

    document
        .getElementById("subscriptionDetailsModal")
        ?.remove();

    const modal = document.createElement("div");

    modal.id = "subscriptionDetailsModal";
    modal.className = "subscription-modal-overlay";

    // Convert database date to datetime-local value
    function toDateTimeLocal(value) {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        const hours = String(
            date.getHours()
        ).padStart(2, "0");

        const minutes = String(
            date.getMinutes()
        ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    modal.innerHTML = `

        <div class="subscription-modal">

            <div class="subscription-modal-header">

                <div>
                    <h2>Edit Subscription</h2>

                    <p>
                        Manage subscription access
                    </p>
                </div>

                <button
                    type="button"
                    id="closeSubscriptionEditModal"
                    class="modal-close"
                >
                    ×
                </button>

            </div>


            <div class="subscription-modal-body">

                <!-- USER -->

                <label>USER</label>

                <input
                    type="text"
                    value="${escapeHtml(
                        subscription.email ||
                        subscription.user_id ||
                        "Unknown"
                    )}"
                    disabled
                >


                <!-- PLAN -->

                <label>PLAN</label>

                <select id="editSubscriptionPlan">

                    <option
                        value="NONE"
                        ${String(subscription.plan).toUpperCase() === "NONE" ? "selected" : ""}
                    >
                        NONE
                    </option>

                    <option
                        value="MONTHLY"
                        ${String(subscription.plan).toUpperCase() === "MONTHLY" ? "selected" : ""}
                    >
                        MONTHLY
                    </option>

                    <option
                        value="YEARLY"
                        ${String(subscription.plan).toUpperCase() === "YEARLY" ? "selected" : ""}
                    >
                        YEARLY
                    </option>

                    <option
                        value="LIFETIME"
                        ${String(subscription.plan).toUpperCase() === "LIFETIME" ? "selected" : ""}
                    >
                        LIFETIME
                    </option>

                </select>


                <!-- STATUS -->

                <label>STATUS</label>

                <select id="editSubscriptionStatus">

                    <option
                        value="active"
                        ${String(subscription.status).toLowerCase() === "active" ? "selected" : ""}
                    >
                        ACTIVE
                    </option>

                    <option
                        value="inactive"
                        ${String(subscription.status).toLowerCase() === "inactive" ? "selected" : ""}
                    >
                        INACTIVE
                    </option>

                    <option
                        value="expired"
                        ${String(subscription.status).toLowerCase() === "expired" ? "selected" : ""}
                    >
                        EXPIRED
                    </option>

                </select>


                <!-- START DATE -->

                <label>START DATE</label>

                <input
                    type="datetime-local"
                    id="editSubscriptionStartedAt"
                    value="${toDateTimeLocal(
                        subscription.started_at
                    )}"
                >


                <!-- EXPIRATION DATE -->

                <label>EXPIRATION DATE</label>

                <input
                    type="datetime-local"
                    id="editSubscriptionExpiresAt"
                    value="${toDateTimeLocal(
                        subscription.expires_at
                    )}"
                >

            </div>


            <div class="subscription-modal-footer">

                <button
                    type="button"
                    id="cancelSubscriptionEdit"
                    class="clear-button"
                >
                    CANCEL
                </button>

                <button
                    type="button"
                    id="saveSubscriptionEdit"
                    class="primary-button"
                >
                    SAVE CHANGES
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    // ==========================================
    // CLOSE
    // ==========================================

    document
        .getElementById(
            "closeSubscriptionEditModal"
        )
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById(
            "cancelSubscriptionEdit"
        )
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    // ==========================================
    // SAVE CHANGES
    // ==========================================

    document
        .getElementById(
            "saveSubscriptionEdit"
        )
        ?.addEventListener(
            "click",
            async () => {

                const button =
                    document.getElementById(
                        "saveSubscriptionEdit"
                    );

                const plan =
                    document.getElementById(
                        "editSubscriptionPlan"
                    )?.value;

                const status =
                    document.getElementById(
                        "editSubscriptionStatus"
                    )?.value;

                const startedAt =
                    document.getElementById(
                        "editSubscriptionStartedAt"
                    )?.value;

                const expiresAt =
                    document.getElementById(
                        "editSubscriptionExpiresAt"
                    )?.value;


                if (!plan) {
                    alert("Please select a plan.");
                    return;
                }

                if (!status) {
                    alert("Please select a status.");
                    return;
                }


                if (button) {
                    button.disabled = true;
                    button.textContent = "SAVING...";
                }


                try {

                    const response =
                        await fetch(
                            `${API}/admin/subscriptions/${subscription.id}`,
                            {
                                method: "PATCH",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${localStorage.getItem("adminToken")}`
                                },

                                body: JSON.stringify({

                                    plan: plan,

                                    status: status,

                                    started_at:
                                        startedAt
                                            ? new Date(
                                                startedAt
                                            ).toISOString()
                                            : null,

                                    expires_at:
                                        expiresAt
                                            ? new Date(
                                                expiresAt
                                            ).toISOString()
                                            : null

                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.detail ||
                            "Failed to update subscription."
                        );

                    }


                    if (data.success !== true) {

                        throw new Error(
                            "Subscription update failed."
                        );

                    }


                    modal.remove();

                    await loadSubscriptionsData();

                    alert(
                        "Subscription updated successfully."
                    );


                } catch (error) {

                    console.error(
                        "Update subscription failed:",
                        error
                    );

                    alert(
                        error.message ||
                        "Failed to update subscription."
                    );


                    if (button) {

                        button.disabled = false;

                        button.textContent =
                            "SAVE CHANGES";

                    }

                }

            }
        );
}
// ==========================================
// SUBSCRIPTION FILTERS
// ==========================================

function applySubscriptionFilters() {

    let subscriptions =
        [...adminSubscriptionsCache];

    const search =
        (
            document.getElementById(
                "subscriptionSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();

    const status =
        document.getElementById(
            "subscriptionStatusFilter"
        )?.value || "all";

    const plan =
        document.getElementById(
            "subscriptionPlanFilter"
        )?.value || "all";


    if (search) {

        subscriptions =
            subscriptions.filter(subscription => {

                const email =
                    String(
                        subscription.email || ""
                    ).toLowerCase();

                const userId =
                    String(
                        subscription.user_id || ""
                    ).toLowerCase();

                return (
                    email.includes(search) ||
                    userId.includes(search)
                );

            });
    }


    if (status !== "all") {

        subscriptions =
            subscriptions.filter(subscription =>
                String(
                    subscription.status || ""
                ).toLowerCase() === status
            );
    }


    if (plan !== "all") {

        subscriptions =
            subscriptions.filter(subscription =>
                String(
                    subscription.plan || ""
                ).toLowerCase() === plan
            );
    }


    const count =
        document.getElementById(
            "subscriptionFilterCount"
        );

    if (count) {

        count.textContent =
            `${subscriptions.length} matching subscriptions`;
    }


    renderSubscriptionsTable(
        subscriptions
    );
}
// ==========================================
// CLEAR SUBSCRIPTION FILTERS
// ==========================================

function clearSubscriptionFilters() {

    const search =
        document.getElementById(
            "subscriptionSearch"
        );

    const status =
        document.getElementById(
            "subscriptionStatusFilter"
        );

    const plan =
        document.getElementById(
            "subscriptionPlanFilter"
        );


    if (search) {
        search.value = "";
    }

    if (status) {
        status.value = "all";
    }

    if (plan) {
        plan.value = "all";
    }


    applySubscriptionFilters();
}
// ==========================================
// COUPONS PAGE
// ==========================================

async function showCouponsPage() {

    const container =
        document.querySelector(".main-area .content");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="coupons-page">

            <div class="page-header">

            <div>
                <h1>Coupons</h1>

                <p>
                    Manage promotional discount codes
                </p>
            </div>

            <div class="page-header-actions">

                <button
                    id="newCouponButton"
                    class="primary-button"
                >
                    + New Coupon
                </button>

                <button
                    id="couponsRefresh"
                    class="refresh-button"
                >
                    ↻ Refresh
                </button>

            </div>

        </div>


        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-label">
                    TOTAL COUPONS
                </div>

                <div
                    id="couponsTotal"
                    class="stat-value"
                >
                    0
                </div>
            </div>


            <div class="stat-card">
                <div class="stat-label">
                    ACTIVE
                </div>

                <div
                    id="couponsActive"
                    class="stat-value"
                >
                    0
                </div>
            </div>


            <div class="stat-card">
                <div class="stat-label">
                    USED
                </div>

                <div
                    id="couponsUsed"
                    class="stat-value"
                >
                    0
                </div>
            </div>

        </div>


        <div class="content-card">

            <div class="table-header">

                <div>
                    <h2>Coupons</h2>

                    <p>
                        Promotional codes
                    </p>
                </div>

            </div>


            <div
                id="couponsTableContainer"
                class="table-container"
            >

                <div class="loading-state">
                    Loading coupons...
                </div>

            </div>

        </div>
         </div>
    `;


    document
        .getElementById("couponsRefresh")
        ?.addEventListener(
            "click",
            loadCouponsData
        );


    document
        .getElementById("newCouponButton")
        ?.addEventListener(
            "click",
            showNewCouponModal
        );


    await loadCouponsData();
}
// ==========================================
// LOAD COUPONS DATA
// ==========================================

async function loadCouponsData() {

    const token =
        localStorage.getItem("adminToken");

    const container =
        document.getElementById(
            "couponsTableContainer"
        );

    if (!token) {
        console.error(
            "Admin token not found."
        );
        return;
    }

    if (!container) {
        console.error(
            "Coupons table container not found."
        );
        return;
    }

    container.innerHTML = `
        <div class="loading-state">
            Loading coupons...
        </div>
    `;

    try {

        const response =
            await fetch(
                `${API}/admin/coupons`,
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

        console.log(
            "Coupons API response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.detail ||
                `Coupon request failed: ${response.status}`
            );
        }

        if (data.success !== true) {

            throw new Error(
                data.detail ||
                "Failed to load coupons."
            );
        }

        const coupons =
            Array.isArray(data.coupons)
                ? data.coupons
                : [];

        updateCouponStatistics(
            coupons
        );

        renderCouponsTable(
            coupons
        );

    } catch (error) {

        console.error(
            "Coupon data failed:",
            error
        );

        container.innerHTML = `
            <div class="loading-state" style="color:#ef4444;">
                Failed to load coupons.
            </div>
        `;
    }
}


// ==========================================
// COUPON STATISTICS
// ==========================================

function updateCouponStatistics(
    coupons
) {

    const total =
        coupons.length;

    const active =
        coupons.filter(
            coupon =>
                String(coupon.status || "")
                    .toLowerCase() === "active"
        ).length;

    const used =
        coupons.reduce(
            (sum, coupon) =>
                sum +
                Number(
                    coupon.used_count || 0
                ),
            0
        );

    const totalElement =
        document.getElementById(
            "couponsTotal"
        );

    const activeElement =
        document.getElementById(
            "couponsActive"
        );

    const usedElement =
        document.getElementById(
            "couponsUsed"
        );

    if (totalElement) {
        totalElement.textContent =
            total;
    }

    if (activeElement) {
        activeElement.textContent =
            active;
    }

    if (usedElement) {
        usedElement.textContent =
            used;
    }
}


// ==========================================
// RENDER COUPONS TABLE
// ==========================================

function renderCouponsTable(
    coupons
) {

    const container =
        document.getElementById(
            "couponsTableContainer"
        );

    if (!container) {
        return;
    }

    if (!coupons.length) {

        container.innerHTML = `
            <div class="loading-state">
                No coupons found.
            </div>
        `;

        return;
    }

    const rows =
        coupons.map(
            coupon => {

                const discountType =
                    String(
                        coupon.discount_type || ""
                    ).toLowerCase();

                const discountValue =
                    Number(
                        coupon.discount_value || 0
                    );

                const discount =
                    discountType === "percent"
                        ? `${discountValue}%`
                        : `$${discountValue.toFixed(2)}`;

                const maxUses =
                    coupon.max_uses === null ||
                    coupon.max_uses === undefined
                        ? "Unlimited"
                        : coupon.max_uses;

                const used =
                    Number(
                        coupon.used_count || 0
                    );

                const status =
                    String(
                        coupon.status || "inactive"
                    ).toLowerCase();

                const expires =
                    coupon.expires_at
                        ? formatDateTime(
                            coupon.expires_at
                        )
                        : "Never";

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    coupon.code || ""
                                )}
                            </strong>
                        </td>

                        <td>
                            ${discount}
                        </td>

                        <td>
                            ${used} / ${maxUses}
                        </td>

                        <td>
                            <span class="coupon-status ${status}">
                                ${escapeHtml(
                                    status.toUpperCase()
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHtml(
                                expires
                            )}
                        </td>

                        <td>
                            <div class="coupon-actions">

                                <button
    class="coupon-action-button coupon-edit-button"
    data-coupon-id="${coupon.id}"
>
    EDIT
</button>
<button
    class="coupon-action-button coupon-delete-button"
    data-coupon-id="${coupon.id}"
>
    DELETE
</button>

                            </div>
                        </td>

                    </tr>
                `;
            }
        ).join("");

        container.innerHTML = `
        <table class="coupons-table">
            <thead>
                <tr>
                    <th>CODE</th>
                    <th>DISCOUNT</th>
                    <th>USES</th>
                    <th>STATUS</th>
                    <th>EXPIRES</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    container.querySelectorAll(".coupon-edit-button").forEach(button => {
        button.addEventListener("click", () => {
            editCoupon(button.dataset.couponId);
        });
    });

    container.querySelectorAll(".coupon-delete-button").forEach(button => {
        button.addEventListener("click", () => {
            deleteCoupon(button.dataset.couponId);
        });
    });
}
// ==========================================
// NEW COUPON MODAL
// ==========================================

function showNewCouponModal() {

    const existing =
        document.getElementById("couponModal");

    if (existing) {
        existing.remove();
    }

    const modal =
        document.createElement("div");

    modal.id = "couponModal";

    modal.innerHTML = `
        <div class="coupon-modal-overlay">

            <div class="coupon-modal">

                <div class="coupon-modal-header">
                    <div>
                        <h2>New Coupon</h2>
                        <p>Create a promotional discount code</p>
                    </div>

                    <button
                        type="button"
                        id="closeCouponModal"
                        class="coupon-modal-close"
                    >
                        ×
                    </button>
                </div>

                <div class="coupon-modal-body">

                    <label>
                        Coupon Code
                    </label>

                    <input
                        type="text"
                        id="couponCode"
                        placeholder="WELCOME10"
                        maxlength="50"
                    >

                    <label>
                        Discount Type
                    </label>

                    <select id="couponDiscountType">
                        <option value="percent">
                            Percentage
                        </option>

                        <option value="fixed">
                            Fixed Amount
                        </option>
                    </select>

                    <label>
                        Discount Value
                    </label>

                    <input
                        type="number"
                        id="couponDiscountValue"
                        placeholder="10"
                        min="0"
                        step="0.01"
                    >

                    <label>
                        Maximum Uses
                    </label>

                    <input
                        type="number"
                        id="couponMaxUses"
                        placeholder="Unlimited"
                        min="1"
                    >

                    <label>
                        Expiration Date
                    </label>

                    <input
                        type="datetime-local"
                        id="couponExpiresAt"
                    >

                </div>

                <div class="coupon-modal-footer">

                    <button
                        type="button"
                        id="cancelCouponButton"
                        class="coupon-cancel-button"
                    >
                        CANCEL
                    </button>

                    <button
                        type="button"
                        id="createCouponButton"
                        class="coupon-save-button"
                    >
                        CREATE COUPON
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    document
        .getElementById("closeCouponModal")
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById("cancelCouponButton")
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById("createCouponButton")
        ?.addEventListener(
            "click",
            createCoupon
        );
}
// ==========================================
// CREATE COUPON
// ==========================================

async function createCoupon() {

    const token =
        localStorage.getItem("adminToken");

    const code =
        document
            .getElementById("couponCode")
            ?.value
            .trim()
            .toUpperCase();

    const discountType =
        document
            .getElementById("couponDiscountType")
            ?.value;

    const discountValue =
        document
            .getElementById("couponDiscountValue")
            ?.value;

    const maxUses =
        document
            .getElementById("couponMaxUses")
            ?.value;

    const expiresAt =
        document
            .getElementById("couponExpiresAt")
            ?.value;


    if (!code) {
        alert("Enter a coupon code.");
        return;
    }

    if (!discountValue) {
        alert("Enter a discount value.");
        return;
    }


    const payload = {
        code: code,
        discount_type: discountType,
        discount_value: Number(discountValue),
        max_uses:
            maxUses === ""
                ? null
                : Number(maxUses),
        expires_at:
            expiresAt === ""
                ? null
                : new Date(expiresAt).toISOString()
    };


    try {

        const response =
            await fetch(
                `${API}/admin/coupons`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


        const data =
            await response.json();


        console.log(
            "Create coupon response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to create coupon."
            );
        }


        document
            .getElementById("couponModal")
            ?.remove();


        await loadCouponsData();


    } catch (error) {

        console.error(
            "Create coupon failed:",
            error
        );

        alert(
            error.message ||
            "Failed to create coupon."
        );
    }
}
// ==========================================
// EDIT COUPON
// ==========================================

async function editCoupon(couponId) {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {
        alert("Authentication required.");
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/admin/coupons`,
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
                "Failed to load coupon."
            );
        }

        const coupon =
            (data.coupons || []).find(
                item =>
                    String(item.id) ===
                    String(couponId)
            );

        if (!coupon) {
            alert("Coupon not found.");
            return;
        }

        const existing =
            document.getElementById(
                "couponModal"
            );

        if (existing) {
            existing.remove();
        }

        const modal =
            document.createElement("div");

        modal.id = "couponModal";

        const expiresValue =
            coupon.expires_at
                ? new Date(
                    coupon.expires_at
                )
                    .toISOString()
                    .slice(0, 16)
                : "";

        modal.innerHTML = `
            <div class="coupon-modal-overlay">

                <div class="coupon-modal">

                    <div class="coupon-modal-header">

                        <div>
                            <h2>Edit Coupon</h2>

                            <p>
                                Update promotional discount code
                            </p>
                        </div>

                        <button
                            type="button"
                            id="closeCouponModal"
                            class="coupon-modal-close"
                        >
                            ×
                        </button>

                    </div>


                    <div class="coupon-modal-body">

                        <label>
                            Coupon Code
                        </label>

                        <input
                            type="text"
                            id="couponCode"
                            value="${escapeHtml(
                                coupon.code || ""
                            )}"
                            maxlength="50"
                        >


                        <label>
                            Discount Type
                        </label>

                        <select
                            id="couponDiscountType"
                        >

                            <option
                                value="percent"
                                ${coupon.discount_type === "percent"
                                    ? "selected"
                                    : ""}
                            >
                                Percentage
                            </option>

                            <option
                                value="fixed"
                                ${coupon.discount_type === "fixed"
                                    ? "selected"
                                    : ""}
                            >
                                Fixed Amount
                            </option>

                        </select>


                        <label>
                            Discount Value
                        </label>

                        <input
                            type="number"
                            id="couponDiscountValue"
                            value="${Number(
                                coupon.discount_value || 0
                            )}"
                            min="0"
                            step="0.01"
                        >


                        <label>
                            Maximum Uses
                        </label>

                        <input
                            type="number"
                            id="couponMaxUses"
                            value="${coupon.max_uses ?? ""}"
                            placeholder="Unlimited"
                            min="1"
                        >


                        <label>
                            Expiration Date
                        </label>

                        <input
                            type="datetime-local"
                            id="couponExpiresAt"
                            value="${expiresValue}"
                        >

                    </div>


                    <div class="coupon-modal-footer">

                        <button
                            type="button"
                            id="cancelCouponButton"
                            class="coupon-cancel-button"
                        >
                            CANCEL
                        </button>

                        <button
                            type="button"
                            id="saveCouponButton"
                            class="coupon-save-button"
                        >
                            SAVE CHANGES
                        </button>

                    </div>

                </div>

            </div>
        `;

        document.body.appendChild(modal);


        document
            .getElementById(
                "closeCouponModal"
            )
            ?.addEventListener(
                "click",
                () => modal.remove()
            );


        document
            .getElementById(
                "cancelCouponButton"
            )
            ?.addEventListener(
                "click",
                () => modal.remove()
            );


        document
            .getElementById(
                "saveCouponButton"
            )
            ?.addEventListener(
                "click",
                () =>
                    updateCoupon(
                        couponId
                    )
            );

    } catch (error) {

        console.error(
            "Edit coupon failed:",
            error
        );

        alert(
            error.message ||
            "Failed to load coupon."
        );
    }
}


// ==========================================
// UPDATE COUPON
// ==========================================

async function updateCoupon(couponId) {

    const token =
        localStorage.getItem("adminToken");

    const code =
        document
            .getElementById("couponCode")
            ?.value
            .trim()
            .toUpperCase();

    const discountType =
        document
            .getElementById(
                "couponDiscountType"
            )
            ?.value;

    const discountValue =
        document
            .getElementById(
                "couponDiscountValue"
            )
            ?.value;

    const maxUses =
        document
            .getElementById(
                "couponMaxUses"
            )
            ?.value;

    const expiresAt =
        document
            .getElementById(
                "couponExpiresAt"
            )
            ?.value;


    if (!code) {
        alert("Enter a coupon code.");
        return;
    }

    if (!discountValue) {
        alert("Enter a discount value.");
        return;
    }


    const payload = {

        code: code,

        discount_type:
            discountType,

        discount_value:
            Number(discountValue),

        max_uses:
            maxUses === ""
                ? null
                : Number(maxUses),

        expires_at:
            expiresAt === ""
                ? null
                : new Date(
                    expiresAt
                ).toISOString()

    };


    try {

        const response =
            await fetch(
                `${API}/admin/coupons/${couponId}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        const data =
            await response.json();


        console.log(
            "Update coupon response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to update coupon."
            );

        }


        document
            .getElementById(
                "couponModal"
            )
            ?.remove();


        await loadCouponsData();


    } catch (error) {

        console.error(
            "Update coupon failed:",
            error
        );

        alert(
            error.message ||
            "Failed to update coupon."
        );

    }

}


// ==========================================
// DELETE COUPON
// ==========================================

async function deleteCoupon(couponId) {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {
        alert("Authentication required.");
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this coupon?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/admin/coupons/${couponId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Delete coupon response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to delete coupon."
            );

        }
    

        await loadCouponsData();


    } catch (error) {

        console.error(
            "Delete coupon failed:",
            error
        );

        alert(
            error.message ||
            "Failed to delete coupon."
                );
    }
}

    // ==========================================
  // PAYMENTS PAGE
// ==========================================

async function showPaymentsPage() {

    const container =
        document.querySelector(".main-area .content");

    if (!container) {
        console.error(
            "Payments page content container not found."
        );
        return;
    }

    container.innerHTML = `
        <div class="payments-page">

            <div class="page-header">

                <div>
                    <h1>Payments</h1>
                    <p>Manage subscriber payments and transactions.</p>
                </div>

                <div class="page-header-actions">

                    <button
                        id="newPaymentButton"
                        class="primary-button"
                    >
                        + NEW PAYMENT
                    </button>

                    <button
                        id="paymentsRefresh"
                        class="refresh-button"
                    >
                        REFRESH
                    </button>

                </div>

            </div>


            <div class="stats-grid">

                <div class="stat-card">

                    <div class="stat-label">
                        TOTAL PAYMENTS
                    </div>

                    <div
                        class="stat-value"
                        id="paymentsTotal"
                    >
                        0
                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-label">
                        PAID
                    </div>

                    <div
                        class="stat-value"
                        id="paymentsPaid"
                    >
                        0
                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-label">
                        PENDING
                    </div>

                    <div
                        class="stat-value"
                        id="paymentsPending"
                    >
                        0
                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-label">
                        REVENUE
                    </div>

                    <div
                        class="stat-value"
                        id="paymentsRevenue"
                    >
                        $0.00
                    </div>

                </div>

            </div>


            <div class="content-card">

                <div class="table-header">

                    <div>
                        <h2>Payment History</h2>
                    </div>

                </div>


                <div
                    id="paymentsTableContainer"
                    class="table-container"
                >

                    <div class="loading-state">
                        Loading payments...
                    </div>

                </div>

            </div>

        </div>
    `;


    const refreshButton =
        document.getElementById(
            "paymentsRefresh"
        );

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                await loadPaymentsData();

            }
        );

    }


    const newPaymentButton =
        document.getElementById(
            "newPaymentButton"
        );

    if (newPaymentButton) {

        newPaymentButton.addEventListener(
            "click",
            () => {

                showNewPaymentModal();

            }
        );

    }


    await loadPaymentsData();

}
// ==========================================
// LOAD PAYMENTS DATA
// ==========================================

async function loadPaymentsData() {

    const token =
        localStorage.getItem("adminToken");

    const container =
        document.getElementById(
            "paymentsTableContainer"
        );

    if (!token) {
        console.error(
            "Admin token not found."
        );
        return;
    }

    if (!container) {
        console.error(
            "Payments table container not found."
        );
        return;
    }

    container.innerHTML = `
        <div class="loading-state">
            Loading payments...
        </div>
    `;

    try {

        const response =
            await fetch(
                `${API}/admin/payments`,
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

        console.log(
            "Payments API response:",
            data
        );

        if (!response.ok) {
            throw new Error(
                data.detail ||
                `Payment request failed: ${response.status}`
            );
        }

        if (data.success !== true) {
            throw new Error(
                data.detail ||
                "Failed to load payments."
            );
        }

        const payments =
            Array.isArray(data.payments)
                ? data.payments
                : [];

        updatePaymentStatistics(
            payments
        );

        renderPaymentsTable(
            payments
        );

    } catch (error) {

        console.error(
            "Payment data failed:",
            error
        );

        container.innerHTML = `
            <div class="loading-state" style="color:#ef4444;">
                Failed to load payments.
            </div>
        `;
    }
}


// ==========================================
// PAYMENT STATISTICS
// ==========================================

function updatePaymentStatistics(
    payments
) {

    const total =
        payments.length;

    const paid =
        payments.filter(
            payment =>
                String(
                    payment.status || ""
                ).toLowerCase() === "paid"
        ).length;

    const pending =
        payments.filter(
            payment =>
                String(
                    payment.status || ""
                ).toLowerCase() === "pending"
        ).length;

    const revenue =
        payments.reduce(
            (sum, payment) => {

                const status =
                    String(
                        payment.status || ""
                    ).toLowerCase();

                if (status !== "paid") {
                    return sum;
                }

                return (
                    sum +
                    Number(
                        payment.amount || 0
                    )
                );
            },
            0
        );

    const totalElement =
        document.getElementById(
            "paymentsTotal"
        );

    const paidElement =
        document.getElementById(
            "paymentsPaid"
        );

    const pendingElement =
        document.getElementById(
            "paymentsPending"
        );

    const revenueElement =
        document.getElementById(
            "paymentsRevenue"
        );

    if (totalElement) {
        totalElement.textContent =
            total;
    }

    if (paidElement) {
        paidElement.textContent =
            paid;
    }

    if (pendingElement) {
        pendingElement.textContent =
            pending;
    }

    if (revenueElement) {
        revenueElement.textContent =
            `$${revenue.toFixed(2)}`;
    }
}


// ==========================================
// RENDER PAYMENTS TABLE
// ==========================================

function renderPaymentsTable(
    payments
) {

    const container =
        document.getElementById(
            "paymentsTableContainer"
        );

    if (!container) {
        return;
    }

    if (!payments.length) {

        container.innerHTML = `
            <div class="loading-state">
                No payments found.
            </div>
        `;

        return;
    }

    const rows =
        payments.map(
            payment => {

                const status =
                    String(
                        payment.status ||
                        "pending"
                    ).toLowerCase();

                const method =
                    String(
                        payment.payment_method ||
                        ""
                    ).toLowerCase();

                const methodLabels = {
                    stripe: "Stripe / Card",
                    paypal: "PayPal",
                    crypto: "Crypto",
                    cash_app: "Cash App",
                    zelle: "Zelle"
                };

                const methodLabel =
                    methodLabels[method] ||
                    payment.payment_method ||
                    "—";

                const cryptoInfo =
                    method === "crypto"
                        ? `
                            <div class="payment-crypto-info">
                                ${escapeHtml(
                                    payment.crypto_currency ||
                                    ""
                                )}
                                ${
                                    payment.network
                                        ? ` / ${escapeHtml(payment.network)}`
                                        : ""
                                }
                            </div>
                          `
                        : "";

                const amount =
                    Number(
                        payment.amount || 0
                    );

                const date =
                    payment.created_at
                        ? formatDateTime(
                            payment.created_at
                        )
                        : "—";

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    payment.id ||
                                    ""
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                payment.user_id ||
                                "—"
                            )}
                        </td>

                        <td>
                            <strong>
                                $${amount.toFixed(2)}
                            </strong>
                            <div class="payment-currency">
                                ${escapeHtml(
                                    payment.currency ||
                                    "USD"
                                )}
                            </div>
                        </td>

                        <td>
                            <span class="payment-method">
                                ${escapeHtml(
                                    methodLabel
                                )}
                            </span>
                            ${cryptoInfo}
                        </td>

                        <td>
                            <span
                                class="payment-status ${escapeHtml(status)}"
                            >
                                ${escapeHtml(
                                    status.toUpperCase()
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHtml(date)}
                        </td>

                        <td>
                            <div class="payment-actions">

                                <button
                                    class="payment-action-button payment-edit-button"
                                    data-payment-id="${payment.id}"
                                >
                                    EDIT
                                </button>

                                <button
                                    class="payment-action-button payment-delete-button"
                                    data-payment-id="${payment.id}"
                                >
                                    DELETE
                                </button>

                            </div>
                        </td>

                    </tr>
                `;
            }
        ).join("");

    container.innerHTML = `
        <table class="payments-table">

            <thead>
                <tr>
                    <th>PAYMENT ID</th>
                    <th>USER</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>ACTION</th>
                </tr>
            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;

    container
        .querySelectorAll(
            ".payment-edit-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editPayment(
                        button.dataset.paymentId
                    );

                }
            );

        });

    container
        .querySelectorAll(
            ".payment-delete-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deletePayment(
                        button.dataset.paymentId
                    );

                }
            );

        });
}
// ==========================================
// ASSETS PAGE
// ==========================================

async function showAssetsPage() {

    const content =
        document.querySelector(".main-area .content");

    if (!content) {
        console.error(
            "Assets page content container not found."
        );
        return;
    }

    content.innerHTML = `
        <div class="page-content">

            <div class="page-header">
                <div>
                    <h1>Assets</h1>
                    <p>
                        Asset performance based on recorded trades
                    </p>
                </div>

                <button
                    id="assetsRefresh"
                    class="refresh-button"
                >
                    ↻ Refresh
                </button>
            </div>

            <!-- ========================== -->
            <!-- ASSET SUMMARY -->
            <!-- ========================== -->

            <div class="trades-kpi-grid">

                <div class="kpi-card">
                    <span class="kpi-label">
                        TOTAL ASSETS
                    </span>

                    <strong id="assetTotalCount">
                        0
                    </strong>
                </div>

                <div class="kpi-card">
                    <span class="kpi-label">
                        TOTAL TRADES
                    </span>

                    <strong id="assetTradeCount">
                        0
                    </strong>
                </div>

                <div class="kpi-card">
                    <span class="kpi-label">
                        BEST ASSET
                    </span>

                    <strong id="assetBestAsset">
                        —
                    </strong>
                </div>

                <div class="kpi-card">
                    <span class="kpi-label">
                        BEST WIN RATE
                    </span>

                    <strong id="assetBestRate">
                        —
                    </strong>
                </div>

                <div class="kpi-card">
                    <span class="kpi-label">
                        NET P/L
                    </span>

                    <strong id="assetNetProfit">
                        $0.00
                    </strong>
                </div>

            </div>

            <!-- ========================== -->
            <!-- ASSET TABLE -->
            <!-- ========================== -->

            <div class="panel">

    <!-- ========================== -->
    <!-- ASSET FILTERS -->
    <!-- ========================== -->

    <div class="asset-filters">

        <input
            type="text"
            id="assetSearch"
            placeholder="Search asset..."
        >

        <select id="assetMinTrades">
            <option value="0">All Trade Counts</option>
            <option value="20">20+ Trades</option>
            <option value="50">50+ Trades</option>
            <option value="100">100+ Trades</option>
            <option value="200">200+ Trades</option>
        </select>

        <select id="assetWinRate">
            <option value="0">All Win Rates</option>
            <option value="50">50%+ Win Rate</option>
            <option value="60">60%+ Win Rate</option>
            <option value="70">70%+ Win Rate</option>
        </select>

        <select id="assetPerformance">
            <option value="all">All Performance</option>
            <option value="profit">Profitable</option>
            <option value="loss">Losing</option>
        </select>

        <select id="assetSort">
            <option value="trades">Most Trades</option>
            <option value="winrate">Highest Win Rate</option>
            <option value="profit">Highest Net P/L</option>
            <option value="asset">Asset Name</option>
        </select>

        <button
            id="clearAssetFilters"
            class="clear-button"
        >
            CLEAR
        </button>

    </div>

    <div class="panel-header">

        <div>
            <h2>Asset Performance</h2>

            <p>
                Real results grouped by asset
            </p>
        </div>

    </div>

    <div
        id="assetFilterCount"
        class="asset-filter-count"
    >
        Loading...
    </div>

    <div
        id="assetsTableContainer"
        class="table-wrap"
    >
        <div class="trade-loading">
            Loading asset performance...
        </div>
    </div>

</div>
</div>
        </div>
    `;

    document
    .getElementById("assetsRefresh")
    ?.addEventListener(
        "click",
        loadAssetsData
    );

document
    .getElementById("assetSearch")
    ?.addEventListener(
        "input",
        () => applyAssetFilters()
    );

document
    .getElementById("assetMinTrades")
    ?.addEventListener(
        "change",
        () => applyAssetFilters()
    );

document
    .getElementById("assetWinRate")
    ?.addEventListener(
        "change",
        () => applyAssetFilters()
    );

document
    .getElementById("assetPerformance")
    ?.addEventListener(
        "change",
        () => applyAssetFilters()
    );

document
    .getElementById("assetSort")
    ?.addEventListener(
        "change",
        () => applyAssetFilters()
    );

document
    .getElementById("clearAssetFilters")
    ?.addEventListener(
        "click",
        clearAssetFilters
    );

await loadAssetsData();
}
// ==========================================
// LOAD ASSET DATA
// ==========================================

async function loadAssetsData() {

    const token =
        localStorage.getItem("adminToken");

    const container =
        document.getElementById(
            "assetsTableContainer"
        );

    if (!container) {
        return;
    }

    try {

        container.innerHTML = `
            <div class="trade-loading">
                Loading asset performance...
            </div>
        `;

        const response =
            await fetch(
                `${API}/admin/trades`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Failed to load trades."
            );
        }

        const data =
            await response.json();

        const trades =
            data.trades || [];

        window.allAssetTrades = trades;

renderAssetPerformance(trades);

    } catch (error) {

        console.error(
            "Asset performance failed:",
            error
        );

        container.innerHTML = `
            <div class="trade-error">
                Failed to load asset performance.
            </div>
        `;
    }
}
// ==========================================
// ASSET FILTERS
// ==========================================

function applyAssetFilters() {

    const trades =
        window.allAssetTrades || [];

    const search =
        (
            document.getElementById(
                "assetSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();

    const minTrades =
        Number(
            document.getElementById(
                "assetMinTrades"
            )?.value || 0
        );

    const minWinRate =
        Number(
            document.getElementById(
                "assetWinRate"
            )?.value || 0
        );

    const performance =
        document.getElementById(
            "assetPerformance"
        )?.value || "all";

    const sortBy =
        document.getElementById(
            "assetSort"
        )?.value || "trades";

    // Group trades by asset
    const assets = {};

    trades.forEach(trade => {

        const asset =
            String(
                trade.asset || "UNKNOWN"
            );

        if (!assets[asset]) {

            assets[asset] = {
                asset,
                trades: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                netProfit: 0
            };
        }

        const stats =
            assets[asset];

        stats.trades++;

        const result =
            String(
                trade.result || ""
            ).toUpperCase();

        if (result === "WIN") {
            stats.wins++;
        } else if (result === "LOSS") {
            stats.losses++;
        } else if (result === "DRAW") {
            stats.draws++;
        }

        stats.netProfit +=
            Number(
                trade.profit || 0
            );
    });

    let assetList =
        Object.values(assets);

    // Search
    if (search) {

        assetList =
            assetList.filter(asset =>
                asset.asset
                    .toLowerCase()
                    .includes(search)
            );
    }

    // Minimum trades
    assetList =
        assetList.filter(
            asset =>
                asset.trades >= minTrades
        );

    // Calculate win rate
    assetList.forEach(asset => {

        asset.winRate =
            asset.trades > 0
                ? (
                    asset.wins /
                    asset.trades
                ) * 100
                : 0;
    });

    // Minimum win rate
    assetList =
        assetList.filter(
            asset =>
                asset.winRate >= minWinRate
        );

    // Performance
    if (performance === "profit") {

        assetList =
            assetList.filter(
                asset =>
                    asset.netProfit > 0
            );

    } else if (performance === "loss") {

        assetList =
            assetList.filter(
                asset =>
                    asset.netProfit < 0
            );
    }

    // Sorting
    if (sortBy === "winrate") {

        assetList.sort(
            (a, b) =>
                b.winRate -
                a.winRate
        );

    } else if (sortBy === "profit") {

        assetList.sort(
            (a, b) =>
                b.netProfit -
                a.netProfit
        );

    } else if (sortBy === "asset") {

        assetList.sort(
            (a, b) =>
                a.asset.localeCompare(
                    b.asset
                )
        );

    } else {

        assetList.sort(
            (a, b) =>
                b.trades -
                a.trades
        );
    }

    renderFilteredAssetPerformance(
        assetList
    );
}
// ==========================================
// RENDER FILTERED ASSETS
// ==========================================

function renderFilteredAssetPerformance(
    assetList
) {

    const container =
        document.getElementById(
            "assetsTableContainer"
        );

    const count =
        document.getElementById(
            "assetFilterCount"
        );

    if (!container) {
        return;
    }

    if (count) {

        count.textContent =
            `${assetList.length} matching assets`;
    }

    if (assetList.length === 0) {

        container.innerHTML = `
            <div class="trade-loading">
                No assets match your filters.
            </div>
        `;

        return;
    }

    const rows =
        assetList.map(asset => {

            const profitClass =
                asset.netProfit > 0
                    ? "profit-positive"
                    : asset.netProfit < 0
                        ? "profit-negative"
                        : "";

            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHtml(
                                asset.asset
                            )}
                        </strong>
                    </td>

                    <td>
                        ${formatNumber(
                            asset.trades
                        )}
                    </td>

                    <td class="result-win">
                        ${formatNumber(
                            asset.wins
                        )}
                    </td>

                    <td class="result-loss">
                        ${formatNumber(
                            asset.losses
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            asset.draws
                        )}
                    </td>

                    <td>
                        <strong>
                            ${asset.winRate.toFixed(1)}%
                        </strong>
                    </td>

                    <td class="${profitClass}">
                        ${formatMoney(
                            asset.netProfit
                        )}
                    </td>

                </tr>
            `;
        })
        .join("");

    container.innerHTML = `
        <table class="trades-table">

            <thead>
                <tr>
                    <th>ASSET</th>
                    <th>TRADES</th>
                    <th>WINS</th>
                    <th>LOSSES</th>
                    <th>DRAWS</th>
                    <th>WIN RATE</th>
                    <th>NET P/L</th>
                </tr>
            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;
}
function clearAssetFilters() {

    const search =
        document.getElementById(
            "assetSearch"
        );

    const minTrades =
        document.getElementById(
            "assetMinTrades"
        );

    const winRate =
        document.getElementById(
            "assetWinRate"
        );

    const performance =
        document.getElementById(
            "assetPerformance"
        );

    const sort =
        document.getElementById(
            "assetSort"
        );

    if (search) {
        search.value = "";
    }

    if (minTrades) {
        minTrades.value = "0";
    }

    if (winRate) {
        winRate.value = "0";
    }

    if (performance) {
        performance.value = "all";
    }

    if (sort) {
        sort.value = "trades";
    }

    applyAssetFilters();
}
// ==========================================
// RENDER ASSET PERFORMANCE
// ==========================================

function renderAssetPerformance(trades) {

    const container =
        document.getElementById(
            "assetsTableContainer"
        );

    if (!container) {
        return;
    }

    const assets = {};

    trades.forEach(trade => {

        const asset =
            String(
                trade.asset || "UNKNOWN"
            );

        if (!assets[asset]) {

            assets[asset] = {
                asset: asset,
                trades: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                netProfit: 0
            };
        }

        const stats =
            assets[asset];

        stats.trades++;

        const result =
            String(
                trade.result || ""
            ).toUpperCase();

        if (result === "WIN") {
            stats.wins++;
        }

        else if (result === "LOSS") {
            stats.losses++;
        }

        else if (result === "DRAW") {
            stats.draws++;
        }

        stats.netProfit +=
            Number(
                trade.profit || 0
            );
    });

    const assetList =
        Object.values(assets)
            .sort(
                (a, b) =>
                    b.trades - a.trades
            );

    const totalTrades =
        trades.length;

    const totalNetProfit =
        trades.reduce(
            (sum, trade) =>
                sum +
                Number(
                    trade.profit || 0
                ),
            0
        );

    // Only consider assets with meaningful trade volume
// so a tiny sample cannot become "Best Asset".
const bestAsset =
    [...assetList]
        .filter(
            asset =>
                asset.trades >= 20
        )
        .sort(
            (a, b) => {

                const rateA =
                    a.wins / a.trades;

                const rateB =
                    b.wins / b.trades;

                // Highest win rate first
                if (rateB !== rateA) {
                    return rateB - rateA;
                }

                // If tied, prefer higher net P/L
                return b.netProfit - a.netProfit;
            }
        )[0];

    setText(
        "assetTotalCount",
        formatNumber(
            assetList.length
        )
    );

    setText(
        "assetTradeCount",
        formatNumber(
            totalTrades
        )
    );

    setText(
        "assetBestAsset",
        bestAsset
            ? bestAsset.asset
            : "—"
    );

    setText(
        "assetBestRate",
        bestAsset
            ? `${(
                (bestAsset.wins /
                bestAsset.trades) *
                100
            ).toFixed(1)}%`
            : "—"
    );

    setText(
        "assetNetProfit",
        formatMoney(
            totalNetProfit
        )
    );

    if (assetList.length === 0) {

        container.innerHTML = `
            <div class="trade-loading">
                No asset data available.
            </div>
        `;

        return;
    }

    const rows =
        assetList
            .map(asset => {

                const winRate =
                    asset.trades > 0
                        ? (
                            asset.wins /
                            asset.trades
                        ) * 100
                        : 0;

                const profitClass =
                    asset.netProfit > 0
                        ? "profit-positive"
                        : asset.netProfit < 0
                            ? "profit-negative"
                            : "";

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    asset.asset
                                )}
                            </strong>
                        </td>

                        <td>
                            ${formatNumber(
                                asset.trades
                            )}
                        </td>

                        <td class="result-win">
                            ${formatNumber(
                                asset.wins
                            )}
                        </td>

                        <td class="result-loss">
                            ${formatNumber(
                                asset.losses
                            )}
                        </td>

                        <td>
                            ${formatNumber(
                                asset.draws
                            )}
                        </td>

                        <td>
                            <strong>
                                ${winRate.toFixed(1)}%
                            </strong>
                        </td>

                        <td class="${profitClass}">
                            ${formatMoney(
                                asset.netProfit
                            )}
                        </td>

                    </tr>
                `;
            })
            .join("");

    container.innerHTML = `
        <table class="trades-table">

            <thead>

                <tr>
                    <th>ASSET</th>
                    <th>TRADES</th>
                    <th>WINS</th>
                    <th>LOSSES</th>
                    <th>DRAWS</th>
                    <th>WIN RATE</th>
                    <th>NET P/L</th>
                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;
}
async function showPerformancePage() {

    const content =
        document.querySelector(".main-area .content");

    if (!content) {
        console.error("Performance content not found.");
        return;
    }

    content.innerHTML = `
        <div class="page-content">

            <div class="page-header">
                <div>
                    <h1>Performance</h1>
                    <p>Real trading performance and AI analytics</p>
                </div>

                <button
                    id="performanceRefresh"
                    class="secondary-button"
                >
                    ↻ Refresh
                </button>
            </div>

            <div class="performance-page-grid">

                <div class="performance-card">
                    <span>TOTAL TRADES</span>
                    <strong id="perfTotalTrades">—</strong>
                </div>

                <div class="performance-card">
                    <span>WINS</span>
                    <strong id="perfWins" class="stat-win">—</strong>
                </div>

                <div class="performance-card">
                    <span>LOSSES</span>
                    <strong id="perfLosses" class="stat-loss">—</strong>
                </div>

                <div class="performance-card">
                    <span>DRAWS</span>
                    <strong id="perfDraws">—</strong>
                </div>

                <div class="performance-card">
                    <span>WIN RATE</span>
                    <strong id="perfWinRate">—</strong>
                </div>

                <div class="performance-card">
                    <span>NET P/L</span>
                    <strong id="perfNetProfit">—</strong>
                </div>

            </div>

            <div class="performance-panel">

                <div class="performance-panel-title">
                    FINANCIAL PERFORMANCE
                </div>

                <div class="performance-page-grid">

                    <div class="performance-card">
                        <span>TOTAL PROFIT</span>
                        <strong
                            id="perfTotalProfit"
                            class="stat-win"
                        >—</strong>
                    </div>

                    <div class="performance-card">
                        <span>TOTAL LOSS</span>
                        <strong
                            id="perfTotalLoss"
                            class="stat-loss"
                        >—</strong>
                    </div>

                    <div class="performance-card">
                        <span>NET P/L</span>
                        <strong id="perfNetProfit2">—</strong>
                    </div>

                </div>

            </div>

            <div class="performance-panel">

                <div class="performance-panel-title">
                    SIGNAL QUALITY
                </div>

                <div class="performance-page-grid">

                    <div class="performance-card">
                        <span>AVG CONFIDENCE</span>
                        <strong id="perfConfidence">—</strong>
                    </div>

                    <div class="performance-card">
                        <span>AVG PROBABILITY</span>
                        <strong id="perfProbability">—</strong>
                    </div>

                    <div class="performance-card">
                        <span>AVG AGREEMENT</span>
                        <strong id="perfAgreement">—</strong>
                    </div>

                </div>

            </div>

            <div
                id="performanceStatus"
                class="performance-loading"
            >
                Loading performance...
            </div>

        </div>
    `;

    const loadPerformance = async () => {

        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            logout();
            return;
        }

        try {

            const response = await fetch(
                `${API}/admin/performance/summary`,
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
                    "Failed to load performance."
                );
            }

            const data =
                await response.json();

            const stats =
                data.statistics || {};

            console.log(
                "REAL PERFORMANCE:",
                stats
            );

            setText(
                "perfTotalTrades",
                formatNumber(
                    stats.total_trades
                )
            );

            setText(
                "perfWins",
                formatNumber(
                    stats.wins
                )
            );

            setText(
                "perfLosses",
                formatNumber(
                    stats.losses
                )
            );

            setText(
                "perfDraws",
                formatNumber(
                    stats.draws
                )
            );

            setText(
                "perfWinRate",
                formatPercent(
                    stats.win_rate
                )
            );

            setText(
                "perfTotalProfit",
                formatMoney(
                    stats.total_profit
                )
            );

            setText(
                "perfTotalLoss",
                formatMoney(
                    -Math.abs(
                        Number(
                            stats.total_loss || 0
                        )
                    )
                )
            );

            setText(
                "perfNetProfit",
                formatMoney(
                    stats.net_profit
                )
            );

            setText(
                "perfNetProfit2",
                formatMoney(
                    stats.net_profit
                )
            );

            setText(
                "perfConfidence",
                formatPercent(
                    stats.average_confidence
                )
            );

            setText(
                "perfProbability",
                formatPercent(
                    stats.average_probability
                )
            );

            setText(
                "perfAgreement",
                formatPercent(
                    stats.average_agreement
                )
            );

            setText(
                "performanceStatus",
                "Live database"
            );

        } catch (error) {

            console.error(
                "Performance load failed:",
                error
            );

            setText(
                "performanceStatus",
                "Unable to load performance."
            );
        }
    };

    document
        .getElementById("performanceRefresh")
        ?.addEventListener(
            "click",
            loadPerformance
        );

    await loadPerformance();
}
// ==========================================
// COMING SOON
// ==========================================

function showComingSoon(page) {
    console.log(`${page} section is planned next.`);

    setTimeout(() => {
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.page === "dashboard"
            );
        });
    }, 500);
}
async function checkExistingSession() {
    const token = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");

    if (!token || !savedUser) {
        showLogin();
        return;
    }

    try {
        const response = await fetch(`${API}/auth/admin/test`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Admin session expired.");
        }

        const data = await response.json();

        if (data.success !== true) {
            throw new Error("Admin access denied.");
        }

        const user = JSON.parse(savedUser);

        showDashboard(user);
        await loadStats();

    } catch (error) {
        console.error("Admin session invalid:", error);

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        showLogin();
    }
}
// ==========================================
// NEW PAYMENT MODAL
// ==========================================

async function showNewPaymentModal() {

    const existing =
        document.getElementById("paymentModal");

    if (existing) {
        existing.remove();
    }

    const token =
        localStorage.getItem("adminToken");

    let users = [];

    try {

        const response =
            await fetch(`${API}/admin/users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        const data =
            await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                data.detail || "Failed to load users."
            );
        }

        users =
            Array.isArray(data.users)
                ? data.users
                : [];

    } catch (error) {

        alert(error.message);
        return;
    }

    const modal =
        document.createElement("div");

    modal.id = "paymentModal";

    modal.innerHTML = `
        <div class="coupon-modal-overlay">

            <div class="coupon-modal">

                <div class="coupon-modal-header">

                    <div>
                        <h2>New Payment</h2>
                        <p>Record a subscriber payment</p>
                    </div>

                    <button
                        type="button"
                        id="closePaymentModal"
                        class="coupon-modal-close"
                    >
                        ×
                    </button>

                </div>

                <div class="coupon-modal-body">

                    <label>
                        Subscriber
                    </label>

                    <select id="paymentUserId">

                        <option value="">
                            Select subscriber
                        </option>

                        ${users
                            .filter(
                                user =>
                                    user.role !== "admin"
                            )
                            .map(
                                user => `
                                    <option value="${user.id}">
                                        ${escapeHtml(user.email)}
                                    </option>
                                `
                            )
                            .join("")}

                    </select>


                    <label>
                        Amount
                    </label>

                    <input
                        type="number"
                        id="paymentAmount"
                        placeholder="29.99"
                        min="0"
                        step="0.01"
                    >


                    <label>
                        Currency
                    </label>

                    <select id="paymentCurrency">

                        <option value="USD">
                            USD
                        </option>

                    </select>


                    <label>
                        Payment Method
                    </label>

                    <select id="paymentMethod">

                        <option value="stripe">
                            Stripe / Card
                        </option>

                        <option value="paypal">
                            PayPal
                        </option>

                        <option value="crypto">
                            Crypto
                        </option>

                        <option value="cash_app">
                            Cash App
                        </option>

                        <option value="zelle">
                            Zelle
                        </option>

                    </select>


                    <div id="cryptoPaymentFields"
                         style="display:none;">

                        <label>
                            Crypto Currency
                        </label>

                        <input
                            type="text"
                            id="paymentCryptoCurrency"
                            placeholder="USDT"
                        >

                        <label>
                            Network
                        </label>

                        <input
                            type="text"
                            id="paymentNetwork"
                            placeholder="TRC20"
                        >

                    </div>


                    <label>
                        Transaction ID
                    </label>

                    <input
                        type="text"
                        id="paymentTransactionId"
                        placeholder="Transaction ID"
                    >


                    <label>
                        Wallet Address
                    </label>

                    <input
                        type="text"
                        id="paymentWalletAddress"
                        placeholder="Wallet address (optional)"
                    >


                    <label>
                        Status
                    </label>

                    <select id="paymentStatus">

                        <option value="paid">
                            Paid
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="failed">
                            Failed
                        </option>

                        <option value="refunded">
                            Refunded
                        </option>

                    </select>


                    <label>
                        Description
                    </label>

                    <input
                        type="text"
                        id="paymentDescription"
                        placeholder="Monthly subscription"
                    >

                </div>


                <div class="coupon-modal-footer">

                    <button
                        type="button"
                        id="cancelPaymentButton"
                        class="coupon-cancel-button"
                    >
                        CANCEL
                    </button>

                    <button
                        type="button"
                        id="createPaymentButton"
                        class="coupon-save-button"
                    >
                        CREATE PAYMENT
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    document
        .getElementById("closePaymentModal")
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById("cancelPaymentButton")
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById("paymentMethod")
        ?.addEventListener(
            "change",
            event => {

                const cryptoFields =
                    document.getElementById(
                        "cryptoPaymentFields"
                    );

                if (!cryptoFields) {
                    return;
                }

                cryptoFields.style.display =
                    event.target.value === "crypto"
                        ? "block"
                        : "none";
            }
        );


    document
        .getElementById("createPaymentButton")
        ?.addEventListener(
            "click",
            createPayment
        );
}
// ==========================================
// CREATE PAYMENT
// ==========================================

async function createPayment() {

    const token =
        localStorage.getItem("adminToken");

    const userId =
        document
            .getElementById("paymentUserId")
            ?.value;

    const amount =
        document
            .getElementById("paymentAmount")
            ?.value;

    const currency =
        document
            .getElementById("paymentCurrency")
            ?.value;

    const paymentMethod =
        document
            .getElementById("paymentMethod")
            ?.value;

    const cryptoCurrency =
        document
            .getElementById("paymentCryptoCurrency")
            ?.value
            .trim();

    const network =
        document
            .getElementById("paymentNetwork")
            ?.value
            .trim();

    const transactionId =
        document
            .getElementById("paymentTransactionId")
            ?.value
            .trim();

    const walletAddress =
        document
            .getElementById("paymentWalletAddress")
            ?.value
            .trim();

    const status =
        document
            .getElementById("paymentStatus")
            ?.value;

    const description =
        document
            .getElementById("paymentDescription")
            ?.value
            .trim();


    if (!userId) {
        alert("Please select a subscriber.");
        return;
    }

    if (!amount || Number(amount) < 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    if (
        paymentMethod === "crypto" &&
        (!cryptoCurrency || !network)
    ) {
        alert(
            "Crypto currency and network are required."
        );
        return;
    }


    const button =
        document.getElementById(
            "createPaymentButton"
        );

    if (button) {
        button.disabled = true;
        button.textContent = "CREATING...";
    }


    try {

        const response =
            await fetch(`${API}/admin/payments`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    user_id: userId,
                    amount: Number(amount),
                    currency,
                    payment_method: paymentMethod,
                    crypto_currency:
                        paymentMethod === "crypto"
                            ? cryptoCurrency
                            : null,
                    network:
                        paymentMethod === "crypto"
                            ? network
                            : null,
                    transaction_id:
                        transactionId || null,
                    wallet_address:
                        walletAddress || null,
                    status,
                    description:
                        description || null
                })
            });


        const data =
            await response.json();


        if (!response.ok || data.success !== true) {
            throw new Error(
                data.detail ||
                "Failed to create payment."
            );
        }


        document
            .getElementById("paymentModal")
            ?.remove();


        await loadPaymentsData();


        alert("Payment created successfully.");

    } catch (error) {

        alert(error.message);

        if (button) {
            button.disabled = false;
            button.textContent = "CREATE PAYMENT";
        }
    }
}

checkExistingSession();