// src/api/axios.js
import axios from 'axios';
import { BACKEND_URL } from '../env';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: BACKEND_URL,
});

// Добавляем токен в заголовки для каждого запроса
instance.interceptors.request.use((config) => {
  const token = Cookies.get('jwt_token')
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
