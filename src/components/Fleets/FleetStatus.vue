<script lang="ts" setup>
import { Fleet, FleetCurrentActionTypeEnum } from '@/api'
import { Countdown, SystemChip } from '@/components/Common'

defineProps<{
  fleet: Fleet
}>()
</script>

<template>
  <div class="text-subtitle-1">Status</div>
  <div v-if="fleet.currentAction === null" class="text-body-2">
    Idle in
    <SystemChip :system-id="(fleet.locationSystemId as string)" />
  </div>
  <div v-if="fleet.currentAction?.type === FleetCurrentActionTypeEnum.Mining" class="text-body-2">
    Mining in
    <SystemChip :system-id="(fleet.locationSystemId as string)" />
    <Countdown prefix=" finishing in" :complete="(fleet.currentAction?.finishTime as string)" />
  </div>
  <div v-if="fleet.currentAction?.type === FleetCurrentActionTypeEnum.Traveling" class="text-body-2">
    Traveling from
    <SystemChip :system-id="(fleet.currentAction?.travelingFromSystemId as string)" /> to
    <SystemChip :system-id="(fleet.currentAction?.travelingToSystemId as string)" />
    <Countdown prefix=" arriving in" :complete="(fleet.currentAction?.arrivalTime as string)" />
  </div>
</template>
