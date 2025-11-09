import { Stack } from "expo-router";
import { useEffect } from "react";
import { requestUserPermission, setupbackgroundNotificationListener, setupForegroundNotificationListener } from '../utils/notifications';
import messaging from '@react-native-firebase/messaging';

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

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
