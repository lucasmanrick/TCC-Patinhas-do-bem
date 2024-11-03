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
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import api from "../../Service/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

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

  const handleEditPet = (pet) => {
    navigation.navigate("EdicaoPet", { pet });
  };

  const handleAddPet = () => {
    navigation.navigate("Pet");
  };

  const handleEditProfile = () => {
    navigation.navigate("EdicaoUser");
  };

  const handleDeletePet = (pet) => {
    Alert.alert(
      "Confirmação de Adoção",
      "Esse pet foi adotado através da ONG?",
      [
        {
          text: "Sim",
          onPress: () => {
            // Lógica para marcar o pet como adotado no sistema
            api
              .delete(`/RetiraPetAdocao`, { PetID: pet.id }, {
                headers: { authorization: token },
              })
              .then(() => {
                Toast.show({
                  type: "success",
                  text1: "Pet marcado como adotado!",
                });
                // Atualiza os dados do perfil para remover o pet da lista
                setProfileData((prevData) => ({
                  ...prevData,
                  dadosMeusPets: prevData.dadosMeusPets.filter(
                    (p) => p.id !== pet.id
                  ),
                }));
              })
              .catch((error) => {
                console.error("Erro ao marcar pet como adotado:", error);
                Toast.show({
                  type: "error",
                  text1: "Erro ao marcar o pet como adotado",
                });
              });
          },
        },
        {
          text: "Não",
          onPress: () => {
            Toast.show({ type: "info", text1: "Pet não foi marcado como adotado." });
          },
          style: "cancel",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {profileData ? (
        <>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/perfil%2F${profileData.meusDados.ID}.jpg?alt=media`,
                }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleEditProfile}
              >
                <Ionicons name="create-outline" size={20} color="#1a73e8" />
              </TouchableOpacity>
            </View>
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

          <FlatList
            data={profileData.postsData || []}
            numColumns={3}
            keyExtractor={(item) => item.id ? item.id.toString() : item.index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
          />

          <View style={styles.petsContainer}>
            <Text style={styles.petsTitle}>Meus Pets</Text>
            <FlatList
              data={profileData.dadosMeusPets}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              renderItem={({ item }) => (
                <View style={styles.petItem}>
                  <View style={styles.petImageContainer}>
                    <Image source={{ uri: item.petPicture }} style={styles.petImage} />
                    <TouchableOpacity onPress={() => handleEditPet(item)} style={styles.editIcon}>
                      <Ionicons name="create-outline" size={20} color="#1a73e8" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePet(item)} style={styles.deleteIcon}>
                      <Ionicons name="trash-outline" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.petName}>{item.TipoAnimal}</Text>
                </View>
              )}
              horizontal={false}
            />
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Não foi possível carregar os dados do perfil.</Text>
      )}

      <TouchableOpacity style={styles.settingsIcon} onPress={handleAddPet}>
        <Ionicons name="paw" size={30} color="#1a73e8" />
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
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editProfileButton: {
    position: "absolute",
    top: -5,
    right: -15,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
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
  petImageContainer: {
    position: "relative",
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
  editIcon: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
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
