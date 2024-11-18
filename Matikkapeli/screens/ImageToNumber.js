import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { Audio } from 'expo-av'; //expo-av äänten toistamiseen
import styles from '../styles';
import ModalComponent from '../components/ModalComponent';
import { ScoreContext } from '../components/ScoreContext';

//A function that generates a random number between min and ma
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ImageToNumber({ onBack }) {
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp } = useContext(ScoreContext);
  const { isDarkTheme } = useTheme();
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { gameSounds } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const { syllabify, taskSyllabification } = useTaskSyllabification();
  const [modalVisible, setModalVisible] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isSpeechFinished, setIsSpeechFinished] = useState(false);

  //Generoi kysymykset
  const generateQuestions = () => {

    const questions = [];
    for (let i = 0; i < 5; i++) {
      const iconCount = random(0, 5); //A random number of icons between 0 and 5
      questions.push({
        question: `Montako vasaraa näet näytöllä?`, //Kysymys
        iconCount,
        options: Array.from({ length: 6 }, (_, i) => i), //Options 0-5
      });
    }
    return questions;
  };

  const [questions] = useState(generateQuestions());

const playSound = async (isCorrect) => {
  if (!gameSounds || gameEnded) return;

  try {
    const soundUri = isCorrect
      ? require('../assets/sounds/mixkit-game-level-completed.wav')
      : require('../assets/sounds/mixkit-arcade-retro-game-over.wav');

    const { sound } = await Audio.Sound.createAsync(soundUri);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (error) {
    console.error("Error playing sound", error);
  }
};


const [isSpeechFinished, setIsSpeechFinished] = useState(false);

useEffect(() => {
  if (gameEnded) return;

  const currentQuestion = questions[questionIndex];
  setAnswered(false);
  setIsSpeechFinished(false);

  if (taskReading && currentQuestion) {
    Speech.speak(currentQuestion.question, {
      onDone: () => setIsSpeechFinished(true),
    });
  }
}, [questionIndex, questions, taskReading, gameEnded]);


  const handleAnswer = async (selectedAnswer) => {
  if (answered || gameEnded || !isSpeechFinished) return;

  setAnswered(true);
  const currentQuestion = questions[questionIndex];
  const isCorrect = selectedAnswer === currentQuestion.iconCount;

  if (taskReading) {
    Speech.speak(isCorrect ? "Oikein!" : "Yritetään uudelleen!");
  }

  await playSound(isCorrect);

  // Päivitä tilat oikean vastauksen perusteella
  if (isCorrect) {
    setPoints((prevPoints) => prevPoints + 1);
    setCorrectAnswers((prev) => prev + 1);
    if (correctAnswers + 1 === 5) {
      setRoundsCompleted((prev) => Math.min(prev + 1, 3));
      setCorrectAnswers(0);
    }
  }

  // Päivitä seuraava kysymys
  setTimeout(() => {
    setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setAnswered(false);
  }, 3000);

  setQuestionsAnswered((prev) => prev + 1);
};


    //Points will be added for the correct answer
    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }

    setQuestionsAnswered((prev) => prev + 1);
  };

  const handleBack = () => {
    Speech.stop();
    setModalVisible(false);
    setQuestionsAnswered(0);
    setPoints(0);
    setGameEnded(false);
    onBack();
  };

// Pelin päättymistä tarkkaileva useEffect
useEffect(() => {
  if (questionsAnswered >= questions.length) {
    setGameEnded(true);
    setModalVisible(true);
    incrementXp(points, "imageToNumber");
  }
}, [questionsAnswered]);

  //Speech processing
  useEffect(() => {
    if (gameEnded) return; //No more questions if the game is over
    const currentQuestion = questions[questionIndex];
    setAnswered(false);
    setIsSpeechFinished(false); //Reset the talk ready status before start

    Speech.speak(currentQuestion.question, {
      onDone: () => setIsSpeechFinished(true), //Set the ready state to true when the speech is finished
    });
  }, [questionIndex, questions, gameEnded]);

  //Icons for question
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

  //Rendering options
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
    {!gameEnded ? (
      <>
        <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Tehtävä {questionIndex + 1}/{questions.length}
        </Text>
        <Text style={[styles.level, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Taso: {level} | Kierros: {roundsCompleted}/3
        </Text>
        <Text style={[styles.question, { color: isDarkTheme ? '#fff' : '#000' }]}>
          {renderQuestionText()}
        </Text>
        <View style={styles.iconContainer}>{renderIcons()}</View>
        {renderOptions()}
      </>
    ) : (
      <Text style={styles.title}>Peli päättyi!</Text>
    )}
    //<Button title="Palaa takaisin" onPress={handleBack} />
    <ModalComponent isVisible={modalVisible} onBack={handleBack} />
  </View>
);
}
