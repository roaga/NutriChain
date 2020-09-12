import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"
import ProfileModal from "../modals/ProfileModal"

class BankOrderCard extends React.Component {
    state = {
        prepared: false,
        pickedUp: false,
    }

    render () {
        let courierEmail = this.props.order.chain.length > 1 ? this.props.order.chain[1].email : "Searching...";
        let courierName = this.props.order.chain.length > 1 ? this.props.order.chain[1].name : "Searching...";
        let courierAddress = this.props.order.chain.length > 1 ? this.props.order.chain[1].address : "Searching...";

        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.order.mealPlan}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Courier: {courierName}</Text>

                <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>Prepared</Text>
                    <TouchableOpacity onPress={() => this.setState({prepared: !this.state.prepared})}>
                        <Ionicons name={this.state.prepared ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity>
                    {/* <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>Picked Up</Text>
                    <TouchableOpacity onPress={() => this.setState({pickedUp: !this.state.pickedUp})}>
                        <Ionicons name={this.state.pickedUp ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }
}

export default class BankHome extends React.Component {
    state = {
        loading: true,
        email: "",
        profileModalVisible: false,
        orders: [],
    }

    componentDidMount(){
        this.setState({email: firebase.auth().currentUser.email})
        firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
            let requests = [];
            snapshot.forEach(function (doc) {
                if(doc.data().chain[0].email == this.state.email){
                    requests.push({...doc.data(), ...{id: doc.id}});
                }
            });
            this.setState({orders: requests});
        }.bind(this));

        this.setState({loading: false});
    }

    signOutUser = () => {
        firebase.auth().signOut();
        this.props.navigation.navigate("Auth");
    }

    renderCard = (order) => {
        return (
            <BankOrderCard order={order}/>
        );
    }

    toggleProfileModal = () => {
        this.setState({profileModalVisible: !this.state.profileModalVisible});
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
            <View style={styles.container}>
                <Text style={[styles.greeting, {color: colors.primary}]}>Nutrichain</Text>

                <TouchableOpacity style={[styles.button, {marginVertical: 32}]} onPress={() => this.toggleProfileModal()}>
                    <Text style={styles.buttonText}>Food Bank Info {'>'}</Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>Orders</Text>

                <FlatList
                    data={this.state.orders}
                    style={{marginHorizontal: 32}}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 48}}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderCard(item)}
                />

                <Modal 
                    animationType="slide" 
                    visible={this.state.profileModalVisible} 
                    onRequestClose={() => this.toggleProfileModal()}
                >
                    <ProfileModal closeModal={() => this.toggleProfileModal()} signOut={() => this.signOutUser()}/>
                </Modal>
            </View>
        )
    }
}
