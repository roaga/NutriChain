import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal, Alert} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"
import ProfileModal from "../modals/ProfileModal"
import SelectBankModal from '../modals/SelectBankModal'

class IndivOrderCard extends React.Component {

    state = {
        pickedUp: false,
        holderAddress: "",
        holderEmail: "",
        holderName: ""
    }

    addToChain = () => {
        Alert.alert(
            "Pickup Confirmation",
            "Are you sure you would like to help transport this meal?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                this.setState({pickedUp: !this.state.pickedUp});

                //add to chain
                const orderref = firebase.firestore().collection('requests').doc(this.props.order.id);

                firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then(function(doc) {
                    if (doc.exists) {
                        let uname = doc.data().Name;
                        console.log(doc.data().name);
                        let uaddress = doc.data().address;
                        let uemail = firebase.auth().currentUser.email;
                        //let points = doc.data().points;
                        orderref.get().then(function(doc){
                            if(doc.exists){
                                let uchain = doc.data().chain;
                                let currentIndex = doc.data().currentIndex;
                                uchain.push({
                                    name: uname,
                                    email: uemail,
                                    address: uaddress
                                })
                                console.log(uchain)
                                console.log(currentIndex)

                                let newindex = doc.data().currentIndex + 1;
                                orderref.update({chain: uchain, currentIndex: currentIndex});
                                if (uname == firebase.auth().currentUser.email) { // if the user who ordered picks it up
                                    firebase.firestore().collection("archives").add(doc.data()); // add data to archives
                                    orderref.delete(); // delete data from requests
                                    points = 100 / (currentIndex + 1) + points;
                                    firebase.firestore().collection("users").doc(uemail).update({points: points});
                                }
        
                                
                            }
                        })
                    }
                });
                //remove from Nearby Pickups
                this.props.removeOrderLocally(this.props.order.id);
              }}
            ],
            { cancelable: false }
          );
    }
    componentDidMount(){
        const orderref = firebase.firestore().collection('requests').doc(this.props.order.id);
        orderref.get().then(function(doc){
            let holder = doc.data().chain[doc.data().currentIndex];
            this.setState({holderEmail: holder.email});
            this.setState({holderName: holder.name});
            this.setState({holderAddress: holder.address});        
       }.bind(this))
    }
    render () {
        /*let holderEmail = this.props.order.chain[this.props.order.chain.length - 1].email;
        let holderName = this.props.order.chain[this.props.order.chain.length - 1].name;
        let holderAddress = this.props.order.chain[this.props.order.chain.length - 1].address;
        */
       return (
        <View style={styles.card}>
            <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.state.holderAddress}</Text>
            <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Holder: {this.state.holderName}</Text>

            <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>I'll pick this up</Text>
                <TouchableOpacity onPress={() => this.addToChain()}>
                    <Ionicons name={this.state.pickedUp ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                </TouchableOpacity>
            </View>
        </View>
    );
        
    }
}

export default class IndivHome extends React.Component {
    state = {
        loading: true,
        email: "",
        displayName: "",
        profileModalVisible: false,
        selectBankModalVisible: false,
        orders: [],
    }

    componentDidMount(){
        this.setState({email: firebase.auth().currentUser.email});
        firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
            let requests = [];
            snapshot.forEach(function (doc) {
                if(doc.data().chain.filter(item => item.email == this.state.email).length < 1){
                    requests.push({...doc.data(), ...{id: doc.id}});
                }
            }.bind(this));
            this.setState({orders: requests});
        }.bind(this));
        
        this.setState({loading: false});
    }

    removeOrderLocally = (id) => {
        let orders = this.state.orders;
        let newOrders = orders.filter(order => order.id !== id);
        this.setState({orders: newOrders});
    }

    signOutUser = () => {
        firebase.auth().signOut();
        this.props.navigation.navigate("Auth");
    }

    renderCard = (order) => {
        return (
            <IndivOrderCard order={order} removeOrderLocally={(id) => this.removeOrderLocally(id)}/>
        );
    }

    toggleProfileModal = () => {
        this.setState({profileModalVisible: !this.state.profileModalVisible});
    }

    toggleSelectBankModal = () => {
        this.setState({selectBankModalVisible: !this.state.selectBankModalVisible});
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
            <View style={styles.container}>
                <Text style={styles.greeting}>App Name</Text>

                <TouchableOpacity style={[styles.button, {marginTop: 32}]} onPress={() => this.toggleProfileModal()}>
                    <Text style={styles.buttonText}>Your Info {'>'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {marginTop: 16, marginBottom: 32}]} onPress={() => this.toggleSelectBankModal()}>
                    <Text style={styles.buttonText}>Order Food {'>'}</Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>Nearby Pickups</Text>

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
                <Modal 
                    animationType="slide" 
                    visible={this.state.selectBankModalVisible} 
                    onRequestClose={() => this.toggleSelectBankModal()}
                >
                    <SelectBankModal closeModal={() => this.toggleSelectBankModal()}/>
                </Modal>
            </View>
        )
    }

}