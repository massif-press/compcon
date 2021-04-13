<template>
  <v-card-text :class="$vuetify.breakpoint.smAndDown ? 'px-0' : ''">
    <div>
      <div v-if="action.Damage || action.Range" class="my-2">
        <v-row dense justify="space-around" align="center">
          <v-col cols="auto">
            <cc-range-element :range="action.Range" />
          </v-col>
          <v-col cols="auto">
            <cc-damage-element :damage="action.Damage" />
          </v-col>
        </v-row>
        <v-divider class="my-1" />
      </div>
      <div v-if="action.Init" class="body-text stark--text mt-2" v-html-safe="action.Init" />
      <div v-if="action.Trigger">
        <div class="subtle--text overline mb-n2">Trigger</div>
        <div class="body-text stark--text" v-html-safe="action.Trigger" />
      </div>
      <div v-if="action.Detail">
        <div class="subtle--text overline mb-n2">Effect</div>
        <div class="body-text stark--text" v-html-safe="action.Detail" />
      </div>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'action-base',
  props: {
    action: {
      type: Object,
      required: true,
    },
  },
})
</script>
