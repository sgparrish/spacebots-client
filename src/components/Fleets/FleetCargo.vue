<script lang="ts" setup>
import { computed } from 'vue';

import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()

const resources = computed(() => store.getResources.filter(r => props.fleet.cargo[r.id]))

</script>

<template>
  <div class="text-subtitle-1">Cargo</div>
  <div class="d-flex flex-wrap ga-2">
    <template v-for="resource in resources" :key="resource.id">
      <v-chip :color="store.getResourceColor(resource.id as string)" :prepend-icon="'custom:' + (resource.id as string)">
        {{ props.fleet.cargo[resource.id] }} {{ store.getResourceById(resource.id as string)?.name }}
      </v-chip>
    </template>
  </div>
</template>