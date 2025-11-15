import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

//  Ask user for permission and get token
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Notificaton permission granted!');
        await getFcmToken();
    } else {
        Alert.alert('Permission denied.', 'Notificatons are disabled');
    }
}

export async function getFcmToken() {
    try {
        const token = await messaging().getToken();
        return token;
    } catch (err) {
        console.error('Error getting FCM token: ', err);
    }
}

//  Listen for incoming messages (while app is open)
export function setupForegroundNotificationListener() {
    messaging().onMessage(async remoteMessage => {
        console.log('New foreground message : ', remoteMessage);
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });
};

// ✅ Handle background notifications
export function setupbackgroundNotificationListener() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message : ', remoteMessage);
    })
}