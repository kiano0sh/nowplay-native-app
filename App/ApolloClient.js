import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  concat,
} from 'apollo-boost';
import { GET_TOKEN } from './Queries/CacheQueries';
import { persistCache } from 'apollo-cache-persist';
import { AsyncStorage } from 'react-native';
import mainResolvers from './Resolvers/mainResolvers';
import { onError } from 'apollo-link-error';

const cache = new InMemoryCache();

export const waitOnCache = persistCache({
  cache,
  storage: AsyncStorage,
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({ uri: 'http://192.168.1.35:4000' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = cache.readQuery({ query: GET_TOKEN }).token;
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const link = ApolloLink.from([errorLink, authMiddleware.concat(httpLink)]);

export const client = new ApolloClient({
  link,
  cache,
  resolvers: {
    Mutation: {
      ...mainResolvers,
    },
  },
  queryDeduplication: true,
});

// initialize cache
cache.writeData({
  data: {
    token: null,
    currentRouteName: '',
    currentSongs: [],
    selectedSongs: [],
    currentSong: null,
    playStatus: false,
    currentTime: null,
    currentSongRef: null,
    currentPlaylist: null,
    playlistMode: false,
    addedMark: null,
  },
});

export const updateHeaders = () =>
  (client.link = {
    ...client.link,
    headers: {
      ...client.link.headers,
      Authorization: `Bearer ${cache.readQuery({ query: GET_TOKEN }).token}`,
    },
  });