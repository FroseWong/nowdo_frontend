// src/api/user.js
import api from './index';
import authUtil from '@/utils/authUtil';

const cardApi = {
  async createNewCard(cardData) {
    try {
      const res = await api.post('/card', cardData, {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '創建失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async updateCard(cardData) {
    try {
      const res = await api.patch('/card', cardData, {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '更新失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async updateCardOrder(cardData) {
    try {
      const res = await api.patch('/card/order', cardData, {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '更新失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async deleteCard(cardId) {
    try {
      const res = await api.delete('/card', {
        headers: authUtil.getAuthHeader(),
        data: {
          cardId
        }
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '刪除失敗，請稍後再試';
      return { success: false, message: msg };
    }
  }
};

export default cardApi;
