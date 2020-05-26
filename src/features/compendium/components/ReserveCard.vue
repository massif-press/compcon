<template>
  <v-col lg="4" md="6" sm="12">
    <cc-titled-panel :title="reserve.name" icon="cci-barrage" :color="reserve.Color">
      <v-card-text class="text-xs-left py-2" style="height: 115px">
        <p class="flavor-text py-0" v-html="reserve.description" />
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
