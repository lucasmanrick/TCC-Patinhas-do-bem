const apiUrl = 'http://192.168.70.111:5000';

// Função para fazer uma requisição GET
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
}



(async () => {
  const storageReturn = await fetchData("/")
console.log(storageReturn)
})();