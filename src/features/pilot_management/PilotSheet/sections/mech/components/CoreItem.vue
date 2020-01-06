<template>
  <div>
    <h2 class="heading" :style="`color: ${color}`">{{ coreSystem.Name }}</h2>
    <div class="mx-3">
      <p
        v-if="coreSystem.Description"
        class="flavor-text panel darken-1 clipped pa-2 mx-2"
        v-html="coreSystem.Description"
      />
      <v-alert
        v-if="coreSystem.Passive"
        prominent
        outlined
        dense
        :color="color"
        border="left"
        icon="mdi-circle-expand"
      >
        <h3 class="heading" :style="`color: ${color}`">Passive</h3>
        <span class="flavor-text text--text">{{ coreSystem.Passive }}</span>
      </v-alert>
      <v-alert prominent text dense tile :color="color" border="left" icon="cci-corebonus">
        <h3 class="heading" :style="`color: ${color}`">
          {{ coreSystem.Active }}
          <span class="grey--text" style="font-size: 14px">(ACTIVE)</span>
        </h3>
        <p class="flavor-text" v-html="coreSystem.Effect" />
        <cc-tags :tags="coreSystem.Tags" :color="color" small />
      </v-alert>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'core-item',
  props: {
    coreSystem: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
})
</script>
