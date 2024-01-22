<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-12">
        <v-card class="elevation-2">
          <v-card-title class="secondary text-overline">
            DOSTAWA
          </v-card-title>
          <v-card-text class="pt-3">
            <v-row class="justify-center align-center pa-0">
              <v-col class="col-5">
                <v-card :disabled="added">
                  <v-card-title class="secondary text-overline">
                    <v-icon color="primary" class="mr-3">mdi-star</v-icon>
                    <div>Oceń</div>
                  </v-card-title>
                  <v-card-text>
                    <v-rating
                        class="mx-auto"
                        v-model="value"
                        background-color="white"
                        color="yellow accent-4"
                        dense
                        half-increments
                        hover
                        size="64"
                    ></v-rating>
                    <v-textarea v-model="description" label="Podziel się swoją opinią"></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text large @click="addRating()"><v-icon>mdi-plus</v-icon>Dodaj</v-btn>
                  </v-card-actions>
                </v-card>
                <v-card class="mt-3">
                  <v-card-title class="secondary text-overline">
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                    <div>Informacje</div>
                  </v-card-title>
                  <v-card-text>
                    <div class="text-overline text-center mt-3 mb-6">Adres dostawy</div>
                    <v-text-field
                        disabled
                        dense
                        v-model="clientAddress.address_line_1"
                        label="Ulica i numer"
                        append-outer-icon="mdi-map-marker"
                    ></v-text-field>
                    <v-row>
                      <v-col>
                        <v-text-field
                            disabled
                            dense
                            v-model="clientAddress.zip_code"
                            label="Kod pocztowy"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                            disabled
                            dense
                            v-model="clientAddress.city"
                            label="Miasto"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-text-field
                        disabled
                        dense
                        v-model="email"
                        label="Email"
                        append-outer-icon="mdi-at"
                    ></v-text-field>
                    <v-text-field
                        disabled
                        dense
                        v-model="status"
                        label="Status dostawy"
                        append-outer-icon="mdi-home-clock"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col class="col-7">
                <v-card>
                  <v-card-title class="secondary text-overline">
                    <v-icon color="primary" class="mr-3">mdi-map</v-icon>
                    <div>Mapa</div>
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <google-maps :addresses="courierAddress" :lat="lat" :lng="lng" :height="600"></google-maps>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import googleMaps from '../GoogleMaps'
import {getListItemsOrItem, postData} from "@/functions/common";

export default {
  name: 'trackingOrder',
  components: {
    googleMaps
  },
  data() {
    return {
      value: 4.5,
      description: '',
      clientAddress : {},
      status: '',
      lat: 0,
      lng: 0,
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
      courierAddress: [{address_line_1: 'Chęcińska 16B', address_line_2: '', city: 'Kielce', zip_code: '25-020'}],
      restaurant: null,
      added: false
    }
  },
  created() {
    this.getOrder()
    this.intervalId = setInterval(this.getCourierLocation, 2000);
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  methods: {
    async getCourierLocation() {
      try {
        const response = await getListItemsOrItem('getLocation', 1);
        this.lat = response.lat
        this.lng = response.lng
        console.log(response);
      } catch (error) {
        console.error('Błąd podczas pobierania lokalizacji kuriera:', error);
      }
    },
    async getOrder() {
      const response = await getListItemsOrItem('getOrder', localStorage.getItem('order'))
      console.log('order',response)
      if(response) {
        this.clientAddress.address_line_1 = response.userAddressLine1
        this.clientAddress.zip_code = response.userAddressZipCode
        this.clientAddress.city = response.userAddressCity
        this.restaurant = response.restaurantId
        if(response.status === 'PENDING') {
          this.status = 'W trakcie przygotowania'
        }
        if(response.status === 'ACCEPTED') {
          this.status = 'Kurier w drodze do restauracji'
        }
      }
    },
    async addRating() {
      let response = await postData('addRating', {id: this.restaurant, value: this.value, description: this.description}, this.$cookie.get('token'))
      this.$store.state.info.showing = false
      this.$store.state.info.text = response.data['message']
      if(response.status === 201) {
        this.added = true
        this.$store.state.info.color = 'success'
      } else {
        this.$store.state.info.color = 'warning'
      }
      this.$store.state.info.showing = true
    }
  }
}

</script>
