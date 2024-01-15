<script lang="ts" setup>
import { Fleet } from '@/api'
import { useAppStore } from '@/store/app'

const props = defineProps<{
  fleet: Fleet
  showUser?: boolean
  clickable?: boolean
}>()

const store = useAppStore()

const onClick = () => {
  if (props.clickable) {
    store.setSelectedFleet(props.fleet.id)
  }
}
</script>

<template v-slot:item="{ props: slotProps, item }">
  <v-list-item :key="fleet.id" :value="fleet.id" @click="onClick">
    <template v-slot:title>
      <v-list-item-title>
        {{ store.getFleetName(fleet.id) }}
      </v-list-item-title>
    </template>
    <template v-slot:subtitle>
      <v-list-item-subtitle>
        <code>{{ fleet.id }}</code>
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="showUser">
        <code>{{ fleet.owner.userId }}</code>
      </v-list-item-subtitle>
    </template>
    <template v-slot:prepend>
      <v-icon style="opacity: 1" :icon="`mdi-${store.getFleetIcon(fleet.id).icon}`"
        :color="store.getFleetColor(fleet.id)" />
    </template>
  </v-list-item>
</template>