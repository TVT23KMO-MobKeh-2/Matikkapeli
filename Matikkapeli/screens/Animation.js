import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { View, Text, ImageBackground, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import TaskWindow from '../components/TaskWindow'
import styles from '../styles'

export default function Animation({ onBack, setSelectedTask }) {
    const backgroundImageBack = require('../assets/Pixel-art-back_full.png')
    const backgroundImageFront = require('../assets/Pixel-art-front-sign_full.png')
    const translateX = useSharedValue(750)
    const imageWidth = 2250
    const [isMoving, setIsMoving] = useState(false)
    const stopImage = require('../assets/foxwalking1.png')
    const movingImage = require('../assets/foxwalking.gif')
    const [isGifVisible, setIsGifVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const handlePress = () => {
        setIsMoving(true); 
        setIsGifVisible(true); 
    };

    const handleReset = () => {
        translateX.value = 750; 
        setIsMoving(false); 
        setIsGifVisible(false); 
        setModalVisible(false);
    };


    useEffect(() => {
        if (isMoving) {
            translateX.value = withTiming(-850, { duration: 7000 }, () => {
                runOnJS(setIsGifVisible)(false)
                runOnJS(setModalVisible)(true)
            })
        } else {
            translateX.value = withTiming(750)
        }
    }, [isMoving])

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }))

    return (
        <View style={styles.container}>
            <Animated.View style={[animatedStyles]}>
                <ImageBackground
                    source={backgroundImageBack}
                    style={[styles.backgroundAnimation, { width: imageWidth }]}
                    resizeMode='cover'
                />
            </Animated.View>
            <View>

                {!isGifVisible && (
                    <Image
                        source={stopImage}
                        style={[styles.foxContainer, styles.foxImage]} />
                )}
                {isGifVisible && (
                    <Image
                        source={movingImage}
                        style={[styles.foxContainer, styles.foxImage]}
                    />
                )}
            </View>
            <Animated.View style={[animatedStyles, styles.overlayContainer]}>
                <Image
                    source={backgroundImageFront}
                    style={styles.overlayImage}
                    resizeMode='contain'
                />
            </Animated.View>

            {modalVisible && <TaskWindow
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onNavigate={setSelectedTask} 
            />}

            <View style={styles.buttonContainer1}>
                <View style={{ marginHorizontal: 10 }}>
                    <Button onPress={handlePress} title="Move" />
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Button onPress={handleReset} title="Reset" />
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Button title="Palaa takaisin" onPress={onBack} />
                </View>
            </View>
        </View>
    )
}
