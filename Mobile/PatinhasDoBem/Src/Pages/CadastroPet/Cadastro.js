import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Certifique-se de ter o pacote instalado
import api from '../../Service/tokenService'; // Supondo que seu serviço de API esteja configurado

const CadastroPet = ({ navigation }) => {
  const [TipoAnimal, setTipoAnimal] = useState('');
  const [Linhagem, setLinhagem] = useState('');
  const [Idade, setIdade] = useState('');
  const [Sexo, setSexo] = useState('');
  const [Cor, setCor] = useState('');
  const [Descricao, setDescricao] = useState('');

  const cadastrarPet = async () => {
    // Validações dos campos
    if (!TipoAnimal || !Linhagem || !Idade || !Sexo || !Cor || !Descricao) {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios.');
      return;
    }

    if (isNaN(Idade)) {
      Alert.alert('Erro', 'A idade deve ser um número.');
      return;
    }

    try {
      // Obter o token JWT armazenado
      const token = await AsyncStorage.getItem('@CodeApi:token');

      if (!token) {
        Alert.alert('Erro', 'Você precisa estar autenticado para cadastrar um pet.');
        return;
      }

      
      const dataRegistro = new Date().toISOString(); 
      const IDDoador = token; 

      const response = await api.post(
        '/CadastraPet',
        {
            dataRegistro: new Date().toISOString(), // Certifique-se de que isso está correto
            TipoAnimal,
            Linhagem,
            Idade: Number(Idade), // Assegure-se que a Idade é um número
            Sexo,
            Cor,
            Descricao,
            IDDoador: token // Certifique-se que este é o ID do doador
          },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token JWT nos headers
          },
        }
      );

      // Verificar a resposta do backend
      if (response.data.success) {
        Alert.alert('Sucesso', response.data.success);
        navigation.navigate('Home'); // Navega para a tela principal
      } else {
        Alert.alert('Erro', response.data.error || 'Não foi possível cadastrar o pet.');
      }
    } catch (error) {
      console.log('Erro:', error); // Exibir o erro no console para ajudar na depuração
      if (error.response) {
        Alert.alert('Erro', `Erro do servidor: ${error.response.data.message}`);
      } else {
        Alert.alert('Erro', 'Erro ao conectar com o servidor.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo de Animal"
        value={TipoAnimal}
        onChangeText={setTipoAnimal}
      />
      <TextInput
        style={styles.input}
        placeholder="Linhagem"
        value={Linhagem}
        onChangeText={setLinhagem}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={Idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={Sexo}
        onChangeText={setSexo}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor"
        value={Cor}
        onChangeText={setCor}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={Descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Button title="Cadastrar Pet" onPress={cadastrarPet} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#134973',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default CadastroPet;
