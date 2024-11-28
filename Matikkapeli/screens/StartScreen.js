import React from 'react';
import { View, Text, Button, StatusBar } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function StartScreen({ navigation }) {
  const { isDarkTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#333' : '#fff'}
      />
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Valitse tehtävä:
        </Text>
        <View style={styles.buttonContainer}>
          <Button onPress={() => navigation.navigate('Welcome')} title="Aloita peli" />
        </View>
      </View>
    </SafeAreaView>
  );
}
