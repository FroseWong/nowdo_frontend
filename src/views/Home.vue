<template>
  <div class="home">
    <HomeHeader />
    <div class="mid_place">
      <div class="wrapper mid_place_in">
        <div class="mid_left">
          <div class="title">隨時隨地掌控待辦事項，有條不紊地完成每一件事。</div>
          <div class="sec_title">nowdo，讓效率成為日常。</div>
          <div class="input_row">
            <input type="text" class="register_input" placeholder="電子郵件" v-model="email" />
            <div class="register" @click="freeCreateBtn">免費註冊</div>
          </div>
        </div>
        <div class="mid_right"></div>
      </div>
    </div>
    <div class="wrapper bottom_place">
      <div class="bottom_intro">nowdo 基礎介紹</div>
      <div class="bottom_title">幫你掌控每一件事</div>
      <div class="bottom_description">
        使用清單、分類與提醒功能，讓任務有序、時間有效。 從個人日常到專案協作，Nowdo
        讓你更清楚該做什麼、何時做，輕鬆展開高效一天。
      </div>
      <div class="pic_row">
        <div class="pic_left">
          <div class="btn" :class="{ focus: picFocusIndex === 0 }" @click="changeFocusIndex(0)">
            <div class="btn_title">工作區</div>
            <div class="btn_description">
              將你的待辦事項依照不同領域劃分成獨立工作區，不論是 Side
              Project、學習計畫，還是生活雜事，都能有條理地管理與聚焦。
            </div>
          </div>
          <div class="btn" :class="{ focus: picFocusIndex === 1 }" @click="changeFocusIndex(1)">
            <div class="btn_title">看板</div>
            <div class="btn_description">
              專注每個流程環節。
              在看板中安排清單與任務卡片，從靈感發想到任務完成，每一步都能清楚掌握、彈性調整。
            </div>
          </div>
          <div class="btn" :class="{ focus: picFocusIndex === 2 }" @click="changeFocusIndex(2)">
            <div class="btn_title">卡片</div>
            <div class="btn_description">
              一張卡片，承載一件任務。
              任務標題、描述、到期日、備註、標籤、子任務通通裝進去。需要時再點開，一切細節一目了然。
            </div>
          </div>
        </div>
        <div class="pic_right" :style="{ backgroundImage: 'url(' + imgComputed + ')' }"></div>
      </div>
    </div>
    <!-- <div class="footer">
      <div class="footer_left"></div>
      <div class="footer_right"></div>
    </div> -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import HomeHeader from '@/components/HomeHeader.vue';
import Footer from '@/components/Footer.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const picFocusIndex = ref(0);
const imgArr = ref([
  'https://firebasestorage.googleapis.com/v0/b/test-da97e.appspot.com/o/boards%2Fworkspace.png?alt=media&token=811fab06-3004-4f96-8936-f238d7dfb044',
  'https://firebasestorage.googleapis.com/v0/b/test-da97e.appspot.com/o/boards%2FBoard.png?alt=media&token=a572a78f-7591-4f05-a6e7-af580dc8217b',
  'https://firebasestorage.googleapis.com/v0/b/test-da97e.appspot.com/o/boards%2Fcard_2.png?alt=media&token=45883cc8-3883-49da-b201-237c22bf3b23'
]);

onMounted(() => {
  imgArr.value.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
});

const email = ref('');

const imgComputed = computed(() => imgArr.value[picFocusIndex.value]);
const changeFocusIndex = (i) => {
  picFocusIndex.value = i;
};

const freeCreateBtn = () => {
  console.log('email.value', email.value);
  console.log('freeCreateBtn');
  router.push({
    name: 'register', // 註冊頁 route 的 name
    query: {
      email: email.value
    }
  });

  // router.push({ name: 'register' });
};
</script>
