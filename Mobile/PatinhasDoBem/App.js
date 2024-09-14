import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from './Src/Pages/Login/TelaLogin';
import TelaLoading from './Src/Pages/Loading/TelaLoading';
import TelaInicial from './Src/Pages/Home/TelaInicial';
import TelaDeRegistro from './Src/Pages/Register/TelaDeRegistro';
import TelaDeApresentacao from './Src/Pages/TelaApresentacao/TelaApresentacao';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaApresentacao">

      <Stack.Screen
          name="TelaApresentacao"
          component={TelaDeApresentacao}
          options={{ headerShown: false }} // Oculta o header
        />

        <Stack.Screen
          name="Loading"
          component={TelaLoading}
          options={{ headerShown: false }} // Oculta o header
        />
        <Stack.Screen
          name="Login"
          component={TelaLogin}
          options={{ headerShown: false }} // Oculta o header
        />
        <Stack.Screen
          name="Home"
          component={TelaInicial}
          options={{ headerShown: false }} // Oculta o header
        />
        <Stack.Screen
          name="Register"
          component={TelaDeRegistro}
          options={{ headerShown: false }} // Oculta o header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
