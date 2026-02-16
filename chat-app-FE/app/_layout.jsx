import { Stack, useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { initializeNotificationListeners } from '../services/notificationService'
import { AuthProvider } from '../contexts/authContext'

const RootLayout = () => {
    const router = useRouter();

    useEffect(() => {
        const cleanup = initializeNotificationListeners(router);
        return cleanup;
    }, []);

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} >
                <Stack.Screen name='(main)/home' options={{ headerShown: false }} />
                <Stack.Screen name='(main)/profileModel' options={{ presentation: "modal" }} />
                <Stack.Screen name='(main)/newConversationModel' options={{ presentation: "modal" }} />
            </Stack>

        </AuthProvider>
    )

}
export default RootLayout

const styles = StyleSheet.create({})