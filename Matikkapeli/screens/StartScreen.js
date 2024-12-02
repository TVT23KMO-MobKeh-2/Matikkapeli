import React from 'react';
import { View, Text, StatusBar, ImageBackground, Pressable } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '../styles';
import { getBGImage } from '../components/backgrounds';
import { light, dark } from '../assets/themeColors';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function StartScreen({ navigation }) {
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light;
  const bgIndex = 0; 
  const styles = createStyles(theme);

  return (
    <ImageBackground 
      source={getBGImage(isDarkTheme, bgIndex)} 
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
        <Text style={styles.title}>
          MATIKKAPOLKU
        </Text>

        <View style={styles.startButton}>
          <Pressable onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.buttonText}>ALOITA PELI</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}
