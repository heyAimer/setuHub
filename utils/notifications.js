// utils/notifications.js
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

// ────── PERMISSION & TOKEN ──────
export async function requestUserPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    console.log('Notification permission granted!');
    await getFcmToken();
  } else {
    Alert.alert('Enable Notifications', 'Go to Settings', [
      { text: 'Cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  }
}

export async function getFcmToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM token:', token);
    return token;
  } catch (err) {
    console.error('FCM token error:', err);
    return null;
  }
}

// ────── FOREGROUND: SHOW NOTIFICATION ──────
export function setupForegroundNotificationListener() {
  return messaging().onMessage(async (remoteMessage) => {
    console.log("🔥 FOREGROUND FCM RECEIVED:", JSON.stringify(remoteMessage, null, 2));
    const { title, body, data } = remoteMessage.notification || {};

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'SetuHub',
        body: body || 'New update',
        data: data || { tab: 'help' }, // pass tab
      },
      trigger: null, // show immediately
    });
  });
}

// ────── BACKGROUND HANDLER ──────
export function setupBackgroundNotificationListener() {
  return messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("📩 BACKGROUND FCM RECEIVED:", JSON.stringify(remoteMessage, null, 2));
    const { title, body, data } = remoteMessage.notification || {};
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || { tab: 'help' },
      },
      trigger: null,
    });
  });
}

// ────── HANDLE TAP (ANY STATE) ──────
export function useNotificationTapHandler() {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const tab = response.notification.request.content.data?.tab || 'help';
      const screen = mapTabName(tab);
      navigation.navigate('(tabs)', { screen });
    });

    return () => subscription.remove();
  }, [navigation]);
}

// Helper – map backend value to your screen name
function mapTabName(tab) {
  const map = {
    helpnearby: 'HelpNearby',
    impactevents: 'ImpactEvents',
    moments: 'Moments',
    bloodemergency: 'bloodEmergency',
    missingpeople:'peopleMissing'
    // add more as needed
  };
  return map[tab] || 'HelpNearby';
}