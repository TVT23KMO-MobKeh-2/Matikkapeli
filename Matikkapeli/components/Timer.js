import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { useTaskSyllabification } from "./TaskSyllabificationContext"

const Timer = ({ closeModal, onTimerStart, onTimerEnd }) => {
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? dark : light; 
  const styles = createStyles(theme);  
 
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeSelectionModalVisible, setTimeSelectionModalVisible] = useState(true);
  const [stopTimerModalVisible, setStopTimerModalVisible] = useState(false);
  const { syllabify } = useTaskSyllabification()
  
  // Timer logiikka
  useEffect(() => {
    let timerInterval;
    if (isTimerActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      clearInterval(timerInterval);
      setIsTimerActive(false);
      Speech.speak(`Olet pelannut ${selectedTime} minuuttia. Olisiko aika tauolle?`);
      onTimerEnd(); // Kerrotaan top barille että aika on loppunut
    }

    return () => clearInterval(timerInterval); // Cleanup
  }, [isTimerActive, timeLeft]);

  const startTimer = (minutes) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60); 
    setIsTimerActive(true);
    setTimeSelectionModalVisible(false); //Piilota aikavalinta modal
    onTimerStart(); //Kerrotaan top barille että aika on alkanut
  };

  const stopTimer = () => {
    setIsTimerActive(false); 
    setTimeLeft(null); 
    setStopTimerModalVisible(false); 
    };

//Modalien hallinta handlerit
  const closeTimerSelectionModal = () => {
    setTimeSelectionModalVisible(false); 
  };
  const openStopTimerModal = () => {
    setStopTimerModalVisible(true); 
  };

  const closeStopTimerModal = () => {
    setStopTimerModalVisible(false);
  };

  const handleClose = () => {
    closeModal(); 
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View>
      {/* Timer valinta modal */}
      <Modal
        transparent={true}
        visible={timeSelectionModalVisible}
        animationType="fade"
        onRequestClose={closeTimerSelectionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{syllabify("Valitse aika:")}</Text>
            <TouchableOpacity onPress={() => startTimer(1)}>
              <Text style={styles.modalButton}>1 {syllabify("minuuttia")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTimer(2)}>
              <Text style={styles.modalButton}>2 {syllabify("minuuttia")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTimer(15)}>
              <Text style={styles.modalButton}>15 {syllabify("minuuttia")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTimer(30)}>
              <Text style={styles.modalButton}>30 {syllabify("minuuttia")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTimer(45)}>
              <Text style={styles.modalButton}>45 {syllabify("minuuttia")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTimer(60)}>
              <Text style={styles.modalButton}>60 {syllabify("minuuttia")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style= {[styles.startButton, styles.orangeButton]} onPress={closeTimerSelectionModal}>
              <Text style={styles.buttonText}>{syllabify("Sulje")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Näytetään aika countdown kun on aktiivinen */}
      {isTimerActive && (
        <TouchableOpacity onPress={openStopTimerModal}>
          <Text style={styles.topBarUsername}>{formatTime(timeLeft)}</Text>
        </TouchableOpacity>
      )}

      {/*Timerin lopetus valikko*/}
      <Modal
        transparent={true}
        visible={stopTimerModalVisible}
        animationType="fade"
        onRequestClose={closeStopTimerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{syllabify("Oletko varma, että haluat pysäyttää ajastimen?")}</Text>
            <TouchableOpacity onPress={() => { stopTimer(); closeModal(); }}>
              <Text style={styles.modalButton}>{syllabify("Kyllä, pysäytä")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeStopTimerModal}>
              <Text style={styles.modalButton}>{syllabify("Ei, jatka")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ajan loppumis alert modal */}
      <Modal
        transparent={true}
        visible={timeLeft === 0 && !isTimerActive} 
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
          {syllabify("Olet pelannut ")}{selectedTime}{syllabify(" minuuttia. Olisiko aika tauolle?")}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.modalButton}>{syllabify("Sulje")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Timer;
