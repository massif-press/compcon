<template>
  <v-tooltip top>
    <v-chip close @input="remove" outline :color="invoke.accuracy ? 'primary' : 'error'" slot="activator">
      <v-avatar>
        <v-icon v-if="invoke.accuracy">cc-accuracy</v-icon>
        <v-icon v-else>cc-difficulty</v-icon>
      </v-avatar>
      {{invoke.trigger}}
    </v-chip>
    <span v-if="invoke.accuracy">+1 Accuracy</span>
    <span v-else>+1 Difficulty</span>
  </v-tooltip>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'invocation-item',
    props: {
      invoke: Object,
      index: Number
    },
    methods: {
      remove: function () {
        this.$emit('remove-invoke', this.index)
      }
    }  
  })
</script>