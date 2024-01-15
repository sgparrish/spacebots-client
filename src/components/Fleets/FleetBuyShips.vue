<script lang="ts" setup>
import { ref, computed } from 'vue'

import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'
import { SliderInput } from '@/components/Common'

const props = defineProps<{
  fleet: Fleet
  disabled?: boolean
}>()

const store = useAppStore()

const buyShipsOrder = ref<{ [key: string]: number }>({})
const maxPurchasable = computed(() => {
  const res: { [key: string]: number } = {}
  store.getShipTypes.forEach((type) => {
    const currentPrice = store.getShipTypes
      .filter((x) => type.id !== x.id)
      .reduce((sum, type) => sum + (buyShipsOrder.value[type.id] || 0) * type.price, 0)
    res[type.id] = Math.floor(((store.user?.credits || 0) - currentPrice) / type.price)
  })
  return res
})
const resetShipsOrder = () => {
  const order: { [key: string]: number } = {}
  store.getShipTypes.forEach((x) => {
    order[x.id] = 0
  })
  buyShipsOrder.value = order
}
resetShipsOrder()

const totalShipCost = computed(() =>
  store.getShipTypes.reduce(
    (sum, type) => sum + (buyShipsOrder.value[type.id] || 0) * type.price,
    0,
  ),
)

const performBuy = () => {
  const payload: { [key: string]: number } = {}
  Object.entries(buyShipsOrder.value).forEach(([shipType, count]) => {
    if (count > 0) payload[shipType] = count
  })
  store.buyShips(props.fleet.id, payload)
}
</script>

<template>
  <v-dialog width="800">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" @click="resetShipsOrder()" :disabled="disabled">Buy Ships...</v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Buy Ships">
        <template v-slot:append>
          <v-chip v-if="store?.user" class="ma-2" prepend-icon="mdi-currency-sign" color="light-green">
            {{ store.user?.credits }}
          </v-chip>
        </template>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Amount</th>
                <th class="text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="shipType in store.getShipTypes" :key="shipType.id">
                <td :style="`color: ${store.getShipTypeColor(shipType.id)}`">
                  {{ shipType.name }}
                </td>
                <td>
                  <SliderInput :min="0" :max="maxPurchasable[shipType.id]" v-model="buyShipsOrder[shipType.id]" />
                </td>
                <td>
                  <v-icon icon="mdi-currency-sign" />
                  {{ shipType.price }}
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td></td>
                <td :class="totalShipCost > (store.user?.credits || 0) ? 'text-red' : undefined">
                  <v-icon icon="mdi-currency-sign" />
                  {{ totalShipCost }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isActive.value = false; performBuy()"
            :disabled="totalShipCost > (store.user?.credits || 0) || totalShipCost <= 0">Buy ships</v-btn>
          <v-btn color="red" @click="isActive.value = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
