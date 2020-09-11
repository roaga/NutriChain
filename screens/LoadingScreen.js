import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import * as firebase from 'firebase'
import {colors} from "../Styles"

export default class LoadingScreen extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            //TODO: redirect to BankStack if this user is a food bank account
            if(user && user.emailVerified){
                this.props.navigation.navigate("IndivStack");
            } else {
                this.props.navigation.navigate("Auth");
            }
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(247, 247, 247, 1)"
    }
})