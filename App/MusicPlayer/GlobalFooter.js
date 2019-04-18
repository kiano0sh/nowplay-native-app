import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text, Card, Icon} from 'react-native-elements'
import {Query} from "react-apollo";
import {
    GET_PLAY_STATUS,
    GET_CURRENT_SONGS,
    GET_CURRENT_SONG,
    PAUSE_CURRENT_SONG,
    PLAY_CURRENT_SONG
} from "../Queries/CacheQueries";
import { graphql, compose} from 'react-apollo';
import {client} from "../ApolloClient";
import { withApollo } from 'react-apollo';



class GlobalFooter extends React.Component {
    // constructor(props, context) {
    //     super(props);
    //     this.state = {
    //     }
    // }

    // componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    //     if (prevProps.currentSongsQuery !== this.props.currentSongsQuery) {
    //         console.log(this.props)
    //     }
    // }

    _playMusic() {
        this.props.client.mutate({mutation: PLAY_CURRENT_SONG})
    }

    _pauseMusic() {
        this.props.client.mutate({mutation: PAUSE_CURRENT_SONG})
    }

    render() {
        console.log(this.props);
        const {playStatusQuery, currentSongsQuery, currentSongQuery} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Icon type={'foundation'} name={'previous'} size={30}  color={'white'} />
                    {
                        playStatusQuery.playStatus ?
                            (
                                <Icon type={'foundation'}
                                      name={'pause'}
                                      size={35}
                                      containerStyle={styles.playButtonStyle}
                                      color={'white'}
                                      onPress={() => this._pauseMusic()}
                                />
                            )
                            :
                            (
                                <Icon type={'foundation'}
                                      name={'play'}
                                      size={35}
                                      containerStyle={styles.playButtonStyle}
                                      color={'white'}
                                      onPress={() => this._playMusic()}
                                />
                            )
                    }
                    <Icon type={'foundation'} name={'next'} size={30} containerStyle={styles.nextButtonStyle} color={'white'}/>
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
        maxWidth: 270
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
    graphql(GET_CURRENT_SONG, {options: { fetchPolicy: 'cache-only' }, name: 'currentSongQuery'}),
    )(GlobalFooter)

// {/*<View style={{backgroundColor: 'blue'}}>*/}
// {/*    <Text style={{color: 'white'}}>Music player here ;)</Text>*/}
// {/*</View>*/}