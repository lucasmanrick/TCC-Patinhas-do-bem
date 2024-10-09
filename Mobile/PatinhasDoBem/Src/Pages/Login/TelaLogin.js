import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Ícones do Ionicons
import api from '../../Service/tokenService'; // Importa o Axios já configurado
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font'; // Importa a biblioteca de fontes
import { auth } from '../../Firebase/FirebaseConfig';

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
   
      if (user) {
        this.setState({ loggedInUser: user.email }); // Armazena o email do usuário logado
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

    if (!Email || !Senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return; // Verifica se os campos estão preenchidos
    }

    try {
      const response = await api.post('/Login', {
        Email,
        Senha,
      });

      console.log('Resposta do backend:', response.data); // Verifique a resposta do backend aqui

      if (response.data.auth) {
        console.log("feito login");
        

          this.props.navigation.navigate('Home');
        } else {
          this.setState({ errorMessage: 'Usuarío inválido.' });
          console.log('Login invalido');
        }
      
    } catch (error) {
      console.log('Erro ao fazer login:', error);
      this.setState({ errorMessage: 'Erro ao conectar ao servidor. Tente novamente.' });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0} // Ajuste conforme necessário
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Image
              source={{
                uri: 'https://img.freepik.com/fotos-gratis/colagem-de-animal-de-estimacao-bonito-isolada_23-2150007407.jpg?w=740&t=st=1726268282~exp=1726268882~hmac=a7b97e6ec229c718b75f0a9c6b6f2c0b6f948559714034c5cf6312780321d2b6',
              }}
              style={{ marginTop: -100, width: 460, height: 350 }}
            />
            {this.state.fontLoaded && ( // Verifica se a fonte está carregada
              <Text style={styles.greeting}>{`Bem-vindo ao\nPatinhas do Bem`}</Text>
            )}

            <View style={styles.errorMessage}>
              {!!this.state.errorMessage && (
                <Text style={styles.error}>{this.state.errorMessage}</Text>
              )}
              {!!this.state.loggedInUser && (
                <Text style={styles.success}>Logado como: {this.state.loggedInUser}</Text>
              )}
            </View>

            <View style={{ marginTop: 140, justifyContent: 'flex-end', marginBottom: 30 }}>
              <View style={styles.form}>
                <Text style={styles.inputTitle}>Endereço de E-mail</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#134973" />
                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={(Email) => this.setState({ Email })}
                    value={this.state.Email}
                    placeholder="Digite seu e-mail"
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
                    placeholder="Digite sua senha"
                  />
                </View>
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
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4", // Ajuste de fundo
  },
  greeting: {
    marginTop: -180,  // Mantém o título onde está
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFF", // Ajuste a cor aqui: #FF8C00 (laranja) ou #134973 (azul escuro)
    fontFamily: 'Kavoon', // Aplicando a fonte Kavoon
    borderColor: '#134973', // Cor da borda do título (Azul escuro)
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
  success: {
    color: "#134973",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 24, // Reduzimos o espaço entre os campos
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
    marginBottom: 20,  // Ajusta o espaçamento abaixo do botão
  },
});

export default LoginScreen;
