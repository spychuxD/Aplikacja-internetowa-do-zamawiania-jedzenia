<template>
  <v-dialog persistent v-model="dishIngridientModal" :max-width="$vuetify.breakpoint.thresholds.md">
    <v-card>
      <v-card-title class="secondary text-overline">
        <v-icon color="primary">mdi-silverware</v-icon>
        <div class="ml-3">KOSZYK</div>
      </v-card-title>
        <v-card-text>
          <v-radio-group
              v-for="(ingridientCategory, ingridientCategoryName) in dishIngridients"
              :multiple="ingridientCategory.isMultiOption === 1"
              v-model="selected[ingridientCategoryName]"
              :label="ingridientCategory.name"
              :key="ingridientCategoryName"
          >
            <v-radio v-if="ingridientCategory.isMultiOption === 0" label="Brak" :value="-1"></v-radio>
            <v-radio
                v-for="(ingridient, index) in ingridientCategory.ingridients"
                :key="index"
                :value="ingridient.ingridientName"
                :label="ingridient.ingridientName + ' (' + ingridient.price + ' zł)'"
            ></v-radio>
            <v-divider></v-divider>
          </v-radio-group>
        </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="hideModal()">
          <v-icon class="mr-1">mdi-close</v-icon>
          Zamknij
        </v-btn>
        <v-btn text @click="addIngridients()">
          <v-icon class="mr-1">mdi-cart-arrow-down</v-icon>
          Zapisz
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {getListItemsOrItem} from "@/functions/common";

export default {
  name: 'dishIngridientModal',
  data() {
    return {
      dishIngridientModal: false,
      dishId: 0,
      dishIngridients: null,
      selected: {}
    }
  },
  watch: {
    isDishIngridientModalVisible(newVal) {
      if (newVal) {
        this.showModal();
      } else {
        this.hideModal();
      }
    },
    checkIngridients(newVal) {
      if (newVal) {
        console.log(newVal.ingridients)
        this.selected = newVal.ingridients
      }
    }
  },
  computed: {
    isDishIngridientModalVisible() {
      return this.$store.state.modal.dishIngridientModal;
    },
    checkIngridients() {
      const existingItem = this.$store.state.cart.find(item => item.dishId === this.$store.state.modal.dishId)
      return existingItem
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.dishIngridients = await getListItemsOrItem('dishingridients', this.dishId)
      this.loading = false
    },
    showModal () {
      this.dishId = this.$store.state.modal.dishId
      this.$store.state.modal.dishIngridientModalReturn = true
      this.dishIngridientModal = true
      this.$store.state.modal.dishIngridientModal = true
      this.fetchData()
    },
    hideModal () {
      this.$store.state.modal.dishIngridientModal = false
      this.$store.state.modal.dishIngridientModalReturn = false
      this.$store.state.modal.dishId = 0
      this.dishId = 0
      // this.selected = {}
      this.dishIngridientModal = false
    },
    addIngridients() {
      const existingItem = this.$store.state.cart.find(item => item.dishId === this.dishId)
      existingItem.ingridients = this.selected
      const existingItemIndex = this.$store.state.cart.findIndex(item => item.dishId === this.dishId)
      if (existingItemIndex !== -1) {
        this.$store.state.cart.splice(existingItemIndex, 1);
      }
      this.$store.state.cart.push(existingItem)
      this.hideModal()
    },
    deleteItem(dishId) {
      const existingItemIndex = this.$store.state.cart.findIndex(item => item.dishId === dishId)
      if (existingItemIndex !== -1) {
        this.$store.state.cart.splice(existingItemIndex, 1);
      }
    },
  },
  destroyed() {
    this.$store.state.modal.dishIngridientModal = false
    this.$store.state.modal.dishId = 0
    this.dishId = 0
    this.dishIngridientModal = false
  }
}

</script>
