import { createContext, useState, useEffect } from 'react';
//import { addDoc, collection, firestore, PLAYERSTATS, where, query, getDocs, updateDoc, doc } from '../firebase/Config';
import { savePlayerStatsToDatabase, recievePlayerStatsFromDatabase, updatePlayerStatsToDatabase } from '../firebase/Functions'
import { Alert } from 'react-native';


// Luodaan konteksti, joka tarjoaa pelin tilan ja toiminnot lapsikomponenteille
export const ScoreContext = createContext();

export const ScoreProvider = ({children, profile = {} }) => {

    const [email, setEmail] = useState(profile.email) //Tunnisteena, jos monta samannimistä Kallea
    const [playerName, setPlayerName] = useState(profile.playerName)
    const [docId, setDocId] = useState(profile.id)
    // Pelaajan taso
    const [playerLevel, setPlayerLevel] = useState(profile.playerLevel)
    // Eri tehtävien Xp:t
    const [imageToNumberXp, setImageToNumberXp] = useState(profile.imageToNumberXp ?? 0);
    const [soundToNumberXp, setSoundToNumberXp] = useState(profile.soundToNumberXp ?? 0);
    const [comparisonXp, setComparisonXp] = useState(profile.comparisonXp ?? 0);
    const [bondsXp, setBondsXp] = useState(profile.bondsXp ?? 0);
    const [imageID, setImageID] = useState(profile.imageID);
    const [career, setCareer] = useState(profile.career);
    // KokonaisXp
    const [totalXp, setTotalXp] = useState(comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
/*     // Kulloisestakin tehtävästä saadut pisteet ja vastattujen kysymysten määrä, joiden perusteella annetaan palaute ja päätetään tehtävä
    const [points, setPoints] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0); */
    // Seurataan onko taso noustu tai peli läpäisty
    const [xpMilestone, setXpMilestone] = useState(false);
    const [gameAchieved, setGameAchieved] = useState(false);
    //Taulukko tasojen nousua varten
    const xpForLevelUp = [15, 30, 50, 70, 90, 110, 130, 150, 170];

    // Koukku pelaajatietojen hakuun tietokannasta
    useEffect(() => {
        if (email && playerName) {
            console.log("Fetching player stats with email:", email, "and player name:", playerName);
            recievePlayerStatsFromDatabase({ email, playerName, setImageToNumberXp, setSoundToNumberXp, setComparisonXp, setBondsXp, setPlayerLevel, setImageID, setCareer, setDocId });
        }
    }, [email, playerName]);

    // Koukku jolla lasketaan totalXp, kun joku XP muuttuu
    useEffect(() => {
        console.log(`Total XP before updated: ${totalXp}`);
        setTotalXp(comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
        console.log("New totalXp:",comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
    }, [comparisonXp, bondsXp, soundToNumberXp, imageToNumberXp]);

    const handleUpdatePlayerStatsToDatabase =() => {
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


        // Tarkistetaan, päästäänkö seuraavalle tasolle tai onko koko peli läpi?
        if (xpForLevelUp.includes(totalXp)) {
            setXpMilestone(true);
        } else if (totalXp >= 190) {
            setGameAchieved(true);
        }
    };

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
            }}
        >
            {children}
        </ScoreContext.Provider>
    );
};

export const useScore = () => useContext(ScoreContext);