<template>
  <v-container fluid>
    <v-card flat elevation="1">
      <v-card-title class="pa-0">
        <v-tabs v-model="tabIndex" class="secondary" fixed-tabs>
          <v-tab>Użytkownicy systemu</v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tabIndex">
        <v-tab-item>
          <v-card-text>
            <v-data-table
                :disable-sort="false"
                :loading="loading"
                :headers="headers"
                :items="users"
                item-key="id"
                :items-per-page="15"
                dense
            >
              <template v-slot:[`item.roles`]="{ item }">
                <div v-for="(role, index) in item.roles" :key="index">
                  <v-chip  small color="primary" v-if="role === 'ROLE_USER'">KLIENT</v-chip>
                  <v-chip small color="accent" class="text--primary" v-if="role === 'ROLE_COURIER'">KURIER</v-chip>
                  <v-chip small color="blue" style="color: aliceblue" v-if="role === 'ROLE_OWNER'">WŁAŚCICIEL</v-chip>
                  <v-chip small color="secondary" class="text--primary" v-if="role === 'ROLE_RESTAURANT'">RESTAURACJA</v-chip>
                  <v-chip small v-if="role === 'ROLE_SUPERUSER'">ADMINISTRATOR</v-chip>
                </div>
              </template>
              <template v-slot:[`item.dateOfBirth`]="{ item }">
                <v-icon v-if="item.dateOfBirth" color="secondary" class="mr-1" small>mdi-calendar-range</v-icon>
                <span v-if="item.dateOfBirth">{{formatDate(item.dateOfBirth.date)}}r.</span>
                <span v-else>Brak daty urodzenia</span>
              </template>
              <template v-slot:[`item.options`]="{ item }">
                <v-btn icon >
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
  name: 'configUsers',
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
      users: [],
      dish: {
        id: null,
        name: '',
        description: '',
        categoryName: '',
        categoryDescription: ''
      },
      openingHoursRestaurant: [],
      headers: [
        { text: 'Imię', align: 'start', value: 'firstName', sortable: false, },
        { text: 'Nazwisko', align: 'center', value: 'surname', sortable: false, },
        { text: 'Email', align: 'center', value: 'email', sortable: false, },
        { text: 'Data urodzenia', align: 'center', value: 'dateOfBirth', sortable: false, },
        { text: 'Numer telefonu', align: 'center', value: 'phoneNumber', sortable: false, },
        { text: 'Role', align: 'center', value: 'roles', sortable: false, },
        { text: 'Adres', align: 'center', value: 'fullAddress', sortable: false, },
        { text: 'Opcje', align: 'center', value: 'options', sortable: false, },
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.users = await getListItemsOrItem('getUsers', 0, 'api', 'admin')
      if(!Array.isArray(this.users)) {
        this.$store.state.info.showing = false
        this.$store.state.info.text = this.users.message
        this.$store.state.info.color = 'warning'
        this.$store.state.info.showing = true
        this.$cookie.delete('token')
        setTimeout(() => {
          this.$router.push('/home')
          window.location.reload(true);
        }, 1500);
      }
      if (this.users.length > 0) {
        this.users = this.users.map(user => ({ ...user, options: '' }))
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
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Data jest niepoprawna
        return 'Nieprawidłowa data';
      }
      return date.toLocaleDateString('pl-PL');
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