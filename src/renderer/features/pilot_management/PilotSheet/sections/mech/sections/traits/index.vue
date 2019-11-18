<template>
  <v-col>
    <cc-title small :color="color">
      {{ mech.Frame.Source }} {{ mech.Frame.Name }} Frame Traits
    </cc-title>
    <v-row>
      <v-col>
        <trait-item
          v-for="(t, index) in mech.Frame.Traits"
          :key="'trait_' + index + t.name"
          :trait="t"
          :color="color"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import TraitItem from './TraitItem.vue'

export default Vue.extend({
  name: 'license-requirements-block',
  components: { TraitItem },
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
