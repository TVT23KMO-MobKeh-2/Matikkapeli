import React from 'react';
import { View, Text, Button, StatusBar } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function StartScreen({ onNavigate }) {
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
          <Button onPress={() => onNavigate('ImageToNumbers')} title="Kuvat numeroiksi" />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => onNavigate('SoundToNumbers')} title="Ääni numeroiksi" />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => onNavigate('ComparisonOperators')} title="Vertailu" />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => onNavigate('NumberBonds')} title="Hajonta" />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => onNavigate('Animation')} title='Animaatio' />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => onNavigate('SelectProfile')} title='Profiili valinta' />
        </View>
      </View>

    </SafeAreaView>
  );
}
