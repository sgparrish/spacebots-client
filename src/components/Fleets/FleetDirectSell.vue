<script lang="ts" setup>
import { ref, computed } from 'vue'

import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'
import SliderInput from '../SliderInput.vue'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()
const localSystem = computed(() =>
  props.fleet.locationSystemId ? store.getSystemById(props.fleet.locationSystemId) : undefined,
)

const sellResourceOrder = ref<{ [key: string]: number }>({})
const availableResources = computed(() =>
  store.getResources.filter((x) => props.fleet.cargo[x.id] > 0),
)
const resetResourceOrder = () => {
  const order: { [key: string]: number } = {}
  availableResources.value.forEach((x) => {
    order[x.id] = 0
  })
  sellResourceOrder.value = order
}
resetResourceOrder()

const selectAll = () => (sellResourceOrder.value = { ...props.fleet.cargo })

const performSale = () => {
  const payload: { [key: string]: number } = {}
  Object.entries(sellResourceOrder.value).forEach(([resource, count]) => {
    if (count > 0) payload[resource] = count
  })
  store.directSell(props.fleet.id, payload)
}
</script>

<template>
  <v-dialog width="800">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" @click="resetResourceOrder()"
        :disabled="Object.keys(fleet.cargo).length === 0" v-if="!store.isFleetLoading(fleet.id) &&
          localSystem?.station?.directSell &&
          fleet.currentAction === null
          ">
        Direct Sell...
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Direct Sell">
        <template v-slot:append>
          <v-chip v-if="store?.user" class="ma-2" prepend-icon="mdi-currency-sign" color="light-green">
            {{ store?.user?.credits }}
          </v-chip>
        </template>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Resource</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resource in availableResources" :key="resource.id">
                <td :style="`color: ${store.getResourceColor(resource.id)}`">
                  <v-icon :icon="`custom:${resource.id}`" />
                  {{ resource.name }}
                </td>
                <td>
                  <SliderInput :min="0" :max="fleet.cargo[resource.id]" v-model="sellResourceOrder[resource.id]" />
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td>
                  <SliderInput :min="0" :max="store.getCargoValue(fleet.cargo)"
                    :model-value="store.getCargoValue(sellResourceOrder)" split-mode readonly color="light-green">
                    <template v-slot:unit>
                      <v-icon icon="mdi-currency-sign" />
                    </template>
                  </SliderInput>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isActive.value = false; performSale()"
            :disabled="store.getCargoValue(sellResourceOrder) <= 0">
            Sell Resources
          </v-btn>
          <v-btn @click="selectAll()">Sell All</v-btn>
          <v-btn @click="resetResourceOrder()">Reset</v-btn>
          <v-btn color="red" @click="isActive.value = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
