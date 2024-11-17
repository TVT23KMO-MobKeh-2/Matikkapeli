import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import ModalComponent from '../components/ModalComponent'
import { ScoreContext } from '../components/ScoreContext';
import styles from '../styles';
import { Audio } from 'expo-av';


export default function SoundToNumber({ onBack }) {
  const [number, setNumber] = useState(generateRandomNumber());
  const [options, setOptions] = useState(generateOptions(number));
  const [modalVisible, setModalVisible] = useState(false);
  const {playerLevel,points,setPoints,questionsAnswered,setQuestionsAnswered,incrementXp} = useContext(ScoreContext) // tuodaan tarvittavat muuttujat ja setterit
  const [sound, setSound] = useState();
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const playSound = async (isCorrect) => {
    setLoading(true); //napit pois käytöstä
    const soundUri = isCorrect
      ? require('../assets/sounds/mixkit-game-level-completed.wav')
      : require('../assets/sounds/mixkit-arcade-retro-game-over.wav');
 
    const { sound } = await Audio.Sound.createAsync(soundUri);
    setSound(sound);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        sound.unloadAsync(); 
        setLoading(false); // napit takaisin käyttöön
      }
    });
  };
  
//tässä vaiheessa vielä generoi randomilla numeron 1-10 väliltä
  function generateRandomNumber() {
    return Math.floor(Math.random() * 10); 
  }
 
//valitsee oikean numeron ja 3 muuta randomilla
  function generateOptions(correctNumber) {
    const options = [correctNumber];
    while (options.length < 3) {
      const randomNum = Math.floor(Math.random() * 10);
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    //sekoittaa vaihtoehdot
    return options.sort(() => Math.random() - 0.5); 
  }

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
    <View style={styles.container}>
      <Text style={styles.title}>Ääni numeroiksi</Text>
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
  );
};