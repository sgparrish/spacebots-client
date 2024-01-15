<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MarketData, System } from '@/api'
import { useAppStore } from '@/store/app'
import { RefreshButton, ResourceChip } from '@/components/Common'

const props = defineProps<{
  system: System
}>()

const store = useAppStore()

const loading = ref(false)
const marketData = ref<{ [key: string]: MarketData }>({})

const refreshMarketData = async () => {
  loading.value = true
  marketData.value = await store.fetchMarketData(props.system.id)
  loading.value = false
}

watch(props.system, () => {
  refreshMarketData()
}, { immediate: true })
</script>

<template>
  <v-table>
    <template v-slot:top>
      <div class="d-flex align-center">
        <div class="text-h5 flex-grow-1">
          Market
        </div>
        <RefreshButton :loading="loading" @click="refreshMarketData" />
      </div>
    </template>
    <thead>
      <tr>
        <th class="text-left">Resource</th>
        <th class="text-left">Bid</th>
        <th class="text-left">Ask</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(md, resourceId) in marketData" :key="resourceId">
        <td>
          <ResourceChip :resource-id="(resourceId as string)" />
        </td>
        <td v-if="md.buyOrders.length > 0">
          <v-icon icon="mdi-currency-sign" />
          {{ md.buyOrders[0].price }}
        </td>
        <td v-else>
          -
        </td>
        <td v-if="md.sellOrders.length > 0">
          <v-icon icon="mdi-currency-sign" />
          {{ md.sellOrders[0].price }}
        </td>
        <td v-else>
          -
        </td>
      </tr>
    </tbody>
  </v-table>
</template>