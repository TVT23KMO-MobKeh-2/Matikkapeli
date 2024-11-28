
import { View, Text, Button, TouchableOpacity, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScoreContext } from '../components/ScoreContext';
import styles from '../styles';
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
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification(); //Käytetään tavutuskontekstia
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const ImageBG = require('../assets/background2.jpg');
  const ImageBGDark = require('../assets/background3.png');

  //Palautteen avaaminen ja sulkeminen
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
      </View>
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

    </ImageBackground >

  );

}
