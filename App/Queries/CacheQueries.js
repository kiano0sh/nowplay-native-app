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

export const GET_WORKING_LOCATION = gql`
    {
        workingLocation @client {
            longitude,
            latitude
        }
    }
`;


export const GET_CURRENT_SONG_REF = gql`
    {
        currentSongRef @client
    }
`;

export const GET_CURRENT_TIME = gql`
    {
        currentTime @client
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

export const GET_SELECTED_SONGS = gql`
    {
        selectedSongs @client {
            id
            trackService
            title
            artwork_url
            username
        }
    }
`;

// MUTATIONS

export const UPDATE_CURRENT_STACK = gql`
    mutation updateCurrentStack($music: Object!) {
        updateCurrentStack(music: $music) @client
    }
`;

export const UPDATE_WORKING_LOCATION = gql`
    mutation updateWorkingLocation($workingLocation: Object!) {
        updateWorkingLocation(workingLocation: $workingLocation) @client
    }
`;

export const UPDATE_CURRENT_SONG_REF = gql`
    mutation updateCurrentSongRef($currentSongRef: Object!) {
        updateCurrentSongRef(currentSongRef: $currentSongRef) @client
    }
`;

export const UPDATE_SELECTED_SONGS = gql`
    mutation updateSelectedSongs($selectedSong: Object!) {
        updateSelectedSongs(selectedSong: $selectedSong) @client
    }
`;

export const CLEAR_SELECTED_SONGS = gql`
    mutation clearSelectedSongs {
        clearSelectedSongs @client
    }
`;

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

export const SET_CURRENT_TIME = gql`
    mutation setCurrentTime($currentTime: Int!) {
        setCurrentTime(currentTime: $currentTime) @client
    }
`;

export const PLAY_NEXT_SONG = gql`
    mutation playNextSong {
        playNextSong @client
    }
`;

export const PLAY_PREVIOUS_SONG = gql`
    mutation playPreviousSong {
        playPreviousSong @client
    }
`;