import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation';
import { client } from './ApolloClient';
import { CLEAR_SELECTED_SONGS, GET_TOKEN } from './Queries/CacheQueries';
import Login from './Components/Authentication/Login';
import GoogleMapScreen from './Components/GoogleMap/GoogleMapScreen';
import ChooseMusic from './Components/MusicMark/ChooseMusic';
import MusicMarkDetails from './Components/MusicMark/MusicMarkDetails';
import AddMusicMark from './Components/MusicMark/AddMusicMark';
import Profile from './Components/Dashboard/Profile';
import { ActivityIndicator, StatusBar, View, StyleSheet } from 'react-native';
import { waitOnCache } from './ApolloClient';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements';

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    waitOnCache.then(() => this._bootstrapAsync());
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await client.cache.readQuery({ query: GET_TOKEN });
    // clear selected songs in case it remains in the cache
    client.mutate({ mutation: CLEAR_SELECTED_SONGS });
    console.log(userToken);
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.log(this.props.navigation);
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
  GoogleMapScreen,
  ChooseMusic,
  MusicMarkDetails,
});

const AddMusicMarkStack = createStackNavigator({
  AddMusicMark,
  GoogleMapScreen,
  ChooseMusic,
  MusicMarkDetails,
});

const ProfileStack = createStackNavigator({
  Profile,
  MusicMarkDetails
});

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: AppStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" type={'material'} color={tintColor} size={24} />
        ),
      },
    },
    Add: {
      screen: AddMusicMarkStack,
      navigationOptions: {
        tabBarLabel: 'Add Mark',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="add" type={'material'} color={tintColor} size={24} />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="person" type={'material'} color={tintColor} size={24} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    shifting: true,
    // activeColor: '#f0edf6',
    // inactiveColor: '#000',
    barStyle: { backgroundColor: '#16181c' },
  },
);

// const TabNavigator = createBottomTabNavigator({
//   Home: HomeStack,
//   addMusicMark: addMusicMarkStack,
//   profile: profileStack,
// });

// const MainStack = createStackNavigator({
//   Tabs: TabNavigator,
// });

const AuthStack = createStackNavigator({ Login });

const Navigations = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

export default Navigations;
