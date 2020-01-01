<template>
  <v-col>
    <cc-title small :color="color">Licenses Required</cc-title>
    <v-row>
      <v-col>
        <requirement-item
          v-for="(l, index) in mech.RequiredLicenses"
          :key="'req_' + index + mech.ActiveLoadout.ID"
          :license="l"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import RequirementItem from './RequirementItem.vue'

export default Vue.extend({
  name: 'license-requirements-block',
  components: { RequirementItem },
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
