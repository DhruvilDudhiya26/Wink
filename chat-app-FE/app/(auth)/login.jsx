import { useRouter } from 'expo-router'
import { EnvelopeIcon, LockIcon } from 'phosphor-react-native'
import { useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import Input from '../../components/Input'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { colors, radius, spacingX, spacingY } from '../../constants/theme'
import { useAuth } from '../../contexts/authContext'

const Login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const handleLogin = async () => {
        if (!emailRef.current.trim() || !passwordRef.current.trim()) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }
        try {
            setIsLoading(true)
            await login(emailRef.current, passwordRef.current);
        } catch (error) {
            Alert.alert("Login error", error.message)
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <ScreenWrapper showPattern={true} >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={28} />
                        <Typo size={17} color={colors.white}>Need some help ?</Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={"600"}>
                                    Welcome Back
                                </Typo>
                                <Typo color={colors.neutral600}>
                                    We are happy to see you!
                                </Typo>
                                <Input placeholder="Enter your email"
                                    onChangeText={(value) => emailRef.current = value} icon={<EnvelopeIcon size={20} color={colors.neutral600} />} />
                                <Input placeholder="Enter your password"
                                    secureTextEntry={true}
                                    onChangeText={(value) => passwordRef.current = value} icon={<LockIcon size={20} color={colors.neutral600} />} />

                                <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                    <Button loading={isLoading} onPress={handleLogin}>
                                        <Typo size={23} fontWeight={"600"} color={colors.white}>
                                            Login
                                        </Typo>
                                    </Button>

                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacingX._10 }}>
                                        <Typo size={14} color={colors.neutral600}>Don't have an account?</Typo>
                                        <Pressable
                                            onPress={() => router.push("/(auth)/register")}
                                        >
                                            <Typo size={14} color={colors.primary}>Register</Typo>
                                        </Pressable>
                                    </View>
                                </View>




                            </View>
                        </ScrollView>

                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20

    },
    form: {
        gap: spacingY._15,
        marginTop: spacingY._20,
    }
})