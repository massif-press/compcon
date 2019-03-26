<template>
  <div>
    <v-tooltip top>
      <v-chip close @input="remove" outline :color="invoke.accuracy ? 'primary' : 'error'" slot="activator">
        <v-avatar>
        <v-icon small v-if="invoke.accuracy">thumb_up</v-icon>
        <v-icon small v-else>thumb_down</v-icon>
        </v-avatar>
        {{invoke.trigger}}
      </v-chip>
      <span v-if="invoke.accuracy">+1 Accuracy</span>
      <span v-else>+1 Difficulty</span>
    </v-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'invocation-item',
    props: {
      'invoke': Object,
      'index': Number
    },
    methods: {
      remove: function () {
        this.$emit('remove-invoke', this.index)
      }
    }
  }
</script>
