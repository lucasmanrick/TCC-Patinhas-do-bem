import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import Swiper from "react-native-deck-swiper";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../Service/tokenService"; // Importando axios para fazer a requisição à API
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Importando do Firebase Storage

const { width } = Dimensions.get("window");

const TelaDePets = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de loading

  // Função para obter a URL da imagem
  const fetchImageUrl = async (idDoPet) => {
    const storage = getStorage();
    const imageRef = ref(storage, `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/pets%2F${idDoPet}.jpg?alt=media`); // Caminho correto no Firebase Storage

    try {
      const url = await getDownloadURL(imageRef);
      return url; // Retorna a URL da imagem
    } catch (error) {
      console.error("Erro ao buscar a URL da imagem:", error);
      return null; // Retorna null em caso de erro
    }
  };

  const fetchPets = async () => { 
    try {
      // Recupera o token armazenado
      const token = await AsyncStorage.getItem('token'); // Agora 'await' pode ser usado
  
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }
  
      // Enviando os dados do pet para o backend
      const response = await api.get("/PetsAdocao", {} , {
        headers: {
          authorization: token, // Envia o token no cabeçalho
        },
      }).then(async (e) => {
        const Pets = e.data.dataResponse; // Obter o ID do pet retornado pela API
        console.log(Pets);
  
        if (!Pets) {
          throw new Error("Erro ao obter ID do pet.");
        }}
      )
      
  
      // Faça algo com o idDoPet, como adicionar os pets ao estado
    } catch (error) {
      console.error("Erro ao visualizar pet:", error);
      Alert.alert("Erro", "Ocorreu um erro ao vizualizar o pet.");
    }
  };
  

  useEffect(() => {
    fetchPets(); // Chama a função para buscar os pets quando o componente montar
  }, []);

  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCardExpansion = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  const renderCard = (pet) => {
    const isExpanded = expandedCardId === pet.id;

    return (
      <View style={[styles.card, isExpanded && styles.expandedCard]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => toggleCardExpansion(pet.id)}>
          {/* Renderiza a imagem usando a URL, se disponível */}
          {pet.petPicture ? (
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} /> 
          ) : (
            <Text style={styles.noImageText}>Imagem não disponível</Text>
          )}
        </TouchableOpacity>
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petDescription}>{pet.description}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.additionalInfo}>
            <Text style={styles.petDetail}>Idade: {pet.age}</Text>
            <Text style={styles.petDetail}>Raça: {pet.breed}</Text>
            <Text style={styles.petDetail}>Tamanho: {pet.size}</Text>
          </View>
        )}
      </View>
    );
  };

  // Exibe o loading enquanto os pets são carregados
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DAAD9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Pet')}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.swiperContainer}>
        {pets.length > 0 ? (
          <Swiper
            cards={pets}
            renderCard={renderCard}
            onSwipedLeft={(cardIndex) => {
              console.log("Swipe para esquerda, rejeitou o pet");
            }}
            onSwipedRight={(cardIndex) => {
              console.log("Swipe para direita, adotou o pet!");
            }}
            cardIndex={0}
            backgroundColor={"#f0f0f0"}
            stackSize={3}
            stackSeparation={15}
            overlayLabels={{
              left: {
                title: "Não tenho interesse",
                style: {
                  label: {
                    backgroundColor: "red",
                    color: "white",
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    marginRight: 10,
                  },
                },
              },
              right: {
                title: "Tenho interesse",
                style: {
                  label: {
                    backgroundColor: "green",
                    color: "white",
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    marginLeft: 10,
                  },
                },
              },
            }}
          />
        ) : (
          <Text style={styles.noPetsText}>Não há pets disponíveis no momento.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  expandedCard: {
    height: 500,
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
  textContainer: {
    alignItems: "flex-start",
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
  addButton: {
    position: 'absolute',
    top: 35,
    right: 330,
    backgroundColor: '#3DAAD9',
    padding: 10,
    borderRadius: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPetsText: {
    fontSize: 18,
    color: "#555",
  },
});

export default TelaDePets;
