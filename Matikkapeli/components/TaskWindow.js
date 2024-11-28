import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';
import styles from '../styles';
import { ScoreContext } from '../components/ScoreContext';
import React, { useContext } from 'react'


export default function TaskWindow({ taskVisible, setTaskVisible, navigation, profile}) {
    const backgroundImage = require('../assets/sign2.png'); 
    const apple = require('../assets/apple2.png'); 
    const note = require('../assets/note1.png');
    const bond = require('../assets/bond2.png');
    const conv = require('../assets/conv1.png');
    const {imageToNumberXp, soundToNumberXp, playerLevel, } = useContext(ScoreContext);


    if (!taskVisible) return null;

    const isDivisibleByFive = (imageToNumberXp % (5 * playerLevel) === 0) && (soundToNumberXp % (5 * playerLevel) === 0)

    return (
        <View style={[styles.container, { position: 'absolute', zIndex: 5 }]}>
            <ImageBackground 
                source={backgroundImage} 
                style={styles.backgroundImage} 
                resizeMode="cover">
                <View style={styles.content}>
                    <View style={styles.grid}>
                        <Text>{profile.playername}</Text>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                navigation.navigate('ImageToNumbers', { profile });
                                setTaskVisible(false); 
                            }}>
                            <Image source={apple} style={styles.taskImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                navigation.navigate('SoundToNumbers', { profile });
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
