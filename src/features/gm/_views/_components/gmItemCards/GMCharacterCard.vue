<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-card :elevation="hover ? 12 : 0" :outlined="!hover" @click="$emit('open')">
      <v-img :aspect-ratio="1" :src="item.Image" />
      <v-card-text class="py-2 text-center" style="position: relative">
        <div
          :class="
            `${big ? 'heading h2' : 'body-text font-weight-bold'} ${hover ? 'primary--text' : ''}`
          "
        >
          {{ item.Name }}
        </div>
        <div v-if="big" class="body-text" :class="hover ? 'primary--text' : ''">
          <span v-if="item.Alias">"{{ item.Alias }}"</span>
          <cc-slashes v-if="item.Alias && item.Title" />
          <span>{{ item.Title }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-character-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
})
</script>
