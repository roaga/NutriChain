import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

import styles from "../Styles"
import {colors} from "../Styles"

export default class ProfileModal extends React.Component {
    
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{position: "absolute", top: 16, right: 16}} onPress={() => this.props.closeModal()}>
                    <Ionicons name="md-close" size={42} color="#000000"/>
                </TouchableOpacity>

                <Text style={styles.greeting}>Name</Text>
                <Text style={[styles.subtitle, {marginVertical: 32}]}>Address</Text>

                <TouchableOpacity style={{alignItems: "center", marginTop: 16}} onPress={() => this.props.signOut()}>
                    <Text style={{color: colors.primary}}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }

}