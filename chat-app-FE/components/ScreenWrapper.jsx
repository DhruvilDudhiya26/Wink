import { Dimensions, ImageBackground, Platform, StatusBar, View } from "react-native";
import { colors } from "../constants/theme";

const { height } = Dimensions.get('window');

const ScreenWrapper = ({
    style, children, showPattern, isModel = false, bgOpacity = 1
}) => {
    let paddingTop = Platform.OS === "ios" ? height * 0.06 : 40;
    let paddingBottom = 0

    if (isModel) {
        paddingTop = Platform.OS === "ios" ? height * 0.02 : 45
        paddingBottom = height * 0.02
    }

    return (
        <ImageBackground
            style={{ flex: 1, backgroundColor: isModel ? colors.white : colors.neutral900 }}
            imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
            source={require("../assets/images/bgPattern.png")}
            resizeMode="cover"
        >
            <View style={[{ paddingTop, paddingBottom, flex: 1 }, style]}>
                <StatusBar barStyle={"light-content"} backgroundColor={'transparent'} />
                {children}
            </View>

        </ImageBackground>

    )



}

export default ScreenWrapper