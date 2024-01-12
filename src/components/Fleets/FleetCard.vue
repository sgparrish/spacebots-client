<script lang="ts" setup>
import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'

import FleetStatus from './FleetStatus.vue'
import FleetShips from './FleetShips.vue'
import FleetCargo from './FleetCargo.vue'
import FleetActions from './FleetActions.vue'

defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()

</script>

<template>
  <v-card class="ma-2 elevation-5" :title="store.getFleetName(fleet.id)" :subtitle="fleet.id">
    <template v-slot:prepend>
      <v-icon :icon="'mdi-' + store.getFleetIcon(fleet.id).icon" size="x-large" :color="store.getFleetColor(fleet.id)" />
    </template>
    <template v-slot:append>
      <v-progress-circular v-if="store.loadingFleets.has(fleet.id)" class="button-size" indeterminate />
      <v-btn v-if="!store.loadingFleets.has(fleet.id)" class="ma-2" variant="text" icon="mdi-refresh"
        @click="store.fetchFleet(fleet.id)" />
    </template>
    <v-divider/>
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-row dense>
          <v-col>
            <FleetStatus :fleet="fleet" />
          </v-col>
          <v-col class="flex-grow-0">
            <FleetShips :fleet="fleet" />
          </v-col>
        </v-row>
        <v-row dense v-if="Object.keys(fleet.cargo).length > 0">
          <v-col>
            <FleetCargo :fleet="fleet" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider/>
    <v-card-actions class="overflow-x-auto">
      <FleetActions :fleet="fleet" />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.button-size {
  margin: 16px;
}
</style>
