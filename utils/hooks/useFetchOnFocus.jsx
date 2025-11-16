// hooks/useLocationList.js
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../constants/api';

export function useFetchOnFocus(endpoint, latitude, longitude, loading, errMsg) {
  const [data, setData] = useState([]);          // ← shared list
  const [error, setError] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
        let isCurrent = true;
        
        // ---- reset UI for a fresh request ----
        setData([]);
        setError(null);
        setLoadingPost(false);
        setHasLoaded(false);

        const fetch = async () => {
            if (loadingPost || loading || latitude == null || longitude == null) return;
          
            setLoadingPost(true);

        try {
            const url = `${BASE_URL}/request/retrieve/${endpoint}?latitude=${latitude}&longitude=${longitude}`;
            
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                'X-App-Secret': 'smartboyakriti',
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Server ${res.status}: ${txt || 'Unknown'}`);
            }

            const json = await res.json();
            console.log("FETCEHD DATA :", endpoint, json);
            if (isCurrent) {
                const list = Array.isArray(json)
                ? json
                : json.data ?? json.results ?? [];

                setData(list);
                setHasLoaded(true);
            }
        } catch (e) {
          let msg = 'Failed to load data';
          try {
            const part = e.message.split(': ')[1];
            const parsed = JSON.parse(part);
            msg = parsed.message || msg;
          } catch {
            msg = e.message;
          }

          if (isCurrent) {
            setError(msg);
            setHasLoaded(true);
          }
        } finally {
          if (isCurrent) setLoadingPost(false);
        }
      };

      fetch();

      return () => {
        isCurrent = false;
      };
    }, [endpoint, latitude, longitude, loading, errMsg])
  );

  return { data, error, loadingPost, hasLoaded };
}