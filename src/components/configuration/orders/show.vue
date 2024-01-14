<template>
  <v-container fluid>
    <v-card flat elevation="1">
      <v-card-title class="pa-0">
        <v-tabs v-model="tabIndex" class="secondary" fixed-tabs>
          <v-tab>Zamówienia</v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tabIndex">
        <v-tab-item>
          <v-card-text>
            <v-data-table
                :disable-sort="false"
                :loading="loading"
                :headers="headers"
                :items="orders"
                item-key="id"
                :items-per-page="15"
                dense
            >
              <template v-slot:[`item.restaurantName`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-store</v-icon>
                <a href="#" @click="goToRestaurant(item.restaurantId)">{{ item.restaurantName }}</a>
              </template>
              <template v-slot:[`item.courierEmail`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-at</v-icon>
                <a href="#" @click="goToCourier(item.courierId)">{{ item.courierEmail }}</a>
              </template>
              <template v-slot:[`item.userEmail`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-at</v-icon>
                <a v-if="item.userEmail" href="#" @click="goToCourier(item.userId)">{{ item.userEmail }}</a>
                <span v-else>Użytkownik niezarejestrowany</span>
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <v-chip color="warning" v-if="item.status === 'PENDING'">Tworzenie zamówienia</v-chip>
                <v-chip color="info" class="text--primary" v-if="item.status === 'ACCEPTED'">W trakcie dostawy</v-chip>
                <v-chip color="success" class="text--primary" v-if="item.status === 'DELIVERED'">Dostarczono</v-chip>
                <v-chip color="error" class="text--primary" v-if="item.status === 'UNDELIVERED'">Nie dostarczono</v-chip>
              </template>
              <template v-slot:[`item.cost`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-cash</v-icon> {{item.cost.toFixed(2)}} zł
              </template>
              <template v-slot:[`item.cart`]="{ item }">
                <v-expansion-panels multiple focusable flat>
                  <v-expansion-panel v-for="(dish, index) in item.cart" :key="index">
                    <v-expansion-panel-header>{{ dish.dishName }}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div v-for="(ingridients, ingridientCategory) in dish.ingridients" :key="ingridientCategory">
                        <div v-for="(ingridient, ingridientIndex) in ingridients" :key="ingridientIndex">
                          {{ingridient.ingridientName}}
                        </div>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </template>
              <template v-slot:[`item.options`]="{ item }">
                <v-btn icon>
                  <v-icon v-if="!item.options" color="secondary" small>mdi-cog</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
import {getListItemsOrItem, postData} from "@/functions/common";

export default {
  name: 'configOrders',
  data() {
    return {
      isMultiOption: false,
      newCategory: false,
      newIngridientCategory: false,
      ingridientsCategories: [],
      dishesCategories: [],
      dishIngridients: [{name: '', description: ''}],
      ingridientCategory: {name: '', description: ''},
      tabIndex: 0,
      loading: true,
      orders: [],
      dish: {
        id: null,
        name: '',
        description: '',
        categoryName: '',
        categoryDescription: ''
      },
      openingHoursRestaurant: [],
      headers: [
        { text: 'Restauracja', align: 'start', value: 'restaurantName', sortable: false, },
        { text: 'Kurier', align: 'center', value: 'courierEmail', sortable: false, },
        { text: 'Użytkownik', align: 'center', value: 'userEmail', sortable: false, },
        { text: 'Adres dostawy', align: 'center', value: 'userAddress', sortable: false, },
        { text: 'Status', align: 'center', value: 'status', sortable: false, },
        { text: 'Koszt', align: 'center', value: 'cost', sortable: false, },
        { text: 'Koszyk', align: 'center', value: 'cart', width: '300px', sortable: false, },
        { text: 'Opcje', align: 'center', value: 'options', sortable: false, }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.orders = await getListItemsOrItem('getOrders', 0, 'api', 'admin')
      if(!Array.isArray(this.orders)) {
        this.$store.state.info.showing = false
        this.$store.state.info.text = this.orders.message
        this.$store.state.info.color = 'warning'
        this.$store.state.info.showing = true
        this.$cookie.delete('token')
        setTimeout(() => {
          this.$router.push('/home')
          window.location.reload(true);
        }, 1500);
      }
      if (this.orders.length > 0) {
        this.orders = this.orders.map(order => ({ ...order, options: '' }))
      }
      this.dishesCategories = await getListItemsOrItem('getDishesCategories', 0, 'api', 'admin')
      this.ingridientsCategories = await getListItemsOrItem('getIngridientsCategories', 0, 'api', 'admin')
      this.loading = false
    },
    newDate() {
      this.dishIngridients.push({name: '', description: ''})
    },
    removeDate(index) {
      this.dishIngridients.splice(index,1)
    },
    goToCourier(id) {
      this.$router.push(`/couriers/${id}`);
    },
    goToRestaurant(id) {
      this.$router.push(`/restaurant/${id}/menu`);
    },
    async editRestaurant() {
      // let id = item.id
      // this.tabIndex = 1
      // const response = await getListItemsOrItem('restaurant', id, 'api', 'admin')
      // this.restaurant = response[0]
      // console.log('this.restaurant',this.restaurant.restaurantCategories)
      // this.restaurant.restaurantCategories[0].forEach((category) => {
      //   this.restaurantCategories.push({value: category.id, text: category.name})
      //   //tymczosowo - trzeba dodać pobieranie wszystkich kategori
      //   this.restaurantsCategories.push({value: category.id, text: category.name})
      // })
      // console.log(this.restaurant)
    },
    async addNewDishCategory() {
      let response = await postData('addDishCategory', {name: this.dish.categoryName, description: this.dish.categoryDescription}, this.$cookie.get('token'))
      this.$store.state.info.showing = false
      this.$store.state.info.text = response.data['message']
      if(response.status === 201) {
        this.$store.state.info.color = 'success'
        this.dishesCategories = await getListItemsOrItem('getDishesCategories', 0, 'api', 'admin')
        this.dish.categoryName = ''
        this.dish.categoryDescription = ''
        this.newCategory = false
      } else {
        this.$store.state.info.color = 'warning'
      }
      this.$store.state.info.showing = true
    },
    async addNewIngridientCategory() {
      let response = await postData('addIngridientCategory', {name: this.ingridientCategory.name, description: this.ingridientCategory.description, isMultiOption: this.isMultiOption}, this.$cookie.get('token'))
      this.$store.state.info.showing = false
      this.$store.state.info.text = response.data['message']
      if(response.status === 201) {
        this.$store.state.info.color = 'success'
        this.ingridientsCategories = await getListItemsOrItem('getIngridientsCategories', 0, 'api', 'admin')
        this.isMultiOption = false
        this.ingridientCategory.name = ''
        this.ingridientCategory.description = ''
        this.newIngridientCategory = false
      } else {
        this.$store.state.info.color = 'warning'
      }
      this.$store.state.info.showing = true
    }
  }
}
</script>