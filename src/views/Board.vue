<template>
  <div class="page_loading" v-show="loadingShow"></div>
  <div class="board" ref="board">
    <div class="overlay" v-show="cardDetailShow"></div>

    <!-- card detail 以下 -->
    <div class="card_detail" v-show="cardDetailShow" ref="cardDetail">
      <div class="card_title_row">
        <div class="card_complete" @click="cardCompleteClick(focusCard)">
          <font-awesome-icon
            :icon="['far', 'circle']"
            class="fa-regular fa-circle"
            v-show="!focusCard.isCompleted"
          />
          <font-awesome-icon
            :icon="['fas', 'circle-check']"
            class="fa-solid fa-circle-check"
            v-show="focusCard.isCompleted"
          />
        </div>
        <div
          class="card_title"
          v-show="!focusCardTitleStatus"
          @click="focusCardTitleStatusToggle(true)"
        >
          {{ focusCard.cardTitle }}
        </div>
        <input
          type="text"
          class="card_title_input"
          v-model.trim="cardTitleTemp"
          v-show="focusCardTitleStatus"
        />
        <font-awesome-icon
          :icon="['fas', 'xmark']"
          class="fa-solid fa-xmark"
          @click="closeCardDetail"
        />
      </div>
      <div class="description_row">
        <div class="description_title">描述</div>
        <div
          class="description_text"
          v-show="!descriptionTextareaShow"
          @click="changeDescriptionTextareaShow(true)"
        >
          {{ focusCard.cardDesc ? focusCard.cardDesc : '新增更詳細的描述' }}
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="description_textarea"
          v-model.trim="cardDescTemp"
          v-show="descriptionTextareaShow"
          ref="descriptionTextarea"
        ></textarea>
        <div class="save_check_row" v-show="descriptionTextareaShow">
          <div class="btn save_btn" @click="cardDescSave">儲存</div>
          <div class="btn cancel_btn" @click="changeDescriptionTextareaShow(false)">取消</div>
        </div>
      </div>
      <div class="delete_btn" @click="deleteCard(focusCard)">刪除卡片</div>
    </div>
    <!-- card detail 以上 -->

    <Header />
    <!-- <AddBoardPopup />
    <UpdateBoardPopup /> -->
    <BoardPopup />

    <!-- <BoardPopup :show="updateBoardPopupShow" mode="edit" @close="updateBoardPopupShow = false" /> -->
    <div class="mid_place">
      <LeftSlide :boardList="originBoardList" :boardId="focusIndex" />
      <div
        class="board_right"
        :style="{
          backgroundImage: `url(${backgroundImageUrl})`
        }"
      >
        <div class="board_title_row">
          <div class="title">{{ boardTitle }}</div>
          <div class="extend_btn" @click="extendListShowToggle">
            <font-awesome-icon :icon="['fas', 'ellipsis']" class="fa-solid fa-ellipsis" />
            <div class="extend_list" v-show="extendListShow">
              <div class="item" @click="updateBoardPopupClick">更新看板</div>
              <div class="item" @click="deleteBoardCheck">刪除看板</div>
            </div>
          </div>
        </div>

        <div class="board_main_all">
          <Container
            orientation="horizontal"
            @drop="(dropResult) => onDropList(dropResult, eachList)"
          >
            <Draggable
              v-for="(eachList, i) in listArray"
              :key="eachList.id"
              v-show="eachList.listTitle"
            >
              <div class="each_list">
                <div class="list_title_row">
                  <div class="title">{{ eachList.listTitle }}</div>
                  <div class="action_btn_place">
                    <div class="action_btn">
                      <font-awesome-icon
                        :icon="['fas', 'ellipsis']"
                        class="fa-solid fa-ellipsis"
                        @click="actionListToggle(eachList)"
                      />

                      <div class="action_list" v-show="eachList.actionListShow">
                        <div class="each_action" @click="deleteList(eachList)">刪除列表</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card_list">
                  <Container
                    orientation="vertical"
                    @drop="(dropResult) => onDropCard(dropResult, eachList)"
                  >
                    <Draggable v-for="(eachCard, j) in eachList.cards">
                      <div class="each_card" @click="openCardDetail(eachCard)" :key="j">
                        <div class="card_complete" @click.stop="cardCompleteClick(eachCard)">
                          <font-awesome-icon
                            :icon="['far', 'circle']"
                            class="fa-regular fa-circle"
                            v-show="!eachCard.isCompleted"
                          />
                          <font-awesome-icon
                            :icon="['fas', 'circle-check']"
                            class="fa-solid fa-circle-check"
                            v-show="eachCard.isCompleted"
                          />
                        </div>
                        <div class="card_title">{{ eachCard.cardTitle }}</div>
                      </div>
                    </Draggable>
                  </Container>
                </div>
                <div class="add_card" v-show="eachList.addingCard">
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    class="add_card_textarea"
                    v-model.trim="cardTextAreaInputValue"
                    ref="textAreaInput"
                  ></textarea>
                </div>
                <div class="add_card_btn">
                  <div class="add_btn_row" v-show="!eachList.addingCard" @click="addBtnClick(i)">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-solid fa-plus" />
                    <div class="add_btn_title">新增卡片</div>
                  </div>
                  <div class="confirm_add_btn_row" v-show="eachList.addingCard">
                    <div class="confirm_add_btn" @click="createNewCard(eachList)">新增</div>
                    <font-awesome-icon
                      :icon="['fas', 'xmark']"
                      class="fa-solid fa-xmark"
                      @click="cancelAddBtn(i)"
                    />
                  </div>
                </div>
              </div>
            </Draggable>
          </Container>
          <div class="add_another_list">
            <div class="add_card" v-show="addingList">
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                class="add_card_textarea"
                v-model.trim="listTextAreaInputValue"
                ref="textAreaInput"
              ></textarea>
            </div>
            <div class="add_btn_row" v-show="!addingList" @click="addingListToggle(true)">
              <font-awesome-icon :icon="['fas', 'plus']" class="fa-solid fa-plus" />
              <div class="add_btn_title">新增列表</div>
            </div>
            <div class="confirm_add_btn_row" v-show="addingList">
              <div class="confirm_add_btn" @click="createNewList">新增</div>
              <font-awesome-icon
                :icon="['fas', 'xmark']"
                class="fa-solid fa-xmark"
                @click="addingListToggle(false)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import Header from '@/components/Header.vue';
import LeftSlide from '@/components/LeftSlide.vue';
// import AddBoardPopup from '@/components/AddBoardPopup.vue';
// import UpdateBoardPopup from '@/components/UpdateBoardPopup.vue';
import BoardPopup from '@/components/BoardPopup.vue';
import { useRoute } from 'vue-router';
import { Container, Draggable } from 'vue3-smooth-dnd';
import boardApi from '@/api/board';
import listApi from '@/api/list';
import cardApi from '@/api/card';
import EventBus from '@/utils/eventBus';
import BusEvents from '@/utils/busEvents';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { faL } from '@fortawesome/free-solid-svg-icons';

onMounted(async () => {
  boardId.value = route.params.boardId;

  if (board.value) board.value.addEventListener('click', handleBoardClickOutside);
  if (cardDetail.value) cardDetail.value.addEventListener('click', handleCardDetailClickOutSide);

  boardEvents.value.forEach((event) => {
    EventBus.on(event, getLeftBoards);
    EventBus.on(event, loadBoardDetail);
  });
  await getLeftBoards();
  await loadBoardDetail(boardId.value);
});

onUnmounted(() => {
  if (board.value) board.value.removeEventListener('click', handleBoardClickOutside);
  if (cardDetail.value) cardDetail.value.removeEventListener('click', handleCardDetailClickOutSide);

  boardEvents.value.forEach((event) => {
    EventBus.off(event, getLeftBoards);
    EventBus.off(event, loadBoardDetail);
  });
});
const route = useRoute();
const router = useRouter();

const loadingShow = ref(false);

const boardEvents = ref([
  BusEvents.ADD_BOARD_OVER,
  BusEvents.UPDATE_BOARD_OVER,
  BusEvents.DELETE_IMAGE
]);

const isCreatingList = ref(false);
const isCreatingCard = ref(false);

const boardId = ref('');
const pictureId = ref(-1);
const textAreaInput = ref([]);
const cardDetailShow = ref(false);
const descriptionTextareaShow = ref(false);
const descriptionTextarea = ref(null);
const board = ref(null);
const lastActionList = ref({});
const extendListShow = ref(false);
const focusCard = ref({
  cardTitle: '',
  cardDesc: '',
  isCompleted: false
});

const focusCardTitleStatus = ref(false); // focusCard title 更新中

watch(
  () => route.params.boardId,
  async (newBoardId) => {
    boardId.value = newBoardId;
    loadingShow.value = true;
    await loadBoardDetail(newBoardId); // 👉 重新抓資料
    loadingShow.value = false;
  }
);

const backgroundImageUrl = ref(''); //圖片網址
const boardTitle = ref(''); // title
const focusIndex = ref();

const originBoardList = ref([]);

const cardTextAreaInputValue = ref('');
const listTextAreaInputValue = ref('');
const addingList = ref(false);
const cardDetail = ref(null); // cardDetail dom

const cardTitleTemp = ref(''); // 暫存的card title
const cardDescTemp = ref(''); // 暫存card desc

const listArray = ref([
  {
    listTitle: '',
    cards: [
      {
        cardTitle: '',
        cardDesc: '',
        isCompleted: false
      }
    ],
    addingCard: false,
    actionListShow: false
  }
]);

const getLeftBoards = async () => {
  const boardListRes = await boardApi.getBoards();
  if (boardListRes.success) {
    originBoardList.value = [...boardListRes.data];
  }
};

const openCardDetail = (card) => {
  // console.log('openCardDetail');
  cardDetailShow.value = true;
  focusCard.value = card;
  descriptionTextareaShow.value = false;
};

const loadBoardDetail = async () => {
  // try {
  if (route.name === 'workspace') return;
  boardId.value = route.params.boardId;
  const res = await boardApi.getBoardDetail(boardId.value); // boardId 實際用 route 也可以
  // console.log('res', res);
  console.log('route.name', route.name);
  if (res.success) {
    boardTitle.value = res.data.boardTitle;
    listArray.value = [...res.data.lists];
    backgroundImageUrl.value = res.data.imageUrl;
    focusIndex.value = res.data.id;
    pictureId.value = res.data.pictureId;
    // console.log('focusIndex', focusIndex.value);
  } else {
    console.log('res', res.message);
    router.push({ name: 'workspace' });
  }
};

const closeCardDetail = () => {
  cardDetailShow.value = false;
};

const cancelAddBtn = (i) => {
  cardTextAreaInputValue.value = '';
  listArray.value[i].addingCard = false;
};

const addBtnClick = (i) => {
  cardTextAreaInputValue.value = '';
  listArray.value.forEach((eachList) => (eachList.addingCard = false));

  listArray.value[i].addingCard = true;
  if (textAreaInput.value) {
    setTimeout(() => {
      textAreaInput.value[i].focus();
    }, 100);
  }
  // console.log('textAreaInput', textAreaInput.value);
};

const cardCompleteClick = (card) => {
  // console.log('cardCompleteClick');
  card.isCompleted = !card.isCompleted;
  cardUpdate(card);
};

const changeDescriptionTextareaShow = (status) => {
  descriptionTextareaShow.value = status;
  if (status) {
    cardDescTemp.value = focusCard.value.cardDesc;
    setTimeout(() => {
      descriptionTextarea.value.focus();
    }, 100);
  } else {
    cardDescTemp.value = '';
  }
};

const extendListShowToggle = () => {
  extendListShow.value = !extendListShow.value;
};

const actionListToggle = (list) => {
  lastActionList.value = list;
  const status = list.actionListShow;
  listArray.value.forEach((eachList) => (eachList.actionListShow = false));

  if (!status) list.actionListShow = !list.actionListShow;
};

const handleBoardClickOutside = (e) => {
  if (!e.target.closest('.extend_btn') && extendListShow.value) {
    extendListShow.value = false;
  }

  if (!e.target.closest('.action_btn') && lastActionList.value.actionListShow) {
    lastActionList.value.actionListShow = false;
  }
};

// drag function
const onDropCard = async (dropResult, list) => {
  // list.cards = applyDrag(list.cards, dropResult);

  const newCardList = applyDrag(list.cards, dropResult);

  if (!isOrderChanged(list.cards, newCardList)) {
    // console.log('順序未改變，不發出 API');
    return;
  }

  list.cards = newCardList;

  const cardData = list.cards.map((eachCard, i) => {
    const obj = {
      id: eachCard.id,
      listId: list.id,
      order: i
    };
    return obj;
  });

  // console.log('cardData', cardData);

  const res = cardApi.updateCardOrder(cardData);
  if (res.success) {
    // 成功
  } else {
    // 失敗
  }
  // console.log('list.cards', list);

  // cardApi
};

const onDropList = async (dragResult, list) => {
  const newList = applyDrag(listArray.value, dragResult);

  if (!isOrderChanged(listArray.value, newList)) {
    // console.log('順序未改變，不發出 API');
    return;
  }

  listArray.value = newList;

  const listData = listArray.value.map((eachList, i) => {
    const obj = {
      id: eachList.id,
      order: i
    };
    return obj;
  });

  const res = await listApi.updateListOrder(listData);
  if (res.success) {
    // 成功
  } else {
    //失敗
  }
};

const isOrderChanged = (before, after) => {
  if (before.length !== after.length) return true;
  for (let i = 0; i < before.length; i++) {
    if (before[i].id !== after[i].id) return true;
  }
  return false;
};

// drag logic
const applyDrag = (arr, dragResult) => {
  if (dragResult) {
    const { removedIndex, addedIndex, payload } = dragResult;

    if (removedIndex === null && addedIndex === null) return arr;
    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
    return result;
  }
};

const addingListToggle = (status) => {
  addingList.value = status;
  if (!status) {
    listTextAreaInputValue.value = '';
  }
};

const createNewList = async () => {
  if (isCreatingList.value) return;
  if (listTextAreaInputValue.value) {
    isCreatingList.value = true;
    const obj = {
      boardId: boardId.value,
      listTitle: listTextAreaInputValue.value
    };

    await listApi.createNewList(obj);
    await loadBoardDetail(boardId.value);

    addingListToggle(false);
    isCreatingList.value = false;
  }
};

const deleteList = async (list) => {
  list.actionListShow = false;
  Swal.fire({
    title: '確定要刪除列表?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '刪除',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await listApi.deleteList(list.id);
      if (res.success) {
        await loadBoardDetail(boardId.value);
        Swal.fire({
          title: '已刪除!',
          icon: 'success'
        });
      }
    }
  });
};

const createNewCard = async (list) => {
  if (isCreatingCard.value) return;
  if (cardTextAreaInputValue.value) {
    isCreatingCard.value = true;
    const obj = {
      cardTitle: cardTextAreaInputValue.value,
      listId: list.id
    };

    await cardApi.createNewCard(obj);
    await loadBoardDetail(boardId.value);
    isCreatingCard.value = false;
  }
};

const deleteCard = async (focusCard) => {
  Swal.fire({
    title: '確定要刪除卡片?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '刪除',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await cardApi.deleteCard(focusCard.id);
      if (res.success) {
        await loadBoardDetail(boardId.value);
        cardDetailShow.value = false;
        Swal.fire({
          title: '已刪除!',
          icon: 'success'
        });
      }
    }
  });
};

const focusCardTitleStatusToggle = (status) => {
  // console.log('status', status);
  focusCardTitleStatus.value = status;
  if (status) {
    cardTitleTemp.value = focusCard.value.cardTitle;
  } else {
    // console.log('cardTitleTemp.value', cardTitleTemp.value);
    // console.log('focusCard.value.cardTitle', focusCard.value.cardTitle);
    if (cardTitleTemp.value != focusCard.value.cardTitle) {
      focusCard.value.cardTitle = cardTitleTemp.value;
      cardUpdate();
    }
  }
};

const handleCardDetailClickOutSide = (e) => {
  if (e.target.closest('.card_title')) return;

  if (!e.target.closest('.card_title_input') && focusCardTitleStatus.value) {
    focusCardTitleStatusToggle(false);
  }
};

const cardUpdate = async (card = focusCard.value) => {
  const obj = {
    ...card
  };
  const res = await cardApi.updateCard(obj);
  if (res.success) {
    // 成功
  } else {
    // 失敗
  }
};
const cardDescSave = () => {
  if (focusCard.value.cardDesc != cardDescTemp.value) {
    focusCard.value.cardDesc = cardDescTemp.value;
    cardUpdate();
  }
  descriptionTextareaShow.value = false;
};

const deleteBoardCheck = async () => {
  Swal.fire({
    title: '確定要刪除看板?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '刪除',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await boardApi.deleteBoard(boardId.value);
      if (res.success) {
        Swal.fire({
          title: '已刪除!',
          icon: 'success'
        });
        setTimeout(() => {
          router.push({ name: 'workspace' });
        }, 500);
      } else {
        Swal.fire({
          icon: 'error',
          title: '刪除失敗',
          text: res?.message,
          confirmButtonText: '確認'
        });
      }
    }
  });
};

const updateBoardPopupClick = () => {
  // boardTitle.value = data.boardTitle;
  // listArray.value = [...data.lists];
  // backgroundImageUrl.value = data.imageUrl;
  // focusIndex.value = data.id;
  const obj = {
    boardTitle: boardTitle.value,
    id: boardId.value,
    imageUrl: backgroundImageUrl.value,
    pictureId: pictureId.value
  };
  console.log('board.vue開update board');
  EventBus.emit(BusEvents.UPDATE_BOARD, { status: true, data: obj });
};
</script>

<style lang="scss"></style>
