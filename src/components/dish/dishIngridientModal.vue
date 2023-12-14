<template>
  <v-dialog persistent v-model="dishIngridientModal" :max-width="$vuetify.breakpoint.thresholds.md">
    <v-card :loading="loading">
      <v-card-title class="secondary text-overline">
        <v-icon color="primary">mdi-silverware</v-icon>
        <div class="ml-3">KOSZYK</div>
      </v-card-title>
      <v-card-text>
<!--        <pre>{{selected}}</pre>-->
          <v-select
              v-for="(ingridientCategory, index) in dishIngridients"
              :key="index"
              v-model="selected[ingridientCategory.ingridientCategoryName]"
              :label="ingridientCategory.ingridientCategoryName"
              :multiple="ingridientCategory.isMultiOption"
              :items="prepareItems(ingridientCategory.ingridients)"
          ></v-select>
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
      loading: true,
      dishIngridientModal: false,
      dishId: 0,
      dishIngridients: [],
      selected: {},
      selectedValues: {},
    }
  },
  watch: {
    isDishIngridientModalVisible(newVal) {
      if (newVal) {
        this.showModal()
      } else {
        this.hideModal()
      }
    }
  },
  computed: {
    isDishIngridientModalVisible() {
      return this.$store.state.modal.dishIngridientModal;
    },
  },
  methods: {
    prepareItems(ingridients) {
      let items = []
      ingridients.forEach(ingridient => {
        items.push({
          value: {
            ingridientId: ingridient.ingridientId,
            ingridientName: ingridient.ingridientName,
            ingridientDescription: ingridient.ingridientDescription,
            price: ingridient.price
          },
          text: ingridient.ingridientName
        })
      })
      return items
    },
    async fetchData() {
      this.loading = true
      this.dishIngridients = await getListItemsOrItem('dishingridients/dish', this.dishId)
      this.loading = false
    },
    showModal () {
      this.dishId = this.$store.state.modal.dishId
      this.$store.state.modal.dishIngridientModalReturn = true
      this.fetchData().then(() => {
        this.dishIngridientModal = true;
        this.$store.state.modal.dishIngridientModal = true;

        let cart = localStorage.getItem('cart');
        this.$store.state.cart = JSON.parse(cart);
        let dish = this.$store.state.cart.find(item => item.dishId === this.dishId);

        if (dish && dish.ingridients) {
          this.selected = dish.ingridients
        } else {
          console.log('error', this.selected)
        }
      });
    },
    hideModal () {
      this.$store.state.modal.dishIngridientModal = false
      this.$store.state.modal.dishIngridientModalReturn = false
      this.$store.state.modal.dishId = 0
      this.dishId = 0
      this.dishIngridientModal = false
    },
    addIngridients() {
      let cart = localStorage.getItem('cart');
      if (cart) {
        this.$store.state.cart = JSON.parse(cart);
        let index = this.$store.state.cart.findIndex(item => item.dishId === this.dishId);
        if (index !== -1) {
          let updatedDish = {
            ...this.$store.state.cart[index],
            ingridients: {...this.selected}
          };

          this.$store.state.cart.splice(index, 1, updatedDish);
          localStorage.setItem('cart', JSON.stringify(this.$store.state.cart, null, 2));
        }
      }
      this.hideModal();
    },
    deleteItem(dishId) {
      const existingItemIndex = this.$store.state.cart.findIndex(item => item.dishId === dishId)
      if (existingItemIndex !== -1) {
        this.$store.state.cart.splice(existingItemIndex, 1);
      }
    },
  },
}

</script>
