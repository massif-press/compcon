<template>
  <component
    :is="type"
    :selectable="selectable"
    :rank="rank"
    :can-add="canAdd"
    :hide-locked="hideLocked"
    :talent="talent"
    :in-column="inColumn"
    :hide-change="hideChange"
    :hide-title="hideTitle"
    @expand="expand = <string>$event"
    @clicked="$emit('clicked')"
    @add="$emit('add')"
    @remove="$emit('remove')">
    <template #combat>
      <slot name="combat" />
    </template>
  </component>
</template>

<script lang="ts">
import TalentMicro from './components/_TalentMicro.vue';
import TalentSmall from './components/_TalentSmall.vue';
import TalentTerse from './components/_TalentTerse.vue';
import TalentFull from './components/_TalentFull.vue';
import TalentRankView from './components/_TalentRankView.vue';

export default {
  name: 'talent',
  components: {
    TalentMicro,
    TalentSmall,
    TalentTerse,
    TalentFull,
    TalentRankView,
  },
  props: {
    talent: { type: Object, required: true },
    hideLocked: { type: Boolean },
    canAdd: { type: Boolean },
    micro: { type: Boolean },
    small: { type: Boolean },
    terse: { type: Boolean },
    rankView: { type: Boolean, default: false },
    selectable: { type: Boolean },
    inColumn: { type: Boolean },
    hideChange: { type: Boolean },
    hideTitle: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
  emits: ['expand', 'clicked', 'add', 'remove'],
  data: () => ({
    expand: '',
  }),
  computed: {
    type() {
      if (this.rankView) return TalentRankView;
      if (this.expand === 'full') return TalentFull;
      if (this.expand === 'terse') return TalentTerse;
      if (this.micro) return TalentMicro;
      if (this.small) return TalentSmall;
      if (this.terse) return TalentTerse;
      return TalentFull;
    },
  },
  watch: {
    small() {
      this.expand = '';
    },
    terse() {
      this.expand = '';
    },
  },
};
</script>
