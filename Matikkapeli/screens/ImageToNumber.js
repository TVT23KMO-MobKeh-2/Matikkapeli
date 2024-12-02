import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { ScoreContext } from '../components/ScoreContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useNavigation, useRoute } from '@react-navigation/native';

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';

// Funktio, joka generoi satunnaisen luvun väliltä min ja max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ImageToNumber({ onBack }) {
  const route = useRoute();
  const { profile } = route.params;
  const navigation = useNavigation();
  const [points, setPoints] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, totalXp } = useContext(ScoreContext);
  const { gameSounds, volume, playSound } = useSoundSettings(); // Käytetään ääniasetuksia ja kontekstin playSound-funktiota
  const { taskReading } = useTaskReading(); // Käytetään tehtävänlukukontekstia
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification(); // Käytetään tavutuskontekstia

  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light; 
  const styles = createStyles(theme);  
  const bgIndex = 1;  

  const [questionIndex, setQuestionIndex] = useState(0); // Nykyinen kysymyksen indeksi
  const [answered, setAnswered] = useState(false); // Onko kysymykseen vastattu
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); // Onko peli päättynyt
  const [isSpeechFinished, setIsSpeechFinished] = useState(false); // Seurataan puheen valmistumista

  // Generoi kysymyksiä pelille
  const generateQuestions = () => {
    const questions = [];
    let lastIconCount = null

    for (let i = 0; i < 5; i++) {
      const minLevel = Math.max(0, profile?.playerLevel - 2)
      const iconCount = Math.min(random(minLevel, profile?.playerLevel || 1), 10); // Satunnainen määrä vasaroita
      const options = Array.from({ length: profile.playerLevel - minLevel + 1 }, (_, i) => minLevel + i)
      questions.push({
        question: `Montako esinettä näet näytöllä?`, // Kysymyksen teksti
        iconCount,
        options, // Vaihtoehdot
      });
    }
    return questions;
  };

  const [questions, setQuestions] = useState(generateQuestions());

  // Alustetaan kysymykset ja nollataan kysymysindeksi
  useEffect(() => {
    setQuestions(generateQuestions());
    setQuestionIndex(0); // Nollaa kysymysindeksi, kun peli alkaa
  }, []);

  // Tarkistetaan, onko peli päättynyt (5 kysymystä vastattu)
  useEffect(() => {
    if (questionsAnswered === 5) {
      incrementXp(points, "imageToNumber"); // Päivitetään XP
      setGameEnded(true);
      setShowFeedback(true);
    }
  }, [questionsAnswered]);

  // Käyttäjän vastauksen käsittely
  const handleAnswer = async (selectedAnswer) => {
    if (answered || gameEnded || !isSpeechFinished) return; // Estä useat vastaukset tai ei-valmiit vastaukset

    setAnswered(true); // Lukitse vastaukset, kun ensimmäinen valinta tehty
    const currentQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === currentQuestion.iconCount;

    // Palaute puheena
    const responseMessage = isCorrect ? "Oikein!" : "Yritetään uudelleen!";
    if (taskReading) {
      Speech.speak(responseMessage);
    }

    // Toista oikein/väärin ääni kontekstista saatavalla playSound-funktiolla
    await playSound(isCorrect);

    // Siirry seuraavaan kysymykseen viiveellä
    setTimeout(() => {
      setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
      setAnswered(false); // Nollaa vastauksen tila seuraavaa kysymystä varten
    }, 3000);

    // Päivitä pisteet ja vastattujen kysymysten määrä
    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prev) => prev + 1);
  };

  const handleBack = () => {
    Speech.stop(); // Lopeta mahdollinen puhe
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    handleUpdatePlayerStatsToDatabase();
  };

  // Puheen hallinta ja valmistuminen
  useEffect(() => {
    if (gameEnded) return; // Ei uusia kysymyksiä, jos peli on ohi

    const currentQuestion = questions[questionIndex];
    setAnswered(false);
    setIsSpeechFinished(false); // Resetoi puhevalmiuden tila

    if (taskReading) {
      Speech.stop(); // Lopeta mahdollinen edellinen puhe
      Speech.speak(currentQuestion.question, {
      onDone: () => setIsSpeechFinished(true),
       // Merkitään puhe valmiiksi
      });
    } else {
      setIsSpeechFinished(true); // Jos puhe ei ole käytössä, aseta heti valmiiksi
    }


  }, [questionIndex, questions, gameEnded, taskReading]);

  const careerIcon  = {
    Lääkäri: "stethoscope",
    Automekaanikko: "oil",
    Rakentaja: "hammer",
    Kauppias: "cart-variant",
    Ohjelmoija: "laptop",
    Opettaja: "lead-pencil",
  }
    
 

  // Renderöi nykyisen kysymyksen ikonit
  const renderIcons = () => {
    const career = profile?.career
    const iconName = careerIcon[career] || "apple-alt"


      return (
        <View style={styles.iconBackground}>
      {Array.from({ length: questions[questionIndex].iconCount }).map((_, index) => (
        <MaterialCommunityIcons
          key={index}
          name={iconName}
          size={40}
          color="#4CAF50"
          style={styles.icon}
        />
      ))}
    </View>
      )
    }
    
  

  // Renderöi vastausvaihtoehdot nykyiseen kysymykseen
  const renderOptions = () => (
    <View style={styles.gameOptionsContainer}>
      {questions[questionIndex].options.map((option, index) => (
        <View key={index} style={styles.optionWrapper}>
          <TouchableOpacity
            onPress={() => handleAnswer(option)}
            style={[styles.startButton, answered && styles.disabledButton]} // Estä painallus, jos on jo vastattu
            disabled={answered} // Estä painallus, jos on jo vastattu
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const handleContinueGame = () => {
    handleBack();
    navigation.navigate('Animation', { profile });
  };

  const handleEndGame = () => {
    handleBack();
    navigation.navigate('SelectProfile', { profile });
  };

  return (
    <ImageBackground 
    source={getBGImage(isDarkTheme, bgIndex)} 
    style={styles.background} 
    resizeMode="cover"
    >
    <View style={styles.container}>
      <View style={styles.tehtcont}>
      <Text style={styles.title}>{syllabify("Kuva numeroiksi")}</Text>
      <Text style={styles.question}>{questions[questionIndex]?.question}</Text>
      <View style={styles.iconContainer}>{renderIcons()}</View>
      {renderOptions()}
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
    </View>
    </ImageBackground>
  );
}
