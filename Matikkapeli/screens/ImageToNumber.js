import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import styles from '../styles';
import ModalComponent from '../components/ModalComponent';
import { ScoreContext } from '../components/ScoreContext';

//A function that generates a random number between min and ma
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ImageToNumber({ onBack }) {
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp } = useContext(ScoreContext);

  const [sound, setSound] = useState();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isSpeechFinished, setIsSpeechFinished] = useState(false); //Follow the completion of the speech

  //Create the questions
  const generateQuestions = () => {
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const iconCount = random(0, 5); //A random number of icons between 0 and 5
      questions.push({
        question: `Montako vasaraa näet näytöllä?`,
        iconCount,
        options: Array.from({ length: 6 }, (_, i) => i), //Options 0-5
      });
    }
    return questions;
  };

  const [questions] = useState(generateQuestions());

  //A function that plays a sound (correct/incorrect)
  async function playSound(isCorrect) {
    if (gameEnded) return; //No sound is played after the game ends
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

  //a hook that checks if the game ends
  useEffect(() => {
    if (questionsAnswered === 5) {
      incrementXp(points, "imageToNumber");
      setGameEnded(true);
      setModalVisible(true); //Showing a modal when the game ends
    }
  }, [questionsAnswered]);

  //Process the answer
  const handleAnswer = async (selectedAnswer) => {
    if (answered || gameEnded || !isSpeechFinished) return; //Make sure that the answer is only processed after the speech

    setAnswered(true);
    const currentQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === currentQuestion.iconCount;

    await playSound(isCorrect);

    //Move on to the next question with a 3 second delay
    setTimeout(() => {
      setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 3000);

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

  //Rendering options
  const renderOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {questions[questionIndex].options.map((option, index) => (
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

  return (
    <View style={styles.container}>
      {/*Only show the question if the game is not over*/}
      {!gameEnded && <Text style={styles.question}>{questions[questionIndex].question}</Text>}
      
      <View style={styles.iconContainer}>
        {renderIcons()}
      </View>
      {renderOptions()}
      <Button title="Palaa takaisin" onPress={handleBack} />
      
      {/*A ModalComponent that will appear when the game ends*/}
      <ModalComponent
        isVisible={modalVisible}
        onBack={handleBack}
      />
    </View>
  );
}