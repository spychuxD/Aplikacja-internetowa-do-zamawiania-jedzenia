<template>
  <v-card flat>
    <v-row class="flex-column-reverse flex-sm-column-reverse flex-md-row flex-lg-row">
      <v-col class="col-lg-3 col-md-3 col-sm-12">
        <v-card>
          <v-card-title class="secondary text-overline">
            <v-icon color="primary">mdi-monitor-cellphone-star</v-icon>
            <div class="ml-3">NAJCZĘŚCIEJ ZAMAWIANE</div>
          </v-card-title>
          <v-card-text class="px-8 py-4" v-if="restaurant.length > 0">
            <v-data-table
                class="text--secondary"
                dense
                disable-sort
                :headers="headers"
                :items="restaurant"
                :items-per-page="5"
                :no-data-text="'Brak danych. Widocznie nikt jeszcze nie zamówił z tej restauracji. Bądź pierwszy!'"
            ></v-data-table>
          </v-card-text>
        </v-card>
        <cart-component :cart="$store.state.cart" :add-item="addItem" :remove-item="removeItem" :delete-item="deleteItem"></cart-component>
      </v-col>
      <v-col class="col-lg-6 col-md-6 col-sm-12">
        <v-card :loading="loading">
          <v-card-title class="secondary text-overline">
            <v-icon color="primary">mdi-silverware</v-icon>
            <div class="ml-3">MENU</div>
          </v-card-title>
          <v-card-text v-if="restaurantCategoriesWithDishes">
            <v-list>
              <v-list-group v-for="(restaurantCategory, restaurantCategoryName) in restaurantCategoriesWithDishes" :key="restaurantCategoryName">
                <template v-slot:activator>
                  <v-list-item-title>
                    <div class="text-overline">{{restaurantCategoryName}}</div>
                    <div class="text-caption text--secondary">{{restaurantCategory.categoryDescription}}</div>
                  </v-list-item-title>
                </template>
                <v-list-item v-for="(dish, index) in restaurantCategory.categoryDishes" :key="index" @click="addItem(dish)">
                  <v-list-item-avatar tile>
                    <v-img src="https://i.ibb.co/f1Qr5B2/logo-transparent.png" @load="imageLoadedFn">
                      <v-progress-circular v-if="!imageLoaded" indeterminate color="primary"></v-progress-circular>
                    </v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-overline">
                      {{dish.dishName}}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{dish.dishDescription}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-row>
                      <div class="mr-3 mt-1" style="font-weight: bold">
                        {{dish.price}} zł
                      </div>
                      <v-btn icon color="primary">
                        <v-icon>mdi-cart-arrow-down</v-icon>
                      </v-btn>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-lg-3 col-md-3 col-sm-12">
        <v-card>
          <v-img :src="require('@/assets/restaurants/' + restaurant.fileName)" @load="imageLoadedFn" :aspect-ratio="16/9" max-width="600" class="align-end mx-auto">
            <v-progress-circular v-if="!imageLoaded" indeterminate color="primary"></v-progress-circular>
            <v-card-title class="secondary text-center">
              <v-col>
                <div class="text-h6 text-uppercase ">{{restaurant.name}}</div>
                <div class="text-subtitle-2 text-truncate">{{restaurant.description}}</div>
              </v-col>
            </v-card-title>
          </v-img>
        </v-card>
        <v-card class="mt-3">
          <google-maps :height="300" :addresses="restaurantsAddress"></google-maps>
        </v-card>
      </v-col>
    </v-row>
    <cart-button-with-dialog :cart="$store.state.cart" :add-item="addItem" :remove-item="removeItem" :delete-item="deleteItem"></cart-button-with-dialog>
    <dish-ingridient-modal></dish-ingridient-modal>
  </v-card>
</template>

<script>
import {getListItemsOrItem} from "@/functions/common";
import dishIngridientModal from '../../dish/dishIngridientModal.vue'
import cartButtonWithDialog from '../../cart/cartButtonWithDialog.vue'
import cartComponent from '../../cart/cart.vue'
import googleMaps from '../../GoogleMaps.vue'

  export default {
    name: 'restaurantMenu',
    components: {
      dishIngridientModal, cartButtonWithDialog, cartComponent, googleMaps
    },
    data() {
      return {
        dishId: 0,
        dishIngridientModal: false,
        idRestaurant: null,
        loading: true,
        restaurant: {},
        search: null,
        page: 1,
        headers: [
          { text: '', value: 'id' },
          { text: 'Danie', value: 'name' },
          { text: 'Cena', value: 'street' }
        ],
        imageLoaded: false,
        restaurantCategoriesWithDishes: [],
        restaurantsAddress: [{address_line_1: 'Mazurska' + ' ' + '66', address_line_2: '', city: 'Kielce', zip_code: '25-345'}]
      }
    },
    created() {
      this.idRestaurant = this.$route.params.id
      this.fetchData()
    },
    methods: {
      async fetchData() {
        this.loading = true
        this.restaurantCategoriesWithDishes = await getListItemsOrItem('dishesByRestaurant', this.idRestaurant, this.$cookie.get('token'))
        const response = await getListItemsOrItem('restaurant', this.idRestaurant, this.$cookie.get('token'))
        this.restaurant = response[0]
        // await getImg('restaurant', this.restaurant.fileName, this.$cookie.get('token'))
        this.loading = false
      },
      imageLoadedFn() {
        this.imageLoaded = true
      },
      addItem(dish) {
        dish.price = parseFloat(dish.price);
        const existingItem = this.$store.state.cart.find(item => item.dishId === dish.dishId)

        if (existingItem) {
          existingItem.count++
        } else {
          this.$store.state.cart.push({
            dishId: dish.dishId,
            dishName: dish.dishName,
            dishDescription: dish.dishDescription,
            price: dish.price,
            count: 1,
            ingridients: {}
          })
          this.$store.state.modal.dishIngridientModal = true
          this.$store.state.modal.dishId = dish.dishId
        }
      },
      removeItem(dish) {
        const existingItem = this.$store.state.cart.find(item => item.dishId === dish.dishId)
        if (existingItem) {
          if (existingItem.count > 1) {
            existingItem.count--
          }
        }
      },
      deleteItem(dish) {
        const existingItemIndex = this.$store.state.cart.findIndex(item => item.dishId === dish.dishId)
        if (existingItemIndex !== -1) {
          this.$store.state.cart.splice(existingItemIndex, 1);
        }
      },
    }
  }

</script>
