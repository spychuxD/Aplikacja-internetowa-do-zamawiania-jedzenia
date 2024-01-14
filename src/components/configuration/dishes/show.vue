<template>
  <v-container fluid>
    <v-card flat elevation="1">
      <v-card-title class="pa-0">
        <v-tabs v-model="tabIndex" class="secondary" fixed-tabs>
          <v-tab>Dania</v-tab>
          <v-tab>Dodaj danie</v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tabIndex">
        <v-tab-item>
          <v-card-text>
            <v-data-table
                :disable-sort="false"
                :loading="loading"
                :headers="headers"
                :items="dishes"
                item-key="id"
                :items-per-page="15"
                dense
            >
              <template v-slot:[`item.price`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-cash</v-icon> {{item.price.toFixed(2)}} zł
              </template>
              <template v-slot:[`item.restaurantName`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-store</v-icon> {{item.restaurantName}}
              </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <v-row class="text-center mt-3 px-5 mb-15">
              <v-col>
                <v-text-field v-model="dish.name" label="Nazwa dania"></v-text-field>
              </v-col>
              <v-col>
                <v-textarea auto-grow rows="1" v-model="dish.description" label="Opis dania"></v-textarea>
              </v-col>
              <v-col>
                <v-autocomplete v-model="dish.category" :items="dishesCategories" label="Kategoria dania"></v-autocomplete>
              </v-col>
              <v-col>
                <v-checkbox v-model="newCategory" label="Dodaj nową kategorię dania"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="newCategory"  class="px-10">
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">NOWA KATEGORIA DANIA</span><br/>
                <v-divider class="text--primary"></v-divider><br/>
              </v-col>
            </v-row>
            <v-row v-if="newCategory" class="px-10">
              <v-col>
                <v-text-field v-model="dish.categoryName" label="Nazwa kategorii"></v-text-field>
              </v-col>
              <v-col>
                <v-textarea auto-grow rows="1" v-model="dish.categoryDescription" label="Opis kategorii"></v-textarea>
              </v-col>
              <v-col>
                <v-btn text @click="addNewDishCategory()" class="mt-3">
                  <v-icon class="mr-3">mdi-content-save-check</v-icon>
                  Dodaj
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">DODATKI DO DANIA</span><br/>
                <v-divider class="text--primary"></v-divider><br/>
              </v-col>
            </v-row>
            <v-row v-for="(item, index) in dishIngridients" :key="index" class="px-5">
              <v-col class="col-3">
                <v-select v-model="item.ingridientsCategories" :items="ingridientsCategories" label="Kategoria dodatku"></v-select>
              </v-col>
              <v-col class="col-3">
                <v-select v-model="item.ingridients" :items="ingridients" label="Dodatek"></v-select>
              </v-col>
              <v-col class="col-1 mt-3">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn :disabled="dishIngridients.length<=1" v-bind="attrs" v-on="on" icon color="error" class="mx-auto" @click="removeDate(index)"><v-icon >mdi-minus-thick</v-icon></v-btn>
                  </template>
                  <span>Usuń dzień/przedział</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-2">
                <v-checkbox v-model="isNewIngridient" label="Dodaj nowy dodatek do systemu"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="isNewIngridient">
              <v-col class="col-3">
                <v-text-field v-model="newIngridient.name" label="Nazwa dodatku"></v-text-field>
              </v-col>
              <v-col class="col-3">
                <v-text-field v-model="newIngridient.description" label="Opis dodatku"></v-text-field>
              </v-col>
              <v-col class="col-3">
                <v-select v-model="newIngridient.ingridientCategory" :items="ingridientsCategories" label="Kategoria dodatku"></v-select>
              </v-col>
              <v-col class="col-1">
                <v-btn text @click="addNewIngridient()" class="mt-3">
                  <v-icon class="mr-3">mdi-content-save-check</v-icon>
                  Dodaj
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox v-model="newIngridientCategory" label="Dodaj nową kategorię dla dodatku"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="newIngridientCategory"  class="px-10">
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">NOWA KATEGORIA DODATKU</span><br/>
                <v-divider class="text--primary"></v-divider><br/>
              </v-col>
            </v-row>
            <v-row v-if="newIngridientCategory"  class="px-10">
              <v-col>
                <v-text-field v-model="ingridientCategory.name" label="Nazwa kategorii"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="ingridientCategory.description" label="Opis kategorii"></v-text-field>
              </v-col>
              <v-col>
                <v-checkbox v-model="isMultiOption" label="Czy kategoria uwzględnia odpowiedzi wielkrotnego wyboru (np. kilka sosów)"></v-checkbox>
              </v-col>
              <v-col>
                <v-btn text @click="addNewIngridientCategory()" class="mt-3">
                  <v-icon class="mr-3">mdi-content-save-check</v-icon>
                  Dodaj
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="primary" class="mx-auto" @click="newDate()"><v-icon >mdi-plus-thick</v-icon></v-btn>
                </template>
                <span>Dodaj dzień/przedział</span>
              </v-tooltip>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="addNewDish()">
              <v-icon class="mr-3">mdi-content-save-check</v-icon>
              Zapisz/Dodaj
            </v-btn>
          </v-card-actions>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
import {getListItemsOrItem, postData} from "@/functions/common";

export default {
  name: 'configDishes',
  data() {
    return {
      isNewIngridient: false,
      ingridients: [],
      isMultiOption: false,
      newCategory: false,
      newIngridientCategory: false,
      ingridientsCategories: [],
      dishesCategories: [],
      dishIngridients: [{name: '', description: ''}],
      ingridientCategory: {name: '', description: ''},
      newIngridient: {
        name: '',
        description: '',
        ingridientCategory: ''
      },
      tabIndex: 0,
      loading: true,
      dishes: [],
      dish: {
        id: null,
        name: '',
        category: {},
        description: '',
        categoryName: '',
        categoryDescription: ''
      },
      openingHoursRestaurant: [],
      headers: [
        { text: 'Nazwa', align: 'start', value: 'dishName', sortable: false, },
        { text: 'Opis', value: 'dishDescription', sortable: false, },
        { text: 'Cena', value: 'price', sortable: false, },
        { text: 'Kategoria', value: 'categoryName', sortable: false, },
        { text: 'Opis', value: 'categoryDescription', sortable: false, },
        { text: 'Restauracja', value: 'restaurantName', sortable: false, }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    dishIngridients: {
      handler(newIng) {
        this.getIngridients(newIng)
      },
      deep: true
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.dishes = await getListItemsOrItem('getDishes', 0, 'api', 'admin')
      if(!Array.isArray(this.dishes)) {
        this.$store.state.info.showing = false
        this.$store.state.info.text = this.dishes.message
        this.$store.state.info.color = 'warning'
        this.$store.state.info.showing = true
        this.$cookie.delete('token')
        setTimeout(() => {
          this.$router.push('/home')
          window.location.reload(true);
        }, 1500);
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
    async getIngridients(item) {
      item.map(async(ele) => {
        console.log(ele)
        this .ingridients = await getListItemsOrItem('getCateogryIngridients', ele.ingridientsCategories, 'api', 'admin')
      })
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
    },
    async addNewIngridient() {
      let response = await postData('addIngridient', {name: this.newIngridient.name, description: this.newIngridient.description, ingridientCategory: this.newIngridient.ingridientCategory}, this.$cookie.get('token'))
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
    },
    async addNewDish() {
      let response = await postData('addDish', {name: this.dish.name, description: this.dish.description, category: this.dish.category, dishIngridients: this.ingridients}, this.$cookie.get('token'))
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