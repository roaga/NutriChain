import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"

class IndivPickupCard extends React.Component {
    state = {
        readyForPickUp: false,
    }

    render () {
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>Courier: {this.props.order.courier != null ? this.props.order.courier : "Searching..."}</Text>

                <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>I've picked up the order</Text>
                    <TouchableOpacity onPress={() => this.setState({readyForPickUp: !this.state.readyForPickUp})}>
                        <Ionicons name={this.state.readyForPickUp ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
class IndivOrderCard extends React.Component {
    state = {
        readyForPickUp: false,
    }

    render () {
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.order.address}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Holder: {this.props.order.holder != null ? this.props.order.holder : "Searching..."}</Text>

                <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>This is close enough for me</Text>
                    <TouchableOpacity onPress={() => this.setState({chainEnded: !this.state.chainEnded})}>
                        <Ionicons name={this.state.chainEnded ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default class ProfileModal extends React.Component {
    state = {
        orders: [{
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            bundle: 'Vegetarian',
            holder: "Akash",
            address: "Techwood"
          }],
        pickups: [],
        name: "",
        address: ""
    }

    componentDidMount () {
        let email = firebase.auth().currentUser.email;
        if (email != undefined) {
            firebase.firestore().collection("users").doc(email).get().then(function (doc) {
                if (doc.exists) {
                    let name = doc.data().name;
                    let address = doc.data().address;
                    console.log(name + " " + address);
                    this.setState({name: name});
                    this.setState({address: address});
                }
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
                <Text style={[styles.subtitle, {marginVertical: 32}]}>{this.state.address}</Text>

                {true ? // if user is an individual
                    <View>
                        <Text style={[styles.subtitle]}>Current Order</Text>                        
                        <FlatList
                            data={this.state.orders}
                            style={{marginHorizontal: 32, maxHeight: 400}}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 48}}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => this.renderOrderCard(item)}
                        />


                        <Text style={[styles.subtitle]}>Current Pickup</Text>
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