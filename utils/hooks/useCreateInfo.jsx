import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../constants/api";

const useCreateInfo = () => {

    const [user, setUser] = useState([]);
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch(`${BASE_URL}/request/create`, {
                    method: "GET",
                    headers: {
                        "X-App-Secret": "smartboyakriti"
                    }
                });

                const json = await res.json();
                setUser(json.data || json);
                console.log(json);
            } catch (error) {
                Toast.show({
                    type:'error',
                    text1: "Unable to load user info."
                });
            }
        }
        fetchInfo();
    }, []);

    return { user };
    
}
export default useCreateInfo;