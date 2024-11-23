import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './components/ThemeContext';
import { ScoreProvider } from './components/ScoreContext';
import { SoundSettingsProvider } from './components/SoundSettingsContext';
import { TaskReadingProvider } from './components/TaskReadingContext';
import { TaskSyllabificationProvider } from './components/TaskSyllabificationContext';
import { BackgroundMusicProvider } from './components/BackgroundMusicContext';
import { View } from 'react-native';  // Import required components for icons
import TopBarComponent from './components/TopBarComponent'

import StartScreen from './screens/StartScreen';
import ImageToNumber from './screens/ImageToNumber';
import SoundToNumber from './screens/SoundToNumber';
import Bonds from './screens/Bonds';
import Comparison from './screens/Comparison';
import Settings from './screens/Settings';
import Animation from './screens/Animation';
import WelcomeScreen from './screens/WelcomeScreen';
import SelectProfile from './screens/SelectProfile';
import UserCreation from './components/UserCreation';
import ProfileScreen from './screens/ProfileScreen';
import CreateProfile from './screens/CreateProfile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <BackgroundMusicProvider>
      <TaskSyllabificationProvider>
        <ThemeProvider>
          <ScoreProvider>
            <SoundSettingsProvider>
              <TaskReadingProvider>
                <NavigationContainer>
                  <TopBarComponent />
                  <Stack.Navigator initialRouteName="StartScreen">
                    <Stack.Screen name="StartScreen" component={StartScreen} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="UserCreation" component={UserCreation} />
                    <Stack.Screen name="SelectProfile" component={SelectProfile} />
                    <Stack.Screen name="CreateProfile" component={CreateProfile} />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                    <Stack.Screen name="Animation" component={Animation} />
                    <Stack.Screen name="ImageToNumbers" component={ImageToNumber} />
                    <Stack.Screen name="SoundToNumbers" component={SoundToNumber} />
                    <Stack.Screen name="Bonds" component={Bonds} />
                    <Stack.Screen name="ComparisonOperators" component={Comparison} />
                  </Stack.Navigator>
                </NavigationContainer>
              </TaskReadingProvider>
            </SoundSettingsProvider>
          </ScoreProvider>
        </ThemeProvider>
      </TaskSyllabificationProvider>
    </BackgroundMusicProvider>
  );
}
