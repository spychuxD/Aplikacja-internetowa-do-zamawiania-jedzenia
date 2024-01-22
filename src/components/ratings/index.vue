<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-4">
        <v-card :loading="loading" class="mt-3" flat>
          <v-card-title class="secondary text-overline">
            <v-icon color="primary">mdi-monitor-cellphone-star</v-icon>
            <div class="ml-3">WSZYSTKIE OPINIE</div>
            <v-spacer></v-spacer>
            <v-chip color="primary" @click="rating = true">
              <v-icon class="mr-2">mdi-star</v-icon>
              <span style="font-weight: 900">Oceń !</span>
            </v-chip>
          </v-card-title>
          <v-card-text class="px-8 py-4">
            <v-card v-for="(rating, index) in ratings" :key="index" class="mt-3">
              <v-card-text>
                <v-row class="mt-3">
                  <v-rating
                      class="mx-auto"
                      v-model="rating.value"
                      background-color="white"
                      color="yellow accent-4"
                      dense
                      half-increments
                      hover
                      size="32"
                      readonly
                  ></v-rating>
                </v-row>
                <v-row class="my-4 px-3">
                  <v-col class="col-12">
                    <div v-if="rating.description" class="text-overline text-center">{{rating.description}}</div>
                    <div v-else class="text-overline text-center">Brak opisu</div>
                  </v-col>
                </v-row>
                <v-row class=" px-3">
                  <v-col class="col-6">
                    <div class="text-caption text-left">Restauracja:</div>
                    <div class="text-caption text-left">{{rating.restaurantName}}</div>
                  </v-col>
                  <v-col class="col-6">
                    <div class="text-caption text-right">Użytkownik: {{rating.userEmail}}</div>
                    <div class="text-caption text-right">{{rating.date}}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-4">
        <v-card :loading="loading" class="mt-3" flat>
          <v-card-title class="secondary text-overline">
            <v-icon color="primary">mdi-star</v-icon>
            <div class="ml-3">TWOJE OPINIE</div>
            <v-spacer></v-spacer>
            <!--                  <v-chip color="primary" @click="rating = true">-->
            <!--                    <v-icon class="mr-2">mdi-star</v-icon>-->
            <!--                    <span style="font-weight: 900">Oceń !</span>-->
            <!--                  </v-chip>-->
          </v-card-title>
          <v-card-text class="px-8 py-4">
            <v-card v-for="(rating, index) in userRatings" :key="index" class="mt-3">
              <v-card-text>
                <v-row class="mt-3">
                  <v-rating
                      class="mx-auto"
                      v-model="rating.value"
                      background-color="white"
                      color="yellow accent-4"
                      dense
                      half-increments
                      hover
                      size="32"
                      readonly
                  ></v-rating>
                </v-row>
                <v-row class="my-4 px-3">
                  <v-col class="col-12">
                    <div v-if="rating.description" class="text-overline text-center">{{rating.description}}</div>
                    <div v-else class="text-overline text-center">Brak opisu</div>
                  </v-col>
                </v-row>
                <v-row class=" px-3">
                  <v-col class="col-6">
                    <div class="text-caption text-left">Restauracja:</div>
                    <div class="text-caption text-left">{{rating.restaurantName}}</div>
                  </v-col>
                  <v-col class="col-6">
                    <div class="text-caption text-right">Użytkownik: {{rating.userEmail}}</div>
                    <div class="text-caption text-right">{{rating.date}}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-4">
        <v-card :loading="loading" class="mt-3" flat>
          <v-card-title class="secondary text-overline">
            <v-icon color="primary">mdi-star</v-icon>
            <div class="ml-3">OPINIE O RESTAURACJI</div>
            <v-spacer></v-spacer>
            <!--                  <v-chip color="primary" @click="rating = true">-->
            <!--                    <v-icon class="mr-2">mdi-star</v-icon>-->
            <!--                    <span style="font-weight: 900">Oceń !</span>-->
            <!--                  </v-chip>-->
          </v-card-title>
          <v-card-text class="px-8 py-4">
            <v-row>
              <v-select v-model="restaurantToShowRatings" :items="restaurants"></v-select>
            </v-row>
            <v-card v-for="(rating, index) in restaurantRatings" :key="index" class="mt-3">
              <v-card-text>
                <v-row class="mt-3">
                  <v-rating
                      class="mx-auto"
                      v-model="rating.value"
                      background-color="white"
                      color="yellow accent-4"
                      dense
                      half-increments
                      hover
                      size="32"
                      readonly
                  ></v-rating>
                </v-row>
                <v-row class="my-4 px-3">
                  <v-col class="col-12">
                    <div v-if="rating.description" class="text-overline text-center">{{rating.description}}</div>
                    <div v-else class="text-overline text-center">Brak opisu</div>
                  </v-col>
                </v-row>
                <v-row class=" px-3">
                  <v-col class="col-6">
                    <div class="text-caption text-left">Restauracja:</div>
                    <div class="text-caption text-left">{{rating.restaurantName}}</div>
                  </v-col>
                  <v-col class="col-6">
                    <div class="text-caption text-right">Użytkownik: {{rating.userEmail}}</div>
                    <div class="text-caption text-right">{{rating.date}}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="rating" :max-width="$vuetify.breakpoint.thresholds.sm">
      <v-card>
        <v-card-title class="secondary text-overline">
          <v-icon color="primary" class="mr-3">mdi-star</v-icon>
          <div>Oceń</div>
        </v-card-title>
        <v-card-text>
          <v-select v-model="restaurant" :items="restaurants"></v-select>
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
    </v-dialog>
  </v-container>
</template>

<script>
import {getListItemsOrItem, postData} from "@/functions/common";

export default {
  name: 'RestaurantRatings',
  data() {
    return {
      rating: false,
      value: 5.0,
      description: '',
      loading: true,
      ratings: [],
      userRatings: [{restaurantName: '', date: '', email: '', value: 0, description: 'Brak ocen użytkownika lub użytkownik niezalowowany'}],
      restaurantRatings: [{restaurantName: '', date: '', email: '', value: 0, description: 'Należy wybrać restauracje, aby wyświetlić opinie o niej'}],
      restaurants: [],
      restaurant: null,
      restaurantToShowRatings: null
    }
  },
  watch: {
    restaurantToShowRatings: {
      handler() {
        this.getRestaurantRatings()
      },
      deep: true
    }
  },
  created() {
    this.getRatings()
  },
  methods: {
    async getRatings() {
      this.loading = true
      const restaurants = await getListItemsOrItem('restaurants')
      restaurants.map(restaurant => {
        this.restaurants.push({text: restaurant.name, value: restaurant.id})
      })
      this.ratings = await getListItemsOrItem('ratings')
      if(this.ratings === 0) {
        this.$store.state.info.showing = false
        this.$store.state.info.loading = false
        this.$store.state.info.text = 'Brak ocen'
        this.$store.state.info.color = 'info'
        this.$store.state.info.showing = true
      }
      this.userRatings = await getListItemsOrItem('userRatings', 0, 'api')
      if(this.userRatings === 0) {
        this.$store.state.info.showing = false
        this.$store.state.info.loading = false
        this.$store.state.info.text = 'Brak ocen użytkownika lub użytkownik niezalowowany'
        this.$store.state.info.color = 'info'
        this.$store.state.info.showing = true
      }
      this.loading = false
    },
    async addRating() {
      let response = await postData('addRating', {id: this.restaurant, value: this.value, description: this.description}, this.$cookie.get('token'))
      this.$store.state.info.showing = false
      this.$store.state.info.text = response.data['message']
      if(response.status === 201) {
        this.$store.state.info.color = 'success'
      } else {
        this.$store.state.info.color = 'warning'
      }
      this.$store.state.info.showing = true
      this.rating = false
      window.location.reload(true);
    },
    async getRestaurantRatings() {
      this.restaurantRatings = await getListItemsOrItem('restaurantRatings', this.restaurantToShowRatings)
      console.log(this.restaurantRatings)
      if(this.restaurantRatings.length === 0) {
        this.restaurantRatings.push({restaurantName: '', date: '', email: '', value: 0, description: 'Brak opinii o tej restauracji'})
        console.log(this.restaurantRatings)
        this.$store.state.info.showing = false
        this.$store.state.info.loading = false
        this.$store.state.info.text = 'Brak ocen restauracji'
        this.$store.state.info.color = 'info'
        this.$store.state.info.showing = true
      }
    }
  }
}

</script>
