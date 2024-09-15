import React from "react";
import { View,Text,StyleSheet } from "react-native";

export default class TelaDePost extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Tela de Post</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})