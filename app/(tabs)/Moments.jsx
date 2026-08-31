import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import LottieView from "lottie-react-native";
import { useCallback, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from "react-native-image-viewing";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommentSheet } from "../../utils/components/CommentSheet";
import { BASE_URL } from "../../utils/constants/api";
import useLocation from "../../utils/hooks/useLocation";

const Moments = () => {
    const insets = useSafeAreaInsets();
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);

    // FULLSCREEN IMAGE VIEWER STATE
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [viewerImages, setViewerImages] = useState([]);  // array of { uri }

    const { latitude, longitude, errMsg, location, loading } = useLocation();
    const [activePost, setActivePost] = useState(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
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

    const openImageViewer = (imagesArray, index) => {
        const formatted = imagesArray.map(uri => ({ uri }));
        setViewerImages(formatted);
        setViewerIndex(index);
        setViewerVisible(true);
    };

    const handleLike = async(postUuid, status) => {
        try {
           setActivePost(postUuid);       // <<— Only this post should animate
            triggerLikeAnimation();
            
            setData(prev =>
                prev.map(p => p.postUuid === postUuid ?
                    {
                        ...p,
                        interested: !status,
                        interestedCount: status ? p.interestedCount - 1 : p.interestedCount + 1
                    } : p)
            )
            
            const url = `${BASE_URL}/request/${ status ? "uninterested" : "interested"}/${postUuid}`;
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    "X-App-Secret": "smartboyakriti"
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
            const jsonPart = err.message.split(": ")[1];  
            const parsed = JSON.parse(jsonPart);
            const msg = parsed.message; 
            setError(msg);
        } finally {
            setLoadingPost(false)
        }

    }

    const refetchPosts = () => {
        fetchMoments();
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
            const response = await fetch(`${BASE_URL}/coordinates`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Secret": "smartboyakriti"
                },
                body: JSON.stringify(payload),
            });
            const text = await response.text();
            return JSON.parse(text);
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

    const triggerLikeAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 120,
            useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            }),
        ]).start();
    };

    const handleOpenComments = (postInfo) => {
        setSelectedPost(postInfo);
        setShowComments(true);
    }

    
    const updateCommentCount = (postUuid, delta) => {
        setPosts(prev =>
            prev.map(p =>
                p.postUuid === postUuid
                    ? { ...p, commentCount: p.commentCount + delta }
                    : p
            )
        );
    };

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
                                    {info?.profilePhotoUrl ? (<Image
                                        source={{ uri: info.profilePhotoUrl }}
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
                                        <Text style={{ fontSize: 14, color: '#5F6368' }}> {convertUTCtoIST(info.createdAt)}</Text>
                                    </View>
                                </View>
                            
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                                        {info.title}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: "#323232" }}>
                                        {info.description}
                                    </Text>
                                
                                    <View style={styles.postImgContent}>
                                
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
                                                     <TouchableOpacity
                                                        key={i}
                                                        onPress={() => openImageViewer(images, i)}
                                                        style={{width:'48%'}}
                                                    >
                                                        <Image
                                                            source={{ uri: img }}
                                                            style={{
                                                                width: "100%", height: 200, borderRadius: 8, borderWidth: 1,
                                                                borderColor: "#ccc"
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}

                                        {/* 3 Images */}
                                        {images.length === 3 && (
                                            <View style={{ flexDirection: "row", gap: 8 }}>
                                                <TouchableOpacity onPress={() => openImageViewer(images, 0)} style={{width:'60%'}}>
                                                    <Image source={{ uri: images[0] }} style={{
                                                        width: "100%", height: 250, borderRadius: 8, borderWidth: 1,
                                                        borderColor: "#ccc",
                                                    }} />
                                                </TouchableOpacity>

                                                <View style={{ flex: 1, gap: 8 }}>
                                                    <TouchableOpacity onPress={() => openImageViewer(images, 1)} >
                                                        <Image source={{ uri: images[1] }} style={{
                                                        height: 120, borderRadius: 8, borderWidth: 1,
                                                        borderColor: "#ccc",
                                                        }} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => openImageViewer(images, 2)}>
                                                        <Image source={{ uri: images[2] }} style={{
                                                            height: 120, borderRadius: 8, borderWidth: 1,
                                                            borderColor: "#ccc",
                                                        }} />
                                                    </TouchableOpacity> 
                                                </View>
                                            </View>
                                        )}

                                        {/* 4 Images */}
                                        {images.length === 4 && (
                                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                                {images.map((img, i) => (
                                                    <TouchableOpacity
                                                        key={i}
                                                        onPress={() => openImageViewer(images, i)}
                                                        style={{width:'48%'}}
                                                    >
                                                        <Image
                                                            source={{ uri: img }}
                                                            style={{
                                                                width: "100%",
                                                                height: 160,
                                                                borderRadius: 8,
                                                                borderWidth: 1,
                                                                borderColor: "#ccc"
                                                            }}
                                                        />
                                                    </TouchableOpacity>
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
                                    gap:20
                                }}>

                                    <TouchableOpacity
                                        style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
                                        onPress={() => handleOpenComments(info)}
                                    >
                                        <Ionicons name="chatbubble-outline" size={24} color= "#757575" />
                                        
                                        <View style={{marginLeft:8, marginRight:4, flexDirection:'row', gap:4}}>
                                            {info.commentCount > 0 && <Text style={{ color: "#757575" }}>{info.commentCount}</Text>}
                                            <Text style={{ color: "#757575" }}>{info.commentCount > 1 ? "Comments" : "Comment"}</Text>
                                        </View>
                                    </TouchableOpacity>
                               
                                    <TouchableOpacity
                                        onPress={() => handleLike(info.postUuid, info.interested)}
                                        style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        
                                        <Animated.View
                                                style={{ transform: [{ scale:  activePost === info.postUuid ? scaleAnim : 1 }] }}>
                                                <Ionicons name={info.interested ? "heart" : "heart-outline"} size={24} color={info.interested ? "#E30103" : "#757575" } />
                                        </Animated.View>
                                        
                                        <View style={{ marginLeft: 8, marginRight: 4, flexDirection: 'row', gap: 4 }}>

                                            {info.interestedCount > 0 && <Text style={{ color: "#757575" }}>{info.interestedCount}</Text>}
                                            <Text style={{ color: "#757575" }}>{info.interestedCount > 1? "Likes": "Like"}</Text>
                                            
                                        </View>
                                    </TouchableOpacity>
                            
                                </View>
                            </View>
                        )
                    }))
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
            
            <CommentSheet
                visible={showComments}
                post={selectedPost}
                onClose={() => setShowComments(false)}
                userAvatar={data?.profilePhotoUrl}
                refetchPosts={refetchPosts}
            />
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