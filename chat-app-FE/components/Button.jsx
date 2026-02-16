import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, radius } from '../constants/theme'
import { verticalScale } from '../utils/styling'
import Loading from './Loading'

const Button = ({ style, onPress, children, loading = false }) => {
    if (loading) {
        return (
            <View style={[styles.button, style, { backgroundColor: "transparent" }]}>
                <Loading />
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            {children}
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        borderCurve: "continuous",
        height: verticalScale(56),
        justifyContent: "center",
        alignItems: "center"
    }
})