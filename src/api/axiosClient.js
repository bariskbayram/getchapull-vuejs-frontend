import axios from 'axios';
export const BASE_URL = process.env.VUE_APP_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized or token expired');
      localStorage.clear();
      window.location.href = '/login';
    }
  }
);
