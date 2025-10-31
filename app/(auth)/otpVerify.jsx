import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const OtpVerify = () => {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.")
        }
    }

    return (
        <View style={styles.view}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>OTP sent to your email</Text>

            <TextInput
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
                style={styles.input}
               
                maxLength={6}
            />

            <TouchableOpacity style={styles.button} >
               <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OtpVerify

const styles = StyleSheet.create({

    view: {
        backgroundColor: "#F8FAFC",
        flex: 1,
        justifyContent: "center",
        alignItems:"center"
    },
    title: {
        fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10
    },
    subtitle: {
        fontSize: 14, color: '#5F6368', textAlign: 'center', marginBottom: 20
    },
    input: {
        backgroundColor: '#E8F0FE', paddingHorizontal: 20, borderRadius: 10, textAlign: 'center', fontSize: 18, letterSpacing: 4
    },
    button: {
        backgroundColor: '#1976D2', paddingHorizontal: 16,paddingVertical:10, borderRadius: 8, alignItems: 'center', marginTop: 15
    },
    buttonText: {
        color: '#fff', fontSize: 16, fontWeight: '600'
    },

});

