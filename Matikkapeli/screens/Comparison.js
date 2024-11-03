import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'

export default function Comparison({ onBack }) {
  const [comparisonXp, setComparisonXp] = useState(0) //tilamuuttuja tämän tehtävän pisteille
  const [randomNumber1, setRandomNumber1] = useState(0) // tilamuuttuja 1. satunnaisluku
  const [randomNumber2, setRandomNumber2] = useState(0) // tilamuuttuja 2. satunnaisluku
  const [lookingForBigger, setLookingForBigger] = useState(false) // tilamuuttuja, etsitäänkö isompaa vai pienempää numeroa

  const drawRandomNumber = (min, max) => { // funktio satunnaisluvun arvontaan, palauttaa satunnaisluvun annetulta väliltä
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const checkAnswer = (answer) => { //funktio vastauksen tarkistukseen
    let correctAnswer = false //muuttuja, jonka perusteella tehdään lopputoimet

    //logiikka oikeille vastauksille.
    if (answer === "=") {
      if (randomNumber1 === randomNumber2) {
        correctAnswer = true
      }
    } else if (
      (answer === randomNumber1 && lookingForBigger && randomNumber1 > randomNumber2) ||
      (answer === randomNumber1 && !lookingForBigger && randomNumber1 < randomNumber2)
    ) {
      correctAnswer = true
    } else if (
      (answer === randomNumber2 && lookingForBigger && randomNumber2 > randomNumber1) ||
      (answer === randomNumber2 && !lookingForBigger && randomNumber2 < randomNumber1)
    ) {
      correctAnswer = true
    }

    //lopputoimet
    if (correctAnswer) {
      console.log("Oikein!")
      setComparisonXp(prevComparisonXp => prevComparisonXp + 1) //lisätään piste
      //playSound(correct) //toistetaan oikein merkkiääni
    } else {
      console.log("Väärin!")
      if (comparisonXp>0) {
        setComparisonXp(prevComparisonXp => prevComparisonXp - 1) //vähennetään piste, jos voi
      }
      //playSound(incorrect) //toistetaan väärin merkkiääni
    } 

    setRandomNumber1(drawRandomNumber(0, comparisonXp * 0.2 + 1)) //arvotaan uusi 1. satunnaisluku
    setRandomNumber2(drawRandomNumber(0, comparisonXp * 0.2 + 1)) //arvotaan uusi 2. satunnaisluku

    if (drawRandomNumber(0, 1) === 1) { // arvotaan haetaanko seuraavaksi isompaa vai pienempää
      setLookingForBigger(true) //haetaan isompaa
      /*if (speech) {
        speak("Valitse yhtäsuuri tai suurempi.") //toistetaan tehtävänanto puheena
      }*/
    } else {
      setLookingForBigger(false) //haetaan pienempää
      /*if (speech) {
        speak("Valitse yhtäsuuri tai pienempi.") //toistetaan tehtävänanto puheena
      }*/
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vertailu</Text>
      <Text>comparisonXp: {comparisonXp}</Text> 
      {lookingForBigger ?
        (/*hyphens ? <Text style={styles.guideBigger}>VA-LIT-SE YH-TÄ-SUU-RI TAI SUU-REM-PI</Text> : */<Text style={styles.guideBigger}>Valitse yhtäsuuri tai suurempi</Text>) :
        (/*hyphens ? <Text style={styles.guideSmaller}>VA-LIT-SE YH-TÄ-SUU-RI TAI PIE-NEM-PI</Text> : */<Text style={styles.guideSmaller}>Valitse yhtäsuuri tai pienempi</Text>)
      }
      <Text onPress={() => checkAnswer(randomNumber1)} style={styles.options} >{randomNumber1}</Text>
      <Text onPress={() => checkAnswer("=")} style={styles.options} >=</Text>
      <Text onPress={() => checkAnswer(randomNumber2)} style={styles.options} >{randomNumber2}</Text>
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
    width: "100%"
  },
  title: {
    fontSize: 24,
  },
  guideBigger: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FFDE21'
  },
  guideSmaller: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#00FFFF'
  },
  options: {
    width: "80%",
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#3bb143'
  }
});