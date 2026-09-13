import { useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { authenticate } from "../../utils/api/Verification";

const adharVerify = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    submit: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      submit: "",
    };

    let valid = true;

    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
      valid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
      valid = false;
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
      valid = false;
    }
    if (!gender.trim()) {
      newErrors.gender = "Please select your gender.";
      valid = false;
    }
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Please enter your date of birth.";
      valid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) {
      newErrors.dateOfBirth = "Use the format YYYY-MM-DD.";
      valid = false;
    }
    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors((prev) => ({ ...prev, submit: "" }));

      const data = {
        name: name.trim(),
        phone: phone.trim(),
        gender: gender.trim(),
        dateOfBirth: dateOfBirth.trim(),
      };

      const response = await authenticate(data);
      console.log(response);
      router.replace("/Moments");
    } catch (error) {
      console.error(
        "Profile setup error:",
        error?.response?.data || error?.message,
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong while setting up your profile.";

      setErrors((prev) => ({ ...prev, submit: message }));

      Toast.show({
        type: "error",
        text1: "Unable to create profile",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>{" "}
      <Text style={styles.description}>
        {" "}
        Tell us a little about yourself before you continue.{" "}
      </Text>{" "}
      <Text style={styles.label}>Name</Text>{" "}
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) {
            setErrors((prev) => ({ ...prev, name: "" }));
          }
        }}
        autoCapitalize="words"
        editable={!loading}
      />{" "}
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}{" "}
      <Text style={styles.label}>Phone</Text>{" "}
      <TextInput
        style={[styles.input, errors.phone && styles.inputError]}
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          if (errors.phone) {
            setErrors((prev) => ({ ...prev, phone: "" }));
          }
        }}
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
      />{" "}
      {errors.phone ? (
        <Text style={styles.errorText}>{errors.phone}</Text>
      ) : null}{" "}
      {/* Gender */} <Text style={styles.label}>Gender</Text>{" "}
      <View style={styles.genderContainer}>
        {" "}
        {["Male", "Female", "Other"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderButton,
              gender === option && styles.genderButtonSelected,
              errors.gender && styles.genderButtonError,
            ]}
            onPress={() => {
              setGender(option);
              if (errors.gender) {
                setErrors((prev) => ({ ...prev, gender: "" }));
              }
            }}
            disabled={loading}
          >
            {" "}
            <Text
              style={[
                styles.genderText,
                gender === option && styles.genderTextSelected,
              ]}
            >
              {" "}
              {option}{" "}
            </Text>{" "}
          </TouchableOpacity>
        ))}{" "}
      </View>{" "}
      {errors.gender ? (
        <Text style={styles.errorText}>{errors.gender}</Text>
      ) : null}{" "}
      <Text style={styles.label}>Date of birth</Text>{" "}
      <TextInput
        style={[styles.input, errors.dateOfBirth && styles.inputError]}
        placeholder="YYYY-MM-DD"
        value={dateOfBirth}
        onChangeText={(text) => {
          setDateOfBirth(text);
          if (errors.dateOfBirth) {
            setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
          }
        }}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        editable={!loading}
      />{" "}
      {errors.dateOfBirth ? (
        <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
      ) : null}{" "}
      {/* API error */}{" "}
      {errors.submit ? (
        <Text style={styles.submitError}>{errors.submit}</Text>
      ) : null}{" "}
      {/* Continue */}{" "}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {" "}
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}{" "}
      </TouchableOpacity>{" "}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },

  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },

  description: { fontSize: 16, color: "#666", marginBottom: 30 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 14 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  inputError: { borderColor: "#dc2626" },

  errorText: { color: "#dc2626", fontSize: 13, marginTop: 5 },

  genderContainer: { flexDirection: "row", gap: 10 },

  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  genderButtonSelected: { backgroundColor: "#000", borderColor: "#000" },

  genderButtonError: { borderColor: "#dc2626" },

  genderText: { fontSize: 15, color: "#333" },

  genderTextSelected: { color: "#fff", fontWeight: "600" },

  submitError: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    marginTop: 18,
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonDisabled: { opacity: 0.7 },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default adharVerify;
