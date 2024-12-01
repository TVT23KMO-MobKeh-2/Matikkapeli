import { StyleSheet } from 'react-native';

export const getBGImage = (isDarkTheme) => {
  return isDarkTheme ? require('./assets/background3.png') : require('./assets/background2.jpg');
}

export default StyleSheet.create({
  //!!!!!!!!!!!!!! COMMON STYLES!!!!!!!!!!!!!!
  safeContainer: {
    flex: 1,
    width: '100%', //Varmistaa SafeAreaView:n leveyskattavuuden
  },
  container: {
    flex: 1, //Varmistaa koko näytön korkeuden
    width: '100%', //Täyttää näytön leveyssuunnassa
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, // Varmistaa, että sisältö ei mene top barin alle
    //marginTop: 60,
  },
  //!!!!!!!!! COMMON USED TEXTS !!!!!!!!!!!
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'ComicNeue_700Bold',
  },
  label: {
    fontSize: 18,
    marginRight: 10,
    marginBottom: 5,
    fontFamily: 'ComicNeue_700Bold', 
  },  
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ComicNeue_700Bold',
  },
  label2: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'ComicNeue_400Regular',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'ComicNeue_700Bold',
    textAlign: 'center',
  },
  //!!!! NAVIGAATIO IKONIT !!!!!
  backIcon: {
    position: 'absolute',
    bottom: 20, // Siirtää ikonia alaspäin 20 pikseliä
    left: 20,
    backgroundColor: '#f0f0f0', // Muuttuu tummalla teemalla
    borderRadius: 50,
    padding: 10,
  },
  settingsIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f0f0f0', // Tämä muuttuu tummalla teemalla
    borderRadius: 50,
    padding: 10,
    width: 50,
    height: 50
  },
  //!!!!! Top Bar Styles !!!!!!!
  topBarContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: '#3D843D',
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  topBarPfp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  topBarInfoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  topBarUsername: {
    fontSize: 20,
    fontFamily: 'ComicNeue_700Bold',
  },
  topBarLevelAndPoints: {
    fontSize: 16,
    fontFamily: 'ComicNeue_400Regular',
  },
  //!!!!!!!!!!!!!! START SCREEN !!!!!!!!!!!!!
  startButton: {
    backgroundColor: '#F4A261',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFDE21',
    //minWidth: 150,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 4,
  },
  //!!!!!!!!SETTINGS EXCLUSIVE!!!!!!!!!!!!
  settingItemContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 10, 
    alignItems: 'stretch', 
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5, 
    backgroundColor: '#CFFBCD', // Pale green
    borderRadius: 8,
    borderColor: '#3D843D',
    borderWidth: 2,
    padding: 10, 
    width: '100%',
  },
  settingItemDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5, 
    backgroundColor: '#3D843D', // Dark green
    borderRadius: 8,
    borderColor: '#3D843D',
    borderWidth: 2,
    padding: 10, 
    width: '100%',
  },
  settingItemColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5, 
    backgroundColor: '#CFFBCD',
    padding: 10,
    borderRadius: 8,
    borderColor: '#3D843D',
    borderWidth: 2,
    width: '100%',
  },
  settingItemColumnDark: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    backgroundColor: '#3D843D',
    padding: 10,
    borderRadius: 8,
    borderColor: '#3D843D',
    borderWidth: 2,
    width: '100%',
  },
  slider: {
    width: '80%', //Asetetaan liukusäätimen leveys keskitetysti
  },
  // Who uses?????
  level: {
    fontSize: 20,
    color: '#6c9b40', 
    marginBottom: 20,
  },
  //!!!! OPTIONS MITÄ KÄYTETÄÄN ESIM PELEISSÄ !!!!!
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#CFFBCD',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3D843D',
    width: '80%',
    shadowColor: '#00000',
    elevation: 4,
  },
  optionsContainerDark: {
    backgroundColor: '#3D843D',
    borderColor: '#CFFBCD',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    width: '80%',
    shadowColor: '#00000',
    elevation: 4,
  },
  optionWrapper: {
    width: '40%',
    margin: 5,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    borderWidth : 2,
    borderColor: '#3D843D',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 4,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ComicNeue_700Bold',
  },
  //!!!!!!!!!!!!!! MODAL STYLES !!!!!!!!!!!!!!!
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#CFFBCD',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3D843D',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000', //Muuttuu tummalla teemalla
    fontFamily: 'ComicNeue_700Bold',
  },
  modalButton: {
    backgroundColor: '#E9C46A',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    borderBlockColor: '#3D843D',
    shadowColor: '#000',
    elevation: 4,
    borderColor: '#F4A261',
    borderWidth: 2,
    fontFamily: 'ComicNeue_700Bold',
  },
  // !!!!! IMAGE TO NUMBER EXCLUSIVE !!!!!
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    margin: 10,
  },
  //!!!!!!!!!! HAJONTA TYYLIT !!!!!!!!!!!!!
  lineContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  taskbox: {
    marginTop: 10,
    zIndex: 4,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#36BA98',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    zIndex: 2,
  },
  circletext: {
    fontSize: 40,
    borderColor: 'black',
    color: 'white',
  },
  numbers: {
    flexDirection: 'row',
    margin: 20,
    zIndex: 3,
  },
  number1: {
    width: 100,
    height: 100,
    backgroundColor: '#E9C46A',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 20,
  },
  number2: {
    width: 100,
    height: 100,
    backgroundColor: '#F4A261',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 20,
  },
  numbertext: {
    fontSize: 40,
  },
  input: {
    fontSize: 40,
  },
  // !!!!!! BACKGROUND KUVA !!!!!!!!
  background: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayInstruction: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  instructionWindow: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: 'brown',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
//!!!!!! ANIMATION !!!!!!!!!
  backgroundAnimation: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foxContainer: {
    position: 'absolute',
    bottom: 25, // Position the fox a little above the bottom
    left: -150, // Start from the left side
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Position between background (zIndex: 1) and overlay (zIndex: 3)
  },
  overlayContainer: {
    position: 'absolute',
    width: 2250,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3, // Ensure overlay is on top
  },
  overlayImage: {
    width: '100%', // Adjust as necessary to make the image visible
    height: '100%', // Ensure this height allows it to fit properly
  },
  buttonContainer1: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    justifyContent: 'space-between',
    width: '90%',
    zIndex: 4,
  },
  foxImage: {
    width: 150, // Adjust size as needed
    height: 250, // Adjust size as needed
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  content: {
    padding: 0,
    //zIndex: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  taskText: {
    fontSize: 14,
    marginBottom: 8,
    color: 'white'
  },
  closeText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  //!!!!!! TASK WINDOW !!!!!!!
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows items to wrap in the container
    justifyContent: 'center', // Center items
    alignItems: 'center', // Center items vertically
    width: '100%', // You can adjust the width as needed
    marginTop: 30
  },
  taskContainer: {
    width: '45%', // Each item takes almost half the width for 2 items in a row
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskImage: {
    width: 60, // Adjust size as needed
    height: 60, // Adjust size as needed
    resizeMode: 'contain',
  },
  //!!!!!! COMPARISON !!!!!!!
  comparisonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%"
  },
  comparisonGuideBigger: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FFDE21'
  },
  comparisonGuideSmaller: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#00FFFF'
  },
  comparisonOptions: {
    width: "80%",
    height: "7%",
    fontSize: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 16,
    backgroundColor: '#3bb143'
  },
  //!!!!!!!!!!!!!! PROFILE STYLES !!!!!!!!!!!!!!!
  //
  profilebox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3D843D',
  }, //
  profileImage: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    backgroundColor: '#F4A261',
    margin: 20,
    borderRadius: 20,
  },
  //??????????????/* NO ONE USES THIS
  /*
  imageOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
   marginTop: 20,
  },/* NO ONE USES THIS
  imageOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },/* NO ONE USES THIS
  profileImageOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },*/
  chooseProfile:{
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 10,
    margin: 10,
    width: 150,
    height: 150,
    backgroundColor: 'lightblue'
  },//
  addIcon: {
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 10
  },//
  picProfile:{
    width: 150,
    height: 150,
    borderRadius: 10,
  },//
  profileSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
   // margin: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3D843D',
  }, /////////////////////////// Checked profile styles
  //Vasaroiden tausta
  iconBackground: {
    backgroundColor: '#f0f0f0', // Yhteinen taustaväri
    padding: 20, // Tila vasaroiden ympärillä
    margin: 10, // Tila tausta-alueen ympärillä
    borderRadius: 12, // Pyöristetyt kulmat
    flexDirection: 'row', // Ikonit samalle riville
    flexWrap: 'wrap', // Siirry seuraavalle riville, jos tila ei riitä
    justifyContent: 'center', // Keskitetään ikonit vaakasuunnassa
    alignItems: 'center', // Keskitetään ikonit pystysuunnassa
    borderWidth: 1, // Lisää reunus (valinnainen)
    borderColor: '#ccc', // Reunuksen väri (valinnainen)
  }, 
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
},
pickerContainer: {
    width: '100%',
},

pickerWrapper: {
    width: '100%',
    marginBottom: 20,
},
picker: {
    height: 50,
},
pickerContainer: {
  width: '100%',
},

pickerWrapper: {
  width: '100%',
  marginBottom: 20,
},
picker: {
  height: 50,
},

imageContainer: {
  marginTop: 20,
  alignItems: 'center',
},
image: {
  width: 100,
  height: 100,
},
});
