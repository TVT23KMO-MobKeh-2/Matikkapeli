import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";

import createStyles from "../styles";
import { useTheme } from '../components/ThemeContext';
import { light, dark } from '../assets/themeColors'; 
import { useTaskSyllabification } from "./TaskSyllabificationContext"

import { TimerContext } from "./TimerProvider";

const Timer = ({ closeModal }) => {
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? light : dark;
  const styles = createStyles(theme);

  const { startTimer, stopTimer } = useContext(TimerContext);

  const handleStartTimer = (minutes) => {
    startTimer(minutes);
    closeModal();
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Valitse aika:</Text>
          <TouchableOpacity onPress={() => handleStartTimer(2)}>
            <Text style={styles.modalButton}>2 Minuuttia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStartTimer(5)}>
            <Text style={styles.modalButton}>5 Minuuttia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStartTimer(15)}>
            <Text style={styles.modalButton}>15 Minuuttia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStartTimer(30)}>
            <Text style={styles.modalButton}>30 Minuuttia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStartTimer(45)}>
            <Text style={styles.modalButton}>45 Minuuttia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStartTimer(60)}>
            <Text style={styles.modalButton}>60 Minuuttia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => closeModal()}>
            <Text style={styles.modalButton}>Sulje</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Timer;