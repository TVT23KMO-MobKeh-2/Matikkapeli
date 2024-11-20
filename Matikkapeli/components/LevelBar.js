import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'


export default function LevelBar({progress, label}) {
    const progressWidth = useSharedValue(0)

    useEffect(() => {
        const normalizedProgress = (progress / 50) * 100;
        progressWidth.value = withTiming(normalizedProgress, {duration: 500})
    }, [progress])

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`
        }
    })

  return (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressStyle]}></Animated.View>
        </View>
        <View style={styles.scaleContainer}>
            {Array.from({ length: 11}, (_, i) => (
                <Text key={i} style={styles.scaleText}>{i}</Text>
            ))}

        </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: 250,
        alignItems: 'center',
        marginTop: 20,
    },
    label:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressContainer:{
        width: '100%',
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBar:{
        height: '100%',
        backgroundColor: '#76c7c0',
        borderRadius: 10,
    },
    scaleContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    scaleText:{
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333'
    }
})