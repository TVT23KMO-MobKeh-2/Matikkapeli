import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Svg, { Line } from 'react-native-svg';

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Bonds({ onBack }) {

  const levelData = 2;
  const leftBox = random(0, levelData)
  const rightBox = levelData - leftBox
  const [witchBox, setwitchBox] = useState(random(0, 1))
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.taskbox}>
        <Text style={styles.title}>Hajonta</Text>
        <View style={styles.buttonContainer}>
          <Button title="Palaa takaisin" onPress={onBack} />
        </View>
      </View>
      <View style={styles.circle}>
        <Text style={styles.circletext}>{levelData}</Text>
      </View>

      <Svg height="300" width="300" style={styles.lineContainer}>
        <Line x1="150" y1="160" x2="70" y2="230" stroke="black" strokeWidth="5" />
        <Line x1="150" y1="160" x2="230" y2="230" stroke="black" strokeWidth="5" />
      </Svg>

      <View style={styles.numbers}>
        <View style={styles.number1}>
          {
            witchBox === 0 ? (
              <TextInput
              style={styles.input} 
              value={inputValue1}
              onChange={setInputValue1}
              keyboardType='numeric'
              autoFocus={true}/>
            ) :(
              <Text style={styles.numbertext}>{leftBox}</Text>
            )
          }
        </View>
        <View style={styles.number2}>
        {
            witchBox === 1 ? (
              <TextInput
              style={styles.input} 
              value={inputValue2}
              onChange={setInputValue2}
              keyboardType='numeric'
              autoFocus={true}/>
            ) :(
              <Text style={styles.numbertext}>{rightBox}</Text>
            )
          }
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  taskbox: {
    backgroundColor: 'yellow',
    zIndex: 4,
  },
  title: {
    fontSize: 24,
    margin: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    zIndex: 2,
  },

  circletext: {
    fontSize: 40,
    borderColor: 'black',
  },

  numbers: {
    flexDirection: 'row',
    fontSize: 40,
    margin: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    width: '80%',
    zIndex: 3,
  },
  number1: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,

  },
  number2: {
    width: 100,
    height: 100,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },

  numbertext: {
    fontSize: 40,

  },
  input: {
    fontSize: 40,
  },

});