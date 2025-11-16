
import { Stack } from "expo-router";
import { useEffect } from "react";
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from "react-native-paper";
//import notification utils 
import * as Notifications from 'expo-notifications';
import { StatusBar } from "react-native";
import { requestUserPermission, setupBackgroundNotificationListener, setupForegroundNotificationListener, useNotificationTapHandler, } from '../utils/notifications';
import Toast from "react-native-toast-message";

// 🚀 Define deep links here (EXPO ROUTER WAY)
export const linking  = {

  prefixes: ["setuhub://", "https://setuhub.io"], // dev build, prod(universal link)

  config: {
    screens: {
      "(tabs)": {
        screens: {
          HelpNearby: "helpnearby",
          ImpactEvents: "impactevents",
          Moments: "moments",
          UrgentHelp: "urgenthelp",
          Profile: "profile",
          index: "", 
        }
      }
    }
  }
};

export default function RootLayout() {

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    requestUserPermission();
    const foregroundUnsub = setupForegroundNotificationListener();
    const backgroundUnsub = setupBackgroundNotificationListener();

    const tapSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const tab = response.notification.request.content.data?.tab || 'help';
      const screen = mapTabName(tab);
      router.push(`/(tabs)/${screen}`);
    });
    
    return () => {
      console.log("cleaning notificaiton listeners.");
      foregroundUnsub && foregroundUnsub();
      backgroundUnsub && backgroundUnsub();
      tapSub.remove();
    }
    
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

      <Toast />
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
