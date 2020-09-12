import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal, Alert} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';

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
                let uemail = firebase.auth().currentUser.email;
                firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then(function(doc) {
                    if (doc.exists) {
                        let uname = doc.data().name;
                        let uaddress = doc.data().address;
                        let uemail = firebase.auth().currentUser.email;
                        let ucoords = doc.data().coords;
                        //let points = doc.data().points;
                        orderref.get().then(function(doc){
                            if(doc.exists){
                                let uchain = doc.data().chain;
                                let currentIndex = doc.data().currentIndex;
                                uchain.push({
                                    name: uname,
                                    email: uemail,
                                    address: uaddress,
                                    coords: ucoords
                                })
                                // let newindex = doc.data().currentIndex + 1;
                                orderref.update({chain: uchain, currentIndex: currentIndex});
                                
                                
                            }
                        });
                        if (doc.data().from == firebase.auth().currentUser.email) { 
                            let currentIndex = doc.data().currentIndex;
                            firebase.firestore().collection("archives").add(doc.data()); // add data to archives
                            orderref.delete(); // delete data from requests
                            firebase.firestore().collection('users').doc(firebase.auth().currentUser.email).get().then(function(doc) {
                                if (doc.exists) {
                                    let points = doc.data().points;
                                    console.log(points);
                                    points = 100 / (currentIndex + 1) + points;
                                    firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).update({points: points});
                                }
                            });
                        }
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
        orderref.onSnapshot(function(doc){
            if (doc.exists && doc.data() != undefined) {
                let holder = doc.data().chain[doc.data().currentIndex];
                this.setState({holderEmail: holder.email});
                this.setState({holderName: holder.name});
                this.setState({holderAddress: holder.address});    
            }    
        }.bind(this));
    }
    render () {
       return (
        <Animatable.View style={styles.card} animation="slideInUp" duration={500}>
            <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.state.holderAddress}</Text>
            <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Holder: {this.state.holderName}</Text>

            <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16, fontWeight: "700"}]}>I'll pick this up</Text>
                <TouchableOpacity onPress={() => this.addToChain()}>
                    <Ionicons name={this.state.pickedUp ? "md-square" : "md-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                </TouchableOpacity>
            </View>
        </Animatable.View>
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
        address: "",
        coords: []
    }

    async componentDidMount(){
        this.setState({email: firebase.auth().currentUser.email});
        await firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then(function (doc) {
            if (doc.exists) {
                this.setState({coords: doc.data().coords});
                this.setState({address: doc.data().address});
            }
        }.bind(this));

        firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
            let requests = [];
            snapshot.forEach(function (doc) {
                if (doc.exists && doc.data() != undefined) {
                    let diff = 0.02; // threshold in degrees
                    if((doc.data().chain.filter(item => item.email == this.state.email).length < 1 && doc.data().chain.filter(item => item.email == doc.data().from).length < 1)
                        && 
                        (
                            (doc.data().chain[doc.data().currentIndex].coords[0].latitude >= this.state.coords[0].latitude - diff && doc.data().fromCoords[0].latitude <= this.state.coords[0].latitude + diff) ||
                        (doc.data().chain[doc.data().currentIndex].coords[0].latitude <= this.state.coords[0].latitude + diff && doc.data().fromCoords[0].latitude >= this.state.coords[0].latitude - diff)
                        ) && (
                            (doc.data().chain[doc.data().currentIndex].coords[0].longitude >= this.state.coords[0].longitude - diff && doc.data().fromCoords[0].longitude <= this.state.coords[0].longitude + diff) ||
                        (doc.data().chain[doc.data().currentIndex].coords[0].longitude <= this.state.coords[0].longitude + diff && doc.data().fromCoords[0].longitude >= this.state.coords[0].longitude - diff)
                        )
                    ){
                        requests.push({...doc.data(), ...{id: doc.id}});
                    }
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
                <View style={{backgroundColor: "#fff", width: "100%", paddingBottom: 16}}>
                    <Text style={[styles.greeting, {color: colors.primary}]}>NutriChain</Text>
                </View>

                <TouchableOpacity style={[styles.button, {marginTop: 32}]} onPress={() => this.toggleProfileModal()}>
                    <View style={{flexDirection: "row"}}>
                        <Ionicons name="md-list-box" size={32} color="#fff" style={{justifyContent: "center", marginRight: 8}} size={24}/>
                        <Text style={styles.buttonText}>Your Info</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {marginTop: 16, marginBottom: 32}]} onPress={() => this.toggleSelectBankModal()}>
                <View style={{flexDirection: "row"}}>
                        <Ionicons name="ios-nutrition" size={32} color="#fff" style={{justifyContent: "center", marginRight: 8}} size={24}/>
                        <Text style={styles.buttonText}>Order Food</Text>
                    </View>
                </TouchableOpacity>

                <Text style={[styles.subtitle, {borderBottomWidth: 4, borderRadius: 10, paddingBottom: 16, borderColor: colors.primary, fontWeight: "700"}]}>Nearby Pickups</Text>

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
                    <SelectBankModal closeModal={() => this.toggleSelectBankModal()} address={this.state.address} coords={this.state.coords}/>
                </Modal>
            </View>
        )
    }

}