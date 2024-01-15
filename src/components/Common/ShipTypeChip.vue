<script lang="ts" setup>
import { useAppStore } from '@/store/app'

defineProps<{
  shipTypeId: string
  text?: string
}>()

const store = useAppStore()
</script>

<template>
  <v-chip v-bind="$attrs" :color="store.getShipTypeColor(shipTypeId as string)">
    {{ text }} {{ store.getShipTypeById(shipTypeId as string)?.name }}
  </v-chip>
</template>
