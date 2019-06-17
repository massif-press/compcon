<template>
  <div class="ma-1">
    <v-card flat color="grey darken-3" class="ma-2">
      <v-card-text class="title text-xs-center pb-1 pt-2">
        <span class="caption text--capitalize">{{ cb.Name }}</span>
      </v-card-text>
      <v-card-text class="pb-0 pt-0">
        <p v-html="cb.MountedEffect" class="pl-2 effect-text" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemTag from './ItemTag.vue'
import { CoreBonus } from '@/class'

export default Vue.extend({
  name: 'core-bonus-card',
  props: {
    cb: CoreBonus,
  },
})
</script>
