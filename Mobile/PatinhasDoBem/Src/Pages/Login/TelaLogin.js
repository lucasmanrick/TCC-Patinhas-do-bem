import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
} from "react-native";
import { auth } from "../../Firebase/FirebaseConfig"; // Certifique-se de importar corretamente
import { signInWithEmailAndPassword } from "firebase/auth"; // Adicione esta linha para a função correta

export default class TelaLogin extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    email: "",
    senha: "",
    errorMessage: null,
  };

  handleLogin = () => {
    const { email, senha } = this.state;

    // Utilize a função signInWithEmailAndPassword corretamente
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        this.props.navigation.navigate("Home");
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Image
          source={require("../../../assets/ImagenLogin.jpg")}
          style={{marginTop: -10, width: 460, height: 150 }}
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
