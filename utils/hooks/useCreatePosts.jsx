import Toast from "react-native-toast-message";
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
        Toast.show({
            type: 'success',
            text1:"✨ Post created successfully"
        })
        try {
            return JSON.parse(text); // success JSON
        } catch (e) {
            Toast.show({
                type: 'error',
                text1:"⚠️Something went wrong."
            })
            throw new Error(text); // backend error text
            
        }

    } catch (error) {
        console.error("API POST Error:", error?.message);
        Toast.show({
            type: 'error',
            text1:"⚠️Something went wrong."
        })
    }
}
