import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { View, Text, ImageBackground, Button, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import TaskWindow from '../components/TaskWindow'
import { Image } from 'expo-image';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';

const animalImage = {
    fox: require('../assets/fox.png'),
    bear: require('../assets/bear.png'),
    rabbit: require('../assets/rabbit.png'),
    wolf: require('../assets/wolf.png'),
};

const animalGif = {
    fox: require('../assets/fox.gif'),
    bear: require('../assets/bear.gif'),
    rabbit: require('../assets/rabbit.gif'),
    wolf: require('../assets/wolf.gif'),
};

export default function Animation({ route, onBack, navigation }) {
    const backgroundImageBack = require('../assets/Pixel-art-back_full.png')
    const backgroundImageFront = require('../assets/Pixel-art-front-sign_full.png')
    const translateX = useSharedValue(750)
    const imageWidth = 2250
    const [isMoving, setIsMoving] = useState(true)
    const [isGifVisible, setIsGifVisible] = useState(true)
    const [taskVisible, setTaskVisible] = useState(false)
    const { profile } = route.params;
    const { imageID } = profile;
    console.log('Received profile data:', profile);
    const characterGif = animalGif[imageID]
    const characterImage = animalImage[imageID]
    const [isLoading, setIsLoading] = useState(true);

    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme ? dark : light);

    useEffect(() => {
        // Simulate a delay to ensure profile is ready (can replace with actual data-check logic)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Adjust time if needed

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [profile]);

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
            translateX.value = withTiming(-800, { duration: 7000 }, () => {
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
                        source={characterImage}
                        style={[styles.characterContainer, styles.characterImage]} />
                )}
                {isGifVisible && (
                    <Image
                        source={characterGif}
                        style={[styles.characterContainer, styles.characterImage]}
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
