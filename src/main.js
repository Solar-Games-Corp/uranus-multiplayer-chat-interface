import Vue from 'vue';
import UranusMultiplayerChat from './UranusMultiplayerChat.vue';

import drag from 'v-drag/src/index';

Vue.config.productionTip = false;
Vue.use(drag);

new Vue({
  render: (h) => h(UranusMultiplayerChat),
}).$mount('#uranus-game-chat');