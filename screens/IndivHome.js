import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal, Linking} from 'react-native'
import * as firebase from 'firebase'

export default class HomeScreen extends React.Component {
    state = {
        loading: true,
        email: "",
        displayName: "",
    }

    signOutUser = () => {
        firebase.auth().signOut();
    }
    
    render(){
        if(this.state.loading){
            return (
                <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            )
        }
        return(
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text>Individual Dashboard</Text>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})