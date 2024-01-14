import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import store from "@/store/store";
import debounce from 'v-debounce'
// import axios from 'axios';
// import VueCookie from 'vue-cookie'
import VueCookie from 'vue-cookie'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueGeolocation from 'vue-browser-geolocation'
import * as VueGoogleMaps from 'vue2-google-maps'
import googleMapsApiKey from '@/key'
import { faUtensils, faScrewdriverWrench, faPhoneFlip, faPersonBiking, faRightToBracket, faXmark, faUser, faLocationDot, faClock, faHeart, faStar} from '@fortawesome/free-solid-svg-icons'
library.add(faUtensils, faScrewdriverWrench, faPhoneFlip, faPersonBiking, faRightToBracket, faXmark, faUser, faLocationDot, faClock, faHeart, faStar);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueCookie)
Vue.use(debounce)
Vue.use(VueGeolocation)
import Geocoder from "@pderas/vue2-geocoder"

import { directive } from 'v-debounce'
Vue.use(Geocoder, {
  defaultCountryCode: 'PL', // e.g. 'CA'
  defaultLanguage:    'pl', // e.g. 'en'
  defaultMode:        'address', // or 'lat-lng'
  googleMapsApiKey:   googleMapsApiKey
})
export default {
  directives: {
    debounce: directive
  }
}

Vue.use(VueGoogleMaps, {
  load: {
    key: googleMapsApiKey
    // libraries: 'places', // This is required if you use the Autocomplete plugin
  },
  installComponents: true
})

router.push('/home')
// if (!VueCookie.get('token')) {
//   router.push('/home')
// }
// if (VueCookie.get('token')) {
//   router.push('/restaurants')
// }



new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
