<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-row dense :class="`elevation-${hover ? '12' : '0'}`" @click="$emit('open')">
      <v-col cols="1">
        <v-card>
          <v-img :aspect-ratio="1" :src="item.Image" />
        </v-card>
      </v-col>
      <v-col>
        <div :class="`heading h3 ${hover ? 'accent--text' : ''}`">{{ item.Name }}</div>
        <div>
          "{{ item.Alias }}"
          <cc-slashes v-if="item.Alias && item.Title" />
          {{ item.Title }}
        </div>
        <v-chip
          v-for="l in item.Labels"
          :key="`${item.ID}_label_${l}`"
          small
          color="primary"
          label
          :outlined="!hover"
          class="mr-2"
        >
          {{ l }}
        </v-chip>
      </v-col>
    </v-row>
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
