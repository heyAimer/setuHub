import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from 'expo-image';
import { router, useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import { BASE_URL } from "../../utils/constants/api";
import useLocation from '../../utils/hooks/useLocation';

const BloodEmergency = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { latitude, longitude, errMsg, location, loading } = useLocation();

    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [helpers, setHelpers] = useState([]);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            const fetchHelpNearby = async () => {
                if (loadingPost) return;
                if (loading) return;
                if (errMsg) {
                    setError('Location error: ' + errMsg)
                }
                if (latitude == null || longitude == null) return;

                setLoadingPost(true);
                setError(null);

             
                try {
                    const url = `${BASE_URL}/request/retrieve/bloodemergency?latitude=${latitude}&longitude=${longitude}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            "X-App-Secret": "smartboyakriti",
                            "X-App-Environment":"dev"
                        }
                    });
                    if (!response.ok) {
                        const text = await response.text();
                        throw new Error(`Server ${response.status}: ${text || response.status}`)
                    }

                    const json = await response.json();

                    if (!cancelled) {
                        setHelpers(Array.isArray(json) ? json : (json.data ?? json.results ?? []));
                    }
                } catch (err) {
                    if (!cancelled) setError(err.message)
                } finally {
                    if (!cancelled) setLoadingPost(false)
                }
            }
            fetchHelpNearby();

            return () => {
                cancelled = true
            }
        }, [latitude, longitude, loading])
    );

    return (
        <View style={[styles.container , {paddingTop: insets.top}]}> 
            
            <View style={styles.topBar}>

                <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.heading}>Blood Emergency</Text>

            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.createPostHeading}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Find or offer blood nearby.
                    </Text>
                    <TouchableOpacity
                        style={styles.createPostbtn}
                        onPress={() => router.push('/createBloodEmergencyPost')}
                    >
                        <Ionicons
                            name="add-circle-outline" size={22} color={'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 500 }}>Request
                        </Text>
                    </TouchableOpacity>

                </View>

                {loading || loadingPost ? (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                         <LottieView
                            source={require('../../assets/images/loading.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10, fontSize: 18 }}>Loading Posts...</Text>
                    </View>
                
                ) : error ? (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <Text style={{ marginTop: 10,fontSize: 18 }}>Error: {error}</Text>
                    </View>
            
                ) : helpers.length === 0 ? (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                        source={require('../../assets/images/nothing-available.json')}
                        autoPlay
                        loop
                        style={styles.animation}
                        />
                        <Text style={{ marginTop: 10, fontSize: 18 }}>No posts available.</Text>
                    </View>
            
                ):(helpers.map((info) => (

                    <View key={info.postUuid} style={styles.postContainer}>

                        <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                            <Image
                                source={img}
                                style={styles.image}
                            />
                            <View style={{ marginLeft:8}}>
                                <Text style={{ fontWeight: 500, fontSize: 18 }}>{ info.name }</Text>
                                <Text style={{ fontSize:14, color:'#5F6368'}}>2min ago</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 700, marginBottom:4 }}>
                                {info.title}
                            </Text>

                            <Text style={{fontSize:15}}>
                               {info.description}
                            </Text>

                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontWeight: 800,fontSize:15}}>Blood group needed : </Text>
                                <Text style={{fontSize:15, color: '#CA0002'}}>
                                    {info.bloodGroup}
                                </Text>
                            </View>

                            <Text style={{fontSize:15, fontWeight:400}}>
                                Location : {info.location[0].formattedAddress}
                            </Text>
                            
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: info.latitude,
                                        longitude: info.longitude,
                                        latitudeDelta: 0.0015,
                                        longitudeDelta: 0.0015,
                                    }}     
                                    showsUserLocation={true} // ✅ Blue Google-dot style
                                    followsUserLocation={true} // ✅ Camera follows user
                                    
                                >

                                    <Marker
                                        coordinate={{ latitude, longitude }}
                                        title="Help needed here"
                                        pinColor="red" // default red GPS marker
                                    />
                                    
                                </MapView>
                            </View>
                        </View>

                    </View>

                )))
                }
                
            </ScrollView>
            
        </View>
    )
}

export default BloodEmergency

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC"
    },
    topBar: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        width: '100%',
        paddingVertical: 15,
        color: "#1E1E1E",
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 85,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 600,
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
        paddingVertical: 20,
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
        marginTop:10
    },
    map: {
        flex: 1,
        height:500
    },
    animation: {
        width: 300,
        height: 300,
    },
})