const SC_KEY = 'DMgKi6Eg9EhC4B5Ddj3P7mjTu8qV2AVu';

export const soundcloudSearch = (query, limit = 10, page = 0) => {
    return fetch(
        `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${SC_KEY}&limit=${limit}&offset=${page*limit}&linked_partitioning=1`
    ).then(res => res.json())
        .then(json => new Promise((resolve, reject) => {
            resolve(json);
        }));
};

export const streamUrl = (trackUrl) => `${trackUrl}/stream?client_id=${SC_KEY}`;