import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import GlobalFooter from '../MusicPlayer/GlobalFooter';
import GoogleMapScreen from '../GoogleMap/GoogleMapScreen';

export class AddMusicMark extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    console.log(this.props);
    return (
      <View style={{ flex: 1 }}>
        {/* <View>
          <Text>Hello AddMark</Text>
        </View> */}
        {/* <GlobalFooter /> */}
        <GoogleMapScreen navigation={this.props.navigation} addMode={true}/>
      </View>
    );
  }
}

export default AddMusicMark;
