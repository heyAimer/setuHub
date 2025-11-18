import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCreateInfo from '../../utils/hooks/useCreateInfo.jsx';
import { apiPost } from '../../utils/hooks/useCreatePosts.jsx';
import useLocation from '../../utils/hooks/useLocation';

const CreateHelpNearbyPost = () => {
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleHeight, setTitleHeight] = useState(40);
    const [descriptionHeight, setDescriptionHeight] = useState(40);
    const { latitude, longitude } = useLocation();
    
    const { user, loading } = useCreateInfo();

    const maxCharsInDesc = 280;
    const maxCharsInTitle = 50;

    const navigation = useNavigation();
    
    const sendHelpRequest = async () => {

        if (!latitude || !longitude) {
            return;
        }
        
        const payload = {
            title: title,
            description: description,
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
        
        try {
            const data = await apiPost("/request/create/helpnearby", payload);
            router.push('/HelpNearby');
            return data;
        } catch (error) {
            console.log("Error in creating  request:", error);
        }
    }

    return (
        <View style={[styles.container , {paddingTop: insets.top}]}>
            <View style={styles.topBar}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                    onPress={() => navigation.goBack()}
                />
                    
                <Text style={styles.heading}>Create Help Request</Text>
                
           </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                {loading && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft:20}}>
                    <ActivityIndicator size="small"/>
                </View>}
                {!loading && user && <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                    {user?.profilePhotoUrl ? (<Image
                        source={user.profilePhotoUrl}
                        style={styles.image}
                    />) : (
                            <View style={styles.pfpWrapper}>
                                <LottieView source={require('../../assets/images/profilePic1.json')}
                                    autoPlay
                                    loop
                                    style={{ width: '100%', height: '100%' }}
                                />   
                            </View>
                        )
                    }
                    <View style={{ marginLeft:8}}>
                        <Text style={{fontWeight:500, fontSize:20}}>{user.name}</Text>
                        <Text style={{ fontSize: 16, color: '#5F6368' }}>{user.uuid}</Text>
                    </View>
                </View>}
                
                <View style={styles.postInputBox}>
                    <Text style={styles.inputsHeading}>Title</Text>
                    <View style={{flexDirection:'row',}}>
                        <TextInput
                            placeholder="Tell others what you need help with"
                            placeholderTextColor="#ABABAC"
                            value={title}
                            onChangeText={setTitle}
                            multiline
                            
                            onContentSizeChange={(e) =>
                            setTitleHeight(e.nativeEvent.contentSize.height)
                            }
                            
                            style={[styles.input, { height: Math.max(40, titleHeight) }, { marginBottom: 20 }]}
                            maxLength={maxCharsInTitle}
                        />

                        <Text style={{ color: '#ABABAC', marginTop:12 }}>{title.length}/{maxCharsInTitle}</Text>
                    </View>
               
                    <Text style={styles.inputsHeading}>Description</Text>
                    <TextInput
                        placeholder="Let people know how they can support you…"
                        placeholderTextColor="#ABABAC"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                         onContentSizeChange={(e) =>
                        setDescriptionHeight(e.nativeEvent.contentSize.height)
                        }
                        style={[styles.input, {height:Math.max(150, descriptionHeight)}]}
                        maxLength={maxCharsInDesc}
                    />

                    <View style={styles.bottomRow}>
                        <Text style={{color:'#ABABAC'}}>{description.length}/{maxCharsInDesc}</Text>

                        <TouchableOpacity
                        onPress={sendHelpRequest}
                        disabled={description.trim().length === 0}
                        style={[
                            styles.postBtn,
                            description.trim().length === 0 && { backgroundColor: "#9ECAE8" }, // disabled state
                        ]}
                        >
                            <Text style={{
                                color: "#FFFFFF",
                            }}>Post</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>

            </ScrollView>
        </View>
        
    )
    
}

export default CreateHelpNearbyPost

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
        paddingHorizontal:20
    },
    heading: {
        fontSize: 24,
        fontWeight: 500,
    },
    scrollContainer: {
        marginBottom: 60,
        paddingHorizontal:20
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E3EFFF',
    },
    inputsHeading: {
        fontSize: 18,
        fontWeight: 500,
        marginBottom:4
    },
    input: {
        fontSize: 16,
        textAlignVertical: "top",
        borderBottomWidth: 1,
        borderBottomColor: "#DCDCDD",
        flex:1,
    },
    postInputBox: {
        paddingHorizontal: 12,
        paddingVertical:5,
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
    pfpWrapper: {
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: 'hidden', // IMPORTANT
        borderWidth: 1,
        borderColor: '#E3EFFF',
    }

})