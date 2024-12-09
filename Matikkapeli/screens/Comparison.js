
import { View, Text, Pressable, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import { ScoreContext } from '../components/ScoreContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import LevelBar from '../components/LevelBar'
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Comparison({ onBack }) {

  console.log("Renderöidään comparison")
  const route = useRoute();
  const { profile } = route.params;
  const navigation = useNavigation()
  const [showFeedback, setShowFeedback] = useState(false)

  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);

  const { gameSounds, playSound } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();
  const [points, setPoints] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const { playerLevel, incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, totalXp, email } = useContext(ScoreContext)
  const [isLevelNumberFirstComparable, setIsLevelNumberFirstComparable] = useState(true) // Määrittää, esitetäänkö tason mukainen numero vertailussa ensimmäisenä (true) vai toisena (false)
  const [isComparableEquation, setIsComparableEquation] = useState(false) // Määrittää, onko vertailtavana yhtälö vai satunnaisluku (true = yhtälö, false = satunnaisluku)
  const [randomNumber, setRandomNumber] = useState(0) // Vertailtavaksi arvottu satunnaisluku, käytetään yksittäisissä lukuvertailutehtävissä
  const [lookingForBigger, setLookingForBigger] = useState(false) // Määrittää, etsitäänkö isompaa (true) vai pienempää arvoa (false)
  const [equationOperand1, setEquationOperand1] = useState(0) // Yhtälön ensimmäinen operandin arvo, käytetään laskutoimituksissa
  const [equationOperand2, setEquationOperand2] = useState(0) // Yhtälön toinen operandin arvo, käytetään laskutoimituksissa
  const [isEquationAddition, setIsEquationAddition] = useState(false) // Määrittää, onko laskutoimitus yhteenlasku (true) vai ei (false)

  const bgIndex = 3;

  //Koukku jolla tarkistetaan joko kierros päättyy.
  useEffect(() => {
    if (questionsAnswered === 5) {
      const delay = 700; // Viive 0,5 sekuntia
      const timer = setTimeout(() => {
        setQuestionsAnswered(0);
        Speech.stop(); // Lopeta mahdollinen puhe
        incrementXp(points, "imageToNumber"); // Päivitetään XP
        setGameEnded(true);
        setShowFeedback(true);
      }, delay);
  
      // Puhdistusfunktio ajastimen peruuttamiseksi
      return () => clearTimeout(timer);
    }
  }, [questionsAnswered]);

  //Backin handleri
  const handleBack = () => {

    Speech.stop()
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    // Tallennetaan tiedot tietokantaan
    handleUpdatePlayerStatsToDatabase();
  };

  // Tämä koukku suoritetaan kerran, kun komponentti on renderöity
  useEffect(() => {
    drawNewNumbers(); // Arvotaan ensimmäiset luvut ja asetetaan tehtävä
  }, []);

  // Arpoo satunnaisluvun annetulta väliltä (mukaan lukien minimi ja maksimi) ja palauttaa sen
  const drawRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Funktio uusien lukujen arpomista varten
  const drawNewNumbers = () => {
    // Keskeytetään mahdollinen edellinen puhe
    Speech.stop();
    // Arvotaan uusi satunnaisluku, jonka maksimiarvo riippuu comparisonXp:n arvosta
    console.log("Arvotaan uudet numerot")
    setRandomNumber(drawRandomNumber(0, playerLevel));

    // Arvotaan, onko tason mukainen numero 1. vai 2. vertailtava
    setIsLevelNumberFirstComparable(drawRandomNumber(0, 1) === 1);

    // Jos comparisonXp ylittää 10, arvotaan yhtälön tarve ja muodostetaan yhtälö tarvittaessa
    if (comparisonXp > 10) {
      if (drawRandomNumber(0, 1) === 1) {
        console.log("vertailtavana yhtälö")
        setIsComparableEquation(true);
        generateEquation(setIsEquationAddition, setEquationOperand1, setEquationOperand2);
      } else {
        console.log("Vertailtavana satunnaisluku")
        setIsComparableEquation(false);
      }
    }

    // Arvotaan, etsitäänkö isompaa vai pienempää lukua
    if (drawRandomNumber(0, 1) === 1) {
      setLookingForBigger(true); // Haetaan isompaa
      if (taskReading) {
        Speech.speak("Valitse yhtäsuuri tai suurempi."); //toistetaan tehtävänanto puheena
      }
    } else {
      setLookingForBigger(false); // Haetaan pienempää
      if (taskReading) {
        Speech.speak("Valitse yhtäsuuri tai pienempi."); //toistetaan tehtävänanto puheena
      }
    }
  }

  // Funktio yhtälön arvon laskemista varten
  const calculateEquation = (operand1, operand2, isAddition) => {
    if (isAddition) {//Jos yhteenslasku, palautetaan summa
      return operand1 + operand2
    } else { //Muutoin palautetaan erotus
      return operand1 - operand2
    }
  }

  //Funktio yhtälön muodostamiseen
  const generateEquation = (setIsAddition, setOperand1, setOperand2) => {
    // Arvotaan kaksi lukua väliltä 0 - (comparisonXp * 0.1 + 1)
    const first = drawRandomNumber(0, playerLevel)
    const second = drawRandomNumber(0, playerLevel)
    console.log("Arvottiin numerot", first, second)
    // Alustetaan arvot
    setIsAddition(null);
    setOperand1(0);
    setOperand2(0);

    if (drawRandomNumber(0, 1) === 1) {
      // Jos arvottu luku on 1, asetetaan yhteenlasku, arvotut luvut ja true
      setIsAddition(true)
      setOperand1(first)
      setOperand2(second)
    } else {
      // Muussa tapauksessa asetetaan vähennyslasku (false)
      // ja varmistetaan, että Operand1 on suurempi, jolloin lopputulos ei ole negatiivinen
      setIsAddition(false)
      if (first >= second) {
        setOperand1(first)
        setOperand2(second)
      } else {
        setOperand1(second)
        setOperand2(first)
      }
    }
  }

  //Funktio vastauksen tarkistukseen 
  const checkAnswer = (answer) => {
    let valueOfComparable = 0 //Muuttuja vertailtavan arvon tallentamiseen
    let valueOfAnswer = 0 //Muuttuja annetun vastauksen arvon tallentamiseen
    let correctAnswer = false //Muuttuja vastauksen oikeellisuuden tarkistamiseen ja lopputoimien määrittämiseen

    //Asetetaan vastauksen ja vertailtavan arvot annettua vastausta vastaavasti
    switch (answer) {
      case "leveli": //Jos vastaus on "leveli", vastauksen arvoksi asetetaan playerLevel, vertailtava arvo on joko yhtälön arvo tai satunnaisluku
        valueOfAnswer = playerLevel
        valueOfComparable = isComparableEquation ? calculateEquation(equationOperand1, equationOperand2, isEquationAddition) : randomNumber
        break;
      case "equationi"://Jos vastaus on "equationi", vastauksen arvoksi asetetaan yhtälön arvo ja vertailtavaksi arvoksi playerLevel
        valueOfAnswer = calculateEquation(equationOperand1, equationOperand2, isEquationAddition)
        valueOfComparable = playerLevel
        break;
      case "equali": //Jos vastaus on "equali", vastauksen arvoksi asetetaan playerLevel ja vertailtavaksi arvoksi yhtälön arvo tai satunnaisluku
        console.log("Yhtäsuuret")
        if (isComparableEquation) {
          valueOfComparable = calculateEquation(equationOperand1, equationOperand2, isEquationAddition)
          valueOfAnswer = playerLevel
        } else {
          valueOfComparable = randomNumber
          valueOfAnswer = playerLevel
        } //Tarkistetaan, ovatko arvot yhtäsuuret
        console.log("Vertailtava1:", valueOfComparable)
        console.log("Vertailtava2:", valueOfAnswer)
        if (valueOfAnswer === valueOfComparable) {
          correctAnswer = true
          console.log("Oikein")
        }
        break;
      case "randomnumberi":  //Jos vastaus on "randomnumberi", vastauksen arvoksi asetetaan satunnaisluku ja vertailtavaksi arvoksi playerLevel
        valueOfAnswer = randomNumber
        valueOfComparable = playerLevel
        break;
      default:
        break;
    }

    //Tarkistetaan, onko vertailu oikein
    if ((lookingForBigger) && (answer != "equali")) {
      //Jos haetaan suurempaa, tarkistetaan, onko vastaus suurempi kuin vertailtava arvo
      if (valueOfAnswer > valueOfComparable) {
        correctAnswer = true
      }
    } else if ((!lookingForBigger) && (answer != "equali")) {
      //Muussa tapauksessa tarkistetaan, onko vastaus pienempi kuin vertailtava arvo
      if (valueOfAnswer < valueOfComparable) {
        correctAnswer = true
      }
    }
    console.log("correctAnswer: ", correctAnswer)
    // Lopputoimet tarkistuksen jälkeen
    if (correctAnswer) { //oikein
      setPoints(prevPoints => prevPoints + 1)
      //playSound(correct) //Toistetaan oikein-merkkiääni
      playSound(true); // Toistaa oikein-äänen
    } else {
      //playSound(incorrect) //Toistetaan väärin-merkkiääni
      playSound(false); // Toistaa väärin-äänen
    }
    // Lisätään vastattu kysymys
    setQuestionsAnswered(prevQuestionsAnswered => prevQuestionsAnswered + 1)
    // Arvotaan uudet numerot seuraavaa tehtävää varten
    if (questionsAnswered < 5) {
      drawNewNumbers()
    }
  }

  //Funktio ohjeen renderöintiä varten
  const renderGuide = () => {
    //Tallennetaan muuttujaan teksti sen perusteella, etsitäänkö suurempaa ja tavutetaanko teksti
    const guideText = lookingForBigger
      ? "Valitse yhtäsuuri (=) tai suurempi luku"
      : "Valitse yhtäsuuri (=) tai pienempi luku";

    // Käytetään syllabify-funktiota kontekstista tavutukseen
    const displayText = taskSyllabification ? syllabify(guideText) : guideText;
    const style = lookingForBigger ? styles.comparisonGuideBigger : styles.comparisonGuideSmaller;

    return <Text style={style}>{displayText}</Text>;
  };

  //Funktio vertailtavan renderöintiä
  const renderComparable = (comparableNumber) => {
    //Tarkistetaan, onko kyseessä tasonmukainen numero
    //Jos vertailtava numero on 1 ja isLevelNumberFirstComparable on true, tai vertailtava numero on 2 ja isLevelNumberFirstComparable on false,
    //palautetaan tason mukainen numero (playerLevel) tekstinä
    if ((comparableNumber === 1 && isLevelNumberFirstComparable) || (comparableNumber === 2 && !isLevelNumberFirstComparable)) {
      return (
        <Text onPress={() => checkAnswer("leveli")} style={styles.comparisonOptions}>
          {playerLevel}
        </Text>
      );
    }

    if (isComparableEquation) {  // Jos vertailtava on yhtälö, palautetaan yhtälön osat ja plus- tai miinusmerkki
      return (
        <Text onPress={() => checkAnswer("equationi")} style={styles.comparisonOptions}>
          {equationOperand1} <Text>{isEquationAddition ? '+' : '-'}</Text> {equationOperand2}
        </Text>
      );
    } else { // Jos vertailtava ei ole yhtälöä, palautetaan satunnaisluku
      return (
        <Text onPress={() => checkAnswer("randomnumberi")} style={styles.comparisonOptions}>
          {randomNumber}
        </Text>
      );
    }
  }

  const handleContinueGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('Animation');
  };

  const handleEndGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('SelectProfile', { email });
  };

  return (
    <ImageBackground
      source={getBGImage(isDarkTheme, bgIndex)}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>{syllabify("Vertailu")}</Text>
        <Text>comparisonXp: {comparisonXp}</Text>
        {renderGuide()}
        {renderComparable(1)}
        <Text onPress={() => checkAnswer("equali")} style={styles.comparisonOptions} >=</Text>
        {renderComparable(2)}
        {showFeedback && (
          <TouchableWithoutFeedback>
            <View style={styles.overlayInstruction}>
              <View style={styles.instructionWindow}>
                <Text >{getFeedbackMessage(points)}</Text>
                <Text style={styles.title}>{syllabify("Pistetaulu")}</Text>
                <Text>{syllabify("Taso")}: {playerLevel}/10</Text>
                <Text>{syllabify("Kokonaispisteet")}: {totalXp}/190</Text>
                <View style={styles.profileSelect}>
                  <LevelBar progress={imageToNumberXp} label={syllabify("Kuvat numeroiksi")} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"comparison"} />
                  <LevelBar progress={soundToNumberXp} label={syllabify("Äänestä numeroiksi")} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"comparison"} />
                  <LevelBar progress={comparisonXp} label={syllabify("Vertailu")} playerLevel={playerLevel} gameType={"comparison"} caller={"comparison"} />
                  <LevelBar progress={bondsXp} label={syllabify("Hajonta")} playerLevel={playerLevel} gameType={"bonds"} caller={"comparison"} />
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
                    <Text style={[styles.buttonText, {color: 'white'}]}>
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
