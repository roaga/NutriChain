import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import styles from "../Styles"
import {colors} from "../Styles"


export default class RegisterScreen extends React.Component {
    state = {
        name: "",
        address: "",
        email: "",
        password: "",
        errorMessage: null,
        isFoodBank: false,
        locationStatus: false
    }

    componentDidMount = async() => {
        const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {  
          alert('Hey! Location is required for this app to function.');
        } else {
            this.setState({locationStatus: true});
        }
    }

    handleSignup = async () => {
        if(this.state.locationStatus){
            if(this.state.name.length > 0 && this.state.address.length > 0){
                let coords = await Location.geocodeAsync(this.state.address);
                if(coords.accuracy !== null){   
                    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(userCredentials => {
                        userCredentials.user.sendEmailVerification().then(function() {
                            firebase.auth().signOut();
                            this.setState({errorMessage: this.state.isFoodBank ? "Please check for a verification email and our team will be in contact." 
                                : "Please check for a verification email."});
                        }.bind(this));
                        firebase.firestore().collection('users').doc(this.state.email).set({
                            address: this.state.address,
                            isFoodBank: this.state.isFoodBank,
                            name: this.state.name,
                            coords: coords,
                            points: 100                 
                        });
                        return userCredentials.user.updateProfile({
                            displayName: this.state.name
                        })
                    }).catch(error => this.setState({errorMessage: error.message}));
                } else {
                    this.setState({errorMessage: "Invalid address."})
                }
            } else{
                this.setState({errorMessage: "A name and address are required."})
            }
        } else {
            this.setState({errorMessage: "You must enable location permissions."})
        }
    }

    render(){
        return(
            <ScrollView style={[styles.container, {paddingBottom: 64}]} contentContainerStyle={{paddingBottom: 32}}>

                <Text style={styles.greeting}>
                    {'Hello!'}
                </Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View style={[styles.input, {justifyContent: "center", alignItems: "center", flexDirection: "row", backgroundColor: "none"}]}>
                        <TouchableOpacity onPress={() => this.setState({isFoodBank: !this.state.isFoodBank})}>
                            <Ionicons name={this.state.isFoodBank ? "ios-square" : "ios-square-outline"} size={24} color={colors.primary} style={{width: 32}} />
                        </TouchableOpacity>

                        <Text>Are you a food bank?</Text>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Name</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize='none' 
                            autoCompleteType="name"
                            onChangeText={name => this.setState({name})}
                            value={this.state.name}
                            maxLength={25}
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Address</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize='none' 
                            autoCompleteType="name"
                            onChangeText={address => this.setState({address})}
                            value={this.state.address}
                            maxLength={100}
                            textContentType="streetAddressLine1"
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize='none' 
                            autoCompleteType="email"
                            onChangeText={email => this.setState({email})}
                            value={this.state.email}
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput 
                            style={styles.input} 
                            secureTextEntry 
                            autoCapitalize='none'
                            onChangeText={password => this.setState({password})}
                            value={this.state.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleSignup}>
                    <Text style={{color: "#FFF", fontWeight: "700", fontSize: 18}}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={{color: "#414959", fontSize: 14}}>
                        Already registered? <Text style={{fontWeight: "500", color: "#E9446A"}}>Login.</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}