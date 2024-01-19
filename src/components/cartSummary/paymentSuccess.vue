<template>
  <v-container >
    <v-card>
      <v-card-text>
        <v-row>
          <v-icon size="124" color="success" class="mx-auto mb-8">mdi-check</v-icon>
        </v-row>
        <div class="text-center text-uppercase text-h3">Płatność zrealizowana pomyślnie!</div>
        <div class="text-center text-uppercase text-h4">Teraz możesz śledzić swoje zamówienie</div>
        <v-row>
          <v-btn class="mx-auto mt-8 mb-8" @click="$router.push('/trackingOrder/'+ order)">POKAŻ</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script >
export default {
  name: 'paymentSuccess',
  data() {
    return {
      order: null
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      this.order = localStorage.getItem('order')
    }
  }
}
</script>