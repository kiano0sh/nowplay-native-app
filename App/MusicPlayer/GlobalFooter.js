import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text, Icon} from 'react-native-elements'
import {
    GET_PLAY_STATUS,
    GET_CURRENT_SONGS,
    GET_CURRENT_SONG,
    PAUSE_CURRENT_SONG,
    PLAY_CURRENT_SONG,
    PLAY_NEXT_SONG,
    PLAY_PREVIOUS_SONG,
    SET_CURRENT_TIME,
    GET_CURRENT_TIME
} from "../Queries/CacheQueries";
import { graphql, compose} from 'react-apollo';
import { withApollo } from 'react-apollo';
import Video from "react-native-video";



class GlobalFooter extends React.Component {

    _playSong() {
        this.props.client.mutate({mutation: PLAY_CURRENT_SONG})
    }

    _pauseSong() {
        this.props.client.mutate({mutation: PAUSE_CURRENT_SONG})
    }

    _playNextSong() {
        this.props.client.mutate({mutation: PLAY_NEXT_SONG})
    }

    _playPreviousSong() {
        this.props.client.mutate({mutation: PLAY_PREVIOUS_SONG})
    }

    _setCurrentTime = ({currentTime}) => {

        this.props.client.mutate({mutation: SET_CURRENT_TIME, variables: {currentTime}});

        // console.log(this.props.client.readQuery({query: GET_CURRENT_TIME}))

    };

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        const {playStatusQuery, currentSongQuery} = this.props;
        const playStatus = playStatusQuery.playStatus !== nextProps.playStatusQuery.playStatus;
        const currentSong = currentSongQuery.currentSong !== nextProps.currentSongQuery.currentSong;
        return playStatus || currentSong
    }

    render() {
        console.log(this.props);
        const {playStatusQuery, currentSongQuery} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Icon type={'foundation'}
                          name={'previous'}
                          size={30}
                          color={'white'}
                          onPress={() => this._playPreviousSong()}
                    />
                    {
                        playStatusQuery.playStatus ?
                            (
                                <Icon type={'foundation'}
                                      name={'pause'}
                                      size={35}
                                      containerStyle={styles.playButtonStyle}
                                      color={'white'}
                                      onPress={() => this._pauseSong()}
                                />
                            )
                            :
                            (
                                <Icon type={'foundation'}
                                      name={'play'}
                                      size={35}
                                      containerStyle={styles.playButtonStyle}
                                      color={'white'}
                                      onPress={() => this._playSong()}
                                />
                            )
                    }

                    {currentSongQuery.currentSong ?
                        <Video
                            source={{uri: currentSongQuery.currentSong.streamUrl}}
                            audioOnly={true}
                            ref="audio"
                            volume={1.0}
                            muted={false}
                            paused={!playStatusQuery.playStatus}
                            playInBackground={true}
                            playWhenInactive={true}
                            onEnd={() => this._playNextSong()}
                            onProgress={this._setCurrentTime}
                            resizeMode="cover"
                            repeat={false}
                        />
                        :
                        null
                    }
                    <Icon type={'foundation'}
                          name={'next'}
                          size={30}
                          containerStyle={styles.nextButtonStyle}
                          color={'white'}
                          onPress={() => this._playNextSong()}

                    />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyles}
                          numberOfLines={1}
                    >
                        {
                            currentSongQuery.currentSong ?
                                (
                                    currentSongQuery.currentSong.title
                                )
                                :
                                (
                                    'No Music Is Selected Yet!'
                                )
                        }
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#393e42'
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
        maxWidth: '70%'
    },
    playButtonStyle: {
        marginRight: 20,
        marginLeft: 20
    },
    nextButtonStyle: {
        marginRight: 10
    },
    iconSize: 40
});

export default compose(
    withApollo,
    graphql(GET_PLAY_STATUS, {options: { fetchPolicy: 'cache-only' }, name: 'playStatusQuery'}),
    graphql(GET_CURRENT_SONGS, {options: { fetchPolicy: 'cache-only' }, name: 'currentSongsQuery'}),
    graphql(GET_CURRENT_SONG, {options: { fetchPolicy: 'cache-only' }, name: 'currentSongQuery'})
    )(GlobalFooter)