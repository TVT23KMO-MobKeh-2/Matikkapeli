import { View, Text, StyleSheet, Button, TextInput,Image } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { savePlayerStatsToDatabase } from '../firebase/Functions'

export default function CreateProfile({ onCancel, onSave }) {
    const [selectedCareer, setSelectedCareer] = useState()
    const [selectedAnimal, setSelectedAnimal] = useState()
    const [name, setName] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (!name || !selectedCareer || !selectedAnimal) {
            alert('Täytä kaikki kentät!')
            return
        }

        if(isSaving) return

        setIsSaving(true)
        const newProfile = {
            email: "minna@testi.com",
            playerName: name,
            playerLevel: 1,
            imageToNumberXp: 0,
            soundToNumberXp: 0,
            comparisonXp: 0,
            bondsXp: 0,
            imageID: selectedAnimal.value,
            career: selectedCareer.value,
        }

        try {
            await savePlayerStatsToDatabase(newProfile)
            onSave(newProfile)
        } catch (error) {
            console.error("Virhe profiilin tallennuksessa:", error)
            alert('Profiilin tallenus epäonnistui')
        } finally {
            setIsSaving(false)
        }
        
    }

    const careerOptions = [
        {label:'Lääkäri', value: "doctor" },
        {label:'Automekaanikko', value: "mechanic" },
        {label:'Rakentaja', value: "builder" },
        {label:'Kauppias', value: "vendor" },
        {label:'Ohjelmoija', value: "programmer" },
        {label:'Opettaja', value: "teacher" },
    ]

    const animalOptions = [
        {label: 'Kettu', value: 'fox', image: require('../assets/proffox.png')},
        {label: 'Karhu', value: 'bear', image: require('../assets/profbear.png')},
        {label: 'Pupu', value: 'rabbit', image: require('../assets/profrabbit.png')},
        {label: 'Susi', value: 'wolf', image: require('../assets/profwolf.png')},
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nimi</Text>
            <TextInput
                style={styles.input}
                placeholder='Kirjoita nimesi'
                value={name}
                onChangeText={(text) => setName(text)}></TextInput>
            <Text style={styles.label}>Valitse eläin</Text>
            <Picker
                selectedValue={selectedAnimal}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedAnimal(itemValue)}
                >
                <Picker.Item label='Valitse eläin' value="" />
                {animalOptions.map ((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option}/>
                ))}
            </Picker>
            {selectedAnimal && (
                <View style={styles.imageContainer}>
                    <Image source={selectedAnimal.image} style={styles.image}/>
                </View>
            )}

            <Text style={styles.label}>Ammatti</Text>
            <Picker
                selectedValue={selectedCareer}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCareer(itemValue)}
                >
                <Picker.Item label='Valitse ammatti' value="" />
                {careerOptions.map ((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option}/>
                ))}
            </Picker>


            <View style={styles.buttonContainer}>
                <Button title={isSaving ? 'Tallennetaan...' : 'Tallenna'} onPress={handleSave} disabled={isSaving}/>
                <Button title='Peruuta' onPress={onCancel} color='red'/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: 300,
        padding: 20,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start'
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    picker: {
        width: '100%',
        height: 40,
        marginTop: 10.
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }

})