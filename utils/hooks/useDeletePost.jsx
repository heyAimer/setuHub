import Toast from "react-native-toast-message";
import { BASE_URL } from "../constants/api";
import { useCallback, useEffect } from "react";


export const deletePost =async (id) => {
    try {
        
        const response = await fetch(`${BASE_URL}/request/delete/${id}`, {
            method: "DELETE",
            headers: {
                "X-App-Secret": "smartboyakriti"
            }
        });

        if (!response.ok) {
            Toast.show({
                type: 'error',
                text1: "Error deleting the post."
            })
            return;
        }
    
        const json = await response.json();
        Toast.show({
            type: 'success',
            text1: "Post deleted successfully."
        });
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: "⚠️Something went wrong!"
        });
        return null;
    }
};
