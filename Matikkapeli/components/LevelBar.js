import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';

export default function LevelBar({ progress, label, playerLevel, gameType }) {
    const progressWidth = useSharedValue(0);
    const [gifVisible, setGifVisible] = useState(false);
    const [levelImage, setLevelImage] = useState(null);
    const gifTimer = useRef(null); // Keep the gif timer reference

    // Use refs to keep track of last points without triggering re-renders
    const imageLastPointRef = useRef(0);
    const soundLastPointRef = useRef(0);
    const comparisonLastPointRef = useRef(0);
    const bondsLastPointRef = useRef(0);

    useEffect(() => {
        // Normalize progress to stay between 0 and 100
        const normalizedProgress =
            gameType === "bonds"
                ? Math.min(((progress - (playerLevel - 3) * 5) / 5) * 100, 100)
                : Math.min(((progress - (playerLevel - 1) * 5) / 5) * 100, 100);

        console.log(`Normalized Progress for ${gameType}: ${normalizedProgress}`);
        progressWidth.value = withTiming(normalizedProgress, { duration: 500 });

        // Determine the current milestone
        const milestone = Math.floor(progress / 5) * 5; // Get the nearest multiple of 5 below or equal to progress
        console.log(`Milestone for ${gameType}: ${milestone}`);

        // Track the GIF visibility and milestones for each game type
        if (gameType === "imageToNumber" && imageLastPointRef.current < progress) {
            console.log(`GIF triggered for 'imageToNumber' at progress: ${progress}, last point: ${imageLastPointRef.current}`);
            setGifVisible(true);
            if (gifTimer.current) clearTimeout(gifTimer.current); // Clear any existing timer
            gifTimer.current = setTimeout(() => {
                console.log(`Hiding GIF for 'imageToNumber' at progress: ${progress}`);
                setGifVisible(false); // Hide the GIF after the timeout
            }, 2000);
            // Update last point for 'imageToNumber' using ref
            imageLastPointRef.current = progress;
        }

        if (gameType === "soundToNumber" && soundLastPointRef.current < progress) {
            console.log(`GIF triggered for 'soundToNumber' at progress: ${progress}, last point: ${soundLastPointRef.current}`);
            setGifVisible(true);
            if (gifTimer.current) clearTimeout(gifTimer.current);
            gifTimer.current = setTimeout(() => {
                console.log(`Hiding GIF for 'soundToNumber' at progress: ${progress}`);
                setGifVisible(false);
            }, 2000);
            // Update last point for 'soundToNumber' using ref
            soundLastPointRef.current = progress;
        }

        if (gameType === "comparison" && comparisonLastPointRef.current < progress) {
            console.log(`GIF triggered for 'comparison' at progress: ${progress}, last point: ${comparisonLastPointRef.current}`);
            setGifVisible(true);
            if (gifTimer.current) clearTimeout(gifTimer.current);
            gifTimer.current = setTimeout(() => {
                console.log(`Hiding GIF for 'comparison' at progress: ${progress}`);
                setGifVisible(false);
            }, 2000);
            // Update last point for 'comparison' using ref
            comparisonLastPointRef.current = progress;
        }

        if (gameType === "bonds" && bondsLastPointRef.current < progress) {
            console.log(`GIF triggered for 'bonds' at progress: ${progress}, last point: ${bondsLastPointRef.current}`);
            setGifVisible(true);
            if (gifTimer.current) clearTimeout(gifTimer.current);
            gifTimer.current = setTimeout(() => {
                console.log(`Hiding GIF for 'bonds' at progress: ${progress}`);
                setGifVisible(false);
            }, 2000);
            // Update last point for 'bonds' using ref
            bondsLastPointRef.current = progress;
        }

        // Define level images and gifs
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
            5: require('../assets/purkki.gif'),
            10: require('../assets/purkki1.gif'),
            15: require('../assets/purkki3.gif'),
            20: require('../assets/purkki4.gif'),
            25: require('../assets/purkki5.gif'),
            30: require('../assets/purkki6.gif'),
            35: require('../assets/purkki7.gif'),
            40: require('../assets/purkki8.gif'),
            45: require('../assets/purkki9.gif'),
            50: require('../assets/purkki10.gif'),
        };

        if (gifVisible) {
            setLevelImage(levelGifs[milestone] || levelImages[0]);
            console.log(`GIF visible for milestone: ${milestone}, setting image: ${levelGifs[milestone] || levelImages[0]}`);
        } else {
            const level = Math.floor(progress / 5);
            setLevelImage(levelImages[level] || levelImages[0]);
            console.log(`GIF hidden for milestone: ${milestone}, setting image: ${levelImages[level] || levelImages[0]}`);
        }
    }, [
        progress,
        gifVisible,
        gameType,
        playerLevel
    ]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.progressContainer}>
                <View style={styles.barAndScaleContainer}>
                    <View style={styles.barContainer}>
                        <Animated.View style={[styles.progressBar, progressStyle]} />
                    </View>
                    <View style={styles.scaleContainer}>
                        {Array.from({ length: 6 }, (_, i) => (
                            <Text key={i} style={styles.scaleText}>
                                {i}
                            </Text>
                        ))}
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={levelImage} style={styles.levelImage} />
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
        color: '#333',
    },
    levelImage: {
        width: 40,
        height: 70,
        padding: 10,
    },
});
