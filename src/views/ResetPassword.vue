<template>
  <div class="reset_password">
    <div class="big_bg">
      <div class="mid_place">
        <img src="@/assets/img/common/nowdo-logo.svg" alt="" class="logo" />
        <div class="input_place">
          <div class="each_input_row">
            <div class="input_title">密碼</div>
            <input type="password" class="input" placeholder="請輸入密碼" v-model.trim="password" />
            <div class="wrong_word" v-show="passwordWrongWordShow">請輸入密碼</div>
          </div>
          <div class="each_input_row">
            <div class="input_title">密碼</div>
            <input
              type="password"
              class="input"
              placeholder="請再次輸入密碼"
              v-model.trim="rePassword"
            />
            <div class="wrong_word" v-show="rePasswordWrongWordShow">請再次輸入密碼</div>
          </div>
        </div>
        <div class="send_btn" @click="confirmBtnClick">確認</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import authApi from '@/api/auth';

const token = ref('');
const route = useRoute();
const router = useRouter();

const passwordWrongWordShow = ref(false);
const rePasswordWrongWordShow = ref(false);

const password = ref('');
const rePassword = ref('');

onMounted(() => {
  token.value = route.query.token || '';
});

const forgetPasswordPlaceShow = ref(false);

const confirmBtnClick = async () => {
  console.log('token', token.value);
  let status = true;

  if (!password.value) {
    passwordWrongWordShow.value = true;
    status = false;
  } else {
    passwordWrongWordShow.value = false;
  }

  if (!rePassword.value) {
    rePasswordWrongWordShow.value = true;
    status = false;
  } else {
    rePasswordWrongWordShow.value = false;
  }

  if (!status) return;

  if (password.value !== rePassword.value) {
    Swal.fire({
      icon: 'error',
      title: '兩次輸入的密碼不同'
    });
  } else {
    const obj = {
      token: token.value,
      password: password.value
    };

    const res = await authApi.resetPassword(obj);
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: '密碼已變更',
        showConfirmButton: false,
        timer: 1500
      });

      setTimeout(() => {
        router.push({ name: 'login' });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '變更失敗',
        text: res?.message,
        confirmButtonText: '確認'
      });
    }
  }
};
</script>

<style lang="scss"></style>
