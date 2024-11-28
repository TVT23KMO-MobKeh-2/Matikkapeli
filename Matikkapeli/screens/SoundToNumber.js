
import { View, Text, Button, TouchableOpacity, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import ModalComponent from '../components/ModalComponent';

import { ScoreContext } from '../components/ScoreContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext'; //Lisätty tavutus
import styles from '../styles';

import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';

export default function SoundToNumber({ onBack }) {

  const route = useRoute();
  const { profile } = route.params;
  const navigation = useNavigation()

  const [number, setNumber] = useState(generateRandomNumber());
  const [options, setOptions] = useState(generateOptions(number));
  const [showFeedback, setShowFeedback] = useState(false)
  const { playerLevel, incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, totalXp } = useContext(ScoreContext) // tuodaan tarvittavat muuttujat ja setterit
  const [points, setPoints] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const { isDarkTheme } = useTheme();
  const { gameSounds } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const [number, setNumber] = useState(() => generateRandomNumber(0, playerLevel || 10));
  const [options, setOptions] = useState(generateOptions(number));
  const [sound, setSound] = useState();
  const { syllabify, taskSyllabification } = useTaskSyllabification(); //Käytetään tavutuskontekstia
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);


    //feedback miten meni, odotelee tässä, että saadaan yhteiseen tiedostoon..
    const feedbackMsg = (() => {
      switch (points) {
          case 0:
              return (!taskSyllabification) ? "0/5 Hyvä, että yritit! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!"
                  : "0/5 HY-VÄ ET-TÄ Y-RI-TIT! MA-TIK-KA ON VÄ-LIL-LÄ TO-SI HAAS-TA-VAA. HAR-JOI-TEL-LAAN YH-DES-SÄ LI-SÄÄ, NIIN EN-SI KER-RAL-LA VOI MEN-NÄ PA-REM-MIN";
          case 1:
              return (!taskSyllabification) ? "1/5 Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!"
                  : "1/5 HY-VÄ, SAIT YH-DEN OI-KEIN! TÄ-MÄ ON HY-VÄ AL-KU JA JO-KA KER-TA O-PIT VÄ-HÄN LI-SÄÄ. KO-KEIL-LAAN YH-DES-SÄ UU-DEL-LEEN!";
          case 2:
              return (!taskSyllabification) ? "2/5 Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!"
                  : "2/5 HIE-NOA, SAIT JO KAK-SI OI-KEIN! O-LET OP-PI-MAS-SA. JAT-KE-TAAN HAR-JOIT-TE-LU-A, NIIN EN-SI KER-RAL-LA O-SAAT VIE-LÄ E-NEM-MÄN!";
          case 3:
              return (!taskSyllabification) ? "3/5 Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!"
                  : "3/5 MAH-TA-VAA, SAIT Y-LI PUO-LET OI-KEIN! O-LET JO TO-SI LÄ-HEL-LÄ. HAR-JOI-TEL-LAAN VIE-LÄ VÄ-HÄN, NIIN PÄÄ-SET VIE-LÄ-KIN PI-DEM-MÄL-LE";
          case 4:
              return (!taskSyllabification) ? "4/5 Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!"
                  : "4/5 TO-SI HIE-NO-A! MEL-KEIN KAIK-KI ME-NI OI-KEIN. VIE-LÄ VÄ-HÄN HAR-JOIT-TE-LUA, NIIN VOIT SAA-DA KAIK-KI OI-KEIN EN-SI KER-RAL-LA";
          case 5:
              return (!taskSyllabification) ? "5/5 Wau, ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!"
                  : "5/5 WAU, I-HAN HUIP-PUA! SAIT KAIK-KI OIK-EIN! JAT-KA SA-MAAN MAL-LIIN, O-LET TO-SI TAI-TA-VA!";
          default:
              return (!taskSyllabification) ? "Tässä tämän hetkiset pisteesi:"
                  : "TÄ-MÄN HET-KI-SET PIS-TEE-SI";
      }
  })();

  const { syllabify } = useTaskSyllabification(); //Tavutusfunktio käyttöön



  const ImageBG = require('../assets/background2.jpg');
  const ImageBGDark = require('../assets/background3.png');

  //Modalin avaaminen ja sulkeminen
  useEffect(() => {
    if (questionsAnswered === 5) {

      Speech.stop(); //pysäyttää puheen
      incrementXp(points, "soundToNumber") //comparisonin tilalle oma tehtävän nimi: "imageToNumber", "soundToNumber", "comparison" tai "bonds"
      setShowFeedback(true)
      setGameEnded(true)

    }
  }, [questionsAnswered]);

  const handleBack = () => {
    Speech.stop()
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    handleUpdatePlayerStatsToDatabase()
  };


  const handleContinueGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('Animation', { profile });
  };

  const handleEndGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('SelectProfile', { profile });
  };


  //Oikein : väärin äänien alustus ja toisto
  async function playSound(isCorrect) {
    if (!gameSounds || gameEnded) return;

    setLoading(true);

    const soundUri = isCorrect
      ? require('../assets/sounds/mixkit-achievement-bell.wav')
      : require('../assets/sounds/mixkit-losing-bleeps.wav');

    const { sound } = await Audio.Sound.createAsync(soundUri);
    setSound(sound);
    await sound.playAsync();
    await sound.setVolumeAsync(1.0);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        setLoading(false);
      }
    });
  }
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

//Pelin logiikka
//Päivitetään optionssit kun oikea numero vaihtuu
useEffect(() => {
  if (number !== null) {
    setOptions(generateOptions(number));
  }
}, [number, playerLevel]);

const playNumber = () => {
  Speech.stop();
  Speech.speak(number.toString());
};

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//valitsee oikean numeron ja 3 muuta 0 - playerlevelin väliltä
function generateOptions(correctNumber) {
  const max = typeof playerLevel == 'number' && playerLevel > 0 ? playerLevel : 10;
  const options = [correctNumber];
  while (options.length < 4) {
    const randomNum = generateRandomNumber(0, max);
    if (!options.includes(randomNum)) {
      options.push(randomNum);
    }
  }
  //sekoittaa vaihtoehdot
  return options.sort(() => Math.random() - 0.5); 
}

  const handleSelect = (selectedNumber) => {
    if (gameEnded) return;
    Speech.stop();
    setLoading(true);

    const isCorrect = selectedNumber === number;
    playSound(isCorrect);

    const newNumber = generateRandomNumber(0, playerLevel);
    setNumber(newNumber);

    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prevQuestionsAnswered) => prevQuestionsAnswered + 1);

  const response = isCorrect ? "Oikein!" : "Yritetään uudelleen!";
    if (taskReading) {
      Speech.speak(response);
    }
  };


  return (

    <ImageBackground 
      source={isDarkTheme ? ImageBGDark : ImageBG} 
      style={styles.background} 
      resizeMode="cover"
    >
    <StatusBar 
      barStyle={isDarkTheme ? 'light-content' : 'dark-content'} 
      backgroundColor="transparent" 
      translucent={true} 
    />
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Valitse oikea numero</Text>
        <TouchableOpacity style={styles.startButton} onPress={playNumber}>
          <Text style={styles.buttonText}>{syllabify("Kuuntele numero 🔊")}Kuuntele numero 🔊</Text>
        </TouchableOpacity>
        <View style={isDarkTheme ? styles.optionsContainerDark : styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.number1, loading && { opacity: 0.5 }]}
              onPress={() => handleSelect(option)}
              disabled={loading}
            >
              <Text style={styles.label2}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ModalComponent isVisible={modalVisible} onBack={handleBack} />

      </View>

      {showFeedback && (
        <TouchableWithoutFeedback>
          <View style={styles.overlayInstruction}>
            <View style={styles.instructionWindow}>
              <Text >{feedbackMsg}</Text>
              <Text style={styles.title}>Pistetaulu</Text>
              <Text>Level: {playerLevel}/10</Text>
              <Text>Kokonaispisteet: {totalXp}/190</Text>
              <Text>ImageToNumbers: {imageToNumberXp}/50</Text>
              <Text>SoundToNumbers: {soundToNumberXp}/50</Text>
              <Text>Comparison: {comparisonXp}/50</Text>
              <Text>Bonds: {bondsXp}/40</Text>
              <View style={styles.buttonContainer}>
              <Button
                    title="Seuraava tehtävä odottaa"
                    onPress={() => {
                      handleContinueGame();
                      setGameEnded(false);
                      setShowFeedback(false)
                    }}
                  />
                  <Button title="Lopeta peli" onPress={() => {
                    handleEndGame();
                    setGameEnded(false);
                    setShowFeedback(false)
                  }} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>

    </ImageBackground>

  );

}
