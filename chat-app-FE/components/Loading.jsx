import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { colors } from '../constants/theme'

const Loading = ({ size = "large", color = colors.primaryDark }) => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={size} color={color} />
        </View >
    )
}

export default Loading

const styles = StyleSheet.create({})