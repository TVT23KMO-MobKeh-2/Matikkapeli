import { View, Text, Button, Image } from 'react-native'
import React from 'react'
import styles from '../styles'
import LevelBar from '../components/LevelBar'
import { useNavigation } from '@react-navigation/native';  // Import the hook

const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
};



export default function ProfileScreen({ character, onBack }) {
    const navigation = useNavigation();  // Get the navigation prop using the hook

    const { imageID, playerName, career, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp } = character;
    const characterImage = animalImages[imageID];

    const startGame = () => {
        console.log('Navigating to Animation with profile:', character);
        navigation.navigate('Animation', { profile: character });  // Now works with the hook
    };

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    return (
        <View style={styles.container}>
            <View style={styles.profilebox}>
                <Image
                    source={characterImage}
                    style={styles.profileImage}
                />
                <View>
                    <Text>Nimi: {playerName}</Text>
                    <Text>Ammatti: {career}</Text>
                    <Text>Taso: {playerLevel}</Text>
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
        </View>
    );
}