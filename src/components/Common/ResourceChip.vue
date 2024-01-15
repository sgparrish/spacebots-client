<script lang="ts" setup>
import { useAppStore } from '@/store/app'

defineProps<{
  resourceId: string
  text?: string
}>()

const store = useAppStore()
</script>

<template>
  <v-chip v-bind="$attrs" :color="store.getResourceColor(resourceId)" :prepend-icon="`custom:${resourceId}`">
    {{ text }} {{ store.getResourceById(resourceId)?.name }}
  </v-chip>
</template>