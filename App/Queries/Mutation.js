import gql from "graphql-tag";

//
export const login = gql`
    mutation Login($username: String, $password: String!) {
        login(username: $username, password: $password) {
            token
        }
    }
`;

gql`
enum trackServices {
    Soundcloud
    Spotify
    Youtube
}`

gql`
input MusicInput {
    trackId: Int!
    trackService: trackServices!
    title: String
    description: String
}`

// Add music mark with at least one music
export const CREATE_MUSIC_MARK = gql`
    mutation CreateMusicMark($latitude: Float!, $longitude: Float!, $title: String, $description: String, $musics: [MusicInput!]!) {
        createMusicMark(latitude: $latitude, longitude: $longitude, title: $title, description: $description, musics: $musics) {
            id
            latitude
            longitude
            title
            description
            musics {
                id
                title
                description
            }
        }
    }
`

export const DELETE_MUSIC_MARK = gql`
    mutation DeleteMusicMark($musicMarkId: ID!) {
        deleteMusicMark(musicMarkId: $musicMarkId) {
            id
        }
    }
`