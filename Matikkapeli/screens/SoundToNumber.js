import { View, Text, Button, TouchableOpacity, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import { ScoreContext } from '../components/ScoreContext';
import styles, {getBGImage}  from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';

export default function SoundToNumber({ onBack }) {
  const route = useRoute();
  const { profile } = route.params;
  const navigation = useNavigation();

  const [showFeedback, setShowFeedback] = useState(false);
  const { playerLevel, incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, totalXp } = useContext(ScoreContext);
  const [points, setPoints] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { isDarkTheme } = useTheme();
  const { gameSounds, playSound } = useSoundSettings(); // Haetaan playSound suoraan kontekstista
  const { taskReading } = useTaskReading();
  const [number, setNumber] = useState(() => generateRandomNumber(0, playerLevel || 10));
  const [options, setOptions] = useState(generateOptions(number));
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('SoundToNumber profile:', profile);
  // Palautteen avaaminen ja sulkeminen
  useEffect(() => {
    if (questionsAnswered === 5) {
      Speech.stop();
      incrementXp(points, "soundToNumber");
      setShowFeedback(true);
      setGameEnded(true);
    }
  }, [questionsAnswered]);

  const handleBack = () => {
    Speech.stop();
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    handleUpdatePlayerStatsToDatabase();
  };

  const handleContinueGame = () => {
    handleBack();
    navigation.navigate('Animation', { profile });
  };

  const handleEndGame = () => {
    handleBack();
    navigation.navigate('SelectProfile', { profile });
  };

  // Pelin logiikka
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
  }

  // Valitsee oikean numeron ja 3 muuta 0 - playerlevelin väliltä
  function generateOptions(correctNumber) {
    const max = typeof playerLevel === 'number' && playerLevel > 0 ? playerLevel : 10;
    //console.log('playerLevel:', playerLevel);
    const options = [correctNumber];
    const possibleNumbers = Array.from({ length: max + 1 }, (_, i) => i);
    const remainingNumbers = possibleNumbers.filter(num => num !== correctNumber);
    //console.log('SoundToNumber remainingNumbers:', remainingNumbers);
    const randomOptions = remainingNumbers.sort(() => Math.random() - 0.5).slice(0, 3);
    options.push(...randomOptions);
    //console.log('Generated options:', options);

    return options.sort(() => Math.random() - 0.5);
  }

  //console.log('SoundToNumber options:WÄÄWÄÄ', options);

  const handleSelect = async (selectedNumber) => {
    if (gameEnded) return;
    Speech.stop();
    setLoading(true);

    const isCorrect = selectedNumber === number;
    await playSound(isCorrect); // Käytetään kontekstin kautta haettua playSound-funktiota

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
    setLoading(false);
  };
 //console.log('TÄÄLLÄKI')
  return (
    <ImageBackground 
    source={getBGImage(isDarkTheme)} 
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
          <Text style={styles.buttonText}>{syllabify("Kuuntele numero 🔊")}</Text>
        </TouchableOpacity>
        <View style={isDarkTheme ? styles.optionsContainerDark : styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.number1, loading && { opacity: 0.5 }]}
              onPress={() => handleSelect(option)}
              disabled={loading}
            >
              <Text style={styles.title}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {showFeedback && (
        <TouchableWithoutFeedback>
          <View style={styles.overlayInstruction}>
            <View style={styles.instructionWindow}>
              <Text>{getFeedbackMessage(points)}</Text>
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
                    setShowFeedback(false);
                  }}
                />
                <Button
                  title="Lopeta peli"
                  onPress={() => {
                    handleEndGame();
                    setGameEnded(false);
                    setShowFeedback(false);
                  }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </ImageBackground>
  );
}
