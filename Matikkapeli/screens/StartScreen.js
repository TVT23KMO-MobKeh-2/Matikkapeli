import React from 'react';
import { View, Text, Button, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';
import TopBarComponent from '../components/TopBarComponent';

export default function StartScreen({ onNavigate }) {
  const { isDarkTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#333' : '#fff'}
      />
      <TopBarComponent/>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Valitse tehtävä:
        </Text>
        <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.startButton} onPress={() => onNavigate('ImageToNumbers')}>
          <Text style={styles.buttonText}>Kuvat numeroiksi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={() => onNavigate('SoundToNumbers')}>
          <Text style={styles.buttonText}>Ääni numeroiksi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={() => onNavigate('ComparisonOperators')}>
          <Text style={styles.buttonText}>Vertailu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={() => onNavigate('NumberBonds')}>
          <Text style={styles.buttonText}>Hajonta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={() => onNavigate('Animation')}>
          <Text style={styles.buttonText}>Animaatio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={() => onNavigate('SelectProfile')}>
          <Text style={styles.buttonText}>Profiili valinta</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
