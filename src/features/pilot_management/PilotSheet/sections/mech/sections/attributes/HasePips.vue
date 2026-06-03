<template>
  <div :class="mobile && 'd-inline-block mr-11'">
    <v-tooltip :text="`${attr.toUpperCase()}: ${val}`">
      <template #activator="{ props }">
        <span class="text-overline no-height ml-n1"
          v-bind="props">
          {{ attr }}
        </span>
      </template>
    </v-tooltip>
    <cc-synergy-display :location="attr"
      :mech="mech"
      class="d-inline" />
    <div class="mt-n2 ml-1">
      <span class="no-height">
        <v-icon v-for="n in val"
          :key="`filled-${n}`"
          size="small"
          :color="color"
          icon="mdi-hexagon" />
      </span>
      <span class="no-height">
        <v-icon v-for="n in 6 - val"
          :key="`empty-${n}`"
          size="small"
          color="grey"
          icon="mdi-hexagon-outline" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { ref } from 'vue'
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  mech: Mech
  attr: string
  val: number
  color?: string
}>(), {
  color: 'primary'
})

const maxHASE = ref(6)
</script>

<style scoped>
.no-height {
  line-height: 0;
}
</style>
