<template>
  <div>
    <GmapMap
        map-type-id="terrain"
        :center="mapCoordinates"
        :zoom="12"
        :style='"height: " + height + "px"'
        ref="mapRef"
    >
      <GmapMarker
          v-for="(restaurantCoordinates, index) in markers"
          :key="index"
          :position="restaurantCoordinates"
          :clickable="true"
      />

<!--      <GmapMarker-->
<!--          :position="center"-->
<!--          :clickable="true"-->
<!--          :draggable="true"-->
<!--          @click="center={lat: coordinates.lat+0.1, lng: coordinates.lng}"-->
<!--      />-->
    </GmapMap>
  </div>
</template>
<script>


export default {
  name: 'googleMaps',
  data() {
    return {
      map: null,
      markers: [],
      restaurantCoordinates: {
        lat: null,
        lng: null
      },
      mapCoordinates: {
        lat: 50.88,
        lng: 20.63
      },
      myCoordinates: {
        lat: 50.88,
        lng: 20.63
      }
    }
  },
  props: {
    height: {
      type: Number,
      required: true
    },
    addresses: {
      type: Array,
      required: true
    }
  },
  created() {
    if (this.addresses.length > 0) {
      this.addresses.forEach(addressObj => {
        this.$geocoder.send(addressObj, response => {
          if (response.status === 'OK') {
            if(response.results.length === 1) {
              console.log(response.results[0].geometry.location)
              this.markers.push({lng: response.results[0].geometry.location.lng, lat: response.results[0].geometry.location.lat})
              console.log(this.markers)
            }
          }
        });
      })
    }
    // this.$getLocation().then(coordinates => {
    //   this.myCoordinates.lat = coordinates.lat
    //   this.myCoordinates.lng = coordinates.lng
    // }).catch(error => alert(error))
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((mapObject) => {
      this.map = mapObject
    });
  },
  computed: {
    // mapCoordinates() {
    //   console.log(this.map)
    //   if(!this.map) {
    //     return {
    //       lat: 50,
    //       lng: 20
    //     }
    //   }
    //   return {
    //     lat: this.map.center.lat,
    //     lng: this.map.center.lng
    //   }
    // }
  }
}
</script>
