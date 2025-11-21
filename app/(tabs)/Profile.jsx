import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import { router, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CLOUDINARY_API, CLOUDINARY_UPLOAD_PRESET } from "../../cloudinary.js";

const ENDPOINT = `https://hackathon-connect-app-backend.onrender.com/profile`;
const ENDPOINTPATCH = `https://hackathon-connect-app-backend.onrender.com/update/photo`
const bars = [
    { id: "name", label: "Name", icon: "person", editable: false },
    { id: "uuid", label: "Username", icon: "alternate-email", editable: false },
    { id: "phone", label: "Phone Number", icon: "call", editable: true },
    { id: "gender", label: "Gender", icon: "wc", editable: false },
    { id: "address", label: "Address", icon: "location-on", editable: false },
    { id: "dateOfBirth", label: "Date of Birth", icon: "cake", editable: false }
];
const Profile = () => {
    const insets = useSafeAreaInsets();
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    
    const pickImage = async () => {
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        });

        if (!result.canceled) uploadToCloudinary(result.assets[0].uri);
    };
    
    const uploadToCloudinary = async (uri) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", {
            uri,
            type: "image/jpeg",
            name: "upload.jpg",
            });
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            const res = await axios.post(CLOUDINARY_API, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = res.data.secure_url;
            setData((prev) => ({
                ...prev,
                profilePhotoUrl: imageUrl,
            }));
            await postToBackend(imageUrl)
        } catch (err) {
            Toast.error({
                type:'error',
                text1:"⚠️Upload failed!"
            });
        } finally {
            setUploading(false);
        }
    };

    const postToBackend = async (imageUrl) => {
         const payload = {
            profilePhotoUrl: imageUrl
        }
         try {
            const response = await fetch(ENDPOINTPATCH, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Secret": "smartboyakriti"
                },
                body: JSON.stringify(payload)
            });
            fetchProfile();
            
        } catch (err) {
            console.error("Error hosting the event: ", err)
        }
    }

    const handleLogout = async () => {
        
        try {
            setLoading(true);
            const response = await fetch(`https://hackathon-connect-app-backend.onrender.com/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Secret": "smartboyakriti"
                },
            });

            await response.text();
            Toast.show({
                type: 'success',
                text1: 'You have been',
                text2: 'Logged out Successfully!'
            })
            router.push("/");
            
        } catch (err) {
            console.error("Error hosting the event: ", err)
        } finally {
            setLoading(false);
        }
    }

    const fetchProfile = async () => {
        
        try {
            setLoadingPost(true);
            
            const response = await fetch(ENDPOINT, {
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

    const removeImage = async () => {
        try {
            setUploading(true);

            // If you saved the photo in backend/server use API to remove it:
            // await fetch(`${BASE_URL}/remove-photo`, { method: "POST", ... })

            // If saved in Firestore:
            // await updateDoc(doc(db, "users", userId), { profilePhotoUrl: "" });

            // Clear locally:
            setData(prev => ({ ...prev, profilePhotoUrl: "" }));

            Toast.show({
                type: "success",
                text1: "Profile photo removed successfully!"
            });

        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Something went wrong",
                text2: "Could not remove photo"
            });
        } finally {
            setUploading(false);
        }
    };

    
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}> 
            {loadingPost? ( 
                <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
                    <ActivityIndicator size="large" />
                    <Text style={{fontSize:24, fontWeight:700}}>Loading...</Text>
                    </View>) : (
                        data && (<View  style={{ flex: 1 }}>
                        <View style={{alignItems:'center',borderBottomColor: '#E0E0E0',borderBottomWidth: 1,paddingVertical:40}}>
                            <View style={styles.imageWrapper}>
                                {uploading ? (
                                    <View style={[styles.profileImage, { 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        backgroundColor: '#f5f5f5' 
                                        }]}>
                                        <ActivityIndicator size="large" color="#999" />
                                    </View>
                                ):
                                    data?.profilePhotoUrl ? (<Image
                                    source={{uri: data?.profilePhotoUrl} }
                                    style={styles.profileImage}
                                />) : (
                                    <LottieView
                                        source={require('../../assets/images/profilePic1.json')}
                                        autoPlay
                                        loop
                                        style={styles.animation}
                                    />
                                )}
                                <TouchableOpacity
                                    style={styles.editImg}
                                    onPress={() => {
                                        Alert.alert(
                                            "Your Profile",
                                            "Choose an option",
                                            [
                                                { text: "Gallery", onPress: pickImage },
                                                { text: "Cancel", style: "cancel" },
                                                // {text:"Remove Photo", onPress: removeImage}
                                            ]
                                        )
                                    }}
                                >
                                    <MaterialIcons name='edit' size={18} color='#868686'/>
                                </TouchableOpacity>
                            </View>

                            <View style={{alignItems:'center', marginTop:14}}>
                                <Text style={{ fontWeight: 500, fontSize: 18 }}>{data.name}</Text>
                                <Text style={{fontSize: 16, color: '#5F6368'}}>{data.uuid}</Text>
                            </View>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                            <View style={{gap:22}}>
                                {bars.map((bar) => (
                                    <View style={styles.bars} key={bar.id}>
                                        <MaterialIcons name={bar.icon} size={20} color="#B9B9BA" style={{ marginRight: 20 }} />
                                        <View style={{flexDirection:'row',width:'85%'}}>
                                            <Text style={styles.barTitle}>{bar.label} : </Text>
                                            <Text style={styles.barInfo}>{data[bar.id]}</Text>
                                        </View>
                                        {bar.editable && <TouchableOpacity style={styles.editInfo}>
                                            <MaterialIcons name='edit' size={18} color='#B9B9BA'/>
                                        </TouchableOpacity>}
                                    </View>
                                ))}
                            </View>
                            
                            <View  style={{marginTop:22}}>

                                <TouchableOpacity style={styles.bars} onPress={() => router.push("/historyPage")}>
                                    <MaterialIcons name='history' size={20} color="#B9B9BA" style={{ marginRight: 20 }} />
                                    <View style={{flexDirection:'row',width:'85%', alignItems:'center', justifyContent:'space-between'}}>
                                        <Text style={styles.barTitle}> Your History </Text>
                                        <MaterialIcons
                                            name="arrow-forward-ios"
                                            size={18} color="black"
                                            onPress={() => navigation.goBack()}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                            </View>
                            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                                <MaterialIcons name="logout" size={22} color="white" />
                                <Text style={{ fontWeight:600, fontSize:14, color:'white'}}>LOGOUT</Text>
                            </TouchableOpacity>
                            
                        </ScrollView>
                    </View>)
                )
            }
           
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
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
        paddingTop:20,
        paddingHorizontal: 20,
    },
    imageWrapper: {
        position: "relative",
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#fff",
        borderRadius: 6,
        padding:1
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#fff",
    },
    editImg: {
        position: "absolute",
        bottom: -6,
        right: -6,
        backgroundColor: "#F8FAFC",
        borderRadius: 6,
        padding: 5,
        borderWidth: 2,
        borderColor: "#fff",
    },
    editInfo: {
        backgroundColor: "#F8FAFC",
    },
    bars: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderRadius: 6,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
        
    },
    barTitle: {
        fontSize: 15,
        fontWeight:500
    },
    barInfo: {
        fontSize: 15,
        color: '#5F6368',
        width:'70%'
    },
    logoutBtn: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        gap:10,
        borderWidth: 1,
        borderColor:'#A50103',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 6,
        backgroundColor: '#CA0002',
        marginTop:24
    },
    animation: {
        width: 100,
        height: 100,
    },
    
})