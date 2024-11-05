import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'

export default function Comparison({ onBack, /*level, hyphens*/ }) {
  const [level, setLevel] = useState(5) //tilapäinen tilamuuttuja Levelille, tuodaan myöhemmin tehtävään suoraan propsina.
  const [hyphens, setHyphens] = useState(false) // väliaikainen tilamuuttuja tavutukselle

  const [isLevelNumberFirstComparable, setIsLevelNumberFirstComparable] = useState(true)
  const [comparisonXp, setComparisonXp] = useState(0) //tilamuuttuja tämän tehtävän pisteille
  const [isComparableEquation, setIsComparableEquation] = useState(false) // tilamuuttuja onko vertailtava yhtälö
  const [randomNumber, setRandomNumber] = useState(0) // tilamuuttuja 1. satunnaisluku
  const [lookingForBigger, setLookingForBigger] = useState(false) // tilamuuttuja, etsitäänkö isompaa vai pienempää arvoa
  const [equationOperand1, setEquationOperand1] = useState(0) // tilamuuttuja, 1. yhtälön 1. numerolle
  const [equationOperand2, setEquationOperand2] = useState(0) // tilamuuttuja, 1. yhtälön 2. numerolle
  const [isEquationAddition, setIsEquationAddition] = useState(false) // tilamuuttuja, onko 1. yhtälö yhteenlasku


  // funktio satunnaisluvun arvontaan, palauttaa satunnaisluvun annetulta väliltä
  const drawRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const drawNewNumbers = () => {
    //arvotaan uudet satunnaisluvut
    setRandomNumber(drawRandomNumber(0, comparisonXp * 0.2 + 1))
    //arvotaan onko tason mukainen numero 1. vai 2. vertailtava
    setIsLevelNumberFirstComparable(drawRandomNumber(0, 1) === 1)

    // Jos comparisonXp on tarpeeksi iso arvotaan haetaanko yhtälöä ja kutsutaan tarvittaessa funktiota sen muodostamiseen 
    if (comparisonXp > 10) {
      if (drawRandomNumber(0, 1) === 1) {
        setIsComparableEquation(true)
        generateEquation(setIsEquationAddition, setEquationOperand1, setEquationOperand2)
      }
    } else {
      setIsComparableEquation(false)
    }

    // arvotaan haetaanko seuraavaksi isompaa vai pienempää
    if (drawRandomNumber(0, 1) === 1) {
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


    //funktio yhtälön arvon laskemista varten
    const calculateEquation = (operand1, operand2, isAddition) => {
      if (isAddition) {//jos yhteenslasku, palautetaan summa
        return operand1 + operand2
      } else { //muutoin erotus
        return operand1 - operand2
      }
    }

    //funktio yhtälön muodostamiseen
    const generateEquation = (setIsAddition, setOperand1, setOperand2) => {
      // arvotaan kaksi lukua väliltä 0-comparisonXp * 0.1 +1
      const first = drawRandomNumber(0, comparisonXp * 0.1 + 1)
      const second = drawRandomNumber(0, comparisonXp * 0.1 + 1)

      if (drawRandomNumber(0, 1) === 1) { // arvotaan onko yhteenlasku, jos on asetetaan muuttujiin luvut ja true  
        setIsAddition(true)
        setOperand1(first)
        setOperand2(second)
      } else { //muutoin false ja ensimmäiseen muuttujaan isompi luku ja toiseen pienempi, jotta lopputulos ei ole pienempi kuin 0
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

    //funktio vastauksen tarkistukseen (answer = 'leveli' || 'equationi' || 'equali' || 'randomnumberi') 
    // && (comparable = 1||'equationi'||2)
    const checkAnswer = (answer, comparable) => {
      let valueOfComparable = 0
      let valueOfAnswer = 0
      let correctAnswer = false //muuttuja, jonka perusteella tehdään lopputoimet

      //asetetaan vastauksen ja vertailtavan arvot vastauksen perusteella
      switch (answer) {
        case "leveli": //  jos vastaus on level, asetetaan se vastauksen arvoksi ja vertailtavan arvoksi joko yhtälön arvo tai randomnumero
          valueOfAnswer = level
          valueOfComparable = isComparableEquation ? calculateEquation(equationOperand1, equationOperand2, isEquationAddition) : randomNumber
          break;
        case "equationi"://  jos vastaus on yhtälö, asetetaan se vastauksen arvoksi ja vertailtavan arvoksi level
          valueOfAnswer = calculateEquation(equationOperand1, equationOperand2, isEquationAddition)
          valueOfComparable = level
          break;
        case "equali": //  jos vastaus on yhtäsuuri, asetetaan vastauksen arvoksi level ja vertailtavan arvoksi yhtälön arvo tai randomnumero 
          if (isComparableEquation) {
            valueOfComparable = calculateEquation(equationOperand1, equationOperand2, isEquationAddition)
            valueOfAnswer = level
          } else {
            valueOfComparable = randomNumber
            valueOfAnswer = level
          } // verrataan näitä suoraan jo keskenään
          if (valueOfAnswer === valueOfComparable) {
            correctAnswer = true
          }
          break;
        case "randomnumberi": //  jos vastaus on randomnumero, asetetaan se vastauksen arvoksi ja vertailtavan arvoksi level
          valueOfAnswer = randomNumber
          valueOfComparable = level
          break;
        default:
          break;
      }

      //tarkistetaan onko vertailu oikein
      if (lookingForBigger) { //jos haetaan isompaa, tarkistetaan onko vastaus suurempi kuin vertailtavan arvo
        if (valueOfAnswer > valueOfComparable) {
          correctAnswer = true
        }
      } else {//muutoin tarkistetaan onko se pienempi
        if (valueOfAnswer < valueOfComparable) {
          correctAnswer = true
        }
      }

      //lopputoimet
      if (correctAnswer) {
        setComparisonXp(prevComparisonXp => prevComparisonXp + 1) //lisätään piste
        //playSound(correct) //toistetaan oikein merkkiääni
      } else {
        if (comparisonXp > 0) {
          setComparisonXp(prevComparisonXp => prevComparisonXp - 1) //vähennetään piste, jos voi
        }
        //playSound(incorrect) //toistetaan väärin merkkiääni
      }

      //arvotaan uudet numerot
      drawNewNumbers()
    }

    //funktio ohjeen renderöintiä varten
    const renderGuide = () => {
      const text = lookingForBigger // Tallennetaan muuttujaan teksti sen perusteella, etsitäänkö suurempaa... 
        ? hyphens // ...ja tavutetaanko teksti
          ? 'VA-LIT-SE YH-TÄ-SUU-RI TAI SUU-REM-PI'
          : 'Valitse yhtäsuuri tai suurempi'
        : hyphens
          ? 'VA-LIT-SE YH-TÄ-SUU-RI TAI PIE-NEM-PI'
          : 'Valitse yhtäsuuri tai pienempi';

      const style = lookingForBigger ? styles.guideBigger : styles.guideSmaller; // tallennetaan muuttujaan tyyli sen perusteella, etsitäänkö suurempaa

      //palautetaan teksti tyylillä.
      return <Text style={style}>{text}</Text>
    }

    //funktio vertailtavan renderöintiä
    const renderComparable = (comparableNumber) => {
      // tarkisteaan onko kyseessä tasonmukainen numero, jos on palautetaan se:
      if ((comparableNumber === 1 && isLevelNumberFirstComparable) || (comparableNumber === 2 && !isLevelNumberFirstComparable)) {
        return (
          <Text onPress={() => checkAnswer("leveli", isLevelNumberFirstComparable ? 1 : 2)} style={styles.options}>
            {level}
          </Text>
        );
      }

      if (isComparableEquation) { //jos on yhtälö, niin palautetaan yhtälön osat ja + tai -
        return (
          <Text onPress={() => checkAnswer("equatoni", comparableNumber)} style={styles.options}>
            {equationOperand1} <Text>{isEquationAddition ? '+' : '-'}</Text> {equationOperand2}
          </Text>
        );
      } else { // muutoin palautetaan satunnaisluku
        return (
          <Text onPress={() => checkAnswer("randomnumberi", comparableNumber)} style={styles.options}>
            {randomNumber}
          </Text>
        );
      }
    }


    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vertailu</Text>
        <Text>comparisonXp: {comparisonXp}</Text>
        {renderGuide()}
        {renderComparable(1)}
        <Text onPress={() => checkAnswer("equali", null)} style={styles.options} >=</Text>
        {renderComparable(2)}
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