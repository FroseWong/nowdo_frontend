<template>
  <div class="page_loading" v-show="loadingShow"></div>

  <div class="login">
    <div class="big_bg">
      <div class="mid_place">
        <!-- 一般登入以下 -->
        <img src="@/assets/img/common/nowdo-logo.svg" alt="" class="logo" />
        <div class="input_place">
          <div class="each_input_row">
            <div class="input_title">信箱</div>
            <input type="text" class="input" placeholder="請輸入信箱" v-model.trim="email" />
            <div class="wrong_word" v-show="loginEmailWrongWordShow">{{ loginEmailWrongWord }}</div>
          </div>
          <div class="each_input_row">
            <div class="input_title">密碼</div>
            <input type="password" class="input" placeholder="請輸入密碼" v-model.trim="password" />
            <div class="wrong_word" v-show="loginPasswordWrongWordShow">請輸入密碼</div>
          </div>
        </div>
        <div class="remember_me_row">
          <input type="checkbox" name="" id="remember_me" v-model="rememberMeStatus" />
          <label for="remember_me" class="remember_me_title">記住我</label>
          <div class="forget_password" @click="forgetPasswordPlaceToggle(true)">忘記密碼?</div>
        </div>
        <div class="send_btn" @click="loginBtnClick">登入</div>
        <!-- 一般登入以上 -->

        <!-- 忘記密碼區域以下 -->
        <div class="forget_password_place" :class="{ show: forgetPasswordPlaceShow }">
          <img src="@/assets/img/common/nowdo-logo.svg" alt="" class="logo" />
          <div class="input_place">
            <div class="each_input_row">
              <div class="input_title">信箱</div>
              <input
                type="text"
                class="input"
                placeholder="請輸入信箱"
                v-model.trim="forgetPasswordEmail"
              />
              <div class="wrong_word" v-show="forgetPasswordWrongWordShow">
                {{ forgetPasswordWrongWord }}
              </div>
            </div>
          </div>
          <div class="send_btn" @click="sendForgetPasswordClick">發送忘記密碼信</div>
          <div class="back_to_login" @click="forgetPasswordPlaceToggle(false)">返回登入</div>
        </div>
        <!-- 忘記密碼區域以上 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import authApi from '@/api/auth';
import regex from '@/utils/regex';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const forgetPasswordPlaceShow = ref(false);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rememberMeStatus = ref(false);
const email = ref('');
const password = ref('');
const provider = ref('local');
const loginBtnClickStatus = ref(false); // 確認是否處理登入中
const forgetPasswordEmail = ref(''); // 忘記密碼信箱

const isSendingForgetPassword = ref(false); // 正在發送忘記密碼信

// 登入紅字
const loginEmailWrongWordShow = ref(false);
const loginEmailWrongWord = ref('');

// 註冊紅字
const loginPasswordWrongWordShow = ref(false);

// 忘記密碼紅字
const forgetPasswordWrongWordShow = ref(false);
const forgetPasswordWrongWord = ref('');

// loading
const loadingShow = ref(false);

onMounted(async () => {
  // login()
  // 儲存 token
  if (localStorage.getItem('nowdoRememberUser')) {
    const user = JSON.parse(localStorage.getItem('nowdoRememberUser'));
    console.log('user', user);

    email.value = user.email;
    password.value = user.password;
    rememberMeStatus.value = true;
  }
  // await login();
});

const loginBtnClick = async () => {
  if (!email.value) {
    loginEmailWrongWordShow.value = true;
    loginEmailWrongWord.value = '請輸入信箱';
  } else if (!regex.email.test(email.value)) {
    loginEmailWrongWordShow.value = true;
    loginEmailWrongWord.value = '信箱格式不正確';
  } else {
    loginEmailWrongWordShow.value = false;
  }

  loginPasswordWrongWordShow.value = !password.value;
  if (loginEmailWrongWordShow.value || loginPasswordWrongWordShow.value) return;
  if (!loginBtnClickStatus.value) await login();
};

const login = async () => {
  // try {
  loginBtnClickStatus.value = true;
  const res = await authApi.login({
    email: email.value,
    password: password.value,
    provider: provider.value
  });
  console.log('res', res);

  if (res.success) {
    localStorage.setItem('nowdoToken', res.data.token); // 儲存 token
    localStorage.setItem('nowdoUser', JSON.stringify(res.data.user));
    Swal.fire({
      icon: 'success',
      title: '登入成功',
      showConfirmButton: false,
      timer: 1500
    });
    if (rememberMeStatus.value) {
      const user = {
        email: email.value,
        password: password.value
      };
      localStorage.setItem('nowdoRememberUser', JSON.stringify(user)); // 儲存 token
    } else {
      localStorage.removeItem('nowdoRememberUser');
    }

    console.log('登入成功');
    loginBtnClickStatus.value = false;
    setTimeout(() => {
      router.push({ name: 'workspace' });
    }, 500);
  } else {
    Swal.fire({
      title: '帳號或密碼錯誤！',
      text: res.message,
      icon: 'error',
      confirmButtonText: '確認'
    });
  }
  // } catch (err) {
  // console.log('err', err);
  // alert('登入失敗');
  // Swal.fire({
  //   title: '帳號或密碼錯誤！',
  //   text: '請再嘗試登入',
  //   icon: 'error',
  //   confirmButtonText: '確認'
  // });

  // console.error('登入錯誤：', err);
  loginBtnClickStatus.value = false;
  // }
};

const forgetPasswordPlaceToggle = (status) => {
  forgetPasswordPlaceShow.value = status;
};

const sendForgetPasswordClick = async () => {
  console.log('forgetPasswordEmail', forgetPasswordEmail.value);
  if (isSendingForgetPassword.value) return;

  if (!forgetPasswordEmail.value) {
    forgetPasswordWrongWordShow.value = true;
    forgetPasswordWrongWord.value = '請輸入信箱';
  } else if (!regex.email.test(forgetPasswordEmail.value)) {
    forgetPasswordWrongWordShow.value = true;
    forgetPasswordWrongWord.value = '信箱格式不正確';
  } else {
    // try {
    isSendingForgetPassword.value = true;
    forgetPasswordWrongWordShow.value = false;
    loadingShow.value = true;
    const obj = {
      email: forgetPasswordEmail.value
    };
    const res = await authApi.sendForgetPassword(obj);
    if (res.success) {
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: '忘記密碼信已送出',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '發送失敗',
        text: res.message,
        confirmButtonText: '確認'
      });
    }
    console.log('res', res);
    // isSendingForgetPassword.value = false;
    // loadingShow.value = false;
    // } catch (err) {
    // console.log('err', JSON.stringify(err));
    // const errorMsg = err.response?.data?.message || '發送失敗，請稍後再試';
    // console.log('errorMsg', errorMsg);
    // Swal.fire({
    //   icon: 'error',
    //   title: '發送失敗',
    //   text: errorMsg,
    //   confirmButtonText: '確認'
    // });
    // }
    isSendingForgetPassword.value = false;
    loadingShow.value = false;
  }
};
</script>

<style lang="scss"></style>
