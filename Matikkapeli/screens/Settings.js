import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StatusBar, BackHandler } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import SliderComponent from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSoundSettings } from '../components/SoundSettingsContext'; //Peliäänet on/off
import { useTaskReading } from '../components/TaskReadingContext'; //Tehtävien lukeminen
import { useTaskSyllabification } from '../components/TaskSyllabificationContext'; //Tavutus
import { useBackgroundMusic } from '../components/BackgroundMusicContext'; //Taustamusiikki
import styles from '../styles';

export default function Settings() {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { taskReading, setTaskReading } = useTaskReading();
  const { taskSyllabification, setTaskSyllabification } = useTaskSyllabification(); //Käytä tavutuksen kontekstia
  const { gameSounds, setGameSounds } = useSoundSettings();
  const { isMusicPlaying, setIsMusicPlaying, setMusicVolume, musicVolume } = useBackgroundMusic(); //Taustamusiikki

  const handleCloseApp = () => {
    BackHandler.exitApp(); //Sulkee sovelluksen Android-laitteilla
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#333' : '#fff'}
      />
      <View style={[styles.settingItemContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Asetukset</Text>

        {/* Teeman valinta */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tumman teeman valinta</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} />
        </View>

        {/* Tavutuksen valinta */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tavutus</Text>
          <Switch
            value={taskSyllabification} //Kontekstin tila
            onValueChange={() => setTaskSyllabification(!taskSyllabification)} //Päivitä tila
          />
        </View>

        {/* Tehtävien lukeminen */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tehtävien lukeminen</Text>
          <Switch value={taskReading} onValueChange={() => setTaskReading(!taskReading)} />
        </View>

        {/* Taustamusiikin päälle/pois */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Taustamusiikki</Text>
          <Switch value={isMusicPlaying} onValueChange={setIsMusicPlaying} />
        </View>

        {/* Taustamusiikin voimakkuus */}
        <View style={styles.settingItemColumn}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Taustamusiikin voimakkuus</Text>
          <SliderComponent
            style={styles.slider}
            maximumTrackTintColor="#FF0000" //Punainen
            minimumTrackTintColor="#FF004F" //Punainen
            thumbTintColor="#006400"
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
