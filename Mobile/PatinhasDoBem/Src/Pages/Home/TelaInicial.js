import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth"; // Adicione a importação correta do Firebase Auth

export default class TelaDeApresentacao extends React.Component {
  state = {
    
    email: "",
    displayName: "",
  };

  componentDidMount() {
    const auth = getAuth(); // Obtém a instância de autenticação
    const user = auth.currentUser;

    if (user) {
      const { email, displayName } = user;
      this.setState({email, displayName });
    }
  }

  signOutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.props.navigation.navigate("Login"); // Redireciona para a tela de login após o logout
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.greeting}>Oi {this.state.displayName || this.state.email}!</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={this.signOutUser}>
          <Text style={styles.button}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Para adicionar um fundo leve
  },
  greeting: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#3DAAD9", // Mesma cor usada no botão de login
    borderRadius: 5,
  },
  button: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
