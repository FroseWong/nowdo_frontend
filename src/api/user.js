// src/api/user.js
import api from './index';

const userApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  // 新增使用者
  async createNewUser(userData) {
    try {
      const res = await api.post('/user', userData);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '註冊失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },

  // 更新username
  async updateUsername(userData) {
    try {
      const token = this.getToken();
      const res = await api.patch('/user/username', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '變更失敗，請稍後再試';
      return { success: false, message: msg };
    }
  }
};

// 取得所有使用者
export default userApi;
