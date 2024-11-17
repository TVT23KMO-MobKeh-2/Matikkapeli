import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { ScoreContext } from "./ScoreContext"; 
import styles from "../styles";
//import { Settings } from "../screens/Settings"; 
//import { UserContext } from "./UserContext"; // Esimerkki käyttäjänimen ja profiilikuvan hakemisesta

const TopBarComponent = ({ customStyle }) => {
  const { playerLevel, points, totalXp } = useContext(ScoreContext); // Gettaa pelaajan levelin, pisteet ja kokonais Xp:n
  //const { profileImage, username } = useContext(UserContext);  esimerkki käyttäjän profiilikuvan ja käyttäjänimen hakemisesta
  //Kovakoodattu profiilikuvan ja käyttäjänimen esimerkki
  const TemporaryProfileImage = require('../assets/favicon.png'); 
  const TemporaryUsername = "Testi";
  const TemporarySettings = require('../assets/icon.png');

  const handleSettingsPress = () => {
    console.log('Settings button pressed');
  };

  const handlePfpPress = () => {
    console.log('Profile image pressed');
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
     {/* Settings Button */}
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
        <Image source={TemporarySettings} style={styles.settingsIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default TopBarComponent;
