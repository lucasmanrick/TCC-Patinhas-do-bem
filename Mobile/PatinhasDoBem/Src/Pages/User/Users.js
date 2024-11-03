import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../../Service/tokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserProfileScreen = ({ route, navigation }) => {
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

        console.log(userID);

        setLoading(true); // Corrige aqui para `setLoading`
        return api.get(`/ProfileUser/${userID}`,{},
       {
         headers: { authorization: token },
       }
     );
      })
      .then((response) => {
        console.log("socorro", response);

        setProfileData(response.data); // Ajuste para capturar dados corretamente
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao visualizar perfil:", error);
        Alert.alert("Erro", "Ocorreu um erro ao visualizar o usuário.");
        setLoading(false);
      });
  }, [userID]); // Adicione userID como dependência para reexecutar o efeito quando o usuário mudar

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profileData ? (
        <>
          <View style={styles.header}>
            <Image
              source={{
                uri: `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/perfil%2F${userID}.jpg?alt=media`,
              }}
              style={styles.profileImage}
            />
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>{profileData.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>{profileData.followers}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statNumber}>{profileData.following}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.username}>{profileData.username}</Text>
            <Text style={styles.bio}>{profileData.bio}</Text>
          </View>

          <FlatList
            data={profileData.postsData || []} // Evita erros caso `postsData` não esteja definido
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
          />
        </>
      ) : (
        <Text style={styles.errorText}>
          Não foi possível carregar os dados do perfil.
        </Text>
      )}
    </View>
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
  bio: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
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
});

export default UserProfileScreen;
