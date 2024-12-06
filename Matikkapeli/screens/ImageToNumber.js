import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { ScoreContext } from '../components/ScoreContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import LevelBar from '../components/LevelBar'
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
  const [gameActive, setGameActive] = useState(true);

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

    for (let i = 0; i < 5; i++) {
      const minLevel = Math.max(0, playerLevel - 2)
      const iconCount = Math.min(random(minLevel, playerLevel || 1), 10); // Satunnainen määrä vasaroita
      const options = Array.from({ length: playerLevel - minLevel + 1 }, (_, i) => minLevel + i)
      console.log('iconCount')
      questions.push({
        question: `Montako esinettä näet näytöllä?`, // Kysymyksen teksti
        iconCount,
        options, // Vaihtoehdot
      });
      
    }
    return questions;
  };

  const [questions, setQuestions]  = useState(() => generateQuestions());

  // Alustetaan kysymykset ja nollataan kysymysindeksi
  useEffect(() => {
    if (showFeedback || gameActive) return; // Älä alusta, jos palautetta näytetään

    /*if (!showFeedback && !gameEnded) {
    console.log('wawawa')
    setQuestions(generateQuestions());
    setQuestionIndex(0); // Nollaa kysymysindeksi, kun peli alkaa
    }*/
  }, [showFeedback, gameEnded]);

  // Tarkistetaan, onko peli päättynyt (5 kysymystä vastattu)
  useEffect(() => {
    if (questionsAnswered === 5) {
      Speech.stop(); // Lopeta mahdollinen puhe
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
    }, 1000);

    // Päivitä pisteet ja vastattujen kysymysten määrä
    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prev) => prev + 1);
  };

  const handleBack = () => {
    setGameActive(false);
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    handleUpdatePlayerStatsToDatabase();
    Speech.stop();
  };

  // Puheen hallinta ja valmistuminen
  useEffect(() => {
    if (gameEnded) { 
      Speech.stop(); // Lopeta mahdollinen puhe, jos peli on ohi
      setIsSpeechFinished(false)
      return;} // Ei uusia kysymyksiä, jos peli on ohi

    const currentQuestion = questions[questionIndex];
    setAnswered(false);
    setIsSpeechFinished(false); // Resetoi puhevalmiuden tila

    if (taskReading && gameActive) {
      Speech.stop(); // Lopeta mahdollinen edellinen puhe
      Speech.speak(currentQuestion.question, {
        onDone: () => setIsSpeechFinished(true),
        // Merkitään puhe valmiiksi
      });
    } else {
      setIsSpeechFinished(true); // Jos puhe ei ole käytössä, aseta heti valmiiksi
    }


  }, [questionIndex, questions, gameEnded, taskReading]);

  const careerIcon = {
    LÄÄKÄRI: "stethoscope",
    AUTOMEKAANIKKO: "oil",
    RAKENTAJA: "hammer",
    KAUPPIAS: "cart-variant",
    OHJELMOIJA: "laptop",
    OPETTAJA: "lead-pencil",
  }



  // Renderöi nykyisen kysymyksen ikonit
  const renderIcons = () => {
    const career = profile.career
    const iconName = careerIcon[career] || "stocking"


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
                <View style={styles.profileSelect}>
                    <LevelBar progress={imageToNumberXp} label={"Kuvat numeroiksi"} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"imageToNumber"} />
                    <LevelBar progress={soundToNumberXp} label={"Äänestä numeroiksi"} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"imageToNumber"} />
                    <LevelBar progress={comparisonXp} label={"Vertailu"} playerLevel={playerLevel} gameType={"comparison"} caller={"imageToNumber"} />
                    <LevelBar progress={bondsXp} label={"Hajonta"} playerLevel={playerLevel} gameType={"bonds"} caller={"imageToNumber"} />
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable onPress={() => { 
                    handleContinueGame(); 
                    setGameEnded(false);
                    setShowFeedback(false) }}
                    style={[styles.startButton, { backgroundColor: 'lightblue' }]}
                  >
                    <Text style={styles.buttonText}>{syllabify("SEURAAVA TEHTÄVÄ ODOTTAA")}</Text>
                  </Pressable>
                  <Pressable onPress={() => { 
                    handleEndGame(); 
                    setGameEnded(false);
                    setShowFeedback(false) }}
                    style={[styles.startButton, { backgroundColor: 'darkred' }]}
                  >
                   <Text style={[styles.buttonText, {color: 'white'}]}>{syllabify("LOPETA PELI")}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </ImageBackground>
  );
}