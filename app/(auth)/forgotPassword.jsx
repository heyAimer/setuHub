import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../../utils/constants/api";

const forgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Toast.show({
                type: 'failed',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address.'
            });
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/login/forgotpassword`,
                { email: email.trim() },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti"
                    },
                }
            );

            console.log("forgot pass res: ", response.data);

            router.push({
                pathname: "/(auth)/resetPassword",
                params: { email: email.trim() }
            })
        } catch (error) {
            console.log("Error : ", error.response?.data || error.message);
            Toast.show({
                type: 'failed',
                text1: 'Error',
                text2: error.response?.data?.message || 'An error occurred. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }
}