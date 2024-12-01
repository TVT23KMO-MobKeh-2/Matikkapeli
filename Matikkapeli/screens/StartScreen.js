import React from 'react';
import { View, Text, StatusBar, ImageBackground, Pressable } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles, {getBGImage} from '../styles';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function StartScreen({ navigation }) {
  const { isDarkTheme } = useTheme();

  return (
    <ImageBackground 
      source={getBGImage(isDarkTheme)} 
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
          Matikkapeli
        </Text>

        <View style={styles.startButton}>
          <Pressable onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.buttonText}>Aloita peli</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}
