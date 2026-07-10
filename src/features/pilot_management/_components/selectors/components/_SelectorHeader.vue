<template>
  <v-row align="center"
    no-gutters>
    <v-col cols="auto"
      class="pr-3">
      <v-chip tile
        :color="complete ? 'success' : 'accent'">
        <v-icon v-if="complete"
          icon="mdi-check"
          start />
        <span class="heading h4">{{ current }}/{{ max }}</span>
      </v-chip>
    </v-col>
    <v-col v-if="complete"
      cols="auto"
      class="pr-3 text-cc-overline text-success">
      {{ completeText }}
    </v-col>
    <v-col v-if="!smAndDown"
      class="text-right">
      <slot />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

defineProps<{
  current: number
  max: number
  complete: boolean
  completeText: string
}>()

const { smAndDown } = useDisplay()
</script>
