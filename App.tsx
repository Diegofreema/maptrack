import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

import AuthContextProvider from './context/AuthContext';

import Main from './Main';

export default function App() {
  return (
    <AuthContextProvider>
      <StatusBar style="auto" />
      <Main />
    </AuthContextProvider>
  );
}
