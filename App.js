import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import * as firebase from 'firebase'
import {YellowBox} from 'react-native'

import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import BankHome from "./screens/BankHome"
import IndivHome from "./screens/IndivHome"

// YellowBox.ignoreWarnings([""]);

var firebaseConfig = {
    apiKey: "AIzaSyBhwBgLL4mOczXnNzHYOhiDzbQC7Aaw8wU",
    authDomain: "quackhacks2020-502fa.firebaseapp.com",
    databaseURL: "https://quackhacks2020-502fa.firebaseio.com",
    projectId: "quackhacks2020-502fa",
    storageBucket: "quackhacks2020-502fa.appspot.com",
    messagingSenderId: "897305288980",
    appId: "1:897305288980:web:4f8e4efeeb177e151ae201"
};

firebase.initializeApp(firebaseConfig);

const BankStack = createStackNavigator({
    Home: {
        screen: BankHome,
        navigationOptions: {
            headerShown: false,
        }
    },
})

const IndivStack = createStackNavigator({
    Home: {
        screen: IndivHome,
        navigationOptions: {
            headerShown: false,
        }
    },
})

const AuthStack = createStackNavigator({

    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false,
          }
    },    
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
})

export default createAppContainer(
    createSwitchNavigator(
        {
            Loading: LoadingScreen,
            Indiv: IndivStack,
            Bank: BankStack,
            Auth: AuthStack
        },
        {
            initialRouteName: "Loading"
        }
    )
)