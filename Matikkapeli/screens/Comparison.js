import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'

export default function Comparison({ onBack }) {
  const [comparisonXp, setComparisonXp] = useState(0) //tilamuuttuja tämän tehtävän pisteille
  const [isComparable1Equation, setIsComparable1Equation] = useState(false)
  const [isComparable2Equation, setIsComparable2Equation] = useState(false)
  const [randomNumber1, setRandomNumber1] = useState(0) // tilamuuttuja 1. satunnaisluku
  const [randomNumber2, setRandomNumber2] = useState(0) // tilamuuttuja 2. satunnaisluku
  const [lookingForBigger, setLookingForBigger] = useState(false) // tilamuuttuja, etsitäänkö isompaa vai pienempää arvoa
  const [equation1Operand1, setEquation1Operand1] = useState(0)
  const [equation1Operand2, setEquation1Operand2] = useState(0)
  const [isEquation1Addition, setIsEquation1Addition] = useState(false)
  const [equation2Operand1, setEquation2Operand1] = useState(0)
  const [equation2Operand2, setEquation2Operand2] = useState(0)
  const [isEquation2Addition, setIsEquation2Addition] = useState(false)

  const drawRandomNumber = (min, max) => { // funktio satunnaisluvun arvontaan, palauttaa satunnaisluvun annetulta väliltä
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const calculateEquation = (operand1, operand2, isAddition) => { //funktio yhtälön arvon laskemista varten
    if (isAddition) {//jos yhteenslasku, palautetaan 
      return operand1+operand2
    } else {
      return operand1-operand2
    }
  }

  const checkAnswer = (answer) => { //funktio vastauksen tarkistukseen
    console.log("")
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

    setRandomNumber1(drawRandomNumber(0, comparisonXp * 0.2 + 1)) //arvotaan uusi 1. satunnaisluku
    setRandomNumber2(drawRandomNumber(0, comparisonXp * 0.2 + 1)) //arvotaan uusi 2. satunnaisluku

    // Jos comparisonXp on tarpeeksi iso, arvotaan haetaanko yhtälöitä ja niiden sisällöt
    if (comparisonXp > 10) {
      if (drawRandomNumber(0, 1) === 1) {//arvotaan, onko lauseke yhteenlasku
        setIsComparable1Equation(true)
      } else {
        setIsComparable1Equation(false)
      }
      if (drawRandomNumber(0, 1) === 1) {//arvotaan, onko lauseke yhteenlasku
        setIsComparable2Equation(true)
      } else {
        setIsComparable2Equation(false)
      }

      if (isComparable1Equation) {//jos 1. vertailtava on yhtälö
        if (drawRandomNumber(0, 1) === 1) {//arvotaan, onko 1. lauseke yhteenlasku 
          setIsEquation1Addition(true) // jos on, asetetaan trueksi ja arvotaan luvut
          setEquation1Operand1(drawRandomNumber(0, comparisonXp * 0.1 + 1))
          setEquation1Operand2(drawRandomNumber(0, comparisonXp * 0.1 + 1))
        } else {
          setIsEquation1Addition(false) // jos ei, asetetaan falseksi ja arvotaan luvut niin, että tulos on vähintään 0
          const first = drawRandomNumber(0, comparisonXp * 0.1 + 1)
          const second = drawRandomNumber(0, comparisonXp * 0.1 + 1)
          if (first >= second) {
            setEquation1Operand1(first)
            setEquation1Operand2(second)
          } else {
            setEquation1Operand1(second)
            setEquation1Operand2(first)
          }
        }
      }

      if (isComparable2Equation) {//jos 2. vertailtava on yhtälö
        if (drawRandomNumber(0, 1) === 1) {//arvotaan, onko 1. lauseke yhteenlasku 
          setIsEquation2Addition(true)// jos on, asetetaan trueksi ja arvotaan luvut
          setEquation2Operand1(drawRandomNumber(0, comparisonXp * 0.1 + 1))
          setEquation2Operand2(drawRandomNumber(0, comparisonXp * 0.1 + 1))
        } else { // jos ei, asetetaan falseksi ja arvotaan luvut niin, että tulos on vähintään 0
          setIsEquation2Addition(false)
          const first = drawRandomNumber(0, comparisonXp * 0.1 + 1)
          const second = drawRandomNumber(0, comparisonXp * 0.1 + 1)
          if (first >= second) {
            setEquation2Operand1(first)
            setEquation2Operand2(second)
          } else {
            setEquation2Operand1(second)
            setEquation2Operand2(first)
          }
        }
      }
    }

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
      <Text style={styles.title}>Vertailu</Text> {/* Otsikon tulostus */}
      <Text>comparisonXp: {comparisonXp}</Text> {/* Pisteiden tulostus */}
      {lookingForBigger ? {/* Tulostetaan ohjeet sen perusteella, haetaanko isompaa vaiko pienempää */}
        (/*hyphens ? <Text style={styles.guideBigger}>VA-LIT-SE YH-TÄ-SUU-RI TAI SUU-REM-PI</Text> : */<Text style={styles.guideBigger}>Valitse yhtäsuuri tai suurempi</Text>) :
        (/*hyphens ? <Text style={styles.guideSmaller}>VA-LIT-SE YH-TÄ-SUU-RI TAI PIE-NEM-PI</Text> : */<Text style={styles.guideSmaller}>Valitse yhtäsuuri tai pienempi</Text>)
      }

      {isComparable1Equation ? {/* Tulostetaan 1. vertailtava sen mukaan, onko se yhtälö vai numero */ }
        (<Text onPress={() => checkAnswer(1)} style={styles.options} >{equation1Operand1} {isEquation1Addition ? '+' : '-'} {equation1Operand2}</Text>) :
        (<Text onPress={() => checkAnswer(1)} style={styles.options} >{randomNumber1}</Text>)
      }

      <Text onPress={() => checkAnswer("=")} style={styles.options} >=</Text> {/* Tulostetaan yhtäsuurimerkki */}

      {isComparable2Equation ? {/* Tulostetaan 2. vertailtava sen mukaan, onko se yhtälö vai numero */ }
        (<Text onPress={() => checkAnswer(2)} style={styles.options} >{equation2Operand1} {isEquation2Addition ? '+' : '-'} {equation2Operand2}</Text>) :
        (<Text onPress={() => checkAnswer(2)} style={styles.options} >{randomNumber2}</Text>)
      }
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