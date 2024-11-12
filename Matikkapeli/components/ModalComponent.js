import { View, Text, Modal, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles';
import * as Speech from 'expo-speech';
import { ScoreContext } from './ScoreContext';

export default function ModalComponent({ onBack, isVisible }) {
    const [voiceFeedbackMsg, setVoiceFeedbackMsg] = useState("Tässä tämän hetkiset pisteesi")
    const [hyphens, setHyphens] = useState(false)//tilapäinen kunnes asetukset saatu Tavutus
    const [isSpeak, setIsSpeak] = useState(true)//tilapäinen  kunnes asetukset saatu Puhe
    const {playerLevel,points,imageToNumberXp,soundToNumberXp,comparisonXp,bondsXp, totalXp} = useContext(ScoreContext)

    const feedbackMsg = (() => {
        switch (points) {
            case 0:
                return (!hyphens) ? "0/5 Hyvä, että yritit! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!"
                    : "0/5 HY-VÄ ET-TÄ Y-RI-TIT! MA-TIK-KA ON VÄ-LIL-LÄ TO-SI HAAS-TA-VAA. HAR-JOI-TEL-LAAN YH-DES-SÄ LI-SÄÄ, NIIN EN-SI KER-RAL-LA VOI MEN-NÄ PA-REM-MIN";
            case 1:
                return (!hyphens) ? "1/5 Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!"
                    : "1/5 HY-VÄ, SAIT YH-DEN OI-KEIN! TÄ-MÄ ON HY-VÄ AL-KU JA JO-KA KER-TA O-PIT VÄ-HÄN LI-SÄÄ. KO-KEIL-LAAN YH-DES-SÄ UU-DEL-LEEN!";
            case 2:
                return (!hyphens) ? "2/5 Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!"
                    : "2/5 HIE-NOA, SAIT JO KAK-SI OI-KEIN! O-LET OP-PI-MAS-SA. JAT-KE-TAAN HAR-JOIT-TE-LU-A, NIIN EN-SI KER-RAL-LA O-SAAT VIE-LÄ E-NEM-MÄN!";
            case 3:
                return (!hyphens) ? "3/5 Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!"
                    : "3/5 MAH-TA-VAA, SAIT Y-LI PUO-LET OI-KEIN! O-LET JO TO-SI LÄ-HEL-LÄ. HAR-JOI-TEL-LAAN VIE-LÄ VÄ-HÄN, NIIN PÄÄ-SET VIE-LÄ-KIN PI-DEM-MÄL-LE";
            case 4:
                return (!hyphens) ? "4/5 Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!"
                    : "4/5 TO-SI HIE-NO-A! MEL-KEIN KAIK-KI ME-NI OI-KEIN. VIE-LÄ VÄ-HÄN HAR-JOIT-TE-LUA, NIIN VOIT SAA-DA KAIK-KI OI-KEIN EN-SI KER-RAL-LA";
            case 5:
                return (!hyphens) ? "5/5 Wau, ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!"
                    : "5/5 WAU, I-HAN HUIP-PUA! SAIT KAIK-KI OIK-EIN! JAT-KA SA-MAAN MAL-LIIN, O-LET TO-SI TAI-TA-VA!";
            default:
                return (!hyphens) ? "Tässä tämän hetkiset pisteesi:"
                    : "TÄ-MÄN HET-KI-SET PIS-TEE-SI";
        }
    })();

    useEffect(() => {
        const voiceFeedback = [
            "nolla kautta viisi! Matikka on välillä tosi haastavaa. Harjoitellaan yhdessä lisää, niin ensi kerralla voi mennä paremmin!",
            "yksi kautta viisi! Hyvä, sait yhden oikein! Tämä on hyvä alku, ja joka kerta opit vähän lisää. Kokeillaan yhdessä uudelleen!",
            "kaksi kautta viisi! Hienoa, sait jo kaksi oikein! Olet oppimassa. Jatketaan harjoittelua, niin ensi kerralla osaat vielä enemmän!",
            "kolme kautta viisi! Mahtavaa, sait yli puolet oikein! Olet jo tosi lähellä. Harjoitellaan vielä vähän, niin pääset vieläkin pidemmälle!",
            "neljä kautta viisi! Tosi hienoa! Melkein kaikki meni oikein. Vielä vähän harjoittelua, niin voit saada kaikki oikein ensi kerralla!",
            "viisi kautta viisi! VAU! ihan huippua! Sait kaikki oikein! Jatka samaan malliin, olet tosi taitava!",
        ];
        setVoiceFeedbackMsg(voiceFeedback[points] || "Tässä tämän hetkiset pisteesi");
    }, [points]);


    useEffect(() => {
        if (isVisible && isSpeak) {
            Speech.stop()
            Speech.speak(voiceFeedbackMsg);
        }
    }, [isVisible, voiceFeedbackMsg]);

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isVisible}
            onRequestClose={onBack}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.feedback}>{feedbackMsg}</Text>
                    <Text style={styles.title}>Pistetaulu</Text>
                    <View>
                        <Text>Level: {playerLevel}/10</Text>
                        <Text>Kokonaispisteet: {totalXp}/190</Text>
                        <Text>ImageToNumbers: {imageToNumberXp}/50</Text>
                        <Text>SoundToNumbers: {soundToNumberXp}/50</Text>
                        <Text>Comparison: {comparisonXp}/50</Text>
                        <Text>Bonds: {bondsXp}/40</Text>
                    </View>
                    <Button title="Palaa aloitusnäyttöön" onPress={onBack}></Button>
                </View>

            </View>
        </Modal>
    )
}