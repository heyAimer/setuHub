
import { Stack } from "expo-router";
import { useEffect } from "react";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from "react-native-paper";

//initialize firebase firest
import '../utils/firebase';

//import notification utils 
import { requestUserPermission, setupbackgroundNotificationListener, setupForegroundNotificationListener } from '../utils/notifications';

import messaging from '@react-native-firebase/messaging';
import { StatusBar } from "react-native";

// 🚀 Define deep links here (EXPO ROUTER WAY)
export const linking  = {

  prefixes: ["setuhub://", "https://setuhub.io"], // dev build, prod(universal link)

  config: {
    screens: {
      "(tabs)": {
        screens: {
          HelpNearby: "help",
          ImpactEvents: "events",
          Moments: "moments",
          UrgentHelp: "urgent",
          Profile: "profile",
          index: "", 
        }
      }
    }
  }
};


export default function RootLayout() {

  useEffect(() => {
    requestUserPermission();
    
    const unsubscribe = setupForegroundNotificationListener();
    setupbackgroundNotificationListener();

    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background by notification:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit by notification:', remoteMessage);
        }
      });

    return () => {
      unsubscribe && unsubscribe();
      unsubscribeOpened && unsubscribeOpened();
    };
  }, []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#1976D2", // your custom blue
    },
  };


  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#F8FAFC"}/>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}


// const screenLinks = {
//   HelpNearby: "setuhub://help",
//   ImpactEvents: "setuhub://events",
//   Moments: "setuhub://moments",
//   UrgentHelp: "setuhub://urgent",
//   Profile: "setuhub://profile"
// };
