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
            loading: false
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
                        loading: false
                    }
                })
            });
        } else {
            this.setState((state, props) => {
                return {
                    search,
                    results: null,
                    loading: false
                }
            })
        }
    };

    _keyExtractor = (item, index) => item.id;

    renderItem = ({item}) => (
        <ListItem
            title={item.title}
            subtitle={
                <View style={styles.subtitleView}>
                    <Text style={styles.sourceText} numberOfLines={1}>Powered by soundcloud. Posted by {item.user.username}.</Text>
                </View>
            }
            leftAvatar={{
                source: !!item.artwork_url && {uri: item.artwork_url},
                rounded: false,
            }}
        />
    );

    render() {
        const {search, loading, results} = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    showLoading={loading}
                    value={search}
                    clearIcon={!!search}
                    onClear={
                        () => this.setState((state, props) => {
                            return {
                                results: null
                            }
                        })
                    }
                />
                {
                    !!results && !!results.collection && !!results.collection.length &&
                    <FlatList
                        keyExtractor={this._keyExtractor}
                        data={results.collection}
                        renderItem={this.renderItem}
                    />
                }
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
