import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import {
  GET_CURRENT_SONG,
  SET_CURRENT_TIME,
  UPDATE_CURRENT_SONG_REF,
  GET_PLAY_STATUS,
  PLAY_NEXT_SONG,
} from '../../Queries/CacheQueries';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';

export class MainPlayer extends Component {
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
