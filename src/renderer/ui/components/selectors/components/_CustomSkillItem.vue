<template>
  <v-card tile>
    <div class="centered text-xs-left pl-3">
      <v-chip v-if="bonus" dark color="primary" small outline>
        <b>+ {{ bonus }}</b>
      </v-chip>
      <span class="subheading font-weight-bold">{{ skill.Trigger }}</span>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'skill-item',
  props: {
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
    skill: {
      type: Object,
      required: true,
    },
  },
})
</script>