import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';

export default function StartScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valitse tehtävä:</Text>
      <View style={styles.buttonContainer}>
      <Button onPress={() => onNavigate('ImageToNumbers')} title='Kuvat numeroiksi' style={{padding: 20}} />
      </View>
      <View style={styles.buttonContainer}>
      <Button onPress={() => onNavigate('SoundToNumbers')} title='Ääni numeroiksi' />
      </View>
      <View style={styles.buttonContainer}>
      <Button onPress={() => onNavigate('ComparisonOperators')} title='Vertailu' />
      </View>
      <View style={styles.buttonContainer}>
      <Button onPress={() => onNavigate('NumberBonds')} title='Hajonta' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10, // space between buttons
    width: '80%', // set button width
  },
});
