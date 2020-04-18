<template>
  <v-col :cols="cols">
    <fieldset class="mx-1">
      <legend class="flavor-text black--text ml-1" style="font-size: 13px">
        &nbsp;{{ label }}&nbsp;
      </legend>
      <div :style="`min-height: ${height}px`" />
    </fieldset>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'single-blank',
  props: {
    label: {
      type: String,
      required: true,
    },
    height: {
      type: [Number, String],
      required: false,
      default: '40',
    },
    cols: {
      type: [Number, String, Boolean],
      required: false,
      default: false,
    },
  },
})
</script>

<style scoped>
fieldset {
  border-radius: 3px;
}
</style>
