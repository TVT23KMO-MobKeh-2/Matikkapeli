import { View, Text, Button, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCreation from '../components/UserCreation';
import { deleteUserDataFromDatabase, recieveProfileByEmail } from '../firebase/Functions'; // Import your function
import { Alert } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [playerName, setPlayerName] = useState('')
    const [imageID, setImageID] = useState('')
    const [inputEmail, setInputEmail] = useState(''); // State for holding input email
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false); // State to toggle search mode
    const [profileData, setProfileData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
            <View style={styles.container}>
                <Text>WelcomeScreen</Text>
                <View style={styles.buttonContainer}>
                    <Text>Hei, {email}</Text>
                    <Button
                        title="Valitse profiili"
                        onPress={() => navigation.navigate('SelectProfile', { email: email })}
                    />
                    <Button
                        title="Poista tunnus puhelimen muistista"
                        onPress={clearemail}
                        color="red"
                    />
                    <Button
                        title={isDeleting ? 'Poistetaan...' : 'Poista tunnus'}
                        onPress={deletemail}
                        disabled={isDeleting}
                        color="darkred"// Disable button during deletion
                    />
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
            <Text>WelcomeScreen</Text>
            <View style={styles.buttonContainer}>
                {isSearchMode ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Syötä sähköposti"
                            value={inputEmail}
                            onChangeText={setInputEmail}
                            keyboardType="email-address"
                        />
                        <Button
                            title="Hae profiilit"
                            onPress={handleSearchProfile}
                        />
                        <Button
                            title="Peruuta"
                            onPress={toggleSearchMode} // Cancel search mode
                        />
                    </>
                ) : (
                    <>
                        <Button
                            title="Hae tunnus"
                            onPress={toggleSearchMode} // Open input field for email
                        />
                        <Button
                            title="Luo tunnus ja ensimmäinen profiili"
                            onPress={() => setIsCreatingUser(true)}
                        />
                    </>
                )}
            </View>
        </View>
    );
}
