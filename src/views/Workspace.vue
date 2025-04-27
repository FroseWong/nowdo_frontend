<template>
  <div class="workspace" ref="workspace">
    <Header />
    <!-- <AddBoardPopup />
    <UpdateBoardPopup /> -->

    <BoardPopup />
    <div class="mid_place">
      <LeftSlide
        :boardList="originBoardList"
      />
      <div class="workspace_right">
        <div class="title">看板</div>
        <div class="filter_row">
          <div class="each_filter order" @click="toggleSelectList">
            <div class="filter_title">排序依據</div>
            <div class="filter_select">
              <div class="selected">{{ selectTextObj.text }}</div>
              <font-awesome-icon
                :icon="['fas', 'angle-down']"
                class="fa-angle-down"
                v-show="!selectListShow"
              />
              <font-awesome-icon
                :icon="['fas', 'angle-up']"
                class="fa-angle-up"
                v-show="selectListShow"
              />

              <div class="select_list" v-show="selectListShow">
                <div
                  class="each_item"
                  v-for="(eachSelect, i) in selectList"
                  @click="selectListClick(i)"
                  :key="i"
                >
                  {{ eachSelect.text }}
                </div>
              </div>
            </div>
          </div>
          <div class="each_filter">
            <div class="filter_title">搜尋</div>
            <div class="filter_search">
              <div class="search_left">
                <font-awesome-icon
                  :icon="['fas', 'magnifying-glass']"
                  class="fa-magnifying-glass"
                />
              </div>
              <!-- <div class="search_right"></div> -->
              <input
                type="text"
                class="search_right"
                v-model="searchText"
                @input="searchTextInput"
              />
            </div>
          </div>
        </div>
        <div class="board_list">
          <div
            class="each_board add_board"
            :class="{ full: leftCount <= 0 }"
            @click="addBoardPopupClick"
          >
            <div class="board_title">建立新的看板</div>
            <div class="board_description">剩餘看板{{ leftCount }}</div>
          </div>
          <div
            class="each_board"
            v-for="(eachBoard, i) in boardList"
            :style="{ backgroundImage: 'url(' + eachBoard.imageUrl + ')' }"
            :key="eachBoard.id"
            @click="goToBoard(eachBoard.id)"
          >
            <div class="board_title">{{ eachBoard.boardTitle }}</div>
            <font-awesome-icon
              :icon="['fas', 'gear']"
              class="fa-solid fa-gear"
              @click.stop="updateBoardPopupClick(eachBoard)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import LeftSlide from '@/components/LeftSlide.vue';
// import AddBoardPopup from '@/components/AddBoardPopup.vue';
// import UpdateBoardPopup from '@/components/UpdateBoardPopup.vue';
import BoardPopup from '@/components/BoardPopup.vue';
import EventBus from '@/utils/eventBus';
import BusEvents from '@/utils/busEvents';
import userApi from '@/api/user';
import boardApi from '@/api/board';
import { useRouter } from 'vue-router';

onMounted(async () => {
  // originBoardList.value.forEach((eachBoard) => {
  //   eachBoard.backgroundColor = getRandomColor();
  // });

  loadBoards();
  console.log('originBoardList', originBoardList.value);

  if (workspace.value) workspace.value.addEventListener('click', handleWorkspaceClickOutside);
  EventBus.on(BusEvents.ADD_BOARD_OVER, loadBoards);
  EventBus.on(BusEvents.UPDATE_BOARD_OVER, loadBoards);
  EventBus.on(BusEvents.DELETE_IMAGE, loadBoards);
  console.log('leftCount', leftCount.value);
});

onUnmounted(() => {
  if (workspace.value) workspace.value.removeEventListener('click', handleWorkspaceClickOutside);
  EventBus.off(BusEvents.ADD_BOARD_OVER, loadBoards);
  EventBus.off(BusEvents.UPDATE_BOARD_OVER, loadBoards);
  EventBus.off(BusEvents.DELETE_IMAGE, loadBoards);
});

const leftCount = computed(() => 10 - originBoardList.value.length);

const addBoardPopupShow = ref(false);
const updateBoardPopupShow = ref(false);

const searchText = ref('');
const workspace = ref(null);
const selectListShow = ref(false);
const selectTextObj = ref({ text: '由舊到新進行排列', value: 'asc' });
const router = useRouter();
const selectList = ref([
  { text: '由舊到新進行排列', value: 'asc' },
  { text: '由新到舊進行排列', value: 'desc' }
]);

const toggleSelectList = () => {
  selectListShow.value = !selectListShow.value;
};

const loadBoards = async () => {
  console.log('load!');
  searchText.value = '';
  const boardListRes = await boardApi.getBoards();
  if (boardListRes.success) {
    originBoardList.value = [...boardListRes.data];
    boardList.value = [...originBoardList.value];
  }
};

const originBoardList = ref([
  // {
  //   id: 1,
  //   boardTitle: 'boardName1',
  //   imageUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/test-da97e.appspot.com/o/boards%2Fbeach1.avif?alt=media&token=a243603e-d83f-4d17-b32a-841724dff78b'
  // }
]);

const boardList = ref([
  // {
  //   boardTitle: 'boardName1',
  //   imageUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/test-da97e.appspot.com/o/boards%2Fbeach1.avif?alt=media&token=a243603e-d83f-4d17-b32a-841724dff78b',
  //   boardImage: '',
  //   backgroundColor: ''
  // }
]);

// const getRandomColor = () => {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return `rgb(${r}, ${g}, ${b})`;
// };

const addBoardPopupClick = () => {
  if (leftCount.value <= 0) return;
  EventBus.emit(BusEvents.ADD_BOARD, { status: true });
};

const handleWorkspaceClickOutside = (e) => {
  if (!e.target.closest('.order') && selectListShow.value) {
    selectListShow.value = false;
  }
};

const selectListClick = (i) => {
  selectTextObj.value = selectList.value[i];
  sortBoardByCreatedAt();

  // boardList.value;
};

const searchTextInput = () => {
  // console.log('e', e);
  // console.log('boardList', boardList);
  console.log('searchText', searchText.value);

  if (searchText.value) {
    boardList.value = originBoardList.value.filter((eachBoard) =>
      eachBoard.boardTitle.includes(searchText.value)
    );
  } else {
    boardList.value = originBoardList.value;
  }
  sortBoardByCreatedAt();
};

const sortBoardByCreatedAt = () => {
  boardList.value = [...boardList.value].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return selectTextObj.value.value === 'asc' ? timeA - timeB : timeB - timeA;
  });
};

const goToBoard = (boardId) => {
  console.log('boardId', boardId);
  router.push({ name: 'board', params: { boardId: boardId } });
};

const updateBoardPopupClick = (board) => {
  console.log('board', board);
  console.log('workspace.vue開update board');
  EventBus.emit(BusEvents.UPDATE_BOARD, { status: true, data: board });
};
</script>

<style lang="scss"></style>
