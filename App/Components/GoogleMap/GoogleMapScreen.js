import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  UPDATE_CURRENT_MARK_LOCATION,
  SET_CURRENT_PLAYLIST,
  GET_ADDED_MARK,
} from '../../Queries/CacheQueries';
import { MARKS_AROUND, MARK_DETAIL_BY_ID } from '../../Queries/Qurey';
import { Button, SearchBar, Text, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { PermissionsAndroid } from 'react-native';
import { withApollo, compose, graphql } from 'react-apollo';
import GlobalFooter from '../MusicPlayer/GlobalFooter';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
// Tehran
const LATITUDE = 35.6892;
const LONGITUDE = 51.389;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class GoogleMapScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      currentLocation: {
        coords: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
        accuracy: 1,
      },
      search: '',
      marksAround: [],
      marginBottom: 1,
    };
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
      let marksAround = this.state.marksAround;
      const indexOfDeletedMusicMark = marksAround.findIndex(
        item => item.id === deletedMusicMarkId,
      );
      marksAround.splice(indexOfDeletedMusicMark, 1);
      this.setState({
        marksAround,
      });
    }
    // add mark to state and ui
    if (
      this.props.addedMarkQuery.addedMark !== prevProps.addedMarkQuery.addedMark
    ) {
      const { addedMark } = this.props.addedMarkQuery;
      this.setState({
        marksAround: [...this.state.marksAround, addedMark],
      });
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   return (
  //     nextProps.latitude !== this.props.latitude &&
  //     nextProps.longitude !== this.props.longitude
  //   );
  // }

  requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Nowplay Location Permission',
        message:
          'Nowplay needs access to your location ' +
          'so you can find your current location easily.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  };

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState((state, props) => {
          return {
            currentLocation: {
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              accuracy: position.coords.accuracy,
            },
          };
        });
        return this._mapView.setCamera({
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: false,
        timeout: 20000,
      },
    );
  };

  updateSearch = search => {
    this.setState({ search });
  };

  getOtherMarks = newRegion => {
    const { longitude, latitude } = newRegion;
    const { marksAround } = this.state;
    this.props.client
      .query({
        query: MARKS_AROUND,
        variables: {
          longitude: Number(longitude.toFixed(5)),
          latitude: Number(latitude.toFixed(5)),
          maxradiuskm: 10,
        },
        fetchPolicy: 'no-cache',
      })
      .then(marks => this.setState({ marksAround: marks.data.marksAround }))
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
          .then(res => this.props.navigation.navigate('MusicMarkDetails'))
          .catch(err => console.log(err)),
      )
      .catch(err => console.log(err));
  };

  _onRegionChange = newRegion => {
    this.setState({
      region: {
        ...newRegion,
      },
    });
  };

  _onMapReady = () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(result => {
      if (result) {
        this.setState({ marginBottom: 0 });
      } else {
        this.requestLocationPermission().then(isGranted => {
          if (isGranted) {
            this.setState({ marginBottom: 0 });
          } else {
            console.log('Not granted!');
          }
        });
      }
    });
  };

  onMarkerPress = marker => {
    const { coordinate } = marker.nativeEvent;
    this.props.client.mutate({
      mutation: UPDATE_CURRENT_MARK_LOCATION,
      variables: {
        currentMarkLocation: {
          longitude: coordinate.longitude,
          latitude: coordinate.latitude,
        },
      },
    });
    this.props.navigation.navigate('ChooseMusic');
  };

  render() {
    const { currentLocation, marksAround, region } = this.state;
    const { addMode } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={region}
          style={{ flex: 1, marginBottom: this.state.marginBottom }}
          onMapReady={this._onMapReady}
          // customMapStyle={CustomMapView}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          onRegionChangeComplete={this.getOtherMarks}
          showsMyLocationButton={false}
          onRegionChange={addMode ? this._onRegionChange : null}
          ref={mapView => {
            this._mapView = mapView;
          }}
        >
          {addMode && (
            <Marker
              coordinate={region}
              onPress={this.onMarkerPress}
              ref={addMark => (this.addMark = addMark)}
            />
          )}
          {marksAround.length
            ? marksAround.map((mark, index) => {
                return (
                  <Marker
                    key={mark.id}
                    coordinate={{
                      latitude: mark.latitude,
                      longitude: mark.longitude,
                    }}
                    onPress={() =>
                      !addMode ? this.getMusicMarkDetails(mark.id) : null
                    }
                    tracksViewChanges={false}
                  >
                    <Icon
                      type={'material-community'}
                      name={'library-music'}
                      size={30}
                    />
                  </Marker>
                );
              })
            : null}
        </MapView>
        <Callout>
          <View style={styles.calloutView}>
            <TextInput
              style={styles.calloutSearch}
              placeholder={'Search a place'}
            />
          </View>
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={() => {
              this.getCurrentLocation();
            }}
          >
            <Icon
              name="target-two"
              type={'foundation'}
              size={28}
              color={'rgba(0,0,0,0.5)'}
            />
          </TouchableOpacity>
        </Callout>
        <GlobalFooter />
      </View>
    );
  }
}

export default compose(
  withApollo,
  graphql(GET_ADDED_MARK, {
    options: { fetchPolicy: 'cache-only' },
    name: 'addedMarkQuery',
  }),
)(GoogleMapScreen);

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: '20%',
    position: 'relative',
  },
  searchBar: {
    // marginTop: '20%',
    // position: 'absolute'
  },
  calloutView: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    width: '40%',
    marginLeft: '30%',
    marginRight: '30%',
    marginTop: 20,
  },
  calloutSearch: {
    borderColor: 'transparent',
    marginLeft: 10,
    width: '90%',
    marginRight: 10,
    height: 40,
    borderWidth: 0.0,
  },
  myLocationButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 3,
    right: 15,
    padding: 5,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
});

const CustomMapView = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8ec3b9',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1a3646',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4b6878',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#64779e',
      },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4b6878',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#334e87',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#023e58',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#283d6a',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6f9ba5',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#023e58',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3C7680',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#304a7d',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#98a5be',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2c6675',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#255763',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#b0d5ce',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#023e58',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#98a5be',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#283d6a',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3a4762',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0e1626',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4e6d70',
      },
    ],
  },
];
