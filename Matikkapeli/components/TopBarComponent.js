import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal} from "react-native";
import { ScoreContext }  from "./ScoreContext"; 
import styles from "../styles";
import Timer from "./Timer";
//import Settings from "../screens/Settings"; 
//import { UserContext } from "./UserContext"; // Esimerkki käyttäjänimen ja profiilikuvan hakemisesta

const TopBarComponent = ({ customStyle }) => {
  const { playerLevel, points, totalXp } = useContext(ScoreContext); // Gettaa pelaajan levelin, pisteet ja kokonais Xp:n
  //const { profileImage, username } = useContext(UserContext);  esimerkki käyttäjän profiilikuvan ja käyttäjänimen hakemisesta
  //Kovakoodattu profiilikuvan ja käyttäjänimen esimerkki
  const TemporaryProfileImage = require('../assets/favicon.png'); 
  const TemporaryUsername = "Testi";
  const TemporarySettings = require('../assets/icon.png');
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const handleSettingsPress = () => {
    console.log('Settings button pressed');
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
      
      {/* Profiilikuva */}
      <TouchableOpacity onPress={handlePfpPress}>
        <Image
          source={TemporaryProfileImage}
          style={styles.topBarPfp}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Käyttäjäinfo */}
      <View style={styles.topBarInfoContainer}>
        <Text style={styles.topBarUsername}> {TemporaryUsername} </Text> 
        <Text style={styles.topBarLevelAndPoints}>
          Taso {playerLevel} | {totalXp} Kokonaispisteet
        </Text>
      </View>
      
      {/* Timeri */}
      <TouchableOpacity onPress={openTimerModal} 
        style={[styles.settingsButton, {width: 40}]}>
        {!timerStarted && <Text style={styles.topBarLevelAndPoints}>⏰</Text>}
      </TouchableOpacity>

      {/* Asetukset */}
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
        <Image source={TemporarySettings} style={styles.settingsIcon} />
      </TouchableOpacity>
      
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
