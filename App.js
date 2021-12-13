import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/*Screens*/
import GoogleLogIn  from './Screens/GoogleLogIn.js';
import FamiliesScreen  from './Screens/FamiliesScreen.js';
import FamilyScreen  from './Screens/FamilyScreen.js';
import MapScreen  from './Screens/MapScreen.js';

/* https://reactnavigation.org/docs/native-stack-navigator/ */


const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Iniciar Sesion" options={{headerShown: false}} component={GoogleLogIn} />
      <Stack.Screen name="Families" component={FamiliesScreen} options={{ title: 'Familias' }} />
      <Stack.Screen name="Family" component={FamilyScreen} options={{ title: 'Familia' }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
