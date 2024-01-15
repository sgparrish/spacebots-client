<script lang="ts" setup>
import Map from '@/components/Map'
import System from '@/components/System'
import Fleets from '@/components/Fleets'
</script>

<template>
  <div class="container fill-height">
    <Map></Map>
    <System></System>
    <Fleets></Fleets>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1.5fr 500px 750px;
  grid-template-rows: 1fr;
  padding: 1em;
  gap: 0;
  grid-auto-flow: row;
  grid-template-areas:
    "map system fleets";
}
</style>