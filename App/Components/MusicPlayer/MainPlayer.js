import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import {
  GET_CURRENT_SONG,
  SET_CURRENT_TIME,
  UPDATE_CURRENT_SONG_REF,
  GET_PLAY_STATUS,
  PLAY_NEXT_SONG,
  PLAY_CURRENT_SONG,
  PAUSE_CURRENT_SONG,
  PLAY_PREVIOUS_SONG,
} from '../../Queries/CacheQueries';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';
import MusicControl from 'react-native-music-control';

export class MainPlayer extends Component {
  componentDidMount() {
    // Seeking
    MusicControl.enableControl('seekForward', false); // iOS only
    MusicControl.enableControl('seekBackward', false); // iOS only
    MusicControl.enableControl('seek', true); // Android only
    MusicControl.enableControl('skipForward', false);
    MusicControl.enableControl('skipBackward', false);

    // Android Specific Options
    MusicControl.enableControl('setRating', false);
    MusicControl.enableControl('volume', true); // Only affected when remoteVolume is enabled
    MusicControl.enableControl('remoteVolume', false);
    MusicControl.enableControl('closeNotification', true, { when: 'paused' });

    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('stop', false);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    // listen to control callbacks
    MusicControl.on('play', () =>
      this.props.client.mutate({ mutation: PLAY_CURRENT_SONG }),
    );
    MusicControl.on('pause', () =>
      this.props.client.mutate({ mutation: PAUSE_CURRENT_SONG }),
    );
    MusicControl.on('nextTrack', () =>
      this.props.client.mutate({ mutation: PLAY_NEXT_SONG }),
    );
    MusicControl.on('previousTrack', () =>
      this.props.client.mutate({ mutation: PLAY_PREVIOUS_SONG }),
    );
  }

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
  };

  _playNextSong = () => {
    this.props.client.mutate({ mutation: PLAY_NEXT_SONG });
  };

  render() {
    const {
      currentSongQuery: { currentSong },
      playStatusQuery: { playStatus },
    } = this.props;

    return (
      <View>
        {currentSong ? (
          <Video
            source={{ uri: currentSong.streamUrl }}
            ref={(ref: Video) => {
              this.currentSongRef = ref;
            }}
            onLoad={this._updateCurrentSongRef}
            audioOnly={true}
            volume={1.0}
            muted={false}
            paused={!playStatus}
            playInBackground={true}
            playWhenInactive={true}
            onEnd={this._playNextSong}
            onProgress={this._setCurrentTime}
            resizeMode="cover"
            repeat={false}
          />
        ) : null}
      </View>
    );
  }
}

export default compose(
  withApollo,
  graphql(GET_CURRENT_SONG, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentSongQuery',
  }),
  graphql(GET_PLAY_STATUS, {
    options: { fetchPolicy: 'cache-only' },
    name: 'playStatusQuery',
  }),
)(MainPlayer);
