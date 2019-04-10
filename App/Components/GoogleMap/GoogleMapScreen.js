import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    ScrollView,
    Image,
} from 'react-native';
import {Button} from "react-native-elements";
import MapView from 'react-native-maps';
import {Marker, Circle} from 'react-native-maps';
import {PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UrlTile, Callout} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height; //,
const LATITUDE = 22.720555;
const LONGITUDE = 75.858633;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class GoogleMapScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Google Maps',
        // drawerIcon: ({tintColor}) => (
        //         //     <Image
        //         //         source={require('../image/icons8-google-maps-48.png')}
        //         //     />
        //         // ),
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
                    longitude: LONGITUDE
                },
                accuracy: 1
            }
        };
    }

    componentDidMount(): void {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(result => {
                if (result) {
                    this.getCurrentLocation()
                } else {
                    this.requestLocationPermission()
                        .then(isGranted => {
                            if (isGranted) {
                                this.getCurrentLocation()
                            } else {
                                console.log("Not granted!")
                            }
                        })
                }
            })
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
                return true
            } else {
                return false
            }
        } catch (err) {
            console.warn(err);
        }
    };

    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log(position)
                this.setState((state, props) => {
                    return {
                        region: {
                            ...this.state.region,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        currentLocation: {
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            },
                            accuracy: position.coords.accuracy
                        }
                    }
                })
            },
            error => console.log(error),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    };

    render() {
        console.log(this.state.region)
        const {currentLocation} = this.state;

        return (
            <View style={styles.container}>
                <MapView
                    region={this.state.region}
                    style={styles.map}
                    // customMapStyle={CustomMapView}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    rotateEnabled={true}
                >

                    {currentLocation &&
                        <Marker
                            coordinate={currentLocation.coords}
                            // image={circleIcon.uri}
                            onPress={() => this.props.navigation.navigate('ChooseMusic')}
                            title={'You'}
                        >
                        </Marker>
                    }
                    {/*<MapView.Circle*/}
                    {/*    center={currentLocation.coords}*/}
                    {/*    fillColor={'#0000FF'}*/}
                    {/*    radius={currentLocation.accuracy}*/}
                    {/*    strokeColor={'#0720ff'}*/}
                    {/*    strokeWidth={2}*/}
                    {/*/>*/}
                </MapView>
                {/*<Callout>*/}
                {/*    <View style={styles.calloutView} >*/}
                {/*        <TextInput style={styles.calloutSearch}*/}
                {/*                   placeholder={"Search"}*/}
                {/*        />*/}
                {/*        <Button*/}
                {/*            title="Solid Button"*/}
                {/*            onPress={() => this.getCurrentLocation()}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*</Callout>*/}
            </View>
        );
    }
}// End of MyHomeScreen class
export default GoogleMapScreen;


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

// const styles = StyleSheet.create({
//     map: {
//         width,
//         height,
//     },
//     calloutView: {
//         flexDirection: "row",
//         backgroundColor: "rgba(255, 255, 255, 0.9)",
//         borderRadius: 10,
//         width: "40%",
//         marginLeft: "30%",
//         marginRight: "30%",
//         marginTop: 20
//     },
//     calloutSearch: {
//         borderColor: "transparent",
//         marginLeft: 10,
//         width: "90%",
//         marginRight: 10,
//         height: 40,
//         borderWidth: 0.0
//     },
//     container: {
//         flex: 1
//     },
//     // blue01: '#1e27ff',
//     // blue02: 'rgb(0, 0, 255, 0.2)'
// });

const CustomMapView = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8ec3b9"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1a3646"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#4b6878"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#64779e"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#4b6878"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#334e87"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#283d6a"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6f9ba5"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3C7680"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#304a7d"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#98a5be"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c6675"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#255763"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#b0d5ce"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#98a5be"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#283d6a"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3a4762"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0e1626"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#4e6d70"
            }
        ]
    }
]