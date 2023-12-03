<template>
  <v-card :loading="loading" flat class="mb-3">
    <v-card-text v-if="restaurants">
      <v-row>
        <v-col class="col-4 pa-0">
          <v-carousel
              :show-arrows="false"
              v-model="model"
              :interval="interval3000"
              cycle
              hide-delimiters
              height="300"
          >
            <v-carousel-item v-for="(restaurant, index) in restaurants" :key="index">
              <v-img
                  @click="$router.push('/restaurant/'+restaurant.id+'/menu')"
                  max-height="300"
                  style="cursor: pointer;"
                  :src="require('@/assets/restaurants/' + restaurant.fileName)"
              >
              </v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col class="col-4 pa-0">
          <v-carousel
              :show-arrows="false"
              v-model="model2" vertical
              :interval="interval2900"
              cycle
              hide-delimiters
              height="300"
          >
            <v-carousel-item v-for="(restaurant, index) in restaurants" :key="index">
              <v-img
                  @click="$router.push('/restaurant/'+restaurant.id+'/menu')"
                  max-height="300"
                  style="cursor: pointer;"
                  :src="require('@/assets/restaurants/' + restaurant.fileName)"
              ></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col class="col-4 pa-0">
          <v-carousel
              :show-arrows="false"
              v-model="model3" reverse
              :interval="interval3000"
              cycle
              hide-delimiters
              height="300"
          >
            <v-carousel-item v-for="(restaurant, index) in restaurants" :key="index">
              <v-img
                  @click="$router.push('/restaurant/'+restaurant.id+'/menu')"
                  max-height="300"
                  style="cursor: pointer;"
                  :src="require('@/assets/restaurants/' + restaurant.fileName)"
              ></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'carouselRestaurant',
  data() {
    return {
      interval3000: 3000,
      interval2900: 2900,
      model: 0,
      model2: 1,
      model3: 2,
      loading: true
    }
  },
  props: {
    restaurants: {
      type: Array,
      required: true
    }
  },
  watch: {
    restaurants: {
      handler() {
        this.loading = false
      },
      deep: true
    }
  }
}
</script>