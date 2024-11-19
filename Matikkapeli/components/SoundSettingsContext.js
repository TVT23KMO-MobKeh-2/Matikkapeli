import React, { createContext, useContext, useState } from 'react';

const SoundSettingsContext = createContext();

export const SoundSettingsProvider = ({ children }) => {
  const [gameSounds, setGameSounds] = useState(true);

  return (
    <SoundSettingsContext.Provider value={{ gameSounds, setGameSounds }}>
      {children}
    </SoundSettingsContext.Provider>
  );
};

export const useSoundSettings = () => useContext(SoundSettingsContext);
