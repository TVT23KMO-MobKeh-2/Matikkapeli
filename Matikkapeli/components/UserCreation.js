import { View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveEmailToDatabase, isEmailUsed } from '../firebase/Functions'; // Import the function
import { useNavigation } from '@react-navigation/native';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


export default function UserCreation({ onNavigate }) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { isDarkTheme } = useTheme();
    const bgIndex = 0;
    const styles = createStyles(isDarkTheme ? dark : light);
    

    const handleSave = async () => {
        if (!email) {
            alert('Täytä kaikki kentät!');
            return;
        }

        setIsSaving(true);

        try {
            // Check if the email is already used
            const emailInUse = await isEmailUsed(email);
            if (emailInUse) {
                Alert.alert("Virhe", "Tämä sähköposti on jo käytössä.");
                setIsSaving(false);
                return;
            }

            console.log('Tallennetaan sähköposti AsyncStorage:een:', email);
            await AsyncStorage.setItem('email', email); // Store the email locally

            console.log('Sähköposti tallennettu AsyncStorage:een');
            if (onNavigate) {
                onNavigate(); // If onNavigate is passed, call it
            } else {
                navigation.navigate('SelectProfile', { email: email }); // Navigate to the next screen
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Profiilin tallennus epäonnistui');
        } finally {
            setIsSaving(false);
        }
    };

    return (
      <ImageBackground 
      source={getBGImage(isDarkTheme, bgIndex)} 
        style={styles.background} 
        resizeMode="cover"
        >
        <View style = {styles.container}>
            <View style={styles.optionsContainer}>
            <Text style={styles.label}>Käyttäjätunnus</Text>
            <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                placeholder="Kirjoita tunnus"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
                <Pressable style={[styles.startButton, {backgroundColor: 'green'}]} onPress={handleSave} disabled={isSaving}>
                    <Text style={styles.buttonText}>{isSaving ? 'Tallennetaan...' : 'Tallenna'}</Text>
                </Pressable>
                <Pressable style={[styles.startButton, {backgroundColor: 'darkred'}]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Peruuta</Text>
                </Pressable>
            </View>
        </View>
        </ImageBackground>
    );
}
