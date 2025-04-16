<template>
  <div class="overlay" v-show="boardPopupShow"></div>
  <div class="add_board_popup" v-show="boardPopupShow">
    <div class="add_board_popup_in">
      <font-awesome-icon
        :icon="['fas', 'xmark']"
        class="fa-xmark"
        @click="openCloseBoardPopup({ status: false })"
      />
      <div class="title">{{ actionText }}看板</div>

      <div class="board_name">
        <div class="board_name_title">看板名稱</div>
        <div class="board_name_input_div">
          <input type="text" class="board_name_input" v-model.trim="boardNameInput" />
          <div class="wrong_word" v-show="nameWrongWordShow">請輸入看板名稱</div>
        </div>
      </div>

      <div class="background">
        <div class="background_title">背景</div>
        <div class="example_row">
          <div
            class="example_div"
            :class="{ focus: focusImageIndex === i }"
            v-for="(eachImg, i) in imageArrUrl"
            :key="i"
            :style="{
              backgroundImage: 'url(' + eachImg.imageUrl + ')'
            }"
            @click="chooseImg(eachImg.imageUrl), imageClick(i)"
          >
            <font-awesome-icon
              :icon="['fas', 'circle-xmark']"
              class="fa-solid fa-circle-xmark"
              v-show="eachImg.remark != 'example'"
              @click.stop="makeSureDeleteImg(eachImg)"
            />
          </div>
        </div>
        <div class="upload_place">
          <input
            type="file"
            ref="fileInput"
            name=""
            id=""
            class="input_file"
            @change="handleFileChange"
          />
          <div class="input_file_div" @click="triggerFileInput">選擇圖片</div>
          <div v-if="imagePreviewUrl" class="preview_div">
            <p class="preview_text">圖片預覽：</p>
            <div
              class="preview_img"
              :style="{
                backgroundImage: 'url(' + imagePreviewUrl + ')'
              }"
              :class="{ focus: focusImageIndex === -1 }"
              @click="imageClick(-1)"
            ></div>
          </div>
          <div class="wrong_word" v-show="imageWrongWordShow">請選擇背景</div>
        </div>
      </div>
      <div class="confirm_add_btn" @click="confirmBtnClick">{{ actionText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import imageCompression from 'browser-image-compression';
import EventBus from '@/utils/eventBus';
import BusEvents from '@/utils/busEvents';
import { storage } from '@/firebase'; // 你自己建立的 firebase.js 檔
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Swal from 'sweetalert2';
import pictureApi from '@/api/picture';
import boardApi from '@/api/board';

onMounted(async () => {
  EventBus.on(BusEvents.ADD_BOARD, openCloseBoardPopup);
  EventBus.on(BusEvents.UPDATE_BOARD, openCloseBoardPopup);
  EventBus.on(BusEvents.ADD_LOAD_PICTURE, getLoadPicture);
  loadPicture();
});

onUnmounted(() => {
  EventBus.off(BusEvents.ADD_BOARD, openCloseBoardPopup);
  EventBus.off(BusEvents.UPDATE_BOARD, openCloseBoardPopup);
  EventBus.off(BusEvents.ADD_LOAD_PICTURE, getLoadPicture);
});

const boardData = ref();

const focusImageIndex = ref();
const boardNameInput = ref('');
const imageArrUrl = ref([
  {
    id: 1,
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/test-da97e.appspot.com/o/boards%2Fbeach1.avif?alt=media&token=a243603e-d83f-4d17-b32a-841724dff78b',
    remark: 'example'
  }
]);

const mode = ref('add');
const actionText = computed(() => (mode.value === 'add' ? '建立' : '更新'));

// firebase
const file = ref(null);
const imagePreviewUrl = ref(null); // 本地預覽圖片網址
const imageUrl = ref(''); // Firebase 上傳成功後取得的 URL
const uploading = ref(false);

const nameWrongWordShow = ref(false);
const imageWrongWordShow = ref(false);
const boardPopupShow = ref(false);

const fileInput = ref(null);

// 圖片壓縮設定
const options = {
  maxSizeMB: 0.5, // 最大 0.5MB
  maxWidthOrHeight: 1024, // 最大寬高為 1024px
  useWebWorker: true
};

const openCloseBoardPopup = (params) => {
  boardPopupShow.value = params.status;
  if (params?.data) {
    boardData.value = params.data;
    mode.value = 'edit';
    boardNameInput.value = boardData.value?.boardTitle;
    focusImageIndex.value = imageArrUrl.value.findIndex((eachImgObj) => {
      return eachImgObj?.id === boardData.value?.pictureId;
    });
  } else {
    mode.value = 'add';
  }

  if (!boardPopupShow.value) {
    resetAddBoardPopup();
  }
};

const openCloseUpdateBoardPopup = (params) => {
  boardPopupShow.value = params.status;
  boardData.value = params.data;
  boardNameInput.value = boardData.value?.boardTitle;
  focusImageIndex.value = imageArrUrl.value.findIndex((eachImgObj) => {
    return eachImgObj?.id === boardData.value?.pictureId;
  });
  if (!boardPopupShow.value) {
    resetAddBoardPopup();
  }
};

// 處理選檔案 + 預覽圖片
const handleFileChange = async (e) => {
  const selected = e.target.files[0];
  focusImageIndex.value = null;
  if (!selected) return;

  // 釋放舊預覽圖 URL
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  file.value = selected;
  imagePreviewUrl.value = URL.createObjectURL(selected);
};

const triggerFileInput = () => {
  fileInput.value && fileInput.value.click();
};

const imageClick = (i) => {
  focusImageIndex.value = i;
};

const confirmBtnClick = async () => {
  console.log('focusImageIndex.value', focusImageIndex.value);

  let checkStatus = true;

  // 尚未輸入名稱
  if (!boardNameInput.value) {
    nameWrongWordShow.value = true;
    checkStatus = false;
  } else {
    nameWrongWordShow.value = false;
  }

  // 尚未選擇圖片
  if (focusImageIndex.value === null || focusImageIndex.value === undefined) {
    imageWrongWordShow.value = true;
    checkStatus = false;
  } else {
    imageWrongWordShow.value = false;
  }

  if (!checkStatus) return;

  let pictureId = 0;
  let newPictureUrl = null;

  if (focusImageIndex.value === -1) {
    if (!file.value) return;
    try {
      uploading.value = true;
      // ✅ 壓縮圖片
      const compressedFile = await imageCompression(file.value, options);

      // ✅ 檔案命名（用壓縮後的檔名）
      const filename = `boards/${Date.now()}_${compressedFile.name}`;
      const fileRef = storageRef(storage, filename);

      // ✅ 上傳到 Firebase
      await uploadBytes(fileRef, compressedFile);

      // ✅ 拿圖片網址
      newPictureUrl = await getDownloadURL(fileRef);
      imageUrl.value = newPictureUrl;

      pictureId = (await pictureApi.uploadPhoto(newPictureUrl))?.data;
      console.log('✅ 圖片上傳完成：', newPictureUrl);
    } catch (err) {
      console.error('❌ 上傳或壓縮錯誤：', err);
    } finally {
      uploading.value = false;
    }
  } else {
    pictureId = imageArrUrl.value[focusImageIndex.value].id;
  }

  // try {
  if (mode.value === 'add') {
    const res = await boardApi.createBoard(boardNameInput.value, pictureId);
    if (res.success) {
      openCloseBoardPopup({ status: false });
      EventBus.emit(BusEvents.ADD_BOARD_OVER);
      boardNameInput.value = '';
      focusImageIndex.value = null;
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: '看板新增成功',
        showConfirmButton: false,
        timer: 1500
      });
      loadPicture();
    } else {
      Swal.fire({
        icon: 'error',
        title: '註冊失敗',
        text: res.message,
        confirmButtonText: '確認'
      });
    }
  } else {
    const res = await boardApi.updateBoard(
      boardData.value?.id,
      boardNameInput.value,
      pictureId,
      newPictureUrl
    );
    if (res.success) {
      openCloseUpdateBoardPopup({ status: false });
      EventBus.emit(BusEvents.UPDATE_BOARD_OVER);
      boardNameInput.value = '';
      focusImageIndex.value = null;
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: '看板更新成功',
        showConfirmButton: false,
        timer: 1500
      });
      loadPicture();
    } else {
      Swal.fire({
        icon: 'error',
        title: '註冊失敗',
        text: res.message,
        confirmButtonText: '確認'
      });
    }
  }
};

// 確認要刪除圖片
const makeSureDeleteImg = async (img) => {
  console.log('img', img);
  Swal.fire({
    title: '你確定要刪除這張背景圖片嗎',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      deleteImageFromFirebase(img.imageUrl);
      const res = await pictureApi.deletePhoto(img.id);
      if (res.success) {
        Swal.fire({
          title: '已刪除!',
          icon: 'success'
        });
        EventBus.emit(BusEvents.DELETE_IMAGE);
        console.log('add觸發了delete image');
        loadPicture();

        focusImageIndex.value = 0;
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

const deleteImageFromFirebase = async (imageUrl) => {
  try {
    // 先把下載網址轉成圖片在 Firebase Storage 的路徑
    const decodedUrl = decodeURIComponent(imageUrl); // 確保沒有 %2F 等編碼問題
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;
    const path = decodedUrl.replace(baseUrl, '').split('?')[0]; // 擷取路徑部分

    const fileRef = storageRef(storage, path);

    const res = await deleteObject(fileRef);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '刪除失敗',
      text: res?.message,
      confirmButtonText: '確認'
    });
    console.error('❌ 刪除圖片失敗：', error);
  }
};

const chooseImg = (url) => {
  console.log('url', url);
};

const loadPicture = async () => {
  const getPicturesRes = await pictureApi.getPictures();
  if (getPicturesRes.success) {
    imageArrUrl.value = [...getPicturesRes.data];
    EventBus.emit(BusEvents.UPDATE_LOAD_PICTURE, imageArrUrl.value);
  }
};

const getLoadPicture = (data) => {
  imageArrUrl.value = [...data];
};

const resetAddBoardPopup = () => {
  boardNameInput.value = '';
  focusImageIndex.value = null;
  imagePreviewUrl.value = null;
  nameWrongWordShow.value = false;
  imageWrongWordShow.value = false;
  console.log('reset!');
};
</script>

<style lang="scss"></style>
