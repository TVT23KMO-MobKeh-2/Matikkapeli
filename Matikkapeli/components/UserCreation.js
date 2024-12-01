import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveEmailToDatabase, isEmailUsed } from '../firebase/Functions'; // Import the function
import { useNavigation } from '@react-navigation/native';

export default function UserCreation({ onNavigate }) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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
        <View style={styles.container}>
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
