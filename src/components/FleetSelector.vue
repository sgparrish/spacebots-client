<script lang="ts" setup>
import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'

const props = defineProps<{
  modelValue: Fleet
  fleets: Fleet[]
}>()

const emit = defineEmits(['update:modelValue'])
const updateValue = (value: Fleet) => emit('update:modelValue', value)

const store = useAppStore()

const getFleetName = (id: string) => (id === '' ? 'New Fleet' : store.getFleetName(id))
const getFleetIcon = (id: string) => (id === '' ? { icon: 'plus' } : store.getFleetIcon(id))
const getFleetColor = (id: string) => (id === '' ? 'white' : store.getFleetColor(id))
</script>

<template>
  <v-select v-bind="props" :items="fleets" :model-value="modelValue" @update:model-value="(value) => updateValue(value)"
    hide-details>
    <template v-slot:item="{ props: slotProps, item }">
      <v-list-item v-bind="slotProps" :key="item.raw.id" :value="item.raw.id" :title="getFleetName(item.raw.id)"
        :subtitle="item.raw.id">
        <template v-slot:prepend>
          <v-icon style="opacity: 1" :icon="`mdi-${getFleetIcon(item.raw.id).icon}`"
            :color="getFleetColor(item.raw.id)" />
        </template>
      </v-list-item>
    </template>
    <template v-slot:selection="{ item }">
      <v-list-item :key="item.raw.id" :value="item.raw.id" :title="getFleetName(item.raw.id)" :subtitle="item.raw.id">
        <template v-slot:prepend>
          <v-icon style="opacity: 1" :icon="`mdi-${getFleetIcon(item.raw.id).icon}`"
            :color="getFleetColor(item.raw.id)" />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
