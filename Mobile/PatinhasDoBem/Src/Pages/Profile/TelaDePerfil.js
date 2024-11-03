import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Toast from "react-native-toast-message";
import api from "../../Service/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons'; // Importando o ícone de configurações

const TelaDePerfil = ({ route, navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userID = route.params?.userID;

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((token) => {
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
          throw new Error("Usuário não autenticado.");
        }

        setLoading(true);
        return api.get(`/MyProfile`, {}, {
          headers: { authorization: token },
        });
      })
      .then((response) => {
        console.log("Dados do perfil:", response.data);
        setProfileData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao visualizar perfil:", error);
        Alert.alert("Erro", "Ocorreu um erro ao visualizar o usuário.");
        setLoading(false);
      });
  }, [userID]);

  const handleSettings = () => {
    navigation.navigate('EdicaoUser'); // Navegando para a tela de configurações
  };

  const handleEditPet = (pet) => {
    navigation.navigate('EdicaoPet', { pet }); // Navegando para a tela de edição do pet
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {profileData ? (
        <>
          <View style={styles.header}>
            <Image
              source={{
                uri: `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/perfil%2F${profileData.meusDados.ID}.jpg?alt=media`,
              }}
              style={styles.profileImage}
            />
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>{profileData.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>
                {profileData.dadosMeusPets ? profileData.dadosMeusPets.length : 0}
              </Text>
              <Text style={styles.statLabel}>Meus Pets</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>{profileData.following}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.username}>{profileData.meusDados.Nome}</Text>
          </View>

          {/* Exibir lista de posts */}
          <FlatList
            data={profileData.postsData || []}
            numColumns={3}
            keyExtractor={(item) => item.id ? item.id.toString() : item.index.toString()} // Ajuste para garantir que você não tenha erro
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
          />

          {/* Exibir lista de pets */}
          <View style={styles.petsContainer}>
            <Text style={styles.petsTitle}>Meus Pets</Text>
            <FlatList
              data={profileData.dadosMeusPets} // Supondo que isso contém os dados dos pets
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Ajuste conforme a estrutura dos dados dos pets
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleEditPet(item)} style={styles.petItem}>
                  <Image source={{ uri: item.petPicture }} style={styles.petImage} />
                  <Text style={styles.petName}>{item.TipoAnimal}</Text>
                </TouchableOpacity>
              )}
              horizontal={false} // Pode ser alterado para false se você quiser uma lista vertical
            />
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>
          Não foi possível carregar os dados do perfil.
        </Text>
      )}


      {/* Ícone de configurações no canto superior direito */}
      <TouchableOpacity style={styles.settingsIcon} onPress={handleSettings}>
        <Ionicons name="settings-outline" size={30} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  bioContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  petsContainer: {
    padding: 15,
  },
  petsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  petItem: {
    marginRight: 10,
    alignItems: "center",
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  petName: {
    marginTop: 5,
    textAlign: "center",
  },
  postImage: {
    width: "33%",
    height: 120,
    margin: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  settingsIcon: {
    position: "absolute",
    top: -1,
    right: 10,
  },
});

export default TelaDePerfil;
