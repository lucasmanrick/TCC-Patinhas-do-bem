import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import api from '../../Service/tokenService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const TelaPostagens = () => {
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gapQuantity, setGapQuantity] = useState(0); // Controla quantas postagens carregar

  useEffect(() => {
    carregarPostagens(); // Carrega as postagens na montagem do componente
  }, [gapQuantity]); // Adiciona gapQuantity como dependência

  const carregarPostagens = () => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado.');
          return Promise.reject('Usuário não autenticado'); // Retorna uma promessa rejeitada
        }

        return api.post('/VerPostagens', { gapQuantity }, {
          headers: { authorization: token },
        });
      })
      .then((response) => {
        console.log(response.data);

        // Adiciona novas postagens ao estado existente, filtrando duplicatas
        setPostagens(prevPostagens => {
          const newPosts = response.data.posts;
          const uniquePosts = [...prevPostagens, ...newPosts.filter(newPost => 
            !prevPostagens.some(prevPost => prevPost.ID === newPost.ID)
          )];
          return uniquePosts;
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar postagens:', error);
        Alert.alert('Erro', 'Não foi possível carregar as postagens.');
      })
      .finally(() => {
        setLoading(false); // Define loading como false após a conclusão da operação
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      {/* User Info fora do Card */}
      <View style={styles.userInfoContainer}>
        {item.UserPicture && (
          <Image source={{ uri: item.UserPicture }} style={styles.userImage} />
        )}
        <Text style={styles.userName}>{item.NomeUsuario}</Text>
      </View>
      
      {/* Card com postagens */}
      <View style={styles.card}>
        <Text style={styles.postDescription}>{item.Descricao}</Text>
        {item.PostPicture && (
          <Image source={{ uri:`https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/postagem%2F${item.ID}?alt=media` }} style={styles.postImage} />
        )}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionText}>Curtir</Text>
          <Text style={styles.actionText}>Comentar</Text>
        </View>
      </View>
    </View>
  );

  const handleLoadMore = () => {
    setGapQuantity(prev => prev + 1); // Incrementa o gapQuantity
  };

  if (loading) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={postagens}
        keyExtractor={(item) => item.ID.toString()} // Retorno ao método anterior
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore} // Chama a função quando o final da lista é alcançado
        onEndReachedThreshold={0.5} // Chama a função quando o usuário está a 50% do final da lista
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#6c757d',
  },
  postContainer: {
    marginBottom: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontWeight: 'bold',
    color: '#343a40',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postDescription: {
    marginVertical: 8,
    fontSize: 16,
    color: '#212529',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    marginVertical: 8,
    zIndex: -1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default TelaPostagens;
