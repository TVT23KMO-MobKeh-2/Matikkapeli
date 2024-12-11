import React, { createContext, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors';
import { useTaskSyllabification } from "./TaskSyllabificationContext"

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {

  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light;
  const styles = createStyles(theme);

  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const { syllabify } = useTaskSyllabification() // Uusi tila modaalille

  const timeOptions = {
      2: "kaksi minuuttia",
      5: "viisi minuuttia",
      15: "viisitoista minuuttia",
      30: "kolmekymmentä minuuttia",
      45: "neljäkymmentäviisi minuuttia",
      60: "kuusikymmentä minuuttia"

  }

  useEffect(() => {
    let timerInterval;
    if (isTimerActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      clearInterval(timerInterval);
      setIsTimerActive(false);
      setTimeLeft(null); // Nollaa aika

      // Näytä modaalin viesti ja puhesynteesi
      setIsModalVisible(true);
      Speech.speak(`Olet pelannut ${timeOptions[selectedTime]}. Olisiko aika tauolle?`);
    }



    return () => clearInterval(timerInterval); // Siivous
  }, [isTimerActive, timeLeft]);

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setSelectedTime(minutes);
    setIsTimerActive(true);
    setIsModalVisible(false); // Piilota mahdollinen vanha modal
  };

  const stopTimer = () => {
    setTimeLeft(null);
    setIsTimerActive(false);
    setSelectedTime(null);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        isTimerActive,
        startTimer,
        stopTimer,
      }}
    >
      {children}
      {/* Lisää modaalikomponentti */}
      <View>
      {isModalVisible && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
        >
          <View
           style={styles.modalOverlay}
          >
            <View
            style={styles.modalContent}
            >
              <Text
                style={styles.modalText}
              >
                {syllabify("Olet pelannut ")}{selectedTime}{syllabify(" minuuttia. Olisiko aika tauolle?")}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={styles.modalButton}>Sulje</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      </View>
    </TimerContext.Provider>
  );
};
