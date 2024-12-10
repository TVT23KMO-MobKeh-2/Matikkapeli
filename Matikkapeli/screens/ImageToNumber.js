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
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackHandler } from 'react-native';

// Funktio, joka generoi satunnaisen luvun väliltä min ja max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ImageToNumber({ onBack }) {
  const route = useRoute();
  const navigation = useNavigation();
  const [points, setPoints] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, totalXp, career, email } = useContext(ScoreContext);
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

  console.log("Renderöidään imageToNumber")
  // Generoi kysymyksiä pelille
  const generateQuestions = () => {
    const questions = [];
    const minLevel = Math.max(0, playerLevel - 2);
    // alustetaan iconCounts lista ja lisätään siihen kaksi kertaa playerLeveliä vastaava luku
    let iconCounts = [playerLevel, playerLevel]
    if (playerLevel === 1) {
      iconCounts = Math.random() < 0.5 ? [1, 0, 1, 0, 1] : [0, 1, 0, 1, 0];
    } else if (playerLevel === 2) {
      const secondIcons = {
        0: [2, 0, 2, 0, 2],
        1: [2, 0, 2, 1, 2],
        2: [2, 1, 2, 0, 2],
        3: [2, 1, 2, 1, 2]
      };
      iconCounts = secondIcons[random(0, 3)]

    } else {
      let lastIconCount = playerLevel
      // arvotaan kolme satunnaislukua minLevelin ja playerLevelin väliltä
      for (let i = 0; i < 3; i++) {
        let iconCount = Math.min(random(minLevel, playerLevel), 10);
        //estetään että peräkkäin ei ole samoja lukuja
        while (iconCount === lastIconCount) {
          iconCount = Math.min(random(minLevel, playerLevel), 10);
        }
        lastIconCount = iconCount;
        iconCounts.push(iconCount);
      }

      //sekoitetaan lista niin, että playerlevelit on satunnaisilla paikoilla
      for (let j = 0; j < iconCounts.length; j++) {
        //valitaan listalta satunnaisIndeksi
        const randomIndex = Math.floor(Math.random() * iconCounts.length);
        //vaihdetaan indeksin ja randomindexin elementtien paikkoja
        [iconCounts[j], iconCounts[randomIndex]] = [iconCounts[randomIndex], iconCounts[j]]
      }
    }

    // lisätään luvut kysymyksien kanssa listalle
    for (let i = 0; i < 5; i++) {
      const options = Array.from({ length: playerLevel - minLevel + 1 }, (_, i) => minLevel + i)
      console.log('iconCount', iconCounts[i])
      questions.push({
        question: syllabify("Montako esinettä näet näytöllä?"), // Kysymyksen teksti
        iconCount: iconCounts[i],
        options, // Vaihtoehdot
      });
    }
    return questions;
  }



  const [questions, setQuestions] = useState(() => generateQuestions());

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
      return;
    } // Ei uusia kysymyksiä, jos peli on ohi

    const currentQuestion = questions[questionIndex];
    setAnswered(false);
    setIsSpeechFinished(false); // Resetoi puhevalmiuden tila

    if (taskReading && gameActive) {
      Speech.stop(); // Lopeta mahdollinen edellinen puhe
      Speech.speak("Montako esinettä näet näytöllä?", {
        onDone: () => setIsSpeechFinished(true),
        // Merkitään puhe valmiiksi
      });
    } else {
      setIsSpeechFinished(true); // Jos puhe ei ole käytössä, aseta heti valmiiksi
    }


  }, [questionIndex, questions, gameEnded, taskReading]);

  const careerIcon = {
    LÄÄKÄRI: "stethoscope",
    MEKAANIKKO: "oil",
    RAKENTAJA: "hammer",
    KAUPPIAS: "cart-variant",
    OHJELMOIJA: "laptop",
    OPETTAJA: "lead-pencil",
  }



  // Renderöi nykyisen kysymyksen ikonit
  const renderIcons = () => {
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
            style={[styles.startButton, styles.orangeButton, answered && styles.disabledButton]} // Estä painallus, jos on jo vastattu
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
    navigation.navigate('Animation');
  };

  const handleEndGame = () => {
    handleBack();
    navigation.navigate('SelectProfile', { email });
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
                <Text style={styles.title}>{syllabify("Pistetaulu")}</Text>
                <Text>{syllabify("Taso")}: {playerLevel}/10</Text>
                <Text>{syllabify("Kokonaispisteet")}: {totalXp}/190</Text>
                <View style={styles.profileSelect}>
                  <LevelBar progress={imageToNumberXp} label={syllabify("Kuvat numeroiksi")} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"imageToNumber"} />
                  <LevelBar progress={soundToNumberXp} label={syllabify("Äänestä numeroiksi")} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"imageToNumber"} />
                  <LevelBar progress={comparisonXp} label={syllabify("Vertailu")} playerLevel={playerLevel} gameType={"comparison"} caller={"imageToNumber"} />
                  <LevelBar progress={bondsXp} label={syllabify("Hajonta")} playerLevel={playerLevel} gameType={"bonds"} caller={"imageToNumber"} />
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable onPress={() => {
                    handleContinueGame();
                    setShowFeedback(false)
                  }}
                    style={[styles.startButton, styles.blueButton]}
                  >
                    <Text style={styles.buttonText}>
                      {syllabify("Jatketaan")}
                    </Text>
                    <View style={styles.nextGame}>
                      <Ionicons name="game-controller" size={24} color={isDarkTheme ? "white" : "black"} />
                      <MaterialIcons name="navigate-next" size={24} color={isDarkTheme ? "white" : "black"} />

                    </View>
                  </Pressable>
                  <Pressable onPress={() => {
                    handleEndGame();
                    setShowFeedback(false)
                  }}
                    style={[styles.startButton, styles.redButton]}
                  >
                    <Text style={[styles.buttonText, { color: 'white' }]}>
                      {syllabify("Lopeta")}
                    </Text>
                    <Ionicons name="exit" size={24} color="white" />
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