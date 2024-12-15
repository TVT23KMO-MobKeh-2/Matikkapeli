# Matikkapolku

## Esittely
Tässä projektissa luotiin mobiilisovellus, jolla tuetaan 5-8 vuotiaiden lasten (eskarista ekaluokkalaisiin) matematiikan oppimista. Tämän sovelluksen toteutti Oulun ammattikorkeakoulun tieto- ja viestintätekniikan toisen vuosikurssin opiskelijat Mobiiliohjelmoinnin sovellusprojektin tuotoksena marras-joulukuussa 2024. 

![Kettu](./readme/kettu22.gif)Tässä projektissa luotiin mobiilisovellus, jolla tuetaan 5-8 vuotiaiden lasten (eskarista ekaluokkalaisiin) matematiikan oppimista. Tämän sovelluksen toteutti Oulun ammattikorkeakoulun tieto- ja viestintätekniikan toisen vuosikurssin opiskelijat Mobiiliohjelmoinnin sovellusprojektin tuotoksena marras-joulukuussa 2024. 

---
### Sovelluksen käyttöönotto pelkkää käyttöä varten Androidilla:
1. Lataa .apk tiedosto [tästä](https://drive.google.com/file/d/1T7cDE15q4OnKqAv2Zdp3ENVUFNzbCBry/view?usp=drive_link)
2. Asenna sovellus laitteelle (joudut antamaan lupia, kun lähde ei ole luotettu jne..).
3. **Samsungin** laitteilla käy puhelimen asetuksissa:
>>  Asetukset->
>>> Helppokäyttöisyys ->
>>>> TalkBack ->
>>>>> Asetukset ->
>>>>>> Ensisijainen moduuli, vaihda googleen ja kieli Suomeksi
4. Aloita pelaaminen

### Sovelluksen käyttöönotto kehitysympäristössä:
1. Lataa puhelimelle Expo Go-sovellus [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Kloonaa repository 
3. Aja Npm install komento Matikkapeli\Matikkapeli kansiossa
4. Luo env.js tiedosto Matikkapeli\Matikkapeli -kansioon:
>const ENV = {
>
>    FIREBASE_API_KEY : "",
>
>    FIREBASE_AUTH_DOMAIN : "",
>
>    FIREBASE_PROJECT_ID : "",
>
>    FIREBASE_STORAGE_BUCKET : "",
>
>    FIREBASE_MESSAGING_SENDER_ID : "",
>
>    FIREBASE_APP_ID : ""
>
>  };
>  
>  export default ENV;
5. Npx expo start Matikkapeli\Matikkapeli -kansioissa.
6. Lue QR-koodi Expo Go sovelluksella
---

### Sovelluksen ominaisuudet
Sovelluksessa on neljä erillaista peliä matematiikan oppimisen tukemiseen. Mikäli laitteella ei ole aiemmin pelattu kyseisellä sovelluksella, pyydetään aloitussivulla käyttäjää joko kirjautumaan sisään tai luomaan uusi tunnus. Uuteen tunnukseen annetaan vapaavalintainen käyttäjätunnus ja salasana. Tämän jälkeen tunnukselle voi luoda maksimissaan neljä pelaajaa.
![Pelin aloitus](./readme/readme1.png)
<sup><sub>Aloitussivu, kirjautumissivu, käyttäjänluonti & profiilin valita</sup></sub>

Pelaajalle annetaan nimi, valitaan hahmo ja haaveammatti. Kun käyttäjätunnus on luotu, tallennetaan tiedot tietokantaan ja osa laitteen muistiin. Tämän jälkeen sovelluksen seuraavilla käynnistyskerroilla se hakee laitteen muistista automaattisesti käyttäjänimen ja sen sisältämät profiilit, joilla pääsee pelaamaan.
Käyttäjällä on mahdollista kirjautua ulos sovelluksesta(poistetaan tiedot puhelimen muistista, jos haluaa vaihtaa laitetta) ja poistaa tiedot tietokannasta.
Kun käyttäjä valitsee tai luo pelaajan, avautuu hänelle profiilisivu, missä näkee omat pisteet ja tason. Tällä sivulla pelaaja voi vaihtaa pelihahmoa, palata pelaajan valintaan, poistaa pelaajan, siirtyä asetuksiin, asettaa ajastimen tai aloittaa pelin pelaamisen.
Kun pelaaja aloittaa pelin näytetään hänelle animaatio, missä hänen valitsema hahmo kävelee metsässä kohti seuraavaa pelitaulua. 
![Hahmon luonti ja näkyminen](./readme/readme2.png)
<sup><sub>Hahmon luonti, hahmon valinta, hahmosivu, animaatio</sup></sub>


Sovelluksessa käsitellään numerot väliltä 0-9, taso 1: 0 ja 1 taso 2: 2 jne. Jokaisella tasolla näytetään ensiksi kaksi valittavaa peliä Montako ja Tunnista, kun pelaaja on saanut molemmista peleistä 5 pistettä oikein, lisätään mukaan Vertailu ja Hajonta(tasosta 3 alkaen). Jokaisessa pelissä esitetään viisi kysymystä ja tämän jälkeen pelaajalle annetaan palaute siitä, miten meni. Sitten on aika siirtyä jälleen animaatioon, kohti seuraavaa pelitaulua. Kun tasolla on saatu kaikista peleistä 5 pistettä oikein, on aika siirtyä seuraavalle tasolle.

#### Asetukset

![Asetukset](./readme/readme3.png)
<sup><sub>Asetukset tummalla ja vaalealla teemalla ja tavutuksella sekä ilman</sup></sub>
Asetuksissa käyttäjä pääsee tekemään valintoja:

Tumman teeman valinta

Tavutus

Tehtävien luku

Taustamusiikki

Taustamusiikin voimakkuus

Peliäänet

#### Ajastin
Pelaaja voi valita ajastimesta 2, 5, 15, 30, 45 tai 60 minuuttia, jonka jälkeen on hyvä pitää taukoa tai vaihtaa pelaajaa.
![Ajastin näkymät](./readme/readme4.png)
<sup><sub>Ajastimen näkyminen sovelluksessa</sup></sub>

### Pelit
#### Montako - ImageToNumber
Tässä pelissä pelaaja tunnistaa haaveammattiinsa kuuluvien esineiden määrää. Esineiden määrä kasvaa pelin edetessä.
#### Tunnista - SoundToNumber
Tässä pelissä pelaajalle puhutaan numero, joka hänen täytyy tunnistaa. Numerot kasvaa pelin edetessä.
![Montako ja Tunnista pelinäkymä](./readme/readme5.png)
<sup><sub>Tummalla ja vaalealla teemalla Montako ja Tunnista pelit</sup></sub>

#### Vertailu - Comparison
Tässä pelissä pelaajalle annetaan kaksi numeroa ja hänen täytyy tunnistaa kumpi numeroista on pienempi tai suurempi vai ovatko ne yhtäsuuria. Numerot kasvaa pelin edetessä ja tasosta kolme lähtien mukaan tulee yksinkertaisia yhteen- tai vähennyslaskuyhtälöitä.
#### Hajonta - Bonds
Tässä pelissä pelaaja pääsee hajottamaan käsiteltävää numeroa, hänellä pitää täydentää aina puuttuva osapuoli numerosta. Numero kasvaa pelin edetessä.
![Vertailu ja Hajonta pelinäkymä](./readme/readme6.png)
<sup><sub>Tummalla ja vaalealla teemalla Vertailu ja Hajonta pelit</sup></sub>


---

### Projektin toteutus 
📝 Projekti toteutettiin osana Tieto- ja viestintätekniikan koulutusta marras-joulukuussa 2024. Projekti edeltävällä jaksolla opiskeltiin mobiiliohjelmointia natiivi- web- ja hybriditeknologioilla. Aihe saatiin valita itse, kaksi ryhmänjäsentä pallotteli aiheita jo ennen jakson alkamista ja toinen teki edellisen jakson päättötyönä matikkapeliä aikuisille. Hän ehdotti yhdeksi vaihtoehdoksi lapsille matematiikan opiskelun tueksi matikkapeliä ja koska molemmilla on loppukäyttäjäksi sopivia lapsia, oli ehdotus erittäin potentiaalinen. Kaksi muuta ryhmän jäsentä pitivät aihetta myös parhaana vaihtoehtona, joten sillä mennään. Projekti aloitettiin suunnittelemalla Mirossa sovelluksen tehtäviä ja toimintaa. Aika pian tästä päästiin jo koodaamaan.

🔨Toteutusvaiheessa hyödynsimme Discordia sekä GitHubin projektin hallintaa. Tämä mahdollisti selkeän projektinhallinnan ja töiden jakamisen.  Projekti toteutettiin Visual Studio Codella, jossa käytettiin Reactia ja Expoa. Projektin toteutus kesti hiukan yli kuukauden. Pysyimme hyvin aikataulussa ja saavutimme kaikki toiminnallisuudet, joita tavoittelimme.

---

### Ryhmän esittely

| Kehittäjät | |
| :---------------: | --- |
| [<img src="https://github.com/cheezyx.png" width="150px;"/><br /><sub><a href="https://github.com/cheezyx"></a></sub>](https://github.com/cheezyx) | Julianna Seppä -Tekemiset tähän. |
| [<img src="https://github.com/TaruPe.png" width="150px;"/><br /><sub><a href="https://github.com/TaruPe"></a></sub>](https://github.com/TaruPe) | Taru Peltonen – Tekemiset tähän. |
| [<img src="https://github.com/AvaRaGane.png" width="150px;"/><br /><sub><a href="https://github.com/AvaRaGane"></a></sub>](https://github.com/AvaRaGane) | Juha-Matti Huhta – Tekemiset tähän. |
| [<img src="https://github.com/Ereride.png" width="150px;"/><br /><sub><a href="https://github.com/Ereride"></a></sub>](https://github.com/Ereride) | Minna Leppänen - Hajonta peli on minun rakentama. Lisäksi pelin aloitusnäkymän ensimmäinen versio ja hahmonäkymät. Tyylittelyä ja yläpalkkia olin myös säätämässä. Tasopalkki komponentti ja animaatiot ovat minun käsialaa, liikkuvat eläinhahmot olen suunnitellut itse.|
</br>


### Käytetyt tekniikat
[<img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" height="80px;"/>](https://github.com)
[<img src="https://www.svgrepo.com/show/303500/react-1-logo.svg" height="80px;"/>](https://react.dev)
[<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Wireframe_logo.png/320px-Wireframe_logo.png" height="80px">](https://wireframe.cc/)
[<img height="80px" alt="logo-wordmark" src="https://github.com/user-attachments/assets/2a3103cf-fb54-46c7-855d-59fcfefd9c0e" />](https://expo.dev/)
[<img height="80px" src="https://www.gimp.org/images/frontpage/wilber-big.png" />](https://www.gimp.org/)





 






 
