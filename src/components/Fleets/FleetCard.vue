<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'
import { RefreshButton } from '@/components/Common'

import FleetStatus from './FleetStatus.vue'
import FleetShips from './FleetShips.vue'
import FleetCargo from './FleetCargo.vue'
import FleetActions from './FleetActions.vue'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()

const cardRef = ref()

const selectedFleet = storeToRefs(store).selectedFleet
const isSelected = computed(() => selectedFleet.value === props.fleet.id)

watch(isSelected, () => {
  if (isSelected.value && cardRef.value) {
    cardRef.value.$el.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>

<template>
  <v-card ref="cardRef" :class="`mb-2 elevation-5${isSelected ? ' highlighted' : ''}`">
    <template v-slot:prepend>
      <v-icon :icon="'mdi-' + store.getFleetIcon(fleet.id).icon" size="x-large" :color="store.getFleetColor(fleet.id)" />
    </template>
    <template v-slot:title>
      <v-card-title>{{ store.getFleetName(fleet.id) }}</v-card-title>
    </template>
    <template v-slot:subtitle>
      <code>{{ fleet.id }}</code>
    </template>
    <template v-slot:append>
      <RefreshButton :loading="store.isFleetLoading(fleet.id)" @click="store.fetchFleet(fleet.id)" />
    </template>
    <v-divider />
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-row dense>
          <v-col class="status-col">
            <FleetStatus :fleet="fleet" />
          </v-col>
          <v-col class="flex-grow-1">
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
    <v-divider />
    <v-card-actions class="overflow-x-auto">
      <FleetActions :fleet="fleet" />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.status-col {
  flex-grow: 2;
  flex-shrink: 0;
}

.highlighted {
  animation-name: highlight;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
}

@keyframes highlight {
  from {
    background-color: rgb(var(--v-theme-surface));
  }

  20% {
    background-color: rgb(var(--v-theme-surface));
  }

  50% {
    background-color: rgb(var(--v-theme-code));
  }

  to {
    background-color: rgb(var(--v-theme-surface));
  }
}
</style>
