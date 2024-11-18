import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import styles from '../styles';

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
      <View style={styles.buttonContainer}>
      <Button onPress={() => onNavigate('Animation')} title='Animaatio' />
      </View>
      <View style={styles.buttonContainer}>
      <Button onPress={() => onNavigate('Profile')} title='Profiili' />
      </View>
    </View>
  );
}
