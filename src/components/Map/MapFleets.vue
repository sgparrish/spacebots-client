<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue'

import { useAppStore } from '@/store/app'
import { FleetCurrentActionTypeEnum, System } from '@/api'

import MapFleet from './MapFleet.vue'
import dayjs from 'dayjs'

const props = defineProps<{
  mapScale: number
  nodeRadius: number
  scale: number
}>()

const store = useAppStore()

const systemsToFleets = computed(
  () =>
    new Map(
      store.getSystems
        .filter((s) => store.getFleets.some((f) => s.id === f.locationSystemId))
        .map((s) => [
          s.id,
          store.getFleets
            .filter((f) => s.id === f.locationSystemId)
            .map((f) => ({
              ...f,
              name: store.getFleetName(f.id),
              icon: store.getFleetIcon(f.id),
              color: store.getFleetColor(f.id),
            })),
        ]),
    ),
)
const systemsWithFleets = computed(() =>
  Array.from(systemsToFleets.value.keys()).map((s) => store.getSystemById(s) as System),
)
const travelingFleets = computed(() =>
  store.getFleets.filter((x) => x.currentAction?.type === FleetCurrentActionTypeEnum.Traveling),
)

let rafHandle = 0
const travelingPositions = ref<{ x: number; y: number }[]>([])

const updatePositions = () => {
  rafHandle = 0
  const now = dayjs()
  travelingPositions.value = travelingFleets.value.map((f) => {
    const from = store.getSystemById(f.currentAction?.travelingFromSystemId as string) as System
    const to = store.getSystemById(f.currentAction?.travelingToSystemId as string) as System
    const depart = dayjs(f.currentAction?.departureTime)
    const arrive = dayjs(f.currentAction?.arrivalTime)
    const t = Math.min(now.diff(depart) / arrive.diff(depart), 1) * 0.8
    return {
      x: (from.x * (1 - t) + to.x * t) * props.mapScale,
      y: (from.y * (1 - t) + to.y * t) * -props.mapScale,
    }
  })

  rafHandle = requestAnimationFrame(updatePositions)
}

updatePositions()

onUnmounted(() => {
  cancelAnimationFrame(rafHandle)
})
</script>

<template>
  <template v-for="system in systemsWithFleets">
    <template v-for="(fleet, i) in systemsToFleets.get(system.id)" :key="fleet.id">
      <g :transform="`translate(${system.x * mapScale}, ${system.y * -mapScale})`">
        <MapFleet :nodeRadius="nodeRadius" :scale="scale" :fleet="fleet" :fleetIndex="i" />
      </g>
    </template>
  </template>
  <template v-for="({ x, y }, i) in travelingPositions" :key="i">
    <g v-if="travelingFleets[i] !== undefined" :transform="`translate(${x}, ${y})`">
      <MapFleet :nodeRadius="nodeRadius" :scale="scale" :fleet="travelingFleets[i]" />
    </g>
  </template>
</template>
