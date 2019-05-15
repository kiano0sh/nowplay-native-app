import gql from 'graphql-tag';

gql`
  enum trackServices {
    Soundcloud
    Spotify
    Youtube
  }
`;

gql`
  input MusicInput {
    trackId: Int!
    trackService: trackServices!
    title: String
    description: String
  }
`;

export const login = gql`
  mutation login($username: String, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const CREATE_MUSIC_MARK = gql`
  mutation createMusicMark(
    $latitude: Float!
    $longitude: Float!
    $title: String
    $description: String
    $musics: [MusicInput!]!
  ) {
    createMusicMark(
      latitude: $latitude
      longitude: $longitude
      title: $title
      description: $description
      musics: $musics
    ) {
      id
      title
      description
      longitude
      latitude
      likedBy {
        username
      }
      favouriteFor {
        username
      }
      comments {
        description
        author {
          username
        }
        createdAt
      }
      user {
        username
        musicMarks {
          id
        }
      }
      musics {
        id
        title
        trackId
        trackService
        user {
          username
        }
        artwork
        artist
        genre
        duration
        trackCreatedAt
        createdAt
      }
      createdAt
    }
  }
`;

export const DELETE_MUSIC_MARK = gql`
  mutation deleteMusicMark($musicMarkId: ID!) {
    deleteMusicMark(musicMarkId: $musicMarkId) {
      id
    }
  }
`;

export const ADD_MUSIC = gql`
  mutation addMusic($musicMarkId: ID!, $musics: [MusicInput!]!) {
    addMusic(musicMarkId: $musicMarkId, musics: $musics) {
      id
      title
      description
      longitude
      latitude
      likedBy {
        username
      }
      favouriteFor {
        username
      }
      comments {
        description
        author {
          username
        }
        createdAt
      }
      user {
        username
        musicMarks {
          id
        }
      }
      musics {
        id
        title
        trackId
        trackService
        user {
          username
        }
        artwork
        artist
        genre
        duration
        trackCreatedAt
        createdAt
      }
      createdAt
    }
  }
`;
