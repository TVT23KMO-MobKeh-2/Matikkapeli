import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as Speech from 'expo-speech';

export default function SoundToNumber({ onBack }) {
  const [number, setNumber] = useState(generateRandomNumber());
  const [options, setOptions] = useState(generateOptions(number));

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

  const playNumber = () => {
    Speech.speak(number.toString());
  };

  
  const handleSelect = (selectedNumber) => {
    if (selectedNumber === number) {
      alert('Oikein!');
      const newNumber = generateRandomNumber();
      setNumber(newNumber);
      setOptions(generateOptions(newNumber));
    } else {
      alert('Väärin, yritä uudelleen.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ääni numeroiksi</Text>
      <Button title="🔊" onPress={playNumber} />
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleSelect(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Palaa takaisin" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  optionButton: {
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
  },
});
