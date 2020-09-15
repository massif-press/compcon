<template>
  <v-alert outlined dense :color="action.Color" class="pb-0 ma-1">
    <v-row no-gutters>
      <v-col cols="auto">
        <v-icon left large dark class="mt-n2" color="subtle">{{ action.Icon }}</v-icon>
        <span class="heading h2 text--text">{{ action.Name }}</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-chip slot="title-items" color="white" small class="stat-text mr-2" outlined label>
          {{ action.Frequency.ToString() }}
        </v-chip>
        <v-chip small label :color="`action--${action.Activation.toLowerCase()}`">
          {{ action.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <action-base :action="action" class="mt-n6 mb-n2" />
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from './_actionBase.vue'

export default Vue.extend({
  name: 'action-panel',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
  },
})
</script>
