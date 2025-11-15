import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { Formik } from 'formik';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signInValidationSchema } from "../../utils/authSchema";
import { BASE_URL } from "../../utils/constants/api";
import { getFcmToken } from "../../utils/notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignIn = () => {
    const insets = useSafeAreaInsets();
    const HandleSignIn = async(values, { resetForm }) => {
         console.log("signin clicked")
        try {
            const response = await fetch(`${BASE_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti",
                        "X-App-Environment":"dev"
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
                alert(`Login Successful`);
                resetForm();

                const fcmToken = await getFcmToken();

                if (fcmToken) {
                    const tokenResponse = await fetch(
                        "https://hackathon-connect-app-backend.onrender.com/set/token",
                        {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                                "X-App-Secret": "smartboyakriti",
                                "X-App-Environment":"dev"
                            },
                            body: JSON.stringify({
                                firebaseToken: fcmToken
                            })
                        }
                    );
                    if (tokenResponse.ok) {
                        const data = await tokenResponse.json();
                        alert('Fcm token sent to backend', data);
                    }
                }

                router.push("/Moments");
                
            } else {
                alert(`Invalid credentials.`)
            }
        } catch (error) {
            console.error("Invalid login credentials ", error);
            alert("⚠️ Something went wrong. Please try again.")
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}> 
            <TouchableOpacity
                style={{paddingHorizontal:16, paddingTop:14}}
                onPress={() => router.push("/")}>
                    <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                    onPress={() => navigation.goBack()}
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
                        initialValues={{ email: "rudra@example.com", password: "123" }}
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
                                        style={[styles.inputField, { fontFamily: undefined, color: '#000'  }]}
                                        secureTextEntry
                                        placeholder="Enter your password"
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={handleBlur("password")}
                                    />
                                    

                                    </View>

                                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                                    
                                    <TouchableOpacity onPress={handleSubmit}>
                                        <Text style={styles.signUpText}>Sign In</Text>
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
            
        </View>
        
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
    fieldsContainer: {
        width:'100%'
    },
    error: {
        color: "#E61522",
    },
    signUpText: {
        backgroundColor: "#1976D2", // blue
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",           // white text
        paddingVertical: 12,
        borderRadius: 8,
        textAlign: "center",
        marginTop: 16,
    },
    signInText: {
        color: "#1976D2",
        textDecorationLine: "underline",
        fontWeight: "bold",
    
    }
})