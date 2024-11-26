import React, { createContext, useContext, useState } from 'react';
import { Audio } from 'expo-av';

const SoundSettingsContext = createContext();

export const SoundSettingsProvider = ({ children }) => {
  const [gameSounds, setGameSounds] = useState(true);
  const [volume, setVolume] = useState(1.0); //Default volume

  //playSound-funktio siirretty tähän tiedostoon
  const playSound = async (isCorrect) => {
    if (!gameSounds) return; //Ääniä ei toisteta, jos ne on pois päältä

    const soundUri = isCorrect
      ? require('../assets/sounds/mixkit-achievement-bell.wav')
      : require('../assets/sounds/mixkit-losing-bleeps.wav');

    const { sound } = await Audio.Sound.createAsync(soundUri);
    await sound.playAsync();
    await sound.setVolumeAsync(volume);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  return (
    <SoundSettingsContext.Provider value={{ gameSounds, setGameSounds, volume, setVolume, playSound }}>
      {children}
    </SoundSettingsContext.Provider>
  );
};

export const useSoundSettings = () => useContext(SoundSettingsContext);
