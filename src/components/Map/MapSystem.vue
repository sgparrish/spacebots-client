<script lang="ts" setup>
import { getResourceIconUrl } from '@/utils'

defineProps<{
  nodeId: string
  scale: number
  config: any
  slotProps: any

  graph: any
}>()
</script>
<template>
  <image v-if="graph.nodes[nodeId].resource" :x="config.radius * scale * -1.2" :y="config.radius * scale * -1.2"
    :width="config.radius * scale * 2.4" :xlink:href="getResourceIconUrl(graph.nodes[nodeId].resource)"
    :fill="graph.nodes[nodeId].color" :filter="`url(#${graph.nodes[nodeId].resource})`" clip-path="url(#circleClip)"
    v-bind="slotProps" />
  <template v-else-if="graph.nodes[nodeId].station">
    <circle :r="config.radius * scale" :fill="graph.nodes[nodeId].color" v-bind="slotProps" />
    <text font-family="Material Design Icons" :font-size="config.radius * 1.6 * scale" fill="black" text-anchor="middle"
      dominant-baseline="central" style="pointer-events: none" v-html="'\u{F1383}'" />
  </template>
  <circle v-else :r="config.radius * scale * 0.75" :fill="config.color" v-bind="slotProps" />
</template>
