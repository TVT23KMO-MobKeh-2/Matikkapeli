import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { ScoreProvider } from './components/ScoreContext';
import { SoundSettingsProvider } from './components/SoundSettingsContext';
import { TaskReadingProvider } from './components/TaskReadingContext';
import { TaskSyllabificationProvider } from './components/TaskSyllabificationContext';
import { BackgroundMusicProvider } from './components/BackgroundMusicContext';
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
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';
import { TimerProvider } from './components/TimerProvider';


const Stack = createStackNavigator();

export default function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [profileImage, setProfileImage] = useState(require('./assets/images/norsu.png')); // Oletusprofiilikuva
  const [isProfileScreen, setIsProfileScreen] = useState(false);

  const [fontsLoaded] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" center="center" />;
  }


  return (
    
    <BackgroundMusicProvider>
      <TaskReadingProvider>
        <TaskSyllabificationProvider>
          <ThemeProvider>
            <TimerProvider>
            <ScoreProvider>
              <SoundSettingsProvider>
                <NavigationContainer>
                  <View style={{ flex: 1 }}>
                    <Stack.Navigator
                      initialRouteName="StartScreen"
                      screenOptions={{
                        header: () => <TopBarComponent />,
                        headerStyle: {
                          height: 60,
                        } // Replaces default header with TopBarComponent
                      }}
                    >
                      <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }}/>
                      <Stack.Screen
                      name="Settings"
                      component={Settings}
                      options={{ headerShown: false }}
                    />
                      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
                      <Stack.Screen name="UserCreation" component={UserCreation} options={{ headerShown: false }}/>
                      <Stack.Screen
                      name="SelectProfile"
                      component={SelectProfile}
                      options={{ headerShown: false }}
                    />
                      <Stack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: false }}/>
                      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                      <Stack.Screen name="Animation" component={Animation} options={{ headerShown: false }}/>
                      <Stack.Screen name="ImageToNumbers" component={ImageToNumber} />
                      <Stack.Screen name="SoundToNumbers" component={SoundToNumber} />
                      <Stack.Screen name="Bonds" component={Bonds} />
                      <Stack.Screen name="ComparisonOperators" component={Comparison} />
                    </Stack.Navigator>
                  </View>
                </NavigationContainer>
              </SoundSettingsProvider>
            </ScoreProvider> 
            </TimerProvider>
          </ThemeProvider>
        </TaskSyllabificationProvider>
      </TaskReadingProvider>
    </BackgroundMusicProvider>
   
  );
}