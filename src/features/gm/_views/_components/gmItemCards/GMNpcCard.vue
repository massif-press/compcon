<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-card :elevation="hover ? 12 : 0" :outlined="!hover">
      <v-img :aspect-ratio="1" src="../../../../static/img/misc/combat.jpg">
        <v-fade-transition>
          <div
            v-if="hover"
            class="d-flex text-center primary darken-2 v-card--reveal heading h2 white--text"
            style="height: 100%"
          >
            stats
            <br />
            features
            <br />
            notes
          </div>
        </v-fade-transition>
      </v-img>
      <v-card-text class="py-2 text-center" style="position: relative">
        <div class="body-text" :class="hover ? 'primary--text' : ''">tier - class</div>
        <div class="heading h2" :class="hover ? 'primary--text' : ''">name</div>
        <div class="body-text" :class="hover ? 'primary--text' : ''">
          template
          <br />
          tags
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-item-card',
  props: {
    item: { type: Object, required: true },
  },
})
</script>