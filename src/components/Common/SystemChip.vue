<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'

const props = defineProps<{
  systemId: string
  text?: string
}>()

const store = useAppStore()

const system = computed(() => store.getSystemById(props.systemId))
const color = computed(() => system.value ? store.getSystemColor(system.value) : undefined)
const click = () => store.setSelectedSystem(props.systemId)
</script>

<template>
  <v-chip v-bind="$attrs" :color="color" @click="click">
    {{ text }} {{ system?.name ?? systemId }}
  </v-chip>
</template>