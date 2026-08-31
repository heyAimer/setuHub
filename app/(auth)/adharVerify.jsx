import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { validationSchema } from "../../utils/authSchema";
import { BASE_URL } from "../../utils/constants/api";
import { getFcmToken } from "../../utils/notifications";

const AdharVerify = () => {
    const options = ['Male', 'Female', 'Others'];

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const selectOption = (value) => {
        setSelectedValue(value);
        setIsOpen(false); // Close after selection
    };

    const HandleSignIn = async (values, { resetForm }) => {
        const dobFormatted = values.age.replace(/\s*-\s*/g, "-");
        try {
            setLoading("true");
            const response = await fetch(`${BASE_URL}/authenticate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti",
                    },
                    body: JSON.stringify({
                        aadhar: values.adhar,
                        name: values.name,
                        phone: values.phone,
                        gender: selectedValue,
                        address: values.address,
                        dateOfBirth:dobFormatted
                    }),
                }
            );
            
            const data = await response.json();

            if (response.ok) {

                Toast.show({
                    type: "success",
                    text1: data.message
                });
                router.dismissAll();
                router.replace("/Moments");
                resetForm();
                const fcmToken = await getFcmToken();
                
                if (fcmToken) {
                    const tokenResponse = await fetch(
                        `${BASE_URL}/set/token`,
                        {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                                "X-App-Secret": "smartboyakriti",
                            },
                            body: JSON.stringify({
                                firebaseToken: fcmToken
                            })
                        }
                    );
                    if (tokenResponse.ok) {
                        const data = await tokenResponse.json();
                    }
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1:data.message
                })
            }
        } catch (error) {
            console.error("Error during adhar verification: ", error);
            Toast.show({
                type: "error",
                text1:"⚠️Something went wrong!"
            })
        } finally {
            setLoading(false);
        }

    }
    
    return (
        <KeyboardAvoidingView
            style={styles.container} behavior={Platform.OS=== "ios"?"padding":"height"}>
            <TouchableOpacity
                style={{paddingHorizontal:16,paddingVertical:6, marginTop:50, backgroundColor:'#F8FAFC'}}
                onPress={() => router.push("/signUp")}>
                    <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                
                <View style={styles.container2}>

                    <Text style={{alignSelf:'center', fontSize:30, fontWeight:500}}>Let’s Verify Your Aadhaar</Text>
                    <View style = {styles.fieldsContainer}>
                        <Formik
                        initialValues={{adhar:"", name: "", phone: "", gender: "", address:"", age:"" }}
                        validationSchema={validationSchema}
                        onSubmit={HandleSignIn}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue  }) => (

                                <View>
                                    <Text style={{ marginBottom: 4, fontWeight: 500 }}>Adharcard Number</Text>
                                    
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="fingerprint" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                        
                                            style={styles.inputField}
                                            placeholder="Enter your adharcard number"
                                            placeholderTextColor=
                                            "#828181"
                                            onChangeText={handleChange("adhar")}
                                            value={values.adhar}
                                            onBlur={handleBlur("adhar")}
                                        />
                                    </View>

                                    {touched.adhar && errors.adhar && <Text style={styles.error}>{errors.adhar}</Text>} 

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 500 }}>Your Name</Text>
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="person" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                    <TextInput
                                        style={styles.inputField}
                                        placeholder="Enter your name"
                                        onChangeText={handleChange("name")}
                                        value={values.name}
                                        onBlur={handleBlur("name")}
                                        placeholderTextColor="#828181"
                                    />
                                    

                                    </View>

                                    {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 500 }}>Phone Number</Text>
                                    
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="call" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            placeholderTextColor=
                                            "#828181"
                                            placeholder="Enter your number"
                                            onChangeText={handleChange("phone")}
                                            value={values.phone}
                                            onBlur={handleBlur("phone")}
                                            keyboardType="numeric"
                                        />
                                    
                                    </View>

                                    {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 500 }}>Gender</Text>
                                
                                    <View style={{
                                        backgroundColor: "#FEFEFE"
                                    }}>
                                    
                                        <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}>
                                            
                                            <View style={{flexDirection:'row'}}>
                                                <MaterialIcons name="wc" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
                                                <Text style={{color: selectedValue ? '#000' : '#828181'}}>
                                                    {selectedValue ? ` ${selectedValue}` : 'Select gender'}
                                                </Text>
                                            </View>

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

                                    {touched.gender && errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, marginTop:20, fontWeight: 500 }}>Your Address</Text>
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="location-on" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="Enter your address"
                                            onChangeText={handleChange("address")}
                                            value={values.address}
                                            placeholderTextColor="#828181"
                                            onBlur={handleBlur("address")}
                                        />
                                    

                                    </View>

                                    {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}
                                    
                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 500 }}>D.O.B</Text>
                                    
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="event" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="DD - MM - YYYY"
                                            keyboardType="numeric"
                                            maxLength={16}
                                            value={values.age}
                                            placeholderTextColor="#828181"
                                            onChangeText={(text) => {
                                                // remove everything except numbers
                                                let cleaned = text.replace(/[^0-9]/g, "");

                                                // auto insert " - "
                                                if (cleaned.length > 2 && cleaned.length <= 4) {
                                                    cleaned = cleaned.slice(0, 2) + " - " + cleaned.slice(2);
                                                } else if (cleaned.length > 4) {
                                                    cleaned = cleaned.slice(0, 2) + " - " + cleaned.slice(2, 4) + " - " + cleaned.slice(4, 8);
                                                }

                                                setFieldValue("age", cleaned);
                                            }}
                                        />
                                    
                                        
                                    </View>

                                    {touched.age && errors.age && <Text style={styles.error}>{errors.age}</Text>}

                                    <TouchableOpacity onPress={handleSubmit}>
                                    <Text style={styles.signUpText}>{loading? "Verifying...":"Verify"}</Text>
                                    </TouchableOpacity>
                                
                                </View>
                                
                            )}

                        </Formik>
                    </View>  
                    
                </View>
            </ScrollView>
            
        </KeyboardAvoidingView>
        
  )
}

export default AdharVerify;

const styles = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
    },
    container2: {
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 20,
        gap:100
    },
    inputField: {
        color: 'black',
        width: '95%',
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#D1D5DB",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: "#FEFEFE",
        marginBottom: 10,
        color:'black'

    },
    fieldsContainer: {
        width:'100%'
    },
    error: {
        color: "#E61522",
    },
    signUpText: {
        backgroundColor: "#1976D2", // blue
        fontSize: 18,
        fontWeight: 500,
        color: "#FFFFFF",           // white text
        paddingVertical: 12,
        borderRadius: 8,
        textAlign: "center",
        marginTop: 16,
    },
    signInText: {
        color: "#1976D2",
        textDecorationLine: "underline",
        fontWeight: 500,
    
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical:10,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 4,
    },
    dropdownList: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#D1D5DB",  
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