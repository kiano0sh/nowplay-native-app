/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { ApolloProvider, withApollo, Query } from 'react-apollo';
import { client } from './ApolloClient';
import { ThemeProvider } from 'react-native-elements';
import Navigations from './Navigations';
import GlobalFooter from './Components/MusicPlayer/GlobalFooter';
import { GET_CURRENT_ROUTE_NAME } from './Queries/CacheQueries';
import { Text } from 'react-native';

// Allowed screens for GlobalFooter
const allowedScreens = ['Home', 'ChooseMusic', 'MusicMarkDetails'];

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider>
          <Navigations ref={nav => this.nav = nav}/>
          <Query query={GET_CURRENT_ROUTE_NAME}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              const { currentRouteName } = data;
              return currentRouteName &&
                allowedScreens.find(screen => screen === currentRouteName) ? (
                <GlobalFooter navigation={this.nav}/>
              ) : null;
            }}
          </Query>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;
