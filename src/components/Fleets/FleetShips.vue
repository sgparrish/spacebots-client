<script lang="ts" setup>
import { Fleet } from '@/api'

import { ShipTypeChip } from '@/components/Common'

defineProps<{
  fleet: Fleet
}>()
</script>

<template>
  <div class="text-subtitle-1">Ships</div>
  <div class="d-flex ga-2">
    <ShipTypeChip v-for="(shipCount, shipTypeId) in fleet.ships" :key="shipTypeId" :shipTypeId="(shipTypeId as string)"
      :text="shipCount.toString()" />
  </div>
</template>
