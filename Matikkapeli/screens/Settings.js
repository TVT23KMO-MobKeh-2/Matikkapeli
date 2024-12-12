import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, StatusBar, BackHandler, ImageBackground, Alert } from 'react-native';
import SliderComponent from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSoundSettings } from '../components/SoundSettingsContext'; //Peliäänet on/off
import { useTaskReading } from '../components/TaskReadingContext'; //Tehtävien lukeminen
import { useTaskSyllabification } from '../components/TaskSyllabificationContext'; //Tavutus
import { useBackgroundMusic } from '../components/BackgroundMusicContext'; //Taustamusiikki
import { savePlayerSettingsToDatabase, updatePlayerSettingsToDatabase, recievePlayerSettingsFromDatabase } from '../firebase/Functions';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';
import { useScore } from '../components/ScoreContext';

export default function Settings({ onBack, navigation }) {
//  const { playerName, email } = useContext(ScoreContext);
  //const [settingsEmail, setSettingsEmail] = useState(null); //Alustetaan null-arvolla
  //const [settingsPlayerName, setsettingsPlayerName] = useState(null); //Alustetaan null-arvolla
  const {playerName, email, settingsDocId, setSettingsDocId} = useScore(); //Doc ID

  const { isDarkTheme, setIsDarkTheme } = useTheme();
  const { taskReading, setTaskReading } = useTaskReading();
  const { syllabify, taskSyllabification, setTaskSyllabification } = useTaskSyllabification(); //Käytä tavutuksen kontekstia
  const { gameSounds, setGameSounds } = useSoundSettings();
  const { isMusicPlaying, setIsMusicPlaying, setMusicVolume, musicVolume, handleSlidingComplete } = useBackgroundMusic(); //Taustamusiikki

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

/*   //Hakee käyttäjän tiedot AsyncStorage:sta
  const fetchUserData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPlayerName = await AsyncStorage.getItem('playerName');
      if (storedEmail) setSettingsEmail(storedEmail);
      if (storedPlayerName) setSettingsPlayerName(storedPlayerName);
    } catch (error) {
      console.error('Virhe tietojen hakemisessa:', error);
    }
  }; */

  //Hakee asetukset tietokannasta
  useEffect(() => {
    const fetchSettingsOrCreateNew = async () => {
      if (!email || !playerName) return; //Varmistetaan, että tiedot on saatavilla

      try {
        const fetchedSettings = await recievePlayerSettingsFromDatabase({
          email,
          playerName,
          setIsDarkTheme,
          setTaskReading,
          setTaskSyllabification,
          setGameSounds,
          setIsMusicPlaying,
          setMusicVolume,
          setSettingsDocId,
        });

        if (!fetchedSettings) {
          console.log("Pelaajan asetuksia ei löytynyt, luodaan uusi dokumentti.");
          saveSettings(); //Luodaan uusi dokumentti, jos asetuksia ei ole
        }
      } catch (error) {
        console.error("Virhe asetusten haettaessa:", error);
        Alert.alert("Virhe", "Asetusten haku epäonnistui.");
      }
    };

    fetchSettingsOrCreateNew();
  }, [email, playerName]); //Varmistetaan, että "email" ja "playerName" ovat saatavilla

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
        console.log("Päivitetään settings dokumenttia:", settingsDocId);
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


  //Varmistetaan, että haetaan tiedot aluksi
/*   useEffect(() => {
    console.log("Asetukset useEffect tyhjänä, kutsutaan fetchSettingsOrCreateNew")
    fetchSettingsOrCreateNew();
  }, [email, playerName]); */
   

  //Seuraa asetusten muutoksia ja tallentaa ne automaattisesti
  useEffect(() => {
    if (email && playerName) {
      saveSettings();
    }
  }, [
    email,
    playerName,
    isDarkTheme,
    taskReading,
    taskSyllabification,
    gameSounds,
    isMusicPlaying,
    musicVolume,
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
              maximumTrackTintColor="#FF0000"
              minimumTrackTintColor="#FF004F"
              thumbTintColor="#006400"
              value={musicVolume}
              onValueChange={() => { }}
              onSlidingComplete={handleSlidingComplete}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
            />
          </View>

          {/* Peliäänet */}
          <View style={styles.settingItem}>
            <Text style={styles.label}>{syllabify("Peliäänet")}</Text>
            <Switch value={gameSounds} onValueChange={() => setGameSounds(!gameSounds)} />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => navigation.goBack()} style={[styles.startButton, styles.blueButton]}>
              <Text style={styles.buttonText}>{syllabify("Takaisin")}</Text>
              <FontAwesome name="arrow-left" size={24} color={isDarkTheme ? "white" : "black"}/>
            </Pressable>
          </View>
          {/* Sovelluksen sammuttaminen */}
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleCloseApp}
              style={[styles.startButton, styles.redButton]}
            >
              <Text style={styles.buttonText}>{syllabify("Sammuta")}</Text>
              <FontAwesome name="power-off" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
