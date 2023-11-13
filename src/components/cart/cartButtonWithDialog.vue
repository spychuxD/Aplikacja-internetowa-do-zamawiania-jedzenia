<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :disabled="cart.length === 0" rounded style="position: fixed; bottom: 100px; z-index: 10; padding: 24px;" @click="dialog = true">
        <div>{{totalPrice.toFixed(2)}}zł</div>
        <v-icon class="ml-3" size="30" color="primary">mdi-cart</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" :max-width="$vuetify.breakpoint.thresholds.md">
        <v-card v-if="cart.length > 0">
          <v-card-title class="secondary text-overline">
            <v-icon color="primary">mdi-cart</v-icon>
            <div class="ml-3">KOSZYK</div>
          </v-card-title>
          <v-card-text v-if="cart.length > 0" class="py-4">
            <template v-for="(item, index) in cart">
              <v-tooltip left :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item v-bind="attrs" v-on="on">
                    <v-list-item-avatar tile>
                      <v-img src="https://i.ibb.co/f1Qr5B2/logo-transparent.png" @load="imageLoadedFn">
                        <v-progress-circular v-if="!imageLoaded" indeterminate color="primary"></v-progress-circular>
                      </v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="text-overline">
                        {{item.dishName}}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-caption">
                        {{item.dishDescription}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-row dense>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn v-bind="attrs" v-on="on" :disabled="item.count === 1" icon color="accent" @click="removeItem(item)">
                                <v-icon color="accent">mdi-minus-box</v-icon>
                              </v-btn>
                            </template>
                            <span>Usuń danie</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon v-bind="attrs" v-on="on">
                                {{item.count}}
                              </v-btn>
                            </template>
                            <span>Ilość</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn v-bind="attrs" v-on="on" icon color="accent" @click="addItem(item)">
                                <v-icon color="accent">mdi-plus-box</v-icon>
                              </v-btn>
                            </template>
                            <span>Dodaj danie</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn v-bind="attrs" v-on="on" icon color="error" @click="deleteItem(item)">
                                <v-icon color="error">mdi-delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Usuń z listy</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn v-bind="attrs" v-on="on" icon color="primary" @click="showDishIngridientModal(item)">
                                <v-icon color="primary">mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                            <span>Edytuj danie</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-list-item-action>
                  </v-list-item>
                </template>
                <span>Cena: {{ item.price.toFixed(2) }} zł</span>
              </v-tooltip>
            </template>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <span>KOSZYK</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'cartComponent',
    data() {
      return {
        imageLoaded: false,
        headers: [
          {text: 'Cena', value: 'price'},
          {text: 'Danie', value: 'dishName'},
          {text: 'Ilość', value: 'count'}
        ],
        totalPrice: 0,
        dialog: false
      }
    },
    props: {
      cart: {
        type: Array,
        required: true
      },
      addItem: {
        type: Function,
        required: true
      },
      removeItem: {
        type: Function,
        required: true
      },
      deleteItem: {
        type: Function,
        required: true
      }
    },
    watch: {
      cart: {
        handler(newCart) {
          this.calculateTotalPrice(newCart)
          if (newCart.length === 0) {
            this.dialog = false
          }
        },
        deep: true
      }
    },
    methods: {
      calculateTotalPrice(newCart) {
        let totalPrice = 0;
        for (const item of newCart) {
          if (item.price && item.count) {
            totalPrice += item.price * item.count
          }
        }
        this.totalPrice = totalPrice
      },
      imageLoadedFn() {
        this.imageLoaded = true
      },
      showDishIngridientModal(dish) {
        this.$store.state.modal.dishIngridientModal = true
        this.$store.state.modal.dishId = dish.dishId
      }
    }
  }

</script>
