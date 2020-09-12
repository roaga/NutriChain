import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground} from 'react-native'
import * as firebase from 'firebase'
import styles from "../Styles"

export default class LoginScreen extends React.Component {
    state = {
        email: "",
        password: "",
        errorMessage: null
    }

    handleLogin = () => {
        const {email, password} = this.state;
        
        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => this.setState({errorMessage: error.message}));
        firebase.auth().onAuthStateChanged(user => {
            user.reload();
            if(user && !user.emailVerified){
                this.setState({errorMessage: "Your email is not verified. Check your inbox."})
            }
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.greeting}>
                    {'Welcome back!'}
                </Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>
                
                <View style={styles.form}>
                    <View>
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
                            autoCompleteType="password"
                            onChangeText={password => this.setState({password})}
                            value={this.state.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => {
                        firebase.auth().sendPasswordResetEmail(this.state.email).then(function() {
                            // Email sent.
                        }).catch(function(error) {
                            // An error happened.
                        });
                    }}
                >
                    <Text style={{color: "#E9446A", fontSize: 14,fontWeight: "500"}}>
                        Reset password.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => this.props.navigation.navigate("Register")}>
                    <Text style={{color: "#414959", fontSize: 14}}>
                        New around here? <Text style={{fontWeight: "500", color: "#E9446A"}}>Sign up.</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}