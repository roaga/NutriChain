import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"

class MealCard extends React.Component {
    state = {
        orderModalVisible: false
    }
    
    toggleOrderModal = () => {
        this.setState({orderModalVisible: !this.state.orderModalVisible});
    }

    render () {
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.meal}</Text>
                <TouchableOpacity style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16, right: 16}} onPress={() => this.props.placeOrder(this.props.meal)}>
                    <Text style={{color: colors.primary}}>Order {'>'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class OrderModal extends React.Component {
    state = {
        meals: this.props.bank.bundles
    }

    renderCard = (meal) => {
        return (
            <MealCard meal={meal} placeOrder={() => this.placeOrder(meal)}/>
        );
    }

    placeOrder = (meal) => {
        Alert.alert(
            "Order Confirmation",
            "Are you sure you would like to request this meal?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                    //Place Order
                    let uemail = firebase.auth().currentUser.email;
                    firebase.firestore().collection('requests').add({
                        chain: [{name: this.props.bank.name,
                            email: "atlfoodbank@gmail.com",
                            address: this.props.bank.address,
                            coords: this.props.bank.coords
                        }],
                        from: firebase.auth().currentUser.email,
                        isChainComplete: false, 
                        isOrderProcessed: false,
                        mealPlan: meal,
                        currentIndex: 0
                    })
                    this.props.closeModal();
                    this.props.closeOld();
              }}
            ],
            { cancelable: false }
          );
    }

    render(){
        return (
            <View style={[styles.container, {backgroundColor: "rgba(247, 247, 247, 1)"}]}>
                <TouchableOpacity style={{position: "absolute", top: 16, right: 16}} onPress={() => this.props.closeModal()}>
                    <Ionicons name="md-close" size={42} color="#000000"/>
                </TouchableOpacity>

                <Text style={styles.greeting}>Choose a Meal</Text>

                <FlatList
                    data={this.state.meals}
                    style={{marginHorizontal: 32, maxHeight: 400}}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 48}}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderCard(item)}
                />
            </View>
        );
    }
}
/*firebase.firestore().collection("users").doc(uemail).get().then(function(doc) {
    if (doc.exists) {
        let uname = doc.data().Name;
        let uaddress = doc.data().address;
        */