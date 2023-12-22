import Vue from 'vue'
import Vuex from 'vuex'
// import Dayjs from 'vue-dayjs'
Vue.use(Vuex)
// Vue.use(Dayjs, {
//     lang: 'pl',
//     filters: {},
//     directives: {}
// })
const store = new Vuex.Store({
    state: {
        modal: {
            dishIngridientModal: false,
            dishId: 0,
            dishIngridientModalReturn: null,
            dish: null
        },
        info: {
            text: '',
            showing: false,
            timeout: 5000,
            color: 'info',
            loading: true
        },
        cart: []
    },
    mutations: {
        setDishIngridientModal(state, value) {
            state.modal.dishIngridientModal = value
        },
        setIdDish(state, id) {
            state.modal.idDish = id
        },
        setTextInfo(state, value) {
            state.info.text = value
        },
        openInfo(state, boolean) {
            state.info.showing = boolean
        }
    }
})
export default store