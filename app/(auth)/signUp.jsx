import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { Formik } from 'formik';
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from "react-native-toast-message";
import { signUpValidationSchema } from "../../utils/authSchema";
import { BASE_URL } from '../../utils/constants/api';

const SignUp = () => {
    const [loading, setLoading] = useState(false);

    const HandleSignUp = async (values, { resetForm }) => {

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti",
                    },
                    body: JSON.stringify({
                        uuid: values.username,
                        email: values.email,
                        password: values.password,
                        confirmPassword: values.confirmPassword
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                Toast.show({
                    type: 'success',
                    text1: "Otp Sent To Email.",
                    text2: 'Check in spam folder!'
                });

                router.push("/otpVerify");

                resetForm();
                
            } else {
                Toast.show({
                    type: 'error',
                    text1: '⚠️ Something went wrong.',
                    text2:'Please try again!'
                })
                return;
            }
        } catch (error) {
            console.error("Error during email verification: ", error);
            Toast.show({
                type:"error",
                text1: "⚠️ Something went wrong",
                text2: 'Please try again!'
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
                        <Text style={[styles.heading, {fontSize:32}]}>Create an Account</Text>
                        <Text style={[styles.heading, {fontSize:24, marginTop:6, color:'#494949'}]}>Become a Lifeline✨</Text>
                    </View>
                   
                    <View style = {styles.fieldsContainer}>
                        <Formik
                        initialValues={{username:"", email: "", password: "",confirmPassword: "" }}
                        validationSchema={signUpValidationSchema}
                        onSubmit={HandleSignUp}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => {
                                const isFormValid =
                                values.username &&
                                values.email &&
                                values.password &&
                                values.confirmPassword &&
                                Object.keys(errors).length === 0;
                                return (
                                <View>
                                    <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>Username</Text>
                                    
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="person" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                        
                                            style={styles.inputField}
                                            placeholder="Enter your username"
                                            placeholderTextColor=
                                            "#828181"
                                            
                                            keyboardType="default"
                                            onChangeText={handleChange("username")}
                                            value={values.username}
                                            onBlur={handleBlur("username")}
                                        />
                                    </View>

                                    {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}
                                    
                                    
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
                                    
                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Confirm Password</Text>
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                        
                                            style={[styles.inputField, { fontFamily: undefined, color: '#000' }]}
                                            placeholderTextColor=
                                            "#828181"
                                            secureTextEntry
                                            placeholder="Re-enter your password"
                                            onChangeText={handleChange("confirmPassword")}
                                            value={values.confirmPassword}
                                            onBlur={handleBlur("confirmPassword")}
                                        />
                                    </View>

                                        {/* {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>} */}
                                        {values.confirmPassword.length > 0 && values.password !== values.confirmPassword && (
                                            <Text style={styles.error}>Password do not match</Text>
                                        )}
                                    
                                    <TouchableOpacity
                                        onPress={isFormValid ? handleSubmit : null}
                                        disabled={!isFormValid}
                                        style={[
                                            styles.signUpBtn,
                                            { opacity: isFormValid ? 1 : 0.4 }
                                            ]}
                                    >
                                        {loading? <ActivityIndicator size="small"/>:<Text style={{ fontWeight:600, color:'white', fontSize: 18,fontWeight: "bold",}}>Verify email</Text>}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                    style={{"flexDirection": "row", gap: 6, "marginTop": 20, "justifyContent": "center"}}
                                    onPress={() => router.push("/signIn")}>
                                        <Text>Already a User?</Text>
                                        <Text style={styles.signInText}>Sign In</Text>
                                    </TouchableOpacity>

                                </View>
                                
                                
                            )}}

                        </Formik>
                    </View>  
                    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        
  )
}

export default SignUp;

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
        marginBottom:10,
        color:'#000'
    },
    fieldsContainer: {
        width:'100%'
    },
    error: {
        color: "#E61522",
    },
    signUpBtn: {
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