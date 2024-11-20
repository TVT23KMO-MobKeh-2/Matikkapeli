import { View, Text, Button, Image } from 'react-native'
import React from 'react'
import styles from '../styles'
import LevelClock from '../components/LevelClock'

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
                 <LevelClock progress={character.ImageNumber} label={"Kuvat numeroiksi"}/>
                 <LevelClock progress={character.SoundNumber} label={"Kuvat numeroiksi"}/>
                 <LevelClock progress={character.Comparisons} label={"Kuvat numeroiksi"}/>
                 <LevelClock progress={character.Bondss} label={"Kuvat numeroiksi"}/>
                </View> 
            </View>
            <Button title="Palaa takaisin" onPress={onBack} />
        </View>
    )
}