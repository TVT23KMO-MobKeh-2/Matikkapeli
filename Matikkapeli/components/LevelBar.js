import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';

export default function LevelBar({ progress, label, playerLevel, gameType }) {
    const progressWidth = useSharedValue(0);
    const [gifVisible, setGifVisible] = useState(false);
    const [levelImage, setLevelImage] = useState(null);
    const [gifShown, setGifShown] = useState({}); // Object to track gif visibility per gameType
    const [previousLevel, setPreviousLevel] = useState(playerLevel);
    const [gifTimer, setGifTimer] = useState(null);

    // Update progress bar width and image based on progress
    useEffect(() => {
        // Normalize progress to stay between 0 and 100
        if (gameType === "bonds") {
            const normalizedProgress = Math.min(((progress - ((playerLevel - 3) * 5)) / 5) * 100, 100);
            console.log(`Normalized Progress Bonds: ${normalizedProgress}`);
            progressWidth.value = withTiming(normalizedProgress, { duration: 500 });
            console.log(`Progress bar width updated to: ${progressWidth.value}%`);
        } else {
            const normalizedProgress = Math.min(((progress - ((playerLevel - 1) * 5)) / 5) * 100, 100);
            console.log(`Normalized Progress: ${normalizedProgress}`);
            progressWidth.value = withTiming(normalizedProgress, { duration: 500 });
            console.log(`Progress bar width updated to: ${progressWidth.value}%`);
        }

        // Check if GIF should be shown for the current game type
        if (progress >= (5 * playerLevel) && !gifVisible && !gifShown[gameType]) {
            console.log(`Progress reached 5 for ${gameType}, showing GIF`);
            setGifVisible(true);
            setGifShown((prevState) => ({ ...prevState, [gameType]: true }));  // Mark GIF as shown for this gameType
            // Set a timer to hide the GIF after 3 seconds (or any duration of the GIF animation)
            setGifTimer(setTimeout(() => {
                setGifVisible(false);
            }, 3000)); // 3 seconds, adjust according to the GIF duration
        }

        // Handle GIF hiding if progress falls below level threshold
        if (progress < (5 * playerLevel) && gifVisible) {
            console.log('Progress below threshold, hiding GIF');
            setGifVisible(false);
            // Clear the timer if progress drops before the GIF is hidden
            if (gifTimer) {
                clearTimeout(gifTimer);
                setGifTimer(null);
            }
        }

        // Define level images and gifs
        const level = Math.floor(progress / 5);
        console.log(`Calculated Level: ${level}`);

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

        const levelGifs = {
            1: require('../assets/purkki.gif'),
            2: require('../assets/purkki1.gif'),
            3: require('../assets/purkki3.gif'),
            4: require('../assets/purkki4.gif'),
            5: require('../assets/purkki5.gif'),
            6: require('../assets/purkki6.gif'),
            7: require('../assets/purkki7.gif'),
            8: require('../assets/purkki8.gif'),
            9: require('../assets/purkki9.gif'),
            10: require('../assets/purkki10.gif'),
        };

        if (gifVisible) {
            setLevelImage(levelGifs[level]);
        } else {
            setLevelImage(levelImages[level]);
        }
    }, [progress, gifVisible, gifShown, gameType, playerLevel]);  // Trigger when progress, gifVisible, gifShown, gameType, or playerLevel changes

    const progressStyle = useAnimatedStyle(() => {
        console.log(`Progress bar style updated: width = ${progressWidth.value}%`);
        return {
            width: `${progressWidth.value}%`
        };
    });

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
                        source={levelImage}
                        style={styles.levelImage}
                    />
                </View>
            </View>
        </View>
    );
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
});
