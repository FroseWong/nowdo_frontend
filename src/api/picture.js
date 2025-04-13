import api from './index';

const pictureApi = {
  getToken() {
    const token = localStorage.getItem('nowdoToken');
    return token;
  },
  getPictures() {
    const token = this.getToken();
    // console.log('token', token);
    return api
      .get('/picture', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('get pictures fail');
        }
      })
      .catch((err) => {
        console.log('get pictures api err, ', err);
        throw err;
      });
  },

  uploadPhoto(url, remark = null) {
    const token = this.getToken();
    return api
      .post(
        '/picture',
        {
          imageUrl: url,
          remark: remark
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
          throw new Error('upload picture fail');
        }
      })
      .catch((err) => {
        console.log('upload picture api err, ', err);
        throw err;
      });
  },
  deletePhoto(pictureId) {
    const token = this.getToken();
    return api
      .delete('/picture', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          pictureId
        }
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('delete picture fail');
        }
      })
      .catch((err) => {
        console.log('delete picture api err, ', err);
        throw err;
      });
  }
};

export default pictureApi;
