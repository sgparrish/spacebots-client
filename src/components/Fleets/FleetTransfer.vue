<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import { Fleet, PostFleetTransferBody, PostFleetTransferToStationBody } from '@/api'
import { useAppStore } from '@/store/app'
import { SliderInput, FleetListItem, ResourceChip } from '@/components/Common'

import TransferSelector, { TransferTarget } from './TransferSelector.vue'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()

const transferTargetOptions = computed(() => {
  const targets: TransferTarget[] = [];
  if (props.fleet.locationSystemId && store.getSystemById(props.fleet.locationSystemId)?.station?.cargo) {
    targets.push({
      type: 'station',
      id: props.fleet.locationSystemId,
    })
  }
  targets.push({
    type: 'new-fleet',
    id: '',
  })
  return targets.concat(store.getMyFleets.filter(
    (f) =>
      props.fleet.locationSystemId !== undefined &&
      props.fleet.locationSystemId === f.locationSystemId &&
      props.fleet.id !== f.id,
  ).map((f) => ({
    type: 'fleet',
    id: f.id,
  })))
})
const transferTarget = ref(transferTargetOptions.value[0])

const targetHasShips = computed(() => {
  if (transferTarget.value.type === 'station') return false
  return true
})

const targetShips = computed(() => {
  if (transferTarget.value.type === 'fleet') return store.getFleetById(transferTarget.value.id)?.ships ?? {}
  return {}
})

const targetCargo = computed(() => {
  if (transferTarget.value.type === 'station') return store.getSystemById(transferTarget.value.id)?.station?.cargo ?? {}
  if (transferTarget.value.type === 'new-fleet') return {}
  if (transferTarget.value.type === 'fleet') return store.getFleetById(transferTarget.value.id)?.cargo ?? {}
  return {}
})

const shipTotals = computed(() => {
  const totals: { [key: string]: number } = {}
  store.getShipTypes.forEach((x) => {
    const total = (props.fleet.ships[x.id] || 0) + (targetShips.value[x.id] || 0)
    if (total > 0) totals[x.id] = total
  })
  return totals
})
const availableShipTypes = computed(() =>
  store.getShipTypes.filter((x) => shipTotals.value[x.id] > 0),
)

const shipTransfers = ref<{ [key: string]: number }>({})

const resetShipTransfers = () => {
  const transfer: { [key: string]: number } = {}
  availableShipTypes.value.forEach((s) => {
    transfer[s.id] = targetShips.value[s.id] || 0
  })
  shipTransfers.value = transfer
}
watch(transferTarget, resetShipTransfers)

const resourceTotals = computed(() => {
  const totals: { [key: string]: number } = {}
  store.getResources.forEach((r) => {
    const total = (props.fleet.cargo[r.id] || 0) + (targetCargo.value[r.id] || 0)
    if (total > 0) totals[r.id] = total
  })
  return totals
})
const availableResources = computed(() =>
  store.getResources.filter(
    (r) => typeof resourceTotals.value[r.id] === 'number' && resourceTotals.value[r.id] > 0,
  ),
)

const resourceTransfers = ref<{ [key: string]: number }>({})

const resetResourceTransfers = () => {
  const transfer: { [key: string]: number } = {}
  availableResources.value.forEach((r) => {
    transfer[r.id] = targetCargo.value[r.id] || 0
  })
  resourceTransfers.value = transfer
}
watch(transferTarget, resetResourceTransfers)

const takeAllResources = () => {
  const transfer: { [key: string]: number } = {}
  availableResources.value.forEach((r) => {
    transfer[r.id] = 0
  })
  resourceTransfers.value = transfer
}
const giveAllResources = () => {
  const transfer: { [key: string]: number } = {}
  availableResources.value.forEach((r) => {
    transfer[r.id] = resourceTotals.value[r.id]
  })
  resourceTransfers.value = transfer
}

const fleetWillDie = computed(() => {
  const allShipsTransferedIn = availableShipTypes.value.every(
    (s) => shipTransfers.value[s.id] === 0,
  )
  const allShipsTransferedOut = availableShipTypes.value.every(
    (s) => shipTransfers.value[s.id] === shipTotals.value[s.id],
  )

  return targetHasShips.value && ((allShipsTransferedIn && transferTarget.value.type !== 'new-fleet') || allShipsTransferedOut)
})

const transferDisabled = computed(() => {
  const noShipsTransfered = availableShipTypes.value.every(
    (s) => shipTransfers.value[s.id] === (targetShips.value[s.id] || 0),
  )
  const noResourcesTransfered = availableResources.value.every(
    (r) => resourceTransfers.value[r.id] === (targetCargo.value[r.id] || 0),
  )

  const newFleetEmpty = transferTarget.value.type === 'new-fleet' && noShipsTransfered
  const nothingTransfered = noShipsTransfered && noResourcesTransfered

  return newFleetEmpty || nothingTransfered
})

const performTransfer = () => {
  const resourcesToTarget: { [key: string]: number } = {}
  const resourcesFromTarget: { [key: string]: number } = {}
  Object.entries(resourceTransfers.value).forEach(([resource, count]) => {
    const diff = (targetCargo.value[resource] ?? 0) - count
    if (diff > 0) resourcesFromTarget[resource] = diff
    else if (diff < 0) resourcesToTarget[resource] = -diff
  })

  if (transferTarget.value.type === 'station') {
    const payload: PostFleetTransferToStationBody = {}
    if (Object.keys(resourcesToTarget).length > 0)
      payload.resourcesFromFleetToStation = resourcesToTarget
    if (Object.keys(resourcesFromTarget).length > 0)
      payload.resourcesFromStationToFleet = resourcesFromTarget

    store.transferToStation(props.fleet.id, payload)
  } else {
    const shipsToTarget: { [key: string]: number } = {}
    const shipsFromTarget: { [key: string]: number } = {}
    Object.entries(shipTransfers.value).forEach(([shipType, count]) => {
      const diff = (targetShips.value[shipType] ?? 0) - count
      if (diff > 0) shipsFromTarget[shipType] = diff
      else if (diff < 0) shipsToTarget[shipType] = -diff
    })

    const payload: PostFleetTransferBody = {}
    if (transferTarget.value.type === 'fleet') payload.targetFleetId = transferTarget.value.id
    if (Object.keys(shipsToTarget).length > 0) payload.shipsFromFleetToTarget = shipsToTarget
    if (Object.keys(shipsFromTarget).length > 0) payload.shipsFromTargetToFleet = shipsFromTarget
    if (Object.keys(resourcesToTarget).length > 0)
      payload.resourcesFromFleetToTarget = resourcesToTarget
    if (Object.keys(resourcesFromTarget).length > 0)
      payload.resourcesFromTargetToFleet = resourcesFromTarget

    store.transfer(props.fleet.id, payload)
  }
}
</script>

<template>
  <v-dialog width="1000"
    @update:model-value="transferTarget = transferTargetOptions[0]; resetShipTransfers(); resetResourceTransfers();">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" :disabled="store.isFleetLoading(fleet.id) || fleet.currentAction !== null">
        Transfer...
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Transfer">
        <v-alert v-if="fleetWillDie" density="compact" type="warning" title="Fleet will be destroyed"
          text="Transfering all ships out of a fleet will destroy it, losing any cargo that fleet had." />
        <v-card-text>
          <div class="d-flex align-center">
            <FleetListItem :fleet="fleet" />

            <v-icon class="ma-4" size="x-large" icon="mdi-swap-horizontal-bold" />

            <TransferSelector label="Transfer To" v-model="transferTarget" :options="transferTargetOptions" />
          </div>
          <v-table>
            <thead v-if="targetHasShips">
              <tr>
                <th class="text-left">Ship Type</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody v-if="targetHasShips">
              <tr v-for="shipType in availableShipTypes" :key="shipType.id">
                <td :style="`color: ${store.getShipTypeColor(shipType.id)}`">
                  {{ shipType.name }}
                </td>
                <td>
                  <SliderInput :min="0" :max="shipTotals[shipType.id]" v-model="shipTransfers[shipType.id]" split-mode />
                </td>
              </tr>
            </tbody>
            <thead v-if="availableResources.length > 0">
              <tr>
                <th class="text-left">Resource</th>
                <th class="text-left">Amount</th>
              </tr>
            </thead>
            <tbody v-if="availableResources.length > 0">
              <tr v-for="resource in availableResources" :key="resource.id">
                <td>
                  <ResourceChip :resource-id="resource.id" />
                </td>
                <td>
                  <SliderInput :min="0" :max="resourceTotals[resource.id]" v-model="resourceTransfers[resource.id]"
                    split-mode />
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td>
                  <SliderInput :min="0" :max="store.getCargoValue(resourceTotals)"
                    :model-value="store.getCargoValue(resourceTransfers)" split-mode readonly color="light-green">
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
          <v-btn color="primary" :disabled="transferDisabled"
            @click="performTransfer(); isActive.value = false">Transfer</v-btn>
          <v-btn @click="resetShipTransfers(); resetResourceTransfers()">Reset</v-btn>
          <v-btn @click="takeAllResources()">Take All</v-btn>
          <v-btn @click="giveAllResources()">Give All</v-btn>
          <v-btn color="red" @click="isActive.value = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
