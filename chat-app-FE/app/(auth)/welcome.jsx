import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import Button from '../../components/Button'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { colors, spacingX, spacingY } from '../../constants/theme'
import { verticalScale } from '../../utils/styling'

const welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper showPattern={true} style={styles.container}>
            <View style={styles.container}>
                <View style={{ alignItems: "center" }}>
                    <Typo color={colors.white} size={43} fontWeight={"900"}>
                        Wink
                    </Typo>
                </View>
                <Animated.Image
                    entering={FadeIn.duration(700).springify()}
                    source={require("../../assets/images/welcome.png")}
                    style={styles.welcomeImage}
                    resizeMode={"contain"}
                />
                <View>
                    <Typo color={colors.white} size={33} fontWeight={"600"} >Stay Connected</Typo>
                    <Typo color={colors.white} size={33} fontWeight={"600"} >With your friends</Typo>
                    <Typo color={colors.white} size={33} fontWeight={"600"} >and family</Typo>
                </View>
                <Button style={{ backgroundColor: colors.white }} loading={false} onPress={() => router.push("/(auth)/register")}>
                    <Typo color={colors.black} size={23} fontWeight={"600"} >Get Started</Typo>
                </Button>
            </View>

        </ScreenWrapper >
    )
}

export default welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        paddingHorizontal: spacingX._20,
        marginVertical: spacingY._10,
    },
    background: {
        flex: 1,
        backgroundColor: colors.neutral900
    },
    welcomeImage: {
        height: verticalScale(300),
        aspectRatio: 1,
        alignSelf: "center"
    }
})