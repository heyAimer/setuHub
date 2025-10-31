import { router } from 'expo-router'
import { Formik } from 'formik';
import { StyleSheet, TouchableOpacity,Text,TextInput, View, ScrollView } from 'react-native'
import { validationSchema } from "../../utils/authSchema";
import { MaterialIcons } from "@expo/vector-icons";

const AdharVerify = () => {
     const HandleSignIn = () => {

    }

    // {
    //  "aadhar": "987654321098",
    //  "name": "Rudrina Kumari",
    //  "phone": "9123456780",
    //  "gender": "Female",
    //  "address": "742 Evergreen Terrace, Springfield",
    //  "age": "34"
    // }
    
    return (
        <View style={styles.view}>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <TouchableOpacity
                style={{ marginTop: 50, marginHorizontal: 20 }}
                onPress={() => router.push("/")}>
                    <Text>back</Text>
                </TouchableOpacity>
                
                <View style={styles.container}>

                    <View style = {styles.fieldsContainer}>
                        <Formik
                        initialValues={{adhar:"", name: "", phone: "", gender: "", address:"", age:"" }}
                        validationSchema={validationSchema}
                        onSubmit={HandleSignIn}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

                                <View>
                                    <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>Adharcard Number</Text>
                                    
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="email" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

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
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                    <TextInput
                                        style={styles.inputField}
                                        secureTextEntry
                                        placeholder="Enter your name"
                                        onChangeText={handleChange("name")}
                                        value={values.name}
                                        onBlur={handleBlur("name")}
                                    />
                                    

                                    </View>

                                    {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Phone Number</Text>
                                    
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            secureTextEntry
                                            placeholder="Enter your number"
                                            onChangeText={handleChange("phone")}
                                            value={values.phone}
                                            onBlur={handleBlur("phone")}
                                        />
                                    

                                    </View>

                                    {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Gender</Text>
                                    
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            secureTextEntry
                                            placeholder="Select"
                                            onChangeText={handleChange("gender")}
                                            value={values.gender}
                                            onBlur={handleBlur("gender")}
                                        />
                                    

                                    </View>

                                    {touched.gender && errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Your Address</Text>
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                        <TextInput
                                            style={styles.inputField}
                                            secureTextEntry
                                            placeholder="Enter your address"
                                            onChangeText={handleChange("address")}
                                            value={values.address}
                                            onBlur={handleBlur("address")}
                                        />
                                    

                                    </View>

                                    {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}
                                    
                                    <Text style={{ marginTop: 10, marginBottom: 4, fontWeight: 'bold' }}>Your Age</Text>
                                    
                                
                                    <View style={styles.inputFieldContainer}>
                                        <MaterialIcons name="lock" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />

                                    <TextInput
                                        style={styles.inputField}
                                        secureTextEntry
                                        placeholder="Enter your age"
                                        onChangeText={handleChange("age")}
                                        value={values.age}
                                        onBlur={handleBlur("age")}
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

    view: {
        backgroundColor: "#F8FAFC",   
        flex:1,
    },
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: 'center',
        marginHorizontal:20,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#D1D5DB",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: "#FEFEFE",

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