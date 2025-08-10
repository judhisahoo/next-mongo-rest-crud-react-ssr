import axios, { AxiosError } from 'axios';
import { store } from '../store/store';
//import { logout } from '../store/features/auth/authSlice';

const API_BASE_URL = process.env.NEST_PUBLIC_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      //config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global errors, like a 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(
      'error.response in axiosInstance.interceptors.response',
      error.response,
    );
    if (error.response?.status === 401) {
      // Dispatch logout action to clear user state
      //store.dispatch(logout());
      // Redirect to the login page
      //window.location.href = '/login';
    }

    if (error.response === undefined) {
      // Re-throw a new error with a user-friendly message
      throw new Error('API server is not working. Please try again later.');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
