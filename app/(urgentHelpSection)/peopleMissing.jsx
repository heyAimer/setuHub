import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from 'expo-image';
import { router, useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from "react-native-image-viewing";
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_URL } from "../../utils/constants/api";
import useLocation from '../../utils/hooks/useLocation';

const PeopleMissing = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { latitude, longitude, errMsg, location, loading } = useLocation();

    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [helpers, setHelpers] = useState([]);

    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [viewerImages, setViewerImages] = useState([]); 

    const openImageViewer = (imagesArray, index) => {
        const formatted = imagesArray.map(uri => ({ uri }));
        setViewerImages(formatted);
        setViewerIndex(index);
        setViewerVisible(true);
    };

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
            
            if (loading || latitude == null || longitude == null) {
                return;
            }
            
            const fetchHelpNearby = async () => {
                try {
                    const url = `${BASE_URL}/request/retrieve/missingpeople?latitude=${latitude}&longitude=${longitude}`;

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
                    if (cancelled) setError(msg);
                } finally {
                    if (cancelled) setLoadingPost(false)
                }
            }
            fetchHelpNearby();

            return () => {
                cancelled = false
            }
        }, [latitude, longitude, loading, errMsg])
    );

    return (
        <View style={[styles.container , {paddingTop: insets.top}]}> 
            <View style={styles.topBar}>

                <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.heading}>Missing Alerts</Text>

            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.createPostHeading}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Find. Report. Reunite.✨
                    </Text>
                    <TouchableOpacity
                        style={styles.createPostbtn}
                        onPress={() => router.push('/createPeopleMissingPost')}
                    >
                        <Ionicons
                            name="add-circle-outline" size={22} color={'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 500 }}>Find
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
                        <Text style={{ marginTop: 10 ,fontSize: 18}}>Loading Posts...</Text>
                    </View>
                
                ) : error ? (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <Text style={{ marginTop: 10,fontSize: 18, fontWeight:500 }}>Something went wrong!</Text>
                    </View>
            
                ) : helpers.length === 0 ? (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/nothing-available.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10,fontSize: 18 }}>No posts available</Text>
                    </View>
            
                ): (helpers.map((info) => {
                    const images = info?.media?.slice(0, 4) || [];

                    return (
                        <View key={info.postUuid} style={styles.postContainer}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
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
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={{ fontWeight: 500, fontSize: 18 }}>{info.name}</Text>
                                    <Text style={{ fontSize: 14, color: '#5F6368' }}>{convertUTCtoIST(info.createdAt)}</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                                    {info.title}
                                </Text>

                                <Text style={{ fontSize: 15 }}>
                                    {info.description}
                                </Text>

                                <View style={{flexDirection:'row'}}>
                                    <Text style={{fontWeight: 500,fontSize:15}}>Phone number : </Text>
                                    <Text style={{fontSize:15, color: '#000'}}>
                                        {info.phone}
                                    </Text>
                                </View>
                                
                                <View style={{flexDirection:'row', gap:10}}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 500, fontSize: 15 }}>Age : </Text>
                                        <Text style={{ fontSize: 15}}>
                                            {info.age} years old,
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 500, fontSize: 15 }}>Gender : </Text>
                                        <Text style={{ fontSize: 15}}>
                                            {info.gender}
                                        </Text>
                                    </View>
                                 </View>
                                
                                <View style={{marginTop:10}}>
                                
                                    {/* 1 Image */}
                                    {images.length === 1 && (
                                        <TouchableOpacity onPress={() => openImageViewer(images, 0)}>
                                            <Image
                                                source={{ uri: images[0] }}
                                                style={{ width: "100%", height: 250, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", }}
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {/* 2 Images */}
                                    {images.length === 2 && (
                                        <View style={{ flexDirection: "row", gap: 8 }}>
                                            {images.map((img, i) => (
                                                <Image
                                                    key={i}
                                                    source={{ uri: img }}
                                                    style={{
                                                        width: "48%", height: 200, borderRadius: 8, borderWidth: 1,
                                                        borderColor: "#ccc"
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    )}

                                    {/* 3 Images */}
                                    {images.length === 3 && (
                                        <View style={{ flexDirection: "row", gap: 8 }}>
                                            <Image source={{ uri: images[0] }} style={{
                                                width: "60%", height: 250, borderRadius: 8, borderWidth: 1,
                                                borderColor: "#ccc",
                                            }} />

                                            <View style={{ flex: 1, gap: 8 }}>
                                                <Image source={{ uri: images[1] }} style={{
                                                    height: 120, borderRadius: 8, borderWidth: 1,
                                                    borderColor: "#ccc",
                                                }} />
                                                <Image source={{ uri: images[2] }} style={{
                                                    height: 120, borderRadius: 8, borderWidth: 1,
                                                    borderColor: "#ccc",
                                                }} />
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
                                                        borderColor: "#ccc"
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    )}
                                
                                    
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
                                            coordinate={{ latitude: info.latitude, longitude: info.longitude }}
                                            title="Missing alert"
                                            pinColor="blue" // default red GPS marker
                                        />
                                        
                                    </MapView>
                                </View>
                            </View>

                        </View>
                    )}))
                }
                
                <ImageViewing
                    images={viewerImages}
                    imageIndex={viewerIndex}
                    visible={viewerVisible}
                    onRequestClose={() => setViewerVisible(false)}
                    onClose={() => setViewerVisible(false)}
                    doubleTapToZoomEnabled={true}
                />
                
            </ScrollView>
            
        </View>
    )
}

export default PeopleMissing

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
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
        gap: 10,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 500,
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
        height:400
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