<template>
  <v-card :loading="loading" class="mt-3" flat>
<!--    <v-card-title class="pa-0 secondary">-->
<!--      <v-icon color="primary">mdi-silverware</v-icon>-->
<!--      <div class="ml-3">RESTAURACJE</div>-->
<!--    </v-card-title>-->
    <v-card-text>
      <v-row class="text-center">
        <v-col v-for="(restaurant, index) in restaurants" class="col-sm-6 col-md-4 col-lg-2" :key="index">
          <v-card class="pa-3">
            <v-card-title class="pa-0">
              <v-img
                  style="cursor: pointer;"
                  :src="require('@/assets/restaurants/' + restaurant.fileName)"
                  max-height="150px"
                  @load="imageLoadedFn"
                  @click="$router.push('/restaurant/'+restaurant.id+'/menu')"
              >
                <v-progress-circular v-if="!imageLoaded" indeterminate color="primary"></v-progress-circular>
              </v-img>
            </v-card-title>
            <v-card-text>
              <div class="text-h6 mt-3 text-truncate">{{restaurant.name}}</div>
              <div class="text-limit">{{restaurant.description}}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text class="ma-0 pa-0">
              <div class="text-truncate text-overline">
                <v-icon color="primary" class=" mr-1">mdi-map-marker-radius</v-icon>
                {{restaurant.street}} {{restaurant.parcelNumber}}/{{restaurant.apartmentNumber}} {{restaurant.postcode}} {{restaurant.city}}
              </div>
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-card-text>
                <!--                        <v-expansion-panels focusable flat>-->
                <!--                          <v-expansion-panel>-->
                <!--                            <v-expansion-panel-header text-overline class="py-0 ">-->
                <!--                              <div class="text&#45;&#45;secondary">GODZINY OTWARCIA</div>-->
                <!--                              <template v-slot:actions>-->
                <!--                                <v-icon color="primary">mdi-clock</v-icon>-->
                <!--                              </template>-->
                <!--                            </v-expansion-panel-header>-->
                <!--                            <v-expansion-panel-content class="text-overline">-->
                <!--                              <div v-for="(item, itemIndex) in restaurant.openingHours" :key="itemIndex">{{item}}</div>-->
                <!--                            </v-expansion-panel-content>-->
                <!--                          </v-expansion-panel>-->
                <!--                        </v-expansion-panels>-->
              </v-card-text>
              <v-spacer></v-spacer>
              <v-btn icon  color="primary" class="mr-3" :to="'/restaurant/'+restaurant.id+'/menu'">
                <v-icon>mdi-cart-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import {getListItemsOrItem} from "@/functions/common";

export default {
  name: 'favoriteRestaurants',
  data() {
    return {
      loading: true,
      tabIndex: 0,
      restaurants: [],
      imageLoaded: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.restaurants = await getListItemsOrItem('favoriteRestaurants', 0, 'user')
      console.log(this.restaurants)
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