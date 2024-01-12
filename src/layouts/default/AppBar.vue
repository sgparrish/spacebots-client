<script lang="ts" setup>
import { useAppStore } from '@/store/app'

const store = useAppStore()
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-robot" />
      Space Bots Client
    </v-app-bar-title>
    <template v-slot:append>
      <v-chip v-if="store.user" size="large" class="ma-2" prepend-icon="mdi-account-circle">
        {{ store.user?.name }}
      </v-chip>
      <v-chip v-if="store.user" size="large" class="ma-2" prepend-icon="mdi-currency-sign" color="light-green">
        {{ store?.user?.credits }}
      </v-chip>
      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>
</template>
