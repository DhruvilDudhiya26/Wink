import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    console.log("platform", Platform)
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    console.log("device", Device)

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            alert('Project ID not found');
        }
        console.log("Using Project ID for Token:", projectId);
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e) {
            alert(`${e}`);
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }
}

export async function sendLocalNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title || "Test Notification",
            body: body || "This is a local test notification",
            data: { data: 'goes here' },
        },
        trigger: null,
    });
}
export function initializeNotificationListeners(router) {
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        const conversationId = data.conversationId;

        if (conversationId) {
            console.log("Deep linking to conversation:", conversationId);
            // Navigate to the conversation screen
            router.push({
                pathname: '/(main)/conversation',
                params: { id: conversationId }
            });
        }
    });

    return () => {
        Notifications.removeNotificationSubscription(responseListener);
    };
}
