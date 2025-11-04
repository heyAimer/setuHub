import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import img from '../../assets/images/pfp2.jpg';
import useLocation from '../../utils/hooks/useLocation';


const CreateHangoutAndEventsPost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleHeight, setTitleHeight] = useState(40);
    const [descriptionHeight, setDescriptionHeight] = useState(40);

    const [eventAt, setEventAt] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    
    const { latitude, longitude } = useLocation();

    const maxCharsInDesc = 280;
    const maxCharsInTitle = 50;

    const navigation = useNavigation();
    const handlePost = () => {
        console.log("Posted: ", title);
        setText(""); // clear input after posting
    };

//     const payload = {
//   title,
//   description,
//   latitude,
//   longitude,
//   eventAt: eventAt.toISOString()   // ✅ RFC3339 format
// };

    return (
        <SafeAreaView style={styles.container}>
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

                    <Text style={styles.inputsHeading}>Event at</Text>

                    <TouchableOpacity onPress={() => setShowDate(true)}>
                        <Text style={styles.input}>
                            {eventAt.toLocaleString()}  {/* RFC3339 */}
                        </Text>
                    </TouchableOpacity>

                    {showDate  && (
                        <DateTimePicker
                            value={eventAt}
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
                            value={eventAt}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                            setShowTime(false);
                            if (event.type === "set") {
                                const current = new Date(eventAt);
                                current.setHours(selectedTime.getHours());
                                current.setMinutes(selectedTime.getMinutes());
                                setEventAt(current);
                            }
                            }}
                        />
                    )}
                    
               
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
                        onPress={handlePost}
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
        </SafeAreaView>
        
    )
    
}

export default CreateHangoutAndEventsPost

const styles = StyleSheet.create({
      container: {
        flex:1,
        backgroundColor: "#F8FAFC",
        paddingTop:10
    },
    topBar: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        width: '100%',
        paddingBottom: 10,
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

})