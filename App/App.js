/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {ApolloProvider, withApollo} from "react-apollo";
import {client} from "./ApolloClient";
import {ThemeProvider} from 'react-native-elements';
import Navigations from './Navigations'
import GlobalFooter from './Components/MusicPlayer/GlobalFooter'


class App extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
            isFooter: false
        };
    }

    // componentDidMount(): void {
    //     console.log(this.props)
    //     client.mutate({mutation: CLEAR_SELECTED_SONGS})
    // }

    handleNavigationChange = (prevState, newState, action) => {
        if (newState.index === 1) {
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
                                 onNavigationStateChange={this.handleNavigationChange}
                    />
                    {console.log(isFooter)}
                    {isFooter ? <GlobalFooter navigation={this.navigation}/> : null}
                </ThemeProvider>
            </ApolloProvider>
        )
    }
}

export default App


