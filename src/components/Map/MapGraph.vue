<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import colors from 'vuetify/util/colors'
import { defineConfigs, VNetworkGraphInstance } from 'v-network-graph'

import { hexToRgb } from '@/utils'
import { useAppStore } from '@/store/app'

import MapSystem from './MapSystem.vue'
import MapFleets from './MapFleets.vue'

const store = useAppStore()

const MAP_SCALE = 100
const NODE_RADIUS = 22

const graphRef = ref<VNetworkGraphInstance>()

const configs = defineConfigs({
  node: {
    draggable: false,
    selectable: 1,
    label: {
      fontSize: 18,
      color: 'rgb(var(--v-theme-on-surface))',
    },
    normal: {
      radius: NODE_RADIUS,
      color: 'rgb(var(--v-theme-on-code))',
    },
    hover: {
      color: 'rgb(var(--v-theme-on-code))',
    },
    focusring: {
      color: 'rgb(var(--v-theme-secondary))',
    },
  },
  edge: {
    selectable: false,
    normal: {
      color: colors.cyan.base,
      width: 1,
    },
    hover: {
      color: colors.cyan.base,
      width: 1,
    },
  },
  view: {
    grid: {
      visible: true,
      interval: MAP_SCALE,
      line: {
        color: 'rgba(var(--v-theme-primary-darken-1),var(--v-idle-opacity))',
        dasharray: 0,
      },
      thick: {
        color: 'rgba(var(--v-theme-primary-darken-1),var(--v-focus-opacity))',
        width: 2,
      },
    },
    autoPanAndZoomOnLoad: 'fit-content',
  },
})

const graph = computed(() => {
  const nodes: { [key: string]: any } = {}
  const edges: { [key: string]: any } = {}
  const layers: { [key: string]: any } = {
    fleets: 'edges',
  }
  const layouts: { nodes: { [key: string]: any } } = {
    nodes: {},
  }
  const resourceColorMatrix: { [key: string]: any } = {}

  store.systems.forEach((s) => {
    nodes[s.id] = {
      name: s.name,
      color: store.getSystemColor(s),
      resource: s.asteroid?.miningResourceId,
      station: s.station,
    }
    layouts.nodes[s.id] = { x: s.x * MAP_SCALE, y: s.y * -MAP_SCALE }
    s.neighboringSystems.forEach((n) => {
      if (edges[`${n.systemId}${s.id}`]) return
      edges[`${s.id}${n.systemId}`] = { source: s.id, target: n.systemId }
    })
  })

  // This jank is required to color the svg files
  store.resources.forEach((res) => {
    const resColor = store.getResourceColor(res.id) as string
    const [r, g, b] = hexToRgb(resColor)
    resourceColorMatrix[res.id] = `0 0 0 ${r / 255} 0
                                   0 0 0 ${g / 255} 0
                                   0 0 0 ${b / 255} 0
                                   0 0 0 1 1`
  })

  return { nodes, edges, layouts, layers, resourceColorMatrix }
})

const systemCount = computed(() => store.getSystems.length)
watch(systemCount, () => {
  graphRef.value?.fitToContents()
})

const selectedSystem = storeToRefs(store).getSelectedSystem
const selectedNode = computed(() => (selectedSystem.value ? [selectedSystem.value.id] : []))

const setSelectedSystem = (nodeIds: string[]) => {
  if (nodeIds.length > 0) store.setSelectedSystem(nodeIds[0])
}
</script>

<template>
  <v-network-graph ref="graphRef" class="fill-height" :selected-nodes="selectedNode" :configs="configs"
    :nodes="graph.nodes" :edges="graph.edges" :layers="graph.layers" :layouts="graph.layouts"
    @update:selected-nodes="setSelectedSystem">
    <defs>
      <filter v-for="(matrix, id) in graph.resourceColorMatrix" :id="(id as string)" :key="id">
        <feColorMatrix in="SourceGraphic" type="matrix" :values="matrix" color-interpolation-filters="sRGB" />
      </filter>
      <clipPath id="circleClip" clipPathUnits="objectBoundingBox">
        <circle cx="0.5" cy="0.5" r="0.4" />
      </clipPath>
    </defs>

    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <MapSystem :nodeId="nodeId" :scale="scale" :config="config" :slotProps="slotProps" :graph="graph" />
    </template>

    <template #fleets="{ scale }">
      <MapFleets :mapScale="MAP_SCALE" :nodeRadius="NODE_RADIUS" :scale="scale" />
    </template>
  </v-network-graph>
</template>
