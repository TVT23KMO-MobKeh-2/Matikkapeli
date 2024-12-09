import { View, Pressable, Image, ImageBackground, Text } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Corrected import
import ProfileScreen from './ProfileScreen';
import CreateProfile from './CreateProfile';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import { ScoreContext } from '../components/ScoreContext';
import { recievePlayerStatsFromDatabase, savePlayerStatsToDatabase } from '../firebase/Functions';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


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
  const { showCreate} = route.params;
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { email, setEmail, playerName, setPlayerName, setImageID, setCareer, setPlayerLevel, savePlayerStatsToDatabase, updatePlayerStatsToDatabase, handleUpdatePlayerStatsToDatabase, setImageToNumberXp, setSoundToNumberXp, setComparisonXp, setBondsXp } = useContext(ScoreContext)
  const [password, setPassword] = useState(''); // Corrected initialization
  
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light; 
  const styles = createStyles(theme);  
  const bgIndex = 0; 

  useEffect(() => {
    if (email) {
      const loadCharacters = async () => {
        const data = await fetchCharactersDatabase(email);
        setCharacters(data);
      };
      loadCharacters();
    }
  }, [email]);
  

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

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email'); // Get the email from AsyncStorage
        const storedPassword = await AsyncStorage.getItem('password'); // Get the password from AsyncStorage
        if (storedEmail) {
          setEmail(storedEmail); // Set the email in the state
        }
          if (storedPassword) {
          setPassword(storedPassword); // Set the password in the state
        } else {
          console.log('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage', error);
      }
    };
    loadEmail();
  }, []);
  

  useEffect(() => {
    const loadStoredProfile = async () => {
      try {
        const storedPlayerName = await AsyncStorage.getItem('playerName');
        const storedImageID = await AsyncStorage.getItem('imageID');
  
        if (storedPlayerName && storedImageID) {
          // Pre-select or load profile from AsyncStorage if available
          setPlayerName(storedPlayerName);
          setImageID(storedImageID);
        }
      } catch (error) {
        console.error('Error loading stored profile:', error);
      }
    };
  
    loadStoredProfile();
  }, []);


  // Log email to confirm it's being passed
  useEffect(() => {
  }, [email]);
  

  // Trigger navigation after setting selected character
  const handleSelectCharacter = (character) => {
    if (character) {
      setSelectedCharacter(character); // Set character if it's valid
      navigation.navigate('ProfileScreen', { character: character });
    } else {
      setIsCreatingProfile(true); // If no character, go to create profile
    }
  };
  
  const handleNewProfile = async (newProfile) => {
    try {
      await savePlayerStatsToDatabase(newProfile); 
      await AsyncStorage.setItem('playerName', newProfile.playerName);
    await AsyncStorage.setItem('imageID', newProfile.imageID.toString());
    } catch (error) {
      console.error('Virhe profiilin luomisessa:', error);
      alert('Profiilin luominen epäonnistui');
    } finally {
      const updatedCharacters = await fetchCharactersDatabase(email);
      setCharacters(updatedCharacters);
    }
  };

  if (isCreatingProfile || showCreate) {
    return (
      <CreateProfile
        onCancel={() => setIsCreatingProfile(false)}
        onSave={handleNewProfile}
        email={email} 
        password={password}
      />
    );
  }

  return (
    <ImageBackground 
    source={getBGImage(isDarkTheme, bgIndex)} 
    style={styles.background} 
    resizeMode="cover"
    >
    <View style = {[styles.container, {paddingTop: 0}]}>
      <Text style={styles.title}>VALITSE PROFIILI</Text>
      <View style={styles.profileSelect}>
        {[...Array(4)].map((_, index) => {
          const character = characters[index];
          return (
            <Pressable
              key={index}
              style={styles.chooseProfile}
              onPress={() => {
                if (character) {
                  setSelectedCharacter(character);
                  handleSelectCharacter(character);
                } else {
                  setIsCreatingProfile(true);
                }
              }}
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
    </ImageBackground>
  );
}
