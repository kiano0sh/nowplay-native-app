import {
    GET_CURRENT_SONG,
    GET_CURRENT_SONGS,
    GET_PLAY_STATUS,
    PLAY_CURRENT_SONG,
    PAUSE_CURRENT_SONG,
    PLAY_NEXT_SONG,
    PLAY_PREVIOUS_SONG
} from "../Queries/CacheQueries";
import {streamUrl} from "../API/Soundcloud/soundcloudHelper";
import MusicControl from 'react-native-music-control';

const musicPlayerResolvers = {
    updateCurrentStack: (root, args, {cache, client}) => {
        let {music} = args;
        let {currentSongs} = cache.readQuery({query: GET_CURRENT_SONGS});

        let currentSongsShadow = Object.assign([], currentSongs);

        if (currentSongsShadow.length >= 31) {
            currentSongsShadow.shift()
        }

        let wantedSong = false;
        if (currentSongsShadow.length) {
            wantedSong = currentSongsShadow.find(song => song.id === music.id);
        }

        if (!!wantedSong) {
            let tempSongList = currentSongsShadow.filter(song => song.id !== music.id);
            tempSongList.push(wantedSong);
            currentSongsShadow = tempSongList
        } else {
            currentSongsShadow.push({
                __typename: 'Music',
                id: music.id,
                streamUrl: streamUrl(music.uri),
                title: music.title,
                artwork_url: !!music.artwork_url ? music.artwork_url : music.user.avatar_url,
                duration: music.duration,
                username: music.user.username,
                genre: music.genre,
                description: music.description,
                created_at: music.created_at
            });
        }

        client.writeQuery({
            query: GET_CURRENT_SONGS,
            data: {currentSongs: currentSongsShadow}
        });

        client.writeQuery({
            query: GET_CURRENT_SONG,
            data: {currentSong: currentSongsShadow[currentSongsShadow.length - 1]}
        });
    },
    playCurrentSong: (root, args, {cache, client}) => {

        const {currentSong} = cache.readQuery({query: GET_CURRENT_SONG});

        // set up OS music controls
        MusicControl.enableControl('seekForward', false);
        MusicControl.enableControl('seekBackward', false);
        MusicControl.enableControl('skipForward', false);
        MusicControl.enableControl('skipBackward', false);
        MusicControl.enableBackgroundMode(true);

        // listen to control callbacks
        MusicControl.on('play', () => this.props.client.mutate({mutation: PLAY_CURRENT_SONG}));
        MusicControl.on('pause', () => this.props.client.mutate({mutation: PAUSE_CURRENT_SONG}));
        MusicControl.on('nextTrack', () => this.props.client.mutate({mutation: PLAY_NEXT_SONG}));
        MusicControl.on('previousTrack', () =>this.props.client.mutate({mutation: PLAY_PREVIOUS_SONG}));

        // update what's playing
        MusicControl.setNowPlaying({
            title: currentSong.title || "",
            artwork: currentSong.artwork_url || "",
            artist: currentSong.username || "",
            genre: currentSong.genre || "",
            duration: currentSong.duration/1000,
            description: currentSong.description || "",
            color: 0xFFFFFFF,
            date: currentSong.created_at
        });

        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING
        });

        client.writeQuery({
            query: GET_PLAY_STATUS,
            data: {playStatus: true}
        });
        return null
    },
    pauseCurrentSong: (root, args, {cache, client}) => {
        client.writeQuery({
            query: GET_PLAY_STATUS,
            data: {playStatus: false}
        });
        return null
    },
    playNextSong: (root, args, {cache, client}) => {
        const {currentSong} = cache.readQuery({query: GET_CURRENT_SONG});
        const {currentSongs} = cache.readQuery({query: GET_CURRENT_SONGS});
        const currentSongIndex = currentSongs.findIndex(music => music.id === currentSong.id);
        let newCurrentSong = currentSongs[currentSongIndex + 1];
        if (!newCurrentSong) {
            newCurrentSong = currentSongs[0]
        }
        client.writeQuery({
            query: GET_CURRENT_SONG,
            data: {currentSong: newCurrentSong}
        });
        return null
    },
    playPreviousSong: (root, args, {cache, client}) => {
        const {currentSong} = cache.readQuery({query: GET_CURRENT_SONG});
        const {currentSongs} = cache.readQuery({query: GET_CURRENT_SONGS});
        const currentSongIndex = currentSongs.findIndex(music => music.id === currentSong.id);
        let newCurrentSong = currentSongs[currentSongIndex - 1];
        if (!newCurrentSong) {
            newCurrentSong = currentSongs[currentSongs.length - 1]
        }
        client.writeQuery({
            query: GET_CURRENT_SONG,
            data: {currentSong: newCurrentSong}
        });
        return null
    },
};

export default musicPlayerResolvers