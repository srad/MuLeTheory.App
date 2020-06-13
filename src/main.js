require("dotenv")
  .config();

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {
  faDrum,
  faMusic,
  faHeadphones,
  faPlay,
  faVolumeUp,
  faVolumeDown,
  faHeart,
  faAward,
  faStar,
  faCheck,
  faRobot,
  faStop,
  faTimes,
  faMedal,
  faLaughBeam,
  faHeartBroken,
  faTrophy,
  faStopwatch,
  faDice,
  faQuestion,
  faSkullCrossbones,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

Vue.use(BootstrapVue);

library.add(faDrum, faMusic, faStop, faHeadphones, faPlay, faVolumeUp, faVolumeDown, faVolumeMute, faHeart, faAward, faStar, faCheck, faRobot, faTimes, faMedal, faLaughBeam, faHeartBroken, faTrophy, faStopwatch, faDice, faQuestion, faSkullCrossbones);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$log = function (...args) {
  console.log(...args);
};

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
