<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-card
      :elevation="hover ? 12 : 0"
      :outlined="!hover"
      @click="$emit('open', item.ID)"
    >
      <v-img :aspect-ratio="1" :src="item.Image" />
      <v-card-text class="py-2 text-center" style="position: relative">
        <div
          :class="`${big ? 'heading h2' : 'body-text font-weight-bold'} ${
            hover ? 'text-primary' : ''
          }`"
        >
          {{ item.Name }}
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'gm-location-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
};
</script>
