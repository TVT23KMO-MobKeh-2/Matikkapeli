import { View, Text, Button, Image, ImageBackground } from 'react-native'
import styles, {getBGImage} from '../styles'
import LevelBar from '../components/LevelBar'
import { useNavigation } from '@react-navigation/native';  // Import the hook
import { deletePlayerDataFromDatabase } from '../firebase/Functions';
import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';

const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
};



export default function ProfileScreen({ character, onBack }) {
    const navigation = useNavigation();  // Get the navigation prop using the hook
    const [isDeleting, setIsDeleting] = useState(false);

    const {email, imageID, playerName, career, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp } = character;
    const characterImage = animalImages[imageID];

    const { isDarkTheme } = useTheme();

    const startGame = () => {
        console.log('Navigating to Animation with profile:', character);
        navigation.navigate('Animation', { profile: character });  // Now works with the hook
    };

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    const handleDeleteProfile = async () => {
        setIsDeleting(true); // Set loading state
        try {
            await deletePlayerDataFromDatabase({ email, playerName });
            Alert.alert('Success', 'Profile deleted successfully');
            navigation.goBack()
        } catch (error) {
            Alert.alert('Error', 'Failed to delete profile');
        } finally {
            setIsDeleting(false); // Reset loading state
        }
    };

    return (
        <ImageBackground 
        source={getBGImage(isDarkTheme)} 
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
                    <Text style = {styles.label}>Nimi: {playerName}</Text>
                    <Text style = {styles.label}>Ammatti: {career}</Text>
                    <Text style = {styles.label}>Taso: {playerLevel}</Text>
                </View>
            </View>
            <View style={styles.profileSelect}>
                <LevelBar progress={imageToNumberXp} label={"Kuvat numeroiksi"} />
                <LevelBar progress={soundToNumberXp} label={"Äänestä numeroiksi"} />
                <LevelBar progress={comparisonXp} label={"Vertailu"} />
                <LevelBar progress={bondsXp} label={"Hajonta"} />
            </View>
            <Button title='Aloita peli' onPress={startGame}></Button>
            <Button title='Palaa takaisin' onPress={goBack} />
            <Button
                title={isDeleting ? 'Poistetaan...' : 'Poista profiili'}
                onPress={handleDeleteProfile}
                disabled={isDeleting} 
                color="red"
            />
        </View>
    </ImageBackground>
    );
}