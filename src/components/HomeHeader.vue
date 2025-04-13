<template>
  <div class="home_header">
    <div class="wrapper home_header_in">
      <img src="@/assets/img/common/nowdo-logo.svg" alt="" class="logo" />
      <div class="right_top">
        <div class="btn login" @click="loginClick">登入</div>
        <div class="btn register" @click="registerClick">註冊</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {

});

const router = useRouter();
const loginClick = () => {
  router.push({ name: 'workspace' });
};

const registerClick = () => {
  router.push({ name: 'register' });
};
</script>

<style lang="scss"></style>
