import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const DetalhesPost = ({ route }) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/postagem%2F${post.ID}?alt=media`,
        }}
        style={styles.postImage}
      />
      <Text style={styles.title}>{post.titulo}</Text>
      <Text style={styles.description}>{post.descricao}</Text>
      {/* Adicione mais informações do post conforme necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
});

export default DetalhesPost;
