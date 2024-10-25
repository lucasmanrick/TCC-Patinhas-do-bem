// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKWDrDke8yuwxa6ovNKMKZ81Vt1gXO6cs",
  authDomain: "patinhasdobem-f25f8.firebaseapp.com",
  projectId: "patinhasdobem-f25f8",
  storageBucket: "patinhasdobem-f25f8.appspot.com",
  messagingSenderId: "555367953315",
  appId: "1:555367953315:web:3cfb7883a5f9ad77e8e016"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

document.getElementById("image-input").addEventListener("change", async (event) => {
  const file = event.target.files[0]; // Captura o arquivo de imagem

  if (file) {
    try {
      // Define o caminho de upload no Firebase Storage
      const storageRef = storage.ref().child(`perfil/${IDUsuario}`);

      // Faz o upload da imagem
      const snapshot = await storageRef.put(file);
      console.log("Upload concluído com sucesso!", snapshot);

      // Obtém a URL de download da imagem após o upload
      const downloadURL = await storageRef.getDownloadURL();
      console.log("URL da imagem:", downloadURL);

      // Atualiza a imagem no HTML com a nova imagem do Firebase
      document.getElementById("profile-image").src = downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      alert("Falha no upload da imagem. Por favor, tente novamente.");
    }
  }
});