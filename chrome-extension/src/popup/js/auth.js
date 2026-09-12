
const API = "https://pocket-option-signal-api-production.up.railway.app";
const TOKEN_KEY = "pocketOptionAuthToken";
const USER_KEY = "pocketOptionUser";


// ==========================================
// GET SAVED TOKEN
// ==========================================

export async function getAuthToken() {

    const result = await chrome.storage.local.get(
        TOKEN_KEY
    );

    return result[TOKEN_KEY] || null;
}


// ==========================================
// GET SAVED USER
// ==========================================

export async function getSavedUser() {

    const result = await chrome.storage.local.get(
        USER_KEY
    );

    return result[USER_KEY] || null;
}


// ==========================================
// LOGIN
// ==========================================

export async function login(
    email,
    password
) {

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
            data.detail || "Unable to login."
        );
    }

    await chrome.storage.local.set({

        [TOKEN_KEY]: data.token,

        [USER_KEY]: data.user

    });

    return data;
}


// ==========================================
// REGISTER
// ==========================================

export async function register(email, password) {
    const response = await fetch(
        `${API}/auth/register`,
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
            data.detail || "Unable to create account."
        );
    }

    // Automatically log in after registration.
    // This saves the authentication token needed by payments.
    return await login(email, password);
}

// ==========================================
// VERIFY SESSION
// ==========================================

export async function verifySession() {

    const token = await getAuthToken();

    if (!token) {

        return null;
    }

    try {

        const response = await fetch(
            `${API}/auth/me`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            await logout();

            return null;
        }

        const data = await response.json();

        await chrome.storage.local.set({

            [USER_KEY]: data.user

        });

        return data.user;

    } catch (error) {

        console.error(
            "Session verification failed:",
            error
        );

        return null;
    }
}


// ==========================================
// LOGOUT
// ==========================================

export async function logout() {

    const token = await getAuthToken();

    if (token) {

        try {

            await fetch(
                `${API}/auth/logout`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        } catch (error) {

            console.warn(
                "Logout request failed:",
                error
            );
        }
    }

    await chrome.storage.local.remove([
        TOKEN_KEY,
        USER_KEY
    ]);
}
// ==========================================
// GET AVAILABLE SUBSCRIPTION PLANS
// ==========================================

export async function getSubscriptionPlans() {
    const token = await getAuthToken();

    if (!token) {
        throw new Error("You must be logged in to view subscription plans.");
    }

    const response = await fetch(
        `${API}/payments/plans`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = {
            detail: text || "Server returned an invalid response."
        };
    }

    if (!response.ok) {
        throw new Error(
            data.detail ||
            `Unable to load subscription plans (${response.status}).`
        );
    }

    return data;
}


// ==========================================
// SUBMIT PAYMENT
// ==========================================
export async function submitPayment(paymentData) {
    const token = await getAuthToken();

    if (!token) {
        throw new Error("You must be logged in to submit a payment.");
    }

    const response = await fetch(
        `${API}/payments/submit`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to submit payment."
        );
    }

    return data;
}


// ==========================================
// GET PAYMENT AND SUBSCRIPTION STATUS
// ==========================================

export async function getPaymentStatus() {
    const token = await getAuthToken();

    if (!token) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(
        `${API}/payments/status`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    // Read the response safely, even when Railway
    // returns HTML or plain text instead of JSON.
    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = {
            detail: text || "Server returned an invalid response."
        };
    }

    if (!response.ok) {
        throw new Error(
            data.detail ||
            `Payment status request failed (${response.status}).`
        );
    }

    return data;
}