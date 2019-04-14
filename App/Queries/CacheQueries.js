import gql from "graphql-tag";

export const GET_TOKEN = gql`
    {
        token @client
    }
`;

export const GET_CURRENT_SONGS = gql`
    query GetCurrentSongs {
        currentSongs @client
    }
`;



export const TOGGLE_PLAY_STATUS= gql`
    mutation TogglePlayStatus($index: Int!) {
        togglePlayStatus(index: $index) @client
    }
`;
