import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import StartScreen from './screens/StartScreen';
import ImageToNumber from './screens/ImageToNumber';
import SoundToNumber from './screens/SoundToNumber';
import Bonds from './screens/Bonds';
import Comparison from './screens/Comparison';
import Animation from './screens/Animation';
import { ScoreProvider } from './components/ScoreContext';
import styles from './styles';



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
      case 'Animation':
        return <Animation onBack={() => setSelectedTask(null)}  setSelectedTask={setSelectedTask}/>
      default:
        return <StartScreen onNavigate={setSelectedTask} />;
    }
  };

  return (
    <ScoreProvider>
      <View style={styles.container}>
        {renderTask()}
        <StatusBar style="auto" />
      </View>
    </ScoreProvider>
  );
}
