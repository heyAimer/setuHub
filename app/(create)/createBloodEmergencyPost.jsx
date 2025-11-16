import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import { apiPost } from '../../utils/hooks/useCreatePosts.jsx';
import useLocation from '../../utils/hooks/useLocation';
import Toast from 'react-native-toast-message';

const CreateBloodEmergencyPost = () => {
    const insets = useSafeAreaInsets();

    const options = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleHeight, setTitleHeight] = useState(40);
    const [descriptionHeight, setDescriptionHeight] = useState(40);
    const { latitude, longitude, location } = useLocation();
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const selectOption = (value) => {
        setSelectedValue(value);
        setIsOpen(false); // Close after selection
    };
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
            bloodGroup:selectedValue,
            latitude: Number(latitude),
            longitude: Number(longitude),
            location
        };
        
        try {
            const data = await apiPost("/request/create/bloodemergency", payload);
            router.push('/bloodEmergency');
            return data;
        } catch (error) {
            console.log("Error in creating  request:", err);
            Toast.error({
                type: 'error',
                text1: '⚠️Something went wrong!'
            })
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

                    <View style={{marginTop:30}}>

                        <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}> 
                            <Text style={styles.dropdownText}>
                                {selectedValue ? `Blood group : ${selectedValue}` : 'Enter blood group'}
                            </Text>
                            
                            <MaterialIcons
                                name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                size={24}
                                color="#555"
                            />

                        </TouchableOpacity>
                        
                        {isOpen && (
                        <View style={styles.dropdownList}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                            key={option}
                            style={[styles.dropdownItem,
                            index === options.length - 1 && styles.dropdownItemNoBorder,]}
                            onPress={() => selectOption(option)}
                            >
                            <Text style={styles.dropdownItemText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                        )}
                        
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
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#DCDCDD',
        borderRadius: 8,
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