import gql from 'graphql-tag';

export const ME = gql`
  query Me {
    me {
      username
      email
      isEmailActive
      phoneNumber
      isPhoneNumberActive
      firstName
      lastName
      homeLocation {
        latitude
        longitude
        address
        createdAt
      }
      musicMarks {
        id
        title
        description
        longitude
        latitude
        createdAt
      }
      comments {
        description
        author
      }
      favouriteMarks {
        id
        title
        description
        longitude
        latitude
        createdAt
      }
      likedMarks {
        id
        title
        description
        longitude
        latitude
        createdAt
      }
      followers {
        username
      }
      followings {
        username
      }
      friends {
        username
      }
      blockList {
        username
      }
      createdAt
    }
  }
`;

export const FIND_USER = gql`
  query FindUser($username: String!) {
    userByUsername(username: $username) {
      id
      title
      description
      longitude
      latitude
      createdAt
      user {
        username
      }
      musics {
        id
        title
        createdAt
        user {
          username
        }
      }
    }
  }
`;

export const MUSIC_MARKS = gql`
  query MusicMarks {
    musicMarks {
      id
      title
      description
      longitude
      latitude
      createdAt
      user {
        username
      }
      musics {
        id
        title
        createdAt
        user {
          username
        }
      }
    }
  }
`;

export const MARK_DETAIL_BY_ID = gql`
  query MusicMark($musicMarkId: ID!) {
    musicMark(musicMarkId: $musicMarkId) {
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

export const MARKS_BY_USERNAME = gql`
  query musicMarkByUsername($username: String!) {
    musicMarkByUsername(username: $username) {
      id
      title
      description
      longitude
      latitude
    }
  }
`;

export const MUSIC_BY_MARK_ID = gql`
  query MusicByMarkId($musicMarkId: String!) {
    musicByMarkId(musicMarkId: $musicMarkId) {
      id
      title
      longitude
      latitude
      createdAt
      user {
        username
      }
    }
  }
`;

export const MUSICS = gql`
  query Musics {
    musics {
      id
      title
      longitude
      latitude
      createdAt
      user {
        username
      }
    }
  }
`;

export const MARKS_AROUND = gql`
  query MarksAround($longitude: Float!, $latitude: Float!, $maxradiuskm: Int!) {
    marksAround(
      longitude: $longitude
      latitude: $latitude
      maxradiuskm: $maxradiuskm
    ) {
      id
      longitude
      latitude
    }
  }
`;

export const MY_MUSIC_MARKS = gql`
  query myMusicMarks($first: Int, $skip: Int) {
    myMusicMarks(first: $first, skip: $skip) {
      id
      title
      description
      longitude
      latitude
    }
  }
`;
