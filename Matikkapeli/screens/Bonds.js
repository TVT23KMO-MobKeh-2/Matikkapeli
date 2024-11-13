import { View, Text, Button, StyleSheet, TextInput, ImageBackground } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Svg, { Line } from 'react-native-svg';
import { Audio } from 'expo-av';
import styles from '../styles';
import * as Speech from 'expo-speech';
import ModalComponent from '../components/ModalComponent';
import { ScoreContext } from '../components/ScoreContext';


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Bonds({ onBack }) {

  const levelData = 7;
  const [leftBox, setLeftBox] = useState(0);
  const [rightBox, setRightBox] = useState(0);
  const [witchBox, setWitchBox] = useState(random(0, 1));
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [sound, setSound] = useState();
  const [doneTasks, setDoneTasks] = useState(0);
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp } = useContext(ScoreContext)
  const [modalVisible, setModalVisible] = useState(false)

  const correctSound = require('../assets/success.mp3');
  const wrongSound = require('../assets/fail.mp3');
  const imagaBG = require('../assets/view6.png')

  // Funktio, joka generoi uuden pelitason
  const generateNewLevel = () => {
    const newLeftBox = random(0, levelData);
    const newRightBox = levelData - newLeftBox;
    setLeftBox(newLeftBox);
    setRightBox(newRightBox);
    setWitchBox(random(0, 1));
    setInputValue1('');
    setInputValue2('');
  };

  // Efekti, joka generoi uuden tason aina, kun pelitaso muuttuu
  useEffect(() => {
    generateNewLevel();
  }, [levelData]);

  // Efekti, joka purkaa äänen
  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  // Funktio, joka toistaa äänen sen mukaan, onko vastaus oikein vai väärin
  const playSound = async (isCorrect) => {
    const soundToPlay = isCorrect ? correctSound : wrongSound;
    const { sound } = await Audio.Sound.createAsync(soundToPlay);
    setSound(sound);
    await sound.playAsync();
  };

  // Funktio, joka tarkistaa käyttäjän vastauksen
  useEffect(() => {
    if (questionsAnswered === 5) {
      setModalVisible(true);
      incrementXp(points, "bonds");
    }
  }, [questionsAnswered]);

  const checkAnswer = async () => {
    const correctAnswer = witchBox === 0 ? leftBox : rightBox;
    const userAnswer = witchBox === 0 ? parseInt(inputValue1) : parseInt(inputValue2);

    if (userAnswer === correctAnswer) {
      await playSound(true);
      setPoints((prevPoints) => prevPoints + 1);
    } else {
      await playSound(false);
    }

    setQuestionsAnswered((prev) => prev + 1);

    if (questionsAnswered + 1 < 5) {
      setTimeout(() => {
        generateNewLevel();
      }, 2000);
    }
  };

  const handleBack = () => {
    Speech.stop();
    setModalVisible(false);
    setTimeout(() => {
      setQuestionsAnswered(0);
      setPoints(0);
      onBack();
    }, 500);
  };



  return (
    <ImageBackground
      source={imagaBG}
      style={styles.background}
      resizeMode='cover'>
      <View style={styles.container}>
        <View style={styles.taskbox}>
          <Text style={styles.title}>Hajonta</Text>

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
        <Button title="Tarkista" onPress={checkAnswer}></Button>
        <View style={styles.buttonContainer}>
            <Button title="Palaa takaisin" onPress={onBack} />
        </View>

      </View>
      <ModalComponent
        isVisible={modalVisible}
        onBack={handleBack}
      />
    </ImageBackground>

  );
}

