import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import { router, useNavigation } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import { CLOUDINARY_API, CLOUDINARY_UPLOAD_PRESET } from "../../cloudinary.js";
import { apiPost } from '../../utils/hooks/useCreatePosts.jsx';
import useLocation from '../../utils/hooks/useLocation';

const CreateBloodEmergencyPost = () => {
    const insets = useSafeAreaInsets();
    const age = Array.from({ length: 120 }, (_, i) => (i + 1).toString());
    
    const gender = ['Male', 'Female', 'Others'];

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleHeight, setTitleHeight] = useState(40);
    const [descriptionHeight, setDescriptionHeight] = useState(40);
    const { latitude, longitude, location } = useLocation();

    const [image, setImage] = useState([]); // img url is here
    const [uploading, setUploading] = useState(false);

    const [isOpenAge, setIsOpenAge] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const [isOpenGender, setIsOpenGender] = useState(false);
    const [selectedValue2, setSelectedValue2] = useState(null);

    const toggleDropdownA = () => {
        setIsOpenAge((prev) => !prev);
    };

    const toggleDropdownG = () => {
        setIsOpenGender((prev) => !prev);
    }

    const selectOption = (value) => {
        setSelectedValue(value);
        setIsOpenAge(false); // Close after selection
    };

    const selectOption2 = (value) => {
        setSelectedValue2(value);
        setIsOpenGender(false); // Close after selection
    };

    const maxCharsInDesc = 280;
    const maxCharsInTitle = 50;

    const navigation = useNavigation();
    
    const pickImage = async () => {
        if (image.length >= 4) {
            Alert.alert("Limit Reached", "You can only upload up to 4 images.");
            return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        });

        if (!result.canceled) uploadToCloudinary(result.assets[0].uri);
    };

    const takePhoto = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) return alert("Camera permission needed!");

        const result = await ImagePicker.launchCameraAsync({
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

            setImage(prev => [...prev, res.data.secure_url]);
        } catch (err) {
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    const sendHelpRequest = async () => {

        if (!latitude || !longitude) {
            return;
        }
        
        const payload = {
            title: title,
            description: description,
            age: selectedValue,
            gender:selectedValue2,
            latitude: Number(latitude),
            longitude: Number(longitude),
            location,
            media: image
        };
        
        try {
            const data = await apiPost("/request/create/missingpeople", payload);
            router.push('/peopleMissing');
            return data;
        } catch (error) {
            console.log("Error in creating missing people request:", err);
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
                    
                <Text style={styles.heading}>Create Request</Text>
                
           </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                    <Image
                        source={img}
                        style={styles.image}
                    />
                    <View style={{ marginLeft:8}}>
                        <Text style={{fontWeight:500, fontSize:20}}>Hi Rudra</Text>
                        <Text style={{ fontSize: 16, color: '#5F6368' }}>@rudra_funboy</Text>
                    </View>
                </View>
                
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
                     <View style={{flexDirection:'row',}}>
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
                        <Text style={{ color: '#ABABAC' , marginTop:12 }}>{description.length}/{maxCharsInDesc}</Text>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{marginTop:30, width: '48%'}}>

                            <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdownA}> 
                                <Text style={styles.dropdownText}>
                                    {selectedValue ? `${selectedValue}` : 'Age'}
                                </Text>
                                
                                <MaterialIcons
                                    name={isOpenAge ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                    size={24}
                                    color="#555"
                                />

                            </TouchableOpacity>
                            
                            {isOpenAge && (
                                <View style={styles.dropdownList}>
                                    <ScrollView
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}
                                    style={styles.dropdownScroll}
                                    >

                                        {age.map((option, index) => (
                                            <TouchableOpacity
                                            key={option}
                                            style={[styles.dropdownItem,
                                            index === age.length - 1 && styles.dropdownItemNoBorder]}
                                            onPress={() => selectOption(option)}
                                            >
                                            <Text style={styles.dropdownItemText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}

                                    </ScrollView>
                                </View>
                            )}
                            
                        </View>

                        <View style={{marginTop:30, width: '48%'}}>

                            <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdownG}>
                                <Text style={styles.dropdownText}>
                                    {selectedValue2 ? `${selectedValue2}` : 'Gender'}
                                </Text>
                                
                                <MaterialIcons
                                    name={isOpenGender ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                    size={24}
                                    color="#555"
                                />

                            </TouchableOpacity>
                            
                            {isOpenGender && (
                                <View style={styles.dropdownList}>
                                    <ScrollView
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}
                                    style={styles.dropdownScroll}
                                    >

                                        {gender.map((option, index) => (
                                            <TouchableOpacity
                                            key={option}
                                            style={[styles.dropdownItem,
                                            index === gender.length - 1 && styles.dropdownItemNoBorder]}
                                            onPress={() => selectOption2(option)}
                                            >
                                            <Text style={styles.dropdownItemText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}

                                    </ScrollView>
                                </View>
                            )}
                            
                        </View>
                        
                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <Text style={styles.inputsHeading}>Add Image</Text>
                        
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                            {image.map((img, index) => (

                                <View key={index} style={{ width: "48%", marginBottom: 20, position: "relative" }}> 
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newImages = image.filter((_, i) => i !== index);
                                            setImage(newImages);
                                        }}

                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            right: 5,
                                            backgroundColor: "#E0E0E0",
                                            width: 22,
                                            height: 22,
                                            borderRadius: 12,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            zIndex: 999,
                                            borderWidth: 1,
                                            borderColor: "#E4080A",
                                        }}
                                    >
                                        <Text style={{ color: "#E4080A", fontSize: 14,fontWeight:'bold' }}>×</Text>
                                    </TouchableOpacity>
                                    
                                    <Image
                                        key={index}
                                        source={{ uri: img }}
                                        style={{
                                            width: "100%", height: 200, borderRadius: 8, marginTop: 4, marginBottom: 20,
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 10}}
                                    />
                                </View>
                            ))}
                        </View>

                        {image.length < 4 &&
                            (<TouchableOpacity
                            style={{
                                height: 150,
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderStyle: "dashed",
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical:10
                            }}

                            onPress={() => {
                                Alert.alert("Upload Image", "Choose an option", [
                                { text: "Camera", onPress: takePhoto },
                                { text: "Gallery", onPress: pickImage },
                                { text: "Cancel", style: "cancel" },
                                ]);
                            }}
                            
                        >
                            <Text style={{ color: "#ABABAC", fontSize: 16, }}>Tap to upload or take photo</Text>

                            </TouchableOpacity>)
                        }
                        
                        {uploading && <ActivityIndicator size="small" style={{ marginTop: 10 }} />}
                        
                    </View>

                    <View style={styles.bottomRow}>

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

export default CreateBloodEmergencyPost

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
        fontWeight: 600,
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
        fontWeight: 600,
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
        fontWeight:600
    },
    dropdownContainer: {
        zIndex: 1000,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical:10,
        borderWidth: 1,
        borderColor: '#DCDCDD',
        borderRadius: 4,
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownList: {
        maxHeight: 202,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#DCDCDD',
        borderRadius: 8,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical:12,
        borderBottomWidth: 1,
        borderBottomColor: '#DCDCDD',
    },
    dropdownItemNoBorder: {
        borderBottomWidth: 0,
    },
    dropdownItemText: {
        fontSize: 14,
    },

})