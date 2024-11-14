import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import StartScreen from './screens/StartScreen';
import ImageToNumber from './screens/ImageToNumber';
import SoundToNumber from './screens/SoundToNumber';
import Bonds from './screens/Bonds';
import Comparison from './screens/Comparison';
import Settings from './screens/Settings';
import { ScoreProvider } from './components/ScoreContext';
import { SoundSettingsProvider } from './components/SoundSettingsContext';
import { TaskReadingProvider } from './components/TaskReadingContext';
import { Ionicons } from '@expo/vector-icons';
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
      case 'Settings':
        return <Settings onBack={() => setSelectedTask(null)} />;
      default:
        return <StartScreen onNavigate={setSelectedTask} />;
    }
  };

  return (
    <ThemeProvider>
      <ScoreProvider>
        <SoundSettingsProvider>
          <TaskReadingProvider>
          <View style={styles.container}>
            {renderTask()}

            {/* Back icon, shown on all pages except the StartScreen */}
            {selectedTask && (
              <TouchableOpacity
                style={styles.backIcon}
                onPress={() => setSelectedTask(null)}
              >
                <Ionicons name="arrow-back" size={32} color="black" />
              </TouchableOpacity>
            )}

            {/* Settings icon, hidden on the Settings page */}
            {selectedTask !== 'Settings' && (
              <TouchableOpacity
                style={styles.settingsIcon}
                onPress={() => setSelectedTask('Settings')}
              >
                <Ionicons name="settings-outline" size={32} color="black" />
              </TouchableOpacity>
            )}

            <StatusBar style="auto" />
          </View>
          </TaskReadingProvider>
        </SoundSettingsProvider>
      </ScoreProvider>
    </ThemeProvider>
  );
}
