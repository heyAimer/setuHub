import messaging from '@react-native-firebase/messaging';
import { Alert,Linking, Platform } from 'react-native';

//  Ask user for permission and get token
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Notificaton permission granted!');
        await getFcmToken();
    } else {
        console.log('Permission denied or not requested');
        Alert.alert(
        'Enable Notifications',
        'Please allow notifications in Settings to receive urgent help alerts.',
        [
            { text: 'Cancel', style: 'cancel' },
            { 
            text: 'Open Settings', 
            onPress: () => Linking.openSettings()
            }
        ]
        );
    }
}

export async function getFcmToken() {
    try {
        const token = await messaging().getToken();
        console.log('FCM token:', token);
        return token;
    } catch (err) {
        console.error('Error getting FCM token: ', err);
        return null;
    }
}

//  Listen for incoming messages (while app is open)
export function setupForegroundNotificationListener() {
    messaging().onMessage(async remoteMessage => {
        console.log('New foreground message : ', remoteMessage);
        Alert.alert
            (remoteMessage.notification?.title ?? 'Notification', remoteMessage.notification?.body ?? '');
    });
};

// ✅ Handle background notifications
export function setupbackgroundNotificationListener() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message : ', remoteMessage);
    })
}