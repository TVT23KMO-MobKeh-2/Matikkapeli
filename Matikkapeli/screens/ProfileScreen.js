import { View, Text, Button, Image, ImageBackground, Alert } from 'react-native'
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

    if (!character) {
        return (
          <View style={styles.container}>
            <Text>No character found.</Text>
          </View>
        );
      }

    const {email, imageID, playerName, career, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp } = character;
    const characterImage = animalImages[imageID];

    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? dark : light; 
    const styles = createStyles(theme);  
    const bgIndex = 0;    

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
            console.error('Virhe tietojen poistamisessa');
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
        <View style={[styles.container, {paddingTop: 0}]}>
            <View style={styles.profilebox}>
                <Image
                    source={characterImage}
                    style={styles.profileImage}
                />
                <View>
                    <Text style = {styles.label}>NIMI: {playerName}</Text>
                    <Text style = {styles.label}>AMMATTI: {career}</Text>
                    <Text style = {styles.label}>TASO: {playerLevel}</Text>
                </View>
            </View>
            <View style={styles.profileSelect}>
                <LevelBar progress={imageToNumberXp} label={"Kuvat numeroiksi"} />
                <LevelBar progress={soundToNumberXp} label={"Äänestä numeroiksi"} />
                <LevelBar progress={comparisonXp} label={"Vertailu"} />
                <LevelBar progress={bondsXp} label={"Hajonta"} />
            </View>
            <Button title='ALOITA PELI' onPress={startGame}></Button>
            <Button title='PALAA TAKAISIN' onPress={goBack} />
            <Button
                title={isDeleting ? 'POISTETAAN...' : 'POISTA PROFIILI'}
                onPress={handleDeleteProfile}
                disabled={isDeleting} 
                color="red"
            />
        </View>
    </ImageBackground>
    );
}
