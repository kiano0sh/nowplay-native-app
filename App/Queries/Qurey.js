import gql from "graphql-tag";


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
                description
                uri
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
                description
                uri
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
                title
                description
                trackId
                trackService
                user {
                    username
                }
                artwork
                artist
                genre
                duration
                description
                trackCreatedAt
                createdAt
            }
            createdAt
        }
    }
`;

export const MARK_DETAIL_BY_USER = gql`
    query MusicMark($username: String!) {
        musicMark(username: $username) {
            id
            title
            description
            longitude
            latitude
            likedBy {
                username
            }
            comments {
                description
                author {
                    username
                }
                createdAt
            }
            createdAt
            user {
                username
                musicMarks {
                    id
                    longitude
                    latitude
                }
            }
            musics {
                id
                title
                description
                uri
                createdAt
                user {
                    username
                    musicMarks {
                        id
                        longitude
                        latitude
                    }
                }
            }
        }
    }
`;

export const MUSIC_BY_MARK_ID = gql`
    query MusicByMarkId($musicMarkId: String!) {
        musicByMarkId(musicMarkId: $musicMarkId) {
            id
            title
            description
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
            description
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
        marksAround(longitude: $longitude, latitude: $latitude, maxradiuskm: $maxradiuskm) {
            id
            longitude
            latitude
        }
    }
`;