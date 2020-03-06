<template>
  <div :class="`pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <div v-if="effect.Options && effect.Options.length" class="flavor-text">
      Gain the following {{ effect.OptionSet }} options:
    </div>
    <div
      v-if="effect.Detail && effect.Options && effect.Options.length"
      class="body-text"
      v-html="effect.Detail"
    />
    <v-alert
      v-for="o in effect.Options"
      :key="o.Name"
      dense
      outlined
      :color="color"
      class="py-0 mx-3"
    >
      <v-row dense align="center" class="mt-n2">
        <v-col cols="auto">
          <v-icon x-large :color="color" class="ml-n2">
            mdi-console-network
          </v-icon>
        </v-col>
        <v-col>
          <span class="overline mb-n4">
            {{ o.Activation }} Tech
            <cc-slashes />
            INVADE
          </span>
          <div class="effect-text mt-n2">
            {{ o.Name }}
          </div>
          <p class="body-text mt-n1 mb-1" v-html="o.Detail" />
        </v-col>
      </v-row>
    </v-alert>
    <v-alert
      v-if="!effect.Options || !effect.Options.length"
      dense
      outlined
      :color="color"
      class="py-0 mx-3 mb-0"
    >
      <v-row dense align="center" class="mt-n2">
        <v-col cols="auto">
          <v-icon x-large :color="color" class="ml-n2">
            mdi-console-network
          </v-icon>
        </v-col>
        <v-col>
          <span class="overline mb-n4">{{ effect.Activation }} Tech</span>
          <div v-if="effect.Name" class="effect-text mt-n2">
            {{ effect.Name }}
          </div>
          <p class="body-text mt-n1 mb-1" v-html="effect.Detail" />
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-tech-effect',
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'action--tech',
    },
    inset: {
      type: Boolean,
    },
    transparent: { type: Boolean },
  },
})
</script>
