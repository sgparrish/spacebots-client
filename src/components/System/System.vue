<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'
import { ResourceChip, SystemChip } from '@/components/Common'

import SystemMyFleetsList from './SystemMyFleetsList.vue';
import SystemMarketTable from './SystemMarketTable.vue';

const store = useAppStore()

const selectedSystem = storeToRefs(store).getSelectedSystem

const myFleetsInSystem = computed(() => store.getMyFleets.filter(x => x.locationSystemId !== undefined && x.locationSystemId === selectedSystem.value?.id))
</script>

<template>
  <v-sheet class="system pa-0 ma-2 fill-height">
    <div class="text-h4 font-weight-medium px-6 pt-6">
      {{ selectedSystem?.name ?? "System Details" }}
    </div>

    <v-container v-if="selectedSystem" fluid>
      <v-row>
        <v-col class="location">
          <div class="text-subtitle-1">Location</div>
          <code class="text-disabled">{{ `(${selectedSystem.x}, ${selectedSystem.y})` }}</code>
        </v-col>
        <v-col v-if="selectedSystem.station">
          <div class="text-subtitle-1">Station</div>
          <div class="d-flex ga-2">
            <v-chip v-if="selectedSystem.station?.buyShips" color="lime" prepend-icon="mdi-satellite-variant">
              Buy Ships
            </v-chip>
            <v-chip v-if="selectedSystem.station?.directSell" color="light-green" prepend-icon="mdi-currency-sign">
              Direct Sell
            </v-chip>
          </div>
        </v-col>
        <v-col v-if="selectedSystem.asteroid">
          <div class="text-subtitle-1">Asteroid</div>
          <div class="d-flex flex-wrap ga-2">
            <ResourceChip :resource-id="selectedSystem.asteroid.miningResourceId" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="text-subtitle-1">Neighboring Systems</div>
          <div class="d-flex flex-wrap ga-2">
            <SystemChip v-for="system in selectedSystem.neighboringSystems" :key="system.systemId"
              :system-id="system.systemId" />
          </div>
        </v-col>
      </v-row>
      <v-row v-if="selectedSystem.station?.cargo">
        <v-col>
          <div class="text-subtitle-1">Station Cargo</div>
          <div class="d-flex flex-wrap ga-2">
            <ResourceChip v-for="(resourceCount, resourceId) in selectedSystem.station.cargo"
              :resource-id="(resourceId as string)" :key="resourceId" :text="resourceCount.toString()" />
          </div>
        </v-col>
      </v-row>
      <v-row v-if="myFleetsInSystem.length > 0">
        <v-col>
          <div class="text-subtitle-1">My Fleets</div>
          <SystemMyFleetsList />
        </v-col>
      </v-row>
      <v-row v-if="selectedSystem.station">
        <v-col>
          <SystemMarketTable :system="selectedSystem" />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style scoped>
.system {
  grid-area: system;
}

.location {
  height: 84px;
}

.fleet-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>