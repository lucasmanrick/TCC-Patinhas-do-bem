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
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; // Importando axios
import api from '../../Service/tokenService';

class TelaRegistro extends Component {
  state = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '', // Adicionando o campo cidade
    estado: '',
    dataNascimento: new Date(),
    showDatePicker: false,
    fontLoaded: false,
  };

  async componentDidMount() {
    await this.loadFonts();
  }

  loadFonts = async () => {
    await Font.loadAsync({
      'Kavoon': require('../../../assets/font/Kavoon-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  };

  fetchAddressByCep = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data; // Adicionando localidade (cidade)

      if (logradouro) {
        this.setState({
          rua: logradouro,
          bairro: bairro,
          cidade: localidade, // Definindo cidade
          estado: uf,
        });
      } else {
        Alert.alert("Erro", "CEP não encontrado.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao buscar o endereço: " + error.message);
    }
  };

  handleCepChange = (cep) => {
    this.setState({ cep });
    if (cep.length === 8) { // Valida se o CEP tem 8 dígitos
      this.fetchAddressByCep(cep);
    }
  };

  handleRegister = async () => {
    const { nome, email, senha, confirmarSenha, cep, rua, numero, bairro, cidade, estado, dataNascimento } = this.state; // Adicionando cidade

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!nome || !email || !senha || !cep || !rua || !numero || !bairro || !cidade || !estado) { // Validando cidade
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    // Validação simples do formato de email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Insira um endereço de e-mail válido.");
      return;
    }

    // Formatar a data de nascimento
    const formattedDate = dataNascimento.toISOString().split('T')[0];

    try {
      const response = await api.post('/Cadastro', {
        NomeUsuario: nome,
        DataNasc: formattedDate,
        Email: email,
        Senha: senha,
        Cep: cep,
        Rua: rua,
        Numero: numero,
        Bairro: bairro,
        Cidade: cidade, // Enviando cidade
        Estado: estado,
      });

      if (response.data.success) {
        Alert.alert("Sucesso", "Usuário registrado com sucesso!");
        this.props.navigation.navigate("Login");
      } else {
        Alert.alert("Erro", response.data.message || "Ocorreu um erro ao registrar o usuário.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao registrar o usuário: " + error.message);
    }
  };

  showDatepicker = () => {
    this.setState({ showDatePicker: true });
  };

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.dataNascimento;
    this.setState({ showDatePicker: false, dataNascimento: currentDate });
  };

  renderInput(title, iconName, stateKey, keyboardType = "default", placeholder = "", secureTextEntry = false) {
    return (
      <View style={styles.form}>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={styles.inputContainer}>
          <Ionicons name={iconName} size={20} color="#134973" />
          <TextInput
            style={styles.input}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            onChangeText={(value) => {
              // Atualiza o campo de CEP e busca o endereço
              if (stateKey === "cep") {
                this.handleCepChange(value);
              } else {
                this.setState({ [stateKey]: value });
              }
            }}
            value={this.state[stateKey]}
          />
        </View>
      </View>
    );
  }

  render() {
    const { showDatePicker, dataNascimento } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image
          source={require("../../../assets/image/ImagenLogin.jpg")}
          style={{ marginTop: -10, width: 460, height: 150 }}
        />
        {this.state.fontLoaded && (
          <Text style={styles.greeting}>{`Bem-vindo ao\nPatinhas do Bem`}</Text>
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {this.renderInput("Nome", "person-outline", "nome")}
          {this.renderInput("CEP", "pin", "cep", "numeric")}
          {this.renderInput("Rua", "home-outline", "rua")}
          {this.renderInput("Número", "pin", "numero", "numeric")}
          {this.renderInput("Bairro", "home", "bairro")}
          {this.renderInput("Cidade", "location-outline", "cidade")}
          {this.renderInput("Estado", "flag", "estado")}

          {/* Campo de Data de Nascimento */}
          <View style={styles.form}>
            <Text style={styles.inputTitle}>Data de Nascimento</Text>
            <TouchableOpacity onPress={this.showDatepicker} style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#134973" />
              <Text style={styles.input}>
                {dataNascimento.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dataNascimento}
                mode="date"
                display="spinner"
                onChange={this.onChange}
                style={{ width: '100%' }}
              />
            )}
          </View>

          {this.renderInput("Endereço de E-mail", "mail-outline", "email", "none")}
          {this.renderInput("Senha", "lock-closed-outline", "senha", "none", null, true)}
          {this.renderInput("Confirmar Senha", "lock-closed-outline", "confirmarSenha", "none", null, true)}

          <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
            <Text style={{ color: "#fff", fontWeight: "500" }}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignSelf: "center", margin: 32 }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={{ color: "#414959", fontSize: 13 }}>
              Já tem conta?{" "}
              <Text style={{ fontWeight: "500", color: "#134973" }}>
                Faça login
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  greeting: {
    marginTop: -2,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    color: "#000",
    fontFamily: 'Kavoon',
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
    borderBottomColor: "#134973",
    borderBottomWidth: 1,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#134973",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#134973",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TelaRegistro;
