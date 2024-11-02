import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';

export default function ImageToNumber({ onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kuvat numeroiksi</Text>
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
  },
});
