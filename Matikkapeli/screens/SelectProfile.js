import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles';
import ProfileScreen from './ProfileScreen';
import CreateProfile from './CreateProfile';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import { savePlayerStatsToDatabase } from '../firebase/Functions';



const fetchCharactersDatabase = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "playerstats"))
        const characters = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
        return characters
    } catch (error) {
        console.error("Virhe noudaettaessa hahmotietoja", error)
        return []
    }
}

const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
};

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

    const handleNewProfile = async (newProfile) => {

        try {
            await savePlayerStatsToDatabase(newProfile) 
        } catch (error) {
            console.error("Virhe profiilin luomisessa:", error)
            alert("Profiilin luominen epäonnistui")
        } finally {
            const updatedCharacters = await fetchCharactersDatabase()
            setCharacters(updatedCharacters)
        }
    }


    if (selectedCharacter) {
        return (
            <ProfileScreen
                character={selectedCharacter}
                onBack={() => setSelectedCharacter(null)}
            />
        )
    }

    if (isCreatingProfile) {
        return (
            <CreateProfile onCancel={() => setIsCreatingProfile(false)} onSave={handleNewProfile} />
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
                                    source={animalImages[character.imageID]}
                                    style={styles.picProfile} />
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