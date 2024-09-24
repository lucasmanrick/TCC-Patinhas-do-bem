import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.2.253:5500', // Insira aqui o endereço base da sua API
});

export default api;