<template>
  <div class="account_manage">
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
          <!-- <div class="each_input_row">
            <div class="input_title">信箱</div>
            <input type="text" class="input" placeholder="請輸入信箱" v-model.trim="email" />
            <div class="wrong_word" v-show="emailWrongWordShow">請輸入信箱</div>
          </div> -->
          <!-- <div class="each_input_row">
            <div class="input_title">密碼</div>
            <input type="password" class="input" placeholder="請輸入密碼" v-model.trim="password" />
            <div class="wrong_word" v-show="passwordWrongWordShow">請輸入密碼</div>
          </div> -->
        </div>
        <div class="btn_space">
          <div class="btn send" @click="confirmBtnClick">確認</div>
          <div class="btn return" @click="returnWorkspace">返回看板</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import userApi from '@/api/user';

onMounted(() => {
  getLocalUserData();
});

const router = useRouter();

// 紅字
const usernameWrongWordShow = ref(false);

// Data
const user = ref('');
const username = ref('');

const confirmBtnClick = async () => {
  console.log('username', username.value);
  console.log('user.value.name', user.value.username);

  usernameWrongWordShow.value = !username.value;

  if (usernameWrongWordShow.value) return;

  if (username.value !== user.value.username) {
    const obj = {
      username: username.value
    };
    console.log('obj', obj);
    const res = await userApi.updateUsername(obj);

    console.log('res', res);
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: '使用者名稱更新成功',
        showConfirmButton: false,
        timer: 1500
      });

      localStorage.setItem('nowdoUser', JSON.stringify(res.data));
      getLocalUserData();
    } else {
      Swal.fire({
        icon: 'error',
        title: '變更失敗',
        text: res.message,
        confirmButtonText: '確認'
      });
    }
  } else {
    Swal.fire({
      icon: 'success',
      title: '使用者名稱更新成功',
      showConfirmButton: false,
      timer: 1500
    });
  }
};

const getLocalUserData = () => {
  user.value = JSON.parse(localStorage.getItem('nowdoUser'));
  username.value = user.value.username;
};
const returnWorkspace = () => {
  router.push({ name: 'workspace' });
};
</script>

<style lang="scss"></style>
