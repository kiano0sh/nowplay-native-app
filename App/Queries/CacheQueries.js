import gql from "graphql-tag";

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



export const TOGGLE_PLAY_STATUS= gql`
    mutation TogglePlayStatus($index: Int!) {
        togglePlayStatus(index: $index) @client
    }
`;
