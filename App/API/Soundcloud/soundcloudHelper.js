const SC_KEY = 'DMgKi6Eg9EhC4B5Ddj3P7mjTu8qV2AVu';

export const soundcloudSearch = (query, page = 0, limit = 10) => {
  console.log(page * limit);
  return fetch(
    `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${SC_KEY}&limit=${limit}&offset=${page *
      limit}&linked_partitioning=1`,
  )
    .then(res => res.json())
    .then(
      json =>
        new Promise((resolve, reject) => {
          resolve(json);
        }),
    );
};

export const streamUrl = trackUrl => `${trackUrl}/stream?client_id=${SC_KEY}`;

export const getStreamUrl = trackId =>
  `https://api.soundcloud.com/tracks/${trackId}/stream?client_id=${SC_KEY}`;

export const getMusicDetails = trackId => {
  return fetch(
    `https://api.soundcloud.com/tracks/${trackId}?client_id=${SC_KEY}`,
  )
    .then(res => res.json())
    .then(
      json =>
        new Promise((resolve, reject) => {
          resolve(json);
        }),
    );
};
