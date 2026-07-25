<template>
  <v-col :cols="portrait ? '' : cols"
    :style="portrait ? 'max-width: 100%; min-width: fit-content' : ''">
    <v-card flat
      tile
      :color="color"
      :variant="<any>variant"
      style="height: 100%;"
      :style="portrait ? 'max-width: 100%; min-width: fit-content' : ''"
      class="pa-1">

      <v-row dense>
        <v-col cols="auto">
          <v-tooltip max-width="400">
            <template #activator="{ props }">
              <v-icon :icon="icon"
                v-bind="props"
                start
                size="40" />
            </template>
            <div class="heading h3">{{ displayName }}</div>
            <v-divider class="my-2" />
            <div v-html-safe="glossary" />
          </v-tooltip>
        </v-col>
        <v-col class="heading h3">
          <span>{{ displayName }}</span>
          <div v-if="isNaN(Number(value)) && value !== '½'"
            class="text-accent"
            style="font-size: 16px;">
            {{ value }}
          </div>
          <span v-else
            class="pl-4 heading text-accent"
            :class="!portrait && 'h2'">
            {{ value }}
          </span>
        </v-col>
      </v-row>
    </v-card>


  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { glossary as glossaryData } from '@massif/lancer-data'
import { isArray } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { t, te } = useI18n()
const { xs, smAndDown } = useDisplay()

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
  variant: 'elevated',
})

const portrait = computed(() => xs.value)
const isInline = computed(() => props.inline || smAndDown.value)
const isArrayVal = computed(() => isArray(props.value))

const statKeyMap: Record<string, string> = {
  Structure: 'stats.structure',
  HP: 'stats.hp',
  Armor: 'stats.armor',
  Stress: 'stats.stress',
  'Heat Capacity': 'ui.titles.heatCapacity',
  Evasion: 'stats.evasion',
  Speed: 'stats.speed',
  'E-Defense': 'stats.edefense',
  'Tech Attack': 'common.techAttack',
  Sensors: 'stats.sensors',
  'Repair Capacity': 'ui.titles.repairCapacity',
  'Save Target': 'ui.titles.saveTarget',
  'System Points': 'common.systemPoints',
}

const displayName = computed(() => {
  const key = statKeyMap[props.name]
  return key && te(key) ? t(key) : props.name
})

const glossary = computed(() => {
  let name = props.name.toLowerCase()
  if (name === 'e-def') name = 'e-defense'
  const n = glossaryData.find((x) => x.name.toLowerCase() === name.toLowerCase())
  return n ? n.description : 'MISSING ' + props.name
})
</script>
