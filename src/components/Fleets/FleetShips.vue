<script lang="ts" setup>
import { Fleet } from '@/api'

import { useAppStore } from '@/store/app'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()
</script>

<template>
  <div class="text-subtitle-1">Ships</div>
  <div class="d-flex ga-2">
    <template v-for="(shipCount, shipTypeId) in props.fleet.ships" :key="shipTypeId">
      <v-chip :color="store.getShipTypeColor(shipTypeId as string)">
        {{ shipCount }} {{ store.getShipTypeById(shipTypeId as string)?.name }}
      </v-chip>
    </template>
  </div>
</template>
