import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../utils/constants/api';

const OtpVerify = () => {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Toast.show({
                type: 'failed',
                text1: 'Invalid OTP',
                text2: 'Please enter a 6-digit OTP!'
            })
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/signup/otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti"
                    },
                    body: JSON.stringify({
                        otp: otp
                    })
                }
            );
            const data = await response.json();
            Toast.show({
                type: 'success',
                text1: 'Email Verified!'
            });
            
            router.push("/adharVerify");
        } catch (error) {
            Toast.show({
                type: 'failed',
                text1: 'Invalid OTP'
            });
        } finally {
            setLoading(false);
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
                onChangeText={setOtp}
                value={otp}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
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

