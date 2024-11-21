import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StatusBar, BackHandler, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import SliderComponent from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSoundSettings } from '../components/SoundSettingsContext'; //Peliäänet on/off
import { useTaskReading } from '../components/TaskReadingContext'; //Tehtävien lukeminen
import { useTaskSyllabification } from '../components/TaskSyllabificationContext'; //Tavutus
import { useBackgroundMusic } from '../components/BackgroundMusicContext'; //Taustamusiikki
import styles from '../styles';
import { savePlayerSettingsToDatabase, updatePlayerSettingsToDatabase, recievePlayerSettingsFromDatabase } from '../firebase/Functions'; 

export default function Settings({ onBack, onProfileImageChange }) {
  // Kovakoodatut arvot ennen kirjautumista
  const [email, setEmail] = useState("isi@gmail.com");
  const [playerName, setPlayerName] = useState("Irja");
  const [docId, setDocId] = useState("");

  const { isDarkTheme, toggleTheme } = useTheme();
  const { taskReading, setTaskReading } = useTaskReading();
  const { taskSyllabification, setTaskSyllabification } = useTaskSyllabification(); //Käytä tavutuksen kontekstia
  const { gameSounds, setGameSounds } = useSoundSettings();
  const { isMusicPlaying, setIsMusicPlaying, setMusicVolume, musicVolume } = useBackgroundMusic(); //Taustamusiikki
  const [selectedImage, setSelectedImage] = useState(null); // Profiilikuvan tila

  const profileImages = [
    require('../assets/images/kettu.png'),
    require('../assets/images/pingviini.png'),
    require('../assets/images/norsu.png'),
    require('../assets/images/pollo.png'),
  ];

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onProfileImageChange(image); // Ilmoittaa TopBarComponentille valitun kuvan
  };

  useEffect(() => {
    const fetchSettings = async () => {
      if (!email || !playerName) {
        Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt.");
        return;
      }
  
      try {
        // Haetaan asetukset tietokannasta
        const settings = await recievePlayerSettingsFromDatabase({
          email,
          playerName,
          toggleTheme,
          setTaskReading,
          setTaskSyllabification,
          setGameSounds,
          setIsMusicPlaying,
          setMusicVolume,
        });
  
        if (settings && settings.docId) {
          // Asetetaan docId oikein, jos löytyi
          setDocId(settings.docId);
        } else {
          // Ei luoda docId:tä uudelleen, jos se on jo olemassa
          if (!docId) {  // Tarkistetaan, ettei docId ole vielä määritelty
            console.log("Ei löytynyt docId:tä, mutta ei luoda uutta.");
          }
        }
      } catch (error) {
        console.error("Virhe asetuksia haettaessa:", error);
        Alert.alert("Virhe", "Asetusten haku epäonnistui.");
      }
    };
  
    fetchSettings();
  }, [email, playerName]); 
  
  useEffect(() => {
    // Tallennetaan asetukset automaattisesti, kun jokin asetus muuttuu
    const saveSettings = async () => {
      if (!email || !playerName) {
        Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt.");
        return;
      }
  
      try {
        const settings = {
          email,
          playerName,
          isDarkTheme,
          taskReading,
          taskSyllabification,
          gamesounds: gameSounds,
          isMusicPlaying,
          musicVolume,
        };
  
        // Tarkistetaan, onko docId olemassa
        if (docId) {
          // Jos docId on olemassa, päivitetään se
          await updatePlayerSettingsToDatabase({ ...settings, docId });
          console.log("Asetukset päivitetty onnistuneesti.");
        } else {
          // Jos docId ei ole olemassa, luodaan uusi dokumentti
          await savePlayerSettingsToDatabase(settings);
          console.log("Asetukset tallennettu onnistuneesti.");
        }
      } catch (error) {
        console.error("Virhe asetuksia tallennettaessa:", error);
        Alert.alert("Virhe", "Asetusten tallennus epäonnistui.");
      }
    };
  
    if (docId || (!docId && email && playerName)) {
      saveSettings(); // Tallennetaan asetukset automaattisesti
    }
  }, [isDarkTheme, gameSounds, taskSyllabification, taskReading, isMusicPlaying, musicVolume, email, playerName, docId]);

  const handleCloseApp = () => {
    BackHandler.exitApp(); // Sulkee sovelluksen Android-laitteilla
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
          <Switch
            value={taskSyllabification} // Kontekstin tila
            onValueChange={() => setTaskSyllabification(!taskSyllabification)} // Päivitä tila
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
        <Text style={styles.label}>Valitse profiilikuva</Text>
        <View style={styles.imageOptionsContainer}>
          {profileImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageSelect(image)} 
              style={styles.imageOption}
            >
              <Image source={image} style={styles.profileImageOption} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sovelluksen sammuttaminen */}
        <Button title="Sammuta sovellus" onPress={handleCloseApp} />
      </View>
    </SafeAreaView>
  );
}
