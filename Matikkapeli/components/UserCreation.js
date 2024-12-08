import { View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveEmailToDatabase, isEmailUsed, loginWithEmailPassword, signUpWithEmailPassword } from '../firebase/Functions';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/Config';
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


export default function UserCreation({ onNavigate }) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [password, setPassword] = useState(''); 
    const { isDarkTheme } = useTheme();
    const bgIndex = 0;
    const styles = createStyles(isDarkTheme ? dark : light);
    
    function isValidEmail(email) {
        // Regular expression to validate email format
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    const handleSave = async () => {
        setIsSaving(true); // Show loading state before doing any checks

        if (!email || !password) {
            alert('Täytä kaikki kentät!');
            setIsSaving(false); // Hide loading state after validation
            return;
        }
    
        if (password.length < 6) {
            alert('Salasanan täytyy olla vähintään 6 merkkiä pitkä');
            setIsSaving(false); // Hide loading state after validation
            return;
        }
    
        if (!isValidEmail(email)) {
            console.error("Invalid email format.");
            Alert.alert("Virhe", "Sähköposti ei ole kelvollinen.");
            setIsSaving(false);
            return;
        }
    
        try {
            // Attempt to sign up with email and password
            const userCredential = await signUpWithEmailPassword(email, password);
            console.log("User signed up successfully:", userCredential);
    
            // Store email locally in AsyncStorage
            await AsyncStorage.setItem('email', email);
            console.log('Sähköposti tallennettu AsyncStorage:een:', email);
    
            // If onNavigate is passed as a prop, use it. Otherwise, navigate to 'SelectProfile'.
            if (onNavigate) {
                onNavigate(); // If onNavigate is passed, call it
            } else {
                navigation.navigate('SelectProfile', { email: email }); // Navigate to the next screen
            }
    
        } catch (error) {
            console.error('Error during sign-up:', error);
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert("Virhe", "Tämä sähköposti on jo käytössä.");
            } else {
                Alert.alert("Virhe", "Rekisteröityminen epäonnistui: " + error.message);
            }
        } finally {
            setIsSaving(false); // Hide loading state after async operation is done
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
            <Text style={styles.label}>KÄYTTÄJÄTUNNUS</Text>
            <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                placeholder="KIRJOITA KÄYTTÄJÄTUNNUS"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                placeholder="KIRJOITA SALASANA"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />
                <Pressable style={[styles.startButton, {backgroundColor: 'green'}]} onPress={handleSave} disabled={isSaving}>
                    <Text style={styles.buttonText}>{isSaving ? 'TALLENETAAN...' : 'TALLENNA'}</Text>
                </Pressable>
                <Pressable style={[styles.startButton, {backgroundColor: 'darkred'}]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>PERUUTA</Text>
                </Pressable>
            </View>
        </View>
        </ImageBackground>
    );
}
