<template>
  <v-container fluid>
    <v-card flat elevation="1">
      <v-card-title class="pa-0">
        <v-tabs v-model="tabIndex" class="secondary" fixed-tabs>
          <v-tab>Restauracje</v-tab>
          <v-tab>Dodaj restauracje</v-tab>
        </v-tabs>
      </v-card-title>
      <v-tabs-items v-model="tabIndex">
        <v-tab-item>
          <v-card-text>
            <v-data-table
                :disable-sort="false"
                :loading="loading"
                :headers="headers"
                :items="restaurants"
                item-key="id"
                :items-per-page="15"
                dense
            >
              <template v-slot:[`item.email`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-at</v-icon> {{item.email}}
              </template>
              <template v-slot:[`item.phoneNumber`]="{ item }">
                <v-icon color="secondary" class="mr-1" small>mdi-phone</v-icon> {{item.phoneNumber}}
              </template>
              <template v-slot:[`item.options`]="{ item }">
                <v-menu
                    left
                    v-model="item.options"
                    :close-on-content-click="false"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-bind="attrs" v-on="{ ...tooltip, ...menu }" icon color="secondary" v-if="item"><v-icon>mdi-cog</v-icon></v-btn>
                      </template>
                      <span>Opcje</span>
                    </v-tooltip>
                  </template>
                  <v-list color="secondary">
                    <v-list-item-group v-model="selectedItem">
                      <v-list-item @click="()=> {
                        editRestaurant(item)
                        item.options = true
                      }">
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-cog</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="'Edytuj dane o restauracji'"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-plus</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="'Dodaj nowe dania dla restauracji'"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <v-row class="text-center mt-3 px-5 mb-15">
              <v-col>
                <v-text-field v-model="restaurant.name" label="Nazwa restauracji"></v-text-field>
              </v-col>
              <v-col>
                <v-textarea auto-grow rows="1" v-model="restaurant.description" label="Opis"></v-textarea>
              </v-col>
              <v-col :v-if="!newUser">
                <v-text-field v-model="restaurant.email" label="E-mail restauracji"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.phoneNumber" label="Numer telefonu do restauracji"></v-text-field>
              </v-col>
              <v-col>
                <v-checkbox v-model="newUser" label="Dodaj nowego właściciela do systemu"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="newUser" class="px-10">
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">NOWY WŁAŚCICIEL</span><br/>
                <v-divider class="text--primary"></v-divider><br/>
              </v-col>
            </v-row>
            <v-row v-if="newUser" class="px-15">
              <v-col>
                <v-text-field v-model="restaurant.owner.email" label="E-mail"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.password" type="password" label="Hasło"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.firstName" label="Imię"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.surname" label="Nazwisko"></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="newUser" class="px-15 mb-15">
              <v-col>
                <v-text-field v-model="restaurant.owner.phoneNumber" label="Numer telefonu"></v-text-field>
              </v-col>
              <v-col>
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="restaurant.owner.dateOfBirth"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="restaurant.owner.dateOfBirth"
                        label="Data urodzenia"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="restaurant.owner.dateOfBirth"
                      label="Data urodzenia"
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                      ANULUJ
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(restaurant.owner.dateOfBirth)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row v-if="newUser" class="px-10">
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">ADRES GŁÓWNY WŁAŚCICIELA</span><br/>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row v-if="newUser" class="px-15 mb-15">
              <v-col>
                <v-text-field v-model="restaurant.owner.mainAddress.street" label="Ulica"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.mainAddress.parcelNumber" label="Numer budynku"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.mainAddress.apartmentNumber" label="Numer mieszkania"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.mainAddress.postcode" label="Kod pocztowy"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.owner.mainAddress.city" label="Miasto"></v-text-field>
              </v-col>
              <v-col>
                <v-checkbox v-model="contactAddress" label="Zaznacz, aby dodać adres korespondencyjny"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="newUser && contactAddress" class="px-10">
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">ADRES KORESPONDECYJNY WŁAŚCICIELA</span><br/>
                <v-divider></v-divider>
              </v-col>
            </v-row>
<!--            <v-row v-if="newUser && contactAddress" class="px-15 mb-15">-->
<!--              <v-col>-->
<!--                <v-text-field v-model="restaurant.contactAddress.street" label="Ulica"></v-text-field>-->
<!--              </v-col>-->
<!--              <v-col>-->
<!--                <v-text-field v-model="restaurant.contactAddress.parcelNumber" label="Numer budynku"></v-text-field>-->
<!--              </v-col>-->
<!--              <v-col>-->
<!--                <v-text-field v-model="restaurant.contactAddress.apartmentNumber" label="Numer mieszkania"></v-text-field>-->
<!--              </v-col>-->
<!--              <v-col>-->
<!--                <v-text-field v-model="restaurant.contactAddress.postcode" label="Kod pocztowy"></v-text-field>-->
<!--              </v-col>-->
<!--              <v-col>-->
<!--                <v-text-field v-model="restaurant.contactAddress.city" label="Miasto"></v-text-field>-->
<!--              </v-col>-->
<!--            </v-row>-->
            <v-row>
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">KATEGORIA RESTAURACJI</span><br/>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row class="px-5 mb-15">
              <v-col>
                <v-combobox v-model="restaurantCategories" multiple chips :items="restaurantsCategories" label="Kategoria restauracji"></v-combobox>
              </v-col>
              <v-col>
                <v-checkbox v-model="newCategory" label="Zaznacz, aby dodać nową kategorię"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="newCategory" class="px-10">
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">NOWA KATEGORIA RESTAURACJI</span><br/>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row v-if="newCategory" class="px-15 mb-15">
              <v-col>
                <v-text-field v-model="restaurant.restaurantCategories.name" label="Nazwa"></v-text-field>
              </v-col>
              <v-col>
                <v-textarea auto-grow rows="1" v-model="restaurant.restaurantCategories.description" label="Opis"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">ADRES RESTAURACJI</span><br/>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row class="px-5 mb-15">
              <v-col>
                <v-text-field v-model="restaurant.address.street" label="Ulica"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.address.parcelNumber" label="Numer budynku"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.address.apartmentNumber" label="Numer mieszkania"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.address.postcode" label="Kod pocztowy"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="restaurant.address.city" label="Miasto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-divider></v-divider>
                <span class="text-h6 ml-3">DNI I GODZINY OTWARCIA RESTAURACJI</span><br/>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row v-for="(item, index) in openingHoursRestaurant" :key="index" class="px-5">
              <v-col>
                <v-select v-model="item.daysFrom" :items="daysFrom" label="Dzień od"></v-select>
              </v-col>
              <v-col>
                <v-menu
                    v-model="item.menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        label="Godzina od"
                        v-model="openingHoursRestaurant[index].hourFrom"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                      format="24hr"
                      label="Godzina od"
                      v-model="item.hourFrom"
                      scrollable
                      landscape
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="openingHoursRestaurant[index].menu1 = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="save(item.hourFrom, index)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-select v-model="item.daysTo" :items="daysTo" label="Dzień do"></v-select>
              </v-col>
              <v-col>
                <v-menu
                    v-model="item.menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="openingHoursRestaurant[index].hourTo"
                        label="Godzina do"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                      format="24hr"
                      label="Godzina do"
                      v-model="item.hourTo"
                      scrollable
                      landscape
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="openingHoursRestaurant[index].menu2 = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="save(item.hourTo, index, 1)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
              </v-col>
              <v-col class="col-1 mt-3">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn :disabled="openingHoursRestaurant.length<=1" v-bind="attrs" v-on="on" icon color="error" class="mx-auto" @click="removeDate(index)"><v-icon >mdi-minus-thick</v-icon></v-btn>
                  </template>
                  <span>Usuń dzień/przedział</span>
                </v-tooltip>
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
            <v-btn text @click="addNewRestaurant()">
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
  name: 'configRestaurants',
  data() {
    return {
      selectedItem: -1,
      options: false,
      menu: false,
      menu1: false,
      time1: null,
      time2: null,
      menu2: false,
      contactAddress: false,
      newUser: false,
      newCategory: false,
      restaurantCategories: [],
      restaurantsCategories: [],
      tabIndex: 0,
      loading: true,
      restaurants: [],
      restaurant: {
        id: null,
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
        address: {},
        restaurantCategories: [],
        owner: {
          mainAddress: {}
        },
        openingHoursRestaurant: []
      },
      openingHoursRestaurant: [],
      daysFrom: [
        'PONIEDZIAŁEK',
        'WTOREK',
        'ŚRODA',
        'CZWARTEK',
        'PIĄTEK',
        'SOBOTA',
        'NIEDZIELA'
      ],
      daysTo: [
        'TEN SAM DZIEŃ',
        'PONIEDZIAŁEK',
        'WTOREK',
        'ŚRODA',
        'CZWARTEK',
        'PIĄTEK',
        'SOBOTA',
        'NIEDZIELA'
      ],
      headers: [
        {
          text: 'Nazwa',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Opis', value: 'description', sortable: false, },
        { text: 'E-mail', value: 'email', sortable: false, },
        { text: 'Numer telefonu', value: 'phoneNumber', sortable: false, },
        { text: 'Opcje', value: 'options', sortable: false, }
      ]
    }
  },
  created() {
    this.openingHoursRestaurant.push({
      menu1: false,
      menu2: false,
      hourFrom: '',
      hourTo: '',
      daysFrom: this.daysFrom,
      daysTo: this.daysTo
    })
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.restaurants = await getListItemsOrItem('restaurants')
      if (this.restaurants.length > 0) {
        this.restaurants = this.restaurants.map(restaurant => ({ ...restaurant, options: false }))
      }
      this.loading = false
    },
    newDate() {
      this.openingHoursRestaurant.push({
        menu1: false,
        menu2: false,
        hourFrom: '',
        hourTo: '',
        daysFrom: this.daysFrom,
        daysTo: this.daysTo
      })
    },
    removeDate(index) {
      this.openingHoursRestaurant.splice(index,1)
    },
    save(hour, index, fromTo = 0) {
      if(fromTo === 0) {
        this.openingHoursRestaurant[index].hourFrom = hour
        this.openingHoursRestaurant[index].menu1 = false
      } else {
        this.openingHoursRestaurant[index].hourTo = hour
        this.openingHoursRestaurant[index].menu2 = false
      }
    },
    async editRestaurant(item) {
      let id = item.id
      this.tabIndex = 1
      const response = await getListItemsOrItem('restaurant', id, 'api', 'admin')
      this.restaurant = response[0]
      console.log('this.restaurant',this.restaurant.restaurantCategories)
      this.restaurant.restaurantCategories[0].forEach((category) => {
        this.restaurantCategories.push({value: category.id, text: category.name})
        //tymczosowo - trzeba dodać pobieranie wszystkich kategori
        this.restaurantsCategories.push({value: category.id, text: category.name})
      })
      console.log(this.restaurant)
    },
    async addNewRestaurant() {
      this.restaurant.openingHoursRestaurant = this.openingHoursRestaurant
      let response = await postData('addRestaurant', this.restaurant, this.$cookie.get('token'))
      this.$store.state.info.showing = false
      this.$store.state.info.text = response.data['message']
      if(response.status === 201) {
        this.$store.state.info.color = 'success'
      } else {
        this.$store.state.info.color = 'warning'
      }
      this.$store.state.info.showing = true
    }
  }
}
</script>