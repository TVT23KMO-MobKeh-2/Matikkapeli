import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext'; //Käytetään ThemeContextia
import { useSoundSettings } from '../components/SoundSettingsContext'; //Haetaan ääniasetukset
import { useTaskReading } from '../components/TaskReadingContext'; //Ääneen luku käyttöön tai pois
import styles from '../styles';

export default function ImageToNumber({ onBack }) {
  const { isDarkTheme } = useTheme();
  const [sound, setSound] = useState();
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isReadingLevel, setIsReadingLevel] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isRoundCompleteMessagePlaying, setIsRoundCompleteMessagePlaying] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const { gameSounds } = useSoundSettings(); //Ääniasetukset
  const { taskReading } = useTaskReading(); //Ääneen luku käyttöön tai pois

  const generateQuestions = (level) => {
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const iconCount = Math.floor(Math.random() * (level + 1));
      questions.push({
        question: `Montako vasaraa näet näytöllä?`,
        iconCount,
        options: Array.from({ length: level + 1 }, (_, i) => i),
      });
    }
    return questions;
  };

  const [questions, setQuestions] = useState(generateQuestions(level));

  async function playSound(isCorrect) {
    if (!gameSounds) return; //Ääni pois päältä, jos gameSounds on false
    const soundUri = isCorrect 
      ? require('../assets/sounds/mixkit-game-level-completed.wav') 
      : require('../assets/sounds/mixkit-arcade-retro-game-over.wav');

    const { sound } = await Audio.Sound.createAsync(soundUri);
    setSound(sound);
    await sound.playAsync();
    await sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  }

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  useEffect(() => {
    const currentQuestion = questions[questionIndex];
    if (taskReading && !isReadingLevel && questionIndex < questions.length) {
      setIsQuestionPlaying(true); //Estää vastaamisen ennen kysymyksen loppua
      Speech.speak(currentQuestion.question, {
        onDone: () => setIsQuestionPlaying(false), //Salli vastaus kun kysymys on luettu
      });
    } else {
      setIsQuestionPlaying(false); //Jos taskReading on pois päältä, jatka suoraan
    }

    setAnswered(false); //Resetoi vastauksen tila uuden kysymyksen alkaessa
  }, [questionIndex, questions, isReadingLevel, taskReading]);

  const handleAnswer = async (selectedAnswer) => {
    if (answered || isRoundCompleteMessagePlaying || isQuestionPlaying) return; //Estää vastaamisen jos jo vastattu tai viesti on kesken
    setAnswered(true);

    const currentQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === currentQuestion.iconCount;

    await playSound(isCorrect);
    const responseMessage = isCorrect ? "Oikein!" : "Yritetään uudelleen!";

    if (taskReading) {
      setTimeout(() => {
        Speech.speak(responseMessage);
      }, 2000);
    }

    setTimeout(() => {
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);

        if (correctAnswers + 1 === 5) {
          if (roundsCompleted < 3) {
            const newRoundsCompleted = Math.min(roundsCompleted + 1, 3);
            setRoundsCompleted(newRoundsCompleted);
            setCorrectAnswers(0);
            setIsRoundCompleteMessagePlaying(true); //Estää vastaamisen viestin aikana

            if (taskReading) {
              Speech.speak(`Kierros ${newRoundsCompleted}/3 suoritettu`, {
                onDone: () => setIsRoundCompleteMessagePlaying(false), //Salli vastaus viestin jälkeen
              });
            } else {
              setIsRoundCompleteMessagePlaying(false);
            }
          }

          if (roundsCompleted + 1 === 3) {
            if (level < 10) {
              setIsReadingLevel(true);
              if (taskReading) {
                const nextLevelMessage = `Siirryt tasolle ${level + 1}!`;
                Speech.speak(nextLevelMessage, {
                  onDone: () => {
                    setLevel(level + 1);
                    setRoundsCompleted(0);
                    setQuestions(generateQuestions(level + 1));
                    setQuestionIndex(0);
                    setIsReadingLevel(false);
                  }
                });
              } else {
                setLevel(level + 1);
                setRoundsCompleted(0);
                setQuestions(generateQuestions(level + 1));
                setQuestionIndex(0);
                setIsReadingLevel(false);
              }
            } else {
              if (taskReading) {
                Speech.speak("Onneksi olkoon! Olet suorittanut ensimmäisen pelin!");
              }
              setTimeout(() => {
                onBack();
              }, 3000);
            }
          } else {
            setQuestionIndex(0);
          }
        } else {
          setQuestionIndex(questionIndex + 1);
        }
      } else {
        setCorrectAnswers(0);
        setQuestionIndex(0);
      }
    }, 3000);
  };

  const renderIcons = () => {
    return Array.from({ length: questions[questionIndex].iconCount }).map((_, index) => (
      <MaterialCommunityIcons
        key={index}
        name="hammer"
        size={50}
        color="#4CAF50"
        style={styles.icon}
      />
    ));
  };

  const renderOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {questions[questionIndex].options.map((option, index) => (
          <View key={index} style={styles.optionWrapper}>
            <TouchableOpacity
              onPress={() => handleAnswer(option)}
              style={styles.optionButton}
              disabled={isRoundCompleteMessagePlaying || isQuestionPlaying} //Estää painamisen viestin tai kysymyksen aikana
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Tehtävä {questionIndex + 1}</Text>
      <Text style={[styles.level, { color: isDarkTheme ? '#fff' : '#000' }]}>Taso: {level} | Kierros: {Math.min(roundsCompleted + 1, 3)}/3</Text>
      <Text style={[styles.question, { color: isDarkTheme ? '#fff' : '#000' }]}>{questions[questionIndex].question}</Text>
      <View style={styles.iconContainer}>
        {renderIcons()}
      </View>
      {renderOptions()}
      <Button title="Palaa takaisin" onPress={onBack} />
    </View>
  );
}
