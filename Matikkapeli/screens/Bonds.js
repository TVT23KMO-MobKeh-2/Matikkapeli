import {View,Text,Button,StyleSheet,TextInput,ImageBackground,TouchableWithoutFeedback,Touchable,Pressable} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Svg, { Line } from "react-native-svg";
import { Audio } from "expo-av";
import styles from "../styles";
import * as Speech from "expo-speech";
import ModalComponent from "../components/ModalComponent";
import { ScoreContext } from "../components/ScoreContext";
import { useTheme } from "../components/ThemeContext";
import { useSoundSettings } from "../components/SoundSettingsContext";
import { useTaskReading } from "../components/TaskReadingContext";
import { useTaskSyllabification } from "../components/TaskSyllabificationContext";

// Satunnaisen arvon generointi annetulla alueella
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Bonds({ onBack }) {

  // Pelin aloitustaso ja muut tilamuuttujat
  const levelData = 7;
  const [leftBox, setLeftBox] = useState(0);  // Vasemman laatikon arvo
  const [rightBox, setRightBox] = useState(0);  // Oikean laatikon arvo
  const [witchBox, setWitchBox] = useState(random(0, 1));  // Tieto siitä, kummassa laatikossa on puuttuva luku
  const [inputValue1, setInputValue1] = useState('');  // Käyttäjän syöte vasempaan laatikkoon
  const [inputValue2, setInputValue2] = useState('');  // Käyttäjän syöte oikeaan laatikkoon
  const [sound, setSound] = useState();  // Äänet, joita toistetaan vastauksen perusteella
  const [doneTasks, setDoneTasks] = useState(0);  // Tavoitteena on vastata oikein 5 kysymykseen
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp } = useContext(ScoreContext);  // Pelin pistetilanne ja XP:n käsittely
  const [instructionVisibility, setInstructionVisibility] = useState(true);  // Näytetäänkö ohjeet pelin alussa
  const [modalVisible, setModalVisible] = useState(false);  // Modal-ikkuna näkyvissä vai ei
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
      setModalVisible(true);  // Näytetään modal-ikkuna, kun 5 kysymystä on vastattu
      incrementXp(points, "bonds");  // Lisätään XP-pisteet
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
    setModalVisible(false);  // Piilotetaan modal-ikkuna
    setTimeout(() => {
      setQuestionsAnswered(0);  // Nollataan kysymykset
      setPoints(0);  // Nollataan pisteet
      onBack();  // Palataan edelliseen näkymään
    }, 500);
  };

  const isButtonDisabled = 
  (witchBox === 0 && inputValue1 === '') || 
  (witchBox === 1 && inputValue2 === '') ||
  isTaskChanging

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
                <Text style={styles.title}>{syllabify("Hajonta")}</Text>
                <Text>
                  {syllabify(
                    "Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku."
                  )}
                </Text>
                <View style={styles.buttonContainer}>
                <Button title={syllabify("Aloita")} onPress={() => setInstructionVisibility(false)}/>
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
        <Pressable
          onPress={checkAnswer}
          style={[styles.checkButton, isButtonDisabled ? styles.disabledButton : null]}
          disabled={isButtonDisabled}
        >
          <Text style={styles.checkButtonText}>{syllabify("Tarkista")}</Text>
        </Pressable>

      </View>
      <ModalComponent
        isVisible={modalVisible}
        onBack={handleBack}
      />
    </ImageBackground>

  );
}
