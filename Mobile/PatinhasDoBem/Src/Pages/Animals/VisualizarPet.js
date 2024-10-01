import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Swiper from "react-native-deck-swiper";

const pets = [
  {
    id: 1,
    name: "Max",
    image: "https://linkparaimagemdogato.com/max.jpg",
    description: "Um cãozinho brincalhão em busca de um lar amoroso.",
  },
  {
    id: 2,
    name: "Bella",
    image: "https://linkparaimagemdogato.com/bella.jpg",
    description: "Uma gatinha carinhosa esperando por adoção.",
  },
  {
    id: 3,
    name: "Charlie",
    image: "https://linkparaimagemdogato.com/charlie.jpg",
    description: "Adora passear e brincar no parque.",
  },
];

const { width } = Dimensions.get("window");

export default class TelaDePets extends React.Component {
  renderCard = (pet) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: pet.image }} style={styles.petImage} />
        <View style={styles.textContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petDescription}>{pet.description}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          cards={pets}
          renderCard={this.renderCard}
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
              title: "REJEITAR",
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
              title: "ADOTAR",
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    height: 450,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#fff",
  },
  petImage: {
    width: "100%",
    height: 350,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 15,
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  petDescription: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },
});
