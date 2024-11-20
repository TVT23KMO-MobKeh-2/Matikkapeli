import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles';


const fetchCharactersDatabase = () => {
    return Promise.resolve([
        {
            id: 1,
            name: 'Tunski',
            career: 'Rakentaja',
            profilePic: require('../assets/proffox.png'),
            level: 5,
            ImageToNumber: 40,
            SoundToNumber: 30,
            Comparison: 25,
            Bonds: 20,
        },
        {
            id: 2,
            name: 'Pekka',
            career: 'Lääkäri',
            profilePic: require('../assets/profbear.png'),
            level: 3,
            ImageToNumber: 30,
            SoundToNumber: 25,
            Comparison: 15,
            Bonds: 10,
        },
    ])

}


export default function SelectProfile() {

    const [characters, setCharacters] = useState([])
    const [selectedCharacter, setSelectedCharacter] = useState(null)

    useEffect(() => {
        const loadCharacters = async () => {
            const data = await fetchCharactersDatabase()
            setCharacters(data)
        }
        loadCharacters()
    }, [])

    return (
        <View>
            <View style={styles.profileSelect}>
                {[...Array(4)].map((_, index) => {
                    const character = characters[index]
                    return (
                        <Pressable
                            key={index}
                            style={styles.chooseProfile}
                            onPress={() => setSelectedCharacter(character)}
                        >
                            {character ? (
                                <Image
                                    source={character.profilePic}
                                    style={styles.picProfile}></Image>
                            ) : (
                                <View style={styles.addIcon}>
                                    <FontAwesome5 name="plus" size={40} color="black" />
                                </View>
                            )}
                        </Pressable>
                    )
                })}
            </View>
        </View>
    )
}