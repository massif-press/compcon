<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :elevation="isHovering ? 12 : 0"
        :variant="isHovering ? 'outlined' : 'flat'"
        height="100%"
        style="position: relative"
        @click="$emit('open', item)">
        <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" />
        <v-fade-transition>
          <v-card
            v-if="isHovering"
            style="position: absolute; bottom: 0; left: 0; right: 0"
            class="pa-2 text-center">
            <div class="heading">{{ item.Name }}</div>
          </v-card>
        </v-fade-transition>
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'gm-eidolon-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: Object, required: false, default: '' },
  },
  emits: ['open'],
};
</script>
