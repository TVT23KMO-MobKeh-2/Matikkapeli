import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';

export default function IconCountGame({ onBack }) {
  const [sound, setSound] = useState();
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isReadingLevel, setIsReadingLevel] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isRoundCompleteMessagePlaying, setIsRoundCompleteMessagePlaying] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);

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
    if (!isReadingLevel && questionIndex < questions.length) {
      const currentQuestion = questions[questionIndex];
      setIsQuestionPlaying(true); //Blocking the answer until the question has been read
      Speech.speak(currentQuestion.question, {
        onDone: () => setIsQuestionPlaying(false), //An answer is allowed after the question has been read
      });
      setAnswered(false); //Reset the answer status when a new question starts
    }
  }, [questionIndex, questions, isReadingLevel]);

  const handleAnswer = async (selectedAnswer) => {
    if (answered || isRoundCompleteMessagePlaying || isQuestionPlaying) return; //The answer is blocked if it has already been answered or the message is in progress or the question is not finished
    setAnswered(true);

    const currentQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === currentQuestion.iconCount;

    await playSound(isCorrect);
    const responseMessage = isCorrect ? "Oikein!" : "Yritetään uudelleen!";
    
    setTimeout(() => {
      Speech.speak(responseMessage);
    }, 2000);

    setTimeout(() => {
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);

        //Check if the round is ready
        if (correctAnswers + 1 === 5) {
          if (roundsCompleted < 3) {
            const newRoundsCompleted = Math.min(roundsCompleted + 1, 3);
            setRoundsCompleted(newRoundsCompleted);
            setCorrectAnswers(0);
            setIsRoundCompleteMessagePlaying(true); //Prevent reply during message

            Speech.speak(`Kierros ${newRoundsCompleted}/3 suoritettu`, {
              onDone: () => {
                setIsRoundCompleteMessagePlaying(false); //Allow reply after message
              }
            });
          }

          //Next level if all three rounds are completed
          if (roundsCompleted + 1 === 3) {
            if (level < 10) {
              setIsReadingLevel(true);
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
              Speech.speak("Onneksi olkoon! Olet suorittanut ensimmäisen pelin!");
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
              disabled={isRoundCompleteMessagePlaying || isQuestionPlaying} //Prevents pressing during a message or question
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tehtävä {questionIndex + 1}</Text>
      <Text style={styles.level}>Taso: {level} | Kierros: {Math.min(roundsCompleted + 1, 3)}/3</Text>
      <Text style={styles.question}>{questions[questionIndex].question}</Text>
      <View style={styles.iconContainer}>
        {renderIcons()}
      </View>
      {renderOptions()}
      <Button title="Palaa takaisin" onPress={onBack} />
    </View>
  );
}
