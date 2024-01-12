<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: number
    min: number
    max: number
    splitMode?: boolean
    readonly?: boolean
    color?: string
  }>(),
  {
    splitMode: false,
    readonly: false,
    color: undefined,
  },
)

const emit = defineEmits(['update:modelValue'])

const updateValue = (value: number) =>
  emit('update:modelValue', Math.min(Math.max(props.min, value), props.max))
</script>

<template>
  <div :class="`slider-input${color ? ' text-' + color : ''}`">
    <v-slider :model-value="modelValue" @update:model-value="(value) => updateValue(value)" class="align-center"
      :min="min" :max="max" step="1" hide-details :readonly="readonly" :color="color"
      :show-ticks="max - min <= 30 ? 'always' : undefined" :style="readonly ? 'pointer-events: none;' : undefined">
      <template v-slot:prepend>
        <v-btn v-if="!readonly" variant="tonal" class="ma-1" slim size="x-small" :text="`${splitMode ? 'all' : 'none'}`"
          @click="updateValue(min)" />
        <v-text-field v-if="splitMode && !readonly" :model-value="max - modelValue"
          @update:model-value="(value) => updateValue(max - (Number.parseInt(value) || 0))" single-line hide-details
          density="compact" type="number" style="min-width: 120px" />
        <slot name="unit"></slot>
        <div v-if="readonly" class="text-body-1">{{ max - modelValue }}</div>
      </template>
      <template v-slot:append>
        <slot name="unit"></slot>
        <div v-if="readonly" class="text-body-1">{{ modelValue }}</div>
        <v-text-field v-if="!readonly" :model-value="modelValue"
          @update:model-value="(value) => updateValue(Number.parseInt(value) || 0)" single-line hide-details
          density="compact" type="number" style="min-width: 120px" />
        <v-btn v-if="!readonly" variant="tonal" class="ma-1" slim size="x-small" text="all" @click="updateValue(max)" />
      </template>
    </v-slider>
  </div>
</template>
