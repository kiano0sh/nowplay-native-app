/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ApolloProvider} from "react-apollo";
import {client, waitOnCache} from "./ApolloClient";
import {ThemeProvider, Text} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import Navigations from './Navigations'
import GlobalFooter from './MusicPlayer/GlobalFooter'


class App extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
            isFooter: false
        };
    }

    handleNavigationChange = (prev, next, action) => {
        if (next.index === 1) {
            this.setState({isFooter: true})
        } else {
            this.setState({isFooter: false})
        }
    };

    render() {
        const {isFooter} = this.state;
        return (
            <ApolloProvider client={client}>
                <ThemeProvider>
                    <Navigations ref={nav => {this.navigation = nav}}
                                 onNavigationStateChange={(prev, next, action) => this.handleNavigationChange(prev, next, action)}
                    />
                    {console.log(isFooter)}
                    {isFooter ? <GlobalFooter navigation={this.navigation}/> : null}
                </ThemeProvider>
            </ApolloProvider>
        )
    }
}

export default App


