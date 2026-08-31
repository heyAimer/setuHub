import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useState } from "react";
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
import Toast from "react-native-toast-message";
import { BASE_URL } from "../../utils/constants/api";

const ResetPassword = () => {
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Toast.show({
        type: "error",
        text1: "OTP Required",
        text2: "Please enter the OTP sent to your email.",
      });
      return;
    }

    if (!newPassword) {
      Toast.show({
        type: "error",
        text1: "Password Required",
        text2: "Please enter your new password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords Don't Match",
        text2: "Please make sure both passwords are the same.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/login/forgotpassword/otp`,
        {
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-App-Secret": "smartboyakriti",
          },
        }
      );

      console.log("Reset password response:", response.data);

      Toast.show({
        type: "success",
        text1: "Password Reset",
        text2: "Your password has been changed successfully.",
      });

      // Go back to sign in
      router.replace("/(auth)/signIn");
    } catch (error) {
      console.log(
        "Reset password error:",
        error.response?.data || error.message
      );

      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2:
          error.response?.data?.message ||
          "Unable to reset your password. Please try again.",
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={22}
          color="black"
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>
          Enter the OTP sent to{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* OTP */}

        <Text style={styles.label}>OTP</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="password"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#828181"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
        </View>

        {/* New Password */}

        <Text style={styles.label}>New Password</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#828181"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        {/* Confirm Password */}

        <Text style={styles.label}>Confirm Password</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#828181"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

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
    marginBottom: 50,
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
    marginBottom: 30,
  },

  email: {
    fontWeight: "500",
    color: "#1976D2",
  },

  label: {
    marginBottom: 6,
    marginTop: 8,
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
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});