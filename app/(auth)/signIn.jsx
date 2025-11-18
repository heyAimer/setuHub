import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { Formik } from 'formik';
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from "react-native-toast-message";
import { signInValidationSchema } from "../../utils/authSchema";
import { BASE_URL } from "../../utils/constants/api";
import { getFcmToken } from "../../utils/notifications";

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const HandleSignIn = async(values, { resetForm }) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti"
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Logged in successfully!'
                })
                const fcmToken = await getFcmToken();

                if (fcmToken) {
                    const tokenResponse = await fetch(
                        "https://hackathon-connect-app-backend.onrender.com/set/token",
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

                router.push("/Moments");
                resetForm();
                
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to login.',
                    text2: 'Invalid credentials!'
                })
            }
        } catch (error) {
            console.error("Invalid login credentials ", error);
            Toast.show({
                type: 'error',
                text1: '⚠️Something went wrong',
                text2: 'Please try again.!'
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableOpacity
                style={{paddingHorizontal:16, paddingTop:14}}
                onPress={() => router.push("/")}>
                    <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                
                <View style={styles.container2}>

                    <View>
                        <Text style={[styles.heading, {fontSize:32}]}>Welcome Back</Text>
                        <Text style={[styles.heading, {fontSize:24, marginTop:6, color:'#494949'}]}>Your Community Awaits You✨</Text>
                    </View>

                    <View style = {styles.fieldsContainer}>
                        <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={signInValidationSchema}
                        onSubmit={HandleSignIn}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

                                <View>
                                  
                                    <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>Email</Text>
                                    
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="email" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                        
                                            style={styles.inputField}
                                            placeholder="Enter your email"
                                            placeholderTextColor=
                                            "#828181"
                                            
                                            keyboardType="email-address"
                                            onChangeText={handleChange("email")}
                                            value={values.email}
                                            onBlur={handleBlur("email")}
                                        />
                                    

                                    </View>
                                

                                    {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                                    

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Password</Text>
                                    
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                    <TextInput
                                        style={[styles.inputField, { fontFamily: undefined, color: '#000' }]}
                                            placeholderTextColor=
                                        "#828181"
                                        secureTextEntry
                                        placeholder="Enter your password"
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={handleBlur("password")}
                                    />
                                    

                                    </View>

                                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                                    
                                    <TouchableOpacity style={styles.signInBtn} onPress={handleSubmit}>
                                        {loading ? <ActivityIndicator style={ {fontSize:20}} />:<Text style={{ fontWeight:600, color:'white', fontSize: 18,fontWeight: "bold",}}>Sign In</Text>}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{"flexDirection": "row", gap: 6, "marginTop": 14, "justifyContent": "center"}}
                                        onPress={() => router.push("/signUp")}>
                                        <Text>New to SetuHub?</Text>
                                        <Text style={styles.signInText}>Sign Up</Text>
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

export default SignIn;

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
        heading: {
        fontWeight: "bold",
        textAlign: "center",
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#D1D5DB",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: "#FEFEFE",
        color: '#000',
        marginBottom:8

    },
    inputField: {
        color: 'black',
        width: '95%',
    },
    fieldsContainer: {
        width:'100%'
    },
    error: {
        color: "#E61522",
    },
    signInBtn: {
        backgroundColor: "#1976D2", // blue
        color: "#FFFFFF",           // white text
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems:'center',
        marginTop: 16,
    },
    signInText: {
        color: "#1976D2",
        textDecorationLine: "underline",
        fontWeight: "bold",
    
    }
})