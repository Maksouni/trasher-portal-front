import axios from "axios";
import Cookies from "js-cookie";

const isDev = import.meta.env.DEV;

const baseURL = isDev ? "/api" : import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("jwt_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
