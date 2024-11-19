import { View, Text, Button, Image } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles'

export default function ProfileScreen({ onBack }) {
    const profileFoxImage = require('../assets/proffox.png')
    const [name] = useState('Tunski')

    return (
        <View style={styles.container}>
            <View style={styles.profilebox}>
                <Image
                    source={profileFoxImage}
                    style={styles.profileImage}
                />
                <View>
                 <Text>{name}</Text>   
                 <Text>ProfileScreen</Text>  
                </View>
                
  
            </View>
            <Button title="Palaa takaisin" onPress={onBack} />
        </View>
    )
}