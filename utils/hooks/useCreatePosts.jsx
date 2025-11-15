import { BASE_URL } from "../constants/api";

export async function apiPost(endpoint, payload) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Secret": "smartboyakriti",
                "X-App-Environment":"dev"
            },
            body: JSON.stringify(payload),
        });

        const text = await response.text();

        try {
            return JSON.parse(text); // success JSON
        } catch (e) {
            throw new Error(text); // backend error text
        }

    } catch (error) {
        console.error("API POST Error:", error?.message);
        throw error;
    }
}
