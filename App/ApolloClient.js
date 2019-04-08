import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import {GET_TOKEN} from "./Queries/CacheQueries";
import { persistCache } from 'apollo-cache-persist';
import { AsyncStorage } from 'react-native';

//'http://192.168.1.36:4000'

const cache = new InMemoryCache();

export const waitOnCache = persistCache({
    cache,
    storage: AsyncStorage,
});


export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://192.168.1.33:4000',
    }),
    cache
});

client.cache.writeData({
    data: {
        token: null,
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
