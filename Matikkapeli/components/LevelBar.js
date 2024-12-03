import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'


export default function LevelBar({ progress, label}) {
    const progressWidth = useSharedValue(0)

    useEffect(() => {
        const normalizedProgress = (progress / 5) * 100;
        progressWidth.value = withTiming(normalizedProgress, {duration: 500})
    }, [progress])

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`
        }
    })

    const level = Math.floor(progress/5);

    const levelImages = {
        0: require('../assets/purkki.png'),
        1: require('../assets/purkki1.png'),
        2: require('../assets/purkki2.png'),
        3: require('../assets/purkki3.png'),
        4: require('../assets/purkki4.png'),
        5: require('../assets/purkki5.png'),
        6: require('../assets/purkki6.png'),
        7: require('../assets/purkki7.png'),
        8: require('../assets/purkki8.png'),
        9: require('../assets/purkki9.png'),
        10: require('../assets/purkki10.png'),

    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.progressContainer}>
                <View style={styles.barAndScaleContainer}>
                    <View style={styles.barContainer}>

                        <Animated.View style={[styles.progressBar, progressStyle]}></Animated.View>
                    </View>
                    <View style={styles.scaleContainer}>
                        {Array.from({ length: 6 }, (_, i) => (
                            <Text key={i} style={styles.scaleText}>{i}</Text>
                        ))}

                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={levelImages[level]}
                        style={styles.levelImage}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },

    barAndScaleContainer: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 40,
    },
    barContainer: {
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    imageContainer: {
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'brown',
        borderRadius: 10,
    },
    scaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    scaleText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333'
    },
    levelImage: {
        width: 40,
        height: 70,
        padding: 10,
    },
})