import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router, useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import { BASE_URL } from "../../utils/constants/api";
import useLocation from '../../utils/hooks/useLocation';
//Hangouts & Events

const ImpactEvents = () => {
    const insets = useSafeAreaInsets();
    const { latitude, longitude, errMsg, location, loading } = useLocation();
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);
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
        let isCurrent = true;

        // Reset UI when location changes
        setData([]);
        setError(null);
        setLoadingPost(false);
        setHasLoaded(false);
        
        const fetchEvents = async () => {
        if (loadingPost || loading || latitude == null || longitude == null) return;

        setLoadingPost(true);

        try {
            const url = `${BASE_URL}/request/retrieve/impactevents?latitude=${latitude}&longitude=${longitude}`;
            const response = await fetch(url, {
            method: 'GET',
            headers: {
                "X-App-Secret": "smartboyakriti",
                "X-App-Environment": "dev"
            }
            });

            if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server ${response.status}: ${text || 'Unknown'}`);
            }

            const json = await response.json();

            if (isCurrent) {
            setData(Array.isArray(json) ? json : (json.data || []));
            setHasLoaded(true);
            }
        } catch (err) {
            let msg = 'Failed to load events';
            try {
            const jsonPart = err.message.split(": ")[1];
            const parsed = JSON.parse(jsonPart);
            msg = parsed.message || msg;
            } catch {
            msg = err.message;
            }
           if (isCurrent) {
                setError(msg);
                setHasLoaded(true); // ← Still mark as loaded (error case)
            }
        } finally {
            if (isCurrent) setLoadingPost(false);
        }
        };

        fetchEvents();

        return () => {
        isCurrent = false;
        };
    }, [latitude, longitude, loading])
    );

    if (errMsg) {
        return (
            <Text style={{fontSize:24, fontWeight:'bold', textAlign:'center', marginTop:'50%'}}>{errMsg}</Text>
        )
    }
    return (
        <View style={[styles.container , {paddingTop: insets.top}]}> 
            
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

                {loading || loadingPost ? (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/loading.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10,fontSize: 18 }}>Loading events...</Text>
                    </View>
                ): error || errMsg ? (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <Text style={{ marginTop: 10 }}>{error || errMsg}</Text>
                    </View>
                ):!hasLoaded ? (
                    <View /> // prevent flash
                ) :data.length === 0? (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/nothing-available.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10,fontSize: 18 }}>No events nearby.</Text>
                    </View>
                ) : (data.map((info) => {
                    
                    const images = Array.isArray(info.media) ? info.media.slice(0, 4) : [];
                    
                return(
                    
                    <View style={styles.postContainer} key={info.postUuid}>

                        <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                            <Image
                                source={img}
                                style={styles.pfp}
                            />
                            <View style={{ marginLeft:8}}>
                                <Text style={{ fontWeight: 500, fontSize: 18 }}>{info.name}</Text>
                                <Text style={{ fontSize:14, color:'#5F6368'}}>{convertUTCtoIST(info.createdAt)}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize:16, fontWeight:800, marginBottom:4}}>
                                {info.title}
                            </Text>
                            <Text style={{fontSize:16, color:"#323232"}}>
                                {info.description}
                            </Text>

                            <Text style={{fontSize:16, color:"#323232"}}>
                                <Text style={{fontWeight:'bold'}}>Happening on:</Text> {convertUTCtoIST(info.eventAt)}
                            </Text>
                            

                            {images.length > 0 && (<View style={styles.postImgContent}>
                                                            
                                {/* 1 Image */}
                                {images.length === 1 && (
                                    <Image
                                    source={{ uri: images[0] }}
                                    style={{ width: "100%", height: 250, borderRadius: 8,borderWidth: 1, borderColor: "#ccc", }}
                                    />
                                )}

                                {/* 2 Images */}
                                {images.length === 2 && (
                                    <View style={{ flexDirection: "row", gap: 8 }}>
                                    {images.map((img, i) => (
                                        <Image
                                        key={i}
                                        source={{ uri: img }}
                                        style={{ width: "48%", height: 200, borderRadius: 8,borderWidth: 1,
                                        borderColor: "#ccc" }}
                                        />
                                    ))}
                                    </View>
                                )}

                                {/* 3 Images */}
                                {images.length === 3 && (
                                    <View style={{ flexDirection: "row", gap: 8 }}>
                                    <Image source={{ uri: images[0] }} style={{ width: "60%", height: 250, borderRadius: 8,borderWidth: 1,
                                    borderColor: "#ccc", }} />

                                    <View style={{ flex: 1, gap: 8 }}>
                                        <Image source={{ uri: images[1] }} style={{ height: 120, borderRadius: 8,borderWidth: 1,
                                        borderColor: "#ccc", }} />
                                        <Image source={{ uri: images[2] }} style={{ height: 120, borderRadius: 8,borderWidth: 1,
                                        borderColor: "#ccc", }} />
                                    </View>
                                    </View>
                                )}

                                {/* 4 Images */}
                                {images.length === 4 && (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                    {images.map((img, i) => (
                                        <Image
                                        key={i}
                                        source={{ uri: img }}
                                        style={{
                                            width: "48%",
                                            height: 160,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: "#ccc"}}
                                        />
                                    ))}
                                    </View>
                                )}
                                                            
                                                                
                            </View>)}
                            
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    provider={Platform.OS === 'android' ? 'google':null }
                                    initialRegion={{
                                        latitude:latitude,
                                        longitude: longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}     
                                    showsUserLocation={true} // ✅ Blue Google-dot style
                                    followsUserLocation={true} // ✅ Camera follows user
                                    
                                >

                                    <Marker
                                        coordinate={{
                                            latitude: latitude,
                                            longitude: longitude
                                        }}
                                        title="You are here"
                                        pinColor="blue" // default red GPS marker
                                    />

                                    {info?.latitude && info.longitude && (
                                        <Marker
                                            coordinate={{
                                                latitude: info.latitude,
                                                longitude:info.longitude
                                            }}
                                            title="Event location"
                                            pinColor="red"
                                        />
                                    )}
                                    
                                </MapView>
                            </View>
                        </View>

                    </View>

                )}))}
            </ScrollView>
            
        </View>
    )

}

export default ImpactEvents

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC"
    },
    heading: {
        fontSize: 24,
        fontWeight: 700,
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
        fontWeight:600
    },
    pfp: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E3EFFF'
    },
    mapContainer: {
        flex: 1,
        marginTop:20
    },
    postImgContent: {
        // flex: 1,
        marginTop:10
    },
    image: {
        flex: 1,
        height:400
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