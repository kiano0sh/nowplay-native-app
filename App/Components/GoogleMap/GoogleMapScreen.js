import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import MapView from 'react-native-maps';

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
        };
    }

    render() {
        return (
            <View>
                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    rotateEnabled={true}
                    initialRegion={this.state.region}
                />
            </View>
        );
    }
}// End of MyHomeScreen class
export default GoogleMapScreen;

const styles = StyleSheet.create({
    map: {
        width,
        height,
    },
});