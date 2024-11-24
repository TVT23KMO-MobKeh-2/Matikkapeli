import React from 'react';
import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';
import styles from '../styles';


export default function TaskWindow({ taskVisible, setTaskVisible, navigation, profile}) {
    const backgroundImage = require('../assets/sign2.png'); 
    const apple = require('../assets/apple2.png'); 
    const note = require('../assets/note1.png');
    const bond = require('../assets/bond2.png');
    const conv = require('../assets/conv1.png');


    if (!taskVisible) return null;

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
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                navigation.navigate('ComparisonOperators', { profile });
                                setTaskVisible(false); 
                            }}>
                            <Image source={conv} style={styles.taskImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                navigation.navigate('Bonds', { profile });
                                setTaskVisible(false);
                            }}>
                            <Image source={bond} style={styles.taskImage} />
                        </Pressable>
                    </View>

                    <Pressable onPress={() => setTaskVisible(false)}>
                        <Text style={styles.closeText}>Sulje</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}
