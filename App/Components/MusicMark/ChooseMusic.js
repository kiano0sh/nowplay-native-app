import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Button,
} from 'react-native';
import {SearchBar, ListItem, Text, Icon} from "react-native-elements";
import {soundcloudSearch} from "../../API/Soundcloud/soundcloudHelper";
import {
    CLEAR_SELECTED_SONGS,
    GET_CURRENT_SONG,
    GET_CURRENT_SONGS,
    GET_PLAY_STATUS,
    GET_SELECTED_SONGS,
    PLAY_CURRENT_SONG,
    UPDATE_CURRENT_STACK,
    UPDATE_SELECTED_SONGS
} from '../../Queries/CacheQueries'
import {compose, graphql} from 'react-apollo';
import { withApollo } from 'react-apollo';


class ChooseMusic extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            search: '',
            results: null,
            collection: [],
            loading: false,
            // TODO after pressing clear button while data is fetching an amount of data remains in state!
            // clear: false,
            page: 0,
            selectedSongs: []
        }
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
        this.props.client.mutate({mutation: CLEAR_SELECTED_SONGS})
    }

    // add selected track to state
    _selectSong(selectedSong){
        console.log(selectedSong)
        this.props.client.mutate({
            mutation: UPDATE_SELECTED_SONGS,
            variables: {selectedSong}
        })
    }

    // find out about existence of item in our selectedSong
    _isItemSelected(id) {

        const {selectedSongs} = this.props.selectedSongsQuery;

        if (selectedSongs && selectedSongs.find(item => item.id === id)) {
            return '#00c853'
        } else {
            return 'white'
        }
    }

    updateSearch = search => {
        if (!!search) {
            this.setState((state, props) => {
                return {
                    search,
                    loading: true
                }
            });
            soundcloudSearch(search).then(results => {
                console.log(results);
                this.setState((state, props) => {
                    return {
                        results,
                        collection: results.collection,
                        loading: false
                    }
                })
                // .catch(error => this.setState({resultError: error.message, loading: false}))
            }).catch(error => console.log(error))
        } else {
            this.setState((state, props) => {
                this.props.client.mutate({mutation: CLEAR_SELECTED_SONGS});
                return {
                    search,
                    results: null,
                    collection: [],
                    loading: false,
                    page: 0,
                    // clear: true
                }
            })
        }
    };

    _keyExtractor = (item, index) => index;

    renderItem = ({item}) => (
        <ListItem
            title={item.title}
            subtitle={
                <View>
                    <Text style={styles.soundcloudText}>
                        From Soundcloud by {item.user.username}.
                    </Text>
                </View>
            }
            rightSubtitle={
                <View style={styles.subtitleView}>
                    <Text style={styles.musicDuration}>{(item.duration / 60000).toFixed(2).replace('.', ':')}</Text>
                    <Icon type={'font-awesome'}
                          name={'check-circle'}
                          size={30}
                          color={this._isItemSelected(item.id)}
                          onPress={() => this._selectSong(item)}
                    />
                </View>
            }
            titleStyle={{color: 'white', fontWeight: 'bold'}}
            leftAvatar={{
                source: !!item.artwork_url ? {uri: item.artwork_url} : {uri: item.user.avatar_url},
                rounded: false,
                size: 'large',
            }}
            bottomDivider
            containerStyle={{backgroundColor: '#121619'}}
            onPress={() => this._updateStack(item)}
        />
    );

    // handling songs stack
    _updateStack = (music) => {

        this.props.client.mutate({
            mutation: UPDATE_CURRENT_STACK,
            variables: {music}
        });

        this.props.client.mutate({
            mutation: PLAY_CURRENT_SONG
        });

        console.log(this.props.client.cache.readQuery({query: GET_CURRENT_SONGS}), 'after')
        console.log(this.props.client.cache.readQuery({query: GET_PLAY_STATUS}), 'after')

    };

    _nextPage = () => {
        let {search, page, results, collection, clear} = this.state;
        if (!!results.next_href && !!search) {
            let nextPage = page + 1;
            this.setState((state, props) => {
                return {
                    loading: true
                }
            });
            soundcloudSearch(search, nextPage).then(nextPageResults => {
                this.setState((state, props) => {
                    return {
                        results: nextPageResults,
                        collection: [...collection, ...nextPageResults.collection],
                        loading: false,
                        page: nextPage
                    }
                });
                // if (clear) {
                //     this.setState((state, props) => {
                //         return {
                //             results: null,
                //             collection: [],
                //             page: 0,
                //             clear: false
                //         }
                //     })
                // }
            }).catch( error => console.log(error))
        } else {

        }

        // .catch(error => this.setState({nextPageError: error.message, buttonLoading: false}))
    };

    render() {
        const {search, loading, collection} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Search Music Here..."
                    onChangeText={this.updateSearch}
                    showLoading={loading}
                    value={search}
                    clearIcon={!!search}
                    onClear={
                        () => this.setState((state, props) => {
                            this.props.client.mutate({mutation: CLEAR_SELECTED_SONGS});
                            return {
                                results: null,
                                collection: [],
                                page: 0,
                                // clear: true
                            }
                        })
                    }
                />

                {
                    !!collection && !!collection.length &&
                    <FlatList
                        keyExtractor={this._keyExtractor}
                        data={collection}
                        renderItem={this.renderItem}
                        extraData={this.state}
                        onEndReached={() => this._nextPage()}
                        // ListFooterComponent={
                        //      <Button title={'title'} onPress={() => {console.log(this.state);return this._nextPage()}}/>
                        // }
                    />
                }
                {/*<Button*/}
                {/*    title={'Show More'}*/}
                {/*    onPress={() => this._nextPage()}*/}
                {/*    loading={buttonLoading}*/}
                {/*    */}
                {/*/>*/}

                {/*{*/}
                {/*    !!results && !!results.collection && !!results.collection.length &&!!results.next_href &&*/}
                {/*    <Button*/}
                {/*        title={'Show More'}*/}
                {/*        onPress={() => this._nextPage()}*/}
                {/*        loading={buttonLoading}*/}
                {/*    />*/}
                {/*}*/}
                {/*<Button title={'state'} onPress={() => console.log(this.state)}/>*/}
            </View>
        );
    }
}

// export default withApollo(ChooseMusic);
export default compose(
    withApollo,
    graphql(GET_SELECTED_SONGS, {options: { fetchPolicy: 'cache-only' }, name: 'selectedSongsQuery'})
)(ChooseMusic)

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
        alignItems: 'center'
    },
    soundcloudText: {
        color: 'white',
    },
    musicDuration: {
        color: 'white',
        marginRight: 15
    }
});
