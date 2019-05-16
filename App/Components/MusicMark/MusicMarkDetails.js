import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Card, ListItem, Button, Icon, Overlay } from 'react-native-elements';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';
import {
  GET_CURRENT_PLAYLIST,
  // UPDATE_CURRENT_ROUTE_NAME,
  UPDATE_CURRENT_PLAYLIST_SONG,
  PLAY_CURRENT_SONG,
  UPDATE_PLAYLIST_MODE,
} from '../../Queries/CacheQueries';
import { DELETE_MUSIC_MARK } from '../../Queries/Mutation';
import { getMusicDetails } from '../../API/Soundcloud/soundcloudHelper';
import GlobalFooter from '../MusicPlayer/GlobalFooter';
import { ScrollView } from 'react-native-gesture-handler';

class MusicMarkDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }
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
          onPress={() => navigation.getParam('toggleIsVisible')()}
          style={[{ paddingHorizontal: 15 }]}
        >
          <Icon type={'font-awesome'} name={'trash'} color={'#fff'} size={30} />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      toggleIsVisible: this._toggleIsVisible,
    });
  }

  _toggleIsVisible = () => {
    this.setState({ isVisible: true });
  };

  _onDeletePlaylistPress = () => {
    const {
      currentPlaylistQuery: {
        currentPlaylist: { id },
      },
    } = this.props;
    this.props.client
      .mutate({
        mutation: DELETE_MUSIC_MARK,
        variables: { musicMarkId: id },
        fetchPolicy: 'no-cache',
      })
      .then(({ data: { deleteMusicMark: { id } } }) => {
        this.setState({ isVisible: false });
        return this.props.navigation.navigate('GoogleMapScreen', {
          deletedMusicMarkId: id,
        });
      })
      .catch(err => {
        this.setState({ isVisible: false });
        return alert(err);
      });
  };

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
        <Overlay
          isVisible={this.state.isVisible}
          width="70%"
          height="20%"
          windowBackgroundColor="rgba(0, 0, 0, .5)"
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <View style={styles.deletePlaylistContainer}>
            <Text style={styles.deletePlaylistWarning}>
              Are you sure you want to delete this playlist ?
            </Text>
            <Button
              title={'Delete'}
              buttonStyle={styles.deletePlaylistButton}
              titleStyle={{ color: '#fff' }}
              onPress={this._onDeletePlaylistPress}
            />
          </View>
        </Overlay>
        <ScrollView>
          <FlatList
            keyExtractor={this._keyExtractor}
            data={musics}
            renderItem={this.renderItem}
          />
        </ScrollView>
        <GlobalFooter />
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
  deletePlaylistContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deletePlaylistWarning: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: '5%',
  },
  deletePlaylistButton: {
    backgroundColor: '#ed5e68',
  },
});

export default compose(
  withApollo,
  graphql(GET_CURRENT_PLAYLIST, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentPlaylistQuery',
  }),
)(MusicMarkDetails);
