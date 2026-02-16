import { useRouter } from 'expo-router'
import { CaretLeftIcon } from "phosphor-react-native"
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../constants/theme'
import { verticalScale } from '../utils/styling'
const BackButton = ({ style, iconSize = 20, color = colors.white }) => {

    const router = useRouter()
    return (
        <TouchableOpacity onPress={() => router.back()} style={[styles.button, style]}>
            <CaretLeftIcon size={(verticalScale(iconSize))} color={color} weight='bold' />
        </TouchableOpacity>

    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {

    }
})