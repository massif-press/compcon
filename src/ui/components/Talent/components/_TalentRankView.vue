<template>
  <cc-panel icon="cc:talent" :title="talent.Name" title-color="primary">
    <v-row v-for="n in rank" :key="`rank-${n}`" dense>
      <v-col cols="auto" style="position: relative">
        <v-icon>cc:rank_{{ n }}</v-icon>
      </v-col>
      <v-col>
        <talent-rank-contents :talent-rank="talent.Rank(n)" hide-actions />
      </v-col>
    </v-row>
    <slot name="combat" />
  </cc-panel>
</template>

<script setup lang="ts">
import type { Talent } from '@/classes/pilot/components/talent/Talent'
import { computed, ref } from 'vue'
import TalentEmblem from './_TalentEmblem.vue';
import TalentRankContents from './_TalentRankContents.vue';
import { useMobile } from '@/composables/useMobile';

defineOptions({ name: 'talent-full' })

const { mobile, portrait } = useMobile()

const props = withDefaults(defineProps<{
  hideLocked?: boolean
  talent: Talent
  selectable?: boolean
  canAdd?: boolean
  hideChange?: boolean
  hideTitle?: boolean
  inColumn?: boolean
  rank?: number | string
}>(), {
  rank: null
})

const emit = defineEmits<{
  'expand': []
  'add': []
  'remove': []
}>()

const showAll = ref(false)

const showFull = computed(() => {
      if (props.hideLocked) return showAll.value;
      return true;
    })
</script>
