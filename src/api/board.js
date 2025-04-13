import api from './index';

const boardApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  getBoards() {
    const token = this.getToken();
    // console.log('token', token);
    return api
      .get('/board', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('get boards fail');
        }
      })
      .catch((err) => {
        console.log('get boards api err, ', err);
        throw err;
      });
  },
  createBoard(boardTitle, pictureId) {
    const token = this.getToken();
    return api
      .post(
        '/board',
        {
          boardTitle,
          pictureId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
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
  },
  getBoardDetail(boardId) {
    const token = this.getToken();

    return api
      .get(`/board/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('取得 board 詳細資料失敗', err);
        throw err;
      });
  },
  deleteBoard(boardId) {
    const token = this.getToken();
    return api
      .delete('/board', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          boardId
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('delete list fail');
        }
      })
      .catch((err) => {
        console.log('delete list api err, ', err);
        throw err;
      });
  }
};

export default boardApi;
