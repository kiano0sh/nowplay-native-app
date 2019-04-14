import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import {GET_TOKEN} from "./Queries/CacheQueries";
import { persistCache } from 'apollo-cache-persist';
import { AsyncStorage } from 'react-native';
import { GET_CURRENT_SONGS } from './Queries/CacheQueries'

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
            togglePlayStatus: (root, args, {cache, getCacheKey}) => {
                const {index} = args;
                let { currentSongs } = cache.readQuery({ query: GET_CURRENT_SONGS });
                let playStatus = currentSongs[index].playStatus;
                currentSongs[index].playStatus = !playStatus;
                cache.writeData({currentSongs});
                return null
                },
            playNextSong: (root, args, {cache, getCacheKey}) => {

            },
            playPreviousSong: (root, args, {cache, getCacheKey}) => {

            },
        },
    }
});

client.cache.writeData({
    data: {
        token: null,
        currentSongs: [],
        globalFooterVisibility: false
    }
});

export const updateHeaders = () => client.link = {
    ...client.link,
    headers: {
        authorization: client.cache.readQuery({ query: GET_TOKEN })
    }
};

waitOnCache.then(() => {
    updateHeaders()
});
