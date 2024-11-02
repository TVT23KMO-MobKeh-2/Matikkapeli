import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import StartScreen from './screens/StartScreen';
import ImageToNumber from './screens/ImageToNumber';
import SoundToNumber from './screens/SoundToNumber';
import Bonds from './screens/Bonds';
import Comparison from './screens/Comparison';
import { useState } from 'react';


export default function App() {
  const [selectedTask, setSelectedTask] = useState(null);

  const renderTask = () => {
    switch (selectedTask) {
      case 'ImageToNumbers':
        return <ImageToNumber onBack={() => setSelectedTask(null)} />;
      case 'SoundToNumbers':
        return <SoundToNumber onBack={() => setSelectedTask(null)} />;
      case 'NumberBonds':
        return <Bonds onBack={() => setSelectedTask(null)} />;
      case 'ComparisonOperators':
        return <Comparison onBack={() => setSelectedTask(null)} />;
      default:
        return <StartScreen onNavigate={setSelectedTask} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderTask()} 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
