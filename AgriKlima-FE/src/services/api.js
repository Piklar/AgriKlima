// src/api.js
import axios from "axios";

// Create Axios instance
const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "https://agriklima-backend.onrender.com",
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Interceptor to add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // <- match AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// ---- USER ROUTES ----
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const getProfile = () => API.get("/users/details"); // no need to pass token explicitly
export const resetPassword = (data) => API.patch("/users/resetPassword", data);
export const getAllUsers = () => API.get("/users/all");
export const setAsAdmin = (userId) => API.patch(`/users/${userId}/setAsAdmin`);
export const updateUser = (userId, data) => API.put(`/users/${userId}`, data);
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
export const getUserById = (userId) => API.get(`/users/${userId}`);
export const updateUserProfile = (data) => API.put(`/users/${data._id}`, data);

// ---- CROP ROUTES ----
export const getCrops = () => API.get("/crops");
export const getCropById = (id) => API.get(`/crops/${id}`);
export const addCrop = (data) => API.post("/crops/add", data);
export const updateCrop = (id, data) => API.put(`/crops/${id}`, data);
export const deleteCrop = (id) => API.delete(`/crops/${id}`);

// ---- NEWS ROUTES ----
export const getNews = () => API.get("/news");
export const getNewsById = (id) => API.get(`/news/${id}`);
export const addNews = (data) => API.post("/news/add", data);
export const updateNews = (id, data) => API.patch(`/news/${id}`, data);
export const deleteNews = (id) => API.delete(`/news/${id}`);

// ---- PEST ROUTES ----
export const getPests = () => API.get("/pests");
export const getPestById = (id) => API.get(`/pests/${id}`);
export const addPest = (data) => API.post("/pests/add", data);
export const updatePest = (id, data) => API.put(`/pests/${id}`, data);
export const deletePest = (id) => API.delete(`/pests/${id}`);

// ---- TASK ROUTES ----
export const getTasks = () => API.get("/tasks");
export const getMyTasks = () => API.get("/tasks/my-tasks");
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const addTask = (data) => API.post("/tasks/add", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ---- WEATHER ROUTES ----
export const getWeather = (location) => API.get(`/weather/${location}`);
export const addWeather = (data) => API.post("/weather", data);
export const updateWeather = (location, data) => API.patch(`/weather/${location}`, data);
export const deleteWeather = (id) => API.delete(`/weather/${id}`);
