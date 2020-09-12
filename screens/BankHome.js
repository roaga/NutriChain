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
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.order.bundle}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Courier: {this.props.order.courier}</Text>

                <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>Prepared</Text>
                    <TouchableOpacity onPress={() => this.setState({prepared: !this.state.prepared})}>
                        <Ionicons name={this.state.prepared ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>Picked Up</Text>
                    <TouchableOpacity onPress={() => this.setState({pickedUp: !this.state.pickedUp})}>
                        <Ionicons name={this.state.pickedUp ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default class BankHome extends React.Component {
    state = {
        loading: true,
        email: "",
        displayName: "",
        profileModalVisible: false,
        orders: [
            {
              id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
              bundle: 'Vegetarian',
              courier: "Akash"
            },
            {
              id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
              bundle: 'Family Meal',
              courier: "Tony"
            },
            {
              id: '58694a0f-3da1-471f-bd96-145571e29d72',
              bundle: 'Regular',
              courier: "Rohan"
            },
            {
            id: '58694a0f-3da1-471f-bd96-145571e29d73',
            bundle: 'Regular',
            courier: "Tony"
            },
          ],
    }

    componentDidMount(){
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
                <Text style={styles.greeting}>App Name</Text>

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
