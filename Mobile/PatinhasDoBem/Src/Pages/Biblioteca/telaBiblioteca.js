import React, { useState } from "react";
import { Button, Image, View, Platform, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function TelaBiblioteca() {
  const [image, setImage] = useState(null);

  // Função para solicitar permissão e abrir a galeria
  const pickImage = async () => {
    // Solicita permissão de acesso à biblioteca de fotos
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Desculpe, precisamos de permissão para acessar suas fotos.");
        return;
      }
    }

    // Abre o seletor de imagens da galeria
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Define a URI da imagem selecionada
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Escolher imagem da galeria" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
