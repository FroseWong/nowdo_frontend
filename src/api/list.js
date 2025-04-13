// src/api/user.js
import api from './index';

const listApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  updateListOrder(listData) {
    const token = this.getToken();
    return api
      .patch('/list/order', listData, {
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
  },
  createNewList(listData) {
    const token = this.getToken();
    return api
      .post('/list', listData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('create list fail');
        }
      })
      .catch((err) => {
        console.log('create list api err, ', err);
        throw err;
      });
  },
  deleteList(listId) {
    const token = this.getToken();
    return api
      .delete('/list', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          listId
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

export default listApi;
