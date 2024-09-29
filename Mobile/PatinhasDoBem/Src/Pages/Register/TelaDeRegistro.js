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
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios"; // Importando axios
import api from "../../Service/tokenService";

class TelaRegistro extends Component {
  state = {
    NomeUsuario: "",
    DataNasc: "",
    Email: "",
    Senha: "",
    Cep: "",
    Rua: "",
    Numero: "",
    Bairro: "",
    Cidade: "",
    Estado: "",
    confirmarSenha: "",
    dataNascimento: new Date(),
    showDatePicker: false,
    fontLoaded: false,
  };

  async componentDidMount() {
    await this.loadFonts();
  }

  loadFonts = async () => {
    await Font.loadAsync({
      Kavoon: require("../../../assets/font/Kavoon-Regular.ttf"),
    });
    this.setState({ fontLoaded: true });
  };

  fetchAddressByCep = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;

      if (logradouro) {
        this.setState({
          Rua: logradouro,
          Bairro: bairro,
          Cidade: localidade,
          Estado: uf,
        });
      } else {
        Alert.alert("Erro", "CEP não encontrado.");
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao buscar o endereço: " + error.message
      );
    }
  };

  handleCepChange = (cep) => {
    this.setState({ Cep: cep });
    if (cep.length === 8) {
      this.fetchAddressByCep(cep);
    }
  };

  handleRegister = async () => {
    const {
      NomeUsuario,
      Email,
      Senha,
      confirmarSenha,
      Cep,
      Rua,
      Numero,
      Bairro,
      Cidade,
      Estado,
      dataNascimento,
    } = this.state;

    if (Senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (
      !NomeUsuario ||
      !Email ||
      !Senha ||
      !Cep ||
      !Rua ||
      !Numero ||
      !Bairro ||
      !Cidade ||
      !Estado
    ) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(Email)) {
      Alert.alert("Erro", "Insira um endereço de e-mail válido.");
      return;
    }

    const formattedDate = dataNascimento.toISOString().split("T")[0];

    // Log dos dados que serão enviados
    console.log("Dados a serem enviados:", {
      NomeUsuario,
      DataNasc: formattedDate,
      Email,
      Senha,
      Cep,
      Rua,
      Numero,
      Bairro,
      Cidade,
      Estado,
    });

    try {
      const response = await api
        .post("/Cadastro", {
          NomeUsuario,
          DataNasc: formattedDate,
          Email,
          Senha,
          Cep,
          Rua,
          Numero,
          Bairro,
          Cidade,
          Estado,
        })
        .then((e) => Alert.alert("Sucesso", "Cadastro realizado com sucesso!"));
    } catch (error) {
      if (error.response) {
        console.error("Response Error:", error.response.data);
        Alert.alert(
          "Erro",
          error.response.data.message ||
            "Ocorreu um erro ao registrar o usuário."
        );
      } else {
        console.error("Network Error:", error.message);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao registrar o usuário: " + error.message
        );
      }
    }
  };

  showDatepicker = () => {
    this.setState({ showDatePicker: true });
  };

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.dataNascimento;
    this.setState({ showDatePicker: false, dataNascimento: currentDate });
  };

  renderInput(
    title,
    iconName,
    stateKey,
    keyboardType = "default",
    placeholder = "",
    secureTextEntry = false,
    editable = true
  ) {
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
              if (stateKey === "Cep") {
                this.handleCepChange(value);
              } else {
                this.setState({ [stateKey]: value });
              }
            }}
            value={this.state[stateKey]}
            editable={editable}
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
          source={{
            uri: "https://img.freepik.com/fotos-gratis/colagem-de-animal-de-estimacao-bonito-isolada_23-2150007407.jpg?w=740&t=st=1726268282~exp=1726268882~hmac=a7b97e6ec229c718b75f0a9c6b6f2c0b6f948559714034c5cf6312780321d2b6",
          }}
          style={{ marginTop: -100, width: 460, height: 350 }}
        />
        {this.state.fontLoaded && (
          <Text style={styles.greeting}>{`Bem-vindo ao\nPatinhas do Bem`}</Text>
        )}

        <TouchableOpacity style={styles.avatar}>
          <Ionicons
            name="add-outline" // Corrigir o nome do ícone
            size={40}
            color="#fff"
            style={{ marginTop: 6 }}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {this.renderInput("Nome", "person-outline", "NomeUsuario")}
          {this.renderInput("CEP", "pin", "Cep", "numeric")}
          {this.renderInput(
            "Rua",
            "home-outline",
            "Rua",
            "default",
            "",
            false,
            false
          )}
          {this.renderInput("Número", "pin", "Numero", "numeric")}
          {this.renderInput(
            "Bairro",
            "home",
            "Bairro",
            "default",
            "",
            false,
            false
          )}
          {this.renderInput(
            "Cidade",
            "location-outline",
            "Cidade",
            "default",
            "",
            false,
            false
          )}
          {this.renderInput(
            "Estado",
            "flag",
            "Estado",
            "default",
            "",
            false,
            false
          )}

          {/* Campo de Data de Nascimento */}
          <View style={styles.form}>
            <Text style={styles.inputTitle}>Data de Nascimento</Text>
            <TouchableOpacity
              onPress={this.showDatepicker}
              style={styles.inputContainer}
            >
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
                style={{ width: "100%" }}
              />
            )}
          </View>

          {this.renderInput(
            "Endereço de E-mail",
            "mail-outline",
            "Email",
            "none"
          )}
          {this.renderInput(
            "Senha",
            "lock-closed-outline",
            "Senha",
            "none",
            null,
            true
          )}
          {this.renderInput(
            "Confirmar Senha",
            "lock-closed-outline",
            "confirmarSenha",
            "none",
            null,
            true
          )}

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
    marginTop: -200,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Kavoon",
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
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#134973",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  input: {
    height: 40,
    flex: 1,
    color: "#134973",
    paddingHorizontal: 10,
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#134973",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E1E2E6",
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center", // Centraliza o botão na tela
  },
});

export default TelaRegistro;
