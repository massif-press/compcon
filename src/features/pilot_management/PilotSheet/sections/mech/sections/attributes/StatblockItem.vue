<template>
  <v-col class="text-center flavor-text">
    <v-card flat tile class="clipped" color="panel">
      <v-toolbar :color="color" class="heading h3" height="24">
        <contributor
          :label="attr"
          :value="signed ? (val > -1 ? '+' : '') + val : val"
          :contributors="contributors" />
      </v-toolbar>
      <v-card-text class="pa-0">
        <span class="text-text font-weight-black" style="font-size: 32px">
          {{ `${signed ? (val > -1 ? '+' : '-') : ''}${Math.abs(val)}` }}
        </span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Contributor from './Contributor.vue';

export default {
  name: 'statblock-item',
  components: { Contributor },
  props: {
    attr: { type: String, required: true },
    val: { type: Number, required: true },
    signed: { type: Boolean, required: false },
    contributors: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '#bdbdbd',
    },
  },
};
</script>
