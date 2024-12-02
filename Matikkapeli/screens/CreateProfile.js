import { View, Text, StyleSheet, Button, TextInput, Image, ImageBackground, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


export default function CreateProfile({ onCancel, onSave, email }) {
    const [selectedCareer, setSelectedCareer] = useState();
    const [selectedAnimal, setSelectedAnimal] = useState();
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? dark : light; 
    const styles = createStyles(theme);  
    const bgIndex = 0;

    const handleSave = async () => {
      if (!name || !selectedCareer || !selectedAnimal) {
        alert('Täytä kaikki kentät!');
        return;
      }

      setIsSaving(true);

      const newProfile = {
        email, // Email passed from SelectProfile
        playerName: name,
        playerLevel: 1,
        imageToNumberXp: 0,
        soundToNumberXp: 0,
        comparisonXp: 0,
        bondsXp: 0,
        imageID: selectedAnimal.value,
        career: selectedCareer.label,
      };

      try {
        await onSave(newProfile);  // This will save the profile in the database
        onCancel();  // Close the CreateProfile screen
      } catch (error) {
        console.error('Virhe profiilin tallennuksessa:', error);
        alert('Profiilin tallenus epäonnistui');
      } finally {
        setIsSaving(false);
      }
    };

    const careerOptions = [
        { label: 'Lääkäri', value: "doctor" },
        { label: 'Automekaanikko', value: "mechanic" },
        { label: 'Rakentaja', value: "builder" },
        { label: 'Kauppias', value: "vendor" },
        { label: 'Ohjelmoija', value: "programmer" },
        { label: 'Opettaja', value: "teacher" },
    ]

    const animalOptions = [
        { label: 'Kettu', value: 'fox', image: require('../assets/proffox.png') },
        { label: 'Karhu', value: 'bear', image: require('../assets/profbear.png') },
        { label: 'Pupu', value: 'rabbit', image: require('../assets/profrabbit.png') },
        { label: 'Susi', value: 'wolf', image: require('../assets/profwolf.png') },
    ]


    return (
        <ImageBackground 
        source={getBGImage(isDarkTheme, bgIndex)} 
        style={styles.background} 
        resizeMode="cover"
        >
        <View style={styles.optionsContainer}>
            {selectedAnimal && (
                    <View style={styles.imageContainer}>
                        <Image source={selectedAnimal.image} style={styles.image} />
                    </View>
                )}
            <TextInput
                style={styles.input}
                placeholder='Kirjoita nimesi'
                value={name}
                onChangeText={(text) => setName(text)}
                backgroundColor="white" />
            
            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedAnimal}
                        onValueChange={(itemValue) => setSelectedAnimal(itemValue)}
                    >
                        <Picker.Item label='Valitse eläin' value=""/>
                        {animalOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={selectedCareer}
                        onValueChange={(itemValue) => setSelectedCareer(itemValue)}
                    >
                        <Picker.Item label='Valitse ammatti' value="" />
                        {careerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                            <Pressable onPress={handleSave} disabled={isSaving || !name || !selectedCareer || !selectedAnimal}
                                style={[styles.startButton, { backgroundColor: 'lightblue' }]}>
                                <Text style={styles.buttonText}>{isSaving ? 'Tallennetaan...' : 'Tallenna'}</Text>
                            </Pressable>
                            <Pressable onPress={onCancel}
                                style={[styles.startButton, { backgroundColor: 'red' }]}>
                                <Text style={styles.buttonText}>Peruuta</Text>
                            </Pressable>
                        </View>
        </View>
        </ImageBackground>
    );
}
