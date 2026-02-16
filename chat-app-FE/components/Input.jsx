import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { colors, radius, spacingX } from '../constants/theme'
import { verticalScale } from '../utils/styling'

const Input = ({ icon, containerStyle, inputStyle, inputRef, ...props }) => {
    const [isFocused, setIsFocused] = useState(false)
    return (
        <View style={[styles.container, containerStyle, isFocused && styles.primaryBorder]}>
            {icon}
            <TextInput
                style={[styles.input, inputStyle]}
                placeholderTextColor={colors.neutral400}
                ref={inputRef}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: verticalScale(56),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.neutral200,
        borderRadius: radius.full,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        backgroundColor: colors.neutral100,
        gap: spacingX._10,
    },
    primaryBorder: {
        borderColor: colors.primary,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: verticalScale(14)
    }
})