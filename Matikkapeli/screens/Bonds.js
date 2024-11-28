import { View, Text, Button, StyleSheet, TextInput, ImageBackground, TouchableWithoutFeedback, Touchable, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Svg, { Line } from 'react-native-svg';
import { Audio } from 'expo-av';
import styles from '../styles';
import * as Speech from 'expo-speech';
import { ScoreContext } from '../components/ScoreContext';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


// Satunnaisen arvon generointi annetulla alueella
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Bonds({ onBack }) {
  const route = useRoute();
  const { profile } = route.params;
  const navigation = useNavigation()

  useEffect(() => {
    if (profile) {
      console.log("Bonds:", profile);
    } else {
      console.log("Profile is undefined or null");
    }
  }, [profile]);

  // Pelin aloitustaso ja muut tilamuuttujat
  const levelData = profile ? profile.playerLevel : 0;
  const [leftBox, setLeftBox] = useState(0);  // Vasemman laatikon arvo
  const [rightBox, setRightBox] = useState(0);  // Oikean laatikon arvo
  const [witchBox, setWitchBox] = useState(random(0, 1));  // Tieto siitä, kummassa laatikossa on puuttuva luku
  const [inputValue1, setInputValue1] = useState('');  // Käyttäjän syöte vasempaan laatikkoon
  const [inputValue2, setInputValue2] = useState('');  // Käyttäjän syöte oikeaan laatikkoon
  const [sound, setSound] = useState();  // Äänet, joita toistetaan vastauksen perusteella
  const [doneTasks, setDoneTasks] = useState(0);  // Tavoitteena on vastata oikein 5 kysymykseen
  const {incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, totalXp } = useContext(ScoreContext);  // Pelin pistetilanne ja XP:n käsittely
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [points, setPoints] = useState(0)
  const [instructionVisibility, setInstructionVisibility] = useState(true);  // Näytetäänkö ohjeet pelin alussa
  const [showFeedback, setShowFeedback] = useState(false)
  const { isDarkTheme } = useTheme();  // Teeman väri (tumma vai vaalea)
  const { gameSounds } = useSoundSettings();  // Pelin ääniasetukset
  const { taskReading } = useTaskReading();  // Käytetäänkö tehtävän lukemista ääneen
  const { syllabify, taskSyllabification } = useTaskSyllabification();  // Käytetäänkö tavutusta
  const [isTaskChanging, setIsTaskChanging] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false)


  // Äänitiedostot oikein ja väärin vastauksille
  const correctSound = require('../assets/sounds/mixkit-achievement-bell.wav');  // Oikea vastausääni
  const wrongSound = require('../assets/sounds/mixkit-losing-bleeps.wav');  // Väärä vastausääni
  const imagaBG = require('../assets/view6.png')  // Taustakuva

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

  // Funktio, joka generoi uuden pelitason (arvot vasemmalle ja oikealle laatikolle)
  const generateNewLevel = () => {
    setIsTaskChanging(true)
    const newLeftBox = random(0, levelData);  // Arvotaan vasemman laatikon arvo
    const newRightBox = levelData - newLeftBox;  // Lasketaan oikean laatikon arvo
    setLeftBox(newLeftBox);
    setRightBox(newRightBox);
    setWitchBox(random(0, 1));  // Arvotaan, kummassa laatikossa on puuttuva luku
    setInputValue1('');  // Tyhjennetään syötekenttä
    setInputValue2('');  // Tyhjennetään syötekenttä
    setTimeout(() => {
      setIsTaskChanging(false)
    }, 2000)
  };

  // Efekti, joka käynnistää tason generoinnin heti, kun pelin taso muuttuu
  useEffect(() => {
    generateNewLevel();
  }, [levelData]);

  // Efekti, joka purkaa äänitiedoston, kun komponentti poistetaan
  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  // Funktio, joka toistaa äänen sen mukaan, onko vastaus oikein vai väärin
  const playSound = async (isCorrect) => {
    const soundToPlay = isCorrect ? correctSound : wrongSound;  // Valitaan oikea ääni
    const { sound } = await Audio.Sound.createAsync(soundToPlay);
    setSound(sound);  // Asetetaan äänitiedosto soittokelpoiseksi
    await sound.playAsync();  // Soitetaan ääni
  };

  // Tehtävän tarkistus (tarkistaa onko käyttäjän vastaus oikein)
  useEffect(() => {
    if (questionsAnswered === 5) {
      setShowFeedback(true);  // Näytetään feedback-ikkuna, kun 5 kysymystä on vastattu
      // Lisätään XP-pisteet
      incrementXp(points, "bonds");
      console.log("Bonds points: ", points)
    }
  }, [questionsAnswered]);

  // Funktio, joka tarkistaa käyttäjän vastauksen
  const checkAnswer = async () => {
    if (isButtonClicked) return

    setIsButtonClicked(true)
    const correctAnswer = witchBox === 0 ? leftBox : rightBox;  // Oikea vastaus riippuu siitä, kummassa laatikossa on puuttuva luku
    const userAnswer = witchBox === 0 ? parseInt(inputValue1) : parseInt(inputValue2);  // Käyttäjän syöte (luku)

    if (userAnswer === correctAnswer) {  // Jos vastaus on oikein
      await playSound(true);  // Soitetaan oikea ääni
      setPoints((prevPoints) => prevPoints + 1);  // Lisätään pisteet
    } else {  // Jos vastaus on väärin
      await playSound(false);  // Soitetaan väärä ääni
    }

    setQuestionsAnswered((prev) => prev + 1);  // Lisätään vastattujen kysymysten määrä

    if (questionsAnswered + 1 < 5) {  // Jos kysymyksiä on vähemmän kuin 5, luodaan uusi taso
      setTimeout(() => {
        generateNewLevel();
        setIsButtonClicked(false)
      }, 1000);
    } else {
      setIsButtonClicked(false)
    }
  };

  // Takaisin-napin toiminnallisuus
  const handleBack = () => {
    Speech.stop();  // Pysäytetään mahdollinen puhe
    setShowFeedback(false);  // Piilotetaan feedback-ikkuna
    setQuestionsAnswered(0);  // Nollataan kysymykset
    setPoints(0);  // Nollataan pisteet
    handleUpdatePlayerStatsToDatabase()
  };

  const isButtonDisabled =
    (witchBox === 0 && inputValue1 === '') ||
    (witchBox === 1 && inputValue2 === '') ||
    isTaskChanging

  const handleContinueGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('Animation', { profile });
  };

  const handleEndGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('SelectProfile', { profile });
  };

  return (
    <ImageBackground
      source={imagaBG}
      style={styles.background}
      resizeMode='cover'>
      <View style={styles.container}>
        {instructionVisibility && (
          <TouchableWithoutFeedback>
            <View style={styles.overlayInstruction}>
              <View style={styles.instructionWindow}>
                <Text style={styles.title}>Hajonta</Text>
                <Text>Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku.</Text>
                <View style={styles.buttonContainer}>
                  <Button title='Aloita' onPress={() => setInstructionVisibility(false)}></Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={styles.taskbox}>
          <Text style={styles.title}> Täydennä puuttuva luku.</Text>
        </View>

        <Svg height="300" width="300" style={styles.lineContainer}>
          <Line x1="150" y1="100" x2="70" y2="230" stroke="black" strokeWidth="5" />
          <Line x1="150" y1="100" x2="230" y2="230" stroke="black" strokeWidth="5" />
        </Svg>

        <View style={styles.circle}>
          <Text style={styles.circletext}>{levelData}</Text>
        </View>

        <View style={styles.numbers}>
          <View style={styles.number1}>
            {witchBox === 0 ? (
              <TextInput
                style={styles.input}
                value={inputValue1}
                onChangeText={setInputValue1}
                keyboardType="numeric"
                autoFocus={true}
                maxLength={2}
              />
            ) : (
              <Text style={styles.numbertext}>{leftBox}</Text>
            )}
          </View>
          <View style={styles.number2}>
            {witchBox === 1 ? (
              <TextInput
                style={styles.input}
                value={inputValue2}
                onChangeText={setInputValue2}
                keyboardType="numeric"
                autoFocus={true}
                maxLength={2}
              />
            ) : (
              <Text style={styles.numbertext}>{rightBox}</Text>
            )}
          </View>
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
