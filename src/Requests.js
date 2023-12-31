const key = process.env.REACT_APP_IMDB_API_KEY;

const requests = {
  requestPopular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`,
  requestTopRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=1`,
  requestTrending: `https://api.themoviedb.org/3/trending/all/day?api_key=${key}&language=en-US`,
  requestHorror: `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=horror&page=1&include_adult=false`,
  requestUpcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1`,
  requestNowPlaying: `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1`,
  requestFilmById: `https://api.themoviedb.org/3/movie/id?api_key=${key}&language=en-US`,
  requestVideosFilmById: `https://api.themoviedb.org/3/movie/id/videos?api_key=${key}&language=en-US&append_to_response=videos`,
  requestFilmCreditById: `https://api.themoviedb.org/3/movie/id/credits?api_key=${key}&language=en-US`,
  requestFilmSearch: `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=searchQuery&page=pageQuery&language=en-US`,
};

export default requests;
