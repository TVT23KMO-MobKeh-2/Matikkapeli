import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalComponent from '../components/ModalComponent'
import * as Speech from 'expo-speech';

export default function Comparison({ onBack, /*level, hyphens jne aset*/ }) {
  const [level, setLevel] = useState(5) // väliaikainen // Määrittää, levelin, joka on aina toinen vertailtava
  const [hyphens, setHyphens] = useState(false) // väliaikainen // Määrittää, onko tavutus käytössä (true) vai ei (false)
  const [points, setPoints] = useState(0)//Pisteet (0-5) etenemistä varten
  const [questionsAnswered, setQuestionsAnswered] = useState(0)//Vastatut kysymykset (0-5) kierroksen pituutta varten 
  const [modalVisible, setModalVisible] = useState(false)//Määrittää näytetäänkö Modal

  const [isLevelNumberFirstComparable, setIsLevelNumberFirstComparable] = useState(true) // Määrittää, esitetäänkö tason mukainen numero vertailussa ensimmäisenä (true) vai toisena (false)
  const [comparisonXp, setComparisonXp] = useState(0) // Tämänhetkiset pisteet oikeasta vastauksesta. Kasvaa jokaisesta oikeasta vastauksesta ja vähenee väärästä.
  const [isComparableEquation, setIsComparableEquation] = useState(false) // Määrittää, onko vertailtavana yhtälö vai satunnaisluku (true = yhtälö, false = satunnaisluku)
  const [randomNumber, setRandomNumber] = useState(0) // Vertailtavaksi arvottu satunnaisluku, käytetään yksittäisissä lukuvertailutehtävissä
  const [lookingForBigger, setLookingForBigger] = useState(false) // Määrittää, etsitäänkö isompaa (true) vai pienempää arvoa (false)
  const [equationOperand1, setEquationOperand1] = useState(0) // Yhtälön ensimmäinen operandin arvo, käytetään laskutoimituksissa
  const [equationOperand2, setEquationOperand2] = useState(0) // Yhtälön toinen operandin arvo, käytetään laskutoimituksissa
  const [isEquationAddition, setIsEquationAddition] = useState(false) // Määrittää, onko laskutoimitus yhteenlasku (true) vai ei (false)

  //Koukku jolla tarkistetaan joko kierros päättyy.
  useEffect(() => {
    if(questionsAnswered===5){
      //incrementXp(points,"comparsion")
      setModalVisible(true)
    }
  }, [questionsAnswered])
  
  // Käsittelee takaisinpaluun
  const handleBack = () => {
    Speech.stop()
    setModalVisible(false);
    setQuestionsAnswered(0);
    setPoints(0);
    onBack();
  }

  // Arpoo satunnaisluvun annetulta väliltä (mukaan lukien minimi ja maksimi) ja palauttaa sen
  const drawRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Funktio uusien lukujen arpomista varten
  const drawNewNumbers = () => {
    // Arvotaan uusi satunnaisluku, jonka maksimiarvo riippuu comparisonXp:n arvosta
    setRandomNumber(drawRandomNumber(0, comparisonXp * 0.2 + 1))
    // Arvotaan, onko tason mukainen numero 1. vai 2. vertailtava
    setIsLevelNumberFirstComparable(drawRandomNumber(0, 1) === 1)

    // Jos comparisonXp ylittää 10, arvotaan yhtälön tarve ja muodostetaan yhtälö tarvittaessa
    if (comparisonXp > 10) {
      if (drawRandomNumber(0, 1) === 1) {
        setIsComparableEquation(true)
        generateEquation(setIsEquationAddition, setEquationOperand1, setEquationOperand2)
      }
    } else {
      setIsComparableEquation(false)
    }

    // Arvotaan, etsitäänkö isompaa vai pienempää lukua
    if (drawRandomNumber(0, 1) === 1) {
      setLookingForBigger(true) // Haetaan isompaa
      /*if (speech) {
        speak("Valitse yhtäsuuri tai suurempi.") //toistetaan tehtävänanto puheena
      }*/
    } else {
      setLookingForBigger(false) // Haetaan pienempää
      /*if (speech) {
        speak("Valitse yhtäsuuri tai pienempi.") //toistetaan tehtävänanto puheena
      }*/
    }
  }

  // Funktio yhtälön arvon laskemista varten
  const calculateEquation = (operand1, operand2, isAddition) => {
    if (isAddition) {//Jos yhteenslasku, palautetaan summa
      return operand1 + operand2
    } else { //Muutoin palautetaan erotus
      return operand1 - operand2
    }
  }

  //Funktio yhtälön muodostamiseen
  const generateEquation = (setIsAddition, setOperand1, setOperand2) => {
    // Arvotaan kaksi lukua väliltä 0 - (comparisonXp * 0.1 + 1)
    const first = drawRandomNumber(0, comparisonXp * 0.1 + 1)
    const second = drawRandomNumber(0, comparisonXp * 0.1 + 1)

    if (drawRandomNumber(0, 1) === 1) { 
      // Jos arvottu luku on 1, asetetaan yhteenlasku, arvotut luvut ja true
      setIsAddition(true)
      setOperand1(first)
      setOperand2(second)
    } else { 
      // Muussa tapauksessa asetetaan vähennyslasku (false)
      // ja varmistetaan, että Operand1 on suurempi, jolloin lopputulos ei ole negatiivinen
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

  //Funktio vastauksen tarkistukseen 
  const checkAnswer = (answer) => {
    let valueOfComparable = 0 //Muuttuja vertailtavan arvon tallentamiseen
    let valueOfAnswer = 0 //Muuttuja annetun vastauksen arvon tallentamiseen
    let correctAnswer = false //Muuttuja vastauksen oikeellisuuden tarkistamiseen ja lopputoimien määrittämiseen

    //Asetetaan vastauksen ja vertailtavan arvot annettua vastausta vastaavasti
    switch (answer) {
      case "leveli": //Jos vastaus on "leveli", vastauksen arvoksi asetetaan level, vertailtava arvo on joko yhtälön arvo tai satunnaisluku
        valueOfAnswer = level
        valueOfComparable = isComparableEquation ? calculateEquation(equationOperand1, equationOperand2, isEquationAddition) : randomNumber
        break;
      case "equationi"://Jos vastaus on "equationi", vastauksen arvoksi asetetaan yhtälön arvo ja vertailtavaksi arvoksi level
        valueOfAnswer = calculateEquation(equationOperand1, equationOperand2, isEquationAddition)
        valueOfComparable = level
        break;
      case "equali": //Jos vastaus on "equali", vastauksen arvoksi asetetaan level ja vertailtavaksi arvoksi yhtälön arvo tai satunnaisluku
        if (isComparableEquation) {
          valueOfComparable = calculateEquation(equationOperand1, equationOperand2, isEquationAddition)
          valueOfAnswer = level
        } else {
          valueOfComparable = randomNumber
          valueOfAnswer = level
        } //Tarkistetaan, ovatko arvot yhtäsuuret
        if (valueOfAnswer === valueOfComparable) {
          correctAnswer = true
        }
        break;
      case "randomnumberi":  //Jos vastaus on "randomnumberi", vastauksen arvoksi asetetaan satunnaisluku ja vertailtavaksi arvoksi level
        valueOfAnswer = randomNumber
        valueOfComparable = level
        break;
      default:
        break;
    }

    //Tarkistetaan, onko vertailu oikein
    if (lookingForBigger) {  
      //Jos haetaan suurempaa, tarkistetaan, onko vastaus suurempi kuin vertailtava arvo
      if (valueOfAnswer > valueOfComparable) {
        correctAnswer = true
      }
    } else {
       //Muussa tapauksessa tarkistetaan, onko vastaus pienempi kuin vertailtava arvo
      if (valueOfAnswer < valueOfComparable) {
        correctAnswer = true
      }
    }
    
    // Lopputoimet tarkistuksen jälkeen
    if (correctAnswer) {
      setComparisonXp(prevComparisonXp => prevComparisonXp + 1) //Lisätään piste
      setPoints(prevPoints => prevPoints + 1)
      //playSound(correct) //Toistetaan oikein-merkkiääni
    } else {
/*       if (comparisonXp > 0) {
        setComparisonXp(prevComparisonXp => prevComparisonXp - 1) //Vähennetään piste, jos mahdollista
       } */
      //playSound(incorrect) //Toistetaan väärin-merkkiääni
    }
    // Lisätään vastattu kysymys
    setQuestionsAnswered(prevQuestionsAnswered => prevQuestionsAnswered+1)
    // Arvotaan uudet numerot seuraavaa tehtävää varten
    drawNewNumbers()
  }

  //Funktio ohjeen renderöintiä varten
  const renderGuide = () => {
    //Tallennetaan muuttujaan teksti sen perusteella, etsitäänkö suurempaa ja tavutetaanko teksti
     const text = lookingForBigger 
      ? hyphens 
        ? 'VA-LIT-SE YH-TÄ-SUU-RI TAI SUU-REM-PI' 
        : 'Valitse yhtäsuuri tai suurempi' 
      : hyphens
        ? 'VA-LIT-SE YH-TÄ-SUU-RI TAI PIE-NEM-PI'
        : 'Valitse yhtäsuuri tai pienempi';

    //Määritellään tyyli sen perusteella, etsitäänkö suurempaa vai pienempää
    const style = lookingForBigger ? styles.guideBigger : styles.guideSmaller;

    //Palautetaan ohjeteksti oikealla tyylillä.
    return <Text style={style}>{text}</Text>
  }

  //Funktio vertailtavan renderöintiä
  const renderComparable = (comparableNumber) => {
    //Tarkistetaan, onko kyseessä tasonmukainen numero
    //Jos vertailtava numero on 1 ja isLevelNumberFirstComparable on true, tai vertailtava numero on 2 ja isLevelNumberFirstComparable on false,
    //palautetaan tason mukainen numero (level) tekstinä
    if ((comparableNumber === 1 && isLevelNumberFirstComparable) || (comparableNumber === 2 && !isLevelNumberFirstComparable)) {
      return (
        <Text onPress={() => checkAnswer("leveli")} style={styles.options}>
          {level}
        </Text>
      );
    }

    if (isComparableEquation) {  // Jos vertailtava on yhtälö, palautetaan yhtälön osat ja plus- tai miinusmerkki
      return (
        <Text onPress={() => checkAnswer("equationi")} style={styles.options}>
          {equationOperand1} <Text>{isEquationAddition ? '+' : '-'}</Text> {equationOperand2}
        </Text>
      );
    } else { // Jos vertailtava ei ole yhtälöä, palautetaan satunnaisluku
      return (
        <Text onPress={() => checkAnswer("randomnumberi")} style={styles.options}>
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
      <Text onPress={() => checkAnswer("equali")} style={styles.options} >=</Text>
      {renderComparable(2)}
      <Button title="Palaa takaisin" onPress={onBack} />
      <ModalComponent 
        isVisible={modalVisible}
        taskScore={points}
        onBack={handleBack}
      />
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