import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import useLocation from '../../utils/hooks/useLocation';

//Hangouts & Events

const ENDPOINT = 'https://hackathon-connect-app-backend.onrender.com/request/retrieve/impactevents';

const ImpactEvents = () => {
    const { latitude, longitude, errMsg, location } = useLocation();

    return (
        <SafeAreaView style={styles.container}> 
            
            <Text style={styles.heading}>Hangouts & Events</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.createPostHeading}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Ready to host an event🌱?
                    </Text>
                    <TouchableOpacity
                        style={styles.createPostbtn}
                        onPress={() => router.push('/createHangoutAndEventsPost')}
                    >
                        <Ionicons
                            name="add-circle-outline" size={22} color={'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 500 }}>Host
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.postContainer}>

                    <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                        <Image
                            source={img}
                            style={styles.image}
                        />
                        <View style={{ marginLeft:8}}>
                            <Text style={{fontWeight:500, fontSize:18}}>Hi Rudra</Text>
                            <Text style={{ fontSize:14, color:'#5F6368'}}>2min ago</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:16}}>
                            As Forbes highlights in this article on Coral AI, paperwork consumes nearly $450 billion annually in U.S. healthcare. Coral’s agentic AI workflows turn weeks of administrative cycle time into minutes, automating intake, referrals, and prior authorizations with accuracy topping 98%.
                        </Text>
                        
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: 30.3182105,
                                    longitude: 78.411416,
                                    latitudeDelta: 0.0015,
                                    longitudeDelta: 0.0015,
                                }}     
                                showsUserLocation={true} // ✅ Blue Google-dot style
                                followsUserLocation={true} // ✅ Camera follows user
                                
                            >

                                <Marker
                                    coordinate={{ latitude: 30.3182105, longitude: 78.411416 }}
                                    title="You are here"
                                    pinColor="red" // default red GPS marker
                                />
                                
                            </MapView>
                        </View>
                    </View>

                </View>
                
                
                {/* <TouchableOpacity
                    style={{ marginTop: 50, marginHorizontal: 20 }}
                    onPress={sendHelpRequest}>
                    <Text>send location</Text>
                </TouchableOpacity> */}
            </ScrollView>
            
        </SafeAreaView>
    )

}

export default ImpactEvents

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
        paddingTop:10
    },
    heading: {
        fontSize: 24,
        fontWeight: 700,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        width: '100%',
        textAlign:'center',
        paddingBottom: 10,
        color: "#1E1E1E",
        marginBottom:20,
    },
    scrollContainer: {
        paddingBottom: 60,
        paddingHorizontal: 20,
        gap:20
    },
    createPostHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EDF4FF',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor:'#E2EEFD'
    },
    createPostbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingLeft: 6,
        borderRadius: 4,
        paddingRight: 9,
        backgroundColor:'#1976D2'
    },
    postContainer: {
        borderWidth: 1,
        borderColor: "#DCDCDD",
        paddingHorizontal: 10,
        paddingVertical:15,
        borderRadius: 8  
    },
    bottomRow: {
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems:'center',
        paddingVertical: 10,
        gap:10,
    },
    charCount: {
        textAlign:'center'
        
    },
    postBtn: {
        backgroundColor: "#1976D2",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        color: "#FFFFFF",
        fontWeight:600
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E3EFFF'
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
        height:500
    },
})