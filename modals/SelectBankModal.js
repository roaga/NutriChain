import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"
import OrderModal from "./OrderModal"

class BankCard extends React.Component {
    state = {
        orderModalVisible: false
    }
    
    componentDidMount(){
        console.log("hello");
        firebase.firestore().collection("users").onSnapshot(function(snapshot) {
            snapshot.forEach(function (doc) {
                console.log(doc.data());
                if (doc.data()["isFoodBank"]) {
                    // populate list with data
                    let foodbank = doc.data();
                    console.log(foodbank);
                }
            });
        });
    }

    toggleOrderModal = () => {
        this.setState({orderModalVisible: !this.state.orderModalVisible});
    }

    render () {
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.bank.name}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>{this.props.bank.address}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Meals: {this.props.bank.bundles.join(", ")}</Text>
                <TouchableOpacity style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16, right: 16}} onPress={() => this.toggleOrderModal()}>
                    <Text style={{color: colors.primary}}>Order {'>'}</Text>
                </TouchableOpacity>

                <Modal 
                    animationType="fade" 
                    visible={this.state.orderModalVisible} 
                    onRequestClose={() => this.toggleOrderModal()}
                >
                    <OrderModal closeModal={() => this.toggleOrderModal()} bank={this.props.bank} closeOld={() => this.props.closeModal()}/>
                </Modal>
            </View>
        );
    }
}

export default class SelectBankModal extends React.Component {
    state = {
        banks: [{id: "1234424f3f", name: "Atlanta Bank", address: "Peachtree St", bundles: ["Vegetarian", "Regular"]}]
    }

    renderCard = (bank) => {
        return (
            <BankCard bank={bank} closeModal={() => this.props.closeModal()}/>
        );
    }

    render(){
        return (
            <View style={[styles.container, {backgroundColor: "rgba(247, 247, 247, 1)"}]}>
                <TouchableOpacity style={{position: "absolute", top: 16, right: 16}} onPress={() => this.props.closeModal()}>
                    <Ionicons name="md-close" size={42} color="#000000"/>
                </TouchableOpacity>

                <Text style={styles.greeting}>Choose a Food Bank</Text>

                <FlatList
                    data={this.state.banks}
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
