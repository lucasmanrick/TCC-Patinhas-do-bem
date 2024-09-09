// TelaDeRegistro.js
import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { auth } from '../../Firebase/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Adicione esta linha

export default class TelaRegistro extends React.Component {
  state = {
    name: "",
    email: "",
    senha: "",
    errorMessage: null,
  };

  handleSignUp = () => {
    const { name, email, senha } = this.state;

    // Use o auth com a função createUserWithEmailAndPassword corretamente
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredentials) => {
        return userCredentials.user.updateProfile({
          displayName: name,
        });
      })
      .then(() => {
        this.props.navigation.navigate("Home");
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.greeting}>{`Bem-vindo!\nCadastre-se`}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
          />
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

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{ color: "#fff", fontWeight: "500" }}>Cadastre-se</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: "center", margin: 32 }}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            Já tem conta?{" "}
            <Text style={{ fontWeight: "500", color: "#3DAAD9" }}>Login</Text>
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
    marginTop: 32,
    fontSize: 18,
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
