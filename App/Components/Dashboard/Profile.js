import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import GlobalFooter from '../MusicPlayer/GlobalFooter';

class Profile extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Text>Hello Profile</Text>
        </ScrollView>
        <GlobalFooter />
      </View>
    );
  }
}

export default Profile;
