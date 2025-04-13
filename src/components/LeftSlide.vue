<template>
  <div class="left_slide">
    <div class="slide_top">
      <div class="each_top extend">
        <div class="top_title">縮小</div>
        <font-awesome-icon :icon="['fas', 'angle-left']" class="fa-angle-left" />
      </div>
      <div class="each_top" @click="workspaceClick">
        <font-awesome-icon :icon="['fas', 'chess-board']" class="fa-chess-board" />
        <div class="top_title">看板</div>
      </div>
    </div>
    <div class="slide_bottom">
      <div class="your_board">
        <div class="your_title">你的看板</div>
        <font-awesome-icon
          :icon="['fas', 'plus']"
          class="fa-plus"
          :class="{ full: isFull }"
          :title="isFull ? '看板最多只能建立 10 個' : ''"
          @click="addBoardPopupClick"
        />
      </div>
      <div class="board_list">
        <div
          class="each_board"
          :class="{ focus: eachBoard.id === boardId }"
          v-for="(eachBoard, i) in boardList"
          @click="goToBoard(eachBoard.id)"
          :key="eachBoard.id"
        >
          <div
            class="board_pre_div"
            :style="{ backgroundImage: 'url(' + eachBoard.imageUrl + ')' }"
          ></div>
          <div class="board_title">{{ eachBoard.boardTitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import EventBus from '@/utils/eventBus';
import BusEvents from '@/utils/busEvents';
import { useRouter } from 'vue-router';

onMounted(() => {
  // boardList.value.forEach((eachBoard) => {
  //   eachBoard.backgroundColor = getRandomColor();
  // });
  // console.log('boardList', boardList.value);
  boardList.value = props.boardList;
  boardId.value = props.boardId;
});

const props = defineProps(['boardList', 'boardId', 'isFull']);
const router = useRouter();
const boardList = ref([
  { boardTitle: 'boardName1', boardImage: '', backgroundColor: '' },
  { boardTitle: 'boardName2', boardImage: '', backgroundColor: '' },
  { boardTitle: 'boardName3', boardImage: '', backgroundColor: '' },
  { boardTitle: 'boardName4', boardImage: '', backgroundColor: '' },
  { boardTitle: 'boardName5', boardImage: '', backgroundColor: '' }
]);

const isFull = ref(false);

watch(
  () => props.boardId,
  (newVal) => {
    boardId.value = newVal;
  }
);

watch(
  () => props.boardList,
  (newVal) => {
    boardList.value = newVal;
  }
);

watch(
  () => props.isFull,
  (newVal) => {
    isFull.value = newVal;
  }
);

const boardId = ref();

// const getRandomColor = () => {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return `rgb(${r}, ${g}, ${b})`;
// };

const addBoardPopupClick = () => {
  EventBus.emit(BusEvents.ADD_BOARD, { status: true });
};

const workspaceClick = () => {
  router.push({ name: 'workspace' });
};

const goToBoard = (boardId) => {
  router.push({ name: 'board', params: { boardId: boardId } });
};
</script>

<style lang="scss"></style>
