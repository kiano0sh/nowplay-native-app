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
import MainPlayer from './Components/MusicPlayer/MainPlayer';
// import { GET_CURRENT_ROUTE_NAME } from './Queries/CacheQueries';
import { Text } from 'react-native';
import NavigationService from './NavigationService';

// Allowed screens for GlobalFooter
// const allowedScreens = ['GoogleMapScreen', 'ChooseMusic', 'MusicMarkDetails'];

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider>
          <Navigations />
          <MainPlayer />
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;
