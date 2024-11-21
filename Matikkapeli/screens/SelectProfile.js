import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles';
import ProfileScreen from './ProfileScreen';
import CreateProfile from './CreateProfile';



const fetchCharactersDatabase = () => {
    return Promise.resolve([
        {
            id: 1,
            name: 'Tunski',
            career: 'Rakentaja',
            profilePic: require('../assets/proffox.png'),
            level: 5,
            imageToNumberxP: 0,
            soundToNumberXp: 0,
            comparisonXp: 0,
            bondsXp: 0,
        },
        {
            id: 2,
            name: 'Pekka',
            career: 'Lääkäri',
            profilePic: require('../assets/profbear.png'),
            level: 3,
            imageToNumberxP: 0,
            soundToNumberXp: 0,
            comparisonXp: 0,
            bondsXp: 0,
        },
    ])

}


export default function SelectProfile() {

    const [characters, setCharacters] = useState([])
    const [selectedCharacter, setSelectedCharacter] = useState(null)
    const [isCreatingProfile, setIsCreatingProfile] = useState(false)

    useEffect(() => {
        const loadCharacters = async () => {
            const data = await fetchCharactersDatabase()
            setCharacters(data)
        }
        loadCharacters()
    }, [])

    const handleNewProfile = (newProfile) => {
            setCharacters((prev) => [...prev, newProfile])
            setIsCreatingProfile(false)
    }


    if (selectedCharacter) {
        return (
            <ProfileScreen
            character={selectedCharacter}
            onBack={() => setSelectedCharacter(null)}
            />
        )
    }

    if (isCreatingProfile){
        return (
            <CreateProfile onCancel={() => setIsCreatingProfile(false)} onSave={handleNewProfile}/>
        )
    }

    return (
        <View>
            <View style={styles.profileSelect}>
                {[...Array(4)].map((_, index) => {
                    const character = characters[index]
                    return (
                        <Pressable
                            key={index}
                            style={styles.chooseProfile}
                            onPress={() => character 
                                ? setSelectedCharacter(character)
                            : setIsCreatingProfile(true)}
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