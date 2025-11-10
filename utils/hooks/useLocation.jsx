import * as Location from "expo-location";
import { useEffect, useState } from "react";

const useLocation = () => {
  const[errMsg, setErrMsg] = useState('');
  const[longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const getUserLocation = async () => {
    try {
      setLoading(true); 
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrMsg("Permission to access location was denied");
        return null;
      }

      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      if (coords) {
        const { latitude, longitude } = coords;
        
        setLatitude(latitude);
        setLongitude(longitude);

        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
        const formatted = response.map(item =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, value ?? ""])
          )
        );

        setLocation(formatted);
        
      }
    } catch (err) {
      setErrMsg("Location Error!")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return{latitude, longitude,location, errMsg, loading}

}
export default useLocation;