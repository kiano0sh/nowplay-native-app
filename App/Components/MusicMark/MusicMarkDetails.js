import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { graphql, compose, Mutation, withApollo } from 'react-apollo';
import { GET_CURRENT_PLAYLIST, UPDATE_CURRENT_ROUTE_NAME } from '../../Queries/CacheQueries';
import { getMusicDetails } from '../../API/Soundcloud/soundcloudHelper';

class MusicMarkDetails extends Component {

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

  render() {
    const {
      currentPlaylistQuery: { currentPlaylist },
    } = this.props;
    console.log(currentPlaylist);
    return (
      <View>
        <Card containerStyle={{ padding: 0 }}>
          {currentPlaylist.musics.map((music, index) => {
            console.log(music)

            return (
              <ListItem
                key={index}
                title={music.title}
                leftAvatar={{
                  source: {uri: music.artwork},
                  rounded: false,
                  size: 'large',
                }}
              />
            );
          })}
        </Card>
        <Button
          title={'SEARCH'}
          onPress={() => this.props.navigation.navigate('ChooseMusic')}
        />
      </View>
    );
  }
}

export default compose(
  withApollo,
  graphql(GET_CURRENT_PLAYLIST, {
    options: { fetchPolicy: 'cache-only' },
    name: 'currentPlaylistQuery',
  }),
)(MusicMarkDetails);
