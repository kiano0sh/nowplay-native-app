/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';
import {ApolloProvider} from "react-apollo";
// import {Query} from "react-apollo";
// import {MUSIC_MARKS} from './Queries/Qurey'
import {client} from "./ApolloClient";
import Login from './Components/Authentication/Login'
import {ThemeProvider } from 'react-native-elements';
// import Test from "./Test";


type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <ApolloProvider client={client}>
                <ThemeProvider>
                    <Login/>
                    {/*<Test/>*/}
                    {/*<Query*/}
                    {/*    query={MUSIC_MARKS}*/}
                    {/*>*/}
                    {/*    {({ loading, error, data }) => {*/}
                    {/*        if (loading) return <Text>Loading...</Text>;*/}
                    {/*        if (error) {*/}
                    {/*            console.log(error);*/}
                    {/*            return <Text>error</Text>*/}
                    {/*        }*/}

                    {/*        return data.musicMarks.map(({ id, title, latitude, longitude }) => (*/}
                    {/*            <View key={id}>*/}
                    {/*                <Text>{id}: {title}, latitude: {latitude}, longitude: {longitude}</Text>*/}
                    {/*            </View>*/}
                    {/*        ));*/}
                    {/*    }}*/}
                    {/*</Query>*/}
                </ThemeProvider>
            </ApolloProvider>
        );
    }
}
