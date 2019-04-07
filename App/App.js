/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ApolloProvider} from "react-apollo";
import {client} from "./ApolloClient";
import {ThemeProvider } from 'react-native-elements';
import Navigations from './Navigations'

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <ApolloProvider client={client}>
                <ThemeProvider>
                    <Navigations/>
                </ThemeProvider>
            </ApolloProvider>
        );
    }
}
