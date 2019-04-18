import gql from "graphql-tag";

// QUERIES

export const GET_TOKEN = gql`
    {
        token @client
    }
`;

export const GET_PLAY_STATUS = gql`
    {
        playStatus @client
    }
`;

export const GET_CURRENT_SONG = gql`
    {
        currentSong @client {
            id
            streamUrl
            title
            artwork_url
            duration
            username
        }
    }
`;


export const GET_CURRENT_SONGS = gql`
    {
        currentSongs @client {
            id
            streamUrl
            title
            artwork_url
            duration
            username
        }
    }
`;

// MUTATIONS

export const PLAY_CURRENT_SONG = gql`
    mutation playCurrentSong {
        playCurrentSong @client
    }
`;

export const PAUSE_CURRENT_SONG = gql`
    mutation pauseCurrentSong {
        pauseCurrentSong @client
    }
`;
