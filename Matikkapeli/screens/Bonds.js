
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, TouchableWithoutFeedback, ScrollView, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Svg, { Line } from 'react-native-svg';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { ScoreContext } from '../components/ScoreContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';

// Satunnaisen arvon generointi annetulla alueella
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  const levelData = profile.playerLevel;
  const [leftBox, setLeftBox] = useState(0);  // Vasemman laatikon arvo
  const [rightBox, setRightBox] = useState(0);  // Oikean laatikon arvo
  const [witchBox, setWitchBox] = useState(random(0, 1));  // Tieto siitä, kummassa laatikossa on puuttuva luku
  const [inputValue1, setInputValue1] = useState('');  // Käyttäjän syöte vasempaan laatikkoon
  const [inputValue2, setInputValue2] = useState('');  // Käyttäjän syöte oikeaan laatikkoon
  const [sound, setSound] = useState();  // Äänet, joita toistetaan vastauksen perusteella
  const [doneTasks, setDoneTasks] = useState(0);  // Tavoitteena on vastata oikein 5 kysymykseen
  const { incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, totalXp } = useContext(ScoreContext);  // Pelin pistetilanne ja XP:n käsittely
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [points, setPoints] = useState(0)
  const [instructionVisibility, setInstructionVisibility] = useState(true);  // Näytetäänkö ohjeet pelin alussa
  const [showFeedback, setShowFeedback] = useState(false)
  const { isDarkTheme } = useTheme();  // Teeman väri (tumma vai vaalea)
  const { gameSounds, playSound } = useSoundSettings();  // Pelin ääniasetukset
  const { taskReading } = useTaskReading();  // Käytetäänkö tehtävän lukemista ääneen
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();  // Käytetäänkö tavutusta
  const [isTaskChanging, setIsTaskChanging] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [instructionReading, setInstructionReading] = useState(true)


  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);
  const bgIndex = 4;


  // Äänitiedostot oikein ja väärin vastauksille
  //const imagaBG = require('../assets/view6.png')  // Taustakuva

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


  useEffect(() => {
    // Ensure previous speech is stopped before starting new speech
    Speech.stop();
  
    if (taskReading && instructionReading) {
      // Speak the full task instruction when both taskReading and instructionReading are true
      Speech.speak("Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku.");
  // Prevent repeated instructions
    } else if (!instructionReading) {
      // If instructionReading is false, speak the shorter instruction
      Speech.speak("Täydennä puuttuva luku.");
    }
  }, [taskReading, instructionReading]); // Runs when either taskReading or instructionReading changes
  


return (
  <ImageBackground
    source={getBGImage(isDarkTheme, bgIndex)}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.container}>
      <View style={styles.tehtcont}>
        {instructionVisibility && (
          <TouchableWithoutFeedback
            onPress={() => {
              setInstructionVisibility(false);
              handleInstructionSpeak();
            }}>
            <View style={styles.overlayInstruction}>
              <View style={styles.instructionWindow}>
                <Text style={styles.title}>{syllabify("Hajonta")}</Text>
                <Text>
                  {syllabify(
                    "Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku."
                  )}
                </Text>
                <View style={styles.buttonContainer}>

                  <Button title={syllabify("Aloita")} onPress={() => {setInstructionReading(false); setInstructionVisibility(false)} } />

                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={styles.taskbox}>

          <Text style={styles.title}>{syllabify("Täydennä puuttuva luku.")}</Text>

        </View>

        <Svg height="300" width="300" style={styles.lineContainer}>
          <Line x1="150" y1="100" x2="70" y2="230" stroke="black" strokeWidth="5" />
          <Line x1="150" y1="100" x2="230" y2="230" stroke="black" strokeWidth="5" />
        </Svg>

        <View style={styles.circle}>
          <Text style={[styles.numbertext, { color: 'white' }]}>{levelData}</Text>
        </View>

        <View style={styles.numbers}>
          <View style={styles.number1}>
            {witchBox === 0 ? (
              <TextInput
                style={styles.numbertext}
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
                style={styles.numbertext}
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

        <Pressable
          onPress={checkAnswer}
          style={[styles.checkButton, isButtonDisabled ? styles.disabledButton : null]}
          disabled={isButtonDisabled}>
          <Text style={styles.buttonText}>{syllabify("Tarkista")}</Text>
        </Pressable>

        {showFeedback && (
          <TouchableWithoutFeedback>
            <View style={styles.overlayInstruction}>
              <View style={styles.instructionWindow}>
                <Text >{getFeedbackMessage(points)}</Text>
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
                      setShowFeedback(false)
                    }}
                  />
                  <Button title="Lopeta peli" onPress={() => {
                    handleEndGame();
                    setShowFeedback(false)
                  }} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  </ImageBackground>
);

}
