<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-6">
        <v-card class="elevation-2">
          <v-card-title class="secondary text-overline">
            PODSUMOWANIE KOSZYKA
          </v-card-title>
          <v-card-text>
            <v-expansion-panels focusable flat>
                <v-expansion-panel v-for="(dish, indexDish) in $store.state.cart" :key="indexDish">
                  <v-expansion-panel-header>
                    <div>
                      <span class="text-h6 text--secondary">{{dish.dishName}} <span class="ml-3 text-subtitle-2 text--primary">{{dish.price.toFixed(2)}} zł</span><br></span>
                      <span class="text-caption text--secondary">{{dish.dishDescription}}</span>
                    </div>
                    <template v-slot:actions>
                      <v-icon color="secondary">mdi-arrow-down</v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="col-12">
                    <ul v-for="(ingridients, ingridientCategoryName) in dish.ingridients" :key="ingridientCategoryName">
                      <li style="list-style-type:none; margin-bottom: 3px" v-if="ingridientCategoryName !== '_Ctor' ">
                        <div>
                          <v-divider class="mb-3 mt-3"></v-divider>
                          <div v-if="(Array.isArray(ingridients) && ingridients.length > 0) || ingridients.ingridientName">
                            <v-icon small color="success">mdi-check-circle</v-icon>
                            <span class="ml-2 text--secondary" style="font-weight: 500">{{ingridientCategoryName}}</span>
                          </div>
                          <div v-else>
                            <v-icon small color="error">mdi-close-circle</v-icon>
                            <span class="ml-2 text--secondary" style="font-weight: 300">{{ingridientCategoryName}}</span>
                          </div>
                        </div>
                        <ul v-if="Array.isArray(ingridients) && ingridients.length > 0">
                          <li
                              style="list-style-type:none;"
                              v-for="(ingridient, indexIngridient) in ingridients"
                              :key="indexIngridient"
                          >
                            <div>
                              <span><v-icon color="primary" small>mdi-basket-check</v-icon></span>
                              <span class="ml-2 text--secondary" style="font-weight: 700">{{ingridient.ingridientName}} <span style="font-weight: 300" class="text-caption ml-3">({{ingridient.price.toFixed(2)}} zł)</span><br></span>
                              <span class="ml-2 text-caption text--secondary" style="font-weight: 700">{{ingridient.ingridientDescription}}</span>
                            </div>
                          </li>
                        </ul>
                        <ul v-else-if="ingridients.ingridientName">
                          <li style="list-style-type:none;">
                            <div>
                              <span><v-icon color="primary" small>mdi-basket-check</v-icon></span>
                              <span class="ml-2" style="font-weight: 700">{{ingridients.ingridientName}} <span style="font-weight: 300" class="text-caption ml-3">({{ingridients.price.toFixed(2)}} zł)</span><br></span>
                              <span class="ml-2 text-caption" style="font-weight: 700">{{ingridients.ingridientDescription}}</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card class="elevation-2">
          <v-card-title class="secondary text-overline">
            ADRES I CZAS DOSTAWY
          </v-card-title>
          <v-card-text class="pt-3">
            <v-row class="justify-center align-center pa-0">
              <v-col class="col-5">
                <div class="text-overline text-center mt-3 mb-6">Adres dostawy</div>
                <v-text-field
                    dense
                    v-model="address"
                    label="Adres"
                    append-outer-icon="mdi-map-marker"
                ></v-text-field>
                <v-text-field
                    dense
                    v-model="email"
                    label="Email"
                    append-outer-icon="mdi-at"
                ></v-text-field>
                <v-select
                    append-outer-icon="mdi-home-clock"
                    outlined
                    v-model="hourModel"
                    label="Godzina dostawy"
                    :items="hours"
                ></v-select>
              </v-col>
              <v-col class="col-7">
<!--                <google-maps :addresses="clientAddress" :height="300"></google-maps>-->
              </v-col>
            </v-row>
            <v-row>
              <v-expansion-panels focusable flat>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <div class="text-overline text-center text--secondary">Wybierz metodę płatności</div>
                    <template v-slot:actions>
                      <v-icon color="secondary">mdi-arrow-down</v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="col-12">
                    <v-radio-group v-model="paymentType" row>
                      <v-col>
                        <v-row>
                          <v-radio label="BLIK" :value="1"></v-radio>
                          <v-img :src="require('@/assets/icons/' + 'blikIcon.png')" max-height="25" max-width="25" class="ml-5"></v-img>
                        </v-row>
                      </v-col>
                      <v-col>
                        <v-row>
                          <v-radio label="Pay-Pal" :value="2"></v-radio>
                          <v-img :src="require('@/assets/icons/' + 'paypalIcon.png')" max-height="25" max-width="25" class="ml-5"></v-img>
                        </v-row>
                      </v-col>
                      <v-col>
                        <v-row>
                          <v-radio label="Tpay" :value="3"></v-radio>
                          <v-img :src="require('@/assets/icons/' + 'tpayIcon.png')" max-height="25" max-width="25" class="ml-5"></v-img>
                        </v-row>
                      </v-col>
                    </v-radio-group>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-btn block class="ml-auto mb-3 pt-6 pb-6" @click="payForOrder">Do zapłaty: <span class=" text--primary mx-3" style="font-weight: 900">{{totalCost.toFixed(2)}} zł</span>KLIKNIJ ABY PRZEJŚĆ DO PŁATNOŚCI</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import googleMaps from '../GoogleMaps'
import { pay } from "@/functions/common";

export default {
  name: 'cartSummary',
  // components: {
  //   googleMaps
  // },
  data() {
    return {
      tabIndex: 0,
      totalCost: 0,
      email: 'test@test.pl',
      address: 'Mazurska 66/79, 25-345 Kielce',
      sparkline: {
        value: [0, 10, 10, 10],
        fill: 'primary',
      },
      hourModel: 1,
      paymentType: 1,
      hours: [
        {
          value: 1,
          text: 'JAK NAJSZYBCIEJ'
        }
      ],
      clientAddress: {address_line_1: 'Mazurska 66', address_line_2: '', city: 'Kielce', zip_code: '25-345'}
    }
  },
  created() {
    this.getCart()
  },
  methods: {
    getCart() {
      let cartString = localStorage.getItem('cart')
      let totalCostString = localStorage.getItem('totalCost')
      if(cartString && totalCostString) {
        this.$store.state.cart = JSON.parse(cartString)
        this.totalCost = JSON.parse(totalCostString)
      } else {
        this.$store.state.info.showing = false
        this.$store.state.info.text = 'Nieprzewidziany wyjątek. Koszyk jest pusty.'
        this.$store.state.info.color = 'error'
        this.$store.state.info.showing = true
      }
    },
    async payForOrder() {
      const amount = JSON.parse(localStorage.getItem('totalCost'))
      this.$store.state.cart = JSON.parse(localStorage.getItem('cart'))
      const hiddenDescription = JSON.parse(localStorage.getItem('restaurant'))
      const address = this.clientAddress.address_line_1 + ', ' + this.clientAddress.zip_code + ' ' + this.clientAddress.city
      if(amount && hiddenDescription) {
        const response = await pay(amount, hiddenDescription, this.email, this.$store.state.cart, amount, address, this.$cookie.get('token'))
        if(response.status !== 201) {
          this.$store.state.info.showing = false
          this.$store.state.info.text = response.data
          this.$store.state.info.color = 'warning'
          this.$store.state.info.showing = true
        } else {
          window.location.href = response.data
        }
      }
    }
  }
}

</script>
