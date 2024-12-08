import { View, Text, Button, Image, ImageBackground, Alert, Pressable } from 'react-native'
import LevelBar from '../components/LevelBar'
import { useNavigation } from '@react-navigation/native';  // Import the hook
import { deletePlayerDataFromDatabase } from '../firebase/Functions';
import React, { useState } from 'react';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';

const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
};



export default function ProfileScreen({ route, navigation }) {
    // Get the navigation prop using the hook
    const [isDeleting, setIsDeleting] = useState(false);
    const { character } = route.params;
    const [setPlayerName] = useState('')
    const [setImageID] = useState('')
    const [setPlayerLevel] = useState(1);

    if (!character) {
        return (
            <View style={styles.container}>
                <Text>No character found.</Text>
            </View>
        );
    }

    const { email, imageID, playerName, career, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp } = character;
    const characterImage = animalImages[imageID];

    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? dark : light;
    const styles = createStyles(theme);
    const bgIndex = 0;
    

    const resetTrigger = playerLevel;

    const startGame = () => {
        console.log('Navigating to Animation with profile:', character);
        navigation.navigate('Animation', { profile: character });  // Now works with the hook
    };

    const goBack = () => {
        navigation.navigate('SelectProfile', { email: email });  // Goes back to the previous screen
    };

    const clearProfile = async () => {
        try {
            await AsyncStorage.removeItem('playerName');
            await AsyncStorage.removeItem('imageID');

            setPlayerName('');
            setImageID('');
        } catch (e) {
            
        }
    }

    const handleDeleteProfile = async () => {
        setIsDeleting(true); // Set loading state
        try {
            console.log('Deleting profile...');
            await deletePlayerDataFromDatabase({ email, playerName });
            clearProfile()
            Alert.alert('Poisto onnistui', 'Profiili poistettu onnistuneesti');
            console.log('Profile deleted, navigating to SelectProfile');

            // Debugging Navigation
            console.log('Navigating to SelectProfile with email:', email);
            navigation.navigate('SelectProfile', { email: email });
        } catch (error) {
            console.error('Error deleting profile:', error);
            Alert.alert('Error', 'Failed to delete profile');
        } finally {
            console.log('Resetting deleting state');
            setIsDeleting(false); // Reset loading state
        }
    };

    return (
        <ImageBackground
            source={getBGImage(isDarkTheme, bgIndex)}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={[styles.container, { paddingTop: 0 }]}>
                <View style={styles.profilebox}>
                    <Image
                        source={characterImage}
                        style={styles.profileImage}
                    />
                    <View>
                        <Text style={styles.label}>Nimi: {playerName}</Text>
                        <Text style={styles.label}>Ammatti: {career}</Text>
                        <Text style={styles.label}>Taso: {playerLevel}</Text>
                    </View>
                </View>
                <View style={styles.profileSelect}>
                <LevelBar progress={imageToNumberXp} label={"KUVAT NUMEROIKSI"} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"profile"}/>
                    <LevelBar progress={soundToNumberXp} label={"ÄÄNESTÄ NUMEROIKSI"} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"profile"}/>
                    <LevelBar progress={comparisonXp} label={"VERTAILU"} playerLevel={playerLevel} gameType={"comparison"} caller={"profile"}/>
                    <LevelBar progress={bondsXp} label={"HAJONTA"} playerLevel={playerLevel} gameType={"bonds"} caller={"profile"}/>
                </View>
                <View style={styles.buttonContainer1}>
                    <Pressable onPress={startGame}
                        style={styles.startButton}>
                        <Text style={styles.buttonText}>ALOITA PELI</Text>
                    </Pressable>
                    <Pressable onPress={goBack}
                        style={styles.startButton}>
                        <Text style={styles.buttonText}>PALAA TAKAISIN</Text>
                    </Pressable>
                    <Pressable onPress={handleDeleteProfile}
                        disabled={isDeleting}
                        style={[styles.startButton,
                        {
                            backgroundColor: isDeleting ? 'gray' : 'darkred',
                            opacity: isDeleting ? 0.6 : 1,
                        },
                        ]}>
                        <Text style={[styles.buttonText, {color: 'white'}]}>
                            {isDeleting ? 'POISTETAAN...' : 'POISTA PROFIILI'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    );
}
