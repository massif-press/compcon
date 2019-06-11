<template>
  <v-flex grow>
    <v-hover>
      <v-card
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 10 : 1}`"
        :to="loc"
        height="13em"
        :color="color + (hover ? ' lighten-2' : '')"
      >
        <v-card-text class="text-xs-center">
          <v-icon size="5em" dark>{{ icon }}</v-icon>
        </v-card-text>
        <v-card-actions style="background-color: rgba(255,255,255,0.6)">
          &nbsp;
          <v-spacer />
          <span class="title font-weight-light pt-4 pb-4">{{ name }}</span>
          <v-spacer />
          &nbsp;
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'category-card',
  props: {
    icon: String,
    color: String,
    name: String,
    loc: String,
    size: Number,
  },
})
</script>
