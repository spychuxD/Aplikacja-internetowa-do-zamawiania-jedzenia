<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-12">
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
                <google-maps :addresses="courierAddress" :lat="lat" :lng="lng" :height="600"></google-maps>
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
import {getListItemsOrItem} from "@/functions/common";

export default {
  name: 'trackingOrder',
  components: {
    googleMaps
  },
  data() {
    return {
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
      courierAddress: [{address_line_1: 'Chęcińska 16B', address_line_2: '', city: 'Kielce', zip_code: '25-020'}]
    }
  },
  created() {
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
    }
  }
}

</script>
