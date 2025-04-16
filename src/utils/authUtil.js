const authUtil = {
    getToken() {
      return localStorage.getItem('nowdoToken');
    },
    getAuthHeader() {
      const token = this.getToken();
      return {
        Authorization: `Bearer ${token}`
      };
    }
  };
  
  export default authUtil;
  