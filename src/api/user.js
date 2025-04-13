// src/api/user.js
import api from './index';
import Swal from 'sweetalert2';

const userApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  getAllUsers() {
    return api
      .get('/user')
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('get user fail');
        }
      })
      .catch((err) => {
        console.log('getAllUsers api err, ', err);
        throw err;
      });
  },

  // 根據 ID 取得使用者
  getUserById(id) {
    api.get(`/user/${id}`);
  },

  // 新增使用者
  createNewUser(userData) {
    return api
      .post('/user', userData)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('create user fail');
        }
      })
      .catch((err) => {
        console.log('create user api err, ', err);
        throw err;
      });
  },

  // 更新密碼
  updatePassword(payload) {
    api.patch('/user/password', payload);
  },

  // 更新username
  updateUsername(userData) {
    const token = this.getToken();
    return api
      .patch('/user/username', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('create board fail');
        }
      })
      .catch((err) => {
        console.log('create board api err, ', err);
        throw err;
      });
  }
};

// 取得所有使用者
export default userApi;
