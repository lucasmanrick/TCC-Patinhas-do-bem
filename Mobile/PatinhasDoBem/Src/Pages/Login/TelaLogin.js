import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Ícones do Ionicons
import api from '../../Service/tokenService'; // Importa o Axios já configurado
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font'; // Importa a biblioteca de fontes

class LoginScreen extends Component {
  state = {
    Email: '',
    Senha: '',
    loggedInUser: null,
    errorMessage: null,
    fontLoaded: false, // Estado para verificar se a fonte está carregada
  };

  async componentDidMount() {
    await this.loadFonts(); // Carrega as fontes
    const token = await AsyncStorage.getItem('@codeApi:token');

    if (token && user) {
      this.setState({ loggedInUser: user });
    }
  }

  // Função para carregar a fonte
  loadFonts = async () => {
    await Font.loadAsync({
      'Kavoon': require('../../../assets/font/Kavoon-Regular.ttf'), // Caminho da fonte
    });
    this.setState({ fontLoaded: true }); // Atualiza o estado
  };

  handleLogin = async () => {
    const { Email, Senha } = this.state;

    try {
      const response = await api.post('/Login', {
        Email,
        Senha,
      });

      console.log('Resposta do backend:', response.data); // Verifique a resposta do backend aqui

      if (response.data.auth) {
        const { token } = response.data;

        if (token) { // Agora verificamos apenas o token
          await AsyncStorage.multiSet([
            ['@CodeApi:token', token],
          ]);

          this.props.navigation.navigate('Home');
        } else {
          this.setState({ errorMessage: 'Token inválido.' });
          console.log('Token inválido:', token);
        }
      } else {
        this.setState({ errorMessage: response.data.error });
      }
    } catch (error) {
      console.log('Erro ao fazer login:', error);
      this.setState({ errorMessage: 'Erro ao conectar ao servidor. Tente novamente.' });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image
          source={require("../../../assets/image/ImagenLogin.jpg")}
          style={{ marginTop: -10, width: 460, height: 150 }}
        />
        {this.state.fontLoaded && ( // Verifica se a fonte está carregada
          <Text style={styles.greeting}>{`Bem-vindo ao\nPatinhas do Bem`}</Text>
        )}
        <View style={styles.errorMessage}>
          {!!this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
          {!!this.state.loggedInUser && (
            <Text style={styles.error}>{this.state.loggedInUser}</Text>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Endereço de E-mail</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#134973" />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(Email) => this.setState({ Email })}
              value={this.state.Email}
            />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Senha</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#134973" />
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(Senha) => this.setState({ Senha })}
              value={this.state.Senha}
            />
          </View>
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
            <Text style={{ fontWeight: "500", color: "#134973" }}>
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
    color: "#000", // Cor do texto principal
    fontFamily: 'Kavoon', // Aplicando a fonte Kavoon
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#134973", // Cor da borda do campo de input
    borderBottomWidth: 1,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#134973", // Cor do botão
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
