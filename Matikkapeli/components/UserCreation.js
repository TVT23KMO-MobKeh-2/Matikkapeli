import { View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveEmailToDatabase } from '../firebase/Functions';
import { useNavigation } from '@react-navigation/native';

export default function UserCreation({ onNavigate }) {
    const navigation = useNavigation(); // Hook navigointia varten
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!email) {
            alert('Täytä kaikki kentät!');
            return;
        }
    
        setIsSaving(true);
    
        try {
            console.log('Tallennetaan sähköposti AsyncStorage:een:', email);  // Lisää tämä
            await AsyncStorage.setItem('email', email); // Tallennetaan paikallisesti
            
            console.log('Sähköposti tallennettu AsyncStorage:een'); // Lisää tämä
            if (onNavigate) {
                onNavigate(); // Jos onNavigate-prop annettu, kutsutaan sitä
            } else {
                navigation.navigate('SelectProfile', { email: email }); // Navigoidaan suoraan
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Profiilin tallennus epäonnistui');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View>
            <Text style={styles.label}>Käyttäjätunnus</Text>
            <TextInput
                style={styles.input}
                placeholder="Kirjoita tunnus"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title={isSaving ? 'Tallennetaan...' : 'Tallenna'}
                    onPress={handleSave}
                    disabled={isSaving}
                />
                <Button title="Peruuta" onPress={() => navigation.goBack()} color="red" />
            </View>
        </View>
    );
}
