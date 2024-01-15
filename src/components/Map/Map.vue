<script lang="ts" setup>
import MapGraph from './MapGraph.vue'
</script>

<template>
  <v-sheet class="map pa-0 ma-2 fill-height" style="position: relative">
    <div class="text-h4 font-weight-medium pa-6" style="position: absolute; top: 0; left: 0">
      System Map
    </div>
    <MapGraph />
  </v-sheet>
</template>

<style scoped>
.fleets {
  grid-area: map;
}
</style>