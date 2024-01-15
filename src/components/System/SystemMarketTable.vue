<script lang="ts" setup>

import { System } from '@/api'
import { useAppStore } from '@/store/app'
import { ResourceChip } from '@/components/Common'

const props = defineProps<{
  system: System
}>()

const store = useAppStore()

</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Resource</th>
        <th class="text-left">Ask</th>
        <th class="text-left">Bid</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="resource in store.getResources" :key="resource.id">
        <td>
          <ResourceChip :resource-id="resource.id" />
        </td>
        <td>

        </td>
        <td>

        </td>
      </tr>
    </tbody>
  </v-table>
</template>
