import axios from 'axios';
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Service/tokenService'; // Importa o Axios já configurado

class LoginScreen extends Component {
  state = {
    Email: '',
    Senha: '',
    errorMessage: null,
  };

  // Função para armazenar o token no AsyncStorage
  storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('jwtToken', token);
      console.log("Token salvo com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar o token:', error);
    }
  };

  handleLogin = async () => {
    const { Email, Senha } = this.state;
  
    try {
      const response = await api.post('/Login', { Email, Senha });
      console.log(response.data);
      const { token } = response.data;
  
      if (token) {
        await AsyncStorage.setItem('jwtToken', token); // Salvar o token
        // Redirecionar para a próxima tela
        this.props.navigation.navigate("Home");
      }
    } catch (error) {
      console.error('Erro de login:', error.response || error.message);
      this.setState({ errorMessage: "Erro ao fazer login." });
    }
  };

  // Função para recuperar o token do AsyncStorage
  getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
      return null;
    }
  };

  // Exemplo de requisição autenticada usando o token JWT
  fetchData = async () => {
    const token = await this.getToken(); // Recupera o token

    if (token) {
      try {
        // Fazendo uma requisição GET com o token JWT no cabeçalho
        const response = await api.get('/protectedRoute', {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
          },
        });

        console.log('Dados recebidos:', response.data);
      } catch (error) {
        console.error('Erro na requisição autenticada:', error.response || error.message);
      }
    } else {
      console.error('Token não encontrado. Usuário não autenticado.');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Image
          source={require("../../../assets/ImagenLogin.jpg")}
          style={{ marginTop: -10, width: 460, height: 150 }}
        />

        <Text style={styles.greeting}>{`Bem-vindo ao\nPatinhas do Bem`}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Endereço de E-mail</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(senha) => this.setState({ senha })}
            value={this.state.senha}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
          <Text style={{ color: "#fff", fontWeight: "500" }}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: "center", margin: 32 }}
          onPress={() => this.props.navigation.navigate("Register")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            Não tem conta?{" "}
            <Text style={{ fontWeight: "500", color: "#3DAAD9" }}>
              Cadastre-se
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: -2,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8A8F9E",
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: 1,
    height: 40,
    fontSize: 15,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#3DAAD9",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
