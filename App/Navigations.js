import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import {client} from './ApolloClient'
import {CLEAR_SELECTED_SONGS, GET_TOKEN} from "./Queries/CacheQueries";
import Login from './Components/Authentication/Login'
import GoogleMapScreen from './Components/GoogleMap/GoogleMapScreen'
import ChooseMusic from './Components/MusicMark/ChooseMusic'
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
        // clear selected songs in case it remains in the cache
        client.mutate({mutation: CLEAR_SELECTED_SONGS})
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

const AppStack = createStackNavigator({
    Home: GoogleMapScreen,
    ChooseMusic
});
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