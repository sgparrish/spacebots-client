<script lang="ts" setup>
import MapGraph from './MapGraph.vue'
import MapCard from './MapCard.vue'
</script>

<template>
  <v-sheet class="map pa-0 ma-2 fill-height" style="position: relative">
    <v-card-title class="text-h6 text-md-h5 text-lg-h4 ma-3" style="position: absolute; top: 0; left: 0">
      System Map
    </v-card-title>
    <MapGraph />
    <MapCard />
  </v-sheet>
</template>

<style scoped>
.fleets {
  grid-area: map;
}
</style>