import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router, useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BASE_URL } from "../../utils/constants/api.js";
import { deletePost } from "../../utils/hooks/useDeletePost.jsx";
import useFetchHistory from "../../utils/hooks/useFetchHistory.jsx";
import useLocation from "../../utils/hooks/useLocation.jsx";

const NearbyHelpHistory = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { latitude, longitude } = useLocation();

    useEffect(() => {
        if (latitude === "" && longitude === "") {
            return;
            }
    }, [latitude, longitude]);

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

    const { data, loading, error, refetch} = useFetchHistory(
        `${BASE_URL}/request/my/helpnearby`
    )

    const handleDelete = async(id) => {
        await deletePost(id);
        refetch();
    }
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.topBar}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                    onPress={() => navigation.goBack()}
                />
                    
                <Text style={styles.heading}>Nearby Support</Text>
                
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                {loading && (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/loading.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10,fontSize: 18 }}>Loading events...</Text>
                    </View>
                )}

                {error && (
                    <View style={{ marginTop: '50%', alignItems: 'center' }}>
                        <Text style={{ marginTop: 10 }}>{error || errMsg}</Text>
                    </View>
                )}
                {!loading && data && data.length === 0 && (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/nothing-available.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10, fontSize: 18 }}>Data not available.</Text>
                        <Text style={{ marginTop: 10, fontSize: 18,textAlign:'center' }}>Ask for support anytime.</Text>
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
                )}

                {!loading && data && data.length > 0 && (
                    data.map((info) => {
                        return(
                    
                            <View style={styles.postContainer} key={info.postUuid}>

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
                                        <Text style={{ fontWeight: 500, fontSize: 18 }}>{info.name}</Text>
                                        <Text style={{ fontSize:14, color:'#5F6368'}}>{convertUTCtoIST(info.createdAt)}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={{fontSize:16, fontWeight:500, marginBottom:4}}>
                                        {info.title}
                                    </Text>
                                    <Text style={{fontSize:16, color:"#323232"}}>
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
                                            provider={Platform.OS === 'android' ? 'google':null }
                                            initialRegion={{
                                                latitude:info.latitude,
                                                longitude: info.longitude,
                                                latitudeDelta: 0.01,
                                                longitudeDelta: 0.01,
                                            }}     
                                            showsUserLocation={true} // ✅ Blue Google-dot style
                                            followsUserLocation={true} // ✅ Camera follows user
                                            
                                        >

                                            {latitude !== "" && longitude !== "" && (
                                                <Marker
                                                    coordinate={{
                                                        latitude: Number(latitude),
                                                        longitude: Number(longitude)
                                                    }}
                                                    title="Help needed here"
                                                    pinColor="blue" 
                                                
                                                />
                                            )}
                                        </MapView>
                                    </View>
                                </View>

                                <View style={{flexDirection:'row', gap:10, alignItems:'center', marginTop:10, alignSelf:'flex-end'}}>
                                    <TouchableOpacity style={[styles.modifybtn, styles.delete]} onPress={() => handleDelete(info.postUuid)}>
                                        <MaterialIcons
                                            name="delete-outline"
                                            size={14} color="#E3EFFF"
                                        />
                                        <Text style={styles.text}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modifybtn, styles.done]}>
                                        <MaterialIcons
                                            name="done-outline"
                                            size={14} color="#E3EFFF"
                                        />
                                        <Text style={styles.text}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                )}
            </ScrollView>
        </View>
    )
}

export default NearbyHelpHistory;

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
        gap: 8,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 500,
    },
    scrollContainer: {
        marginBottom: 60,
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
        backgroundColor: '#1976D2',
        marginTop:14,
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
    pfpWrapper: {
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: 'hidden', // IMPORTANT
        borderWidth: 1,
        borderColor: '#E3EFFF',
    },
    text: {
        fontSize: 14,
        fontWeight: 500,
        color:'#E3EFFF'
    },
    modifybtn: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius:4
    },
    delete: {
        backgroundColor:'#DA0506'
    },
    done: {
        backgroundColor: "#1976D2",
    }
})