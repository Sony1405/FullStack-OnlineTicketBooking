import axios from "axios";

const API_URL = "http://localhost:8082/api/movies"; // adjust port if needed

export const getAllMovies = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getMoviesByCategory = async (category) => {
  const res = await axios.get(`${API_URL}/${category}`);
  return res.data;
};

export const addLike = async (id) => {
  const res = await axios.post(`${API_URL}/${id}/like`);
  return res.data;
};
