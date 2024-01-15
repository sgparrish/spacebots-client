<script lang="ts" setup>
import { ref, computed } from 'vue'

import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

import FleetCard from './FleetCard.vue'

const store = useAppStore()
const fleets = storeToRefs(store).getMyFleets

const search = ref("")

const searchedFleets = computed(() => store.searchFleets(fleets.value, search.value))
</script>

<template>
  <v-sheet class="fleets ma-4 d-flex flex-column overflow-y-hidden fill-height" color="transparent">
    <div class="py-6 pl-6 d-flex flex-0-0">
      <div class="text-h4 font-weight-medium">My Fleets</div>
      <v-text-field class="ml-auto fleet-search" variant="solo" density="compact" prepend-inner-icon="mdi-magnify"
        clearable placeholder="Search my fleets..." v-model:model-value="search" @click:clear="search = ''">
        <template v-slot:details>
          <span class="text-medium-emphasis">
            {{ searchedFleets.length }} fleets matching
          </span>
        </template>
      </v-text-field>
    </div>
    <div class="overflow-y-auto flex-1-1">
      <template v-for="fleet in searchedFleets" :key="fleet.id">
        <FleetCard :fleet="fleet" />
      </template>
    </div>
  </v-sheet>
</template>

<style scoped>
.fleets {
  grid-area: fleets;
}

.fleet-search {
  max-width: 60%;
}
</style>