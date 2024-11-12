import React from 'react';
import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';

export default function TaskWindow({ modalVisible, setModalVisible, onNavigate }) {
    const backgroundImage = require('../assets/sign2.png'); 
    const apple = require('../assets/apple2.png'); 
    const note = require('../assets/note1.png');
    const bond = require('../assets/bond2.png');
    const conv = require('../assets/conv1.png');

    if (!modalVisible) return null;

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={backgroundImage} 
                style={styles.backgroundImage} 
                resizeMode="cover">
                <View style={styles.content}>
                    <View style={styles.grid}>
                        <Pressable 
                            style={styles.foxContainer}
                            onPress={() => { 
                                onNavigate('ImageToNumbers'); 
                                setModalVisible(false); // Close modal after selecting task
                            }}>
                            <Image source={apple} style={styles.foxImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.foxContainer}
                            onPress={() => { 
                                onNavigate('SoundToNumbers'); 
                                setModalVisible(false); // Close modal after selecting task
                            }}>
                            <Image source={note} style={styles.foxImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.foxContainer}
                            onPress={() => { 
                                onNavigate('ComparisonOperators'); 
                                setModalVisible(false); // Close modal after selecting task
                            }}>
                            <Image source={conv} style={styles.foxImage} />
                        </Pressable>
                        <Pressable 
                            style={styles.foxContainer}
                            onPress={() => { 
                                onNavigate('NumberBonds'); 
                                setModalVisible(false); // Close modal after selecting task
                            }}>
                            <Image source={bond} style={styles.foxImage} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    content: {
        padding: 0,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    taskText: {
        fontSize: 14,
        marginBottom: 8,
        color: 'white'
    },
    closeText: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allows items to wrap in the container
        justifyContent: 'center', // Center items
        alignItems: 'center', // Center items vertically
        width: '100%', // You can adjust the width as needed
        marginTop: 30
    },
    foxContainer: {
        width: '45%', // Each item takes almost half the width for 2 items in a row
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10, 
    },
    foxImage: {
        width: 60, // Adjust size as needed
        height: 60, // Adjust size as needed
    },
});