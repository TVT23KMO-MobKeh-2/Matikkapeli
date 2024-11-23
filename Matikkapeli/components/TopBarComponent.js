import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal} from "react-native";
import { ScoreContext }  from "./ScoreContext"; 
import styles from "../styles";
import Timer from "./Timer";
import ProfileScreen from "../screens/ProfileScreen";
import { useNavigation } from '@react-navigation/native';
import SelectProfile from "../screens/SelectProfile";

const TopBarComponent = ({ customStyle }) => {
  const { imageID, playerName, career, playerLevel } = useContext(ScoreContext);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  //const navigation = useNavigation();
  
const animalImages = {
    fox: require('../assets/proffox.png'),
    bear: require('../assets/profbear.png'),
    rabbit: require('../assets/profrabbit.png'),
    wolf: require('../assets/profwolf.png'),
};
const profileImage = animalImages[imageID];
const [selectedTask, setSelectedTask] = useState(null);

  const handlePfpPress = () => {
    console.log('Profile image pressed');
   // navigation.navigate('ProfileScreen');
    //<ProfileScreen onBack={() => setSelectedTask(null)} />;

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
          source={profileImage}
          style={styles.topBarPfp}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Käyttäjäinfo */}
      <View style={styles.topBarInfoContainer}>
        <Text style={styles.topBarUsername}> {playerName} </Text> 
        <Text style={styles.topBarLevelAndPoints}>
          Taso {playerLevel} | {career}
        </Text>
      </View>
      
      {/* Timeri */}
      <TouchableOpacity onPress={openTimerModal} 
        style={[styles.settingsButton, {width: 40}]}>
        {!timerStarted && <Text style={styles.topBarLevelAndPoints}>⏰</Text>}
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
