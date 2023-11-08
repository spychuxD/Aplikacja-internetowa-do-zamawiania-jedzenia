<template>
    <v-container fluid>
      <v-card :loading="loading">
        <v-card-title class="pa-0">
          <v-tabs v-model="tabIndex" class="secondary">
            <v-tab>Rstauracje</v-tab>
            <v-tab>Sklepy</v-tab>
          </v-tabs>
        </v-card-title>
        <v-tabs-items v-model="tabIndex">
          <v-tab-item>
            <v-card-text>
              <v-row class="text-center">
                <v-col class="col-12">
                  <v-row>
                    <v-col class="col-4">
                      <v-autocomplete no-data-text="Brak wyszukiwań" dense :items="restaurantNames" label="Restauracja" prepend-inner-icon="mdi-store-search"></v-autocomplete>
                    </v-col>
                    <v-col class="col-4">
                      <v-text-field dense label="Adres" prepend-inner-icon="mdi-map-marker"></v-text-field>
                    </v-col>
                    <v-col class="col-4">
                      <v-text-field dense label="Danie" prepend-inner-icon="mdi-silverware"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-for="(restaurant, index) in restaurants" class="col-sm-6 col-md-4 col-lg-2" :key="index">
                  <v-card class="pa-3">
                    <v-card-title class="pa-0">
                      <v-img style="cursor: pointer;" :src="'C:/User/Spychu/Desktop/vueJsApp/web-app-vue2/src/assets/restaurants/' + restaurant.fileName" max-height="150px" @load="imageLoadedFn" @click="$router.push('/restaurant/'+restaurant.id+'/menu')">
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
          </v-tab-item>
          <v-tab-item>
            <v-card-text>
              <v-col v-for="(item, index) in restaurants" class="col-3" :key="index">
                <p>{{item}}</p>
              </v-col>
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
</template>
  
<script>
import {getListItemsOrItem} from "@/functions/common";

  export default {
    name: 'RestaurantIndex',
    data() {
      return {
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
  