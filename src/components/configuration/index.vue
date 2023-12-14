<template>
<!--  <v-container fluid>-->
    <v-card flat>
      <v-card-text>
        <v-row class="text-center">
          <v-col v-for="(option, index) in options" class="col-sm-6 col-md-4 col-lg-3" :key="index">
            <v-btn elevation="4" rounded class="pa-8" :to="option.path" block height="300">
              <div>
                <v-icon size="64">{{option.icon}}</v-icon><br/><br/>
                <span class="text-h5">{{option.name}}</span>
              </div>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
<!--  </v-container>-->
</template>
<script>

export default {
  name: 'configurationIndex',
  data() {
    return {
      loading: true,
      options: [
        {path: '/config/restaurants', name: 'Restauracje', icon: 'mdi-store'},
        {path: '/config/dishes', name: 'Dania', icon: 'mdi-silverware-fork-knife'},
        {path: '/config/orders', name: 'Zamówienia', icon: 'mdi-list-box-outline'},
        {path: '/config/users', name: 'Użytkownicy', icon: 'mdi-account'},
        {path: '/config/couriers', name: 'Kurierzy', icon: 'mdi-bike-fast'},
        {path: '/config/ratings', name: 'Oceny i opinie', icon: 'mdi-star'}
      ]
    }
  },
  created() {

  },
  methods: {}
}
</script>