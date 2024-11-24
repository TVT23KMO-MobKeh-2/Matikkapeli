import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import styles from '../styles';
import ModalComponent from '../components/ModalComponent';
import { ScoreContext } from '../components/ScoreContext';
import { useTheme } from '../components/ThemeContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

//Funktio, joka generoi satunnaisen luvun väliltä min ja max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ImageToNumber({ onBack }) {

  const route = useRoute();
  const { profile } = route.params;
  const navigation = useNavigation()

  const { points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp } = useContext(ScoreContext);
  const { isDarkTheme } = useTheme(); //Käytetään teemakontekstia (tumma tila)
  const { gameSounds, volume } = useSoundSettings(); //Käytetään ääniasetuksia
  const { taskReading } = useTaskReading(); //Käytetään tehtävänlukukontekstia
  const { syllabify, taskSyllabification } = useTaskSyllabification(); //Käytetään tavutuskontekstia

  const [sound, setSound] = useState();
  const [questionIndex, setQuestionIndex] = useState(0); //Nykyinen kysymyksen indeksi
  const [answered, setAnswered] = useState(false); //Onko kysymykseen vastattu
  const [modalVisible, setModalVisible] = useState(false); //Näytetäänkö modaalikomponentti
  const [gameEnded, setGameEnded] = useState(false); //Onko peli päättynyt
  const [isSpeechFinished, setIsSpeechFinished] = useState(false); //Seurataan puheen valmistumista
  const [showButtons, setShowButtons] = useState(false);


  //Generoi kysymyksiä pelille

  const generateQuestions = () => {
    const questions = [];
    for (let i = 0; i < 5; i++) {
      const iconCount = Math.min(random(0, profile?.playerLevel || 1), 10) //Satunnainen määrä vasaroita
      questions.push({

        question: `Montako vasaraa näet näytöllä?`, //Kysymyksen teksti

        iconCount,
        options: Array.from({ length: 11 }, (_, i) => i), //Vaihtoehdot
      });
    }
    return questions;
  };

  const [questions, setQuestions] = useState(generateQuestions());

  //Alustetaan kysymykset ja nollataan kysymysindeksi
  useEffect(() => {
    setQuestions(generateQuestions());
    setQuestionIndex(0); //Nollaa kysymysindeksi, kun peli alkaa
  }, []);


  // Funktio, joka toistaa oikea/väärä äänen
  async function playSound(isCorrect) {
    if (!gameSounds || gameEnded) return; //Ääntä ei toisteta, jos peli on päättynyt tai äänet ovat pois päältä

    const soundUri = isCorrect

      ? require('../assets/sounds/mixkit-achievement-bell.wav') //Oikein ääni
      : require('../assets/sounds/mixkit-losing-bleeps.wav'); //Väärin ääni

    const { sound } = await Audio.Sound.createAsync(soundUri);
    setSound(sound);
    await sound.playAsync();

    await sound.setVolumeAsync(volume); //Säädä äänenvoimakkuus

    //Ladataan ääni pois muistin säästämiseksi, kun se on toistettu
    sound.setOnPlaybackStatusUpdate((status) => {

      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  }

  //Tyhjennetään ääni, kun komponentti poistetaan
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  //Tarkistetaan, onko peli päättynyt (5 kysymystä vastattu)
  useEffect(() => {
    if (questionsAnswered === 5) {
      incrementXp(points, "imageToNumber");//Päivitetään XP
      setShowButtons(true)
      setGameEnded(true);
      setModalVisible(true); //Näytetään modal pelin lopussa
    }
  }, [questionsAnswered]);

  //Käyttäjän vastauksen käsittely
  const handleAnswer = async (selectedAnswer) => {
    if (answered || gameEnded || !isSpeechFinished) return; //Estä useat vastaukset tai ei-valmiit vastaukset

    setAnswered(true); //Lukitse vastaukset, kun ensimmäinen valinta tehty
    const currentQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === currentQuestion.iconCount;

    //Palaute puheena
    const responseMessage = isCorrect ? "Oikein!" : "Yritetään uudelleen!";
    if (taskReading) {
      Speech.speak(responseMessage);
    }

    //Toista oikein/väärin ääni
    await playSound(isCorrect);

    //Siirry seuraavaan kysymykseen viiveellä
    setTimeout(() => {
      setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
      setAnswered(false); //Nollaa vastauksen tila seuraavaa kysymystä varten
    }, 3000);

    //Päivitä pisteet ja vastattujen kysymysten määrä
    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prev) => prev + 1);
  };


  const handleBack = () => {
    Speech.stop(); //Lopeta mahdollinen puhe
    setModalVisible(false);
    setQuestionsAnswered(0);
    setPoints(0);
    setGameEnded(false);
    setShowButtons(false)
  };

  //Puheen hallinta ja valmistuminen
  useEffect(() => {
    if (gameEnded) return; //Ei uusia kysymyksiä, jos peli on ohi

    const currentQuestion = questions[questionIndex];
    setAnswered(false);
    setIsSpeechFinished(false); //Resetoi puhevalmiuden tila

    if (taskReading) {
      Speech.stop(); //Lopeta mahdollinen edellinen puhe
      Speech.speak(currentQuestion.question, {
        onDone: () => setIsSpeechFinished(true), //Merkitään puhe valmiiksi
      });
    } else {
      setIsSpeechFinished(true); //Jos puhe ei ole käytössä, aseta heti valmiiksi
    }
  }, [questionIndex, questions, gameEnded, taskReading]);

  //Renderöi nykyisen kysymyksen ikonit
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

  //Renderöi vastausvaihtoehdot nykyiseen kysymykseen
  const renderOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {questions[questionIndex].options.map((option, index) => (
          <View key={index} style={styles.optionWrapper}>
            <TouchableOpacity
              onPress={() => handleAnswer(option)}
              style={[styles.optionButton, answered && styles.disabledButton]} //Estä painallus, jos on jo vastattu
              disabled={answered} //Estä painallus, jos on jo vastattu
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  //Renderöi kysymyksen teksti tavutuksella, jos se on käytössä
  const renderQuestionText = () => {
    const currentQuestion = questions[questionIndex];
    const text = currentQuestion?.question;
    return taskSyllabification ? syllabify(text) : text;
  };

  const handleContinueGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('Animation', { profile });
  };

  const handleEndGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('SelectProfile', { profile });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Tehtävä {questionIndex + 1}</Text>
      <Text style={[styles.question, { color: isDarkTheme ? '#fff' : '#000' }]}>{renderQuestionText()}</Text>
      <View style={styles.iconContainer}>
        {renderIcons()}
      </View>
      {renderOptions()}
      <ModalComponent
        isVisible={modalVisible}
        
      />
      {showButtons && (
        <View style={styles.buttonContainer}>
          <Button title="Seuraava tehtävä odottaa" onPress={handleContinueGame} />
          <Button title="Lopeta peli" onPress={handleEndGame} />
        </View>
      )}
    </View>
  );
}

