import { create } from 'apisauce'

// Cria uma instância do Axios
const api = create({
  baseURL: 'http://192.168.0.109:5000',
  
});

api.addResponseTransform(response => {
if(!response.ok) throw response;
});

  
  export default api; 
