import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Icon, Overlay } from 'react-native-elements';
import {
  GET_PLAY_STATUS,
  GET_CURRENT_SONGS,
  GET_CURRENT_SONG,
  PAUSE_CURRENT_SONG,
  PLAY_CURRENT_SONG,
  PLAY_NEXT_SONG,
  PLAY_PREVIOUS_SONG,
  SET_CURRENT_TIME,
  UPDATE_CURRENT_SONG_REF,
  GET_SELECTED_SONGS,
  GET_CURRENT_MARK_LOCATION,
  GET_PLAYLIST_MODE,
  GET_CURRENT_PLAYLIST,
  SET_CURRENT_PLAYLIST,
  UPDATE_CURRENT_PLAYLIST,
} from '../../Queries/CacheQueries';
import {
  CREATE_MUSIC_MARK,
  DELETE_MUSIC_MARK,
  ADD_MUSIC,
} from '../../Queries/Mutation';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';
import Video from 'react-native-video';

class GlobalFooter extends React.Component {
  _playSong = () => {
    this.props.client.mutate({ mutation: PLAY_CURRENT_SONG });
  };

  _pauseSong = () => {
    this.props.client.mutate({ mutation: PAUSE_CURRENT_SONG });
  };

  _playNextSong = () => {
    this.props.client.mutate({ mutation: PLAY_NEXT_SONG });
  };

  _playPreviousSong = () => {
    this.props.client.mutate({ mutation: PLAY_PREVIOUS_SONG });
  };

  _setCurrentTime = ({ currentTime }) => {
    this.props.client.mutate({
      mutation: SET_CURRENT_TIME,
      variables: { currentTime },
    });
  };

  _updateCurrentSongRef = () => {
    this.props.client.mutate({
      mutation: UPDATE_CURRENT_SONG_REF,
      variables: { currentSongRef: this.currentSongRef },
    });
    // console.log(this.props.client.readQuery({query: GET_CURRENT_SONG_REF}))
  };

  _addMusicMark() {
    const {
      currentMarkLocationQuery: { currentMarkLocation },
      selectedSongsQuery: { selectedSongs },
    } = this.props;
    this.props.client
      .mutate({
        mutation: CREATE_MUSIC_MARK,
        variables: {
          longitude: Number(currentMarkLocation.longitude.toFixed(5)),
          latitude: Number(currentMarkLocation.latitude.toFixed(5)),
          musics: selectedSongs.map(music => {
            return {
              trackId: music.id,
              trackService: music.trackService,
              title: music.title,
              artwork: music.artwork,
              artist: music.artist,
              genre: music.genre,
              duration: music.duration,
              trackCreatedAt: music.trackCreatedAt,
            };
          }),
        },
      })
      .catch(err => alert(err));
  }

  _addMusic() {
    const {
      selectedSongsQuery: { selectedSongs },
    } = this.props;
    const {
      currentPlaylist: { id },
    } = this.props.client.readQuery({
      query: GET_CURRENT_PLAYLIST,
    });
    console.log(selectedSongs);

    this.props.client
      .mutate({
        mutation: ADD_MUSIC,
        variables: {
          musicMarkId: id,
          musics: selectedSongs.map(music => {
            return {
              trackId: music.id,
              trackService: music.trackService,
              title: music.title,
              artwork: music.artwork,
              artist: music.artist,
              genre: music.genre,
              duration: music.duration,
              trackCreatedAt: music.trackCreatedAt,
            };
          }),
        },
      })
      .then(result => {
        const {
          data: { addMusic },
        } = result;
        // TODO better solution
        this.props.client.mutate({
          mutation: SET_CURRENT_PLAYLIST,
          variables: {currentPlaylist: addMusic}
        });
        return this.props.navigation._navigation.navigate('MusicMarkDetails');
      })
      .catch(err => alert(err));
  }

  // shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
  //     const {playStatusQuery, currentSongQuery, selectedSongsQuery} = this.props;
  //     const playStatus = playStatusQuery.playStatus !== nextProps.playStatusQuery.playStatus;
  //     const currentSong = currentSongQuery.currentSong !== nextProps.currentSongQuery.currentSong;
  //     const selectedSongs = selectedSongsQuery.selectedSongs !== nextProps.selectedSongsQuery.selectedSongs;
  //     return playStatus || currentSong || selectedSongs
  // }

  render() {
    const {
      playStatusQuery,
      currentSongQuery,
      playlistModeQuery: { playlistMode },
      selectedSongsQuery: { selectedSongs },
    } = this.props;

    return (
      <View style={{ marginBottom: -4 }}>
        {selectedSongs.length ? (
          <View>
            <View style={styles.addBoxContainer}>
              <View style={styles.addBoxView}>
                <Text style={styles.addMusicText}>
                  {selectedSongs.length} song is selected.
                </Text>
                <View style={styles.addMusicButtonView}>
                  <Text
                    style={styles.addMusicButton}
                    onPress={() =>
                      playlistMode ? this._addMusic() : this._addMusicMark()
                    }
                  >
                    Add
                  </Text>
                  <Icon type={'font-awesome'} name={'plus-circle'} />
                </View>
              </View>
            </View>
            {/* TODO Custom compnent for loading and error */}
            {/* {loading && <Text>Loading...</Text>}
            {error && <Text>{error.message}</Text>}
            {data && <Text>yeeey</Text>} */}
          </View>
        ) : null}
        <View style={styles.playerContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this._playPreviousSong}>
              <Icon
                type={'foundation'}
                name={'previous'}
                size={30}
                color={'white'}
              />
            </TouchableOpacity>
            {playStatusQuery.playStatus ? (
              <TouchableOpacity onPress={this._pauseSong}>
                <Icon
                  type={'foundation'}
                  name={'pause'}
                  size={35}
                  containerStyle={styles.playButtonStyle}
                  color={'white'}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this._playSong}>
                <Icon
                  type={'foundation'}
                  name={'play'}
                  size={35}
                  containerStyle={styles.playButtonStyle}
                  color={'white'}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={this._playNextSong}>
              <Icon
                type={'foundation'}
                name={'next'}
                size={30}
                containerStyle={styles.nextButtonStyle}
                color={'white'}
              />
            </TouchableOpacity>
            {currentSongQuery.currentSong ? (
              <Video
                source={{ uri: currentSongQuery.currentSong.streamUrl }}
                ref={(ref: Video) => {
                  this.currentSongRef = ref;
                }}
                onLoad={this._updateCurrentSongRef}
                audioOnly={true}
                volume={1.0}
                muted={false}
                paused={!playStatusQuery.playStatus}
                playInBackground={true}
                playWhenInactive={true}
                onEnd={this._playNextSong}
                onProgress={this._setCurrentTime}
                resizeMode="cover"
                repeat={false}
              />
            ) : null}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyles} numberOfLines={1}>
              {currentSongQuery.currentSong
                ? currentSongQuery.currentSong.title
                : 'No Music Is Selected Yet!'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addBoxContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#00c853',
  },
  addBoxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addMusicText: {
    marginLeft: 10,
    fontSize: 14,
    color: 'black',
  },
  addMusicButtonView: {
    flexDirection: 'row',
    marginRight: 10,
  },
  addMusicButton: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  playerContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#393e42',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -29,
    marginLeft: 10,
  },
  titleStyles: {
    color: '#fff',
    fontSize: 16,
    maxWidth: '65%',
  },
  playButtonStyle: {
    marginRight: 20,
    marginLeft: 20,
  },
  nextButtonStyle: {
    marginRight: 10,
  },
  iconSize: 40,
});

export default compose(
  withApollo,
  graphql(GET_PLAY_STATUS, {
    options: { fetchPolicy: 'cache-only' },
    name: 'playStatusQuery',
  }),
  graphql(GET_CURRENT_SONGS, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentSongsQuery',
  }),
  graphql(GET_CURRENT_SONG, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentSongQuery',
  }),
  graphql(GET_SELECTED_SONGS, {
    options: { fetchPolicy: 'cache-only' },
    name: 'selectedSongsQuery',
  }),
  graphql(GET_CURRENT_MARK_LOCATION, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentMarkLocationQuery',
  }),
  graphql(GET_PLAYLIST_MODE, {
    options: { fetchPolicy: 'cache-only' },
    name: 'playlistModeQuery',
  }),
)(GlobalFooter);
