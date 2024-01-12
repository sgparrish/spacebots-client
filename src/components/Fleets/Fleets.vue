<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

import FleetCard from './FleetCard.vue'

const store = useAppStore()
const fleets = storeToRefs(store).getFleets
</script>

<template>
  <v-sheet class="fleets pa-2 ma-2 fill-height overflow-y-auto" color="transparent">
    <v-card-title class="text-h6 text-md-h5 text-lg-h4">My Fleets</v-card-title>
    <template v-for="fleet in fleets" :key="fleet.id">
      <FleetCard :fleet="fleet" />
    </template>
  </v-sheet>
</template>

<style scoped>
.fleets {
  grid-area: fleets;
}
</style>