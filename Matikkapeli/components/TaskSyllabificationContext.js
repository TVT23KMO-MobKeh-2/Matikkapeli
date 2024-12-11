import React, { createContext, useContext, useEffect, useState } from "react";
import { useTaskReading } from "./TaskReadingContext";
import * as Speech from 'expo-speech';

// Tavutuksen konteksti
const TaskSyllabificationContext = createContext();

export function TaskSyllabificationProvider({ children }) {
  const [taskSyllabification, setTaskSyllabification] = useState(true);
  const { taskReading } = useTaskReading(); //Käytetään tehtävänlukukontekstia

  // Kovakoodatut tavutukset
  const syllabify = (text) => {
    const syllables = {

      //ProfileScreen.js
      "Aloita peli" : "A-LOI-TA PE-LI",
      "Takaisin": "TA-KAI-SIN",
      "Poista": "POIS-TA",
      
      // ImageToNumber.js
      "Kuva numeroiksi": "KU-VA NU-ME-ROIK-SI",
      "Montako esinettä näet näytöllä?": "MON-TA-KO E-SI-NET-TÄ NÄ-ET NÄY-TÖL-LÄ?",

      // Comparison.js
      "Vertailu": "VER-TAI-LU",
      "Valitse yhtäsuuri (=) tai suurempi luku": "VA-LIT-SE YH-TÄ-SUU-RI (=) TAI SUU-REM-PI LU-KU",
      "Valitse yhtäsuuri (=) tai pienempi luku": "VA-LIT-SE YH-TÄ-SUU-RI (=) TAI PIE-NEM-PI LU-KU",

      // SoundToNumber.js
      "Valitse oikea numero": "VA-LIT-SE OI-KE-A NU-ME-RO",
      "Ääni numeroiksi": "ÄÄ-NI NU-ME-ROIK-SI",
      "Kuuntele numero 🔊": "KUUN-TE-LE NU-ME-RO 🔊",

      // Bonds.js
      "Hajonta": "HA-JON-TA",
      "Täydennä puuttuva luku niin, että laatikoiden luvut ovat yhteensä yhtä paljon kuin pallon luku.":
        "TÄY-DEN-NÄ PUUT-TU-VA LU-KU NIIN, ET-TÄ LAA-TIKOIDEN LU-VUT O-VAT YH-TEENSÄ YH-TÄ PAL-JON KUIN PAL-LON LU-KU.",
      "Aloita": "A-LOI-TA",
      "Täydennä puuttuva luku.": "TÄY-DEN-NÄ PUUT-TU-VA LU-KU.",
      "Tarkista": "TAR-KIS-TA",
          
      // Settings.js
      "Asetukset":"A-SE-TUK-SET",
      "Tumman teeman valinta":"TUM-MAN TEE-MAN VA-LIN-TA",
      "Tavutus":"TA-VU-TUS",
      "Tehtävien lukeminen":"TEH-TÄ-VI-EN LU-KE-MI-NEN",
      "Taustamusiikki":"TAUS-TA-MU-SIIK-KI",
      "Taustamusiikin voimakkuus":"TAUS-TA-MU-SII-KIN VOI-MAK-KUUS",
      "Peliäänet":"PE-LI-ÄÄ-NET",
      "Sammuta":"SAM-MU-TA",
      
      // Timer.js
      "Valitse aika:":"VA-LIT-SE AI-KA",
      "minuuttia":"MI-NUUT-TI-A",
      "Sulje":"SUL-JE",
      "Oletko varma, että haluat pysäyttää ajastimen?":"O-LET-KO VAR-MA, ET-TÄ HA-LU-AT PY-SÄYT-TÄÄ A-JAS-TI-MEN?",
      "Kyllä, pysäytä":"",
      "Ei, jatka":"",
      "Olet pelannut ":"O-LET PE-LAN-NUT ",
      " minuuttia. Olisiko aika tauolle?":" MI-NUUT-TIA. O-LI-SI-KO AI-KA TAU-OL-LE?",
      "Sulje":"SUL-JE",
      
      //FeedBack
      "Pistetaulu":"PIS-TE-TAU-LU",
      "Taso":"TA-SO",
      "Kokonaispisteet":"KO-KO-NAIS-PIS-TEET",
      "Kuvat numeroiksi":"KU-VAT NU-ME-ROIK-SI",
      "Äänestä numeroiksi":"ÄÄ-NES-TÄ NU-ME-ROIK-SI",
      "Vertailu":"VER-TAI-LU",
      "Hajonta":"HA-JON-TA",
      
      "Jatketaan": "JAT-KE-TAAN",
      "Lopeta": "LO-PE-TA",
    };

    // Jos tavutustoiminto ei ole käytössä, palautetaan alkuperäinen teksti
    if (!taskSyllabification) {
      return text;
    }

    // Palautetaan tavutettu teksti, jos löytyy määritelty tekstikohde, muuten alkuperäinen
    return syllables[text] || text;
  };

  // Palautesanomat
  const feedbackMessages = {
    0: {
      default: "0/5 Hyvä, että yritit! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!",
      syllabified: "0/5 HY-VÄ ET-TÄ Y-RI-TIT! MA-TIK-KA ON VÄ-LIL-LÄ TO-SI HAAS-TA-VAA. HAR-JOI-TEL-LAAN YH-DES-SÄ LI-SÄÄ, NIIN EN-SI KER-RAL-LA VOI MEN-NÄ PA-REM-MIN",
      spoken: "nolla kautta viisi! Hyvä, että yritit! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!",
    },
    1: {
      default: "1/5 Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!",
      syllabified: "1/5 HY-VÄ, SAIT YH-DEN OI-KEIN! TÄ-MÄ ON HY-VÄ AL-KU JA JO-KA KER-TA O-PIT VÄ-HÄN LI-SÄÄ. KO-KEIL-LAAN YH-DES-SÄ UU-DEL-LEEN!",
      spoken: "yksi kautta viisi! Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!",
    },
    2: {
      default: "2/5 Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!",
      syllabified: "2/5 HIE-NOA, SAIT JO KAK-SI OI-KEIN! O-LET OP-PI-MAS-SA. JAT-KE-TAAN HAR-JOIT-TE-LU-A, NIIN EN-SI KER-RAL-LA O-SAAT VIE-LÄ E-NEM-MÄN!",
      spoken: "kaksi kautta viisi! Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!",
    },
    3: {
      default: "3/5 Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!",
      syllabified: "3/5 MAH-TA-VAA, SAIT Y-LI PUO-LET OI-KEIN! O-LET JO TO-SI LÄ-HEL-LÄ. HAR-JOI-TEL-LAAN VIE-LÄ VÄ-HÄN, NIIN PÄÄ-SET VIE-LÄ-KIN PI-DEM-MÄL-LE",
      spoken: "kolme kautta viisi! Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!",
    },
    4: {
      default: "4/5 Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!",
      syllabified: "4/5 TO-SI HIE-NO-A! MEL-KEIN KAIK-KI ME-NI OI-KEIN. VIE-LÄ VÄ-HÄN HAR-JOIT-TE-LUA, NIIN VOIT SAA-DA KAIK-KI OI-KEIN EN-SI KER-RAL-LA",
      spoken: "neljä kautta viisi! Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!",
    },
    5: {
      default: "5/5 Wau, ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!",
      syllabified: "5/5 WAU, I-HAN HUIP-PUA! SAIT KAIK-KI OIK-EIN! JAT-KA SA-MAAN MAL-LIIN, O-LET TO-SI TAI-TA-VA!",
      spoken: "viisi kautta viisi! VAU! ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!",
    },
    default: {
      default: "Tämän hetkiset pisteesi:",
      syllabified: "TÄ-MÄN HET-KI-SET PIS-TEE-SI",
      spoken: "Tämän hetkiset pisteesi:"
    },
  };

  // Funktio palautteen hakemiseen
  const getFeedbackMessage = (points) => {
    console.log("FeedbackMessagessa")
    const entry = feedbackMessages[points] || feedbackMessages.default;
    if(taskReading) {
      console.log("Sammutetaan edellinen puhe")
      Speech.stop()
      console.log("Puhutaan feedbackMessage")
      Speech.speak(feedbackMessages[points].spoken)
    }
    return taskSyllabification ? entry.syllabified : entry.default;
  };

  return (
    <TaskSyllabificationContext.Provider
      value={{ taskSyllabification, setTaskSyllabification, syllabify, getFeedbackMessage }}
    >
      {children}
    </TaskSyllabificationContext.Provider>
  );
}

export function useTaskSyllabification() {
  return useContext(TaskSyllabificationContext);
} 