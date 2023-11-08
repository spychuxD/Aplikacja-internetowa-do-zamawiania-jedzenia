<template>
  <div>
    <GmapMap
        map-type-id="terrain"
        :center="{lat: coordinates.lat, lng: coordinates.lng}"
        :zoom="15"
        style="height: 300px"
    >
      <GmapMarker
          label="R"
          :position="center"
          :clickable="true"
          :draggable="true"
          @click="center={lat: coordinates.lat, lng: coordinates.lng}"
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
      center: {
        lat: 0,
        lng: 0
      },
      coordinates: {
        apiKey: 'AIzaSyD40ckrPhTz4c1PvOQxx2VWPMV_Znb_B2o',
        lat: 0,
        lng: 0
      }
    }
  },
  mounted() {
    this.$getLocation().then(location => {
      this.coordinates.lat = location.lat
      this.center.lat = location.lat
      this.coordinates.lng = location.lng
      this.center.lng = location.lng
      console.log(this.coordinates.lat)
      console.log(this.coordinates.lng)
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>
