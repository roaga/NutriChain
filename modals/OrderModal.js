import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal, Alert} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';

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
            <Animatable.View style={styles.card} animation="slideInUp" duration={500}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.meal}</Text>
                <TouchableOpacity style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16, right: 16}} onPress={() => this.props.placeOrder(this.props.meal)}>
                    <Ionicons name="md-arrow-round-forward" size={32} color={colors.primary}/>
                </TouchableOpacity>
            </Animatable.View>
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
        let uaddress = this.props.address;
        let ucoords = this.props.coords;
        let ubank = this.props.bank.name;
        let ubankaddress = this.props.bank.address;
        let ubankcoords = this.props.bank.coords;

        let props = this.props;
        
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then(function(doc) {
            if (doc.exists) {
                let points = doc.data().points;
                if (points >= 100) {
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
                                    chain: [{name: ubank,
                                        email: "atlfoodbank@gmail.com",
                                        address: ubankaddress,
                                        coords: ubankcoords
                                    }],
                                    from: firebase.auth().currentUser.email,
                                    fromAddress: uaddress,
                                    fromCoords: ucoords,
                                    isChainComplete: false, 
                                    isOrderProcessed: false,
                                    mealPlan: meal,
                                    currentIndex: 0
                                }); // this works
            
                                firebase.firestore().collection("users").doc(uemail).get().then(function(doc) {
                                    if (doc.exists) {
                                        let points = doc.data().points;
                                        firebase.firestore().collection("users").doc(uemail).update({points: points - 100});
                                    }
                                });
            
                                props.closeModal();
                                props.closeOld();
                          }}
                        ],
                        { cancelable: false }
                      );
                } else {
                    Alert.alert(
                        "Order Information",
                        "Not enough token balance to place order. Volunteer to deliver and gain more tokens!",
                        [
                          {
                            text: "Cancel",
                            onPress: () => {},
                            style: "cancel"
                          },
                          { text: "OK", onPress: () => {}}
                        ],
                        { cancelable: false }
                      );
                }
            }
        });
    }

    render(){
        return (
            <View style={[styles.container, {backgroundColor: "rgba(247, 247, 247, 1)"}]}>
                <TouchableOpacity style={{position: "absolute", top: 16, right: 16}} onPress={() => this.props.closeModal()}>
                    <Ionicons name="md-close" size={32} color="#000000"/>
                </TouchableOpacity>

                <Text style={[styles.greeting, {borderBottomWidth: 4, borderRadius: 10, paddingBottom: 16, borderColor: colors.primary, fontWeight: "700"}]}>Choose a Meal</Text>

                <FlatList
                    data={this.state.meals}
                    style={{marginHorizontal: 32}}
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