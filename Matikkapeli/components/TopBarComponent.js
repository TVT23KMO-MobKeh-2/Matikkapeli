import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { ScoreContext } from "./ScoreContext";
import Timer from "./Timer";
import { TimerContext } from "./TimerProvider";

import { Ionicons } from "@expo/vector-icons";  // Make sure this is imported
import { useNavigation } from '@react-navigation/native';
import { useTaskSyllabification } from "./TaskSyllabificationContext"

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';


const TopBarComponent = ({ customStyle }) => {
  const navigation = useNavigation();  // Use navigation hook to navigate

  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);

  const { syllabify } = useTaskSyllabification()

  // Function to handle the settings button press
  const handleSettingsPress = () => {
    console.log('Settings button pressed');
    navigation.navigate('Settings');  // Navigate to Settings screen
  };

  const { timeLeft, isTimerActive, stopTimer } = useContext(TimerContext);

  const { imageID, playerName, career, playerLevel } = useContext(ScoreContext);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [stopTimerModalVisible, setStopTimerModalVisible] = useState(false);

  //const navigation = useNavigation();

  const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
  };
  const profileImage = animalImages[imageID];


  const handlePfpPress = () => {
    console.log('Profile image pressed');
    navigation.navigate('ProfileScreen');
  };

  const openTimerModal = () => {
    setTimerModalVisible(true);
    console.log('Timer button pressed');
  };

  const closeTimerModal = () => {
    setTimerModalVisible(false);
    setTimerStarted(false);
    console.log('Timer modal closed');
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.topBarContainer}>

      {playerName && (
        <TouchableOpacity onPress={handlePfpPress}>
          <Image
            source={profileImage}
            style={styles.topBarPfp}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* User Info */}
      {playerName && career && playerLevel ? (
        <View style={styles.topBarInfoContainer}>
          <Text style={styles.topBarUsername}> {playerName} </Text>
          <Text style={styles.topBarLevelAndPoints}>
            Taso {playerLevel} | {career}
          </Text>
        </View>
      ) : (
        <View style={styles.topBarInfoContainer}>
        </View>
      )}

      {/* Timer Button */}
      {!isTimerActive && (
        <TouchableOpacity onPress={openTimerModal} style={[styles.settingsButton, { width: 40 }]}>
          <Text style={styles.topBarLevelAndPoints}>⏰</Text>
        </TouchableOpacity>
      )}

      {isTimerActive && (
        <TouchableOpacity onPress={() => setStopTimerModalVisible(true)}>
          <Text style={styles.topBarUsername}>{formatTime(timeLeft)}</Text>
        </TouchableOpacity>
        
      )}

<Modal
    transparent={true}
    visible={stopTimerModalVisible}
    animationType="fade"
    onRequestClose={() => setStopTimerModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>
          {syllabify("Oletko varma, että haluat pysäyttää ajastimen?")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            stopTimer();
            setStopTimerModalVisible(false);
          }}
          style={styles.modalButton}
        >
          <Text style={styles.modalButtonText}>{syllabify("Kyllä, pysäytä")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStopTimerModalVisible(false)}
          style={styles.modalButton}
        >
          <Text style={styles.modalButtonText}>{syllabify("Ei, jatka")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
      {/* Timer Modal */}

      {timerModalVisible && (
        <Timer
          closeModal={closeTimerModal}
          onTimerStart={() => setTimerStarted(true)} // Set timer as started
          onTimerEnd={() => setTimerStarted(false)} // Reset timer state when it ends
        />
      )}
      
      {/* Settings Button */}
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={32} color={isDarkTheme ? "white" : "black"} />
      </TouchableOpacity>

    </View>
  );
};
export default TopBarComponent;
