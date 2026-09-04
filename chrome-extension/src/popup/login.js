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
                🤖
            </div>

            <h1 class="auth-title">
                Pocket Option AI PRO
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
                        .getElementById(
                            "registerEmail"
                        )
                        .value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "registerPassword"
                        )
                        .value;


                const confirm =
                    document
                        .getElementById(
                            "registerConfirm"
                        )
                        .value;


                const button =
                    document.getElementById(
                        "registerButton"
                    );


                const message =
                    document.getElementById(
                        "registerMessage"
                    );


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

                    await register(
                        email,
                        password
                    );


                    message.textContent =
                        "Account created. You can now log in.";

                    message.classList.add(
                        "success"
                    );


                    document
                        .getElementById(
                            "registerForm"
                        )
                        .reset();


                    setTimeout(
                        () => {

                            registerView.classList.add(
                                "hidden"
                            );

                            loginView.classList.remove(
                                "hidden"
                            );

                            document
                                .getElementById(
                                    "loginEmail"
                                )
                                .value = email;

                        },
                        1000
                    );


                } catch (error) {

                    message.textContent =
                        error.message;

                    message.classList.add(
                        "error"
                    );

                } finally {

                    button.disabled = false;

                    button.textContent =
                        "CREATE ACCOUNT";
                }
            }
        );
}