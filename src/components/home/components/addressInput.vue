<template>
  <v-card>
    <v-card-text >
      <v-row>
        <v-col class="col-7">
          <div class="text-overline text-center mt-3">Podaj swój adres lub <a>zaloguj się</a></div>
          <v-text-field
              v-model="address"
              class="mx-16 px-16"
              label="Adres"
              append-outer-icon="mdi-map-marker"
              @click:append-outer="saveAddress()"
          ></v-text-field>
        </v-col>
        <v-col class="col-5 pa-0">
          <v-row>
            <v-sparkline
                :fill="true"
                :line-width="3"
                :value="sparkline.value"
                auto-draw
            >
            </v-sparkline>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'inputAddrssHome',
  data() {
    return {
      address: '',
      addressObj: {
        address_line_1: 'Mazurska' + ' ' + '66',
        address_line_2: '',
        city: 'Kielce',
        zip_code: '25-345'
      },
      sparkline: {
        value: [0, 10, 10, 10],
        fill: 'primary',
      },
    }
  },
  methods: {
    saveAddress() {
      if (this.address !== '') {
        this.$geocoder.send(this.addressObj, response => {
          if (response.status === 'OK') {
            if(response.results.length === 1) {
              let latLngString= JSON.stringify({lng: response.results[0].geometry.location.lng, lat: response.results[0].geometry.location.lat}, null, 2)
              localStorage.setItem('address', latLngString)
              this.$router.push('/restaurants')
            }
          }
        })
      }
    }
  }
}
</script>