import * as Location from "expo-location";
import { useEffect, useState } from "react";

const useLocation = () => {
  const[errMsg, setErrMsg] = useState('');
  const[longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [location, setLocation] = useState('');
  
  const getUserLocation = async () => {
    try {
      
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setErrMsg("Permission to access location was denied");
        return null;
      }

      let { coords } = await Location.getCurrentPositionAsync();
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
        // console.log("USER Location is: /n", JSON.stringify(fixedResponse, null, 2));
        
      }
    } catch (err) {
      console.log("Error fetching location data:", err);
      setErrMsg("Location Error!")
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return{latitude, longitude,location, errMsg}

}
export default useLocation;

// export const getUserLocation = async () => {
//   try {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       alert("Permission to access location was denied");
//       return null;
//     }

//     const location = await Location.getCurrentPositionAsync({});
//     return {
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//     };
//   } catch (err) {
//     console.error("Error fetching location:", err);
//     return null;
//   }
// };
