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

    /*
    Object {
        "chain": Array [
            "aveerappan8@gatech.edu",
            "tonyahn02@gmail.com",
        ],
        "from": "aveerappan8@gatech.edu",
        "isChainComplete": false,
        "isOrderProcessed": false,
        "mealPlan": "Veggies Bundle",
        }
    Object {
        "this": "this",
    }
    Object {
        "one": "one",
    }
*/

    componentDidMount(){
        this.setState({loading: false});
        firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
            snapshot.forEach(function (doc) {
                console.log(doc.data());
            });
        });
    }

    signOutUser = () => {
        firebase.auth().signOut();
    }
    
    render() {
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


// let getData = function () {
//     firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
//         snapshot.forEach(function (doc) {
//             // write List code
//             requests.push(doc.data());
//         });
//     });
// }