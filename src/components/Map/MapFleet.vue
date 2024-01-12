<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script lang="ts" setup>
import { computed } from 'vue'

import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'

const props = withDefaults(
  defineProps<{
    nodeRadius: number
    scale: number
    fleet: Fleet
    fleetIndex?: number
  }>(),
  {
    fleetIndex: -1,
  },
)

const store = useAppStore()

const icon = computed(() => store.getFleetIcon(props.fleet.id))
const color = computed(() => store.getFleetColor(props.fleet.id))
</script>

<template>
  <g :transform="`translate(${(fleetIndex + 1) * nodeRadius * scale * 2.25}, 0)`">
    <rect :x="nodeRadius * scale * -1" :y="nodeRadius * scale * -1" :width="nodeRadius * 2 * scale"
      :height="nodeRadius * 2 * scale" fill="rgb(18, 18, 18)" :rx="nodeRadius * 0.5 * scale" />
    <text font-family="Material Design Icons" :font-size="nodeRadius * 1.6 * scale" :fill="color" text-anchor="middle"
      dominant-baseline="central" style="pointer-events: none"
      v-html="String.fromCodePoint(Number.parseInt(icon.code, 16))" />
  </g>
</template>
