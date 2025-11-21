import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from 'expo-image';
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_URL } from "../../utils/constants/api";
import useLocation from '../../utils/hooks/useLocation';

const HelpNearby = () => {
    const insets = useSafeAreaInsets();
    const { latitude, longitude, errMsg, location, loading } = useLocation();
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [helpers, setHelpers] = useState([]);

    const convertUTCtoIST = (utcDate) => {
        const date = new Date(utcDate);

        const formatter = new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
        return formatter.format(date);
    };

    useFocusEffect(
        useCallback(() => {
            let cancelled = true;
            setHelpers([]);
            setError(null);
            setLoadingPost(true);

            const fetchHelpNearby = async () => {
                if (!cancelled) return;
                if (loading) return;
                if (errMsg) {
                    if (cancelled) setLoadingPost(false);
                    return;
                }
                if (latitude == null || longitude == null) {
                    if (cancelled) setLoadingPost(false);
                    return;
                } 

                try {
                    const url = `${BASE_URL}/request/retrieve/helpnearby?latitude=${latitude}&longitude=${longitude}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            "X-App-Secret": "smartboyakriti"
                        }
                    });
                    if (!response.ok) {
                        const text = await response.text();
                        throw new Error(`Server ${response.status}: ${text || response.status}`)
                    }

                    const json = await response.json();
                    if (cancelled) {
                        setHelpers(Array.isArray(json) ? json : (json.data ?? json.results ?? []));
                        setError(null)
                    }
                    
                } catch (err) {
                    const jsonPart = err.message.split(": ")[1];  
                    const parsed = JSON.parse(jsonPart);
                    const msg = parsed.message; 
                    if (cancelled) setError(msg)
                } finally {
                    if (cancelled) setLoadingPost(false)
                }
            }
            fetchHelpNearby();

            return () => {
                cancelled = false
            }
        }, [latitude, longitude,loading, errMsg])
    );

    return (
        <View style={[styles.container , {paddingTop: insets.top}]}> 
            
            <Text style={styles.heading}>Nearby Support</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.createPostHeading}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Help is right here!
                    </Text>
                    <TouchableOpacity
                        style={styles.createPostbtn}
                        onPress={() => router.push('/createHelpNearbyPost')}
                    >
                        <Ionicons
                            name="add-circle-outline" size={22} color={'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 500 }}>Reach
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
                        <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/profilePic3.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10,fontSize: 18, fontWeight:800 }}>{error}</Text>
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
            
                ):
                (helpers.map((info) => (

                    <View key={info.postUuid} style={styles.postContainer}>

                        <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                            {info?.profilePhotoUrl ? (<Image
                                source={info.profilePhotoUrl}
                                style={styles.pfp}
                            />) : (
                                <View style={styles.pfpWrapper}>
                                    <LottieView
                                        source={require('../../assets/images/profilePic1.json')}
                                        autoPlay
                                        loop
                                        style={{ width: '100%', height: '100%' }}
                                    />   
                                </View>
                            )}
                            <View style={{ marginLeft:8}}>
                                <Text style={{ fontWeight: 500, fontSize: 18 }}>{ info.name }</Text>
                                <Text style={{ fontSize:14, color:'#5F6368'}}>{convertUTCtoIST(info.createdAt)}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 700 }}>
                                {info.title}
                            </Text>

                            <Text style={{fontSize:15}}>
                               {info.description}
                            </Text>
                            
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontWeight: 500,fontSize:15}}>Phone number : </Text>
                                <Text style={{fontSize:15, color: '#000'}}>
                                    {info.phone}
                                </Text>
                            </View>
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
                                        coordinate={{ latitude: info.latitude, longitude: info.longitude}}
                                        title="You are here"
                                        pinColor="blue" // default red GPS marker
                                    />
                                    
                                </MapView>
                            </View>
                        </View>

                    </View>

                ))
                )}
            </ScrollView>
            
        </View>
    )
}

export default HelpNearby

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
    },
    heading: {
        fontSize: 24,
        fontWeight: 500,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        width: '100%',
        textAlign:'center',
        paddingVertical: 15,
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
        fontWeight:500
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
    pfp: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E3EFFF'
    },
        pfpWrapper: {
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: 'hidden', // IMPORTANT
        borderWidth: 1,
        borderColor: '#E3EFFF',
    },
})