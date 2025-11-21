import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useFetchHistory(apiURL) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Cache to prevent repeated API calls
    const cacheRef = useRef({});  
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    
    const fetchData = async (force = false) => {      
        try {
            if (isMounted.current) setLoading(true);

            // Use cache unless force = true
            if (!force && cacheRef.current[apiURL]) {
                if (isMounted.current) {
                    setData(cacheRef.current[apiURL]);
                    setLoading(false);
                }
                return;
            }
            // Otherwise → fetch from API
            const response = await fetch(apiURL, {
                method: "GET",
                headers: {
                   "X-App-Secret": "smartboyakriti"
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server ${response.status}: ${text || response.status}`)
            }
            
            const json = await response.json();
            // Save in cache
            cacheRef.current[apiURL] = json.data;

            if (isMounted.current) setData(json.data);
        } catch (err) {
             if (isMounted.current) setError("⚠️ Something went wrong.");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchData();
    }, [apiURL]);

    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;
            fetchData(false);
            return () => {
                isMounted.current = false;
            };
        },[apiURL])
    )
    return { data, loading, error, refetch: () => fetchData(true) };
}
