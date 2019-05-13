import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';
import {
  GET_CURRENT_PLAYLIST,
  UPDATE_CURRENT_ROUTE_NAME,
  UPDATE_CURRENT_PLAYLIST_STACK,
  PLAY_CURRENT_SONG
} from '../../Queries/CacheQueries';
import { getMusicDetails } from '../../API/Soundcloud/soundcloudHelper';

class MusicMarkDetails extends Component {
  static navigationOptions = {
    title: 'Playlist',
    headerStyle: {
      backgroundColor: '#393e42',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentWillMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.props.client.mutate({
        mutation: UPDATE_CURRENT_ROUTE_NAME,
        variables: {
          currentRouteName: this.props.navigation.state.routeName,
        },
      });
    });
  }

  _updateStack = index => {
    console.log(index);

    this.props.client.mutate({
        mutation: UPDATE_CURRENT_PLAYLIST_STACK,
        variables: {index}
    });

    this.props.client.mutate({
        mutation: PLAY_CURRENT_SONG
    });
  };

  _keyExtractor = (item, index) => item.id;

  renderItem = ({ item, index }) => (
    <ListItem
      title={item.title}
      subtitle={
        <View>
          <Text style={styles.soundcloudText}>
            From Soundcloud by {item.artist}.
          </Text>
        </View>
      }
      rightSubtitle={
        <Text style={styles.musicDuration}>
          {(item.duration / 60000).toFixed(2).replace('.', ':')}
        </Text>
      }
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      leftAvatar={{
        source: { uri: item.artwork },
        rounded: false,
        size: 'large',
      }}
      bottomDivider
      containerStyle={{ backgroundColor: '#121619' }}
      onPress={() => this._updateStack(index)}
    />
  );

  render() {
    const {
      currentPlaylistQuery: { currentPlaylist },
    } = this.props;
    console.log(currentPlaylist);
    return (
      <View style={{backgroundColor: '#121619', flex: 1}}>
        <Button
          title={'Add your favourite songs here!'}
          onPress={() => this.props.navigation.navigate('ChooseMusic')}
          icon={
            <Icon
              type={'font-awesome'}
              name={'plus'}
              iconStyle={styles.iconStyle}
            />
          }
          raised
          buttonStyle={styles.buttonStyle}
        />

        <FlatList
          keyExtractor={this._keyExtractor}
          data={currentPlaylist.musics}
          renderItem={this.renderItem}
        />

        {/* <Card containerStyle={{ padding: 0 }}>
          {currentPlaylist.musics.map((music, index) => {
            console.log(music);

            return (
              <ListItem
                key={index}
                title={music.title}
                leftAvatar={{
                  source: { uri: music.artwork },
                  rounded: false,
                  size: 'large',
                }}
              />
            );
          })}
        </Card> */}
      </View>
    );
  }
}

styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#00c853',
  },
  iconStyle: {
    marginRight: '5%',
    color: 'white',
  },
  musicDuration: {
    color: 'white',
    marginRight: 15,
  },
  soundcloudText: {
    color: 'white',
  },
});

export default compose(
  withApollo,
  graphql(GET_CURRENT_PLAYLIST, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentPlaylistQuery',
  }),
)(MusicMarkDetails);
