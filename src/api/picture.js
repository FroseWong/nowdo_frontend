import api from './index';
import authUtil from '@/utils/authUtil';

const pictureApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  async getPictures() {
    try {
      const res = await api.get('/picture', {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '取得失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },

  async uploadPhoto(url, remark = null) {
    try {
      const res = await api.post(
        '/picture',
        {
          imageUrl: url,
          remark: remark
        },
        {
          headers: authUtil.getAuthHeader()
        }
      );
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '更新失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async deletePhoto(pictureId) {
    try {
      const res = await api.delete('/picture', {
        headers: authUtil.getAuthHeader(),
        data: {
          pictureId
        }
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '刪除失敗，請稍後再試';
      return { success: false, message: msg };
    }
  }
};

export default pictureApi;
