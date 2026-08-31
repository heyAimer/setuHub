import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../../utils/constants/api";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/login/forgotpassword`,
        { email: email.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            "X-App-Secret": "smartboyakriti",
          },
        },
      );

      console.log("forgot pass res: ", response.data);

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Check your email for the password reset OTP.",
      });
      router.push("/resetPassword");
    } catch (error) {
      console.log("Error : ", error);
      Toast.show({
        type: "error",
        text1: "Unable to send OTP",
        text2:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={22} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.subtitle}>
          Enter your email address and we'll send you an OTP to reset your
          password.
        </Text>

        <Text style={styles.label}>Email</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#828181"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => router.back()}
        >
          <Text style={styles.signInText}>
            Remember your password? <Text style={styles.blueText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
export default forgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  backButton: {
    paddingHorizontal: 16,
    paddingTop: 14,
    marginTop: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 80,
  },

  title: {
    fontSize: 32,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 35,
  },

  label: {
    marginBottom: 6,
    fontWeight: "500",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#FEFEFE",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    height: 45,
    color: "#000",
  },

  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },

  signInLink: {
    alignItems: "center",
    marginTop: 20,
  },

  signInText: {
    color: "#555",
  },

  blueText: {
    color: "#1976D2",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
