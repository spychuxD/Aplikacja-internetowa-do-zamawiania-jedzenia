<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-12">
        <v-card class="elevation-2">
          <v-card-title class="secondary text-overline">
            DOSTAWA
          </v-card-title>
          <v-card-text class="pt-3">
            <v-row class="pa-0">
              <v-col class="col-5">
                <v-card class="mt-3">
                  <v-card-title class="secondary text-overline">
                    <v-icon color="primary" class="mr-3">mdi-map</v-icon>
                    <div>Czat</div>
                  </v-card-title>
                  <v-card-text class="pa-0 chat-container" ref="chatContainer">
                    <template v-for="(message, index) in messages">
                      <div v-if="message.sender === 'USER'" class="text-left mt-3 mx-3" :key="index">
                        <div class="text-caption">{{formatMessageDate(message.date)}}</div>
                        <v-chip color="primary">{{message.message}}</v-chip>
                      </div>
                      <div v-else-if="message.sender === 'COURIER'" class="text-right mt-3 mx-3" :key="index">
                        <div class="text-caption" >{{formatMessageDate(message.date)}}</div>
                        <v-chip color="secondary" class="text--primary">{{message.message}}</v-chip>
                      </div>
                      <div v-else :key="index" class="text-center mt-3">
                        <v-chip color="primary">Napisz do kuriera</v-chip>
                      </div>
                    </template>
                  </v-card-text>
                  <v-card-actions>
                    <v-text-field v-model="message" label="Napisz wiadomość"></v-text-field>
                    <v-btn icon @click="sendMessage()"><v-icon>mdi-send</v-icon></v-btn>
                  </v-card-actions>
                </v-card>
                <v-card class="mt-3">
                  <v-card-title class="secondary text-overline">
                    <v-icon color="primary" class="mr-3">mdi-star</v-icon>
                    <div>Oceń</div>
                  </v-card-title>
                  <v-card-text>
                    <v-rating
                        class="mx-auto text-center mt-8 mb-4"
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
                    <v-btn :disabled="added" text large @click="addRating()"><v-icon>mdi-plus</v-icon>Dodaj</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col class="col-7">
                <v-card>
                  <v-card-title class="secondary text-overline">
                    <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                    <div>Informacje</div>
                  </v-card-title>
                  <v-card-text>
                    <div class="text-overline text-center mt-6 mb-1">ADRES DOSTAWY</div>
                    <div class="text-overline text-center mb-8"><v-icon color="red" large class="mr-3">mdi-map-marker</v-icon>{{clientAddress.address_line_1}} {{clientAddress.zip_code}} {{clientAddress.city}}</div>
                    <div class="text-overline text-center mt-6 mb-1">ADRES EMAIL</div>
                    <div class="text-overline text-center mb-8"><v-icon color="blue" large class="mr-3">mdi-at</v-icon>{{email}}</div>
                    <div class="text-overline text-center mb-1">STATUS</div>
                    <div class="text-overline text-center mb-6"><v-icon color="primary" large class="mr-3">mdi-home-clock</v-icon>{{status}}</div>
                  </v-card-text>
                </v-card>
                <v-card class="mt-3">
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
      message: '',
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
      added: false,
      orderId: null,
      messages: [{sender: 'ND'}],
      intervalId: null,
      intervalId2: null,
      messages2: [{sender: 'ND'}]
    }
  },
  created() {
    this.getOrder()
    this.getMessages()
    this.intervalId = setInterval(this.getCourierLocation, 10000);
    this.intervalId2 = setInterval(this.getMessages, 30000);
  },
  destroyed() {
    clearInterval(this.intervalId);
    clearInterval(this.intervalId2);
  },
  mounted() {
    this.updateChatScroll();
  },
  watch: {
    messages() {
      this.updateChatScroll();
    },
  },
  methods: {
     async getCourierLocation() {
      try {
        const response = await getListItemsOrItem('getLocation', 1);
        this.lat = response.lat
        this.lng = response.lng
      } catch (error) {
        console.error('Błąd podczas pobierania lokalizacji kuriera:', error);
      }
    },
    async getOrder() {
      const response = await getListItemsOrItem('getOrder', localStorage.getItem('order'))
      if(response) {
        this.clientAddress.address_line_1 = response.userAddressLine1
        this.clientAddress.zip_code = response.userAddressZipCode
        this.clientAddress.city = response.userAddressCity
        this.restaurant = response.restaurantId
        this.orderId = response.orderId
        if(response.status === 'PENDING') {
          this.status = 'W trakcie przygotowania'
        }
        if(response.status === 'ACCEPTED') {
          this.status = 'Kurier w drodze do restauracji'
        }
        if(response.status === 'DELIVERY') {
          this.status = 'Kurier w drodze do Ciebie'
        }
        if(response.status === 'DELIVERED') {
          this.status = 'Doręczono'
        }
        if(response.status === 'UNDELIVERED') {
          this.status = 'Nie doręczono'
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
    },
    async getMessages(){
      try {
        const response = await getListItemsOrItem('getMessages', localStorage.getItem('order'));
        this.messages = response
        // this.updateChatScroll();
      } catch (error) {
        console.error('Błąd podczas pobierania lokalizacji kuriera:', error);
      }
    },
    updateChatScroll() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    async sendMessage(){
      let currentDate = new Date();
      let formattedDate = currentDate.toISOString();

      let response = await postData('addMessage', {id: localStorage.getItem('order'), message: this.message, sender: 'USER', date: formattedDate})
      this.$store.state.info.showing = false
      this.$store.state.info.text = response.data['message']
      if(response.status === 201) {
        this.$store.state.info.color = 'success'
        this.message = ''
        const response = await getListItemsOrItem('getMessages', localStorage.getItem('order'));
        this.messages = response
      } else {
        this.$store.state.info.color = 'warning'
      }
      this.$store.state.info.showing = true
      this.updateChatScroll()
    },
    formatMessageDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(date).toLocaleString('pl-PL', options);
    }
  }
}

</script>

<style>
.chat-container {
  max-height: 400px; /* Możesz dostosować wysokość */
  overflow-y: auto; /* Włącza pionowe przewijanie, jeśli zawartość jest za długa */
}
</style>
