import { createContext, useState, useEffect } from 'react';
//import { addDoc, collection, firestore, PLAYERSTATS, where, query, getDocs, updateDoc, doc } from '../firebase/Config';
import { savePlayerStatsToDatabase, recievePlayerStatsFromDatabase, updatePlayerStatsToDatabase } from '../firebase/Functions'
import { Alert } from 'react-native';
import * as Speech from 'expo-speech';

// Luodaan konteksti, joka tarjoaa pelin tilan ja toiminnot lapsikomponenteille
export const ScoreContext = createContext();

export const ScoreProvider = ({ children, profile = {} }) => {

    const [email, setEmail] = useState("") //Tunnisteena, jos monta samannimistä Kallea
    const [password, setPassword] = useState("")
    const [playerName, setPlayerName] = useState("")
    const [docId, setDocId] = useState("")
    // Pelaajan taso
    const [playerLevel, setPlayerLevel] = useState(1)
    // Eri tehtävien Xp:t
    const [imageToNumberXp, setImageToNumberXp] = useState(0);
    const [soundToNumberXp, setSoundToNumberXp] = useState(0);
    const [comparisonXp, setComparisonXp] = useState(0);
    const [bondsXp, setBondsXp] = useState(0);
    const [imageID, setImageID] = useState("");
    const [career, setCareer] = useState("");
    // KokonaisXp
    const [totalXp, setTotalXp] = useState(0);
    /*     // Kulloisestakin tehtävästä saadut pisteet ja vastattujen kysymysten määrä, joiden perusteella annetaan palaute ja päätetään tehtävä
        const [points, setPoints] = useState(0);
        const [questionsAnswered, setQuestionsAnswered] = useState(0); */
    // Seurataan onko taso noustu tai peli läpäisty
    const [xpMilestone, setXpMilestone] = useState(false);
    const [isFetchingStats, setIsFetchingStats] = useState(false)
    const [gameAchieved, setGameAchieved] = useState(false);
    //Taulukko tasojen nousua varten
    const xpForLevelUp = { 1: 15, 2: 30, 3: 50, 4: 70, 5: 90, 6: 110, 7: 130, 8: 150, 9: 170 };

    // Koukku pelaajatietojen hakuun tietokannasta
    useEffect(() => {
        console.log("Scorecontext useEffect playername:",playerName)
        if (email && playerName) {
            setIsFetchingStats(true)
            console.log("isFetchingStats setted true", isFetchingStats)
            console.log("Fetching player stats with email:", email, "and player name:", playerName);
            recievePlayerStatsFromDatabase({ email, playerName, setImageToNumberXp, setSoundToNumberXp, setComparisonXp, setBondsXp, setPlayerLevel, setImageID, setCareer, setDocId, setIsFetchingStats });
        }
    }, [playerName]);

    // Koukku jolla lasketaan totalXp, kun joku XP muuttuu
    useEffect(() => {
        console.log("totalXP:n päivitys, isFetchingStats", isFetchingStats)
        console.log(`Total XP before updated: ${totalXp}`);
        setTotalXp(comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
        console.log("New totalXp:", comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
    }, [comparisonXp, bondsXp, soundToNumberXp, imageToNumberXp]);

    // Tarkistetaan, päästäänkö seuraavalle tasolle tai onko koko peli läpi?
    useEffect(() => {
        console.log("setXpMilestone, isFetchingStats", isFetchingStats)
        if (!isFetchingStats) {
            if (totalXp === xpForLevelUp[playerLevel]) {
                setXpMilestone(true);
            } else if (totalXp === 190) {
                setGameAchieved(true);
            }
        }
    }, [totalXp])

    const handleUpdatePlayerImageToDatabase = (newImageID) => {
        console.log("Updating player stats to the database:", {
            email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, imageID, career, docId
        });
        updatePlayerStatsToDatabase({ email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, imageID: newImageID, career, docId })
    }

    const handleUpdatePlayerStatsToDatabase = () => {
        console.log("Updating player stats to the database:", {
            email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, imageID, career, docId
        });
        updatePlayerStatsToDatabase({ email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, imageID, career, docId })
    }

    //Koukku, joka tarkistaa tason nousun tai koko pelin läpäisyn ja heittää niistä alertin
    useEffect(() => {
        if (xpMilestone) {
            setTimeout(() => {
                Alert.alert('Taso noustiin!', 'Hienoa, päästään seuraavalle tasolle', [{ text: 'OK' }]);
                setPlayerLevel(prevPlayerLevel => prevPlayerLevel + 1)
                setXpMilestone(false)
            }, 2000);
        } else if (gameAchieved) {
            setTimeout(() => {
                Alert.alert('Peli läpäisty', 'Hienoa, pääsit pelin läpi', [{ text: 'OK' }]);
            }, 2000);
        }
    }, [xpMilestone, gameAchieved]);

    // Määritetään incrementXp-funktiota varten, kuinka paljon xp voi olla milläkin tasolla.
    const maxXpByLevel = {
        1: { imageToNumber: 5, soundToNumber: 5, comparison: 5, bonds: 0 },
        2: { imageToNumber: 10, soundToNumber: 10, comparison: 10, bonds: 0 },
        3: { imageToNumber: 15, soundToNumber: 15, comparison: 15, bonds: 5 },
        4: { imageToNumber: 20, soundToNumber: 20, comparison: 20, bonds: 10 },
        5: { imageToNumber: 25, soundToNumber: 25, comparison: 25, bonds: 15 },
        6: { imageToNumber: 30, soundToNumber: 30, comparison: 30, bonds: 20 },
        7: { imageToNumber: 35, soundToNumber: 35, comparison: 35, bonds: 25 },
        8: { imageToNumber: 40, soundToNumber: 40, comparison: 40, bonds: 30 },
        9: { imageToNumber: 45, soundToNumber: 45, comparison: 45, bonds: 35 },
        10: { imageToNumber: 50, soundToNumber: 50, comparison: 50, bonds: 40 },
    };

    // Määritetään incrementXp-funktiota varten kullekin tehtävälle xp:t ja niiden setterit
    const xpHandlers = {
        comparison: { value: comparisonXp, setter: setComparisonXp },
        bonds: { value: bondsXp, setter: setBondsXp },
        soundToNumber: { value: soundToNumberXp, setter: setSoundToNumberXp },
        imageToNumber: { value: imageToNumberXp, setter: setImageToNumberXp },
    };

    // Funktio tehtävän Xp:n päivittämistä varten:
    const incrementXp = (points, task) => {
        const { value, setter } = xpHandlers[task]; // Haetaan tehtävän Xp ja sen setteri
        const maxXp = maxXpByLevel[playerLevel][task]; // Haetaan levelin maksimi Xp, jotta ei aseteta arvoa sitä suuremmaksi

        // Lisätään pisteet, eli joko xp+pisteet tai tasonmukainen Xp:n maximi arvo, riippuen kumpi on pienempi
        setter(Math.min(value + points, maxXp));

        console.log(`XP for ${task} updated: ${value + points}/${maxXp}`);


        /*         // Tarkistetaan, päästäänkö seuraavalle tasolle tai onko koko peli läpi?
                if (xpForLevelUp.includes(totalXp)) {
                    setXpMilestone(true);
                } else if (totalXp >= 190) {
                    setGameAchieved(true);
                } */
    };

    //funktio palautteen lukemista varten
    const readFeedback = (points) => {
        console.log("readFeedbackMessage")
        const feedbackMessages = [
            "nolla kautta viisi! Hyvä, että yritit! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!",
            "yksi kautta viisi! Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!",
            "kaksi kautta viisi! Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!",
            "kolme kautta viisi! Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!",
            "neljä kautta viisi! Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!",
            "viisi kautta viisi! VAU! ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!"
        ]
        Speech.speak(feedbackMessages[points])
        console.log("Message", feedbackMessages[points])
    }

    return (
        <ScoreContext.Provider
            value={{
                // Pelaajan perustiedot
                email,
                setEmail,
                playerName,
                setPlayerName,
                imageID,
                setImageID,
                career,
                setCareer,
                playerLevel,
                totalXp,
                savePlayerStatsToDatabase,
                updatePlayerStatsToDatabase,
                handleUpdatePlayerStatsToDatabase,
                handleUpdatePlayerImageToDatabase,

                // Tehtäväpisteet
                imageToNumberXp,
                soundToNumberXp,
                comparisonXp,
                bondsXp,

                // Pisteisiin liittyvät tilat ja toiminnot
                /*                 points,
                                setPoints,
                                questionsAnswered,
                                setQuestionsAnswered, */
                incrementXp,
                setPlayerLevel,
                setImageToNumberXp,
                setSoundToNumberXp,
                setComparisonXp,
                setBondsXp,
                readFeedback
            }}
        >
            {children}
        </ScoreContext.Provider>
    );
};

export const useScore = () => useContext(ScoreContext);