import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  SafeAreView,
} from 'react-native';
import {
  UPDATE_WORKING_LOCATION,
  UPDATE_CURRENT_ROUTE_NAME,
  SET_CURRENT_PLAYLIST,
} from '../../Queries/CacheQueries';
import { MARKS_AROUND, MARK_DETAIL_BY_ID } from '../../Queries/Qurey';
import { Button, SearchBar, Text, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import { Marker, Circle } from 'react-native-maps';
import { PermissionsAndroid } from 'react-native';
import { UrlTile, Callout } from 'react-native-maps';
import { withApollo } from 'react-apollo';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height; //,
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
    };
  }

  componentDidMount(): void {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(result => {
      if (result) {
        this.getCurrentLocation();
      } else {
        this.requestLocationPermission().then(isGranted => {
          if (isGranted) {
            this.getCurrentLocation();
          } else {
            console.log('Not granted!');
          }
        });
      }
    });
  }

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

  requestLocationPermission = async () => {
    try {
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
    } catch (err) {
      console.warn(err);
    }
  };

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState((state, props) => {
          return {
            region: {
              ...this.state.region,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            currentLocation: {
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              accuracy: position.coords.accuracy,
            },
          };
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  updateSearch = search => {
    console.log(search);
    this.setState({ search });
  };

  getOtherMarks = newRegion => {
    let { longitude, longitudeDelta, latitude, latitudeDelta } = newRegion;
    this.setState({
      region: {
        longitude,
        longitudeDelta,
        latitude,
        latitudeDelta,
      },
    });
    this.props.client
      .query({
        query: MARKS_AROUND,
        variables: {
          longitude: Number(longitude.toFixed(5)),
          latitude: Number(latitude.toFixed(5)),
          maxradiuskm: 50,
        },
      })
      .then(marks => this.setState({ marksAround: marks.data.marksAround }))
      .catch(err => console.log(err));
  };

  getMusicMarkDetails = musicMarkId => {
    this.props.client
      .query({
        query: MARK_DETAIL_BY_ID,
        variables: { musicMarkId },
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

  render() {
    const { currentLocation, marksAround, region } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={region}
          style={styles.map}
          // customMapStyle={CustomMapView}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          onRegionChangeComplete={this.getOtherMarks}
        >
          {/* {currentLocation && (
            <Marker
              coordinate={currentLocation.coords}
              onPress={e => {
                this.props.client.mutate({
                  mutation: UPDATE_WORKING_LOCATION,
                  variables: {
                    workingLocation: {
                      longitude: e.nativeEvent.coordinate.longitude,
                      latitude: e.nativeEvent.coordinate.latitude,
                    },
                  },
                });
                this.props.navigation.navigate('ChooseMusic');
              }}
            >
              <Icon type={'material-community'} name={'library-music'} size={30} />
            </Marker>
          )} */}
          {marksAround.length
            ? marksAround.map((mark, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: mark.latitude,
                      longitude: mark.longitude,
                    }}
                    // onPress={() => }
                    onPress={() => this.getMusicMarkDetails(mark.id)}
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
        </Callout>
      </View>
    );
  }
}

export default withApollo(GoogleMapScreen);

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: '20%',
    position: 'relative',
  },
  searchBar: {
    // marginTop: '20%',
    // position: 'absolute'
  },
  map: {
    flex: 1,
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
