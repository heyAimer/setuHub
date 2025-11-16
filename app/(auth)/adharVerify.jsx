import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { Formik } from 'formik';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { validationSchema } from "../../utils/authSchema";
import { BASE_URL } from "../../utils/constants/api";
import { getFcmToken } from "../../utils/notifications";

const AdharVerify = () => {
    const insets = useSafeAreaInsets();
    const HandleSignIn = async(values, { resetForm }) => {
        console.log(values.age);
        try {
            const response = await fetch(`${BASE_URL}/authenticate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti",
                        "X-App-Environment": "dev"
                    },
                    body: JSON.stringify({
                        aadhar: values.adhar,
                        name: values.name,
                        phone: values.phone,
                        gender: values.gender,
                        address: values.address,
                        dateOfBirth:values.age
                    }),
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                Toast.show({
                    type: "success",
                    text1: "Adharcard verified successfully."
                });
                router.push("/Moments");
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
                    }
                }
            }
        } catch (error) {
            console.error("Error during adhar verification: ", error);
            Toast.show({
                type: "error",
                text1:"⚠️Something went wrong!"
            })
        }

    }
    
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <TouchableOpacity
                style={{paddingHorizontal:16, paddingTop:14}}
                onPress={() => router.push("/signUp")}>
                    <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                
                <View style={styles.container2}>

                    <View style = {styles.fieldsContainer}>
                        <Formik
                        initialValues={{adhar:"", name: "", phone: "", gender: "", address:"", age:"" }}
                        validationSchema={validationSchema}
                        onSubmit={HandleSignIn}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

                                <View>
                                    <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>Adharcard Number</Text>
                                    
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

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Your Name</Text>
                                
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

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Phone Number</Text>
                                    
                                
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
                                        />
                                    
                                    </View>

                                    {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Gender</Text>
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="wc" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            placeholder="Select"
                                            onChangeText={handleChange("gender")}
                                            value={values.gender}
                                            placeholderTextColor="#828181"
                                            onBlur={handleBlur("gender")}
                                        />
                                    

                                    </View>

                                    {touched.gender && errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Your Address</Text>
                                
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
                                    
                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Your Age</Text>
                                    
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="event" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                    <TextInput
                                        style={styles.inputField}
                                        placeholder="Enter your age"
                                        onChangeText={handleChange("age")}
                                        value={values.age}
                                        onBlur={handleBlur("age")}
                                        placeholderTextColor= "#828181"
                                    />
                                    
                                    </View>

                                    {touched.age && errors.age && <Text style={styles.error}>{errors.age}</Text>}

                                    <TouchableOpacity onPress={handleSubmit}>
                                    <Text style={styles.signUpText}>Verify</Text>
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
        color:'black'
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