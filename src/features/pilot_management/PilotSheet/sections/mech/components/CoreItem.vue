<template>
  <div class="px-3">
    <h2 class="heading" :style="`color: ${color}`">{{ coreSystem.Name }}</h2>
    <div class="mx-3">
      <p
        v-if="coreSystem.Description"
        class="flavor-text panel clipped pa-2 mx-2"
        v-html="coreSystem.Description"
      />
      <v-alert
        v-if="coreSystem.PassiveName"
        prominent
        outlined
        dense
        :color="color"
        border="left"
        icon="mdi-circle-expand"
      >
        <h3 class="heading" :style="`color: ${color}`">
          {{ coreSystem.PassiveName }}
          <span class="subtle--text" style="font-size: 14px">(PASSIVE)</span>
        </h3>
        <p class="body-text text--text" v-html="coreSystem.PassiveEffect" />
      </v-alert>
      <v-alert prominent text dense tile :color="color" border="left" icon="cci-corebonus">
        <h3 class="heading" :style="`color: ${color}`">
          {{ coreSystem.ActiveName }}
          <span class="subtle--text text--darken-2" style="font-size: 14px">(ACTIVE)</span>
        </h3>
        <p class="body-text text--text" v-html="coreSystem.ActiveEffect" />
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
