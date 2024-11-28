import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button, TouchableWithoutFeedback } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import styles from '../styles';
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
  const [points, setPoints] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const { incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, totalXp } = useContext(ScoreContext);
  const { isDarkTheme } = useTheme(); //Käytetään teemakontekstia (tumma tila)
  const { gameSounds, volume, playsound } = useSoundSettings(); //Käytetään ääniasetuksia
  const { taskReading } = useTaskReading(); //Käytetään tehtävänlukukontekstia
  const { syllabify, taskSyllabification } = useTaskSyllabification(); //Käytetään tavutuskontekstia

  const [sound, setSound] = useState();

  const [questionIndex, setQuestionIndex] = useState(0); //Nykyinen kysymyksen indeksi
  const [answered, setAnswered] = useState(false); //Onko kysymykseen vastattu
  const [showFeedback, setShowFeedback] = useState(false)
  const [gameEnded, setGameEnded] = useState(false); //Onko peli päättynyt
  const [isSpeechFinished, setIsSpeechFinished] = useState(false); //Seurataan puheen valmistumista

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


  //feedback miten meni, odotelee tässä, että saadaan yhteiseen tiedostoon..
  const feedbackMsg = (() => {
    switch (points) {
      case 0:
        return (!taskSyllabification) ? "0/5 Hyvä, että yritit! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!"
          : "0/5 HY-VÄ ET-TÄ Y-RI-TIT! MA-TIK-KA ON VÄ-LIL-LÄ TO-SI HAAS-TA-VAA. HAR-JOI-TEL-LAAN YH-DES-SÄ LI-SÄÄ, NIIN EN-SI KER-RAL-LA VOI MEN-NÄ PA-REM-MIN";
      case 1:
        return (!taskSyllabification) ? "1/5 Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!"
          : "1/5 HY-VÄ, SAIT YH-DEN OI-KEIN! TÄ-MÄ ON HY-VÄ AL-KU JA JO-KA KER-TA O-PIT VÄ-HÄN LI-SÄÄ. KO-KEIL-LAAN YH-DES-SÄ UU-DEL-LEEN!";
      case 2:
        return (!taskSyllabification) ? "2/5 Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!"
          : "2/5 HIE-NOA, SAIT JO KAK-SI OI-KEIN! O-LET OP-PI-MAS-SA. JAT-KE-TAAN HAR-JOIT-TE-LU-A, NIIN EN-SI KER-RAL-LA O-SAAT VIE-LÄ E-NEM-MÄN!";
      case 3:
        return (!taskSyllabification) ? "3/5 Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!"
          : "3/5 MAH-TA-VAA, SAIT Y-LI PUO-LET OI-KEIN! O-LET JO TO-SI LÄ-HEL-LÄ. HAR-JOI-TEL-LAAN VIE-LÄ VÄ-HÄN, NIIN PÄÄ-SET VIE-LÄ-KIN PI-DEM-MÄL-LE";
      case 4:
        return (!taskSyllabification) ? "4/5 Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!"
          : "4/5 TO-SI HIE-NO-A! MEL-KEIN KAIK-KI ME-NI OI-KEIN. VIE-LÄ VÄ-HÄN HAR-JOIT-TE-LUA, NIIN VOIT SAA-DA KAIK-KI OI-KEIN EN-SI KER-RAL-LA";
      case 5:
        return (!taskSyllabification) ? "5/5 Wau, ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!"
          : "5/5 WAU, I-HAN HUIP-PUA! SAIT KAIK-KI OIK-EIN! JAT-KA SA-MAAN MAL-LIIN, O-LET TO-SI TAI-TA-VA!";
      default:
        return (!taskSyllabification) ? "Tässä tämän hetkiset pisteesi:"
          : "TÄ-MÄN HET-KI-SET PIS-TEE-SI";
    }
  })();

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
      setGameEnded(true);
      setShowFeedback(true);
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
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    handleUpdatePlayerStatsToDatabase()
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
      <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>{syllabify("Kuva numeroiksi")}</Text>
      <Text style={[styles.question, { color: isDarkTheme ? '#fff' : '#000' }]}>{renderQuestionText()}</Text>
      <View style={styles.iconContainer}>
        {renderIcons()}
      </View>
      {renderOptions()}
      {showFeedback && (
        <TouchableWithoutFeedback>
          <View style={styles.overlayInstruction}>
            <View style={styles.instructionWindow}>
              <Text >{feedbackMsg}</Text>
              <Text style={styles.title}>Pistetaulu</Text>
              <Text>Level: {playerLevel}/10</Text>
              <Text>Kokonaispisteet: {totalXp}/190</Text>
              <Text>ImageToNumbers: {imageToNumberXp}/50</Text>
              <Text>SoundToNumbers: {soundToNumberXp}/50</Text>
              <Text>Comparison: {comparisonXp}/50</Text>
              <Text>Bonds: {bondsXp}/40</Text>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Seuraava tehtävä odottaa"
                    onPress={() => {
                      handleContinueGame();
                      setGameEnded(false);
                      setShowFeedback(false)
                    }}
                  />
                  <Button title="Lopeta peli" onPress={() => {
                    handleEndGame();
                    setGameEnded(false);
                    setShowFeedback(false)
                  }} />
                </View>

              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

