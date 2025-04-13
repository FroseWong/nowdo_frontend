<template>
  <div class="header">
    <img src="@/assets/img/common/nowdo-logo.svg" alt="" class="logo" />
    <div class="right_top">
      <div class="member_icon" @click="droplistShowToggle">{{ username[0] }}</div>
      <div class="member_drop_list" v-show="droplistShow">
        <div class="item" @click="accountManageBtnClick">帳號設定</div>
        <div class="item" @click="logout">登出</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const username = ref('');
onMounted(() => {
  document.addEventListener('click', handleHeaderClickOutside);

  const user = JSON.parse(localStorage.getItem('nowdoUser'));
  username.value = user.username;
  console.log('user', user);
});

onUnmounted(() => {
  document.removeEventListener('click', handleHeaderClickOutside);
});

const droplistShow = ref(false);
const handleHeaderClickOutside = (e) => {
  // 點擊頭像不處理
  if (e.target.classList.contains('member_icon')) return;

  // 點擊父層非member_drop_list，且droplist是顯示的，就關起來
  if (!e.target.closest('member_drop_list') && droplistShow.value) {
    droplistShow.value = false;
  }
};

const droplistShowToggle = () => {
  droplistShow.value = !droplistShow.value;
};

const logout = () => {
  localStorage.removeItem('nowdoToken');
  localStorage.removeItem('nowdoUser');
  router.push({ name: 'home' });
};

const accountManageBtnClick = () => {
  console.log('manage!');
  router.push({ name: 'accountManage' });
};
</script>

<style lang="scss"></style>
