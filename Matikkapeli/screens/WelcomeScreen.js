import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCreation from '../components/UserCreation';


export default function WelcomeScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const getData = async () => {
      try {
          const value = await AsyncStorage.getItem('email');
          if (value !== null) {
              console.log('Sähköposti haettu AsyncStorage:sta:', value);  // Lisää tämä
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
                    <Button title="Poista tunnus" onPress={clearemail} color="red" />
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
                <Button title="Luo tunnus ja ensimmäinen profiili" onPress={() => setIsCreatingUser(true)} />
            </View>
        </View>
    );
}
