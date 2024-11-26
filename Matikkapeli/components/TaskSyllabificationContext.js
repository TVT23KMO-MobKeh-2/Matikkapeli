import React, { createContext, useContext, useState } from "react";

// Tavutuksen konteksti
const TaskSyllabificationContext = createContext();

export function TaskSyllabificationProvider({ children }) {
  const [taskSyllabification, setTaskSyllabification] = useState(true);

  // Kovakoodatut tavutukset
  const syllabify = (text) => {
    const syllables = {
      // ImageToNumber.js
      "Kuva numeroiksi": "KU-VA NU-ME-ROIK-SI",
      "Montako vasaraa näet näytöllä?": "MON-TA-KO VA-SA-RAA NÄ-ET NÄY-TÖL-LÄ?",

      // Comparison.js
      "Vertailu": "VER-TAI-LU",
      "Valitse yhtäsuuri tai suurempi": "VA-LIT-SE YH-TÄ-SUU-RI TAI SUU-REM-PI",
      "Valitse yhtäsuuri tai pienempi": "VA-LIT-SE YH-TÄ-SUU-RI TAI PIE-NEM-PI",

      // SoundToNumber.js
      "Ääni numeroiksi": "ÄÄ-NI NU-ME-ROIK-SI",
      "Kuuntele numero 🔊": "KUUN-TE-LE NU-ME-RO 🔊",


      // Bonds.js
      "Hajonta": "HA-JON-TA",
      "Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku.":
      "TÄY-DEN-NÄ PUUT-TU-VA LU-KU NÄIN, ET-TÄ LAA-TIKOIDEN LU-VUT O-VAT YH-TEENSÄ YH-TÄ PAL-JON KUIN PAL-LON LU-KU.",
      "Aloita": "A-LOI-TA",
      "Täydennä puuttuva luku.": "TÄY-DEN-NÄ PUUT-TU-VA LU-KU.",
      "Tarkista": "TAR-KIS-TA",
    };
  
    // Jos tavutustoiminto ei ole käytössä, palautetaan alkuperäinen teksti
    if (!taskSyllabification) {
      return text;
    }
  
    // Palautetaan tavutettu teksti, jos löytyy määritelty tekstikohde, muuten alkuperäinen
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
