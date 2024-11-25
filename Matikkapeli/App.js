import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, ActivityIndicator  } from 'react-native';
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
import { TaskSyllabificationProvider } from './components/TaskSyllabificationContext';
import { BackgroundMusicProvider } from './components/BackgroundMusicContext';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import Animation from './screens/Animation';
import TopBarComponent from './components/TopBarComponent';
import ProfileScreen from './screens/ProfileScreen';
import { firestore } from './firebase/Config';
import SelectProfile from './screens/SelectProfile';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';

export default function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [profileImage, setProfileImage] = useState(require('./assets/images/norsu.png')); // Oletusprofiilikuva
  const [isProfileScreen, setIsProfileScreen] = useState(false);
  const [fontsLoaded] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  const renderTask = () => {
    if (isProfileScreen) {
      return <ProfileScreen onBack={() => setIsProfileScreen(false)} />;
    }
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
          return (
            <Settings
              onBack={() => setSelectedTask(null)}
              onProfileImageChange={setProfileImage} // Pass down the profile image update function
            />
          );
      case 'Animation':
        return <Animation onBack={() => setSelectedTask(null)} setSelectedTask={setSelectedTask}/>
      case 'SelectProfile':
        return <SelectProfile onBack={() => setSelectedTask(null)} />;
      case 'SelectProfile':
        return <SelectProfile onBack={() => setSelectedTask(null)} />;
      default:
        return <StartScreen onNavigate={setSelectedTask} />;
    }
  };

  return (
    <BackgroundMusicProvider>   
      <TaskSyllabificationProvider> 
        <ThemeProvider>
          <ScoreProvider>
            <SoundSettingsProvider>
              <TaskReadingProvider>
              {selectedTask !== 'Settings' && selectedTask !== 'SelectProfile' && <TopBarComponent profileImage={profileImage} />}
                <View style={styles.container}>
                  {renderTask()}
                  <StatusBar style="auto" />

                  {selectedTask && (
                    <TouchableOpacity
                      style={styles.backIcon}
                      onPress={() => setSelectedTask(null)}
                    >
                      <Ionicons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                  )}

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
      </TaskSyllabificationProvider>
    </BackgroundMusicProvider>
  );
}