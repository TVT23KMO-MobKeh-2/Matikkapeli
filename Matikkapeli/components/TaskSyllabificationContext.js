import React, { createContext, useContext, useState } from "react";

//Tavutuksen konteksti
const TaskSyllabificationContext = createContext();

export function TaskSyllabificationProvider({ children }) {
  const [taskSyllabification, setTaskSyllabification] = useState(true);

  //Kovakoodattu tavutus
  const syllabify = (text) => {
    const syllables = {
      "Montako vasaraa näet näytöllä?": "Mon-ta-ko va-sa-raa nä-et näy-töl-lä?",
    };

    //Palautetaan tavutettu teksti, jos löytyy määritelty tekstikohde, muuten alkuperäinen
    return syllables[text] || text;
  };

  return (
    <TaskSyllabificationContext.Provider
      value={{ taskSyllabification, setTaskSyllabification, syllabify }}
    >
      {children}
    </TaskSyllabificationContext.Provider>
  );
}

export function useTaskSyllabification() {
  return useContext(TaskSyllabificationContext);
}
