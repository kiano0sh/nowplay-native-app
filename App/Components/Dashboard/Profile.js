import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Divider, Button, Icon } from 'react-native-elements';
import GlobalFooter from '../MusicPlayer/GlobalFooter';
import { withApollo, graphql, compose } from 'react-apollo';
import { MY_MUSIC_MARKS, MARK_DETAIL_BY_ID } from '../../Queries/Qurey';
import {
  SET_CURRENT_PLAYLIST,
  GET_ADDED_MARK,
} from '../../Queries/CacheQueries';

import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myMusicMarks: [],
      musicMarkPage: 0,
    };
  }

  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor: '#393e42',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentDidMount() {
    this.getMusicMarks();
  }

  componentDidUpdate(prevProps, prevState) {
    // removing mark from state and ui
    if (
      this.props.navigation.getParam('deletedMusicMarkId', null) !==
      prevProps.navigation.getParam('deletedMusicMarkId', null)
    ) {
      const deletedMusicMarkId = this.props.navigation.getParam(
        'deletedMusicMarkId',
        null,
      );
      let { myMusicMarks } = this.state;
      const indexOfDeletedMusicMark = myMusicMarks.findIndex(
        item => item.id === deletedMusicMarkId,
      );
      myMusicMarks.splice(indexOfDeletedMusicMark, 1);
      this.setState({
        myMusicMarks,
      });
    }

    if (
      this.props.addedMarkQuery.addedMark !== prevProps.addedMarkQuery.addedMark
    ) {
      const { addedMark } = this.props.addedMarkQuery;
      this.setState({
        marksAround: [addedMark, ...this.state.myMusicMarks],
      });
    }
  }

  getMusicMarks = (musicMarkPage = 0) => {
    const first = 10;
    const skip = first * musicMarkPage;
    this.props.client
      .query({
        query: MY_MUSIC_MARKS,
        variables: { first, skip },
        fetchPolicy: 'no-cache',
      })
      .then(({ data: { myMusicMarks } }) =>
        this.setState({
          myMusicMarks: [...this.state.myMusicMarks, ...myMusicMarks],
          musicMarkPage,
        }),
      )
      .catch(err => console.log(err));
  };

  getMusicMarkDetails = musicMarkId => {
    this.props.client
      .query({
        query: MARK_DETAIL_BY_ID,
        variables: { musicMarkId },
        fetchPolicy: 'no-cache',
      })
      .then(markDetails =>
        this.props.client
          .mutate({
            mutation: SET_CURRENT_PLAYLIST,
            variables: { currentPlaylist: markDetails.data.musicMark },
          })
          .then(res =>
            this.props.navigation.navigate('MusicMarkDetails', {
              profileMode: true,
            }),
          )
          .catch(err => console.log(err)),
      )
      .catch(err => console.log(err));
  };

  render() {
    const { myMusicMarks, musicMarkPage } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={StyleSheet.absoluteFillObject}
            contentContainerStyle={styles.scrollview}
          >
            {myMusicMarks.length
              ? myMusicMarks.map((mark, index) => {
                  return (
                    <TouchableOpacity style={styles.map} key={mark.id}>
                      <MapView
                        style={StyleSheet.absoluteFillObject}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        initialRegion={{
                          longitude: mark.longitude,
                          latitude: mark.latitude,
                          longitudeDelta: LONGITUDE_DELTA,
                          latitudeDelta: LATITUDE_DELTA,
                        }}
                        liteMode
                        onPress={() => this.getMusicMarkDetails(mark.id)}
                      >
                        <MapView.Marker
                          coordinate={{
                            longitude: mark.longitude,
                            latitude: mark.latitude,
                          }}
                        />
                      </MapView>
                      {/* <Divider style={{ backgroundColor: 'blue' }} /> */}
                    </TouchableOpacity>
                  );
                })
              : null}
            <TouchableOpacity>
              <Button
                title={'More...'}
                onPress={() => this.getMusicMarks(musicMarkPage + 1)}
                type={'clear'}
                titleStyle={{ color: 'rgba(0,0,0,0.4)' }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <GlobalFooter />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d9dadc',
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  map: {
    backgroundColor: '#16181c',
    width: '90%',
    height: 150,
    marginBottom: 5,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#696773',
  },
});

export default compose(
  withApollo,
  graphql(GET_ADDED_MARK, {
    options: { fetchPolicy: 'cache-only' },
    name: 'addedMarkQuery',
  }),
)(Profile);
