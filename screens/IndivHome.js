import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal, Linking} from 'react-native'
import * as firebase from 'firebase'

import styles from "../Styles"
import {colors} from "../Styles"

export default class IndivHome extends React.Component {
    state = {
        loading: true,
        email: "",
        displayName: "",
    }

    componentDidMount(){
        this.setState({loading: false});
    }

    signOutUser = () => {
        firebase.auth().signOut();
    }
    
    render(){
        if(this.state.loading){
            return (
                <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                    <ActivityIndicator size="large" color={colors.primary} />
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
