import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Usando react-navigation/bottom-tabs
import { FontAwesome } from "react-native-vector-icons";

import TelaLogin from './Src/Pages/Login/TelaLogin';
import TelaLoading from './Src/Pages/Loading/TelaLoading';
import TelaInicial from './Src/Pages/Home/TelaInicial';
import TelaDeRegistro from './Src/Pages/Register/TelaDeRegistro';
import TelaDeApresentacao from './Src/Pages/TelaApresentacao/TelaApresentacao';
import TelaDeMensagem from './Src/Pages/Chat/TelaContato';
import TelaDeNotificacao from './Src/Pages/Notification/TelaDeNotificacao';
import TelaDePerfil from './Src/Pages/Profile/TelaDePerfil';
import TelaDePost from './Src/Pages/Post/TelaPost';

// Criando o Stack Navigator
const Stack = createNativeStackNavigator();

// Criando o Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Configurando as Tabs (Home, Mensagem, Notificação, Perfil)
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          let iconStyle = {}; // Estilo para aplicar o sombreamento

          if (route.name === 'Home') {
            iconName = 'home';
            size = '24'
          } else if (route.name === 'Mensagem') {
            iconName = 'comments';
            size = '24'
          } else if (route.name === 'Post') {
            iconName = 'plus-circle';
            size = focused ? 50 : 40; // Maior quando focado
            color = '#3DAAD9'; // Cor personalizada
            iconStyle = {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 10, // Para Android
            }; // Efeito de sombra
          } else if (route.name === 'Notificação') {
            iconName = 'bell';
            size = '24'
          } else if (route.name === 'Perfil') {
            iconName = 'user';
            size = '24'
          }

          return (
            <FontAwesome
              name={iconName}
              size={size}
              color={color}
              style={route.name === 'Post' ? { ...iconStyle, marginBottom: 0 } : {}}
            />
          );
        },
        tabBarShowLabel: false, // Remove os nomes
      })}
      tabBarOptions={{
        activeTintColor: '#3DAAD9',
        inactiveTintColor: 'gray',
        style: { height: 70 }, // Aumenta a altura da barra para dar mais espaço ao ícone
      }}
    >
      <Tab.Screen name="Home" component={TelaInicial} />
      <Tab.Screen name="Mensagem" component={TelaDeMensagem} />
      <Tab.Screen name="Post" component={TelaDePost} />
      <Tab.Screen name="Notificação" component={TelaDeNotificacao} />
      <Tab.Screen name="Perfil" component={TelaDePerfil} />
    </Tab.Navigator>

  );
}

// Configuração do App com Stack Navigator
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
          name="Register"
          component={TelaDeRegistro}
          options={{ headerShown: false }} // Oculta o header
        />

        {/* Tela Home agora usa Bottom Tabs */}
        <Stack.Screen
          name="Home"
          component={HomeTabs} // Aqui a Home será o Bottom Tab Navigator
          options={{ headerShown: false }} // Oculta o header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
