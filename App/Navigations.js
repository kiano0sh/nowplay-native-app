import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import {client} from './ApolloClient'
import {GET_TOKEN} from "./Queries/CacheQueries";
import Login from './Components/Authentication/Login'
import Register from './Components/Authentication/Register'
import Dashboard from './Components/Dashboard/Dashboard'
import GoogleMapScreen from './Components/GoogleMap/GoogleMapScreen'
import OpenStreetMapScreen from './Components/OpenstreetMap/OpenStreetMapScreen'
import {ActivityIndicator, StatusBar, View, StyleSheet} from 'react-native';
import {waitOnCache} from "./ApolloClient";

class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        waitOnCache.then(() => this._bootstrapAsync())
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await client.cache.readQuery({ query: GET_TOKEN });
        console.log(userToken);
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken.token ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const AppStack = createStackNavigator({ Home: GoogleMapScreen});
const AuthStack = createStackNavigator({ Login });

const Navigations = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));

export default Navigations;