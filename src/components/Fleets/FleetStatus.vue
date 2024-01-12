<script lang="ts" setup>
import { computed } from 'vue'

import { Fleet, FleetCurrentActionTypeEnum } from '@/api'
import { useAppStore } from '@/store/app'
import Countdown from '../Countdown.vue'

const props = defineProps<{
  fleet: Fleet
}>()

const store = useAppStore()
const currentSystem = computed(() =>
  props.fleet.locationSystemId ? store.getSystemById(props.fleet.locationSystemId) : undefined,
)
const fromSystem = computed(() =>
  props.fleet.currentAction?.travelingFromSystemId
    ? store.getSystemById(props.fleet.currentAction.travelingFromSystemId)
    : undefined,
)
const toSystem = computed(() =>
  props.fleet.currentAction?.travelingToSystemId
    ? store.getSystemById(props.fleet.currentAction.travelingToSystemId)
    : undefined,
)
</script>

<template>
  <div class="text-subtitle-1">Status</div>
  <div v-if="fleet.currentAction === null" class="text-body-2">
    Idle in <span>{{ currentSystem?.name }}</span>
  </div>
  <div v-if="fleet.currentAction?.type === FleetCurrentActionTypeEnum.Mining" class="text-body-2">
    Mining in <span>{{ currentSystem?.name }}</span>
    <Countdown prefix=" finishing in" :complete="(fleet.currentAction?.finishTime as string)" />
  </div>
  <div v-if="fleet.currentAction?.type === FleetCurrentActionTypeEnum.Traveling" class="text-body-2">
    Traveling from <span>{{ fromSystem?.name }}</span> to <span>{{ toSystem?.name }}</span>
    <Countdown prefix=" arriving in" :complete="(fleet.currentAction?.arrivalTime as string)" />
  </div>
</template>
