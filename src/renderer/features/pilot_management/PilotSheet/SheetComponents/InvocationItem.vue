<template>
  <v-tooltip top>
    <v-chip close @input="remove" outline :color="invoke.IsAdvantage ? 'primary' : 'error'" slot="activator">
      <v-avatar>
        <v-icon v-if="invoke.IsAdvantage">cc-accuracy</v-icon>
        <v-icon v-else>cc-difficulty</v-icon>
      </v-avatar>
      {{invoke.Trigger}}
    </v-chip>
    <span v-if="invoke.IsAdvantage">+1 Accuracy</span>
    <span v-else>+1 Difficulty</span>
  </v-tooltip>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Invocation } from '@/class';

  export default Vue.extend({
    name: 'invocation-item',
    props: {
      invoke: Invocation,
      index: Number
    },
    methods: {
      remove: function () {
        this.$emit('remove-invoke', this.index)
      }
    }  
  })
</script>