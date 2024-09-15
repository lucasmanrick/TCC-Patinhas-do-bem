import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Importar corretamente para inicializar com AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCKWDrDke8yuwxa6ovNKMKZ81Vt1gXO6cs",
    authDomain: "patinhasdobem-f25f8.firebaseapp.com",
    projectId: "patinhasdobem-f25f8",
    storageBucket: "patinhasdobem-f25f8.appspot.com",
    messagingSenderId: "555367953315",
    appId: "1:555367953315:web:3cfb7883a5f9ad77e8e016"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializar Firebase Auth com persistência usando AsyncStorage
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
