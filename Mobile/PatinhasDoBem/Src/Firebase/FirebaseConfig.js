// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Importar o módulo de autenticação

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
const auth = getAuth(firebaseApp);

export { auth };