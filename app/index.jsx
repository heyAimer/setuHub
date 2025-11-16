import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from '../utils/constants/api';
import { deepLinkToRoute } from "../utils/deepLinks";
export default function index() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const APP_ENV = __DEV__ ? "dev" : "prod";

  useEffect(() => {
    const routeUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/pagerouter`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-App-Secret": "smartboyakriti"
            },
            redirect: "manual",
          });
        const url = res.headers.get("location");  // setuhub://moments
        const screen = url.split("://")[1];  //"moments"
        const finalRoute = deepLinkToRoute[screen];

        if (finalRoute && finalRoute !== "/") {
          setRedirecting(true);
          router.replace(finalRoute);
        }
      } catch (err) {
        console.log("Error in catch: " ,err);
      } finally {
        setLoading(false);
      }
    }
    routeUser();
  }, []);

  if (redirecting) return null;
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeAreaView, {justifyContent:'center', alignItems:'center'}]}>
        <ActivityIndicator size="large" />
        <Text style={styles.heading}>SetuHub</Text>

      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#F5F7FA"}/>
      <ScrollView contentContainerStyle={{ height: "100%" }}>

        <View style={styles.container}>

          <LottieView
          source={require('../assets/images/animation.json')}
          autoPlay
          loop
          style={styles.animation}
          />
          
          <View>
            <Text style={styles.heading}> 
              Help Within Reach.
            </Text>

            <MaskedView
              maskElement={
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    color: "black", // Mask color, doesn’t appear
                  }}
                >
                  Because Every second Matters
                </Text>
              }
            >
              <LinearGradient
                colors={["#470909", "#1976D2","#470909"]} // blue → yellow
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    opacity: 0, // hide actual text (mask only)
                  }}
                >
                  second
                </Text>
              </LinearGradient>
            </MaskedView>
            
          </View>

          <View style={{ width: "75%", marginTop:60 }}>
            <TouchableOpacity
              onPress={() => router.push("/signUp")}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={{textAlign:'center', marginTop:14,marginBottom:4, fontWeight:600, fontSize:16}}>Already a User?</Text>

            <TouchableOpacity
              onPress={() => router.push("/signIn")}>
              <Text style={styles.guestUserText}>Sign In</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#F5F7FA",
    flex:1
  },
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
  heading: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
  },
  signUpText: {
    backgroundColor: "#1976D2", // blue
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",           // white text
    paddingVertical: 12,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 4,
  },
  guestUserText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 12,
    borderRadius: 8,
    textAlign: "center",
    borderColor: "#1976D2",
    color: "#1976D2",
    borderWidth: 2,
    marginTop: 4,
  },
  signInText: {
    color: "#1976D2",
    textDecorationLine: "underline",
    fontWeight: "bold",
    
  }

})