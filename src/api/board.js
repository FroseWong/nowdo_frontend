import api from './index';
import authUtil from '@/utils/authUtil';
import regex from '@/utils/regex';

const boardApi = {
  async getBoards() {
    try {
      const res = await api.get('/board', {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res?.data };
    } catch (err) {
      const msg = err.response?.data?.message || '取得board失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async createBoard(boardTitle, pictureId) {
    try {
      const res = await api.post(
        '/board',
        {
          boardTitle,
          pictureId
        },
        {
          headers: authUtil.getAuthHeader()
        }
      );
      return { success: true, data: res.data };
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || '取得失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },

  async updateBoard(boardId, boardTitle, pictureId, newPictureUrl = null, remark = null) {
    try {
      const res = await api.patch(
        `/board/${boardId}`,
        {
          boardTitle,
          pictureId,
          newPictureUrl,
          remark
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

  async getBoardDetail(boardId) {
    if (!regex.number.test(boardId)) {
      console.warn('boardId 格式錯誤，必須是正整數');
      return { success: false, message: '無效的看板ID' };
    }
    console.log('boardIdR', boardId);
    try {
      const res = await api.get(`/board/${boardId}`, {
        headers: authUtil.getAuthHeader()
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '取得失敗，請稍後再試';
      return { success: false, message: msg };
    }
  },
  async deleteBoard(boardId) {
    try {
      const res = await api.delete('/board', {
        headers: authUtil.getAuthHeader(),
        data: {
          boardId
        }
      });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || '刪除失敗，請稍後再試';
      return { success: false, message: msg };
    }
  }
};

export default boardApi;
