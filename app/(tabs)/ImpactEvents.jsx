import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import useLocation from '../../utils/hooks/useLocation';

//Hangouts & Events

const ENDPOINT = 'https://hackathon-connect-app-backend.onrender.com/request/retrieve/impactevents';

const ImpactEvents = () => {
    const { latitude, longitude, errMsg, location, loading } = useLocation();
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

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

    const fetchEvents = async () => {
        if (loading) return;
        if (latitude == null || longitude == null) return;

        setLoadingPost(true);
        setError(null);

        try {
            const url = `${ENDPOINT}?latitude=${latitude}&longitude=${longitude}`;

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

            const data = await response.json();
            setData(data.data || []);
            setError(null);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingPost(false)
        }
    }
    
    useFocusEffect(
        
        useCallback(() => {
            fetchEvents()
        }, [latitude, longitude,loading])
    );

    if (errMsg) {
        return (
            <Text style={{fontSize:24, fontWeight:'bold', textAlign:'center', marginTop:'50%'}}>{errMsg}</Text>
        )
    }
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

                {loading || loadingPost ? (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#007bff" />
                        <Text style={{ marginTop: 10 }}>Loading events...</Text>
                    </View>
                ): error? (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <Text style={{ marginTop: 10 }}>Error: {error}</Text>
                    </View>
                ): data.length === 0? (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <Text style={{ marginTop: 10 }}>No impact events nearby.</Text>
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
})