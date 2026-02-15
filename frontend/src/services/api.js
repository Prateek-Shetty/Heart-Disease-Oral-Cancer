import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const predictHeart = (data) => API.post("/predict-heart", data);

export const predictOral = (formData) =>
  API.post("/predict-oral", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const chatWithAI = (message) =>
  API.post("/chat", { message });
