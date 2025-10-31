import { useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useLocation from '../../utils/hooks/useLocation'
import { Text } from 'react-native'

const HelpNearby = () => {
    const { latitude, longitude, errMsg, location } = useLocation();
    // console.log("latitude: ", latitude);
    // console.log("longitude", longitude);
    // console.log("location: \n", location)
    
    // console.log("error is : ", errMsg);

    // title, description, coordinates, radius, location
    const sendHelpRequest = async() => {
        try {
            const payload = {
                title: "Demo check",
                description: "Demo description",
                latitude,
                longitude,
                location:location
            }

            const response = await fetch(`https://hackathon-connect-app-backend.onrender.com/request/create/help`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Secret": "smartboyakriti"
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("helper location data is : /n ", data);
        } catch (error) {
            console.log("Error sending the request: ", error);
        }
    }
    return (
        <SafeAreaView style={styles.container}> 
            
            <TouchableOpacity
                style={{ marginTop: 50, marginHorizontal: 20 }}
                onPress={sendHelpRequest}>
                <Text>send location</Text>
            </TouchableOpacity>
            
        </SafeAreaView>
  )
}

export default HelpNearby

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
    },
    map: {
        flex: 1,
        borderRadius: 12,
        marginHorizontal: 10,
        marginBottom: 10,
    },
})