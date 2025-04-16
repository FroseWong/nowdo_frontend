// src/api/user.js
import api from './index';
import authUtil from '@/utils/authUtil';

const listApi = {
  async updateListOrder(listData) {
    try {
      const res = await api.patch('/list/order', listData, {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '更新失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async createNewList(listData) {
    try {
      const res = await api.post('/list', listData, {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '創建失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async deleteList(listId) {
    try {
      const res = await api.delete('/list', {
        headers: authUtil.getAuthHeader(),
        data: {
          listId
        }
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '刪除失敗，請稍後再試';
      return { success: false, message: msg };
    }
  }
};

export default listApi;
