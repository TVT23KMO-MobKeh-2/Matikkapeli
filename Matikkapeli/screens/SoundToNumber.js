import { View, Text, Pressable, TouchableOpacity, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import { ScoreContext } from '../components/ScoreContext';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import { useSoundSettings } from '../components/SoundSettingsContext';
import { useTaskReading } from '../components/TaskReadingContext';
import LevelBar from '../components/LevelBar'
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function SoundToNumber({ onBack }) {
  const route = useRoute();
  const navigation = useNavigation();

  const [showFeedback, setShowFeedback] = useState(false);
  const { playerLevel, incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, totalXp, email, readFeedback } = useContext(ScoreContext);
  const [points, setPoints] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { gameSounds, playSound } = useSoundSettings(); // Haetaan playSound suoraan kontekstista
  const { taskReading } = useTaskReading();
  const [numbers, setNumbers] = useState(() => {
    // alustetaan lista numeroille
    let initialNumbers = []
    let playerLevelLimit = false
    if (playerLevel === 1) {//tasolla 1 arvotaan kahdesta vaihtoehdosta
      initialNumbers = Math.random() < 0.5 ? [1, 0, 1, 0, 1] : [0, 1, 0, 1, 0];
    } else {// tasolla kolme ja siitä eteenpäin arvotaan kolme satunnaislukua kahden playerLeveliä vastaavan luvun lisäksi
      initialNumbers = [playerLevel, playerLevel]
      let lastNumber = playerLevel
      for (let i = 0; i < 3; i++) {
        let randomNumber = generateRandomNumber(playerLevel - 2, playerLevel);
        while (randomNumber === lastNumber || (playerLevelLimit && randomNumber === playerLevel)) {
          randomNumber = generateRandomNumber(playerLevel - 2, playerLevel);
        }
        lastNumber = randomNumber;
        if (randomNumber === playerLevel) {
          playerLevelLimit = true;
          initialNumbers.splice(1, 0, randomNumber)
        } else {
          initialNumbers.push(randomNumber)
        }
      }
      //jos listalla on playerLeveliä vastaava luku kolme kertaa, asetetaan ne paikoille 1, 3 ja 5
      if (playerLevelLimit) {
        [initialNumbers[1], initialNumbers[4]] = [initialNumbers[4], initialNumbers[1]]
        playerLevelLimit = false
      } else {
        //sekoitetaan lista niin, että playerlevelit on satunnaisilla paikoilla, mutta ei peräkkäin
        const mixValues = {
          0: () => { //xoxoo
            [initialNumbers[1], initialNumbers[2]] = [initialNumbers[2], initialNumbers[1]];
            if (initialNumbers[3] === initialNumbers[4]) { //jos 4. ja 5. numero on samoja, vaihdetaan 2. ja 5. paikkaa
              [initialNumbers[1], initialNumbers[4]] = [initialNumbers[4], initialNumbers[1]]
            }
          },
          1: () => {//xooxo
            [initialNumbers[1], initialNumbers[3]] = [initialNumbers[3], initialNumbers[1]];
            if (initialNumbers[1] === initialNumbers[2]) {//jos 2. ja 3. numero on samoja, vaihdetaan 3. ja 5. paikkaa
              [initialNumbers[2], initialNumbers[4]] = [initialNumbers[4], initialNumbers[2]]
            }
          },
          2: () => {//xooox
            [initialNumbers[1], initialNumbers[4]] = [initialNumbers[4], initialNumbers[1]];
            if (initialNumbers[1] === initialNumbers[2]) {//jos 2. ja 3. numero on samoja, vaihdetaan 3. ja 4. paikkaa
              [initialNumbers[2], initialNumbers[3]] = [initialNumbers[3], initialNumbers[2]]
            } else if (initialNumbers[2] === initialNumbers[3]){//jos 3. ja 4. numero on samoja, vaihdetaan 2. ja 3. paikkaa
              [initialNumbers[1], initialNumbers[2]] = [initialNumbers[2], initialNumbers[1]]
            }
          },
          3: () => {//oxoxo 
            [initialNumbers[0], initialNumbers[3]] = [initialNumbers[3], initialNumbers[0]]; 
          },
          4: () => {//oxoox
            [initialNumbers[0], initialNumbers[4]] = [initialNumbers[4], initialNumbers[0]];
            if (initialNumbers[2] === initialNumbers[3]) {//jos 3. ja 4. numero on samoja, vaihdetaan 1. ja 3. paikkaa
              [initialNumbers[0], initialNumbers[2]] = [initialNumbers[2], initialNumbers[0]]
            }
          },
          5: () => {//ooxox
            [initialNumbers[0], initialNumbers[2]] = [initialNumbers[2], initialNumbers[0]];
            [initialNumbers[1], initialNumbers[4]] = [initialNumbers[4], initialNumbers[1]];
            if (initialNumbers[0] === initialNumbers[1]) {//jos 1. ja 2. numero on samoja, vaihdetaan 1. ja 4. paikkaa
              [initialNumbers[0], initialNumbers[3]] = [initialNumbers[3], initialNumbers[0]]
            }
          }
        }
        const mix = mixValues[generateRandomNumber(0, 5)]
        mix()
      }
    }
    //palautetaan luvut
    console.log("initialNumbers", initialNumbers)
    return initialNumbers;
  })
  const [number, setNumber] = useState(numbers[0]);
  const [options, setOptions] = useState(generateOptions(number));
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState(false);

  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);
  const bgIndex = 2;

  console.log("Renderöidään soundToNumber")
  useEffect(() => {
    if (questionsAnswered === 5) {
      if (taskReading) {
        console.log("Taskreading oli tosi, joten if lauseessa")
        Speech.stop(); // Lopeta mahdollinen puhe
        readFeedback(points);
      }
      incrementXp(points, "soundToNumber");
      setShowFeedback(true);
      setGameEnded(true)
      setInstructions(false)
    } else {
      if (!gameEnded) {
        playNumber();  // Only play the number if the game hasn't ended
      }
    }
  }, [questionsAnswered]);

  const handleBack = () => {
    Speech.stop();
    setShowFeedback(false);
    setQuestionsAnswered(0);
    setPoints(0);
    handleUpdatePlayerStatsToDatabase();
  };

  const handleContinueGame = () => {
    handleBack();
    navigation.navigate('Animation');
  };

  const handleEndGame = () => {
    handleBack();
    navigation.navigate('SelectProfile', { email });
  };

  // Pelin logiikka
  useEffect(() => {
    if (number !== null) {
      setOptions(generateOptions(number));
    }
  }, [number, playerLevel]);


  const playNumber = () => {
    console.log('SoundToNumber playNumber');
    if (!gameEnded && !instructions) {
      console.log('SoundToNumber playNumber if');
      Speech.stop();
      Speech.speak("Valitse oikea numero");
      setInstructions(true);
      Speech.speak(number.toString());
    } else {
      console.log('SoundToNumber playNumber else');
    Speech.stop();
    Speech.speak(number.toString());
    }
  };

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Valitsee oikean numeron ja 3 muuta 0 - playerlevelin väliltä
  function generateOptions(correctNumber) {
    const max = typeof playerLevel === 'number' && playerLevel > 0 ? playerLevel : 10;
    //console.log('playerLevel:', playerLevel);
    const options = [correctNumber];
    const possibleNumbers = Array.from({ length: max + 1 }, (_, i) => i);
    const remainingNumbers = possibleNumbers.filter(num => num !== correctNumber);
    //console.log('SoundToNumber remainingNumbers:', remainingNumbers);
    const randomOptions = remainingNumbers.sort(() => Math.random() - 0.5).slice(0, 3);
    options.push(...randomOptions);
    //console.log('Generated options:', options);

    return options.sort((a, b) => a - b);
  }

  //console.log('SoundToNumber options:WÄÄWÄÄ', options);

  const handleSelect = async (selectedNumber) => {
    if (gameEnded) return;
    Speech.stop();
    setLoading(true);

    const isCorrect = selectedNumber === number;
    await playSound(isCorrect); // Käytetään kontekstin kautta haettua playSound-funktiota

    const newNumber = numbers[questionsAnswered + 1];
    setNumber(newNumber);

    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prevQuestionsAnswered) => prevQuestionsAnswered + 1);

    const response = isCorrect ? "Oikein!" : "Yritetään uudelleen!";
    if (taskReading) {
      Speech.speak(response);
    }
    setLoading(false);
  };
  //console.log('TÄÄLLÄKI')
  return (
    <ImageBackground
      source={getBGImage(isDarkTheme, bgIndex)}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.tehtcont}>
          <Text style={styles.title}>{syllabify("Valitse oikea numero")}</Text>
          <TouchableOpacity style={[styles.startButton, styles.orangeButton]} onPress={playNumber}>
            <Text style={styles.buttonText}>{syllabify("Kuuntele uudestaan 🔊")}</Text>
          </TouchableOpacity>
          <View style={styles.gameOptionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.startButton, { backgroundColor: theme.button }]}
                onPress={() => handleSelect(option)}
                disabled={loading}
              >
                <Text style={styles.label}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
                  <LevelBar progress={imageToNumberXp} label={syllabify("Kuvat numeroiksi")} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"soundToNumber"} />
                  <LevelBar progress={soundToNumberXp} label={syllabify("Äänestä numeroiksi")} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"soundToNumber"} />
                  <LevelBar progress={comparisonXp} label={syllabify("Vertailu")} playerLevel={playerLevel} gameType={"comparison"} caller={"soundToNumber"} />
                  <LevelBar progress={bondsXp} label={syllabify("Hajonta")} playerLevel={playerLevel} gameType={"bonds"} caller={"soundToNumber"} />
                </View>
                <View style={styles.buttonContainer2}>
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
                    <Text style={styles.buttonText}>
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
