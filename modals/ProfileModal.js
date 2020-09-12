import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"

class IndivPickupCard extends React.Component {
    state = {
        readyForPickUp: false,
        holderAddress: "",
        holderEmail: "",
        holderName: "",
        courierEmail: "",
        courierName: "",
        courierAddress: ""
    }

    markReady = () => {
        console.log(this.state.holderEmail);
        this.setState({readyForPickUp: !this.state.readyForPickUp});
        const orderref = firebase.firestore().collection('requests').doc(this.props.order.id);
        let uemail = firebase.auth().currentUser.email;
        orderref.get().then(function(doc){
            if(doc.exists){
                let stops = doc.data().chain.length-1;
                let currentIndex = doc.data().currentIndex;
                console.log(currentIndex);
                let newIndex = doc.data().currentIndex + 1;
                orderref.update({currentIndex: newIndex}); 
                if(currentIndex != 0){
                    const userref = firebase.firestore().collection('users').doc(this.state.holderEmail);
                    firebase.firestore().collection('users').doc(this.state.holderEmail).get().then(function(d){
                        let newPoints = points +  100/(stops)
                        userref.update({points: newPoints});
                    })
                }
            }
        })
    }
    
    componentDidMount(){
        const orderref = firebase.firestore().collection('requests').doc(this.props.order.id);
        orderref.get().then(function(doc){
            let holder = doc.data().chain[doc.data().currentIndex];
            if(doc.data().chain.length>1){
                if(doc.data().currentIndex < doc.data().chain.length - 1){
                    let courier = doc.data().chain[doc.data().currentIndex + 1];
                    this.setState({courierEmail: courier.email});
                    this.setState({courierName: courier.name});
                    this.setState({courierAddress: courier.address});
                } else {
                    this.setState({courierEmail: "Searching..."});
                    this.setState({courierName: "Searching..."});
                    this.setState({courierAddress: "Searching..."});
                }
            }
            this.setState({holderEmail: holder.email});
            this.setState({holderName: holder.name});
            this.setState({holderAddress: holder.address});        
       }.bind(this))
    }
    render () {
        /*let holderEmail = this.props.order.chain[this.props.order.chain.length - 1].email;
        let holderName = this.props.order.chain[this.props.order.chain.length - 1].name;
        let holderAddress = this.props.order.chain[this.props.order.chain.length - 1].address;
        let courierEmail = this.props.order.chain.length > 1 ? this.props.order.chain[1].email : "Searching...";
        let courierName = this.props.order.chain.length > 1 ? this.props.order.chain[1].name : "Searching...";
        let courierAddress = this.props.order.chain.length > 1 ? this.props.order.chain[1].address : "Searching...";
        */
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>Courier: {this.state.courierName}</Text>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>Holder: {this.state.holderName}</Text>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.state.holderAddress}</Text>

                <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>I've picked up the order</Text>
                    {!this.state.readyForPickUp ? <TouchableOpacity onPress={() => this.markReady()}>
                        <Ionicons name={this.state.readyForPickUp ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity> : null}
                </View>
            </View>
        );
    }
}

class IndivOrderCard extends React.Component {
    state = {
        readyForPickUp: false,
        chainEnded: false,
        holderAddress: "",
        holderEmail: "",
        holderName: "",
        courierEmail: "",
        courierName: "",
        courierAddress: ""
    }

    endChain = () => {
        this.setState({chainEnded: !this.state.chainEnded});

    }
    componentDidMount(){
        const orderref = firebase.firestore().collection('requests').doc(this.props.order.id);
        orderref.get().then(function(doc){
            let holder = doc.data().chain[doc.data().currentIndex];
            if(doc.data().chain.length>1){
                if(doc.data().currentIndex < doc.data().chain.length - 1){
                    let courier = doc.data().chain[doc.data().currentIndex + 1];
                    this.setState({courierEmail: courier.email});
                    this.setState({courierName: courier.name});
                    this.setState({courierAddress: courier.address});
                } else {
                    this.setState({courierEmail: "Searching..."});
                    this.setState({courierName: "Searching..."});
                    this.setState({courierAddress: "Searching..."});
                }
            }
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
                    <Text style={[styles.subtitle, {marginRight : 32, fontSize: 16, textAlign: "right"}]}>Pick up your order when convenient.</Text>
                </View>
            </View>
        );
    }
}

export default class ProfileModal extends React.Component {
    state = {
        orders: [],
        pickups: [],
        name: "",
        address: "",
        points: 0
    }

    componentDidMount () {
        let email = firebase.auth().currentUser.email;
        if (email != undefined) {
            firebase.firestore().collection("users").doc(email).get().then(function (doc) {
                if (doc.exists) {
                    let name = doc.data().name;
                    let address = doc.data().address;
                    this.setState({name: name});
                    this.setState({address: address});
                    this.setState({points: doc.data().points})
                }
            }.bind(this));

            firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
                let orders = [];
                let pickups = [];
                snapshot.forEach(function (doc) {
                    if(doc.data().from == email) {
                        orders.push({...doc.data(), ...{id: doc.id}});
                    } else if (doc.data().chain.filter(obj => obj.email == email).length > 0){
                        pickups.push({...doc.data(), ...{id: doc.id}});
                    }
                });
                this.setState({orders: orders});
                this.setState({pickups: pickups})
            }.bind(this));

        }
    }

    renderPickupCard = (order) => {
        return (
            <IndivPickupCard order={order}/>
        );
    }

    renderOrderCard = (order) => {
        return (
            <IndivOrderCard order={order}/>
        );
    }
    
    render() {
        return (
            <View style={[styles.container, {backgroundColor: "rgba(247, 247, 247, 1)"}]}>
                <TouchableOpacity style={{position: "absolute", top: 16, right: 16}} onPress={() => this.props.closeModal()}>
                    <Ionicons name="md-close" size={42} color="#000000"/>
                </TouchableOpacity>

                <Text style={styles.greeting}>{this.state.name}</Text>
                <Text style={[styles.subtitle, {marginVertical: 32}]}>{this.state.points} Points</Text>

                {true ? // if user is an individual
                    <View>
                        <Text style={[styles.subtitle, {marginTop: 32}]}>Active Orders</Text>                        
                        <FlatList
                            data={this.state.orders}
                            style={{marginHorizontal: 32, maxHeight: 400}}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 48}}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => this.renderOrderCard(item)}
                        />


                        <Text style={[styles.subtitle]}>Active Pickups</Text>
                        <FlatList
                            data={this.state.pickups}
                            style={{marginHorizontal: 32, maxHeight: 400}}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 48}}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => this.renderPickupCard(item)}
                        />
                    </View>
                : null}

                <TouchableOpacity style={{alignItems: "center", marginTop: 16}} onPress={() => this.props.signOut()}>
                    <Text style={{color: colors.primary}}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }

}