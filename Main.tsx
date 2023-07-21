import { NavigationContainer } from '@react-navigation/native';

import AuthScreen from './screens/AuthScreen';
import LocationScreen from './screens/LocationScreen';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Main = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name={'LocationScreen'} component={LocationScreen} />
        ) : (
          <Stack.Screen name={'AuthScreen'} component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
