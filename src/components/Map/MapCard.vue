<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const store = useAppStore()

const selectedSystem = storeToRefs(store).getSelectedSystem
</script>

<template>
  <v-card v-if="selectedSystem" class="ma-5 system-info" style="position: absolute; top: 0; right: 0" width="300"
    color="background" variant="elevated" :title="selectedSystem.name"
    :subtitle="`( ${selectedSystem.x} , ${selectedSystem.y} )`">
    <v-card-text>
      <div class="d-flex ga-2">
        <v-chip v-if="selectedSystem.station?.buyShips" color="lime" prepend-icon="mdi-satellite-variant">
          Buy Ships
        </v-chip>
        <v-chip v-if="selectedSystem.station?.directSell" color="light-green" prepend-icon="mdi-currency-sign">
          Direct Sell
        </v-chip>
        <v-chip v-if="selectedSystem.asteroid?.miningResourceId"
          :prepend-icon="`custom:${selectedSystem.asteroid?.miningResourceId}`"
          :color="store.getResourceColor(selectedSystem.asteroid.miningResourceId)">
          {{ store.getResourceById(selectedSystem.asteroid.miningResourceId)?.name }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>
