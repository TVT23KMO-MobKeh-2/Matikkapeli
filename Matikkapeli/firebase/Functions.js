import { Alert } from 'react-native';
import { addDoc, collection, firestore, PLAYERSTATS, where, query, getDocs, updateDoc, doc } from '../firebase/Config';

// Funktio pelaajatietojen tallennukseen tietokantaan pelin alussa
export async function savePlayerStatsToDatabase({ email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp }){
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

// Funktio pelaajan tietojen päivittämiseen tietokantaan
export async function updatePlayerStatsToDatabase({ email, playerName, playerLevel, imageToNumberXp, soundToNumberXp, comparisonXp, bondsXp, docId }) {
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
            bondsXp: bondsXp
        });

        console.log("Pelaajan tiedot päivitetty tietokantaan");
    } catch (error) {
        console.error("Virhe2 päivittäessä tietokantaan pelaajan tietoja:", error);
    }
}

// Funktio pelaajatietojen hakuun tietokannasta
export async function recievePlayerStatsFromDatabase({email, playerName, setImageToNumberXp, setSoundToNumberXp, setComparisonXp, setBondsXp, setPlayerLevel, setDocId}) {
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
            //console.log("docId hakufunktiosta:", doc.id);

            const data = doc.data(); // Haetaan datasisältö
            console.log("Löydetyt tiedot:", data);
            console.log("docId:", doc.id)

            // Päivitetään tiedot tilamuuttujiin:
            setImageToNumberXp(data.imageToNumberXp);
            setSoundToNumberXp(data.soundToNumberXp);
            setComparisonXp(data.comparisonXp);
            setBondsXp(data.bondsXp);
            setPlayerLevel(data.playerLevel);
            // Tallennetaan documentin ID, jotta voidaan myöhemmin päivittää samaa dokumenttia.
            setDocId(doc.id);
        } else {
            console.log("Pelaajan tietoja ei löytynyt.");
            Alert.alert("Virhe:", "Pelaajan tietoja ei löytynyt")

        }
    } catch (error) {
        console.log("Haetaan tietoja sähköpostilla:", email, "ja nimellä:", playerName);
        console.error("Virhe1 noudettaessa pelaajan tietoja:", error);
        Alert.alert("Virhe", "Pelaajan tietojen hakeminen ei onnistunut. Yritä myöhemmin uudestaan.")
    }
};