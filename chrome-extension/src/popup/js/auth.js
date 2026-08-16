const API =
    "https://pocket-option-signal-api-production.up.railway.app";

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

export async function register(
    email,
    password
) {

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

    return data;
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
