<template>
  <v-app>
    <v-app-bar app hide-on-scroll>
      <v-tabs class="text--secondary">
        <template v-for="(item, index) in mainTabs">
          <v-tab
              :key="index"
              :to="item.path"
              :disabled="(item.text === 'Dostawa' && loggedUser === '') || (item.text === 'Ulubione' && loggedUser === '') || item.disabled ? true : false">
            <font-awesome-icon :icon="item.icon" class="mr-3"/>
            <span>{{item.text}}</span>
          </v-tab>
        </template>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="primary" fab dense v-if="isUser" v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(item, index) in userMenu" :key="index">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logOut()">
            <v-list-item-title>Wyloguj</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog v-model="dialog" persistent :max-width="$vuetify.breakpoint.thresholds.sm">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="primary" v-if="!isUser" v-bind="attrs" v-on="on">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-3"/>
              LOGOWANIE/REJESTRACJA
            </v-btn>
          </template>
          <v-card>
            <v-card-title  class="pa-0">
              <v-tabs v-model="tabIndex" class="secondary">
                <v-tab>Logowanie</v-tab>
                <v-tab>Rejestracja</v-tab>
              </v-tabs>
            </v-card-title>
            <v-tabs-items v-model="tabIndex">
              <v-tab-item>
                <v-form @submit.prevent="handleSubmitLogin">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-img src="https://i.ibb.co/f1Qr5B2/logo-transparent.png" max-width="300"></v-img>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field outlined v-model="userLogin.email" label="Email"></v-text-field>
                          <v-text-field outlined v-model="userLogin.password" label="Hasło" type="password"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false">
                      <font-awesome-icon size="lg" icon="fa-solid fa-xmark" class="mr-2"/>
                      Zamknij
                    </v-btn>
                    <v-btn text @click="handleSubmitLogin()">
                      <font-awesome-icon size="lg" icon="fa-solid fa-right-to-bracket" class="mr-2"/>
                      Zaloguj
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-tab-item>
              <v-tab-item>
                <v-form @submit.prevent="handleSubmitRegister">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col class="col-12">
                          <v-divider class="primary"></v-divider>
                          <div class="text-center ma-3">
                            DANE PODSTAWOWE
                          </div>
                          <v-divider class="primary"></v-divider>
                        </v-col>
                        <v-col class="col-12">
                          <v-text-field v-model="userRegister.email" label="Email"></v-text-field>
                        </v-col>
                        <v-col class="col-6">
                          <v-text-field v-model="userRegister.password" label="Hasło" type="password"></v-text-field>
                          <v-text-field v-model="userRegister.firstName" label="Imię"></v-text-field>
                          <v-text-field v-model="userRegister.phoneNumber" label="Numer telefonu"></v-text-field>
                        </v-col>
                        <v-col class="col-6">
                          <v-text-field v-model="userRegister.repeatPassword" label="Powtórz hasło" type="password"></v-text-field>
                          <v-text-field v-model="userRegister.surname" label="Nazwisko"></v-text-field>
                          <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="userRegister.dateOfBirth"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                  v-model="userRegister.dateOfBirth"
                                  label="Data urodzenia"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="userRegister.dateOfBirth"
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
                                  @click="$refs.menu.save(userRegister.dateOfBirth)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col class="col-12">
                          <v-divider class="primary"></v-divider>
                          <div class="text-center ma-3">
                            ADRES
                          </div>
                          <v-divider class="primary"></v-divider>
                        </v-col>
                        <v-col class="col-6">
                          <v-text-field v-model="userRegister.mainAddress.street" label="Ulica"></v-text-field>
                        </v-col>
                        <v-col class="col-3">
                          <v-text-field v-model="userRegister.mainAddress.parcelNumber" label="Nr domu"></v-text-field>
                        </v-col>
                        <v-col class="col-3">
                          <v-text-field v-model="userRegister.mainAddress.apartmentNumber" label="Nr mieszkania"></v-text-field>
                        </v-col>
                        <v-col class="col-3">
                          <v-text-field v-model="userRegister.mainAddress.postcode" label="Kod pocztowy"></v-text-field>
                        </v-col>
                        <v-col class="col-6">
                          <v-text-field v-model="userRegister.mainAddress.city" label="Miasto"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false">
                      <font-awesome-icon size="lg" icon="fa-solid fa-xmark" class="mr-2"/>
                      Zamknij
                    </v-btn>
                    <v-btn text @click="handleSubmitRegister()">
                      <font-awesome-icon size="lg" icon="fa-solid fa-right-to-bracket" class="mr-2"/>
                      Zarejestruj
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-dialog>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main style="background-color: #FDF5ED">
      <!-- Provides the application the proper gutter -->
      <v-container fluid style="background-color: #FDF5ED">
        <!-- If using vue-router -->
        <v-slide-y-transition mode="out-in">
          <router-view style="background-color: #FDF5ED" class="py-8"></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>

    <v-footer app class="pa-0">
      <v-card width="100%" class="text-center" color="secondary">
        <v-card-text class="pa-1">
<!--          <v-row>-->
<!--            <v-col class="col-3"></v-col>-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-col class="col-3">-->
<!--              <v-tabs hide-slider class="text&#45;&#45;secondary">-->
<!--                <v-tab :ripple="false" v-for="(item, index) in mainTabs" :key="index" :to="item.path">-->
<!--                  <span>{{item.text}}</span>-->
<!--                </v-tab>-->
<!--              </v-tabs>-->
<!--            </v-col>-->
<!--          </v-row>-->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="pa-1">
          <span :style="'color: ' + footerTextColor">web-app-vue2 | 1.0.0</span>
        </v-card-text>
      </v-card>
    </v-footer>
    <v-snackbar :color="$store.state.info.color" right bottom v-model="$store.state.info.showing" :timeout="$store.state.info.timeout">
      <span class="text-overline text-center">{{$store.state.info.text}}</span>
      <v-progress-circular indeterminate class="ml-3" v-if="$store.state.info.loading"></v-progress-circular>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="closeInfo()">
          Zamknij
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import {checkRoles, login, register} from "@/functions/common";

  export default {
    name: 'MainLayout',
    data() {
      return {
        menu: false,
        footerTextColor: null,
        mainTabs: [
          {value: 1, text:'Restauracje', icon: 'fa-solid fa-utensils', path: '/restaurants', roles: ['ROLE_USER'], disabled: false},
          {value: 2, text:'Dostawa', icon: 'fa-solid fa-person-biking', path: '/test', roles: ['ROLE_USER'], disabled: true},
          {value: 3, text:'Kontakt', icon: 'fa-solid fa-phone-flip', path: '/test',  roles: ['ROLE_USER'], disabled: false},
          {value: 4, text:'Konfiguracja', icon: 'fa-solid fa-screwdriver-wrench', path: '/config',  roles: ['ROLE_SUPERUSER'], disabled: true},
          {value: 5, text:'Ulubione', icon: 'fa-solid fa-heart', path: '/favoriteRestaurants',  roles: ['ROLE_USER'], disabled: true}
        ],
        userMenu: [
          {value: 1, text:'Mój profil', path: '/restaurants'}
        ],
        isUser: false,
        dialog: false,
        tabIndex: 0,
        userLogin: {
          email: '',
          password: '',
        },
        userRegister: {
          email: '',
          password: '',
          repeatPassword: '',
          firstName: '',
          surname: '',
          phoneNumber: '',
          mainAddress: {
            street: '',
            parcelNumber: '',
            apartmentNumber: '',
            postcode: '',
            city: '',
          },
          contactAddress: {
            street: '',
            parcelNumber: '',
            apartmentNumber: '',
            postcode: '',
            city: '',
          },
        },
        loggedUser: '',
        roles: []
      }
    },
    created() {
      this.footerTextColor = this.$vuetify.theme.themes.light.primary
      console.log(this.$cookie.get('token'))
      if(this.$cookie.get('token')) {
        this.isUser = true
        this.loggedUser = this.userLogin.email
        this.$store.state.info.showing = false
        this.$store.state.info.loading = false
        this.$store.state.info.text = 'Pomyślnie zalogowano'
        this.$store.state.info.color = 'success'
        this.$store.state.info.showing = true
      } else {
        this.dialog = true
        this.$store.state.info.showing = false
        this.$store.state.info.loading = false
        this.$store.state.info.text = 'Użytkownik niezalogowany'
        this.$store.state.info.color = 'info'
        this.$store.state.info.showing = true
      }
      this.roles = checkRoles(this.$cookie.get('token'))
      if(this.roles) {
        this.mainTabs.map(tab => {
          if(tab.roles.length > 0) {
            let exist = tab.roles.some(element => this.roles.includes(element))
            if(exist) {
              tab.disabled = false
            }
          }
        })
      }

    },
    methods: {
      handleSubmitLogin() {
        this.logIn()
        this.dialog = false
      },
      closeInfo() {
        this.$store.state.info.text = ''
        this.$store.state.info.timeout = 3000
        this.$store.state.info.showing = false
        this.$store.state.info.loading = false
      },
      handleSubmitRegister() {
        this.signUp()
        this.dialog = false
      },
      async signUp() {
        const response = await register(this.userRegister);
        if(response === 0) {
          this.tabIndex = 0
          this.$store.state.info.showing = false
          this.$store.state.info.loading = false
          this.$store.state.info.text = 'Pomyślnie zarejestrowano do systemu'
          this.$store.state.info.color = 'success'
          this.$store.state.info.showing = true
          this.userLogin.email = this.userRegister.email
          this.userLogin.password = this.userRegister.password
          await this.logIn()
        } else {
          this.$store.state.info.showing = false
          this.$store.state.info.loading = false
          this.$store.state.info.text = response[0]
          this.$store.state.info.color = 'warning'
          this.$store.state.info.showing = true
        }
      },
      async logIn() {
        const email = this.userLogin.email
        const password = this.userLogin.password

        const response = await login(email, password)
        if(response !== -1) {
          this.$cookie.set('token', response, 1)
          this.isUser = true
          this.loggedUser = this.userLogin.email
          this.$store.state.info.showing = false
          this.$store.state.info.loading = true
          this.$store.state.info.text = 'Logowanie...'
          this.$store.state.info.color = 'info'
          this.$store.state.info.showing = true
          setTimeout(() => {
            window.location.reload(true);
          }, 1500);
        } else {
          this.$store.state.info.showing = false
          this.$store.state.info.loading = false
          this.$store.state.info.text = 'Niepoprawne dane logowania'
          this.$store.state.info.color = 'warning'
          this.$store.state.info.showing = true
        }
      },
      logOut() {
        this.$cookie.delete('token')
        this.isUser = false
        this.loggedUser = ''
        this.$store.state.info.showing = false
        this.$store.state.info.loading = true
        this.$store.state.info.text = 'Wylogowywanie...'
        this.$store.state.info.color = 'info'
        this.$store.state.info.showing = true
        setTimeout(() => {
          this.$router.push('/home')
          window.location.reload(true);
        }, 1500);
        this.$router.push('/home')
      }
    },
  }
</script>