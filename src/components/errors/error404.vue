<template >
  <v-container>
    <v-card >
      <v-card-text style="color: #E79E4F">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 720px">
          <v-icon size="200" style="color: #E79E4F; margin-bottom: 8px">mdi-emoticon-sad-outline</v-icon>
          <h1>404</h1>
          <a style="font-weight: bold; font-size: 32px;" href="/">Wróć</a>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
    export default {
        name: 'ErrorView404',
        methods: {
            back () {
                this.$router.go(-1)
            }
        }
    }
</script>