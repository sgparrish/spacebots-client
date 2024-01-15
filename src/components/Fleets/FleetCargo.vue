<script lang="ts" setup>
import { Fleet } from '@/api'

import { ResourceChip } from '@/components/Common'

defineProps<{
  fleet: Fleet
}>()
</script>

<template>
  <div class="text-subtitle-1">Cargo</div>
  <div class="d-flex flex-wrap ga-2">
    <ResourceChip v-for="(resourceCount, resourceId) in fleet.cargo" :resource-id="(resourceId as string)"
      :key="resourceId" :text="resourceCount.toString()" />
  </div>
</template>