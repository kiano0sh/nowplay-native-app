import gql from 'graphql-tag';

// QUERIES

export const GET_TOKEN = gql`
  {
    token @client
  }
`;

// export const GET_CURRENT_ROUTE_NAME = gql`
//   {
//     currentRouteName @client
//   }
// `;

export const GET_PLAY_STATUS = gql`
  {
    playStatus @client
  }
`;

export const GET_CURRENT_MARK_LOCATION = gql`
  {
    currentMarkLocation @client {
      longitude
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
      artwork
      duration
      artist
      playlist
    }
  }
`;

export const GET_CURRENT_SONGS = gql`
  {
    currentSongs @client {
      id
      streamUrl
      title
      artwork
      duration
      artist
      playlist
    }
  }
`;

export const GET_SELECTED_SONGS = gql`
  {
    selectedSongs @client {
      id
      trackService
      title
      artwork
      artist
      genre
      duration
      trackCreatedAt
    }
  }
`;

export const GET_CURRENT_PLAYLIST = gql`
  {
    currentPlaylist @client
  }
`;

export const GET_PLAYLIST_MODE = gql`
  {
    playlistMode @client
  }
`;

export const GET_ADDED_MARK = gql`
  {
    addedMark @client
  }
`;

// MUTATIONS

// export const UPDATE_CURRENT_ROUTE_NAME = gql`
//   mutation updateCurrentRouteName($currentRouteName: String!) {
//     updateCurrentRouteName(currentRouteName: $currentRouteName) @client
//   }
// `;

export const UPDATE_CURRENT_STACK = gql`
  mutation updateCurrentStack($music: Object!) {
    updateCurrentStack(music: $music) @client
  }
`;

export const UPDATE_CURRENT_PLAYLIST_SONG = gql`
  mutation updateCurrentPlaylistSong($index: Int!) {
    updateCurrentPlaylistSong(index: $index) @client
  }
`;

export const UPDATE_CURRENT_MARK_LOCATION = gql`
  mutation updateCurrentMarkLocation($currentMarkLocation: Object!) {
    updateCurrentMarkLocation(currentMarkLocation: $currentMarkLocation) @client
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

export const SET_CURRENT_PLAYLIST = gql`
  mutation setCurrentPlaylist($currentPlaylist: Object!) {
    setCurrentPlaylist(currentPlaylist: $currentPlaylist) @client
  }
`;

export const UPDATE_PLAYLIST_MODE = gql`
  mutation updatePlaylistMode($playlistMode: Boolean!) {
    updatePlaylistMode(playlistMode: $playlistMode) @client
  }
`;

export const UPDATE_ADDED_MARK = gql`
  mutation updateAddedMark($addedMark: Object!) {
    updateAddedMark(addedMark: $addedMark) @client
  }
`;
