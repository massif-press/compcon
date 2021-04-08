<template>
  <component
    :is="type"
    :selectable="selectable"
    :rank="rank"
    :can-add="canAdd"
    :talent="talent"
    @expand="expand = $event"
    @clicked="$emit('clicked')"
    @add="$emit('add')"
    @remove="$emit('remove')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import TalentMicro from './components/_TalentMicro.vue'
import TalentSmall from './components/_TalentSmall.vue'
import TalentTerse from './components/_TalentTerse.vue'
import TalentFull from './components/_TalentFull.vue'

export default Vue.extend({
  name: 'talent',
  components: {
    TalentMicro,
    TalentSmall,
    TalentTerse,
    TalentFull,
  },
  props: {
    talent: { type: Object, required: true },
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
  watch: {
    small() {
      this.expand = ''
    },
    terse() {
      this.expand = ''
    },
  },
  computed: {
    type() {
      if (this.expand === 'full') return TalentFull
      if (this.expand === 'terse') return TalentTerse
      if (this.micro) return TalentMicro
      if (this.small) return TalentSmall
      if (this.terse) return TalentTerse
      return TalentFull
    },
  },
})
</script>