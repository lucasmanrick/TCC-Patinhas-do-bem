import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import Swiper from "react-native-deck-swiper";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../Service/tokenService"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const { width } = Dimensions.get("window");

const TelaDePets = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Petts, setPetts] = useState([]);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }
      setIsLoading(true);
      const response = await api.post('/PetsAdocao', {gapQuantity:0} ,{
        headers: { authorization: token },
      }).then((e) => {
        console.log(e);
        
        const petsData = e.data.dataResponse;
        
        setPetts(petsData);
        setIsLoading(false);
        if (!petsData) {
          throw new Error("Erro ao obter ID do pet.");
        }
      }).catch(error => {
        console.log('Erro : ', error);
      });

    } catch (error) {
      console.error("Erro ao visualizar pet:", error);
      Alert.alert("Erro", "Ocorreu um erro ao visualizar o pet.");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3DAAD9" />
        </View>
      ) : (
        Petts.length > 0 ? (
          <Swiper
            cards={Petts}
            renderCard={(item) => (
              <View style={styles.card}>
                {item.petPicture ? (
                  <Image source={{ uri: item.petPicture }} style={styles.petImage} />
                ) : (
                  <Text style={styles.noImageText}>Sem Imagem</Text>
                )}
                <View style={styles.overlay}>
                  <Text style={styles.petName}>{item.TipoAnimal}</Text>
                  <Text style={styles.petDescription}>{item.Descricao}</Text>
                </View>
                <View style={styles.additionalInfo}>
                  <Text style={styles.petDetail}>Idade: {item.Idade}</Text>
                  <Text style={styles.petDetail}>Raça: {item.Linhagem}</Text>
                  <Text style={styles.petDetail}>Cor: {item.Cor}</Text>
                  <Text style={styles.petDetail}>Sexo: {item.Sexo}</Text>
                </View>
              </View>
            )}
            stackSize={3}
            cardIndex={0}
            backgroundColor="#f0f0f0"
            onSwipedAll={() => Alert.alert("Fim da lista!")}
            overlayLabels={{
              left: {
                title: "Não tenho interesse",
                style: {
                  label: {
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    borderWidth: 1,
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    marginTop: 20,
                    marginLeft: -20,
                  },
                },
              },
              right: {
                title: "Tenho interesse",
                style: {
                  label: {
                    backgroundColor: "green",
                    borderColor: "green",
                    color: "white",
                    borderWidth: 1,
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    marginTop: 20,
                    marginLeft: 20,
                  },
                },
              },
            }}
          />
        ) : (
          <Text style={styles.noPetsText}>Nenhum pet disponível no momento.</Text>
        )
      )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 90,
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    height: 450,
    borderRadius: 15,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  petImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImageText: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
    marginTop: 200,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 15,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  petDescription: {
    marginTop: 5,
    fontSize: 16,
    color: "#ddd",
  },
  additionalInfo: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  petDetail: {
    fontSize: 16,
    color: "#333",
    marginVertical: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPetsText: {
    fontSize: 18,
    color: "#555",
  },
});

export default TelaDePets;
