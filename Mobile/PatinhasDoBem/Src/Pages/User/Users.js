import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../Service/tokenService";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserProfileScreen = ({ route, navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userID = route.params?.userID;

  useEffect(() => {
    const fetchProfileData = () => {
      AsyncStorage.getItem("token")
        .then((token) => {
          if (!token) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
            return;
          }

          setLoading(true);
          return api.get(`/ProfileUser/${userID}`, {}, {
            headers: { authorization: token },
          });
        })
        .then((response) => {
          console.log(response.data);
          setProfileData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao visualizar perfil:", error);
          Alert.alert("Erro", "Ocorreu um erro ao visualizar o usuário.");
          setLoading(false);
        });
    };

    fetchProfileData();
  }, [userID]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const dadosUsuario = profileData.dadosUsuario;
  const dadosPets = profileData.dadosPetsUsuario;
  const postagens = profileData.postagensDoUsuario;

  return (
    <ScrollView style={styles.container}>
      {dadosUsuario ? (
        <>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/perfil%2F${dadosUsuario.IDUsuario}.jpg?alt=media`,
                }}
                style={styles.profileImage}
              />

            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>
                {postagens ? postagens.length : 0}
              </Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>
                {dadosPets ? dadosPets.length : 0}
              </Text>
              <Text style={styles.statLabel}>Meus Pets</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.username}>
              {dadosUsuario.Nome ?? "Usuário"}
            </Text>
          </View>

          {/* Lista de Postagens */}
          <FlatList
            data={postagens || []}
            keyExtractor={(item) => item.ID.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.postItem}
                onPress={() =>
                  navigation.navigate("DetalhesPost", { post: item })
                }
              >
                <Image
                  source={{
                    uri: item.PostPicture,
                  }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />

          {/* Lista de Pets */}
          <View style={styles.petsContainer}>
            <Text style={styles.petsTitle}>Meus Pets</Text>
            <FlatList
              data={dadosPets || []}
              keyExtractor={(item, index) =>
                item.ID ? item.ID.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <View style={styles.petItem}>
                  <View style={styles.petImageContainer}>
                    <Image
                      source={{ uri: item.petPicture }}
                      style={styles.petImage}
                    />
                    
                  </View>
                  <Text style={styles.petName}>{item.TipoAnimal}</Text>
                </View>
              )}
              horizontal={true}
            />
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>
          Não foi possível carregar os dados do perfil.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ffffff",
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
    fontSize: 12,
    color: "#888",
  },
  bioContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
  },
  petsContainer: {
    marginBottom: 20,
  },
  petsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  petItem: {
    marginRight: 10,
  },
  petImageContainer: {
    position: "relative",
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  editIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 5,
  },
  deleteIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 5,
  },
  petName: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
  },
  postItem: {
    margin: 5,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserProfileScreen;
