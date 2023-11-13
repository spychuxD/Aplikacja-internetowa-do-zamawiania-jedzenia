<template>
  <v-container fluid>
    <v-card flat class="mb-3">
      <v-card-text>
        <v-row>
          <v-col class="col-4 pa-0">
            <v-carousel :show-arrows="false" v-model="model" :interval="interval" cycle hide-delimiters height="300">
              <v-carousel-item v-for="(restaurant, index) in restaurants" :key="index">
                <v-img max-height="300" style="cursor: pointer;" :src="require('@/assets/restaurants/' + restaurant.fileName)"></v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col class="col-4 pa-0">
            <v-carousel :show-arrows="false" v-model="model2" vertical :interval="interval2" cycle hide-delimiters height="300">
              <v-carousel-item v-for="(restaurant, index) in restaurants" :key="index">
                <v-img max-height="300" style="cursor: pointer;" :src="require('@/assets/restaurants/' + restaurant.fileName)"></v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col class="col-4 pa-0">
            <v-carousel :show-arrows="false" v-model="model3" reverse :interval="interval3" cycle hide-delimiters height="300">
              <v-carousel-item v-for="(restaurant, index) in restaurants" :key="index">
                <v-img max-height="300" style="cursor: pointer;" :src="require('@/assets/restaurants/' + restaurant.fileName)"></v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text >
        <v-row>
          <v-col class="col-7">
            <div class="text-overline text-center mt-3">Podaj swój adres lub <a>zaloguj się</a></div>
            <v-text-field></v-text-field>
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
  </v-container>
</template>

<script>
import {getListItemsOrItem} from '@/functions/common'
export default {
  name: 'HomeIndex',
  data() {
    return {
      sparkline: {
        value: [0, 10, 10, 10],
        fill: 'primary',
      },
      interval: 3000,
      interval2: 2900,
      interval3: 3000,
      model: 0,
      model2: 1,
      model3: 2,
      delay: 300,
      imageLoaded: false,
      tabIndex: 0,
      restaurants: [],
      loading: true,
      restaurantNames: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // axios.get('http://localhost:8000/restaurants', {
      //   headers: {
      //     'Authorization': 'Bearer ' + VueCookie.get('accessToken')
      //   }
      // })
      this.loading = true
      console.log(this.$cookie.get('token'))
      this.restaurants = await getListItemsOrItem('restaurants', 0 , this.$cookie.get('token'))
      if(this.restaurants.length > 0) {
        this.restaurants.forEach(ele => {
          this.restaurantNames.push(ele.name)
        })
      }
      this.loading = false
    },
    imageLoadedFn() {
      this.imageLoaded = true;
    }
  }
}
</script>

<style scoped>
.text-limit {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Maksymalna liczba linii */
  -webkit-box-orient: vertical;
  max-height: 3rem; /* Wysokość, która odpowiada maksymalnie 2 linii z 1.5 rem na linię */
}
</style>
