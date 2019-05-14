import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';
import {
  GET_CURRENT_PLAYLIST,
  UPDATE_CURRENT_ROUTE_NAME,
  UPDATE_CURRENT_PLAYLIST_SONG,
  PLAY_CURRENT_SONG,
  UPDATE_PLAYLIST_MODE,
} from '../../Queries/CacheQueries';
import { DELETE_MUSIC_MARK } from '../../Queries/Mutation';
import { getMusicDetails } from '../../API/Soundcloud/soundcloudHelper';

class MusicMarkDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Playlist',
      headerStyle: {
        backgroundColor: '#393e42',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation
              .getParam('client')
              .mutate({
                mutation: DELETE_MUSIC_MARK,
                variables: { musicMarkId: navigation.getParam('musicMarkId') },
                fetchPolicy: 'no-cache',
              })
              .then(data => {
                console.log(d);
              })
              .catch(err => console.log(err))
          }
          style={[{ paddingHorizontal: 15 }]}
        >
          <Icon type={'font-awesome'} name={'trash'} color={'#fff'} size={30} />
        </TouchableOpacity>
      ),
    };
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

  componentDidMount() {
    const {
      currentPlaylistQuery: { currentPlaylist },
    } = this.props;
    this.props.navigation.setParams({
      musicMarkId: currentPlaylist.id,
      client: this.props.client,
    });
  }

  _updateStack = index => {
    console.log(index);

    this.props.client.mutate({
      mutation: UPDATE_CURRENT_PLAYLIST_SONG,
      variables: { index },
    });

    this.props.client.mutate({
      mutation: PLAY_CURRENT_SONG,
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
      currentPlaylistQuery: {
        currentPlaylist: { musics },
      },
    } = this.props;
    return (
      <View style={{ backgroundColor: '#121619', flex: 1 }}>
        <Button
          title={'Add your favourite songs here!'}
          onPress={() => {
            this.props.client.mutate({
              mutation: UPDATE_PLAYLIST_MODE,
              variables: { playlistMode: true },
            });
            return this.props.navigation.navigate('ChooseMusic');
          }}
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
          data={musics}
          renderItem={this.renderItem}
        />
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
