<template>
  <v-container fluid>
    <carousel-restaurant v-if="restaurants" :restaurants="restaurants"></carousel-restaurant>
    <address-input-home></address-input-home>
    <v-card class="mt-3">
      <div class="text-overline text-center">Korzystaj z systemu na różnych urządzeniach gdziekolwiek jesteś</div>
      <v-img width="900" style="cursor: pointer;" class="mx-auto" :src="require('@/assets/webApp/' + webApp)"></v-img>
    </v-card>
  </v-container>
</template>

<script>
import {getListItemsOrItem} from '@/functions/common'
import carouselRestaurant from '../restaurants/components/carouselRestaurant'
import addressInputHome from './components/addressInput'
export default {
  name: 'HomeIndex',
  components: {
    carouselRestaurant, addressInputHome
  },
  data() {
    return {
      webApp: 'web_app.png',
      interval: 3000,
      interval2: 2900,
      interval3: 3000,
      model: 0,
      model2: 1,
      model3: 2,
      delay: 300,
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
      this.loading = true
      this.restaurants = await getListItemsOrItem('restaurants')
      if(this.restaurants.length > 0) {
        this.restaurants.forEach(ele => {
          this.restaurantNames.push(ele.name)
        })
      }
      this.loading = false
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
