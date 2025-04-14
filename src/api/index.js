import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // 🌐 這是你的 Spring Boot 後端 baseURL

  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token 無效或過期，請重新登入');
      localStorage.removeItem('nowdoToken');
      localStorage.removeItem('nowdoUser');
      window.location.href = '/login'; // 自動跳轉登入頁
    }
    return Promise.reject(error);
  }
);

export default api;
