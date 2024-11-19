import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import styles from "../styles";

const Timer = ({ closeModal, onTimerStart, onTimerEnd }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeSelectionModalVisible, setTimeSelectionModalVisible] = useState(true);
  const [stopTimerModalVisible, setStopTimerModalVisible] = useState(false);

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
    <View style={styles.container}>
      {/* Timer valinta modal */}
      <Modal
        transparent={true}
        visible={timeSelectionModalVisible}
        animationType="fade"
        onRequestClose={closeTimerSelectionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Valitse aika:</Text>
            <Button title="1 minuutti" onPress={() => startTimer(1)} />
            <Button title="2 minuuttia" onPress={() => startTimer(2)} />
            <Button title="15 minuuttia" onPress={() => startTimer(15)} />
            <Button title="30 minuuttia" onPress={() => startTimer(30)} />
            <Button title="45 minuuttia" onPress={() => startTimer(45)} />
            <Button title="60 minuuttia" onPress={() => startTimer(60)} />
            <Button title="Sulje" onPress={() => { closeTimerSelectionModal(); closeModal(); }} />
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
            <Text style={styles.modalText}>Oletko varma, että haluat pysäyttää ajastimen?</Text>
            <Button title="Kyllä, pysäytä" onPress={() => { stopTimer(); closeModal(); }} />
            <Button title="Ei, jatka" onPress={closeStopTimerModal} />
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
              Olet pelannut {selectedTime} minuuttia. Olisiko aika tauolle?
            </Text>
            <Button title="Sulje" onPress={handleClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Timer;
