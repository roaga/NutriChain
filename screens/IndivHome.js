import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"
import ProfileModal from "../modals/ProfileModal"
import SelectBankModal from '../modals/SelectBankModal'

class IndivOrderCard extends React.Component {
    state = {
        pickedUp: false,
    }

    addToChain = () => {
        this.setState({pickedUp: !this.state.pickedUp});

    }

    render () {
        let holderEmail = this.props.order.chain[this.props.order.chain.length - 1].email;
        let holderName = this.props.order.chain[this.props.order.chain.length - 1].name;
        let holderAddress = this.props.order.chain[this.props.order.chain.length - 1].address;

        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{holderAddress}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Holder: {holderName}</Text>

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
        firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
            let requests = [];
            snapshot.forEach(function (doc) {
                requests.push({...doc.data(), ...{id: doc.id}});
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
            <IndivOrderCard order={order}/>
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