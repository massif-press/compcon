<template>
  <v-chip label variant="outlined" :color="item.Color" dark>
    <v-menu
      open-on-hover
      open-delay="500ms"
      offset-y
      top
      close-on-click
      close-on-content-click
    >
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <v-icon icon="cc:{{ $_.kebabCase(item.ItemType) }}" />
          <span class="heading h3 px-2 mt-n1">{{ item.Name }}</span>
        </div>
      </template>
      <cc-item-card :item="item" readonly active />
    </v-menu>
  </v-chip>
</template>

<script lang="ts">
export default {
  name: 'CCItemChip',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
