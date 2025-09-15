import axios from 'axios';
import { ApiError } from './apiError.js';

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
  timeout: 5000,
});

const withDefaults = (params) => ({
  language: 'en-US',
  include_adult: false,
  ...params,
});

const tmdbGet = async (path, params) => {
  try {
    const response = await client.get(path, { params: withDefaults(params) });
    return response.data;
  } catch (err) {
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.status_message ||
      err.response?.data?.message ||
      err.message ||
      'TMDB request failed';
    console.error('TMDB API Error:', err.response ? err.response.data : err.message);
    throw new ApiError(message, status);
  }
};

const searchMoviesByName = async (query, page = 1, opts = {}) => {
  return tmdbGet(`/search/movie`, { query, page, ...opts });
};

const searchMoviesById = async (id, opts = {}) => {
  return tmdbGet(`/movie/${id}`, { ...opts });
};

export { tmdbGet, searchMoviesByName, searchMoviesById };