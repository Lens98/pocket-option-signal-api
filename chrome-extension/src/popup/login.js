import {
    login,
    register
} from "./js/auth.js";

// ==========================================
// LOGIN SCREEN
// ==========================================

export function showLoginScreen(
    onLoginSuccess
) {

    const existing =
        document.getElementById("authScreen");

    if (existing) {

        return;
    }

    const screen =
        document.createElement("div");

    screen.id = "authScreen";

    screen.innerHTML = `

        <div class="auth-container">

            <div class="auth-logo">
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M12.75 2.75c2.9 0.35 5.6 1.66 7.03 3.1 1.44 1.43 2.75 4.13 3.1 7.03.05.42-.1.84-.4 1.14l-2.68 2.68a1.4 1.4 0 0 1-1.62.26l-.9-.45-4.99 4.99a1.4 1.4 0 0 1-1.98 0l-.7-.7 2.97-4.46a.75.75 0 1 0-1.25-.83l-2.78 4.17-1.28-1.28 4.17-2.78a.75.75 0 1 0-.83-1.25l-4.46 2.97-.7-.7a1.4 1.4 0 0 1 0-1.98l4.99-4.99-.45-.9a1.4 1.4 0 0 1 .26-1.62l2.68-2.68c.3-.3.72-.45 1.14-.4Zm2.9 5.02a1.9 1.9 0 1 0-2.69 2.69 1.9 1.9 0 0 0 2.69 2.69ZM5.4 17.18a.75.75 0 0 1 .06 1.06c-.45.5-.86 1.51-1.13 2.46a13 13 0 0 0-.3 1.27 13 13 0 0 0 1.27-.3c.95-.28 1.96-.69 2.46-1.14a.75.75 0 0 1 1 1.12c-.77.69-2.06 1.16-3.03 1.45-1 .29-1.9.44-2.24.47a.9.9 0 0 1-.98-.98c.03-.34.18-1.25.47-2.24.29-.97.76-2.26 1.45-3.03a.75.75 0 0 1 .97-.14Z" />
    </svg>
</div>

<h1 class="auth-title">
    SignalForge AI
</h1>

<p class="auth-subtitle">
    AI Trading Intelligence
</p>


            <div
                id="loginView"
                class="auth-view"
            >

                <h2>
                    Welcome Back
                </h2>

                <p class="auth-description">
                    Sign in to access your AI dashboard.
                </p>


                <form id="loginForm">

                    <label>
                        Email
                    </label>

                    <input
                        id="loginEmail"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        id="loginPassword"
                        type="password"
                        placeholder="Enter your password"
                        autocomplete="current-password"
                        required
                    />


                    <button
                        type="submit"
                        id="loginButton"
                        class="auth-button"
                    >
                        LOGIN
                    </button>

                </form>


                <div
                    id="loginMessage"
                    class="auth-message"
                ></div>


                <button
                    id="showRegister"
                    class="auth-link"
                    type="button"
                >
                    Create Account
                </button>

            </div>


            <div
                id="registerView"
                class="auth-view hidden"
            >

                <h2>
                    Create Account
                </h2>

                <p class="auth-description">
                    Create your Pocket Option AI PRO account.
                </p>


                <form id="registerForm">

                    <label>
                        Email
                    </label>

                    <input
                        id="registerEmail"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        id="registerPassword"
                        type="password"
                        placeholder="Minimum 8 characters"
                        minlength="8"
                        autocomplete="new-password"
                        required
                    />


                    <label>
                        Confirm Password
                    </label>

                    <input
                        id="registerConfirm"
                        type="password"
                        placeholder="Confirm your password"
                        minlength="8"
                        autocomplete="new-password"
                        required
                    />


                    <button
                        type="submit"
                        id="registerButton"
                        class="auth-button"
                    >
                        CREATE ACCOUNT
                    </button>

                </form>


                <div
                    id="registerMessage"
                    class="auth-message"
                ></div>


                <button
                    id="showLogin"
                    class="auth-link"
                    type="button"
                >
                    Back to Login
                </button>

            </div>

        </div>
    `;


    document.body.prepend(screen);


    const loginView =
        document.getElementById(
            "loginView"
        );

    const registerView =
        document.getElementById(
            "registerView"
        );


    // ==========================================
    // SHOW REGISTER
    // ==========================================

    document
        .getElementById("showRegister")
        .addEventListener(
            "click",
            () => {

                loginView.classList.add(
                    "hidden"
                );

                registerView.classList.remove(
                    "hidden"
                );
            }
        );


    // ==========================================
    // SHOW LOGIN
    // ==========================================

    document
        .getElementById("showLogin")
        .addEventListener(
            "click",
            () => {

                registerView.classList.add(
                    "hidden"
                );

                loginView.classList.remove(
                    "hidden"
                );
            }
        );


    // ==========================================
    // LOGIN
    // ==========================================

    document
        .getElementById("loginForm")
        .addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const email =
                    document
                        .getElementById(
                            "loginEmail"
                        )
                        .value
                        .trim();

                const password =
                    document
                        .getElementById(
                            "loginPassword"
                        )
                        .value;


                const button =
                    document.getElementById(
                        "loginButton"
                    );

                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                button.disabled = true;

                button.textContent =
                    "SIGNING IN...";

                message.textContent = "";

                message.className =
                    "auth-message";


                try {

                    await login(
                        email,
                        password
                    );

                    message.textContent =
                        "Login successful.";

                    message.classList.add(
                        "success"
                    );


                    screen.remove();

                    onLoginSuccess();

                } catch (error) {

                    message.textContent =
                        error.message;

                    message.classList.add(
                        "error"
                    );

                    button.disabled = false;

                    button.textContent =
                        "LOGIN";
                }
            }
        );


    // ==========================================
// REGISTER
// ==========================================

    document
        .getElementById("registerForm")
        .addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const email =
                    document
                        .getElementById("registerEmail")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById("registerPassword")
                        .value;

                const confirm =
                    document
                        .getElementById("registerConfirm")
                        .value;

                const button =
                    document.getElementById("registerButton");

                const message =
                    document.getElementById("registerMessage");

                if (password !== confirm) {
                    message.textContent =
                        "Passwords do not match.";

                    message.className =
                        "auth-message error";

                    return;
                }

                button.disabled = true;
                button.textContent =
                    "CREATING ACCOUNT...";

                message.textContent = "";
                message.className =
                    "auth-message";

                try {
                    await register(email, password);

                    message.textContent =
                        "Account created. Checking subscription...";

                    message.classList.add("success");

                    document
                        .getElementById("registerForm")
                        .reset();

                    screen.remove();

                    // Let popup.js check the subscription.
                    onLoginSuccess();

                            } catch (error) {
                message.textContent =
                    error.message;

                message.classList.add("error");

            } finally {
                button.disabled = false;
                button.textContent =
                    "CREATE ACCOUNT";
            }
        }
    );
}