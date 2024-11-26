import React from 'react';
import { View, Text, Button, StatusBar, TouchableOpacity, ImageBackground } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function StartScreen({ onNavigate }) {
  const { isDarkTheme } = useTheme();
  const ImageBG = require('../assets/background2.jpg');
  const ImageBGDark = require('../assets/background3.png');

  return (
    <ImageBackground 
      source={isDarkTheme ? ImageBGDark : ImageBG} 
      style={styles.background} 
      resizeMode="cover"
    >
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar 
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent={true} 
      />
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Valitse tehtävä:
        </Text>
        <View style={isDarkTheme ? styles.optionsContainerDark : styles.optionsContainer}>
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
    </ImageBackground>
  );
}
