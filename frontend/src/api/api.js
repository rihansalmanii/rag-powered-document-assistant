import axios from "axios";

// axios instance
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default api;