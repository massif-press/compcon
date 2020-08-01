<template>
  <div>
    <div v-for="o in action.options" :key="o.name" class="pr-2">
      <div :key="o.name" class="action--tech">
        <v-row dense align="center" class="px-2">
          <v-col cols="auto">
            <v-icon x-large color="white">
              cci-tech-quick
            </v-icon>
          </v-col>
          <v-col class="white--text">
            <!-- <div class="overline font-weight-bold mb-n2" v-html="`INVASION OPTION`" /> -->
            <div class="heading h3">
              <span class="text--disabled">INVASION OPTION / /</span>
              {{ o.name }}
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="rounded-border panel py-1 px-3">
        <div class="body-text mb-1" v-html="o.detail" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-quick-action',
  props: {
    action: {
      type: Object,
      required: true,
    },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>
