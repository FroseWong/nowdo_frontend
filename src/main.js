import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Vue3ColorPicker from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

library.add(fas, far);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store);
app.use(router);
app.use(Vue3ColorPicker);
app.mount('#app');
