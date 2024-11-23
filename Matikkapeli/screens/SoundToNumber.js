import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import ModalComponent from '../components/ModalComponent'
import { ScoreContext } from '../components/ScoreContext';
import styles from '../styles';
import { Audio } from 'expo-av';
import {useTheme} from '../components/ThemeContext';
import {useSoundSettings} from '../components/SoundSettingsContext';
import {useTaskReading} from '../components/TaskReadingContext';
import {useTaskSyllabification} from '../components/TaskSyllabificationContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SoundToNumber({ onBack }) {
  const [number, setNumber] = useState(generateRandomNumber());
  const [options, setOptions] = useState(generateOptions(number));
  const [modalVisible, setModalVisible] = useState(false);
  const { playerLevel, points, setPoints, questionsAnswered, setQuestionsAnswered, incrementXp, handleUpdatePlayerStatsToDatabase } = useContext(ScoreContext)
  const [sound, setSound] = useState();
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDarkTheme } = useTheme();
  const { gameSounds } = useSoundSettings();
  const { taskReading } = useTaskReading();
  const { syllabify, taskSyllabification } = useTaskSyllabification();

  handleUpdatePlayerStatsToDatabase()

  //Koukku jolla tarkistetaan joko kierros päättyy.
  useEffect(() => {
    if(questionsAnswered===5){
      Speech.stop(); //pysäyttää puheen
      incrementXp(points,"soundToNumber") //comparisonin tilalle oma tehtävän nimi: "imageToNumber", "soundToNumber", "comparison" tai "bonds"
      setModalVisible(true)
      setGameEnded(true)
    }
  }, [questionsAnswered]);

  const handleBack = () => {
    Speech.stop()
    setModalVisible(false);
    setQuestionsAnswered(0);
    setPoints(0);
    onBack();
  };
  /*useEffect(() => {
    if (loading) {
      playNumber();
    }
  }, [number]);*/

  async function playSound(isCorrect) {
    if (!gameSounds || gameEnded) return; //Ääntä ei toisteta, jos peli on päättynyt tai äänet ovat pois päältä
    const playSound = async (isCorrect) => {
    setLoading(true); //napit pois käytöstä
  
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
        sound.unloadAsync(); 
        setLoading(false); // napit takaisin käyttöön
      }
    });
  };
  }
  
//tässä vaiheessa vielä generoi randomilla numeron 1-10 väliltä
  function generateRandomNumber() {
    return Math.floor(Math.random() * 10); 
  }
 
//valitsee oikean numeron ja 3 muuta randomilla
  function generateOptions(correctNumber) {
    const options = [correctNumber];
    while (options.length < 4) {
      const randomNum = Math.floor(Math.random() * 10);
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    //sekoittaa vaihtoehdot
    return options.sort(() => Math.random() - 0.5); 
  }
  
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playNumber = () => {
    Speech.stop();
    Speech.speak(number.toString());
  };
  
  const handleSelect = (selectedNumber) => {
    if (gameEnded) return;
    Speech.stop();
    setLoading(true); //napit pois käytöstä
    const isCorrect = selectedNumber === number; //tarkistaa onko valittu numero oikein
    playSound(isCorrect);

    const newNumber = generateRandomNumber();
    setNumber(newNumber);
    setOptions(generateOptions(newNumber));
    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + 1);
    }
    setQuestionsAnswered((prevQuestionsAnswered) => prevQuestionsAnswered + 1);
  };
  

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#333' : '#fff'}
      />
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkTheme ? '#fff' : '#000' }]}>Ääni numeroiksi</Text>
      <Button title="Kuuntele numero 🔊" onPress={playNumber} />
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, loading && { opacity: 0.5 }]}
            onPress={() => handleSelect(option)}
            disabled={loading}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Palaa takaisin" onPress={onBack} />
      <ModalComponent
        isVisible={modalVisible}
        onBack={handleBack}
      />
    </View>
    </SafeAreaView>
  );
};
