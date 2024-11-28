import React from 'react';
import { View, Text, Button, StatusBar, TouchableOpacity, ImageBackground } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function StartScreen({ navigation }) {
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

        <View style={styles.buttonContainer}>
          <Button onPress={() => navigation.navigate('Welcome')} title="Aloita peli" />

        </View>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}
