import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';
import { ScoreContext } from '../components/ScoreContext';
import React, { useContext } from 'react'

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';


export default function TaskWindow({ taskVisible, setTaskVisible, navigation }) {
    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme ? dark : light);

    const backgroundImage = require('../assets/sign2.png');
    const apple = require('../assets/apple2.png');
    const note = require('../assets/note1.png');
    const bond = require('../assets/bond2.png');
    const conv = require('../assets/conv1.png');
    const appleready = require('../assets/apple2ready.png');
    const noteready = require('../assets/note1ready.png');
    const bondready = require('../assets/bond2ready.png');
    const convready = require('../assets/conv1ready.png');
    const { imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, playerName } = useContext(ScoreContext);

    if (!taskVisible) return null;

    const milestones = Array.from({ length: 10 }, (_, i) => (i + 1) * (5 * playerLevel));
    const milestonesBonds = Array.from({ length: 10 }, (_, i) => (i + 1) * ((5 * playerLevel)-10) );

    const isDivisibleByFive = (imageToNumberXp % (5 * playerLevel) === 0) && (soundToNumberXp % (5 * playerLevel) === 0)

    return (
        <View style={[styles.container, { position: 'absolute', zIndex: 5 }]}>
            <ImageBackground
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="cover"
                pointerEvents="box-none">
                <View style={styles.content}>
                    <View style={styles.grid} >
                        <Pressable
                            style={styles.taskContainer}
                            onPress={() => {
                                navigation.navigate('ImageToNumbers');
                                setTaskVisible(false);
                            }}>
                            <View style={styles.buttonWrapper}>
                                <View style={styles.imageWrapper}>
                                    {milestones.includes(imageToNumberXp) ? (
                                        <Image source={appleready} style={styles.taskImage} />
                                    ) : (
                                        <Image source={apple} style={styles.taskImage} />
                                    )}
                                </View>
                            </View>
                        </Pressable>
                        <Pressable
                            style={styles.taskContainer}
                            onPress={() => {
                                navigation.navigate('SoundToNumbers');
                                setTaskVisible(false);
                            }}>
                            <View style={styles.buttonWrapper}>
                                <View style={styles.imageWrapper}>
                                    {milestones.includes(soundToNumberXp) ? (
                                        <Image source={noteready} style={styles.taskImage} />
                                    ) : (
                                        <Image source={note} style={styles.taskImage} />
                                    )}
                                </View>
                            </View>
                        </Pressable>

                        {imageToNumberXp >= 5 && soundToNumberXp >= 5 && isDivisibleByFive && (
                            <Pressable
                                style={styles.taskContainer}
                                onPress={() => {
                                    navigation.navigate('ComparisonOperators');
                                    setTaskVisible(false);
                                }}>
                                <View style={styles.buttonWrapper}>
                                    <View style={styles.imageWrapper}>
                                        {milestones.includes(comparisonXp) ? (
                                            <Image source={convready} style={styles.taskImage} />
                                        ) : (
                                            <Image source={conv} style={styles.taskImage} />
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        {imageToNumberXp >= 15 && soundToNumberXp >= 15 && playerLevel >= 3 && isDivisibleByFive && (
                            <Pressable
                                style={styles.taskContainer}
                                onPress={() => {
                                    navigation.navigate('Bonds');
                                    setTaskVisible(false);
                                }}>
                                <View style={styles.buttonWrapper}>
                                    <View style={styles.imageWrapper}>
                                        {milestonesBonds.includes(bondsXp) ? (
                                            <Image source={bondready} style={styles.taskImage} />
                                        ) : (
                                            <Image source={bond} style={styles.taskImage} />
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        )}

                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
