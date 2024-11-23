import { Alert } from 'react-native';
import { addDoc, collection, firestore, PLAYERSTATS, where, query, getDocs, updateDoc, doc } from '../firebase/Config';

export async function saveEmailToDatabase({email}) {
    try {
        const emailQuery = query(
            collection(firestore, PLAYERSTATS),
            where("email", "==", email)
        )
        const emailQuerySnapshot = await getDocs(emailQuery)
        if (!emailQuerySnapshot.empty) {
            // Email already exists, just update the associated profiles or link email to new profiles
            console.log("Email already exists in database.");
            return;
        }

        console.log("Email saved successfully with player name linked.");
    } catch (error) {
        console.log("Error saving email:", error);
        Alert.alert("Virhe", "Sähköpostin tallentaminen ei onnistunut.");
    }
}


// Funktio pelaajatietojen tallennukseen tietokantaan pelin alussa
export async function savePlayerStatsToDatabase({ email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, imageID, career }){
    console.log("Saving player stats to database with:", { email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, imageID, career })
    try {
        
        await saveEmailToDatabase({email})

        const q = query(
            collection(firestore, PLAYERSTATS),
            where("email", "==", email),
            where("playerName", "==", playerName)
        )

        const querySnapshotWithFilters = await getDocs(q)
        if(!querySnapshotWithFilters.empty) {
            console.log("Profiili on jo olemassa.")
            Alert.alert("Virhe", "Samalla sähköpostilla ja nimellä on jo profiili")
            return
        }

        const docRef = await addDoc(collection(firestore, PLAYERSTATS), {
            email: email,
            playerName: playerName,
            playerLevel: playerLevel,
            imageToNumberXp: imageToNumberXp,
            soundToNumberXp: soundToNumberXp,
            comparisonXp: comparisonXp,
            bondsXp: bondsXp,
            imageID: imageID,
            career: career,
        })
        console.log("Pelaajan tiedot tallennettu")
    } catch (error) {
        console.log("Virhe tallentaessa tietokantaan pelaajan tietoja:", error)
    }
}

// Funktio pelaajan tietojen päivittämiseen tietokantaan
export async function updatePlayerStatsToDatabase({ email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, docId, imageID, career }) {
    try {
        console.log("Päivitetään tietoja tietokantaan, docId: ", docId)
        // Mitä päivitetään:
        const docRef = doc(firestore, "playerstats", docId);

        //Tiedot millä päivitetään:
        await updateDoc(docRef, {
            email: email,
            playerName: playerName,
            playerLevel: playerLevel,
            imageToNumberXp: imageToNumberXp,
            soundToNumberXp: soundToNumberXp,
            comparisonXp: comparisonXp,
            bondsXp: bondsXp,
            imageID: imageID,
            career: career
        });

        console.log("Pelaajan tiedot päivitetty tietokantaan");
    } catch (error) {
        console.error("Virhe2 päivittäessä tietokantaan pelaajan tietoja:", error);
    }
}

// Funktio pelaajatietojen hakuun tietokannasta
export async function recievePlayerStatsFromDatabase({email, playerName, setImageToNumberXp, setSoundToNumberXp, setComparisonXp, setBondsXp, setPlayerLevel, setImageID, setCareer, setDocId}) {
    console.log("Haetaan tietoja sähköpostilla:", email, "ja nimellä:", playerName);
    try {

        //Annetaan tiedot hakua varten
        const q = query(
            collection(firestore, PLAYERSTATS), // Mistä haetaan
            where("email", "==", email), // Ehtona sähköpostiosoite
            where("playerName", "==", playerName) // sekä pelaajan nimi
        );

        const querySnapshotWithFilters = await getDocs(q); // Suoritetaan kysely

        if (!querySnapshotWithFilters.empty) { //jos kyselyllä löytyi
            const doc = querySnapshotWithFilters.docs[0]; // haetaan ensimmäinen tulos

            const data = doc.data(); // Haetaan datasisältö
            console.log("Löydetyt tiedot:", data);
            console.log("docId:", doc.id)

            // Päivitetään tiedot tilamuuttujiin:
            setImageToNumberXp(data.imageToNumberXp);
            setSoundToNumberXp(data.soundToNumberXp);
            setComparisonXp(data.comparisonXp);
            setBondsXp(data.bondsXp);
            setPlayerLevel(data.playerLevel);
            setImageID(data.imageID);
            setCareer(data.career)
            // Tallennetaan documentin ID, jotta voidaan myöhemmin päivittää samaa dokumenttia.
            setDocId(doc.id);
        } else {
            console.log("Pelaajan tietoja ei löytynyt.");
            Alert.alert("Virhe:", "Pelaajan tietoja ei löytynyt")
        }
    } catch (error) {
        console.error("Virhe noudettaessa pelaajan tietoja:", error);
        Alert.alert("Virhe", "Pelaajan tietojen hakeminen ei onnistunut. Yritä myöhemmin uudestaan.")
    }
};

// funktio, jolla päivitetään asetukset tietokantaan
export async function updatePlayerSettingsToDatabase({email, playerName, isDarkTheme, taskReading, taskSyllabification, gamesounds, isMusicPlaying, musicVolume, docId}) {
    try {
        console.log("Päivitetään asetuksia tietokantaan, docId:", docId)
        const docRef = doc(firestore, "playersettings", docId)

        await updateDoc(docRef, {
            email: email,
            playerName: playerName,
            isDarkTheme: isDarkTheme,
            taskReading: taskReading, 
            taskSyllabification: taskSyllabification, 
            gamesounds: gamesounds, 
            isMusicPlaying: isMusicPlaying, 
            musicVolume: musicVolume
        })
        console.log("Pelaajan asetukset päivitetty tietokantaan");
    }catch (error) {
        console.log("Virhe asetuksien päivityksessä", error)
        Alert.alert("Virhe", "Asetuksien tallentaminen tietokantaan ei onnistunut. Yritä myöhemmin uudestaan")
    }
}

// funktio, jolla tallennetaan asetukset tietokantaan
export async function savePlayerSettingsToDatabase({ email, playerName, isDarkTheme, taskReading, taskSyllabification, gamesounds, isMusicPlaying, musicVolume}) {
    try {

        const q = query(
            collection(firestore, PLAYERSTATS),
            where("email", "==", email),
            where("playerName", "==", playerName)
        )

        const querySnapshotWithFilters = await getDocs(q)
        if(!querySnapshotWithFilters.empty) {
            console.log("Profiili on jo olemassa.")
            Alert.alert("Virhe", "Samalla sähköpostilla ja nimellä on jo profiili")
            return
        }

        const docRef = await addDoc(collection(firestore, "playersettings"),{
            email: email,
            playerName: playerName,
            isDarkTheme: isDarkTheme,
            taskReading: taskReading, 
            taskSyllabification: taskSyllabification, 
            gamesounds: gamesounds, 
            isMusicPlaying: isMusicPlaying, 
            musicVolume: musicVolume
        })
        console.log("Pelaajan asetukset tallennettu tietokantaan");
    }catch (error) {
        console.log("Virhe asetuksien tallentamisessa", error)
        Alert.alert("Virhe", "Asetuksien tallentaminen tietokantaan ei onnistunut. Yritä myöhemmin uudestaan")
    }
}

// funktio, jolla haetaan asetukset tietokannasta
export async function recievePlayerSettingsFromDatabase({email, playerName, toggleTheme, setTaskReading, setTaskSyllabification, setGameSounds, setIsMusicPlaying, setMusicVolume}) {
    console.log("Haetaan asetuksia sähköpostilla:", email, "ja nimellä:", playerName);
    try {
        
        //Annetaan tiedot hakua varten
        const q = query(
            collection(firestore, "playersettings"), // Mistä haetaan
            where("email", "==", email), // Ehtona sähköpostiosoite
            where("playerName", "==", playerName) // sekä pelaajan nimi
        );

        const querySnapshotWithFilters = await getDocs(q); // Suoritetaan kysely

        if (!querySnapshotWithFilters.empty) { //jos kyselyllä löytyi
            const doc = querySnapshotWithFilters.docs[0]; // haetaan ensimmäinen tulos

            const data = doc.data(); // Haetaan datasisältö
            console.log("Löydetyt tiedot:", data);
            console.log("docId:", doc.id)

            // Päivitetään tiedot tilamuuttujiin:
            toggleTheme(data.isDarkTheme)
            setTaskReading(data.taskReading)
            setTaskSyllabification(data.taskSyllabification) 
            setGameSounds(data.gamesounds)
            setIsMusicPlaying(data.isMusicPlaying)
            setMusicVolume(data.musicVolume)
            // Tallennetaan documentin ID, jotta voidaan myöhemmin päivittää samaa dokumenttia.
            setDocId(doc.id);
        } else {
            console.log("Pelaajan tietoja ei löytynyt.");
            Alert.alert("Virhe:", "Pelaajan tietoja ei löytynyt")
        }
    }catch (error) {
        console.log("Virhe asetuksien hakemisessa", error)
        Alert.alert("Virhe", "Asetuksien hakeminen tietokannasta ei onnistunut. Yritä myöhemmin uudestaan")
    }
}

