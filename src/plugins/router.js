// src/router.js
import Vue from 'vue';
import Router from 'vue-router';

// Import komponentów
import Layout from '../components/Layout'
import RestaurantMenu from '../components/restaurants/menu/index'
import Restaurants from '../components/restaurants/index'
import HomePage from '../components/home/index'
import ErrorView404 from '../components/errors/error404'
import CartSummary from '@/components/cartSummary/index'
import FavoriteRestaurants from '../components/restaurants/favorite/index'
import ConfigurationIndex from '../components/configuration/index'
import ConfigRestaurants from '../components/configuration/restaurants/show'
import Tracking from '../components/cartSummary/tracking'

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
        },
        {
          path: '/cartSummary',
          meta: {
            title: 'Podsumowanie zamówienia'
          },
          component: CartSummary
        },
        {
          path: '/trackingOrder/:id',
          meta: {
            title: 'Śledzenie zamówenia'
          },
          component: Tracking
        },
        {
          path: '/favoriteRestaurants',
          meta: {
            title: 'Ulubione restauracje'
          },
          component: FavoriteRestaurants
        },
        {
          path: '/config',
          meta: {
            title: 'Konfiguracja'
          },
          component: ConfigurationIndex
        },
        {
          path: '/config/restaurants',
          meta: {
            title: 'Edycja restauracji'
          },
          component: ConfigRestaurants
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