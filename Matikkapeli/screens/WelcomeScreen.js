import { View, Text, TextInput, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCreation from '../components/UserCreation';
import { deleteUserDataFromDatabase, recieveProfileByEmail } from '../firebase/Functions'; // Import your function
import { Alert } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [inputEmail, setInputEmail] = useState(''); // State for holding input email
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false); // State to toggle search mode
    const [profileData, setProfileData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log('Sähköposti haettu AsyncStorage:sta:', value);
                setEmail(value);
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
            setEmail('');
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
          <View style={styles.container}>
                <Text style = {styles.title}>WelcomeScreen</Text>
                    <View style={styles.optionsContainer}>
                    <Text style={styles.question}>Hei, {email}</Text>
                        <Pressable onPress={() => navigation.navigate('SelectProfile', { email: email })}
                            style={styles.startButton}>
                            <Text style={styles.buttonText}>Valitse profiili</Text>
                        </Pressable>
                        <Pressable onPress={(clearemail)}
                            style={[styles.startButton, {backgroundColor: 'red'}]}>
                            <Text style={styles.buttonText}> Poista tunnus puhelimen muistista</Text>
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
                            {isDeleting ? 'Poistetaan...' : 'Poista tunnus tietokannasta'}
                            </Text>
                        </Pressable>
                    </View>
        </View>
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
        <View style={styles.container}>
            <Text style = {styles.title}>WelcomeScreen</Text>
            
            <View style={styles.optionsContainer}>
             <Text style={styles.question}>Tervetuloa!</Text>
               {isSearchMode ? (
                    <>
                        <TextInput
                            style={[styles.input, {backgroundColor: 'white'}]}
                            placeholder="Syötä sähköposti"
                            value={inputEmail}
                            onChangeText={setInputEmail}
                            keyboardType="email-address"
                        />
                        <Pressable onPress={handleSearchProfile}
                            style={[styles.startButton, {backgroundColor: 'green'}]}>
                            <Text style={styles.buttonText}>Hae profiilit</Text>
                        </Pressable>
                        <Pressable onPress={toggleSearchMode}
                            style={[styles.startButton, {backgroundColor: 'darkred'}]}>
                            <Text style={styles.buttonText}>Peruuta</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Pressable onPress={toggleSearchMode}// Open input field for email
                            style={styles.startButton}>
                            <Text style={styles.buttonText}>Hae profiili sähköpostilla</Text>
                        </Pressable>
                        <Pressable onPress={() => setIsCreatingUser(true)}
                            style={styles.startButton}>
                            <Text style={styles.buttonText}>Luo tunnus ja ensimmäinen profiili</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}
