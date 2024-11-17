import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
    marginVertical: 10, // space between buttons
    width: '80%', // set button width
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  background: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  taskbox: {
    zIndex: 4,
  },
  title: {
    fontSize: 24,
    margin: 20,
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
  background: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  taskbox: {
    zIndex: 4,
  },
  title: {
    fontSize: 24,
    margin: 20,
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
    zIndex: 3, // Position between background (zIndex: 1) and overlay (zIndex: 3)
},
overlayContainer: {
    position: 'absolute',
    width: 2250,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure overlay is on top
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
    zIndex: 2,
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
},
comparisonContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
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
//!!!!! Top Bar Styles !!!!!!!
topBarContainer: {
  position: 'absolute',
  top: 40,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(248, 248, 248, 0.7)',
  padding: 10,
  elevation: 4, // Shadow for Android
  shadowColor: '#000', // Shadow for iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
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
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
topBarLevelAndPoints: {
  fontSize: 14,
  color: '#666',
},
settingsButton: {
  padding: 5, 
},
settingsIcon: {
  width: 30,
  height: 30,
  tintColor: "#333", 
},
});
