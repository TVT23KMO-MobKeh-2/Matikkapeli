import React, { useState } from 'react';
import { View, Text, Button, Switch, StatusBar, BackHandler } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import SliderComponent from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

export default function Settings() {
  const { isDarkTheme, toggleTheme } = useTheme(); //Teemaa kontekstista
  const [isToggled, setIsToggled] = useState(false);
  const [taskReading, setTaskReading] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [gameSounds, setGameSounds] = useState(true);

  const handleCloseApp = () => {
    //Sulkee sovelluksen Android-laitteilla
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#333' : '#fff'}
      />
      <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Asetukset</Text>

        {/* Teeman valinta */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tumman teeman valinta</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} />
        </View>

        {/* Tavutuksen valinta */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tavutus</Text>
          <Switch value={isToggled} onValueChange={() => setIsToggled(!isToggled)} />
        </View>

        {/* Tehtävien lukeminen */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tehtävien lukeminen</Text>
          <Switch value={taskReading} onValueChange={() => setTaskReading(!taskReading)} />
        </View>

        {/* Taustamusiikin voimakkuus */}
        <View style={styles.settingItemColumn}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Taustamusiikin voimakkuus</Text>
          <SliderComponent
            style={styles.slider}
            value={musicVolume}
            onValueChange={setMusicVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
          />
        </View>

        {/* Peliäänet */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Peliäänet</Text>
          <Switch value={gameSounds} onValueChange={() => setGameSounds(!gameSounds)} />
        </View>

        {/* Profiilikuvan vaihto */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Profiilikuva</Text>
          <Button title="Vaihda kuva" onPress={() => alert('Profiilikuva vaihdettu')} />
        </View>

        {/* Sovelluksen sammuttaminen */}
        <Button title="Sammuta sovellus" onPress={handleCloseApp} />
      </View>
    </SafeAreaView>
  );
}
