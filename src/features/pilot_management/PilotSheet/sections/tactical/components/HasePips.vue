<template>
  <span class="text-uppercase stat-text">{{ title }}</span>
  <span class="flavor-text text--disabled pl-2">({{ skillPoints || 0 }})</span>
  <v-tooltip :text="tooltip()">
    <template #activator="{ props }">
      <span v-bind="props">
        <v-icon v-for="n in filled"
          :key="`filled-${n}`"
          v-if="filled"
          color="secondary"
          size="large"
          icon="mdi-hexagon" />
        <v-icon v-for="n in empty"
          :key="`empty-${n}`"
          v-if="empty"
          color="secondary"
          size="large"
          icon="mdi-hexagon-outline" />
      </span>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  skillPoints: number
}>()

const filled = computed(() => {
      return props.skillPoints;
    })
const empty = computed(() => {
      return 6 - filled.value;
    })

function tooltip() {
      switch (props.title) {
        case 'hull':
          return `MECH HP <b>+${props.skillPoints * 2}</b><br>REPAIR CAPACITY <b>+${Math.floor(
            props.skillPoints / 2
          )}</b>`;
        case 'agility':
          return `EVASION <b>+${props.skillPoints}</b><br>SPEED <b>+${Math.floor(
            props.skillPoints / 2
          )}</b>`;
        case 'systems':
          return `E-DEFENSE <b>+${props.skillPoints}</b><br>TECH ATTACK <b>+${props.skillPoints
            }</b><br>SP <b>+${Math.floor(props.skillPoints / 2)}</b>`;
        case 'engineering':
          return `HEAT CAPACITY <b>+${props.skillPoints
            }</b><br>LIMITED SYSTEMS BONUS <b>+${Math.floor(props.skillPoints / 2)}</b>`;
        default:
          return '';
      }
    }
</script>
