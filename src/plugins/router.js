// src/router.js
import Vue from 'vue';
import Router from 'vue-router';

// Import komponentów
import Layout from '../components/Layout'
import RestaurantMenu from '../components/restaurants/menu/index'
import Restaurants from '../components/restaurants/index'
import HomePage from '../components/home/index'
import ErrorView404 from '../components/errors/error404'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/home',
          meta: {
            title: 'Strona Główna'
          },
          component: HomePage
        },
        {
          path: '/restaurants',
          meta: {
            title: 'Restauracje'
          },
          component: Restaurants
        },
        {
          path: '/restaurant/:id/menu',
          meta: {
            title: 'Menu restauracji'
          },
          component: RestaurantMenu
        }
      ]
    },
    {
      path: '*',
      component: ErrorView404,
      meta: {
        title: 'ERROR404'
      }
    }
  ]
})