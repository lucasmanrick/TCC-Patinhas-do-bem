import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando o FontAwesome

const pets = [
  {
    id: 1,
    name: "Max",
    image: "https://img.freepik.com/psd-gratuitas/retrato-de-cachorro-fofo-isolado_23-2150194076.jpg?ga=GA1.1.956247105.1709338793&semt=ais_hybrid",
    description: "Um cãozinho brincalhão em busca de um lar amoroso.",
    age: "2 anos",
    breed: "Labrador",
    size: "Médio",
  },
  {
    id: 2,
    name: "Bella",
    image: "https://img.freepik.com/fotos-gratis/kitty-com-parede-monocromatica-atras-dela_23-2148955134.jpg?t=st=1727822276~exp=1727825876~hmac=9c0cc6ae89497f89ade0557b37a32324d844ac80edb020d0fe0f174a63b9b772&w=360",
    description: "Uma gatinha carinhosa esperando por adoção.",
    age: "1 ano",
    breed: "Persa",
    size: "Pequeno",
  },
  {
    id: 3,
    name: "Charlie",
    image: "https://img.freepik.com/psd-gratuitas/retrato-de-solo-adoravel-cachorro-beagle_53876-73997.jpg?t=st=1727822365~exp=1727825965~hmac=00430b9ad193b001b926265d2eb376cc5da33653107611e6f65ad5ca89d52988&w=740",
    description: "Adora passear e brincar no parque.",
    age: "3 anos",
    breed: "Poodle",
    size: "Pequeno",
  },
];

const { width } = Dimensions.get("window");

const TelaDePets = ({ navigation }) => { // Adicione a prop navigation
  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCardExpansion = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  const renderCard = (pet) => {
    const isExpanded = expandedCardId === pet.id;

    return (
      <View style={[styles.card, isExpanded && styles.expandedCard]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => toggleCardExpansion(pet.id)}>
          <Image source={{ uri: pet.image }} style={styles.petImage} />
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Pet')} // Navegue para a outra tela
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.swiperContainer}>
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
    justifyContent: "flex-start", // Alinha o swiper para o topo
    marginTop: 90, // Adiciona espaço acima dos cartões
    alignItems: "center", // Centraliza os cartões
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
    height: 500, // Ajusta a altura quando expandido
  },
  petImage: {
    width: "100%",
    height: "100%", // A imagem ocupa todo o card
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fundo semitransparente
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
    borderRadius: 50, // Mantém o borderRadius
    width: 50, // Define a largura do botão
    height: 50, // Define a altura do botão igual à largura
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    elevation: 5, // Sombra para dar um efeito elevado (opcional)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  

});

export default TelaDePets;
