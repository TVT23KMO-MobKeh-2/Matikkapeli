import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StatusBar, BackHandler, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import SliderComponent from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useBackgroundMusic } from '../components/BackgroundMusicContext';
import styles from '../styles';
import { savePlayerSettingsToDatabase, updatePlayerSettingsToDatabase, recievePlayerSettingsFromDatabase } from '../firebase/Functions';

export default function Settings({ onBack, onProfileImageChange }) {
  const [email, setEmail] = useState("isi@gmail.com");
  const [playerName, setPlayerName] = useState("Irja");
  const [settingsDocId, setSettingsDocId] = useState(""); // Document ID of the settings

  const { isDarkTheme, toggleTheme } = useTheme();
  const { taskReading, setTaskReading } = useTaskReading();
  const { taskSyllabification, setTaskSyllabification } = useTaskSyllabification();
  const { gameSounds, setGameSounds } = useSoundSettings();
  const { isMusicPlaying, setIsMusicPlaying, setMusicVolume, musicVolume } = useBackgroundMusic();
  const [selectedImage, setSelectedImage] = useState(null);

  const profileImages = [
    require('../assets/images/kettu.png'),
    require('../assets/images/pingviini.png'),
    require('../assets/images/norsu.png'),
    require('../assets/images/pollo.png'),
  ];

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onProfileImageChange && onProfileImageChange(image);
  };

  const handleCloseApp = () => {
    Alert.alert(
      "Vahvistus",
      "Haluatko varmasti sulkea sovelluksen?",
      [
        { text: "Peruuta", style: "cancel" },
        { text: "Kyllä", onPress: () => BackHandler.exitApp() }
      ]
    );
  };

  // Function to save or update player settings
  const saveSettings = async () => {
    if (!email || !playerName) {
      Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt.");
      return;
    }
  
    const settings = {
      email,
      playerName,
      isDarkTheme,
      taskReading,
      taskSyllabification,
      gamesounds: gameSounds,
      isMusicPlaying,
      musicVolume,
      selectedImage,
    };
  
    try {
      if (settingsDocId) {
        console.log("Päivitetään dokumenttia:", settingsDocId);
        await updatePlayerSettingsToDatabase({ ...settings, settingsDocId });
      } else {
        console.log("settingsDocId ei löytynyt, luodaan uusi dokumentti.");
        await savePlayerSettingsToDatabase(settings, setSettingsDocId);  // Create new document and save ID
      }
    } catch (error) {
      console.error("Virhe asetuksia tallennettaessa:", error);
      Alert.alert("Virhe", "Asetusten tallennus epäonnistui.");
    }
  };

  // First fetch settings or create a new document if not found
  useEffect(() => {
    const fetchSettingsOrCreateNew = async () => {
      if (!email || !playerName) {
        Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt.");
        return;
      }
  
      try {
        // Attempt to fetch player settings
        const fetchedSettings = await recievePlayerSettingsFromDatabase({
          email,
          playerName,
          toggleTheme,
          setTaskReading,
          setTaskSyllabification,
          setGameSounds,
          setIsMusicPlaying,
          setMusicVolume,
          setSettingsDocId, // Set settingsDocId if document found
        });
  
        if (!fetchedSettings) {
          // If settings were not found, create new document
          console.log("Pelaajan asetuksia ei löytynyt, luodaan uusi dokumentti.");
          saveSettings();
        }
      } catch (error) {
        console.error("Virhe asetuksia haettaessa:", error);
        Alert.alert("Virhe", "Asetusten haku epäonnistui.");
      }
    };
  
    // Fetch or create settings once email and playerName are available
    fetchSettingsOrCreateNew();
  }, [email, playerName]);  // Ensure that `email` and `playerName` are available
  
  // Save settings when they change
  useEffect(() => {
    if (settingsDocId) {
      saveSettings();
    }
  }, [
    isDarkTheme,
    gameSounds,
    taskSyllabification,
    taskReading,
    isMusicPlaying,
    musicVolume,
    email,
    playerName,
    settingsDocId,
    selectedImage // Save profile image as well
  ]);

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={isDarkTheme ? '#333' : '#fff'} />
      <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Asetukset</Text>

        {/* Theme Selection */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tumman teeman valinta</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} />
        </View>

        {/* Syllabification */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tavutus</Text>
          <Switch value={taskSyllabification} onValueChange={() => setTaskSyllabification(!taskSyllabification)} />
        </View>

        {/* Task Reading */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Tehtävien lukeminen</Text>
          <Switch value={taskReading} onValueChange={() => setTaskReading(!taskReading)} />
        </View>

        {/* Background Music */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Taustamusiikki</Text>
          <Switch value={isMusicPlaying} onValueChange={setIsMusicPlaying} />
        </View>

        {/* Music Volume */}
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

        {/* Game Sounds */}
        <View style={styles.settingItem}>
          <Text style={[styles.label, { color: isDarkTheme ? '#fff' : '#000' }]}>Peliäänet</Text>
          <Switch value={gameSounds} onValueChange={() => setGameSounds(!gameSounds)} />
        </View>

        {/* Profile Image Selection */}
        <Text style={styles.label}>Valitse profiilikuva</Text>
        <View style={styles.imageOptionsContainer}>
          {profileImages.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleImageSelect(image)} style={styles.imageOption}>
              <Image source={image} style={styles.profileImageOption} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Close App Button */}
        <Button title="Sammuta sovellus" onPress={handleCloseApp} />
      </View>
    </SafeAreaView>
  );
}
