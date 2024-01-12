<script lang="ts" setup>
import Map from '@/components/Map'
import Fleets from '@/components/Fleets'
</script>

<template>
  <div class="container fill-height">
    <Map></Map>
    <Fleets></Fleets>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1.5fr 750px;
  grid-template-rows: 1fr 1fr;
  padding: 1em;
  gap: 0;
  grid-auto-flow: row;
  grid-template-areas:
    "map fleets"
    "map fleets";
}

.system {
  grid-area: system;
}

.map {
  grid-area: map;
}

.fleets {
  grid-area: fleets;
}
</style>