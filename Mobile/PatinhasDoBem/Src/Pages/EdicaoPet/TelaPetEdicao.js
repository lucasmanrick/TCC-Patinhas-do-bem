import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import api from "../../Service/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TelaDeEdicao = ({ route, navigation }) => {
  const { pet } = route.params; // Recebendo os dados do pet
  const [tipoAnimal, setTipoAnimal] = useState(pet.TipoAnimal);
  const [linhagem, setLinhagem] = useState(pet.Linhagem);
  const [status, setStatus] = useState(pet.Status);
  const [idade, setIdade] = useState(pet.Idade);
  const [sexo, setSexo] = useState(pet.Sexo);
  const [cor, setCor] = useState(pet.Cor);
  const [descricao, setDescricao] = useState(pet.Descricao);
  const [loading, setLoading] = useState(false);

  const handleEditPet = () => {
    setLoading(true);
    AsyncStorage.getItem("token")
      .then((token) => {
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          setLoading(false);
          return;
        }

        return api.put(
          `/EditaPetInfo`,
          {
            TipoAnimal: tipoAnimal,
            Linhagem: linhagem,
            Status: status,
            Idade: idade,
            Sexo: sexo,
            Cor: cor,
            Descricao: descricao,
            PetID: pet.PetID, // ID do pet para edição
          },
          {
            headers: { authorization: token },
          }
        );
      })
      .then((response) => {
        console.log(response);
        
        if (response.data.error) {
          Alert.alert("Erro", response.data.error);
        } else {
          Alert.alert("Sucesso", "Informações do pet editadas com sucesso!");
          navigation.goBack(); // Voltar à tela anterior
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro", "Ocorreu um erro ao editar as informações do pet.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Informações do Pet</Text>

      <TextInput
        style={styles.input}
        placeholder="Tipo de Animal"
        value={tipoAnimal}
        onChangeText={setTipoAnimal}
      />
      <TextInput
        style={styles.input}
        placeholder="Linhagem"
        value={linhagem}
        onChangeText={setLinhagem}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={sexo}
        onChangeText={setSexo}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor"
        value={cor}
        onChangeText={setCor}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleEditPet}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#343a40",
  },
  input: {
    height: 50,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#007BFF70",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default TelaDeEdicao;
