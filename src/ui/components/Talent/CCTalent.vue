<template>
  <component :is="type"
    :selectable="selectable"
    :rank="rank"
    :can-add="canAdd"
    :hide-locked="hideLocked"
    :talent="talent"
    :in-column="inColumn"
    :hide-change="hideChange"
    :hide-title="hideTitle"
    :dark="dark"
    @expand="expand = <string>$event"
    @clicked="$emit('clicked')"
    @add="$emit('add')"
    @remove="$emit('remove')">
    <template #combat>
      <slot name="combat" />
    </template>
  </component>
</template>

<script setup lang="ts">
import type { Talent } from '@/classes/pilot/components/talent/Talent'
import { computed, ref, watch } from 'vue'
import TalentMicro from './components/_TalentMicro.vue';
import TalentSmall from './components/_TalentSmall.vue';
import TalentTerse from './components/_TalentTerse.vue';
import TalentFull from './components/_TalentFull.vue';
import TalentRankView from './components/_TalentRankView.vue';

defineOptions({ name: 'Talent' })

const props = withDefaults(defineProps<{
  talent: Talent
  hideLocked?: boolean
  canAdd?: boolean
  micro?: boolean
  small?: boolean
  terse?: boolean
  rankView?: boolean
  selectable?: boolean
  inColumn?: boolean
  hideChange?: boolean
  hideTitle?: boolean
  rank?: number | string
  dark?: boolean
}>(), {
  rankView: false,
  rank: null,
  dark: false
})

const emit = defineEmits<{
  'expand': []
  'clicked': []
  'add': []
  'remove': []
}>()

const expand = ref('')

const type = computed(() => {
      if (props.rankView) return TalentRankView;
      if (expand.value === 'full') return TalentFull;
      if (expand.value === 'terse') return TalentTerse;
      if (props.micro) return TalentMicro;
      if (props.small) return TalentSmall;
      if (props.terse) return TalentTerse;
      return TalentFull;
    })
</script>
