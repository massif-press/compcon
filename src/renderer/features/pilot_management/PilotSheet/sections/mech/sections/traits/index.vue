<template>
  <v-col>
    <cc-title small :color="color" class="mb-2">
      {{ mech.Frame.Source }} {{ mech.Frame.Name }} Frame Traits
    </cc-title>
    <cc-trait-item
      v-for="(t, index) in mech.Frame.Traits"
      :key="'trait_' + index + t.name"
      :trait="t"
      :color="color"
    />
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'license-requirements-block',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
