import { View, Text, Easing, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated from 'react-native-reanimated'

export default function LevelClock({progress, label}) {
    const [level, setLevel] = useState(0)
    const rotarion = React.useRef(new Animated.Value(0)).current

    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    useEffect (() => {
        Animated.timing(rotarion, {
            toValue: (level/ 10) * 360,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start()
    }, [level])

    useEffect(() => {
        setLevel(progress)
    }, [progress])

  return (
    <View style={styles.container}>
        <View style={clock}>
            {numbers.map((num, index) => {
                const angle = (index / numbers.length) * 360
                const rotateStyle = {
                    transform: [
                        { translateX: 100},
                        { rotate: '${angle}deg'},
                        { translateX: -100},
                    ]
                }
                return (
                    <Animated.Text key={index} style={[styles.number, rotateStyle]}>
                        {num}
                    </Animated.Text>
                )
            })}
            <Animated.View
            style={[styles.hand, {
                transform: [{ rotate: rotationHandlerName.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }],
            },
            ]}
            />
        </View>
      <Text style={styles.levelText}>{label}: {level}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    clock: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 5,
      borderColor: '#000',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    number: {
      position: 'absolute',
      fontSize: 18,
      fontWeight: 'bold',
    },
    hand: {
      position: 'absolute',
      width: 4,
      height: 90,
      backgroundColor: 'red',
      transformOrigin: '100% 100%',
      bottom: '50%',
    },
    levelText: {
      fontSize: 20,
      marginTop: 20,
      fontWeight: 'bold',
    },
    button: {
      fontSize: 18,
      color: 'blue',
      marginTop: 20,
    },
  });
  