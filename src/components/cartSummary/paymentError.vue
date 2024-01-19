<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-icon size="124" color="error" class="mx-auto mb-8">mdi-alpha-x</v-icon>
        </v-row>
        <div class="text-center text-uppercase text-h4">Błąd podczas przetwarzania płatności!</div>
        <v-row>
          <v-btn class="mx-auto mt-8 mb-8" @click="$router.push('/cartSummary')">Spróbuj ponownie</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'paymentError'
}
</script>