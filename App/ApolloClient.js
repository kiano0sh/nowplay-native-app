import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';
import {GET_TOKEN} from "./Queries/CacheQueries";
import {persistCache} from 'apollo-cache-persist';
import {AsyncStorage} from 'react-native';
import {GET_CURRENT_SONGS, GET_CURRENT_SONG, GET_PLAY_STATUS} from './Queries/CacheQueries'

const cache = new InMemoryCache();

export const waitOnCache = persistCache({
    cache,
    storage: AsyncStorage,
});


export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://192.168.1.37:4000',
    }),
    cache,
    resolvers: {
        Mutation: {
            playCurrentSong: (root, args, {cache, client}) => {
                client.writeQuery({
                    query: GET_PLAY_STATUS,
                    data: {playStatus: true}
                });
                return null
            },
            pauseCurrentSong: (root, args, {cache, client}) => {
                client.writeQuery({
                    query: GET_PLAY_STATUS,
                    data: {playStatus: false}
                });
                return null
            },
            playNextSong: (root, args, {cache, client}) => {
                const currentSong = cache.readQuery({query: GET_CURRENT_SONG});
                const currentSongs = cache.readQuery({query: GET_CURRENT_SONGS});
                const currentSongIndex = currentSongs.indexOf(music => music.id === currentSong.id);
                let newCurrentSong = currentSongs[currentSongIndex + 1];
                if (!newCurrentSong) {
                    newCurrentSong = currentSongs[0]
                }
                client.writeQuery({
                    query: GET_CURRENT_SONG,
                    data: {currentSong: newCurrentSong}
                });
                return null
            },
            playPreviousSong: (root, args, {cache, client}) => {
                const currentSong = cache.readQuery({query: GET_CURRENT_SONG});
                const currentSongs = cache.readQuery({query: GET_CURRENT_SONGS});
                const currentSongIndex = currentSongs.indexOf(music => music.id === currentSong.id);
                let newCurrentSong = currentSongs[currentSongIndex - 1];
                if (!newCurrentSong) {
                    newCurrentSong = currentSongs[currentSongs.length - 1]
                }
                client.writeQuery({
                    query: GET_CURRENT_SONG,
                    data: {currentSong: newCurrentSong}
                });
                return null
            },
        },
    }
});

// initialize cache
cache.writeData({
    data: {
        token: null,
        currentSongs: [],
        currentSong: null,
        playStatus: false
    }
});

export const updateHeaders = () => client.link = {
    ...client.link,
    headers: {
        authorization: client.cache.readQuery({query: GET_TOKEN})
    }
};

waitOnCache.then(() => {
    updateHeaders()
});
