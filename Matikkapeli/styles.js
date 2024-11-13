import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    width: '100%', //Varmistaa SafeAreaView:n leveyskattavuuden
  },
  container: {
    flex: 1, //Varmistaa koko näytön korkeuden
    width: '100%', //Täyttää näytön leveyssuunnassa
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',  //Tummalle teemalle muuttuu dynaamisesti
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingItemColumn: { //Uusi tyyli pystysuuntaiseen asetteluun
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginRight: 10,
    marginBottom: 5, //Tilaa liukusäätimen ja otsikon väliin
  },
  slider: { 
    width: '80%', //Asetetaan liukusäätimen leveys keskitetysti
  },
  level: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', //Muuttuu tummalla teemalla
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    margin: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  optionWrapper: {
    width: '40%',
    margin: 5,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 10, //Tilaa nappien välille
    width: '80%', //Nappien leveys
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white', //Muuttuu tummalla teemalla
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000', //Muuttuu tummalla teemalla
  },
  settingsIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f0f0f0', //Muuttuu tummalla teemalla
    borderRadius: 50,
    padding: 10,
  },
  backIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#f0f0f0', //Muuttuu tummalla teemalla
    borderRadius: 50,
    padding: 10,
  },
});
