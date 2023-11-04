import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import store from "@/store/store";
// import axios from 'axios';
// import VueCookie from 'vue-cookie'
import VueCookie from 'vue-cookie'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUtensils, faScrewdriverWrench, faPhoneFlip, faPersonBiking, faRightToBracket, faXmark, faUser, faLocationDot, faClock} from '@fortawesome/free-solid-svg-icons'
library.add(faUtensils, faScrewdriverWrench, faPhoneFlip, faPersonBiking, faRightToBracket, faXmark, faUser, faLocationDot, faClock);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueCookie)

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
