import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Button,
} from 'react-native';
import {SearchBar, ListItem, Text} from "react-native-elements";
import {soundcloudSearch} from "../../API/Soundcloud/soundcloudHelper";

class MusicMark extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            search: '',
            results: null,
            collection: [],
            loading: false,
            buttonLoading: false,
            page: 0
        }
    }

    static navigationOptions = {
        title: 'Choose Music',
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
                    page: 0
                }
            })
        }
    };

    _keyExtractor = (item, index) => item.id;

    renderItem = ({item}) => (
        <ListItem
            title={item.title}
            subtitle={
                <View>
                    <Text style={styles.sourceText} numberOfLines={1}>Powered by soundcloud. Posted
                        by {item.user.username}.</Text>
                </View>
            }
            leftAvatar={{
                source: !!item.artwork_url ? {uri: item.artwork_url} : {uri: item.user.avatar_url},
                rounded: false,
            }}
            bottomDivider
        />
    );

    _nextPage = () => {
        let {search, page, results, collection} = this.state;
        let nextPage = page + 1;
        this.setState((state, props) => {
            return {
                buttonLoading: true
            }
        });
        console.log(this.state.collection, 'p')
        soundcloudSearch(search, nextPage).then(nextPageResults => {
            console.log(nextPageResults.collection, 'n')
            this.setState((state, props) => {
                return {
                    results: nextPageResults,
                    collection: [...collection, ...nextPageResults.collection],
                    buttonLoading: false,
                    page: nextPage
                }
            })
        })
        // .catch(error => this.setState({nextPageError: error.message, buttonLoading: false}))
    };

    render() {
        const {search, loading, results, buttonLoading, collection} = this.state;
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
                                page: 0
                            }
                        })
                    }
                />

                {
                    !!collection && !!collection.length &&
                    <FlatList
                        keyExtractor={this._keyExtractor}
                        data={results.collection}
                        renderItem={this.renderItem}
                        extraData={this.state}
                        ListHeaderComponent={
                             <Button title={'title'} onPress={() => {console.log(this.state);return this._nextPage()}}/>
                        }

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
        color: 'grey',
    }
});
