import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';
import { ScoreContext } from '../components/ScoreContext';
import React, { useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 


export default function TaskWindow({ taskVisible, setTaskVisible, navigation, profile}) {
    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme ? dark : light);
    
    const backgroundImage = require('../assets/sign2.png'); 
    const apple = require('../assets/apple2.png'); 
    const note = require('../assets/note1.png');
    const bond = require('../assets/bond2.png');
    const conv = require('../assets/conv1.png');
    const {imageToNumberXp, soundToNumberXp, playerLevel, } = useContext(ScoreContext);
    
    
    useFocusEffect(
        useCallback(() => {
            console.log('TaskWindow is focused');
            // Perform necessary state resets or checks here
        }, [])
    );
    

    if (!taskVisible) return null;

    const isDivisibleByFive = (imageToNumberXp % (5 * playerLevel) === 0) && (soundToNumberXp % (5 * playerLevel) === 0)
    console.log({
        imageToNumberXp,
        soundToNumberXp,
        playerLevel,
        isDivisibleByFive,
    }); 
    return (
        <View style={[styles.container, { position: 'absolute', zIndex: 5 }]}>
            <ImageBackground 
                source={backgroundImage} 
                style={styles.backgroundImage} 
                resizeMode="cover"
                pointerEvents="box-none">
                <View style={styles.content}>
                    <View style={styles.grid} >
                        <Text>{profile.playername}</Text>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                console.log('Navigating to ImageToNumbers');
                                navigation.navigate('ImageToNumbers', { profile });
                                setTaskVisible(false); 
                            }}>
                            <Image source={apple} style={styles.taskImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                console.log('Navigating to SoundToNumbers');
                                navigation.navigate('SoundToNumbers', { profile });
                                console.log('profileeee', profile);
                                setTaskVisible(false); 
                            }}>
                            <Image source={note} style={styles.taskImage} />
                        </Pressable>
                        
                        {imageToNumberXp >= 5 && soundToNumberXp >= 5 && isDivisibleByFive && (
                            <Pressable 
                             style={styles.taskContainer}
                            onPress={() => { 
                                navigation.navigate('ComparisonOperators', { profile });
                                setTaskVisible(false); 
                            }}>
                            <Image source={conv} style={styles.taskImage} />
                    
                        </Pressable>
                        )}
                        {imageToNumberXp >= 15 && soundToNumberXp >= 15 && playerLevel >= 3 && isDivisibleByFive && (
                           <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                navigation.navigate('Bonds', { profile });
                                setTaskVisible(false);
                            }}>
                            <Image source={bond} style={styles.taskImage} />
                        </Pressable> 
                        )}   
                        
                    </View>

                    <Pressable onPress={() => setTaskVisible(false)}>
                        <Text style={styles.closeText}>Sulje</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}
