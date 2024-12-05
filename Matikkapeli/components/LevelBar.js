import { View, Text, StyleSheet } from 'react-native'; 
import React, { useEffect, useState, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';

const milestones = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

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

export default function LevelBar({ progress, label, playerLevel, gameType }) {
    const progressWidth = useSharedValue(0);
    const [gifVisible, setGifVisible] = useState(false);
    const [levelImage, setLevelImage] = useState(null);
    const gifTimer = useRef(null); // Keep the gif timer reference
    const lastPointRef = useRef({ imageToNumber: 0, soundToNumber: 0, comparison: 0, bonds: 0 });

    const normalizeProgress = (progress, playerLevel) => {
        return gameType === "bonds"
            ? playerLevel < 3
                ? 0
                : Math.min(((progress - (playerLevel - 3) * 5) / 5) * 100, 100)
            : Math.min(((progress - (playerLevel - 1) * 5) / 5) * 100, 100);
    };

    const updateMilestoneImage = (milestone, gameType) => {
        const newImage = gifVisible ? levelGifs[milestone] : levelImages[Math.floor(milestone / 5)];
        if (newImage !== levelImage) {
            setLevelImage(newImage); // Only set image if it has changed
            console.log(`Updating image: gifVisible = ${gifVisible}, newImage = ${newImage}`);
        }
    };

    const handleMilestoneGif = (milestone, gameType) => {
        if (lastPointRef.current[gameType] < progress) {
            if (milestones.includes(milestone)) {
                console.log(`Milestone reached: ${milestone}, GameType: ${gameType}, Progress: ${progress}`);
    
                // Set the GIF visibility to true, and set the GIF image immediately
                setGifVisible(true);
    
                // Delay the update of the levelImage until the gifVisible state has updated
                setTimeout(() => {
                    setLevelImage(levelGifs[milestone] || levelImages[0]);
                    console.log(`GIF Visible: ${gifVisible}, Setting image: ${levelGifs[milestone] || levelImages[0]}`);
                }, 50); // Small delay to allow gifVisible state to apply
    
                // Hide the GIF after 2 seconds and set the static image
                clearTimeout(gifTimer.current);
                gifTimer.current = setTimeout(() => {
                    setGifVisible(false); // Hide the GIF
                    setLevelImage(levelImages[Math.floor(milestone / 5)] || levelImages[0]); // Set the static image
                    console.log(`GIF Hidden after 2 seconds, setting static image: ${levelImages[Math.floor(milestone / 5)]}`);
                }, 2000); // 2 seconds duration for GIF
            }
            lastPointRef.current[gameType] = progress;
        }
    };
    
    

    useEffect(() => {
        const normalizedProgress = normalizeProgress(progress, playerLevel);
        progressWidth.value = withTiming(normalizedProgress, { duration: 500 });

        const milestone = Math.floor(progress / 5) * 5;
        console.log(`Milestone for ${gameType}: ${milestone}, Progress: ${progress}, PlayerLevel: ${playerLevel}`);

        handleMilestoneGif(milestone, gameType);
        updateMilestoneImage(milestone, gameType);
    }, [progress, gameType, playerLevel]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    useEffect(() => {
        return () => {
            if (gifTimer.current) {
                clearTimeout(gifTimer.current); // Clean up timer on unmount
            }
        };
    }, []);

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
        resizeMode: 'contain',
    },
});
