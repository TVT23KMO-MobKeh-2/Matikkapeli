import { StyleSheet } from 'react-native';

//1. appwide styles: container, background, texts
//2. top bar styles
//3. settings exclusive styles
//4. modal styles
//5. instructions
//6. animation styles
//7. task window styles
//8. profile styles
//9. commonly used buttons and "containers" (like start button and "optionstyles".)
//10. game exclusive styles
//export default (theme) => StyleSheet.create({
const createStyles = (theme) => StyleSheet.create({
  //!!!!!!!!!!!!!! COMMON STYLES!!!!!!!!!!!!!!
  safeContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1, //Varmistaa koko näytön korkeuden
    width: '100%', //Täyttää näytön leveyssuunnassa
    justifyContent: 'center',
    alignItems: 'center', // Varmistaa, että sisältö ei mene top barin alle
  },
  tehtcont: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90, // Varmistaa, että tehtävä tulee keskelle
    flex: 1,
  },
  background: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //!!!!!!!!! COMMON USED TEXTS !!!!!!!!!!!
  title: {
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ComicNeue_700Bold',
    backgroundColor: theme.titlebg,
    borderRadius: 5,
    padding: 10,
    color: theme.text,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
    marginBottom: 5,
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
  },
  label2: {
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'ComicNeue_700Bold',
    textAlign: 'center',
    color: theme.text,
  },
  //!!!! NAVIGAATIO IKONIT !!!!!
  //Käytetäänkö?
  /*
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
  },*/
  //!!!!! Top Bar Styles !!!!!!!
  topBarContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.topbarbg,
    borderWidth: 2,
    borderColor: theme.bordercolor,
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
    color: theme.text,
  },
  topBarLevelAndPoints: {
    fontSize: 16,
    fontFamily: 'ComicNeue_400Regular',
    color: theme.text,
  },
  //!!!!!!!!SETTINGS EXCLUSIVE!!!!!!!!!!!!
  /* settingItemContainer: {
     width: '100%',
     paddingHorizontal: 10,
     marginVertical: 10, 
     alignItems: 'stretch', 
   },*/
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    backgroundColor: theme.settingbg, // Pale green
    borderRadius: 8,
    borderColor: theme.bordercolor,
    borderWidth: 2,
    padding: 10,
    width: '100%',
  },
  settingItemColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    backgroundColor: theme.settingbg,
    padding: 10,
    borderRadius: 8,
    borderColor: theme.bordercolor,
    borderWidth: 2,
    width: '100%',
  },//?????
  /*level: {
    fontSize: 20,
    color: '#6c9b40', 
    marginBottom: 20,
  },*/
  slider: {
    width: '100%',
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
    backgroundColor: theme.settingbg,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.bordercolor,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: theme.text, //Muuttuu tummalla teemalla
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
  },
  modalButton: {
    backgroundColor: theme.button,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    elevation: 4,
    borderColor: theme.color,
    borderWidth: 2,
    fontFamily: 'ComicNeue_700Bold',
  },
  // !!!!!!!!! INSTRUCTIONS !!!!!!!!!
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
  //!!!!!! ANIMATION !!!!!!!!!
  backgroundAnimation: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40,
    left: 8,
    justifyContent: 'space-between',
    width: '90%',
    zIndex: 4,
  },

  characterImage: {
    width: 170, // Adjust size as needed
    height: 270, // Adjust size as needed
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
    color: theme.text,
  },
  taskText: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.text,
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
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    padding: 2,
    borderWidth: 1,
  },
  imageWrapper: {
    borderRadius: 50,
    padding: 3,
    shadowColor: 'darkblue',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  taskImage: {
    width: 60, // Adjust size as needed
    height: 60, // Adjust size as needed
    borderRadius: 50,
    resizeMode: 'contain',
  },
  //!!!!!!!!!!!!!! PROFILE STYLES !!!!!!!!!!!!!!!
  profilebox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.topbarbg,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.bordercolor,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative'
  },
  changeProfileImage: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'blue',
    borderRadius: 24,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  changeIcon: {
    margin: 0,
    padding: 0,

  },
  profileImage: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    backgroundColor: theme.color,
    margin: 20,
    borderRadius: 20,
  },
  imageSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 10,
    padding: 20,
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it's on top
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  imageSelection: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginRight: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chooseProfile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
    width: 150,
    height: 150,
    backgroundColor: 'lightblue'
  },
  addIcon: {
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 10
  },
  picProfile: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  profileSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // margin: 10,
    alignItems: 'center',
    backgroundColor: theme.topbarbg,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: theme.bordercolor,
  },
  //SECOND INPUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  //!!!!!!!!!!!!!! used pretty commonly !!!!!!!!!!!!!
  startButton: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.bordercolor2,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 4,
  },

  orangeButton: {
    backgroundColor: theme.color,
  },

  greenButton: {
    backgroundColor: theme.color5,
  },

  redButton: {
    backgroundColor: theme.color4,
  },

  blueButton: {
    backgroundColor: theme.color3,
  },


  nextGame: {
    flexDirection: 'row'
  },

  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: theme.settingbg,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.bordercolor,
    width: '80%',
    shadowColor: '#00000',
    elevation: 4,
    padding: 20,
  },
  gameOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: theme.settingbg,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.bordercolor,
    width: '80%',
    shadowColor: '#00000',
    elevation: 4,
    padding: 20,
  },
  optionWrapper: {
    width: '40%',
    margin: 5,
    alignItems: 'center',
  },/*
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
  },/*
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ComicNeue_700Bold',
  },*/
  // !!!!! IMAGE TO NUMBER EXCLUSIVE !!!!!
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '30%',
    backgroundColor: theme.iconbg,
    borderRadius: 12,
    borderWidth: 1, // Lisää reunus (valinnainen)
    borderColor: '#ccc',
    position: 'relative',
  },
  icon: {
    margin: 5,
  },
  iconBackground: {
    margin: 40,
    padding: 10, // Tila vasaroiden ympärillä
    flexDirection: 'row', // Ikonit samalle riville
    flexWrap: 'wrap', // Siirry seuraavalle riville, jos tila ei riitä
    justifyContent: 'center', // Keskitetään ikonit vaakasuunnassa
    alignItems: 'center', // Keskitetään ikonit pystysuunnassa
  },
  //!!!!!!!! COMPARISON  !!!!!!!!!!
  comparisonGuideBigger: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: theme.compbg, // Yellow
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.combbord,
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
  },
  comparisonGuideSmaller: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: theme.combbg2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.combbord2,
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
  },
  comparisonOptions: {
    width: "80%",
    height: "7%",
    fontSize: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 16,
    backgroundColor: theme.color2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.bordercolor3,
    fontFamily: 'ComicNeue_700Bold',
    color: theme.text,
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
    zIndex: 2,
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
    fontFamily: 'ComicNeue_700Bold',
  },
  checkButton: {
    backgroundColor: 'green',
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ComicNeue_700Bold',
  },

  //!!!!!!!!!! Levelbar tyyli !!!!!!!!!!!!!
  progressContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
    borderRadius: 10,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  scaleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333'
  },
  levelImage: {
    width: 40,
    height: 40,
  },

  //Level bar
  levelBarcontainer: {
    width: '70%',
    alignItems: 'center',
    marginTop: 20,
},

progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
},
barAndScaleContainer: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 40,
},
barContainer: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
},
imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
},
progressBar: {
    height: '100%',
    backgroundColor: 'brown',
    borderRadius: 10,
},
scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
},
scaleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
},
levelImage: {
    width: 80,
    height: 90,
    bottom: -15, // Ensures the static image stays in place
    position: 'absolute'
},
});

export default createStyles;