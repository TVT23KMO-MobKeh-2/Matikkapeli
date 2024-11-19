import { createContext, useState, useEffect } from 'react';
import { addDoc, collection, firestore, PLAYERSTATS, where, query, getDocs, updateDoc } from '../firebase/Config';

// Luodaan konteksti, joka tarjoaa pelin tilan ja toiminnot lapsikomponenteille
export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
    const [email, setEmail] = useState("isi@gmail.com") //Tunnisteena, jos monta samannimistä Kallea
    const [playerName, setPlayerName] = useState("Irja")
    const [docId, setDocId] = useState("")
    // Pelaajan taso
    const [playerLevel, setPlayerLevel] = useState(1);
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

    // Koukku pelaajatietojen hakuun tietokannasta
    useEffect(() => {
        recievePlayerStatsFromDatabase();
    }, [])

    // Koukku jolla lasketaan totalXp, kun joku XP muuttuu
    useEffect(() => {
        setTotalXp(comparisonXp + bondsXp + soundToNumberXp + imageToNumberXp);
    }, [comparisonXp, bondsXp, soundToNumberXp, imageToNumberXp]);


    //Koukku, joka tarkistaa tason nousun tai koko pelin läpäisyn ja heittää niistä alertin
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

    // Funktio pelaajatietojen tallennukseen tietokantaan pelin alussa
    const savePlayerStatsToDatabase = async () => {
        try {
            const docRef = await addDoc(collection(firestore, PLAYERSTATS), {
                email: email,
                playerName: playerName,
                playerLevel: playerLevel,
                imageToNumberXp: imageToNumberXp,
                soundToNumberXp: soundToNumberXp,
                comparisonXp: comparisonXp,
                bondsXp: bondsXp
            })
            console.log("Pelaajan tiedot tallennettu")
        } catch (error) {
            console.log("Virhe tallentaessa tietokantaan pelaajan tietoja:", error)
        }
    }

    const updatePlayerStatsToDatabase = async () => {
        try {
            const docRef = doc(firestore, "PLAYERSTATS", docId);
    
            await updateDoc(docRef, {
                email: email,
                playerName: playerName,
                playerLevel: playerLevel,
                imageToNumberXp: imageToNumberXp,
                soundToNumberXp: soundToNumberXp,
                comparisonXp: comparisonXp,
                bondsXp: bondsXp
            });
    
            console.log("Pelaajan tiedot päivitetty tietokantaan");
        } catch (error) {
            console.error("Virhe päivittäessä tietokantaan pelaajan tietoja:", error);
        }
    }
    
    // Funktio pelaajatietojen hakuun tietokannasta
const recievePlayerStatsFromDatabase = async () => {
    try {
        console.log("Haetaan tietoja sähköpostilla:", email, "ja nimellä:", playerName);
        
        const q = query(
            collection(firestore, PLAYERSTATS),
            where("email", "==", email),
            where("playerName", "==", playerName)
        );

        const querySnapshotWithFilters = await getDocs(q);
        
        if (!querySnapshotWithFilters.empty) {
            const doc = querySnapshotWithFilters.docs[0];
            const data = doc.data(); // Haetaan datasisältö
            console.log("Löydetyt tiedot:", data);

            // Päivitetään tiedot
            setImageToNumberXp(data.imageToNumberXp);
            setSoundToNumberXp(data.soundToNumberXp);
            setComparisonXp(data.comparisonXp);
            setBondsXp(data.bondsXp);
            setPlayerLevel(data.playerLevel);
            setDocId(doc.id);
        } else {
            console.log("Pelaajan tietoja ei löytynyt.");
        }
    } catch (error) {
        console.error("Virhe noudettaessa pelaajan tietoja:", error);
    }
};

    

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
                playerLevel,
                totalXp,
                savePlayerStatsToDatabase,
                updatePlayerStatsToDatabase

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
