import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

//Konteksti
const BackgroundMusicContext = createContext();

export const BackgroundMusicProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
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

  //Äänenvoimakkuuden päivitys
  const setSmoothVolume = async (targetVolume) => {
    if (!sound) return;

    const { volume: currentVolume } = await sound.getStatusAsync();
    if (Math.abs(currentVolume - targetVolume) > 0.01) { //Vältetään turhia päivityksiä
      await sound.setVolumeAsync(targetVolume);
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

  //Äänenvoimakkuuden säätäminen liu'utettaessa
  const handleVolumeChange = (value) => {
    setMusicVolume(value);
    setSmoothVolume(value); //Päivitetään äänenvoimakkuus reaaliaikaisesti liu'utettaessa
  };

  //Kutsutaan, kun liu'utus on valmis
  const handleSlidingComplete = (value) => {
    setMusicVolume(value);
    setSmoothVolume(value); //Tallenetaan äänenvoimakkuus
  };

  //Puretaan äänitiedoston resurssit, kun komponentti poistetaan
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
        handleVolumeChange, //Palautetaan handleVolumeChange
        handleSlidingComplete, //Palautetaan handleSlidingComplete
      }}
    >
      {children}
    </BackgroundMusicContext.Provider>
  );
};

export const useBackgroundMusic = () => useContext(BackgroundMusicContext);
