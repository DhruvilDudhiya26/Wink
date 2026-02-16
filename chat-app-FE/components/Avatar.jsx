import { Image } from "expo-image"
import { StyleSheet, View } from 'react-native'
import { colors } from '../constants/theme'
import { getAvatarPath } from '../services/imageService'
import { verticalScale } from '../utils/styling'

const Avatar = ({ uri, size = 40, style, isGroup, isOnline }) => {
    return (
        <View style={[styles.avatar, { height: verticalScale(size), width: verticalScale(size) }, style]}>
            <Image style={{ flex: 1 }} source={getAvatarPath(uri, isGroup)} contentFit='cover' transition={100} />
            {isOnline && (
                <View style={styles.onlineIndicator} />
            )}
        </View>
    )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
        overflow: 'hidden',
    },
    onlineIndicator: {
        position: 'absolute',
        right: 2,
        bottom: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.green || '#4ade80', // Fallback if colors.green isn't defined
        borderWidth: 1.5,
        borderColor: colors.white
    }
})