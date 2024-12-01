import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { View, Text, ImageBackground, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import TaskWindow from '../components/TaskWindow'
import { Image } from 'expo-image';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';

export default function Animation({ route, onBack, navigation }) {
    const backgroundImageBack = require('../assets/Pixel-art-back_full.png')
    const backgroundImageFront = require('../assets/Pixel-art-front-sign_full.png')
    const translateX = useSharedValue(750)
    const imageWidth = 2250
    const [isMoving, setIsMoving] = useState(false)
    const stopImage = require('../assets/foxwalking1.png')
    const movingImage = require('../assets/foxwalking.gif')
    const [isGifVisible, setIsGifVisible] = useState(false)
    const [taskVisible, setTaskVisible] = useState(false)
    const { profile } = route.params;
    console.log('Received profile data:', profile);

    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme ? dark : light);

    useEffect(() => {
        if (!profile) {
            console.error('No profile data received in Animation screen');
        } else {
            console.log('Profile data received in Animation:', profile);
        }
    }, [profile]);

    const handlePress = () => {
        setIsMoving(true); 
        setIsGifVisible(true); 
    };

    const handleReset = () => {
        translateX.value = 750; 
        setIsMoving(false); 
        setIsGifVisible(false); 
        setTaskVisible(false);
    };


    useEffect(() => {
        if (isMoving) {
            translateX.value = withTiming(-850, { duration: 7000 }, () => {
                runOnJS(setIsGifVisible)(false)
                runOnJS(setTaskVisible)(true)
            })
        } else {
            translateX.value = withTiming(750)
        }
    }, [isMoving])

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }))

    return (
        <View style={[styles.container, {paddingTop: 0}]}>
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
                    contentFit='contain'
                />
            </Animated.View>

            {taskVisible && <TaskWindow
                taskVisible={taskVisible}
                setTaskVisible={setTaskVisible}
                profile={profile}
                navigation={navigation}
            />}

            <View style={styles.buttonContainer1}>
                <View style={{ marginHorizontal: 10 }}>
                    <Button onPress={handlePress} title="Move" />
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Button onPress={handleReset} title="Reset" />
                </View>
            </View>
        </View>
    )
}
