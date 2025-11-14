import { Stack } from "expo-router";
import { useEffect } from "react";
import { requestUserPermission, setupbackgroundNotificationListener, setupForegroundNotificationListener } from '../utils/notifications';
import messaging from '@react-native-firebase/messaging';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";

// 🚀 Define deep links here (EXPO ROUTER WAY)
export const unstable_settings = {
  linking: {
    prefixes: ["setuhub://", "https://setuhub.io"],

    config: {
      screens: {
        "(tabs)": {
          screens: {
            HelpNearby: "help",
            ImpactEvents: "events",
            Moments: "moments",
            UrgentHelp: "urgent",
            Profile: "profile"
          }
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
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}
