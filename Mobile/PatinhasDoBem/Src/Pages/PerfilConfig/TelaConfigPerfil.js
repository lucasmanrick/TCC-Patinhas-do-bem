import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import api from "../../Service/tokenService"; // Importe seu serviço API
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const TelaDeEdicaoUsuario = ({ navigation }) => {
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para buscar dados do usuário e preencher os campos
  const buscarDadosUsuario = () => {
    AsyncStorage.getItem("token")
      .then(token => {
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }

        api.get("/MyProfile", {}, {
          headers: { authorization: token },
        })
        .then(response => {
          const dados = response.data;
          setCep(dados.cep || "");
          setRua(dados.rua || "");
          setNumero(dados.numero || "");
          setBairro(dados.bairro || "");
          setEstado(dados.estado || "");
          setCidade(dados.cidade || "");
        })      
        .catch(error => {
          console.error(error);
          Alert.alert("Erro", "Erro ao carregar dados do usuário.");
        });
      });
  };

  // Chama a função buscarDadosUsuario ao montar o componente
  useEffect(() => {
    buscarDadosUsuario();
  }, []);

  // Função para buscar endereço pelo CEP
  const buscarEndereco = () => {
    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        const { logradouro, bairro, localidade, uf } = response.data;
        setRua(logradouro || "");
        setBairro(bairro || "");
        setCidade(localidade || "");
        setEstado(uf || "");
      })
      .catch(error => {
        Alert.alert("Erro", "CEP inválido ou erro na busca de endereço.");
      });
  };

  const handleEditUser = () => {
    setLoading(true);
    AsyncStorage.getItem("token")
      .then(token => {
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          setLoading(false);
          return;
        }

        // Validação da confirmação de senha
        if (senha !== confirmaSenha) {
          Alert.alert("Erro", "As senhas não coincidem.");
          setLoading(false);
          return;
        }

        api.put("/EditaDados", {
          Senha: senha,
          Cep: cep,
          Rua: rua,
          Numero: numero,
          Bairro: bairro,
          Estado: estado,
          Cidade: cidade,
        }, {
          headers: { authorization: token },
        })
        .then(response => {
          if (response.data.error) {
            Alert.alert("Erro", response.data.error);
          } else {
            Alert.alert("Sucesso", "Dados editados com sucesso!");
            navigation.goBack(); // Voltar à tela anterior
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Erro", "Ocorreu um erro ao editar os dados.");
        })
        .finally(() => {
          setLoading(false);
        });
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Dados Cadastrais</Text>

      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
        onBlur={buscarEndereco} // Dispara a busca do endereço ao sair do campo CEP
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Rua"
        value={rua}
        onChangeText={setRua}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={bairro}
        onChangeText={setBairro}
      />
      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={estado}
        onChangeText={setEstado}
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmação de Senha"
        value={confirmaSenha}
        onChangeText={setConfirmaSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleEditUser}
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default TelaDeEdicaoUsuario;
