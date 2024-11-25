import { View, Text, Button, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import ModalComponent from '../components/ModalComponent';
import { ScoreContext } from '../components/ScoreContext';
import styles from '../styles';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';


export default function SoundToNumber({ onBack }) {
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp, handleUpdatePlayerStatsToDatabase } = useContext(ScoreContext);
  const { isDarkTheme } = useTheme();
  const { gameSounds } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const { syllabify, taskSyllabification } = useTaskSyllabification();

  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(() => generateRandomNumber(0, playerLevel || 10));
  const [options, setOptions] = useState(generateOptions(number));
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState();

  const ImageBG = require('../assets/background2.jpg');
  const ImageBGDark = require('../assets/background3.png');

  //Modalin avaaminen ja sulkeminen
  useEffect(() => {
    if (questionsAnswered === 5) {
      Speech.stop();
      incrementXp(points, 'soundToNumber');
      setModalVisible(true);
      setGameEnded(true);
    }
  }, [questionsAnswered]);

  const handleBack = () => {
    Speech.stop();
    setModalVisible(false);
    setQuestionsAnswered(0);
    setPoints(0);
    onBack();

    handleUpdatePlayerStatsToDatabase();
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
          <Text style={styles.buttonText}>Kuuntele numero 🔊</Text>
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
    </ImageBackground>
  );
}
