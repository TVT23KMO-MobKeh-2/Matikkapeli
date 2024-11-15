import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { Audio } from 'expo-av'; //expo-av äänten toistamiseen
import styles from '../styles';

export default function ImageToNumber({ onBack }) {
  const { isDarkTheme } = useTheme();
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { gameSounds } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const { syllabify, taskSyllabification } = useTaskSyllabification();

  //Generoi kysymykset tason mukaan
  const generateQuestions = (level) => {
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const iconCount = Math.floor(Math.random() * (level + 1));
      questions.push({
        question: `Montako vasaraa näet näytöllä?`, //Kysymys
        iconCount,
        options: Array.from({ length: level + 1 }, (_, i) => i),
      });
    }
    return questions;
  };

  const [questions, setQuestions] = useState(generateQuestions(level));

  useEffect(() => {
    setQuestions(generateQuestions(level));
    setQuestionIndex(0); //Resetoi kysymysindeksi, kun taso muuttuu
  }, [level]);

  //Pelin äänten toistaminen
  const playSound = async (isCorrect) => {
    if (!gameSounds) return; //Ääni pois päältä, jos gameSounds on false

    try {
      const sound = new Audio.Sound();
      const soundUri = isCorrect
        ? require('../assets/sounds/mixkit-game-level-completed.wav') //Oikein ääni
        : require('../assets/sounds/mixkit-arcade-retro-game-over.wav'); //Väärin ääni

      await sound.loadAsync(soundUri);
      await sound.playAsync(); //Soita ääni
    } catch (error) {
      console.error("Äänen toistaminen epäonnistui", error);
    }
  };

  //Lue kysymys ääneen, kun se vaihtuu
  useEffect(() => {
    const currentQuestion = questions[questionIndex]?.question;
    if (taskReading && currentQuestion && !answered) {
      Speech.speak(currentQuestion); //Lue kysymys ääneen
    }
  }, [questionIndex, taskReading, answered]); //Hook aktivoituu, kun 'questionIndex' muuttuu

  const handleAnswer = async (selectedAnswer) => {
    if (answered) return; //Estää vastaamisen, jos jo vastattu
    setAnswered(true);

    const currentQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === currentQuestion.iconCount;

    const responseMessage = isCorrect ? "Oikein!" : "Yritetään uudelleen!";

    if (taskReading) {
      Speech.speak(responseMessage); //Puhuu heti, kun vastaus on annettu
    }

    //Soita ääni oikein/väärin
    playSound(isCorrect);

    setTimeout(() => {
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
        if (correctAnswers + 1 === 5) {
          if (roundsCompleted < 3) {
            const newRoundsCompleted = Math.min(roundsCompleted + 1, 3);
            setRoundsCompleted(newRoundsCompleted);
            setCorrectAnswers(0);
          }
        }
        setQuestionIndex(questionIndex + 1);
      } else {
        setCorrectAnswers(0);
        setQuestionIndex(0);
      }
      setAnswered(false);
    }, 3000);
  };

  const renderIcons = () => {
    return Array.from({ length: questions[questionIndex]?.iconCount || 0 }).map((_, index) => (
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
        {questions[questionIndex]?.options.map((option, index) => (
          <View key={index} style={styles.optionWrapper}>
            <TouchableOpacity
              onPress={() => handleAnswer(option)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderQuestionText = () => {
    const currentQuestion = questions[questionIndex];
    const text = currentQuestion?.question;
    return taskSyllabification ? syllabify(text) : text;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Tehtävä {questionIndex + 1}</Text>
      <Text style={[styles.level, { color: isDarkTheme ? '#fff' : '#000' }]}>Taso: {level} | Kierros: {Math.min(roundsCompleted + 1, 3)}/3</Text>
      <Text style={[styles.question, { color: isDarkTheme ? '#fff' : '#000' }]}>{renderQuestionText()}</Text>
      <View style={styles.iconContainer}>
        {renderIcons()}
      </View>
      {renderOptions()}
      <Button title="Palaa takaisin" onPress={onBack} />
    </View>
  );
}
