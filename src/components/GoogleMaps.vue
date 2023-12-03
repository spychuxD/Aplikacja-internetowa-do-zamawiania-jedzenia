<template>
  <div>
    <GmapMap
        map-type-id="terrain"
        :center="mapCoordinates"
        :zoom="13"
        :style='"height: " + height + "px"'
        ref="mapRef"
    >
      <GmapMarker
          v-for="(restaurantCoordinates, index) in markers"
          :key="index"
          :position="restaurantCoordinates"
          :clickable="true"
      />
      <GmapMarker
          v-if="isUserLocation"
          :position="myCoordinates"
          :clickable="true"
          :icon="'https://i.ibb.co/8dgvJYX/home-account.png'"
      />
    </GmapMap>
  </div>
</template>
<script>


export default {
  name: 'googleMaps',
  data() {
    return {
      icon: 'home-account.svg',
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
        lat: null,
        lng: null
      },
      isUserLocation: false
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
  watch: {
    addresses: {
      handler: 'geoCoder',
      immediate: true,
    },
  },
  created() {
    this.geoCoder(this.addresses)
    this.getUserLocation()
    // this.$getLocation().then(coordinates => {
    //   this.myCoordinates.lat = coordinates.lat
    //   this.myCoordinates.lng = coordinates.lng
    // }).catch(error => alert(error))
  },
  methods: {
    geoCoder() {
      if (this.addresses.length > 0) {
        this.addresses.forEach(addressObj => {
          this.$geocoder.send(addressObj, response => {
            if (response.status === 'OK') {
              if(response.results.length === 1) {
                this.markers.push({lng: response.results[0].geometry.location.lng, lat: response.results[0].geometry.location.lat})
              }
            }
          });
        })
      }
    },
    getUserLocation() {
      let address = localStorage.getItem('address')
      if(address) {
        this.myCoordinates = JSON.parse(address)
        this.isUserLocation = true
      }
    }
  }
}
</script>
