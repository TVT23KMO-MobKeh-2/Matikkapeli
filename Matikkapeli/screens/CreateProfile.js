import { View, Text, StyleSheet, Button, TextInput, Image, ImageBackground, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { getBGImage } from '../components/backgrounds';


export default function CreateProfile({ onCancel, onSave, email, password }) {
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
        password: password || '', 
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
        { label: 'LÄÄKÄRI', value: "doctor" },
        { label: 'AUTOMEKAANIKKO', value: "mechanic" },
        { label: 'RAKENTAJA', value: "builder" },
        { label: 'KAUPPIAS', value: "vendor" },
        { label: 'OHJELMOIJA', value: "programmer" },
        { label: 'OPETTAJA', value: "teacher" },
    ]

    const animalOptions = [
        { label: 'KETTU', value: 'fox', image: require('../assets/proffox.png') },
        { label: 'KARHU', value: 'bear', image: require('../assets/profbear.png') },
        { label: 'PUPU', value: 'rabbit', image: require('../assets/profrabbit.png') },
        { label: 'SUSI', value: 'wolf', image: require('../assets/profwolf.png') },
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
                placeholder='KIRJOITA NIMESI'
                value={name}
                onChangeText={(text) => setName(text)}
                backgroundColor="white" />
            
            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedAnimal}
                        onValueChange={(itemValue) => setSelectedAnimal(itemValue)}
                    >
                        <Picker.Item label='VALITSE ELÄIN' value=""/>
                        {animalOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={selectedCareer}
                        onValueChange={(itemValue) => setSelectedCareer(itemValue)}
                    >
                        <Picker.Item label='VALITSE AMMATTI' value="" />
                        {careerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                            <Pressable onPress={handleSave} disabled={isSaving || !name || !selectedCareer || !selectedAnimal}
                                style={[styles.startButton, { backgroundColor: 'lightblue' }]}>
                                <Text style={styles.buttonText}>{isSaving ? 'TALLENNETAAN...' : 'TALLENNA'}</Text>
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
