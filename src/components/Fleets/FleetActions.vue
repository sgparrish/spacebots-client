<script lang="ts" setup>
import { computed } from 'vue'

import { Fleet, System } from '@/api'
import { useAppStore } from '@/store/app'
import FleetBuyShips from './FleetBuyShips.vue'
import FleetDirectSell from './FleetDirectSell.vue'
import FleetTransfer from './FleetTransfer.vue'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()
const localSystem = computed(() =>
  props.fleet.locationSystemId ? store.getSystemById(props.fleet.locationSystemId) : undefined,
)
const neighboringSystems = computed(() => {
  if (localSystem.value === undefined) return []
  return localSystem.value?.neighboringSystems.map((n) => store.getSystemById(n.systemId))
})
const localResource = computed(() =>
  localSystem.value?.asteroid?.miningResourceId
    ? store.getResourceById(localSystem.value?.asteroid?.miningResourceId)
    : undefined,
)
const fleetLoading = computed(() => store.isFleetLoading(props.fleet.id))
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" :disabled="fleetLoading || fleet.currentAction !== null">
        Travel To...
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="system in neighboringSystems" @click="store.moveFleet(fleet.id, system?.id as string)"
        :key="system?.id" :value="system?.id" :base-color="store.getSystemColor(system as System)">
        <v-list-item-title>{{ system?.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <FleetTransfer :fleet="fleet" />

  <v-btn v-if="localResource !== undefined" :disabled="fleetLoading || fleet.currentAction !== null"
    @click="store.mine(fleet.id)" color="primary">
    Mine {{ localResource?.name }}
  </v-btn>

  <FleetBuyShips :fleet="fleet" v-if="localSystem?.station?.buyShips"
    :disabled="fleetLoading || fleet.currentAction !== null" />

  <FleetDirectSell :fleet="fleet" v-if="localSystem?.station?.directSell"
    :disabled="fleetLoading || fleet.currentAction !== null || Object.keys(fleet.cargo).length === 0" />
</template>
