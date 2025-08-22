// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://agriklima-backend.onrender.com",
});

// ---- USER ROUTES ----
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// Token-based requests
export const getProfile = (token) =>
  API.get("/users/details", { headers: { Authorization: `Bearer ${token}` } });

export const resetPassword = (token, data) =>
  API.patch("/users/resetPassword", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ---- CROP ROUTES ----
export const getCrops = () => API.get("/crops");
export const getCropById = (id) => API.get(`/crops/${id}`);
export const addCrop = (token, data) =>
  API.post("/crops/add", data, { headers: { Authorization: `Bearer ${token}` } });
export const updateCrop = (token, id, data) =>
  API.put(`/crops/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteCrop = (token, id) =>
  API.delete(`/crops/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// ---- NEWS ROUTES ----
export const getNews = () => API.get("/news");
export const getNewsById = (id) => API.get(`/news/${id}`);
export const addNews = (token, data) =>
  API.post("/news/add", data, { headers: { Authorization: `Bearer ${token}` } });
export const updateNews = (token, id, data) =>
  API.patch(`/news/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteNews = (token, id) =>
  API.delete(`/news/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// ---- PEST ROUTES ----
export const getPests = () => API.get("/pests");
export const getPestById = (id) => API.get(`/pests/${id}`);
export const addPest = (token, data) =>
  API.post("/pests/add", data, { headers: { Authorization: `Bearer ${token}` } });
export const updatePest = (token, id, data) =>
  API.put(`/pests/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deletePest = (token, id) =>
  API.delete(`/pests/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// ---- TASK ROUTES ----
export const getTasks = (token) =>
  API.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
export const getTaskById = (token, id) =>
  API.get(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const addTask = (token, data) =>
  API.post("/tasks/add", data, { headers: { Authorization: `Bearer ${token}` } });
export const updateTask = (token, id, data) =>
  API.put(`/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteTask = (token, id) =>
  API.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// ---- WEATHER ROUTES ----
export const getWeather = (location) => API.get(`/weather/${location}`);
export const addWeather = (token, data) =>
  API.post("/weather", data, { headers: { Authorization: `Bearer ${token}` } });
export const updateWeather = (token, location, data) =>
  API.patch(`/weather/${location}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteWeather = (token, id) =>
  API.delete(`/weather/${id}`, { headers: { Authorization: `Bearer ${token}` } });
