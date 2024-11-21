import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

//Konteksti
const BackgroundMusicContext = createContext();

export const BackgroundMusicProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sound, setSound] = useState(null);

  //Lataa ja käynnistä musiikki tarvittaessa
  const loadAndPlayMusic = async () => {
    if (!sound) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/mixkit-a-happy-child.mp3'),
          { isLooping: true, volume: musicVolume }
        );
        setSound(newSound);
        if (isMusicPlaying) {
          await newSound.playAsync();
        }
      } catch (error) {
        console.error('Taustamusiikin lataaminen epäonnistui:', error);
      }
    } else if (isMusicPlaying) {
      await sound.playAsync();
    }
  };

  //Lopeta musiikki
  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  //Lataa musiikki aina, kun tila muuttuu
  useEffect(() => {
    if (isMusicPlaying) {
      loadAndPlayMusic();
    } else {
      stopMusic();
    }
  }, [isMusicPlaying]);

  //Päivitä äänenvoimakkuus ilman että musiikki alkaa alusta
  useEffect(() => {
    if (sound) {
      sound
        .setVolumeAsync(musicVolume)
        .catch((error) => console.error('Äänenvoimakkuuden asettaminen epäonnistui:', error));
    }
  }, [musicVolume]);

  //Pura äänitiedoston resurssit, kun komponentti poistetaan
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <BackgroundMusicContext.Provider
      value={{
        isMusicPlaying,
        setIsMusicPlaying,
        musicVolume,
        setMusicVolume,
      }}
    >
      {children}
    </BackgroundMusicContext.Provider>
  );
};

export const useBackgroundMusic = () => useContext(BackgroundMusicContext);