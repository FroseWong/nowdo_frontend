<template>
  <div class="register">
    <div class="big_bg">
      <div class="mid_place">
        <img src="@/assets/img/common/nowdo-logo.svg" alt="" class="logo" />
        <div class="input_place">
          <div class="each_input_row">
            <div class="input_title">名稱</div>
            <input
              type="text"
              class="input"
              placeholder="請輸入使用者名稱"
              v-model.trim="username"
            />
            <div class="wrong_word" v-show="usernameWrongWordShow">請輸入使用者名稱</div>
          </div>
          <div class="each_input_row">
            <div class="input_title">信箱</div>
            <input type="text" class="input" placeholder="請輸入信箱" v-model.trim="email" />
            <div class="wrong_word" v-show="emailWrongWordShow">{{ emailWrongWord }}</div>
          </div>
          <div class="each_input_row">
            <div class="input_title">密碼</div>
            <input type="password" class="input" placeholder="請輸入密碼" v-model.trim="password" />
            <div class="wrong_word" v-show="passwordWrongWordShow">請輸入密碼</div>
          </div>
        </div>
        <div class="send_btn" @click="confirmBtnClick">確認</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import Swal from 'sweetalert2';
import regex from '@/utils/regex';
import { useRoute, useRouter } from 'vue-router';

import userApi from '@/api/user';

onMounted(() => {
  console.log('mounted');
  if (route.query.email) {
    email.value = route.query.email;
  }
});

const route = useRoute();
const router = useRouter();

// 紅字
const usernameWrongWordShow = ref(false);
const emailWrongWordShow = ref(false);
const passwordWrongWordShow = ref(false);

const emailWrongWord = ref('');

// Data
const username = ref('');
const email = ref('');
const password = ref('');

const confirmBtnClick = async () => {
  console.log('uswename', username.value);
  console.log('email', email.value);
  console.log('password', password.value);

  usernameWrongWordShow.value = !username.value;
  emailWrongWordShow.value = !email.value;
  passwordWrongWordShow.value = !password.value;

  if (!email.value) {
    emailWrongWordShow.value = true;
    emailWrongWord.value = '請輸入信箱';
  } else if (!regex.email.test(email.value)) {
    emailWrongWordShow.value = true;
    emailWrongWord.value = '信箱格式不正確';
  } else {
    emailWrongWordShow.value = false;
  }

  if (!(usernameWrongWordShow.value || emailWrongWordShow.value || passwordWrongWordShow.value)) {
    // try {
    const obj = {
      username: username.value,
      email: email.value,
      password: password.value,
      provider: 'local',
      provider_id: null
    };
    console.log('obj', obj);
    const res = await userApi.createNewUser(obj);
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: '帳號創建成功',
        showConfirmButton: false,
        timer: 1500
      });

      setTimeout(() => {
        router.push({ name: 'login' });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '註冊失敗',
        text: res?.message,
        confirmButtonText: '確認'
      });
    }
    // if (res && res.id) {
    // }
    // } catch (err) {
    // console.error('❌ 註冊錯誤：', err);

    // }
  }

  console.log('confirm');
};
</script>

<style lang="scss"></style>
