import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import GlobalFooter from '../MusicPlayer/GlobalFooter';

class Profile extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Text>Hello Profile</Text>
        <GlobalFooter />
      </View>
    );
  }
}

export default Profile;
