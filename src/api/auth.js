import api from './index';
import Swal from 'sweetalert2';

const authApi = {
  login(payload) {
    return api
      .post('/auth/login', payload)
      .then((res) => res)
      .catch((err) => {
        if (err.response?.status === 401) {
          return Promise.reject(new Error('帳號或密碼錯誤'));
        }
        return Promise.reject(new Error('登入失敗，請稍後再試'));
      });
  },
  sendForgetPassword(payload) {
    return api
      .post('/auth/forgot-password', payload)
      .then((res) => res)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          throw new Error('信箱錯誤');
        } else {
          throw new Error('忘記密碼send失敗，請稍後再試');
        }
      });
  },

  resetPassword(payload) {
    return api
      .post('/auth/reset-password', payload)
      .then((res) => res)

      .catch((err) => {
        // if (err.response && err.response.status === 401) {
        //   throw new Error('密碼錯誤');
        // } else {
        //   throw new Error('重設密碼send失敗，請稍後再試');
        // }
        throw err;
      });
  }
};

export default authApi;
