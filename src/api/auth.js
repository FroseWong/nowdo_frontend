import api from './index';

const authApi = {
  async login(payload) {
    try {
      const res = await api.post('/auth/login', payload);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '登入失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async sendForgetPassword(payload) {
    try {
      const res = await api.post('/auth/forgot-password', payload);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '發送失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },

  async resetPassword(payload) {
    try {
      const res = await api.post('/auth/reset-password', payload);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '重設密碼 send 失敗，請稍後再試';
      return { success: false, message: msg }; // 保留原始錯誤
    }
  }
};

export default authApi;
