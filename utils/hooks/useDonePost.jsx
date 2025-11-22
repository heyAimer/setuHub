import Toast from "react-native-toast-message";
import { BASE_URL } from "../constants/api";

export const donePost =async (id) => {
    try {
        
        const response = await fetch(`${BASE_URL}/request/done/${id}`, {
            method: "PATCH",
            headers: {
                "X-App-Secret": "smartboyakriti"
            }
        });

        if (!response.ok) {
            Toast.show({
                type: 'error',
                text1: "Error in updating the post."
            })
            return;
        }
    
        const json = await response.json();
        Toast.show({
            type: 'success',
            text1: "Request accomplised successfully."
        });
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: "⚠️Something went wrong!"
        });
        return null;
    }
};
