import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import {GET_TOKEN} from "./Queries/CacheQueries";

//'http://192.168.1.36:4000'


export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://192.168.1.36:4000',
    }),
    cache: new InMemoryCache()
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
        // on production you need to store token
        //in storage or in redux persist, for demonstration purposes we do this like that
    }
};

updateHeaders();