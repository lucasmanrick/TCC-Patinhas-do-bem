import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria uma instância do Axios
const api = axios.create({
  baseURL: 'http://192.168.2.253:500',
  headers: {
    'Content-Type': 'application/json',
  },
   // URL base da sua API
});

// Adiciona o interceptor para incluir o token JWT no cabeçalho de todas as requisições
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('jwtToken'); // Recupera o token do AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  export default api; 
