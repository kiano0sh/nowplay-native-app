/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView} from 'react-native';
import ApolloClient, { gql } from "apollo-boost";
import {ApolloProvider} from "react-apollo";
import {Query} from "react-apollo";

// const client = new ApolloClient({
//     // uri: "https://48p1r2roz4.sse.codesandbox.io"
//     uri: "http://localhost:4000"
// });

const client = new ApolloClient({
    uri: 'http://127.0.0.1:4000'
});

client.query({
  query: gql`
    {
      musicMarks {
        id
      }
    }
  `
}).then(result => console.log(result));

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <ApolloProvider client={client}>
                <View style={styles.container}>
                    <Query
                        query={FEED_QUERY}
                    >
                        {({ loading, error, data }) => {
                            if (loading) return <Text>Loading...</Text>;
                            if (error) {
                                console.log(error);
                                return <Text>error</Text>
                            }
                            return <Text>{data}</Text>

                            // return data.rates.map(({ currency, rate }) => (
                            //     <View key={currency}>
                            //         <Text>{currency}: {rate}</Text>
                            //     </View>
                            // ));
                        }}
                    </Query>
                </View>
            </ApolloProvider>
        );
    }
}

export const FEED_QUERY = gql`
    query FeedQuery {
        musicMarks {
            id
            title
        }
    }
`

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
