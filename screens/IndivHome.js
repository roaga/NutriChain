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

    render () {
        return (
            <View style={styles.card}>
                <Text style={[styles.subtitle, {alignSelf: "flex-start"}]}>{this.props.order.address}</Text>
                <Text style={[styles.subtitle, {fontSize: 16, alignSelf: "flex-start"}]}>Holder: {this.props.order.courier}</Text>

                <View style={{flexDirection: "row", alignSelf: "flex-end", marginTop: 8, position: "absolute", bottom: 16}}>
                    <Text style={[styles.subtitle, {marginHorizontal : 32, fontSize: 16}]}>I'll pick this up</Text>
                    <TouchableOpacity onPress={() => this.setState({pickedUp: !this.state.pickedUp})}>
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
        orders: [
            {
              id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
              bundle: 'Vegetarian',
              courier: "Akash",
              address: "Techwood"
            },
            {
              id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
              bundle: 'Family Meal',
              courier: "Tony",
              address: "North Ave"
            },
            {
              id: '58694a0f-3da1-471f-bd96-145571e29d72',
              bundle: 'Regular',
              courier: "Rohan",
              address: "Power Plant Dr"
            },
            {
            id: '58694a0f-3da1-471f-bd96-145571e29d73',
            bundle: 'Regular',
            courier: "Tony",
            address: "North Ave"
            },
          ],
    }

    /*
    Object {
        "chain": Array [
            "aveerappan8@gatech.edu",
            "tonyahn02@gmail.com",
        ],
        "from": "aveerappan8@gatech.edu",
        "isChainComplete": false,
        "isOrderProcessed": false,
        "mealPlan": "Veggies Bundle",
        }
    Object {
        "this": "this",
    }
    Object {
        "one": "one",
    }
*/

    componentDidMount(){
        this.setState({loading: false});
        firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
            snapshot.forEach(function (doc) {
                console.log(doc.data());
                firebase.firestore().collection("users").doc(doc.data().from).get().then(function(d) {
                    if (d.exists) {
                        let address = d.data().address;
                        console.log(address);
                    }
                })
            });
        });
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


// let getData = function () {
//     firebase.firestore().collection("requests").onSnapshot(function(snapshot) {
//         snapshot.forEach(function (doc) {
//             // write List code
//             requests.push(doc.data());
//         });
//     });
// }