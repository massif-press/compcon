<template>
  <v-col :cols="portrait ? 12 : cols">
    <v-tooltip max-width="400">
      <template #activator="{ props }">
        <v-card v-bind="props"
          flat
          tile
          :color="color"
          :variant="<any>variant"
          class="h-100"
          :class="portrait ? 'px-2' : 'text-center px-2'">
          <div v-if="portrait"
            class="d-flex align-center py-1">
            <v-icon :icon="icon"
              size="28"
              class="mr-2" />
            <span class="heading h3 flex-grow-1 text-left">{{ name }}</span>
            <span class="pl-2 heading text-accent text-right">{{ value }}</span>
          </div>
          <div v-else
            class="heading h3 py-1">
            <v-icon :icon="icon"
              start
              size="40"
              class="mb-n2" />
            <div>
              <span>{{ name }}</span>
              <div v-if="isNaN(Number(value)) && value !== '½'"
                class="text-accent"
                style="font-size: 16px;">
                {{ value }}
              </div>
              <span v-else
                class="pl-2 heading text-accent h2">
                {{ value }}
              </span>
            </div>
          </div>
        </v-card>
      </template>
      <div class="heading h3">{{ name }}</div>
      <v-divider class="my-2" />
      <div v-html-safe="glossary" />
    </v-tooltip>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { glossary as glossaryData } from '@massif/lancer-data';

const _display = useDisplay()

const props = withDefaults(defineProps<{
  name: string
  icon: string
  value: string | number | any[]
  cols?: string | number
  inline?: boolean
  color?: string
  variant?: string
}>(), {
  cols: '',
  color: 'light-panel',
  variant: 'elevated'
})

const portrait = computed(() => {
      return _display.xs.value;
    })
const isInline = computed(() => {
      return props.inline || _display.smAndDown.value;
    })
const glossary = computed(() => {
      let name = props.name.toLowerCase();
      if (name === 'e-def') name = 'e-defense'
      const n = glossaryData.find((x) => x.name.toLowerCase() === name.toLowerCase());
      return n ? n.description : 'MISSING ' + props.name;
    })
</script>
