<script lang="ts" setup>
import { useAppStore } from '@/store/app'

export interface TransferTarget {
  type: 'station' | 'new-fleet' | 'fleet'
  id: string
}

const props = defineProps<{
  modelValue: TransferTarget
  options: TransferTarget[]
}>()

const emit = defineEmits(['update:modelValue'])
const updateValue = (value: TransferTarget) => emit('update:modelValue', value)

const store = useAppStore()

const getTitle = (el: TransferTarget) => {
  if (el.type === 'station') return `${store.getSystemById(el.id)?.name} Station`
  if (el.type === 'new-fleet') return 'New Fleet'
  if (el.type === 'fleet') return store.getFleetName(el.id)
}
const getSubTitle = (el: TransferTarget) => {
  if (el.type === 'station') return el.id
  if (el.type === 'new-fleet') return ''
  if (el.type === 'fleet') return el.id
}
const getIcon = (el: TransferTarget) => {
  if (el.type === 'station') return 'space-station'
  if (el.type === 'new-fleet') return 'plus'
  if (el.type === 'fleet') return store.getFleetIcon(el.id).icon
}
const getColor = (el: TransferTarget) => {
  if (el.type === 'station') return 'lime'
  if (el.type === 'new-fleet') return 'white'
  if (el.type === 'fleet') return store.getFleetColor(el.id)
}

</script>

<template>
  <v-select v-bind="props" :items="options" :model-value="modelValue" @update:model-value="(value) => updateValue(value)"
    hide-details>

    <template v-slot:item="{ props: slotProps, item }">
      <v-list-item v-bind="slotProps" :key="item.raw.id" :value="item.raw.id" :title="getTitle(item.raw)"
        :subtitle="getSubTitle(item.raw)">
        <template v-slot:prepend>
          <v-icon style="opacity: 1" :icon="`mdi-${getIcon(item.raw)}`" :color="getColor(item.raw)" />
        </template>
      </v-list-item>
    </template>

    <template v-slot:selection="{ item }">
      <v-list-item :key="item.raw.id" :value="item.raw.id" :title="getTitle(item.raw)" :subtitle="getSubTitle(item.raw)">
        <template v-slot:prepend>
          <v-icon style="opacity: 1" :icon="`mdi-${getIcon(item.raw)}`" :color="getColor(item.raw)" />
        </template>
      </v-list-item>
    </template>

  </v-select>
</template>
