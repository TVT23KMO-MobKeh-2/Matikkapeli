import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { ScoreContext } from "./ScoreContext"; 
import styles from "../styles";
import Timer from "./Timer";
import { Ionicons } from "@expo/vector-icons";  // Make sure this is imported
import { useNavigation } from '@react-navigation/native';

const TopBarComponent = ({ customStyle }) => {
  const { playerLevel, playerName, totalXp } = useContext(ScoreContext); // Get the player level, points, and totalXp
  
  // Temporary values for profile image, username, and settings icon
  const TemporaryProfileImage = require('../assets/favicon.png'); 
  const TemporaryUsername = playerName;
  const TemporarySettings = require('../assets/icon.png');
  
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const navigation = useNavigation();  // Use navigation hook to navigate

  // Function to handle the settings button press
  const handleSettingsPress = () => {
    console.log('Settings button pressed');
    navigation.navigate('Settings');  // Navigate to Settings screen
  };

  const handlePfpPress = () => {
    console.log('Profile image pressed');
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

  return (
    <View style={[styles.topBarContainer, customStyle]}>
      
      {/* Profile Image */}
      <TouchableOpacity onPress={handlePfpPress}>
        <Image
          source={TemporaryProfileImage}
          style={styles.topBarPfp}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.topBarInfoContainer}>
        <Text style={styles.topBarUsername}> {TemporaryUsername} </Text> 
        <Text style={styles.topBarLevelAndPoints}>
          Taso {playerLevel} | {totalXp} Kokonaispisteet
        </Text>
      </View>
      
      {/* Timer Button */}
      <TouchableOpacity onPress={openTimerModal} 
        style={[styles.settingsButton, { width: 40 }]}>
        {!timerStarted && <Text style={styles.topBarLevelAndPoints}>⏰</Text>}
      </TouchableOpacity>

      {/* Settings Button */}
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={32} color="black" />
      </TouchableOpacity>
      
      {/* Timer Modal */}
      {timerModalVisible && (
        <Timer
          closeModal={closeTimerModal}
          onTimerStart={() => setTimerStarted(true)}
          onTimerEnd={() => setTimerStarted(false)}
        />
      )}
    </View>
  );
};

export default TopBarComponent;
