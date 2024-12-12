import { View, Text, Button, Image, ImageBackground, Alert, Pressable, TouchableWithoutFeedback } from 'react-native'
import LevelBar from '../components/LevelBar'
import { useNavigation } from '@react-navigation/native';  // Import the hook
import { deletePlayerDataFromDatabase } from '../firebase/Functions';
import React, { useState, useContext } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScoreContext } from '../components/ScoreContext';
import { useTaskSyllabification } from '../components/TaskSyllabificationContext';
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { getBGImage } from '../components/backgrounds';


const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
};

export default function ProfileScreen() {
    
    const navigation = useNavigation();
    const [isDeleting, setIsDeleting] = useState(false);
    const { handleUpdatePlayerImageToDatabase, imageToNumberXp, soundToNumberXp, bondsXp, comparisonXp, playerLevel, playerName, email, imageID, setImageID, career} = useContext(ScoreContext);
    const [selectedImage, setSelectedImage] = useState(animalImages[imageID])
    const [showImageSelection, setShowImageSelection] = useState(false);

    const characterImage = animalImages[imageID];
    const { syllabify, taskSyllabification, getFeedbackMessage } = useTaskSyllabification();

    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? dark : light;
    const styles = createStyles(theme);
    const bgIndex = 0;

    const handleImageSelect = (image) => {
        //console.log('Selected Image:', image); 
        const newImageID = Object.keys(animalImages).find(key => animalImages[key] === image);
        //console.log('New image ID:', newImageID); // Debugging
        handleUpdatePlayerImageToDatabase(newImageID);
        setImageID(newImageID);
        //console.log('Closing the modal');
        setShowImageSelection(false);
    };

    const startGame = () => {
        //console.log('Navigating to Animation with profile:', playerName);
        navigation.navigate('Animation');  // Now works with the hook
    };

    const goBack = () => {
        navigation.navigate('SelectProfile', { email: email });  // Goes back to the previous screen
    };

    const clearProfile = async () => {
        try {
            await AsyncStorage.removeItem('playerName');
            await AsyncStorage.removeItem('imageID');

            setPlayerName('');
            setImageID('');
        } catch (e) {

        }
    }

    const handleDeleteProfile = async () => {
        setIsDeleting(true); // Set loading state
        try {
            //console.log('Deleting profile...');
            await deletePlayerDataFromDatabase({ email, playerName });
            clearProfile()
            Alert.alert('Poisto onnistui', 'Profiili poistettu onnistuneesti');
            //console.log('Profile deleted, navigating to SelectProfile');

            // Debugging Navigation
            //console.log('Navigating to SelectProfile with email:', email);
            navigation.navigate('SelectProfile', { email: email });
        } catch (error) {
            //console.error('Error deleting profile:', error);
            Alert.alert('Error', 'Failed to delete profile');
        } finally {
            //console.log('Resetting deleting state');
            setIsDeleting(false); // Reset loading state
        }
    };

    return (
        <ImageBackground
            source={getBGImage(isDarkTheme, bgIndex)}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={[styles.container, { paddingTop: 0 }]}>
                <View style={styles.profilebox}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={characterImage}
                            style={styles.profileImage}
                        />
                        <Pressable style={styles.changeProfileImage} onPress={() => setShowImageSelection(!showImageSelection)}>
                            <AntDesign style={styles.changeIcon} name="pluscircleo" size={30} color="white" />
                        </Pressable>
                    </View>

                    <View>
                        <Text style={styles.label}>{syllabify("Nimi")}: {playerName}</Text>
                        <Text style={styles.label}>{syllabify("Ammatti")}: {syllabify(career)}</Text>
                        <Text style={styles.label}>{syllabify("Taso")}: {playerLevel}</Text>
                    </View>
                </View>
                <View style={styles.profileSelect}>
                    <LevelBar progress={imageToNumberXp} label={syllabify("Montako")} playerLevel={playerLevel} gameType={"imageToNumber"} caller={"profile"} />
                    <LevelBar progress={soundToNumberXp} label={syllabify("Tunnista")} playerLevel={playerLevel} gameType={"soundToNumber"} caller={"profile"} />
                    <LevelBar progress={comparisonXp} label={syllabify("Vertailu")} playerLevel={playerLevel} gameType={"comparison"} caller={"profile"} />
                    <LevelBar progress={bondsXp} label={syllabify("Hajonta")} playerLevel={playerLevel} gameType={"bonds"} caller={"profile"} />
                </View>
                <View style={styles.buttonContainer1}>
                    <Pressable onPress={startGame}
                        style={[styles.startButton, styles.greenButton]}>
                            <Text style={styles.buttonText}>{syllabify("Aloita peli")}</Text>
                        <Ionicons name="game-controller" size={24} padding={4} color={isDarkTheme ? "white" : "black"} />
                    </Pressable>
                    <Pressable onPress={goBack}
                        style={[styles.startButton, styles.blueButton]}>
                        <Text style={styles.buttonText}>{syllabify("Takaisin")}</Text>
                        <Ionicons name="arrow-back-circle-outline" size={24} padding={4} color={isDarkTheme ? "white" : "black"} />
                    </Pressable>
                    <Pressable onPress={handleDeleteProfile}
                        disabled={isDeleting}
                        style={[styles.startButton, styles.redButton,
                        {
                            backgroundColor: isDeleting ? 'gray' : styles.redButton.backgroundColor,
                            opacity: isDeleting ? 0.6 : 1,
                        },
                        ]}>
                            {isDeleting ? 
                            <Text style={[styles.buttonText, { color: 'white' }]}>
                            {syllabify("Poistetaan...")}
                        </Text> : <Text style={[styles.buttonText, { color: 'white' }]}>
                        {syllabify("Poista")}
                        </Text>
                        }
                    <AntDesign name="delete" size={24} padding={4} color="white" />
                    </Pressable>
                </View>
                {showImageSelection && (
                   <View style={styles.imageSelectionContainer}>
                    {console.log('Rendering image selection modal')}
                   {Object.keys(animalImages).map((key) => (
                       <Pressable 
                           key={key} 
                           onPress={() => {
                               console.log('Image pressed:', animalImages[key]); // Debugging
                               handleImageSelect(animalImages[key]);
                           }}
                           style={{ zIndex: 1 }}
                       >
                           <Image source={animalImages[key]} style={styles.imageSelection} />
                       </Pressable>
                   ))}
               </View>
                )}
            </View>
        </ImageBackground>
    );
}
