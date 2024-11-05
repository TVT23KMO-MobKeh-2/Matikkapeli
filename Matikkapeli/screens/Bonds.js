import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import Svg, { Line } from 'react-native-svg';

export default function Bonds({ onBack }) {

  return (
    <View style={styles.container}>
      <View style={styles.taskbox}>
        <Text style={styles.title}>Hajonta</Text>
        <View style={styles.buttonContainer}>
          <Button title="Palaa takaisin" onPress={onBack} />
        </View>
      </View>
      <View style={styles.circle}>
        <Text style={styles.circletext}>1</Text>
      </View>
      
      <Svg height="300" width="300" style={styles.lineContainer}>
  {/* Line to first box */}
  <Line x1="150" y1="160" x2="70" y2="230" stroke="black" strokeWidth="5" />
  {/* Line to second box */}
  <Line x1="150" y1="160" x2="230" y2="230" stroke="black" strokeWidth="5" />
</Svg>
              
      <View style={styles.numbers}>
        <View style={styles.number1}>
          <Text style={styles.numbertext}>1</Text>
        </View>
        <View style={styles.number2}>
          <Text style={styles.numbertext}>2</Text>
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

  circletext:{
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

});