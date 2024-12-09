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
  const { playerLevel, incrementXp, handleUpdatePlayerStatsToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, totalXp, email } = useContext(ScoreContext);
  const [points, setPoints] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { gameSounds, playSound } = useSoundSettings(); // Haetaan playSound suoraan kontekstista
  const { taskReading } = useTaskReading();
  const [number, setNumber] = useState(() => generateRandomNumber(0, playerLevel || 10));
  const [options, setOptions] = useState(generateOptions(number));
  const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);
  const bgIndex = 2;

  console.log("Renderöidään soundToNumber")
  useEffect(() => {
    if (questionsAnswered === 5) {
      Speech.stop();
      incrementXp(points, "soundToNumber");
      setShowFeedback(true);
      setGameEnded(true);
    } else {
      if (!gameEnded) {
        playNumber();  // Only play the number if the game hasn't ended
      }
    }
  }, [questionsAnswered, gameEnded]); 

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
    console.log('SoundToNumber useEffect');
    if (number !== null) {
      setOptions(generateOptions(number));
    }
  }, [number, playerLevel]);

  const playNumber = () => {
    Speech.stop();
    Speech.speak(number.toString());
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

    const newNumber = generateRandomNumber(0, playerLevel);
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
          <Text style={styles.buttonText}>{syllabify("Kuuntele numero 🔊")}</Text>
        </TouchableOpacity>
        <View style={styles.gameOptionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.startButton, {backgroundColor: theme.button}]}
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
