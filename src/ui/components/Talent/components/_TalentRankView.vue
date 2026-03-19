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

<script lang="ts">
import TalentEmblem from './_TalentEmblem.vue';
import TalentRankContents from './_TalentRankContents.vue';
import { useMobile } from '@/mixins/useMobile';


export default {
  mixins: [useMobile],
  name: 'talent-full',
  components: { TalentEmblem, TalentRankContents },
  emits: ['expand', 'add', 'remove'],
  props: {
    hideLocked: { type: Boolean },
    talent: { type: Object, required: true },
    selectable: { type: Boolean },
    canAdd: { type: Boolean },
    hideChange: { type: Boolean },
    hideTitle: { type: Boolean },
    inColumn: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
  data: () => ({
    showAll: false,
  }),
  computed: {
    showFull() {
      if (this.hideLocked) return this.showAll;
      return true;
    },
  },
};
</script>
