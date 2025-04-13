// src/api/user.js
import api from './index';

const cardApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  createNewCard(cardData) {
    const token = this.getToken();
    return api
      .post('/card', cardData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('create card fail');
        }
      })
      .catch((err) => {
        console.log('create card api err, ', err);
        throw err;
      });
  },
  updateCard(cardData) {
    const token = this.getToken();
    return api
      .patch('/card', cardData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('card patch fail');
        }
      })
      .catch((err) => {
        console.log('card patch api err, ', err);
        throw err;
      });
  },
  updateCardOrder(cardData) {
    const token = this.getToken();
    return api
      .patch('/card/order', cardData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('card order patch fail');
        }
      })
      .catch((err) => {
        console.log('card order patch api err, ', err);
        throw err;
      });
  },
  deleteCard(cardId) {
    const token = this.getToken();
    return api
      .delete('/card', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          cardId
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

export default cardApi;
