import { View, Text, Button, Image } from 'react-native'
import React from 'react'
import styles from '../styles'
import LevelBar from '../components/LevelBar'

export default function ProfileScreen({ character, onBack }) {

    return (
        <View style={styles.container}>
            <View style={styles.profilebox}>
                <Image
                    source={character.profilePic}
                    style={styles.profileImage}
                />
                <View>
                    <Text>Nimi: {character.name}</Text>
                    <Text>Ammatti: {character.career}</Text>
                    <Text>Taso: {character.level}</Text>
                </View>

            </View>
            <View style={styles.profileSelect}>
                <LevelBar progress={character.imageToNumberxP} label={"Kuvat numeroiksi"} />
                <LevelBar progress={character.soundToNumberXp} label={"Äänestä numeroiksi"} />
                <LevelBar progress={character.comparisonXp} label={"Vertailu"} />
                <LevelBar progress={character.bondsXp} label={"Hajonta"} />
            </View>

            <Button title="Palaa takaisin" onPress={onBack} />
        </View>
    )
}