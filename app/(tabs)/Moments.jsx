import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import { BASE_URL } from "../../utils/constants/api";
import useLocation from "../../utils/hooks/useLocation";

const Moments = () => {
    const insets = useSafeAreaInsets();
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const { latitude, longitude, errMsg, location, loading } = useLocation();

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

    const handleLike = async(postUuid, status) => {
        try {
           
            setData(prev =>
                prev.map(p => p.postUuid === postUuid ?
                    {
                        ...p,
                        interested: !status,
                        interestedCount: status ? p.interestedCount - 1 : p.interestedCount + 1
                    } : p)
            )
            
            const url = `https://hackathon-connect-app-backend.onrender.com/request/${ status ? "uninterested" : "interested"}/${postUuid}`;
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    "X-App-Secret": "smartboyakriti",
                    "X-App-Environment":"prod"
                }
            });
            if (!response.ok) {
                console.error("like/unlike failed", response.status);
                fetchMoments();
            }
            

        } catch (err) {
            console.error("Error liking the post: ", err);
            fetchMoments();
        }
    }
    
    const fetchMoments = async () => {
        
        if (loadingPost) return;
        if (errMsg) {
            setError('Location error: ' + errMsg)
        }
        if (latitude == null || longitude == null) return;

        setLoadingPost(true);
        setError(null);
        
        try {
            const response = await fetch(`${BASE_URL}/request/retrieve/moments?latitude=${latitude}&longitude=${longitude}`, {
                method: 'GET',
                headers: {
                    "X-App-Secret": "smartboyakriti",
                    "X-App-Environment":"prod"
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
            const jsonPart = err.message.split(": ")[1];  
            const parsed = JSON.parse(jsonPart);
            const msg = parsed.message; 
            setError(msg);
        } finally {
            setLoadingPost(false)
        }

    }

    const fetchCoordinates = async () => {
        if (!latitude || !longitude) {
            return;
        }
        const payload = {
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
        try {
            await fetch(`${BASE_URL}/coordinates`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Secret": "smartboyakriti",
                    "X-App-Environment":"prod"
                },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("API POST Error:", error?.message);
            throw error;
        }
        
    }
    useFocusEffect(
        useCallback(() => {
            fetchMoments();
            fetchCoordinates();
        },[])
    )
    
    return (
        <View style={[styles.container , {paddingTop: insets.top}]}> 
            
            <Text style={styles.heading}>Moments</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.createPostHeading}>
                    
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Drop a good vibe ✨
                    </Text>
                    
                    <TouchableOpacity
                        style={styles.createPostbtn}
                        onPress={() => router.push('/createMomentsPost')}
                    >
                        <Ionicons
                            name="add-circle-outline" size={22} color={'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 500 }}>Post
                        </Text>
                    </TouchableOpacity>

                </View>
                
                {loadingPost ? (
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
                            <Text style={{ marginTop: 10, fontSize: 18 }}>{error}</Text>
                    </View>
            
                ) : data.length === 0 ? (
                    <View style={{ marginTop: '30%', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../assets/images/nothing-available.json')}
                            autoPlay
                            loop
                            style={styles.animation}
                        />
                        <Text style={{ marginTop: 10, fontSize: 18 }}>No posts available.</Text>
                    </View>
            
                ) : (
                    data.map((info) => {
                        const images = info?.media?.slice(0, 4) || [];

                        return (
                            <View style={styles.postContainer} key={info.postUuid}>
                            

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Image
                                        source={img}
                                        style={styles.pfp}
                                    />
                                    <View style={{ marginLeft: 8 }}>
                                        <Text style={{ fontWeight: 500, fontSize: 18 }}>{info.name}</Text>
                                        <Text style={{ fontSize: 14, color: '#5F6368' }}> {convertUTCtoIST(info.createdAt)}</Text>
                                    </View>
                                </View>
                            
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                                        {info.title}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: "#323232" }}>
                                        {info.description}
                                    </Text>
                                
                                    <View style={styles.postImgContent}>
                                
                                        {/* 1 Image */}
                                        {images.length === 1 && (
                                            <Image
                                                source={{ uri: images[0] }}
                                                style={{ width: "100%", height: 250, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", }}
                                            />
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
                                    {/* resolved already */}
                                </View>
                            
                                <View style={{
                                    flexDirection: "row",
                                    gap: 40,
                                    marginTop: 20,
                                    paddingHorizontal: 4,
                                    justifyContent: 'flex-end'
                                }}>
                               
                                    <TouchableOpacity
                                        onPress={() => handleLike(info.postUuid, info.interested)}
                                        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <Ionicons name="heart-outline" size={24} color="#ccc" />
                                        {info.interestedCount > 0 && <Text style={{ color: "#B0B0B0" }}>{info.interestedCount}</Text>}
                                    </TouchableOpacity>
                            
                                </View>
                            </View>
                        )
                    }))
                }
            </ScrollView>
            
        </View>
    )
}

export default Moments

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
    postImgContent: {
        // flex: 1,
        marginTop:10
    },
    image: {
        flex: 1,
        height:400
    },
    animation: {
        width: 300,
        height: 300,
    },
})