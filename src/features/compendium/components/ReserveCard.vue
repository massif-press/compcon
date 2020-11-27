<template>
  <v-col lg="4" md="6" sm="12">
    <cc-titled-panel :title="reserve.Name" :icon="reserve.Icon" :color="reserve.Color">
      <v-card-text class="text-xs-left mt-0 pt-0" style="height: 115px">
        <div class="overline subtle--text mt-n2 mb-n1">{{ reserve.Type }}</div>
        <p class="flavor-text mb-0" v-html="reserve.Description" />
      </v-card-text>
    </cc-titled-panel>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'reserve-card',
  props: {
    reserve: {
      type: Object,
      required: true,
    },
  },
})
</script>
