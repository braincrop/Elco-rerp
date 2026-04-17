import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL
const localUrl = 'http://25.11.249.196:5007/api/'


const axiosInstance = axios.create({
  baseURL: baseURL,
})

const loginInstance = axios.create({
  baseURL: localUrl,
})

const axiosLocal = axios.create({
  baseURL: localUrl,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);



axiosLocal.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosLocal.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, loginInstance, axiosLocal }
