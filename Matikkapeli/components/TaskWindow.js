import React from 'react';
import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';
import styles from '../styles';

export default function TaskWindow({ modalVisible, setModalVisible, onNavigate }) {
    const backgroundImage = require('../assets/sign2.png'); 
    const apple = require('../assets/apple2.png'); 
    const note = require('../assets/note1.png');
    const bond = require('../assets/bond2.png');
    const conv = require('../assets/conv1.png');


    if (!modalVisible) return null;

    return (
        <View style={[styles.container, { position: 'absolute' }]}>
            <ImageBackground 
                source={backgroundImage} 
                style={styles.backgroundImage} 
                resizeMode="cover">
                <View style={styles.content}>
                    <View style={styles.grid}>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                onNavigate('ImageToNumbers'); 
                                setModalVisible(false); 
                            }}>
                            <Image source={apple} style={styles.taskImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                onNavigate('SoundToNumbers'); 
                                setModalVisible(false); 
                            }}>
                            <Image source={note} style={styles.taskImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                onNavigate('ComparisonOperators'); 
                                setModalVisible(false); 
                            }}>
                            <Image source={conv} style={styles.taskImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.taskContainer}
                            onPress={() => { 
                                onNavigate('NumberBonds'); 
                                setModalVisible(false);
                            }}>
                            <Image source={bond} style={styles.taskImage} />
                        </Pressable>
                    </View>

                    <Pressable onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeText}>Sulje</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    );
}
