// src/services/api.js
import axios from "axios";

// Create Axios instance
const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Interceptor to add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// ---- USER ROUTES ----
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const getProfile = () => API.get("/users/details");
export const resetPassword = (data) => API.patch("/users/resetPassword", data);
export const getAllUsers = () => API.get("/users/all");
export const setAsAdmin = (userId) => API.patch(`/users/${userId}/setAsAdmin`);
export const updateUser = (userId, data) => API.put(`/users/${userId}`, data);
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
export const getUserById = (userId) => API.get(`/users/${userId}`);
// --- RENAMED for clarity ---
export const updateUserProfileInfo = (data) => API.put(`/users/update-profile`, data);
// --- NEW function for profile picture ---
export const updateProfilePicture = (formData) => {
  return API.patch('/users/update-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ---- CROP ROUTES ----
export const getCrops = () => API.get("/crops");
export const getCropById = (id) => API.get(`/crops/${id}`);
export const addCrop = (data) => API.post("/crops/add", data);
export const updateCrop = (id, data) => API.put(`/crops/${id}`, data);
export const deleteCrop = (id) => API.delete(`/crops/${id}`);
export const uploadCropImage = (id, formData) => API.patch(`/crops/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ---- NEWS ROUTES ----
export const getNews = () => API.get("/news");
export const getNewsById = (id) => API.get(`/news/${id}`);
export const addNews = (data) => API.post("/news/add", data);
export const updateNews = (id, data) => API.patch(`/news/${id}`, data);
export const deleteNews = (id) => API.delete(`/news/${id}`);
export const uploadNewsImage = (id, formData) => API.patch(`/news/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ---- PEST ROUTES ----
export const getPests = () => API.get("/pests");
export const getPestById = (id) => API.get(`/pests/${id}`);
export const addPest = (data) => API.post("/pests/add", data);
export const updatePest = (id, data) => API.put(`/pests/${id}`, data);
export const deletePest = (id) => API.delete(`/pests/${id}`);
export const uploadPestImage = (id, formData) => API.patch(`/pests/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

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

// ---- CHATBOT ROUTE ----
export const sendMessageToBot = (data) => API.post("/chat/send", data);