import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Button,
} from 'react-native';
import {SearchBar, ListItem, Text, Image} from "react-native-elements";
import {soundcloudSearch} from "../../API/Soundcloud/soundcloudHelper";

class MusicMark extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            search: '',
            results: null,
            collection: [],
            loading: false,
            // TODO after pressing clear button while data is fetching an amount of data remains in state!
            // clear: false,
            page: 0
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

    componentDidMount(): void {
        // console.log(soundcloud)
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
            })
        } else {
            this.setState((state, props) => {
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
                    <Text style={styles.sourceText} numberOfLines={1}>From Soundcloud by {item.user.username}.</Text>
                </View>
            }
            titleStyle={{ color: 'white', fontWeight: 'bold' }}
            leftAvatar={{
                source: !!item.artwork_url ? {uri: item.artwork_url} : {uri: item.user.avatar_url},
                rounded: false,
                size: 'large',
            }}
            bottomDivider
            containerStyle={{backgroundColor: '#121619'}}
        />
    );

    CustomImageComponent = (item) => {
        return <Image source={!!item.artwork_url ? {uri: item.artwork_url} : {uri: item.user.avatar_url}}/>
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
            })
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

export default MusicMark;


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
        paddingTop: 5
    },
    sourceText: {
        color: 'white',
    }
});
