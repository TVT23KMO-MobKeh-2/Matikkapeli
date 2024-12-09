
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, TouchableWithoutFeedback, ScrollView, Pressable, Keyboard } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Svg, { Line } from 'react-native-svg';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { ScoreContext } from '../components/ScoreContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import LevelBar from '../components/LevelBar'
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// Satunnaisen arvon generointi annetulla alueella
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Bonds({ onBack }) {

  const navigation = useNavigation()

  // Pelin aloitustaso ja muut tilamuuttujat

  const [leftBox, setLeftBox] = useState(0);  // Vasemman laatikon arvo
  const [rightBox, setRightBox] = useState(0);  // Oikean laatikon arvo
  const [witchBox, setWitchBox] = useState(random(0, 1));  // Tieto siitä, kummassa laatikossa on puuttuva luku
  const [inputValue1, setInputValue1] = useState('');  // Käyttäjän syöte vasempaan laatikkoon
  const [inputValue2, setInputValue2] = useState('');  // Käyttäjän syöte oikeaan laatikkoon
  const [sound, setSound] = useState();  // Äänet, joita toistetaan vastauksen perusteella
  const [doneTasks, setDoneTasks] = useState(0);  // Tavoitteena on vastata oikein 5 kysymykseen
  const { incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, totalXp, email } = useContext(ScoreContext);  // Pelin pistetilanne ja XP:n käsittely
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [points, setPoints] = useState(0)
  const [instructionVisibility, setInstructionVisibility] = useState(true);  // Näytetäänkö ohjeet pelin alussa
  const [showFeedback, setShowFeedback] = useState(false)
  const { isDarkTheme } = useTheme();  // Teeman väri (tumma vai vaalea)
  const { gameSounds, playSound } = useSoundSettings();  // Pelin ääniasetukset
  const { taskReading } = useTaskReading();  // Käytetäänkö tehtävän lukemista ääneen
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();  // Käytetäänkö tavutusta
  const [isTaskChanging, setIsTaskChanging] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [instructionReading, setInstructionReading] = useState(true)
  const levelData = playerLevel;
  const [lastLeftBox, setLastLeftBox] = useState(null);
  const [lastRightBox, setLastRightBox] = useState(null);
  const opacity = useSharedValue(0);

  console.log("Renderöidään bonds")

  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);
  const bgIndex = 4;



  // Funktio, joka generoi uuden pelitason (arvot vasemmalle ja oikealle laatikolle)
  const generateNewLevel = () => {
    setIsTaskChanging(true);

    let newLeftBox, newRightBox, newWitchBox;

    // Ensure the new values are different from the last ones
    do {
      newLeftBox = random(0, levelData);  // Randomly generate new value for left box
      newRightBox = levelData - newLeftBox;  // Calculate right box based on left box  // Randomly determine which box has the missing value
    } while (newLeftBox === lastLeftBox && newRightBox === lastRightBox);

    // Update the state with the new values
    setLeftBox(newLeftBox);
    setRightBox(newRightBox);
    setInputValue1('');  // Reset user input for left box
    setInputValue2('');  // Reset user input for right box

    // Store the current values for future comparison
    setLastLeftBox(newLeftBox);
    setLastRightBox(newRightBox);

    // Reset task-changing state after a short delay
    setTimeout(() => {
      setIsTaskChanging(false);
    }, 1000);
  };

  // Efekti, joka käynnistää tason generoinnin heti, kun pelin taso muuttuu
  useEffect(() => {
    generateNewLevel();
  }, [levelData]);

  // Tehtävän tarkistus (tarkistaa onko käyttäjän vastaus oikein)
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

  // Funktio, joka tarkistaa käyttäjän vastauksen
  const checkAnswer = async () => {
    if (isButtonClicked) return

    setIsButtonClicked(true)
    const correctAnswer = witchBox === 0 ? leftBox : rightBox;  // Oikea vastaus riippuu siitä, kummassa laatikossa on puuttuva luku
    const userAnswer = witchBox === 0 ? parseInt(inputValue1) : parseInt(inputValue2);  // Käyttäjän syöte (luku)

    if (userAnswer === correctAnswer) {  // Jos vastaus on oikein
      await playSound(true);  // Soitetaan oikea ääni
      setPoints((prevPoints) => prevPoints + 1);  // Lisätään pisteet
    } else {  // Jos vastaus on väärin
      await playSound(false);  // Soitetaan väärä ääni
    }

    setQuestionsAnswered((prev) => prev + 1);  // Lisätään vastattujen kysymysten määrä

    if (questionsAnswered + 1 < 5) {  // Jos kysymyksiä on vähemmän kuin 5, luodaan uusi taso
      setTimeout(() => {
        generateNewLevel();
        setIsButtonClicked(false)
      }, 1000);
    } else {
      setIsButtonClicked(false)
    }
  };

  // Takaisin-napin toiminnallisuus
  const handleBack = () => {
    Speech.stop();  // Pysäytetään mahdollinen puhe
    setShowFeedback(false);  // Piilotetaan feedback-ikkuna
    setQuestionsAnswered(0);  // Nollataan kysymykset
    setPoints(0);  // Nollataan pisteet
    handleUpdatePlayerStatsToDatabase()
  };

  const isButtonDisabled =
    (witchBox === 0 && inputValue1 === '') ||
    (witchBox === 1 && inputValue2 === '') ||
    isTaskChanging

  const handleContinueGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('Animation');
  };


  const handleEndGame = () => {
    handleBack(); // Actually call handleBack
    navigation.navigate('SelectProfile', { email });
  };


  useEffect(() => {
    // Ensure previous speech is stopped before starting new speech
    Speech.stop();

    if (taskReading && instructionReading) {
      // Speak the full task instruction when both taskReading and instructionReading are true
      Speech.speak("Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku.");
      // Prevent repeated instructions
    } else if (!instructionReading) {
      // If instructionReading is false, speak the shorter instruction
      Speech.speak("Täydennä puuttuva luku.");
    }
  }, [taskReading, instructionReading]); // Runs when either taskReading or instructionReading changes

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
  }, []);

  // Animated style to be applied to elements
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });


  return (
    <ImageBackground
      source={getBGImage(isDarkTheme, bgIndex)}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.tehtcont}>
          {instructionVisibility && (
            <TouchableWithoutFeedback
              onPress={() => {
                setInstructionVisibility(false);
                handleInstructionSpeak();
              }}>
              <View style={styles.overlayInstruction}>
                <View style={styles.instructionWindow}>
                  <Text style={styles.title}>{syllabify("Hajonta")}</Text>
                  <Text>
                    {syllabify(
                      "Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku."
                    )}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <Pressable onPress={() => {
                      setInstructionReading(false);
                      setInstructionVisibility(false)
                    }}
                      style={[styles.startButton, styles.blueButton]}>
                        <Text style={styles.buttonText}>
                    {syllabify("Aloita")}
                        </Text>
                      <View style={styles.nextGame}>
                      
                    <Ionicons name="game-controller" size={24} color={isDarkTheme ? "white" : "black"}/>
                    </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          <View style={styles.taskbox}>

            <Text style={styles.title}>{syllabify("Täydennä puuttuva luku.")}</Text>

          </View>


          <Svg height="300" width="300" style={styles.lineContainer}>
            <Line x1="150" y1="90" x2="70" y2="230" stroke="black" strokeWidth="5" />
            <Line x1="150" y1="90" x2="230" y2="230" stroke="black" strokeWidth="5" />
          </Svg>

          <View style={styles.circle}>
            <Text style={[styles.numbertext, { color: 'white' }]}>{levelData}</Text>
          </View>
          <Animated.View style={[animatedStyles, styles.numbers]}>
            <View style={styles.number1}>
              {witchBox === 0 ? (
                <TextInput
                  style={styles.numbertext}
                  value={inputValue1}
                  onChangeText={setInputValue1}
                  keyboardType="numeric"
                  autoFocus={true}
                  maxLength={2}
                />
              ) : (
                <Text style={styles.numbertext}>{leftBox}</Text>
              )}
            </View>
            <View style={styles.number2}>
              {witchBox === 1 ? (
                <TextInput
                  style={styles.numbertext}
                  value={inputValue2}
                  onChangeText={setInputValue2}
                  keyboardType="numeric"
                  autoFocus={true}
                  maxLength={2}
                />
              ) : (
                <Text style={styles.numbertext}>{rightBox}</Text>
              )}
            </View>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={checkAnswer}
              style={[styles.checkButton, isButtonDisabled ? styles.disabledButton : null]}
              disabled={isButtonDisabled}>
                <Text style={styles.buttonText}>
                    {syllabify("Tarkista")}
                        </Text>
              <Entypo name="check" size={24} color={isDarkTheme ? "white" : "black"} />
            </Pressable>
          </View>

          {showFeedback && (
            <TouchableWithoutFeedback>
              <View style={styles.overlayInstruction}>
                <View style={styles.instructionWindow}>
                  <Text >{getFeedbackMessage(points)}</Text>
                  <Text style={styles.title}>{syllabify("Pistetaulu")}</Text>
                  <Text>{syllabify("Taso")}: {playerLevel}/10</Text>
                  <Text>{syllabify("Kokonaispisteet")}: {totalXp}/190</Text>
                  <View style={styles.profileSelect}>
                    <LevelBar progress={imageToNumberXp} label={syllabify("Kuvat numeroiksi")} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"bonds"} />
                    <LevelBar progress={soundToNumberXp} label={syllabify("Äänestä numeroiksi")} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"bonds"} />
                    <LevelBar progress={comparisonXp} label={syllabify("Vertailu")} playerLevel={playerLevel} gameType={"comparison"} caller={"bonds"} />
                    <LevelBar progress={bondsXp} label={syllabify("Hajonta")} playerLevel={playerLevel} gameType={"bonds"} caller={"bonds"} />
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
      </View>
    </ImageBackground >
  );

}
