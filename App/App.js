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
import { Text } from 'react-native';
import NavigationService from './NavigationService';

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider>
          <Navigations
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
          <MainPlayer />
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;
