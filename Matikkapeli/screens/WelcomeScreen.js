import { View, Text } from 'react-native'
import React from 'react'
import styles from '../styles'

export default function WelcomeScreen() {
  return (
    <View>
      <Text>WelcomeScreen</Text>
      <View style={styles.buttonContainer}>
                <Button title='Luo ensimmäinen profiili' />
                <Button title='Peruuta' />
            </View>
    </View>
  )
}