import { createContext, useState, useEffect } from 'react';

// Luodaan konteksti, joka tarjoaa pelin tilan ja toiminnot lapsikomponenteille
export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
    // Seuraavat 5 tilamuuttujaa haetaan oikeasti sovelluksessa tietokannasta, nyt kovakoodattuna tähän.
    // Pelaajan taso
    const [playerLevel, setPlayerLevel] = useState(5);
    // Eri tehtävien Xp:t
    const [imageToNumberXp, setImageToNumberXp] = useState(0);
    const [soundToNumberXp, setSoundToNumberXp] = useState(0);
    const [comparisonXp, setComparisonXp] = useState(0);
    const [bondsXp, setBondsXp] = useState(0);
    

    // KokonaisXp
    const [totalXp, setTotalXp] = useState(comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
    // Kulloisestakin tehtävästä saadut pisteet ja vastattujen kysymysten määrä, joiden perusteella annetaan palaute ja päätetään tehtävä
    const [points, setPoints] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    // Seurataan onko taso noustu tai peli läpäisty
    const [xpMilestone, setXpMilestone] = useState(false);
    const [gameAchieved, setGameAchieved] = useState(false);
    //Taulukko tasojen nousua varten
    const xpForLevelUp = [15, 30, 50, 70, 90, 110, 130, 150, 170];

    // Lasketaan totalXp, kun joku XP muuttuu
    useEffect(() => {
        setTotalXp(comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
    }, [comparisonXp, bondsXp, soundToNumberXp, imageToNumberXp]);

    // Määritetään incrementXp-funktiota varten, kuinka paljon xp voi olla milläkin tasolla.
    const maxXpByLevel = {
        1: { imageToNumber: 5, soundToNumber: 5, comparison: 0, bonds: 0 },
        2: { imageToNumber: 10, soundToNumber: 10, comparison: 5, bonds: 0 },
        3: { imageToNumber: 15, soundToNumber: 15, comparison: 10, bonds: 5 },
        4: { imageToNumber: 20, soundToNumber: 20, comparison: 15, bonds: 10 },
        5: { imageToNumber: 25, soundToNumber: 25, comparison: 20, bonds: 15 },
        6: { imageToNumber: 30, soundToNumber: 30, comparison: 25, bonds: 20 },
        7: { imageToNumber: 35, soundToNumber: 35, comparison: 30, bonds: 25 },
        8: { imageToNumber: 40, soundToNumber: 40, comparison: 35, bonds: 30 },
        9: { imageToNumber: 45, soundToNumber: 45, comparison: 40, bonds: 35 },
        10: { imageToNumber: 50, soundToNumber: 50, comparison: 45, bonds: 40 },
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

        // Tarkistetaan, onko päästäänkö seuraavalle tasolle tai onko koko peli läpi?
        if (xpForLevelUp.includes(totalXp)) {
            setXpMilestone(true);
        } else if (totalXp >= 190) {
            setGameAchieved(true);
        }
    };

    //Efekti, joka tarkistaa tason nousun tai koko pelin läpäisyn ja heittää niistä alertin
    useEffect(() => {
        if (xpMilestone) {
            setTimeout(() => {
                Alert.alert('Taso noustiin!', 'Hienoa, päästään seuraavalle tasolle', [{ text: 'OK' }]);
            }, 2000);
        } else if (gameAchieved) {
            setTimeout(() => {
                Alert.alert('Peli läpäisty', 'Hienoa, pääsit pelin läpi', [{ text: 'OK' }]);
            }, 2000);
        }
    }, [xpMilestone, gameAchieved]);

    return (
        <ScoreContext.Provider
            value={{
                // Pelaajan perustiedot
                playerLevel,
                totalXp,

                // Tehtäväpisteet
                imageToNumberXp,
                soundToNumberXp,
                comparisonXp,
                bondsXp,

                // Pisteisiin liittyvät tilat ja toiminnot
                points,
                setPoints,
                questionsAnswered,
                setQuestionsAnswered,
                incrementXp
            }}
        >
            {children}
        </ScoreContext.Provider>
    );
};