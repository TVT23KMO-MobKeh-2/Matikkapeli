import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import ModalComponent from '../components/ModalComponent';
import { ScoreContext } from '../components/ScoreContext';
import styles from '../styles';
import { Audio } from 'expo-av';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarComponent from '../components/TopBarComponent';

export default function SoundToNumber({ onBack }) {
  const [number, setNumber] = useState(generateRandomNumber());
  const [options, setOptions] = useState(generateOptions(number));
  const [modalVisible, setModalVisible] = useState(false);
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp, handleUpdatePlayerStatsToDatabase } = useContext(ScoreContext);
  const [sound, setSound] = useState();
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDarkTheme } = useTheme();
  const { gameSounds } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const { syllabify, taskSyllabification } = useTaskSyllabification();

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
  };

  async function playSound(isCorrect) {
    if (!gameSounds || gameEnded) return;

    setLoading(true);

    const soundUri = isCorrect
      ? require('../assets/sounds/mixkit-achievement-bell.wav')
      : require('../assets/sounds/mixkit-losing-bleeps.wav');

    const { sound } = await Audio.Sound.createAsync(soundUri);
    setSound(sound);
    await sound.playAsync();
    await sound.setVolumeAsync(1.0); // Volume is set to max for demonstration

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        setLoading(false);
      }
    });
  }
//Korjaa siihen levelisysteemiin
  function generateRandomNumber() {
    return Math.floor(Math.random() * 10);
  }

  function generateOptions(correctNumber) {
    const options = [correctNumber];
    while (options.length < 4) {
      const randomNum = Math.floor(Math.random() * 10);
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playNumber = () => {
    Speech.stop();
    Speech.speak(number.toString());
  };

  const handleSelect = (selectedNumber) => {
    if (gameEnded) return;
    Speech.stop();
    setLoading(true);

    const isCorrect = selectedNumber === number;
    playSound(isCorrect);

    const newNumber = generateRandomNumber();
    setNumber(newNumber);
    setOptions(generateOptions(newNumber));
    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prevQuestionsAnswered) => prevQuestionsAnswered + 1);
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={isDarkTheme ? '#333' : '#fff'} />
      <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Valitse oikea numero</Text>
        <TouchableOpacity style={styles.startButton} onPress={playNumber}>
          <Text style={styles.buttonText}>Kuuntele numero 🔊</Text>
        </TouchableOpacity>
        <View style={styles.optionsContainer}>
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
    </SafeAreaView>
  );
}
