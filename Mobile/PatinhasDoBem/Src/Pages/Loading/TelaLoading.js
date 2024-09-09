import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default class TelaLoading extends React.Component {
    componentDidMount() {
        const auth = getAuth(); // Obtém a instância de autenticação padrão
        onAuthStateChanged(auth, (user) => {
            this.props.navigation.navigate(user ? "Home" : "Login"); // Redireciona conforme o estado do usuário
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Carregando...</Text>
                <ActivityIndicator size="large" color="#3DAAD9" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5', // Cor de fundo para deixar o layout mais agradável
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
        fontWeight: '400',
        color: '#333',
    },
});
