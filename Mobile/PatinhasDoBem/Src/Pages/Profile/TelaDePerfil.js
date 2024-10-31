import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default class TelaDePerfil extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text>Tela de Perfil</Text>
        
        {/* Botão usando TouchableOpacity */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Pet')}
        >
          <Text style={styles.buttonText}>Ir para Tela de Pets</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3DAAD9',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});
