import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, StatusBar, BackHandler, ImageBackground, Alert } from 'react-native';
import SliderComponent from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSoundSettings } from '../components/SoundSettingsContext'; //Peliäänet on/off
import { useTaskReading } from '../components/TaskReadingContext'; //Tehtävien lukeminen
import { useTaskSyllabification } from '../components/TaskSyllabificationContext'; //Tavutus
import { useBackgroundMusic } from '../components/BackgroundMusicContext'; //Taustamusiikki
import { savePlayerSettingsToDatabase, updatePlayerSettingsToDatabase, recievePlayerSettingsFromDatabase } from '../firebase/Functions';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';

export default function Settings({ onBack }) {
  const [email, setEmail] = useState("isi@gmail.com");
  const [playerName, setPlayerName] = useState("Irja");
  const [settingsDocId, setSettingsDocId] = useState(""); //Doc ID

  const { isDarkTheme, setIsDarkTheme } = useTheme();

  const { taskReading, setTaskReading } = useTaskReading();
  const { syllabify, taskSyllabification, setTaskSyllabification } = useTaskSyllabification(); //Käytä tavutuksen kontekstia
  const { gameSounds, setGameSounds } = useSoundSettings();
  const { isMusicPlaying, setIsMusicPlaying, setMusicVolume, musicVolume } = useBackgroundMusic(); //Taustamusiikki

  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);
  const bgIndex = 0;

  //Sulkee sovelluksen Android-laitteilla
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

  //Player asetukset asetusten tallentaminen ja päivittäminen
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
    };

    try {
      if (settingsDocId) {
        console.log("Päivitetään dokumenttia:", settingsDocId);
        await updatePlayerSettingsToDatabase({ ...settings, settingsDocId });
      } else {
        console.log("settingsDocId ei löytynyt, luodaan uusi dokumentti.");
        await savePlayerSettingsToDatabase(settings, setSettingsDocId); //Luo uuden dokumentin ja tallentaa id:n
      }
    } catch (error) {
      console.error("Virhe asetuksia tallennettaessa:", error);
      Alert.alert("Virhe", "Asetusten tallennus epäonnistui.");
    }
  };

  //Haetaan ensin asetukset tai luodaan uusi asiakirja, jos sitä ei löydy
  useEffect(() => {
    const fetchSettingsOrCreateNew = async () => {
      if (!email || !playerName) {
        Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt.");
        return;
      }

      try {
        //Haetaan player asetukset
        const fetchedSettings = await recievePlayerSettingsFromDatabase({
          email,
          playerName,
          setIsDarkTheme,
          setTaskReading,
          setTaskSyllabification,
          setGameSounds,
          setIsMusicPlaying,
          setMusicVolume,
          setSettingsDocId, //settingsDocId jos dokumentti löytyy
        });

        if (!fetchedSettings) {
          //Jos asetuksia ei löydy, luodaan uusi dokumentti
          console.log("Pelaajan asetuksia ei löytynyt, luodaan uusi dokumentti.");
          saveSettings();
        }
      } catch (error) {
        console.error("Virhe asetuksia haettaessa:", error);
        Alert.alert("Virhe", "Asetusten haku epäonnistui.");
      }
    };

    //Haetaan tai luodaan asetukset, kun sähköposti ja pelaajanimi ovat saatavilla
    fetchSettingsOrCreateNew();
  }, [email, playerName]); //Varmistetaan, että "email" ja "playerName" ovat saatavilla

  //Tallennetaan asetukset kun ne ovat muuttuneet
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
  ]);

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
        <Text style={styles.title}>{syllabify("Asetukset")}</Text>

        {/* Teeman valinta */}
        <View style={styles.settingItem}>
          <Text style={styles.label}>{syllabify("Tumman teeman valinta")}</Text>
          <Switch value={isDarkTheme} onValueChange={setIsDarkTheme} />
        </View>

        {/* Tavutuksen valinta */}
        <View style={styles.settingItem}>
          <Text style={styles.label}>{syllabify("Tavutus")}</Text>
          <Switch value={taskSyllabification} onValueChange={() => setTaskSyllabification(!taskSyllabification)} />
        </View>

        {/* Tehtävien lukeminen */}
        <View style={styles.settingItem}>
          <Text style={styles.label}>{syllabify("Tehtävien lukeminen")}</Text>
          <Switch value={taskReading} onValueChange={() => setTaskReading(!taskReading)} />
        </View>

        {/* Taustamusiikin päälle/pois */}
        <View style={styles.settingItem}>
          <Text style={styles.label}>{syllabify("Taustamusiikki")}</Text>
          <Switch value={isMusicPlaying} onValueChange={setIsMusicPlaying} />
        </View>

        {/* Taustamusiikin voimakkuus */}
        <View style={styles.settingItemColumn}>
          <Text style={styles.label}>{syllabify("Taustamusiikin voimakkuus")}</Text>
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
          <Text style={styles.label}>{syllabify("Peliäänet")}</Text>
          <Switch value={gameSounds} onValueChange={() => setGameSounds(!gameSounds)} />
            
        </View>

        {/* Sovelluksen sammuttaminen */}
        <View style={styles.buttonContainer}>
            <Pressable onPress={handleCloseApp}
              style={[styles.startButton, { backgroundColor: 'darkred' }]}
            >
              <Text style={[styles.buttonText, {color: 'white'}]}>{syllabify("Sammuta sovellus")}</Text>
            </Pressable>
          </View>
      </View>

      </SafeAreaView>
    </ImageBackground>
  );
}
