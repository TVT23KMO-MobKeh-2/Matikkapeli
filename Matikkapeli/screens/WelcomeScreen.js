import { View, Text, TextInput, Pressable, ImageBackground, } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCreation from '../components/UserCreation';
import { deleteUserDataFromDatabase, recieveProfileByEmail } from '../firebase/Functions'; // Import your function
import { Alert } from 'react-native';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


export default function WelcomeScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [playerName, setPlayerName] = useState('')
    const [imageID, setImageID] = useState('')
    const [inputEmail, setInputEmail] = useState(''); // State for holding input email
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false); // State to toggle search mode
    const [profileData, setProfileData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? dark : light; 
    const styles = createStyles(theme);  
    const bgIndex = 0; 

    const getData = async () => {
        try {
            const emailValue = await AsyncStorage.getItem('email');
            if (emailValue !== null) {
                console.log('Sähköposti haettu AsyncStorage:sta:', emailValue);
                setEmail(emailValue);

            } else {
                console.log('Ei löytynyt sähköpostia AsyncStorage:sta');
            }
            const nameValue = await AsyncStorage.getItem('playername');
            if (nameValue !== null) {
                console.log('Sähköposti haettu AsyncStorage:sta:', nameValue);
                setPlayerName(nameValue);

            } else {
                console.log('Ei löytynyt sähköpostia AsyncStorage:sta');
            }
            const imageValue = await AsyncStorage.getItem('imageID');
            if (imageValue !== null) {
                console.log('Sähköposti haettu AsyncStorage:sta:', imageValue);
                setImageID(imageValue);

            } else {
                console.log('Ei löytynyt sähköpostia AsyncStorage:sta');
            }
        } catch (e) {
            console.error('Virhe tietojen hakemisessa', e);
        }
    };

    const clearemail = async () => {
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('playerName');
            await AsyncStorage.removeItem('imageID');

            setEmail('');
            setPlayerName('');
            setImageID('');
        } catch (e) {
            console.error('Virhe tietojen poistamisessa');
        }
    };

    const deletemail = async () => {
        setIsDeleting(true); // Set loading state
        try {
            await deleteUserDataFromDatabase({ email });
            Alert.alert('Success', 'Profile deleted successfully');
            navigation.goBack(); // Optionally, navigate back after deletion
            clearemail()
        } catch (error) {
            Alert.alert('Error', 'Failed to delete profile');
        } finally {
            setIsDeleting(false); // Reset loading state
        }
    }

    const handleSearchProfile = async () => {
        if (inputEmail) {
            try {
                console.log("Searching with Email:", inputEmail);

                // Call the function to retrieve profile by email
                await recieveProfileByEmail({
                    email: inputEmail,
                    setProfileData: (data) => {
                        console.log("Profile data retrieved:", data);
                        setProfileData(data); // Save the profile data in state
                        // Save profile data to AsyncStorage
                        AsyncStorage.setItem('email', inputEmail);
                    },
                    setDocId: (docId) => {
                        console.log("Profile document ID:", docId);
                        AsyncStorage.setItem('profileDocId', docId);
                    }
                });

                // Check if profileData exists
                if (!profileData || Object.keys(profileData).length === 0) {
                    console.log('Pelaajan profiilia ei löytynyt');
                    Alert.alert("Tunnusta ei löytynyt", "Profiilia ei löytynyt tietokannasta.");
                    return; // Prevent navigation if profile is not found
                }

                // If profile exists, save email and navigate
                console.log('Haetaan profiilia sähköpostilla:', inputEmail);
                navigation.navigate('SelectProfile', { email: inputEmail });

            } catch (error) {
                console.error("Error searching for profile", error);
                Alert.alert("Virhe", "Profiilin hakeminen ei onnistunut. Yritä myöhemmin uudestaan.");
            }
        } else {
            console.log('No email entered');
            Alert.alert("Virhe", "Sähköpostiosoite on pakollinen.");
        }
    };




    const toggleSearchMode = () => {
        setIsSearchMode(!isSearchMode); // Toggle the search mode on/off
        setInputEmail(''); // Clear input when toggling
    };

    useEffect(() => {
        getData();
    }, []);

    if (email) {
        return (
            <ImageBackground 
            source={getBGImage(isDarkTheme, bgIndex)} 
            style={styles.background} 
            resizeMode="cover"
          >
          <View style={styles.container}>
                <Text style = {styles.title}>WelcomeScreen</Text>
                    <View style={styles.optionsContainer}>
                    <Text style={styles.question}>HEI, {email}</Text>
                        <Pressable onPress={() => navigation.navigate('SelectProfile', { email: email })}
                            style={styles.startButton}>
                            <Text style={styles.buttonText}>VALITSE PROFIILI</Text>
                        </Pressable>
                        <Pressable onPress={(clearemail)}
                            style={[styles.startButton, {backgroundColor: 'red'}]}>
                            <Text style={styles.buttonText}> POISTA TUNNUS PUHELIMEN MUISTISTA</Text>
                        </Pressable>
                        <Pressable onPress={(deletemail)}
                            disabled={isDeleting} 
                            style={[ styles.startButton,
                                    {
                                        backgroundColor: isDeleting ? 'gray' : 'darkred', 
                                        opacity: isDeleting ? 0.6 : 1, 
                                    },
                            ]}>
                            <Text style={styles.buttonText}>
                            {isDeleting ? 'POISTETAAN...' : 'POISTA TUNNUS TIETOKANNASTA'}
                            </Text>
                        </Pressable>
                    </View>
        </View>
        </ImageBackground>
        );
    }

    if (isCreatingUser) {
        return (
            <UserCreation
                onNavigate={() => navigation.navigate('SelectProfile', { email: email })}
            />
        );
    }

    return (
        <ImageBackground 
        source={getBGImage(isDarkTheme)} 
        style={styles.background} 
        resizeMode="cover"
      >
        <View style={styles.container}>
            <Text style = {styles.title}>WelcomeScreen</Text>
            
            <View style={styles.optionsContainer}>
             <Text style={styles.question}>TERVETULOA!</Text>
               {isSearchMode ? (
                    <>
                        <TextInput
                            style={[styles.input, {backgroundColor: 'white'}]}
                            placeholder="SYÖTÄ KÄYTTÄJÄTUNNUS"
                            value={inputEmail}
                            onChangeText={setInputEmail}
                            keyboardType="email-address"
                        />
                        <Pressable onPress={handleSearchProfile}
                            style={[styles.startButton, {backgroundColor: 'green'}]}>
                            <Text style={styles.buttonText}>HAE PROFIILIT</Text>
                        </Pressable>
                        <Pressable onPress={toggleSearchMode}
                            style={[styles.startButton, {backgroundColor: 'darkred'}]}>
                            <Text style={styles.buttonText}>PERUUTA</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Pressable onPress={toggleSearchMode}// Open input field for email
                            style={styles.startButton}>
                            <Text style={styles.buttonText}>HAE PROFIILI KÄYTTÄJÄTUNNUKSELLA</Text>
                        </Pressable>
                        <Pressable onPress={() => setIsCreatingUser(true)}
                            style={styles.startButton}>
                            <Text style={styles.buttonText}>LUO TUNNUS JA ENSIMMÄINEN PROFIILI</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
        </ImageBackground>
    );
}
