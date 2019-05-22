import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Button, ScrollView } from 'react-native';
import { SearchBar, ListItem, Text, Icon } from 'react-native-elements';
import { soundcloudSearch } from '../../API/Soundcloud/soundcloudHelper';
import {
  CLEAR_SELECTED_SONGS,
  GET_CURRENT_SONG,
  GET_CURRENT_SONGS,
  GET_PLAY_STATUS,
  PLAY_CURRENT_SONG,
  UPDATE_CURRENT_STACK,
  UPDATE_SELECTED_SONGS,
  UPDATE_PLAYLIST_MODE,
} from '../../Queries/CacheQueries';
import { withApollo } from 'react-apollo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobalFooter from '../MusicPlayer/GlobalFooter';

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onSelectSong(this.props.id);
    this.props.updateSelectedSongs();
  };

  render() {
    const textColor = this.props.selected ? '#00c853' : '#fff';
    const { title, user, duration, artwork_url } = this.props;
    return (
      <ListItem
        title={title}
        subtitle={
          <View>
            <Text style={styles.soundcloudText}>
              From Soundcloud by {user.username}.
            </Text>
          </View>
        }
        rightSubtitle={
          <View style={styles.subtitleView}>
            <Text style={styles.musicDuration}>
              {(duration / 60000).toFixed(2).replace('.', ':')}
            </Text>
            <TouchableOpacity>
              <Icon
                type={'font-awesome'}
                name={'check-circle'}
                size={30}
                color={textColor}
                onPress={this._onPress}
              />
            </TouchableOpacity>
          </View>
        }
        titleStyle={{ color: 'white', fontWeight: 'bold' }}
        leftAvatar={{
          source: !!artwork_url
            ? { uri: artwork_url }
            : { uri: user.avatar_url },
          rounded: false,
          size: 'large',
        }}
        bottomDivider
        containerStyle={{ backgroundColor: '#121619' }}
        onPress={() => this.props.onPressItem()}
      />
    );
  }
}

class ChooseMusic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      nextPageExists: false,
      collection: [],
      loading: false,
      // TODO after pressing clear button while data is fetching an amount of data remains in state!
      page: 0,
      selected: (new Map(): Map<string, boolean>),
    };
  }

  static navigationOptions = {
    title: 'Choose Music',
    headerStyle: {
      backgroundColor: '#393e42',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentWillUnmount(): void {
    this.props.client.mutate({ mutation: CLEAR_SELECTED_SONGS });
    this.props.client.mutate({
      mutation: UPDATE_PLAYLIST_MODE,
      variables: { playlistMode: false },
    });
  }

  // add selected track to state
  _updateSelectedSongs(selectedSong) {
    this.props.client.mutate({
      mutation: UPDATE_SELECTED_SONGS,
      variables: { selectedSong },
    });
  }

  updateSearch = search => {
    if (!!search) {
      this.setState((state, props) => {
        return {
          search,
          loading: true,
        };
      });
      soundcloudSearch(search)
        .then(results => {
          this.setState((state, props) => {
            return {
              nextPageExists: !!results.next_href,
              collection: results.collection,
              loading: false,
            };
          });
        })
        .catch(error => console.log(error));
    } else {
      this.setState((state, props) => {
        this.props.client.mutate({ mutation: CLEAR_SELECTED_SONGS });
        return {
          search,
          nextPageExists: false,
          collection: [],
          loading: false,
          page: 0,
        };
      });
    }
  };

  _onSelectSong = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState(state => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return { selected };
    });
  };

  _keyExtractor = (item, index) => `item-${index}`;

  renderItem = ({ item }) => (
    <MyListItem
      id={item.id}
      onSelectSong={this._onSelectSong}
      updateSelectedSongs={() => this._updateSelectedSongs(item)}
      onPressItem={() => this._updateStack(item)}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
      user={item.user}
      duration={item.duration}
      artwork_url={item.artwork_url}
    />
  );

  _updateStack = music => {
    this.props.client.mutate({
      mutation: UPDATE_CURRENT_STACK,
      variables: { music },
    });

    this.props.client.mutate({
      mutation: PLAY_CURRENT_SONG,
    });
  };

  _nextPage = () => {
    let { search, page, nextPageExists, collection, clear } = this.state;
    if (nextPageExists && !!search) {
      let nextPage = page + 1;
      this.setState((state, props) => {
        return {
          loading: true,
        };
      });
      soundcloudSearch(search, nextPage)
        .then(nextPageResults => {
          this.setState((state, props) => {
            return {
              nextPageExists: !!nextPageResults.next_href,
              collection: [...collection, ...nextPageResults.collection],
              loading: false,
              page: nextPage,
            };
          });
        })
        .catch(error => console.log(error));
    } else {
    }
  };

  render() {
    const { search, loading, collection } = this.state;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ backgroundColor: '#121619', flex: 1 }}>
          <SearchBar
            placeholder="Search in Soundcloud..."
            onChangeText={this.updateSearch}
            showLoading={loading}
            value={search}
            clearIcon={!!search}
            onClear={() =>
              this.setState((state, props) => {
                this.props.client.mutate({ mutation: CLEAR_SELECTED_SONGS });
                return {
                  nextPageExists: false,
                  collection: [],
                  page: 0,
                };
              })
            }
          />
          {!!collection && !!collection.length && (
            <FlatList
              keyExtractor={this._keyExtractor}
              data={collection}
              renderItem={this.renderItem}
              extraData={this.state}
              onEndReached={() => this._nextPage()}
            />
          )}
        </View>
        <GlobalFooter />
      </View>
    );
  }
}

export default withApollo(ChooseMusic);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  subtitleView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  soundcloudText: {
    color: 'white',
  },
  musicDuration: {
    color: 'white',
    marginRight: 15,
  },
});
