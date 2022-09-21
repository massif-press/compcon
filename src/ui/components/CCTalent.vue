<template>
  <component
    :is="type"
    :selectable="selectable"
    :rank="rank"
    :can-add="canAdd"
    :hide-locked="hideLocked"
    :item="talent"
    @expand="expand = $event"
    @clicked="$emit('clicked')"
    @add="$emit('add')"
    @remove="$emit('remove')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import TalentMicro from './cards/talent/_TalentMicro.vue'
import TalentSmall from './cards/talent/_TalentSmall.vue'
import TalentTerse from './cards/talent/_TalentTerse.vue'
import TalentCard from './cards/_TalentCard.vue'

export default Vue.extend({
  name: 'talent',
  components: {
    TalentMicro,
    TalentSmall,
    TalentTerse,
    TalentCard,
  },
  props: {
    talent: { type: Object, required: true },
    hideLocked: { type: Boolean },
    canAdd: { type: Boolean },
    micro: { type: Boolean },
    small: { type: Boolean },
    terse: { type: Boolean },
    selectable: { type: Boolean },
    rank: { type: [Number, String], required: false, default: null },
  },
  data: () => ({
    expand: '',
  }),
  computed: {
    type() {
      if (this.expand === 'full') return TalentCard
      if (this.expand === 'terse') return TalentTerse
      if (this.micro) return TalentMicro
      if (this.small) return TalentSmall
      if (this.terse) return TalentTerse
      return TalentCard
    },
  },
  watch: {
    small() {
      this.expand = ''
    },
    terse() {
      this.expand = ''
    },
  },
})
</script>