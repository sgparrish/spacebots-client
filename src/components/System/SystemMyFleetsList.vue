<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

import { FleetListItem } from '@/components/Common'

const store = useAppStore()

const selectedSystem = storeToRefs(store).getSelectedSystem

const myFleetsInSystem = computed(() => store.getMyFleets.filter(x => x.locationSystemId !== undefined && x.locationSystemId === selectedSystem.value?.id))
</script>

<template>
  <v-list class="fleet-list">
    <FleetListItem v-for="fleet in myFleetsInSystem" :key="fleet.id" :fleet="fleet" clickable />
  </v-list>
</template>

<style scoped>
.fleet-list {
  overflow-y: auto;
}
</style>