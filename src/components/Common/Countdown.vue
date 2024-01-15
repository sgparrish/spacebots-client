<script lang="ts" setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ref, computed, onUnmounted } from 'vue'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const props = defineProps<{
  prefix: string
  complete: string
}>()

let rafHandle = 0
const parsedCompleted = computed(() => dayjs(props.complete))
const text = ref('')

const update = () => {
  const diff = parsedCompleted.value.diff()
  const period = dayjs.duration(diff)

  const periodDays = period.asDays()
  const intDays = Math.floor(periodDays)

  if (periodDays < 0) {
    text.value = `${props.prefix} 00:00:00`
  } else {
    text.value = `${props.prefix} ${intDays > 0 ? intDays + 'd ' : ''}${period.format('HH:mm:ss')}`
    rafHandle = requestAnimationFrame(update)
  }
}

update()

onUnmounted(() => {
  cancelAnimationFrame(rafHandle)
})
</script>

<template>
  <span>{{ text }}</span>
</template>
