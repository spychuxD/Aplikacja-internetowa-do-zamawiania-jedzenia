<template>
  <v-card class="mt-3">
    <v-card-title class="secondary text-overline">
      <v-icon color="primary">mdi-cart</v-icon>
      <div class="ml-3">KOSZYK</div>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-chip v-bind="attrs" v-on="on" color="primary">
            <v-icon class="mr-2">mdi-cash</v-icon>
            <span style="font-weight: 900">{{totalPrice.toFixed(2)}}
              <span style="font-weight: 600">zł</span>
            </span>
          </v-chip>
        </template>
        <span>Całkowity koszt</span>
      </v-tooltip>
    </v-card-title>
    <template v-slot:actions>
      <v-icon color="scondary" class="ma-2">mdi-cart-arrow-up</v-icon>
    </template>
    <v-card-text v-if="cart.length > 0" v-model="$store.state.cart" class="py-4 hidden-xs-only hidden-sm-only">
      <template v-for="(item, index) in cart">
        <v-tooltip left :key="index">
          <template v-slot:activator="{ on, attrs }">
            <v-list>
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
                    <v-row dense v-for="(ingrideintCategory, ingridientCategoryName) in item.ingridients" :key="ingridientCategoryName">
                      <v-col class="col-12 ml-2">
                        {{ingridientCategoryName}}
                      </v-col>
                      <template v-if="Array.isArray(ingrideintCategory)">
                        <v-col
                            class="col-12"
                            v-for="(ingridient, index) in ingrideintCategory"
                            :key="index"
                        >
                          <v-icon>mdi-circle-small</v-icon>{{ingridient}}
                        </v-col>
                      </template>
                      <v-col v-else-if="ingrideintCategory === -1">
                        <v-icon>mdi-circle-small</v-icon>brak
                      </v-col>
                      <v-col v-else>
                        <v-icon>mdi-circle-small</v-icon>{{ingrideintCategory}}
                      </v-col>
                    </v-row>
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
                          <v-btn v-bind="attrs" v-on="on" icon color="primary" @click.stop="showDishIngridientModal(item)">
                            <v-icon color="primary">mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>Edytuj danie</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </template>
          <span>Cena: {{ item.price.toFixed(2) }} zł</span>
        </v-tooltip>
      </template>
    </v-card-text>
<!--    <dish-ingridient-modal></dish-ingridient-modal>-->
  </v-card>
</template>

<script>
// import dishIngridientModal from "@/components/dish/dishIngridientModal.vue";

export default {
  name: 'cartComponent',
  components: {
    // dishIngridientModal
  },
  data() {
    return {
      imageLoaded: false,
      headers: [
        {text: 'Cena', value: 'price'},
        {text: 'Danie', value: 'dishName'},
        {text: 'Ilość', value: 'count'}
      ],
      totalPrice: 0
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
