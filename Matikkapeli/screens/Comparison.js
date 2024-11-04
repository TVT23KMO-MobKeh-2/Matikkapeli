import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'

export default function Comparison({ onBack }) {
  const [comparisonXp, setComparisonXp] = useState(0) //tilamuuttuja tämän tehtävän pisteille
  const [isComparable1Equation, setIsComparable1Equation] = useState(false) // tilamuuttuja onko 1. vertailtava yhtälö
  const [isComparable2Equation, setIsComparable2Equation] = useState(false) // tilamuuttuja onko 2. vertailtava yhtälö
  const [randomNumber1, setRandomNumber1] = useState(0) // tilamuuttuja 1. satunnaisluku
  const [randomNumber2, setRandomNumber2] = useState(0) // tilamuuttuja 2. satunnaisluku
  const [lookingForBigger, setLookingForBigger] = useState(false) // tilamuuttuja, etsitäänkö isompaa vai pienempää arvoa
  const [equation1Operand1, setEquation1Operand1] = useState(0) // tilamuuttuja, 1. yhtälön 1. numerolle
  const [equation1Operand2, setEquation1Operand2] = useState(0) // tilamuuttuja, 1. yhtälön 2. numerolle
  const [isEquation1Addition, setIsEquation1Addition] = useState(false) // tilamuuttuja, onko 1. yhtälö yhteenlasku
  const [equation2Operand1, setEquation2Operand1] = useState(0) // tilamuuttuja, 2. yhtälön 1. numerolle
  const [equation2Operand2, setEquation2Operand2] = useState(0) // tilamuuttuja, 2. yhtälön 2. numerolle
  const [isEquation2Addition, setIsEquation2Addition] = useState(false) // tilamuuttuja, onko 2. yhtälö yhteenlasku
  const [hyphens, setHyphens] = useState(false) // väliaikainen tilamuuttuja tavutukselle

  // funktio satunnaisluvun arvontaan, palauttaa satunnaisluvun annetulta väliltä
  const drawRandomNumber = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const drawNewNumbers = () => {
    //arvotaan uudet satunnaisluvut
    setRandomNumber1(drawRandomNumber(0, comparisonXp * 0.2 + 1))
    setRandomNumber2(drawRandomNumber(0, comparisonXp * 0.2 + 1))

    // Jos comparisonXp on tarpeeksi iso arvotaan haetaanko yhtälöä ja kutsutaan tarvittaessa funktiota sen muodostamiseen 
    if (comparisonXp > 10) {
      //vertailtava 1:
      if (drawRandomNumber(0, 1) === 1) {
        setIsComparable1Equation(true)
        generateEquation(setIsEquation1Addition, setEquation1Operand1, setEquation1Operand2)
      } else {
        setIsComparable1Equation(false)
      }
      //vertailtava 2:
      if (drawRandomNumber(0, 1) === 1) {
        setIsComparable2Equation(true)
        generateEquation(setIsEquation2Addition, setEquation2Operand1, setEquation2Operand2)
      } else {
        setIsComparable2Equation(false)
      }
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
      return operand1+operand2
    } else { //muutoin erotus
      return operand1-operand2
    }
  }

  //funktio yhtälön muodostamiseen
  const generateEquation = (setIsAddition, setOperand1, setOperand2) => {
    // arvotaan kaksi lukua väliltä 0-comparisonXp * 0.1 +1
    const first = drawRandomNumber(0, comparisonXp * 0.1 + 1)
    const second = drawRandomNumber(0, comparisonXp * 0.1 + 1)

    if (drawRandomNumber(0,1) === 1) { // arvotaan onko yhteenlasku, jos on asetetaan muuttujiin luvut ja true  
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

  //funktio vastauksen tarkistukseen
  const checkAnswer = (answer) => { 
    console.log("vastaus annettu, vastaus: ", answer)
    let correctAnswer = false //muuttuja, jonka perusteella tehdään lopputoimet
    let resultOfEquation1 = 0 //muuttuja 1. yhtälön lopputulokselle
    let resultOfEquation2 = 0 //muuttuja 2. yhtälön lopputulokselle

    if (isComparable1Equation) { //jos 1. vertailtava on yhtälö lasketaan sen arvo
      resultOfEquation1=calculateEquation(equation1Operand1, equation1Operand2, isEquation1Addition)
    }
    if (isComparable2Equation) { //jos 2. vertailtava on yhtälö lasketaan sen arvo
      resultOfEquation2=calculateEquation(equation2Operand1, equation2Operand2, isEquation2Addition)
    }

    //logiikka oikeille vastauksille.
    if (answer === "=") { // jos vastaus on yhtäsuuri
      if (isComparable1Equation && isComparable2Equation) {
        if (resultOfEquation1 === resultOfEquation2) {
          correctAnswer = true
        }
      } else if (isComparable1Equation && !isComparable2Equation) {
        if (resultOfEquation1 === randomNumber2)
          correctAnswer = true
      } else if (!isComparable1Equation && isComparable2Equation) {
        if (randomNumber1 === resultOfEquation2) {
          correctAnswer = true
        }
      } else if (!isComparable1Equation && !isComparable2Equation) {
        if (randomNumber1 === randomNumber2) {
          correctAnswer = true
        }
      }
    } else if ( // jos vastaus on 1. vaihtoehto
      (answer === 1 &&
        (lookingForBigger && !isComparable1Equation && !isComparable2Equation && randomNumber1 > randomNumber2) ||
        (!lookingForBigger && !isComparable1Equation && !isComparable2Equation && randomNumber1 < randomNumber2) ||
        (lookingForBigger && isComparable1Equation && isComparable2Equation && resultOfEquation1 > resultOfEquation2) ||
        (!lookingForBigger && isComparable1Equation && isComparable2Equation && resultOfEquation1 < resultOfEquation2) ||
        (lookingForBigger && isComparable1Equation && !isComparable2Equation && resultOfEquation1 > randomNumber2) ||
        (!lookingForBigger && isComparable1Equation && !isComparable2Equation && resultOfEquation1 < randomNumber2) ||
        (lookingForBigger && !isComparable1Equation && isComparable2Equation && randomNumber1 > resultOfEquation2) ||
        (!lookingForBigger && !isComparable1Equation && isComparable2Equation && randomNumber1 < resultOfEquation2)
      )) {
      correctAnswer = true
    } else if ( // jos vastaus on 2. vaihtoehto
      (answer === 2 &&
        (lookingForBigger && !isComparable1Equation && !isComparable2Equation && randomNumber1 < randomNumber2) ||
        (!lookingForBigger && !isComparable1Equation && !isComparable2Equation && randomNumber1 > randomNumber2) ||
        (lookingForBigger && isComparable1Equation && isComparable2Equation && resultOfEquation1 < resultOfEquation2) ||
        (!lookingForBigger && isComparable1Equation && isComparable2Equation && resultOfEquation1 > resultOfEquation2) ||
        (lookingForBigger && isComparable1Equation && !isComparable2Equation && resultOfEquation1 < randomNumber2) ||
        (!lookingForBigger && isComparable1Equation && !isComparable2Equation && resultOfEquation1 > randomNumber2) ||
        (lookingForBigger && !isComparable1Equation && isComparable2Equation && randomNumber1 < resultOfEquation2) ||
        (!lookingForBigger && !isComparable1Equation && isComparable2Equation && randomNumber1 > resultOfEquation2)
      )) {
      correctAnswer = true
    }

    /*    console.log("Muuttujat")
        console.log("isComparable1Equation: ",isComparable1Equation) 
        console.log("isComparable2Equation: ",isComparable2Equation) 
        console.log("randomNumber1: ",randomNumber1) 
        console.log("randomNumber2: ", randomNumber2)
        console.log("lookingForBigger: ", lookingForBigger)
        console.log("equation1Operand1: ", equation1Operand1)
        console.log("equation1Operand2: ", equation1Operand2)
        console.log("isEquation1Addition: ", isEquation1Addition)
        console.log("equation2Operand1: ",equation2Operand1)
        console.log("equation2Operand2: ",equation2Operand2)
        console.log("isEquation2Addition: ",isEquation2Addition)
        console.log("resultOfEquation1: ", resultOfEquation1)
        console.log("resultOfEquation2: ", resultOfEquation2)
        console.log("correctAnswer: ", correctAnswer)*/

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

  //funktio vertailtavan renderöintiä varten
  const renderComparable = (comparableNumber) => {
    //muuttujat comparableNumber perusteella:
    // tarkistetaan onko kyseessä yhtälö :
    const isEquation = comparableNumber === 1 ? isComparable1Equation : isComparable2Equation;
    // tarkistetaan onko kyseessä yhteenlasku :
    const isAddition = comparableNumber === 1 ? isEquation1Addition : isEquation2Addition;
    // asetetaan muuttujaan yhtälön 1. osa :
    const operand1 = comparableNumber === 1 ? equation1Operand1 : equation2Operand1;
    // asetetaan muuttujaan yhtälön 2. osa :
    const operand2 = comparableNumber === 1 ? equation1Operand2 : equation2Operand2;
    // asetetaan muuttujaan satunnaisluku :
    const randomNumber = comparableNumber === 1 ? randomNumber1 : randomNumber2;
  
    if (isEquation) { //jos on yhtälö, niin palautetaan yhtälön osat ja + tai -
      return (
        <Text onPress={() => checkAnswer(comparableNumber)} style={styles.options}>
          {operand1} <Text>{isAddition ? '+' : '-'}</Text> {operand2}
        </Text>
      );
    } else { // muutoin palautetaan satunnaisluku
      return (
        <Text onPress={() => checkAnswer(comparableNumber)} style={styles.options}>
          {randomNumber}
        </Text>
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vertailu</Text>
      <Text>comparisonXp: {comparisonXp}</Text> 
      {renderGuide()}
      {renderComparable(1)}
      <Text onPress={() => checkAnswer("=")} style={styles.options} >=</Text> 
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