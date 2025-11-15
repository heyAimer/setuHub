import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useNavigation } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import { CLOUDINARY_API, CLOUDINARY_UPLOAD_PRESET } from "../../cloudinary.js";
import { apiPost } from '../../utils/hooks/useCreatePosts.jsx';

const CreateHangoutAndEventsPost = () => {
    const insets = useSafeAreaInsets();
    const maxCharsInDesc = 280;
    const maxCharsInTitle = 50;
    const navigation = useNavigation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleHeight, setTitleHeight] = useState(40);
    const [descriptionHeight, setDescriptionHeight] = useState(40);

    //date time picker 
    const [eventAt, setEventAt] = useState(null);
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    
    //location picker
    const [locationDetails, setLocationDetails] = useState(null);
    const [region, setRegion] = useState(null);
    const [marker, setMarker] = useState(null);

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [image, setImage] = useState([]);
    const [uploading, setUploading] = useState(false);

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

    const openMap = async () => {
        try {
            //ask permission location
            setLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied!");
                return;
            }

            // get current user location to center map
            const loc = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.0015,
                longitudeDelta: 0.0015,
            })
            setShowMap(true);
            setLoading(false);
        } catch (err) {
            console.error("Error opening map:", err);
            setLoading(false);
        }

    };

    const handleSelectLocation = async(e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLatitude(latitude);
        setLongitude(longitude);
        setMarker({ latitude, longitude });

        try {
            const [address] = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });
            setLocationDetails([address]);
        } catch (err) {
            console.error("Error fetching address: ", err);
        }

    }

    const handleConfirm = async() => { 
        
        if (!marker) {
            alert("Please tap on the map to select the location of the event!");
            return;
        }
        //api run send data to backend!

        const payload = {
            title: title,
            description: description,
            latitude: Number(latitude),
            longitude: Number(longitude),
            eventAt: eventAt.toISOString(),
            location: locationDetails,
            media: image
        }

        try {
            const data = await apiPost("/request/create/impactevents", payload);
            router.push('/ImpactEvents');
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

                <View style={{flexDirection:'row',alignItems:'center', marginBottom:10}}>
                    <Image
                        source={img}
                        style={styles.pfp}
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
                            style={[styles.input, {height:Math.max(150, descriptionHeight)}, { marginBottom: 20 }]}
                            maxLength={maxCharsInDesc}
                        />

                        <Text style={{color:'#ABABAC', marginTop:12}}>{description.length}/{maxCharsInDesc}</Text>
                    </View>
                    
                    <Text style={styles.inputsHeading}>Event at</Text>

                    <TouchableOpacity onPress={() => setShowDate(true)}>
                        <Text
                            // style={{
                            // fontSize: 16,
                            // marginTop: 8,
                            // marginBottom: 10,
                            // color: eventAt ? "#000":"#ABABAC"
                            // }}

                            style={[styles.input, { marginBottom: 20,marginTop:10, paddingBottom:10 },{color: eventAt ? "#000":"#ABABAC"}]}
                            
                        >
                            {/* {eventAt.toLocaleString()}  RFC3339 */}
                            {eventAt ? eventAt.toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle:"short"
                            })
                                :
                        "Select date & time "}
                        </Text>
                    </TouchableOpacity>

                    {showDate  && (
                        <DateTimePicker
                            value={eventAt || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                            setShowDate(false);
                            if (event.type === "set") {
                                const current = new Date(eventAt);
                                current.setFullYear(selectedDate.getFullYear());
                                current.setMonth(selectedDate.getMonth());
                                current.setDate(selectedDate.getDate());
                                setEventAt(current);
                                setShowTime(true); // open time after date picked
                            }
                            }}
                            
                        />
                    )}

                    {showTime && (
                        <DateTimePicker
                            value={eventAt || new Date()}
                            mode="time"
                            display="default"
                            is24Hour={false} 
                            onChange={(event, selectedTime) => {
                            setShowTime(false);
                            if (event.type === "set" && selectedTime) {
                                const current = new Date(eventAt);
                                current.setHours(selectedTime.getHours());
                                current.setMinutes(selectedTime.getMinutes());
                                current.setSeconds(0); 
                                setEventAt(current);
                            }
                            }}
                        />
                    )}

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
                        
                        {uploading && <ActivityIndicator size="small" style={{ marginVertical: 10 }} />}
                                            
                    </View>
                    
                    <Text style={styles.inputsHeading}>Set Location</Text>
                    {!showMap ?
                        (
                            loading ? (

                                <View style={styles.loadingBtn}>
                                    <ActivityIndicator size="large" color="#9ECAE8" />
                                    <Text>Loading map...</Text>
                                </View>
                                
                            ): (   
                                <TouchableOpacity style={styles.openMapBtn} onPress={openMap}>
                                    <Ionicons
                                        name='location-outline'
                                        size={22}
                                        style={{ color: "#1976D2"}}
                                    />
                                    
                                    <Text style={{color:"#1976D2", fontSize:16}}>Select Location on Map</Text>
                        
                                </TouchableOpacity>
                            )

                        ):(
                            <View style={styles.mapContainer}>
                                {region &&
                                    (
                                    <MapView
                                        style={{ flex: 1 }}
                                        region={region}
                                        onPress={handleSelectLocation}
                                        showsUserLocation={true}
                                    >

                                        {marker && <Marker coordinate={marker}/>}

                                    </MapView>
                                )}

                            </View>
                        )
                    }
                    
                    <View style={styles.bottomRow}>
                        <TouchableOpacity
                        onPress={handleConfirm}
                        disabled={description.trim().length === 0}
                        style={[
                            styles.postBtn,
                            description.trim().length === 0 && { backgroundColor: "#9ECAE8" }, // disabled state
                        ]}
                        >
                            <Text style={{
                                color: "#FFFFFF",
                            }}>Host</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>

            </ScrollView>
        </View>
        
    )
    
}

export default CreateHangoutAndEventsPost

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
    pfp: {
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
        paddingVertical: 20,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: "#DCDCDD",
        width:'100%'
    },
    charCount: {
        textAlign:'center'
    },
    openMapBtn: {
        borderWidth: 1,
        borderColor: "#1976D2",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent:'center',
        marginTop: 10,
        flexDirection: 'row',
        gap:10,
    },
    loadingBtn: {
        borderWidth: 1,
        borderColor: "#9ECAE8",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent:'center',
        marginTop: 10,
        flexDirection: 'row',
        gap:10,
    },
    mapContainer: {
        flex: 1, height: 500, marginTop: 12,
        borderWidth: 1,
        borderColor: "#DCDCDD",
        marginBottom:24
        
    },
    postBtn: {
        backgroundColor: "#1976D2",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        color: "#FFFFFF",
        fontWeight:600
    },

})