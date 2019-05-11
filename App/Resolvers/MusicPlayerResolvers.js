import {
    GET_CURRENT_SONG,
    GET_CURRENT_SONGS,
    GET_PLAY_STATUS,
    PLAY_CURRENT_SONG,
    PAUSE_CURRENT_SONG,
    PLAY_NEXT_SONG,
    PLAY_PREVIOUS_SONG,
    GET_CURRENT_TIME,
    GET_WORKING_LOCATION,
    GET_SELECTED_SONGS,
    GET_CURRENT_ROUTE_NAME,
} from "../Queries/CacheQueries";
import {streamUrl} from "../API/Soundcloud/soundcloudHelper";
import MusicControl from 'react-native-music-control';
import React from "react";

const musicPlayerResolvers = {
    updateWorkingLocation: (root, args, {cache, client}) => {
        const {workingLocation: {longitude, latitude} } = args
        // console.log(args.workingLocation, 'cache')
        client.writeQuery({
            query: GET_WORKING_LOCATION,
            data: {
                workingLocation: {
                    __typename: "Location",
                    longitude,
                    latitude
                }
            }
        })
        return null
    },
    updateCurrentRouteName: (root, args, {cache, client}) => {
        const {currentRouteName} = args
        console.log(currentRouteName, 'cache')
        client.writeQuery({
            query: GET_CURRENT_ROUTE_NAME,
            data: {currentRouteName}
        })
        return null
    },
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
        return null
    },
    updateCurrentSongRef: (root, args, {cache, client}) => {
        let {currentSongRef} = args;

        // console.log(currentSongRef, 'resolved')
        // console.log(cache)
        //
        // setTimeout(() => console.log(currentSongRef.props.muted = true, 'resolved'), 5000)
        // console.log(currentSongRef)
        //
        // client.writeQuery({
        //     query: GET_CURRENT_SONG_REF,
        //     data: {
        //         currentSongRef
        //     }
        // });
    },
    playCurrentSong: (root, args, {cache, client}) => {

        const {currentSong} = cache.readQuery({query: GET_CURRENT_SONG});
        // console.log(currentSong.streamUrl);

        // Seeking
        MusicControl.enableControl("seekForward", false); // iOS only
        MusicControl.enableControl("seekBackward", false); // iOS only
        MusicControl.enableControl("seek", true); // Android only
        MusicControl.enableControl("skipForward", false);
        MusicControl.enableControl("skipBackward", false);

        // Android Specific Options
        MusicControl.enableControl("setRating", false);
        MusicControl.enableControl("volume", true); // Only affected when remoteVolume is enabled
        MusicControl.enableControl("remoteVolume", false);
        MusicControl.enableControl("closeNotification", true, { when: "paused" });

        MusicControl.enableControl('play', true);
        MusicControl.enableControl('pause', true);
        MusicControl.enableControl('stop', false);
        MusicControl.enableControl('nextTrack', true);
        MusicControl.enableControl('previousTrack', true);

        // listen to control callbacks
        MusicControl.on('play', () => client.mutate({mutation: PLAY_CURRENT_SONG}));
        MusicControl.on('pause', () => client.mutate({mutation: PAUSE_CURRENT_SONG}));
        MusicControl.on('nextTrack', () => client.mutate({mutation: PLAY_NEXT_SONG}));
        MusicControl.on('previousTrack', () => client.mutate({mutation: PLAY_PREVIOUS_SONG}));

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
            data: {
                playStatus: true
            }
        });
        return null
    },
    pauseCurrentSong: (root, args, {cache, client}) => {

        client.writeQuery({
            query: GET_PLAY_STATUS,
            data: {playStatus: false}
        });
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED
        });

        return null
    },
    setCurrentTime: (root, args, {client}) => {

        let {currentTime} = args;
        // console.log(currentTime, 'in cache')

        client.writeQuery({
            query: GET_CURRENT_TIME,
            data: {currentTime}
        });

        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: currentTime
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

        client.mutate({
            mutation: PLAY_CURRENT_SONG
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

        client.mutate({
            mutation: PLAY_CURRENT_SONG
        });
        return null
    },
    updateSelectedSongs: (root, args, {cache, client}) => {
        let {selectedSong} = args;
        // console.log(selectedSong)
        const {selectedSongs} = cache.readQuery({query: GET_SELECTED_SONGS});

        let selectedSongsShadow = Object.assign([], selectedSongs);

        let customItem = {
            __typename: 'SelectedMusic',
            id: selectedSong.id,
            trackService: "Soundcloud",
            title: selectedSong.title,
            artwork_url: !!selectedSong.artwork_url ? selectedSong.artwork_url : selectedSong.user.avatar_url,
            username: selectedSong.user.username,
        };

        let itemIndex = selectedSongsShadow.findIndex(element => element.id === customItem.id);

        if ( itemIndex === -1) {
            selectedSongsShadow.push(customItem)
        } else {
            selectedSongsShadow.splice(itemIndex, 1)
        }

        client.writeQuery({
            query: GET_SELECTED_SONGS,
            data: {selectedSongs: selectedSongsShadow}
        });

        return null
    },
    clearSelectedSongs: (root, args, {client}) => {
        client.writeQuery({
            query: GET_SELECTED_SONGS,
            data: {selectedSongs: []}
        });

        return null
    }
};

export default musicPlayerResolvers