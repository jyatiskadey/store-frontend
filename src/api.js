import axios from "axios";

const API = axios.create({
  // baseURL: "https://store-backend-xr00.onrender.com/api", // ✅ adjust if deployed
  baseURL: "http://localhost:5000/api", // ✅ adjust if deployed
});

// Optional: You can add interceptors here if using auth
export default API;
