<script lang="ts" setup>
defineProps<{
  loading: boolean,
}>()

defineEmits(['click'])
</script>

<template>
  <div class="d-inline">
    <v-progress-circular v-bind="$attrs" v-if="loading" class="button-sized" indeterminate />
    <v-btn v-bind="$attrs" v-else class="ma-2" variant="text" icon="mdi-refresh" @click="$emit('click')" />
  </div>
</template>

<style scoped>
.button-sized {
  margin: 16px;
}
</style>
