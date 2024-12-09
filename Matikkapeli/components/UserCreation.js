import { View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveEmailToDatabase, isEmailUsed, recieveProfileByEmail} from '../firebase/Functions'; // Import the function
import { useNavigation } from '@react-navigation/native';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


export default function UserCreation({ onNavigate }) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { isDarkTheme } = useTheme();
    const bgIndex = 0;
    const styles = createStyles(isDarkTheme ? dark : light);
    

    const handleSave = async () => {
        if (!email || !password) {
            Alert.alert('Virhe', 'Täytä kaikki kentät!');
            return;
        }
    
        setIsSaving(true);
    
        try {
            const emailInUse = await isEmailUsed(email);
            if (emailInUse) {
                Alert.alert('Virhe', 'Tämä käyttäjätunnus on jo käytössä.');
                setIsSaving(false);
                return;
            }
    
            // Store email and password in AsyncStorage
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
    
            console.log('Email and password saved to AsyncStorage.');
            
            navigation.navigate('SelectProfile', { email });
        } catch (error) {
            console.error('Error during user creation:', error);
            Alert.alert('Virhe', 'Toiminto epäonnistui. Yritä uudelleen.');
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
            <Text style={styles.label}>KÄYTTÄJÄTUNNUS</Text>
            <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                placeholder="KIRJOITA KÄYTTÄJÄTUNNUS"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.label}>SALASANA</Text>
            <TextInput
                style={[styles.input, {backgroundColor: 'white'}]}
                placeholder="KIRJOITA SALASANA"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
                <Pressable style={[styles.startButton, {backgroundColor: 'lightblue'}]} onPress={handleSave} disabled={isSaving}>
                    <Text style={styles.buttonText}>{isSaving ? 'TALLENETAAN...' : 'TALLENNA'}</Text>
                </Pressable>
                <Pressable style={[styles.startButton, {backgroundColor: 'darkred'}]} onPress={() => navigation.goBack()}>
                    <Text style={[styles.buttonText, {color: 'white'}]}>PERUUTA</Text>
                </Pressable>
            </View>
        </View>
        </ImageBackground>
    );
}