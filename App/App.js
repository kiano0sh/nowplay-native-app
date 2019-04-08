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
import {ThemeProvider} from 'react-native-elements';
import Navigations from './Navigations'


export default App = () => {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider>
                <Navigations/>
            </ThemeProvider>
        </ApolloProvider>
    )
}
