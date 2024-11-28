import { View, Text, Pressable, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Corrected import
import styles from '../styles';
import ProfileScreen from './ProfileScreen';
import CreateProfile from './CreateProfile';
import {collection, query, where, getDocs  } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import { ScoreContext } from '../components/ScoreContext';
import { recievePlayerStatsFromDatabase, savePlayerStatsToDatabase } from '../firebase/Functions';

const fetchCharactersDatabase = async (email) => {
  try {
    console.log('Fetching characters for email:', email);

    // Luo kyselyn, joka rajoittaa tulokset annettuun sähköpostiin
    const q = query(
      collection(firestore, 'playerstats'),
      where('email', '==', email) // Tämä ehto varmistaa, että haetaan vain oikean sähköpostin tiedot
    );

    const querySnapshot = await getDocs(q); // Suorita kysely Firestoreen

    // Mapataan tulokset objekteiksi
    const characters = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Fetched characters:', characters); // Debugging log to see fetched characters
    return characters;
  } catch (error) {
    console.error('Virhe noudaettaessa hahmotietoja', error);
    return [];
  }
};

const animalImages = {
  fox: require('../assets/proffox.png'),
  bear: require('../assets/profbear.png'),
  rabbit: require('../assets/profrabbit.png'),
  wolf: require('../assets/profwolf.png'),
};

export default function SelectProfile({ route, navigation }) {
  const { showCreate } = route.params;
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { email, setEmail, playerName, setPlayerName, setImageID, setCareer, setPlayerLevel, savePlayerStatsToDatabase, updatePlayerStatsToDatabase, handleUpdatePlayerStatsToDatabase, setImageToNumberXp, setSoundToNumberXp, setComparisonXp, setBondsXp } = useContext(ScoreContext)

  useEffect(() => {
    if (characters && characters.length > 0) {
      setEmail(selectedCharacter.email);
      setPlayerName(selectedCharacter.playerName);
      setImageID(selectedCharacter.imageID);
      setCareer(selectedCharacter.career);
      setPlayerLevel(selectedCharacter.playerLevel);
      setImageToNumberXp(selectedCharacter.imageToNumberXp);
      setSoundToNumberXp(selectedCharacter.soundToNumberXp);
      setComparisonXp(selectedCharacter.comparisonXp);
      setBondsXp(selectedCharacter.bondsXp);
    } else {
      console.log('No characters found');
    }
  }, [selectedCharacter]);

  // Fetch email from AsyncStorage when the component loads
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email'); // Get the email from AsyncStorage
        if (storedEmail) {
          setEmail(storedEmail); // Set the email in the state
        } else {
          console.log('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage', error);
      }
    };
    loadEmail();
  }, []);

  // Log email to confirm it's being passed
  useEffect(() => {
    console.log('SelectProfile loaded with email:', email);
  }, [email]);

  useEffect(() => {
    if (email && email !== '') {  // Ensure email is non-empty
      console.log('Fetching characters for email:', email);
      const loadCharacters = async () => {
        const data = await fetchCharactersDatabase(email);
        setCharacters(data);
      };
      loadCharacters();
    } else {
      console.log('Email is not set or invalid');
    }
  }, [email]);  // This will now only run when `email` is updated 

  const handleNewProfile = async (newProfile) => {
    try {
      await savePlayerStatsToDatabase(newProfile); // Tallenna profiili tietokantaan
    } catch (error) {
      console.error('Virhe profiilin luomisessa:', error);
      alert('Profiilin luominen epäonnistui');
    } finally {
      const updatedCharacters = await fetchCharactersDatabase(email);
      setCharacters(updatedCharacters); // Päivitä profiilit
    }
  };

  if (selectedCharacter) {
    return (
      <ProfileScreen
        character={selectedCharacter}
        onBack={() => setSelectedCharacter(null)}
      />
    );
  }

  if (isCreatingProfile || showCreate) {
    return (
      <CreateProfile
        onCancel={() => setIsCreatingProfile(false)}
        onSave={handleNewProfile}
        email={email} // Lähetetään edelleen sähköposti
      />
    );
  }

  return (
    <View>
      <View style={styles.profileSelect}>
        {[...Array(4)].map((_, index) => {
          const character = characters[index];
          return (
            <Pressable
              key={index}
              style={styles.chooseProfile}
              onPress={() => character ? setSelectedCharacter(character) : setIsCreatingProfile(true)}
            >
              {character ? (
                <Image source={animalImages[character.imageID]} style={styles.picProfile} />
              ) : (
                <View style={styles.addIcon}>
                  <FontAwesome5 name="plus" size={40} color="black" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
