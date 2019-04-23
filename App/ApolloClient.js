import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';
import {GET_TOKEN} from "./Queries/CacheQueries";
import {persistCache} from 'apollo-cache-persist';
import {AsyncStorage} from 'react-native';
import musicPlayerResolvers from './Resolvers/MusicPlayerResolvers'

const cache = new InMemoryCache();

export const waitOnCache = persistCache({
    cache,
    storage: AsyncStorage,
});


export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://192.168.1.33:4000',
        // uri: 'http://5.9.213.173:4000/',
    }),
    cache,
    resolvers: {
        Mutation: {
            ...musicPlayerResolvers,
        }
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
