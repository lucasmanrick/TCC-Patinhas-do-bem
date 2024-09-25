import api from './tokenService';

// Exemplo de requisição já autenticada
fetchData = async () => {
  try {
    const response = await api.get('/protectedRoute'); // O token será automaticamente adicionado
    console.log('Dados recebidos:', response.data);
  } catch (error) {
    console.error('Erro na requisição autenticada:', error.response || error.message);
  }
};
